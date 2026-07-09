import { Box, Button, InputAdornment, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { Add, Search, DownloadOutlined, FileUploadOutlined, EventRepeatOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import { PageHeader } from '../../shared/PageHeader';
import { StatusChip } from '../../shared/StatusChip';
import { applications } from '../../data/mock';

const TYPE_LABELS: Record<string, string> = {
  permit: 'Permit',
  suspension: 'Suspension',
  dispensation: 'Dispensation',
  exemption: 'Exemption',
};

export function ApplicationsListPage() {
  const nav = useNavigate();
  const showToast = useToast();
  const [params] = useSearchParams();
  const typeParam = (params.get('type') ?? '').toLowerCase();
  const typeLabel = TYPE_LABELS[typeParam];
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [zone, setZone] = useState('All');
  const [assignee, setAssignee] = useState('All');

  const zones = useMemo(() => Array.from(new Set(applications.map((a) => a.zone))), []);
  const assignees = useMemo(() => Array.from(new Set(applications.map((a) => a.assignedTo))), []);

  const rows = useMemo(() => applications.filter((a) =>
    (!typeLabel || a.type === typeLabel) &&
    (status === 'All' || a.status === status) &&
    (zone === 'All' || a.zone === zone) &&
    (assignee === 'All' || a.assignedTo === assignee) &&
    (q === '' || a.ref.toLowerCase().includes(q.toLowerCase()) || a.applicant.toLowerCase().includes(q.toLowerCase()))
  ), [q, status, zone, assignee, typeLabel]);

  const cols: GridColDef[] = [
    { field: 'ref',        headerName: 'Reference',   width: 150 },
    { field: 'applicant',  headerName: 'Applicant',   flex: 1,   minWidth: 180 },
    { field: 'permission', headerName: 'Permission',  flex: 1.4, minWidth: 220 },
    { field: 'type',       headerName: 'Type',        width: 120 },
    { field: 'zone',       headerName: 'Zone',        width: 160 },
    { field: 'submitted',  headerName: 'Submitted',   width: 130 },
    { field: 'amount',     headerName: 'Amount',      width: 100, valueFormatter: (v) => `£${v}` },
    { field: 'assignedTo', headerName: 'Assigned to', width: 150 },
    { field: 'status',     headerName: 'Status',      width: 170, renderCell: (p) => <StatusChip status={p.value} /> },
  ];

  return (
    <>
      <PageHeader
        eyebrow={typeLabel ? `Back Office · ${typeLabel}` : 'Back Office'}
        title={typeLabel ? `${typeLabel} applications` : 'Applications'}
        description={typeLabel
          ? `Review, action and progress ${typeLabel.toLowerCase()} applications.`
          : 'Review, action and progress permit applications from all channels.'}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<EventRepeatOutlined />} onClick={() => showToast('Extend duration dialog coming soon', 'info')}>Extend Duration</Button>
            <Button variant="outlined" startIcon={<FileUploadOutlined />} onClick={() => showToast('Exporting…', 'info')}>Export</Button>
            <Button variant="outlined" startIcon={<DownloadOutlined />} onClick={() => showToast('Downloading…', 'info')}>Download</Button>
            <Button variant="contained" startIcon={<Add />} onClick={() => showToast('Use Buy Now flow to create a new application', 'info')}>New application</Button>
          </Stack>
        }
      />
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField placeholder="Search by reference or applicant" value={q} onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} sx={{ flex: 1 }} />
          <TextField select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 200 }} label="Status">
            {['All','Pending Approval','In Progress','Under Review','Approved','Active','Awaiting Payment','On Hold','Rejected','Cancelled','Suspended','Expired','Closed','NFI'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField select value={zone} onChange={(e) => setZone(e.target.value)} sx={{ minWidth: 180 }} label="Zone">
            <MenuItem value="All">All</MenuItem>
            {zones.map((z) => <MenuItem key={z} value={z}>{z}</MenuItem>)}
          </TextField>
          <TextField select value={assignee} onChange={(e) => setAssignee(e.target.value)} sx={{ minWidth: 180 }} label="Assigned to">
            <MenuItem value="All">All</MenuItem>
            {assignees.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
          </TextField>
        </Stack>
      </Paper>
      <Paper>
        <Box sx={{ height: 620 }}>
          <DataGrid rows={rows} columns={cols} onRowClick={(p) => nav(`/applications/${p.id}`)} disableRowSelectionOnClick pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} checkboxSelection />
        </Box>
      </Paper>
    </>
  );
}
