import { Box, Button, InputAdornment, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../shared/PageHeader';
import { StatusChip } from '../../shared/StatusChip';
import { applications } from '../../data/mock';

export function ApplicationsListPage() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');

  const rows = useMemo(() => applications.filter((a) =>
    (status === 'All' || a.status === status) &&
    (q === '' || a.ref.toLowerCase().includes(q.toLowerCase()) || a.applicant.toLowerCase().includes(q.toLowerCase()))
  ), [q, status]);

  const cols: GridColDef[] = [
    { field: 'ref', headerName: 'Reference', width: 160 },
    { field: 'applicant', headerName: 'Applicant', flex: 1, minWidth: 180 },
    { field: 'permission', headerName: 'Permission', flex: 1.4, minWidth: 220 },
    { field: 'zone', headerName: 'Zone', width: 160 },
    { field: 'submitted', headerName: 'Submitted', width: 130 },
    { field: 'amount', headerName: 'Amount', width: 100, valueFormatter: (v) => `£${v}` },
    { field: 'assignedTo', headerName: 'Assigned to', width: 140 },
    { field: 'status', headerName: 'Status', width: 170, renderCell: (p) => <StatusChip status={p.value} /> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Back Office"
        title="Applications"
        description="Review, action and progress permit applications from all channels."
        actions={<Button variant="contained" startIcon={<Add />}>New application</Button>}
      />
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField placeholder="Search by reference or applicant" value={q} onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} sx={{ flex: 1 }} />
          <TextField select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 220 }} label="Status">
            {['All','Pending Approval','In Progress','Under Review','Approved','Active','Awaiting Payment','On Hold','Rejected','Cancelled','Expired','Closed','NFI'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Stack>
      </Paper>
      <Paper>
        <Box sx={{ height: 620 }}>
          <DataGrid rows={rows} columns={cols} onRowClick={(p) => nav(`/applications/${p.id}`)} disableRowSelectionOnClick pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
        </Box>
      </Paper>
    </>
  );
}
