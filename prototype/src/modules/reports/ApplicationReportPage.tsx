import { useMemo, useState } from 'react';
import { Box, Button, Chip, MenuItem, Stack, TextField, Typography, Autocomplete } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';
import { Application } from '../../data/mock';

export function ApplicationReportPage() {
  const [applications] = usePersistentState<Application[]>('prototype:applications:rows', () => []);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [permissionTypes, setPermissionTypes] = useState<string[]>([]);
  const [permissionNames, setPermissionNames] = useState<string[]>([]);

  const nfiApps = useMemo(() => {
    return applications.filter(a => a.status === 'NFI');
  }, [applications]);

  const filtered = useMemo(() => {
    return nfiApps.filter(a => {
      if (permissionTypes.length > 0 && !permissionTypes.includes(a.type)) return false;
      if (permissionNames.length > 0 && !permissionNames.includes(a.type + ' - ' + a.zone.split(' ')[0])) return false;
      return true;
    });
  }, [nfiApps, permissionTypes, permissionNames]);

  const allTypes = Array.from(new Set(applications.map(a => a.type))).sort();
  const allNames = Array.from(new Set(applications.map(a => a.type + ' - ' + a.zone.split(' ')[0]))).sort();

  const exportCsv = () => {
    const header = 'Permit Reference,Surname,Forename,Address 1,Address 2,Address 3,Address 4,Postcode,UPRN,Date of Birth,Mobile,Email,Start Date,Expiry Date,Permit Type\n';
    const body = filtered.map(a => [
      a.ref,
      a.applicant.split(' ').slice(-1)[0],
      a.applicant.split(' ').slice(0, -1).join(' '),
      '12 High Street',
      'Market Quarter',
      'Stockport',
      a.zone,
      'SK1 3AZ',
      '100012345678',
      '01/01/1980',
      '07700 900123',
      a.applicant.toLowerCase().replace(/ /g, '.') + '@example.com',
      a.submitted,
      a.submitted,
      a.type,
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nfi-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const cols: GridColDef[] = [
    { field: 'ref', headerName: 'Permit Reference', width: 160 },
    { field: 'applicant', headerName: 'Applicant Name', flex: 1, minWidth: 180 },
    { field: 'type', headerName: 'Permit Type', width: 170 },
    { field: 'zone', headerName: 'Zone', width: 150 },
    { field: 'startDate', headerName: 'Start Date', width: 120 },
    { field: 'expiryDate', headerName: 'Expiry Date', width: 120 },
    { field: 'status', headerName: 'Status', width: 160,
      renderCell: (p) => <Chip size="small" label={p.value} variant="outlined" color="info" /> },
  ];

  return (
    <Box>
      <PageHeader eyebrow="Reports" title="Application NFI Report"
        description="No Further Information (NFI) applications — applications awaiting customer response."
        actions={
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportCsv}
                  disabled={filtered.length === 0}>Export CSV ({filtered.length})</Button>
        } />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} mb={2} flexWrap="wrap" useFlexGap>
        <TextField size="small" type="date" label="Start Date" InputLabelProps={{ shrink: true }}
                   value={startDate} onChange={e => setStartDate(e.target.value)} sx={{ minWidth: 180 }} />
        <TextField size="small" type="date" label="End Date" InputLabelProps={{ shrink: true }}
                   value={endDate} onChange={e => setEndDate(e.target.value)} sx={{ minWidth: 180 }} />
        <Autocomplete multiple size="small" options={allTypes} value={permissionTypes}
                      onChange={(_, v) => setPermissionTypes(v)}
                      renderInput={(p) => <TextField {...p} label="Permission Type" />}
                      sx={{ minWidth: 250 }} />
        <Autocomplete multiple size="small" options={allNames} value={permissionNames}
                      onChange={(_, v) => setPermissionNames(v)}
                      renderInput={(p) => <TextField {...p} label="Permission Name" />}
                      sx={{ minWidth: 250 }} />
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={1.5}>
        Showing <strong>{filtered.length}</strong> NFI application{filtered.length === 1 ? '' : 's'}
      </Typography>

      <Box sx={{ height: 600, bgcolor: 'background.paper', borderRadius: 1 }}>
        <DataGrid rows={filtered} columns={cols} getRowId={r => r.id} density="compact"
                  pageSizeOptions={[10, 25, 50, 100]}
                  initialState={{ pagination: { paginationModel: { pageSize: 25 } } }} />
      </Box>
    </Box>
  );
}
