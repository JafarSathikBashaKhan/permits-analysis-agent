import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { Add, Search, DownloadOutlined, FileUploadOutlined, EventRepeatOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import { PageHeader } from '../../shared/PageHeader';
import { StatusChip } from '../../shared/StatusChip';
import { applications, Application } from '../../data/mock';
import { ExtendDurationDialog } from '../../components/dialogs/ExtendDurationDialog';
import { usePersistentState } from '../../hooks/usePersistentState';
import { APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_LABELS, statusChipColor } from '../../constants/enums';

/** Reverse-map status label → numeric id for chip colouring */
const STATUS_LABEL_TO_ID: Record<string, number> = Object.fromEntries(
  Object.entries(APPLICATION_STATUS_LABELS).map(([id, label]) => [label, Number(id)])
);

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
  const [extendOpen, setExtendOpen] = useState(false);
  const [newAppOpen, setNewAppOpen] = useState(false);

  const [allRows, setAllRows] = usePersistentState<Application[]>('prototype:applications:rows', () => [...applications]);

  // New application form state
  const [newApplicant, setNewApplicant] = useState('');
  const [newPermType, setNewPermType] = useState('Resident Permit');
  const [newVrm, setNewVrm] = useState('');
  const [newZone, setNewZone] = useState('Z01 City Centre');

  const FIXED_ZONES = ['Z01 City Centre', 'Z02 Northgate', 'Z03 Southbank', 'Z04 Riverside', 'Z05 Kingsway'];

  const handleCreateApp = () => {
    if (!newApplicant.trim()) { showToast('Applicant name is required', 'error'); return; }
    const id = `A-${Date.now()}`;
    const newApp: Application = {
      id,
      ref: `AP-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      applicant: newApplicant.trim(),
      permission: newPermType,
      type: 'Permit',
      submitted: new Date().toISOString().slice(0, 10),
      status: 'Pending Approval',
      amount: 0,
      zone: newZone,
      assignedTo: 'Unassigned',
    };
    setAllRows((prev) => [newApp, ...prev]);
    showToast('Application created successfully', 'success');
    setNewAppOpen(false);
    setNewApplicant(''); setNewVrm('');
  };

  const zones = useMemo(() => Array.from(new Set(allRows.map((a) => a.zone))), [allRows]);
  const assignees = useMemo(() => Array.from(new Set(allRows.map((a) => a.assignedTo))), [allRows]);

  const rows = useMemo(() => allRows.filter((a) =>
    (!typeLabel || a.type === typeLabel) &&
    (status === 'All' || a.status === status) &&
    (zone === 'All' || a.zone === zone) &&
    (assignee === 'All' || a.assignedTo === assignee) &&
    (q === '' || a.ref.toLowerCase().includes(q.toLowerCase()) || a.applicant.toLowerCase().includes(q.toLowerCase()))
  ), [allRows, q, status, zone, assignee, typeLabel]);

  const cols: GridColDef[] = [
    { field: 'ref',        headerName: 'Reference',   width: 150 },
    { field: 'applicant',  headerName: 'Applicant',   flex: 1,   minWidth: 180 },
    { field: 'permission', headerName: 'Permission',  flex: 1.4, minWidth: 220 },
    { field: 'type',       headerName: 'Type',        width: 120 },
    { field: 'zone',       headerName: 'Zone',        width: 160 },
    { field: 'submitted',  headerName: 'Submitted',   width: 130 },
    { field: 'amount',     headerName: 'Amount',      width: 100, valueFormatter: (v) => `£${v}` },
    { field: 'assignedTo', headerName: 'Assigned to', width: 150 },
    { field: 'status',     headerName: 'Status',      width: 170, renderCell: (p) => {
      const statusId = STATUS_LABEL_TO_ID[p.value as string];
      const color = statusId ? statusChipColor(statusId) : 'default';
      return <Chip label={p.value} size="small" color={color} />;
    } },
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
            <Button variant="outlined" startIcon={<EventRepeatOutlined />} onClick={() => setExtendOpen(true)}>Extend Duration</Button>
            <Button variant="outlined" startIcon={<FileUploadOutlined />} onClick={() => showToast('Exporting…', 'info')}>Export</Button>
            <Button variant="outlined" startIcon={<DownloadOutlined />} onClick={() => showToast('Downloading…', 'info')}>Download</Button>
            <Button variant="contained" startIcon={<Add />} onClick={() => setNewAppOpen(true)}>New application</Button>
          </Stack>
        }
      />
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField placeholder="Search by reference or applicant" value={q} onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} sx={{ flex: 1 }} />
          <TextField select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 200 }} label="Status">
            <MenuItem value="All">All</MenuItem>
            {APPLICATION_STATUS_OPTIONS.map((o) => <MenuItem key={o.id} value={o.label}>{o.label}</MenuItem>)}
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

      <ExtendDurationDialog
        open={extendOpen}
        onClose={() => setExtendOpen(false)}
        onSave={() => showToast('Duration extended', 'success')}
      />

      <Dialog open={newAppOpen} onClose={() => setNewAppOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Application</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Applicant Name" required fullWidth
              value={newApplicant} onChange={(e) => setNewApplicant(e.target.value)}
              placeholder="Full name of applicant"
            />
            <TextField
              select label="Permission Type" fullWidth
              value={newPermType} onChange={(e) => setNewPermType(e.target.value)}
            >
              {['Resident Permit','Business Permit','Visitor Permit','Blue Badge Permit','Bay Suspension'].map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Vehicle VRM" fullWidth
              value={newVrm} onChange={(e) => setNewVrm(e.target.value.toUpperCase())}
              placeholder="e.g. AB19 XYZ"
              inputProps={{ style: { textTransform: 'uppercase', fontFamily: 'monospace' } }}
            />
            <TextField
              select label="Zone" fullWidth
              value={newZone} onChange={(e) => setNewZone(e.target.value)}
            >
              {FIXED_ZONES.map((z) => <MenuItem key={z} value={z}>{z}</MenuItem>)}
            </TextField>
            <TextField label="Status" fullWidth value="Pending Approval" disabled />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewAppOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateApp}>Create Application</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
