import { useMemo, useState } from 'react';
import { Box, Button, Chip, MenuItem, Stack, Tab, Tabs, TextField, Typography, Autocomplete } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';
import { Application } from '../../data/mock';

type Payment = {
  id: string;
  appRef: string;
  firstName: string;
  lastName: string;
  permissionType: string;
  permissionName: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  amountPaid: number;
  transactionId: string;
  transactionDate: string;
  transactionType: 'Sale' | 'Refund';
  status: 'Paid';
  dieselSurcharge?: number;
  tierPrice?: number;
};

const PAYMENT_METHODS = ['Registered Card', 'Pay by New Card', 'Online After Approval', 'Wallet', 'Agent Assist', 'Pay on Collection', 'Postal Payment', 'Cost Center & Budget Code', 'Pay Monthly', 'Pay Quarterly'];

const seedPayments = (apps: Application[]): Payment[] => {
  return apps.filter(a => a.status === 'Active' || a.status === 'Approved').map((a, i) => ({
    id: `PAY-${a.id}`,
    appRef: a.ref,
    firstName: a.applicant.split(' ')[0],
    lastName: a.applicant.split(' ').slice(1).join(' '),
    permissionType: a.type,
    permissionName: a.type + ' - ' + a.zone.split(' ')[0],
    startDate: a.submitted,
    endDate: a.submitted,
    paymentMethod: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
    amountPaid: 120 + (i % 100),
    transactionId: `TXN-${Date.now()}-${i}`,
    transactionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    transactionType: i % 10 === 0 ? 'Refund' : 'Sale',
    status: 'Paid',
    dieselSurcharge: i % 3 === 0 ? 25 : undefined,
    tierPrice: 120 + (i % 5) * 20,
  }));
};

export function FinancialReportPage() {
  const [applications] = usePersistentState<Application[]>('prototype:applications:rows', () => []);
  const [tab, setTab] = useState<'income' | 'diesel'>('income');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [permissionTypes, setPermissionTypes] = useState<string[]>([]);
  const [permissionNames, setPermissionNames] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  const payments = useMemo(() => seedPayments(applications), [applications]);

  const filtered = useMemo(() => {
    let data = tab === 'diesel' ? payments.filter(p => p.dieselSurcharge !== undefined) : payments;
    return data.filter(p => {
      if (permissionTypes.length > 0 && !permissionTypes.includes(p.permissionType)) return false;
      if (permissionNames.length > 0 && !permissionNames.includes(p.permissionName)) return false;
      if (paymentMethods.length > 0 && !paymentMethods.includes(p.paymentMethod)) return false;
      return true;
    });
  }, [payments, tab, permissionTypes, permissionNames, paymentMethods]);

  const allTypes = Array.from(new Set(payments.map(p => p.permissionType))).sort();
  const allNames = Array.from(new Set(payments.map(p => p.permissionName))).sort();

  const totalAmount = useMemo(() => {
    return filtered.reduce((sum, p) => sum + (p.transactionType === 'Sale' ? p.amountPaid : -p.amountPaid), 0);
  }, [filtered]);

  const exportCsv = () => {
    const header = tab === 'income'
      ? 'App Reference,First Name,Last Name,Permission Type,Permission Name,Start Date,End Date,Payment Method,Amount Paid,Transaction ID,Transaction Date,Transaction Type,Status\n'
      : 'App Reference,First Name,Last Name,Permission Type,Permission Name,Diesel Surcharge,Band Price,Duration,Payment Method,Transaction Date,Amount,Status\n';
    const body = filtered.map(p => {
      if (tab === 'income') {
        return [p.appRef, p.firstName, p.lastName, p.permissionType, p.permissionName, p.startDate, p.endDate,
                p.paymentMethod, p.amountPaid, p.transactionId, p.transactionDate, p.transactionType, p.status]
          .map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
      } else {
        return [p.appRef, p.firstName, p.lastName, p.permissionType, p.permissionName, p.dieselSurcharge,
                p.tierPrice, '12 months', p.paymentMethod, p.transactionDate, p.amountPaid, p.status]
          .map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
      }
    }).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tab}-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const incomeCols: GridColDef<Payment>[] = [
    { field: 'appRef', headerName: 'App Reference', width: 150 },
    { field: 'firstName', headerName: 'First Name', width: 120 },
    { field: 'lastName', headerName: 'Last Name', width: 120 },
    { field: 'permissionType', headerName: 'Permission Type', width: 160 },
    { field: 'paymentMethod', headerName: 'Payment Method', width: 180 },
    { field: 'amountPaid', headerName: 'Amount', width: 100, type: 'number',
      renderCell: p => `£${p.value.toFixed(2)}` },
    { field: 'transactionDate', headerName: 'Transaction Date', width: 140 },
    { field: 'transactionType', headerName: 'Type', width: 100,
      renderCell: p => <Chip size="small" label={p.value} color={p.value === 'Sale' ? 'success' : 'warning'} variant="outlined" /> },
  ];

  const dieselCols: GridColDef<Payment>[] = [
    { field: 'appRef', headerName: 'App Reference', width: 150 },
    { field: 'firstName', headerName: 'First Name', width: 120 },
    { field: 'lastName', headerName: 'Last Name', width: 120 },
    { field: 'permissionType', headerName: 'Permission Type', width: 160 },
    { field: 'dieselSurcharge', headerName: 'Diesel Surcharge', width: 140, type: 'number',
      renderCell: p => `£${p.value.toFixed(2)}` },
    { field: 'tierPrice', headerName: 'Band Price', width: 120, type: 'number',
      renderCell: p => `£${p.value.toFixed(2)}` },
    { field: 'paymentMethod', headerName: 'Payment Method', width: 180 },
    { field: 'amountPaid', headerName: 'Total Amount', width: 130, type: 'number',
      renderCell: p => `£${p.value.toFixed(2)}` },
  ];

  return (
    <Box>
      <PageHeader eyebrow="Reports" title={tab === 'income' ? 'Financial Income Report' : 'Diesel Surcharge Report'}
        description={tab === 'income' 
          ? 'Detailed summary of all payments received.' 
          : 'Applications with diesel surcharge applied.'}
        actions={
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportCsv}
                  disabled={filtered.length === 0}>Export CSV ({filtered.length})</Button>
        } />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tab value="income" label="Income" />
        <Tab value="diesel" label="Diesel Surcharge" />
      </Tabs>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} mb={2} flexWrap="wrap" useFlexGap>
        <TextField size="small" type="date" label="Start Date" InputLabelProps={{ shrink: true }}
                   value={startDate} onChange={e => setStartDate(e.target.value)} sx={{ minWidth: 180 }} />
        <TextField size="small" type="date" label="End Date" InputLabelProps={{ shrink: true }}
                   value={endDate} onChange={e => setEndDate(e.target.value)} sx={{ minWidth: 180 }} />
        <Autocomplete multiple size="small" options={allTypes} value={permissionTypes}
                      onChange={(_, v) => setPermissionTypes(v)}
                      renderInput={(p) => <TextField {...p} label="Permission Type" />}
                      sx={{ minWidth: 220 }} />
        <Autocomplete multiple size="small" options={allNames} value={permissionNames}
                      onChange={(_, v) => setPermissionNames(v)}
                      renderInput={(p) => <TextField {...p} label="Permission Name" />}
                      sx={{ minWidth: 220 }} />
        {tab === 'income' && (
          <Autocomplete multiple size="small" options={PAYMENT_METHODS} value={paymentMethods}
                        onChange={(_, v) => setPaymentMethods(v)}
                        renderInput={(p) => <TextField {...p} label="Payment Method" />}
                        sx={{ minWidth: 240 }} />
        )}
      </Stack>

      <Stack direction="row" spacing={2} mb={1.5}>
        <Typography variant="body2" color="text.secondary">
          Showing <strong>{filtered.length}</strong> transaction{filtered.length === 1 ? '' : 's'}
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          Total: <span style={{ color: totalAmount >= 0 ? '#2e7d32' : '#d32f2f' }}>
            £{totalAmount.toFixed(2)}
          </span>
        </Typography>
      </Stack>

      <Box sx={{ height: 600, bgcolor: 'background.paper', borderRadius: 1 }}>
        <DataGrid rows={filtered} columns={tab === 'income' ? incomeCols : dieselCols} 
                  getRowId={r => r.id} density="compact"
                  pageSizeOptions={[10, 25, 50, 100]}
                  initialState={{ pagination: { paginationModel: { pageSize: 25 } } }} />
      </Box>
    </Box>
  );
}
