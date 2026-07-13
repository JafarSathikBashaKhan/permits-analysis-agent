import { Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { Add, Search, DownloadOutlined, FileUploadOutlined, EventRepeatOutlined, DeleteOutline, CheckCircle, Cancel, ListAltOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import { PageHeader } from '../../shared/PageHeader';
import { applications, Application } from '../../data/mock';
import { ExtendDurationDialog } from '../../components/dialogs/ExtendDurationDialog';
import { usePersistentState } from '../../hooks/usePersistentState';
import { APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_LABELS, statusChipColor } from '../../constants/enums';
import { generateApplicationNumber, resolvePrefixForPermission } from '../../utils/applicationNumber';
import { readStartEnd, computeStartEnd } from './helpers/startDate';
import { pushAudit } from './helpers/auditLog';

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
  const [params, setParams] = useSearchParams();
  const typeParam = (params.get('type') ?? '').toLowerCase();
  const typeLabel = TYPE_LABELS[typeParam];
  const isLicence = typeParam === 'licence' || typeParam === 'license';
  const waitingListOnly = params.get('view') === 'waiting-list';
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string>(waitingListOnly ? 'Waiting List' : 'All');
  const [zone, setZone] = useState('All');
  const [assignee, setAssignee] = useState('All');
  const [extendOpen, setExtendOpen] = useState(false);
  const [newAppOpen, setNewAppOpen] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'submitted', sort: 'desc' }]);

  const [allRows, setAllRows] = usePersistentState<Application[]>('prototype:applications:rows', () => [...applications]);

  // New application form state
  const [newApplicant, setNewApplicant] = useState('');
  const [newPermType, setNewPermType] = useState('Resident Permit');
  const [newVrm, setNewVrm] = useState('');
  const [newZone, setNewZone] = useState('Z01 City Centre');

  const FIXED_ZONES = ['Z01 City Centre', 'Z02 Northgate', 'Z03 Southbank', 'Z04 Riverside', 'Z05 Kingsway'];

  const handleCreateApp = () => {
    if (!newApplicant.trim()) { showToast('Applicant name is required', 'error'); return; }
    // US-137749 — generate application number from configured permission prefix
    const prefix = resolvePrefixForPermission(newPermType);
    const ref = generateApplicationNumber(prefix);
    const id = `A-${Date.now()}`;
    const newApp: Application = {
      id,
      ref,
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
    pushAudit(id, {
      actor: 'You', actorRole: 'BO User',
      eventName: 'Application Created (BO)',
      eventDescription: `BO user created new application ${ref} for ${newApplicant.trim()}.`,
      eventCategory: 'System Action',
    });
    showToast(`Application ${ref} created`, 'success');
    setNewAppOpen(false);
    setNewApplicant(''); setNewVrm('');
  };

  const zones = useMemo(() => Array.from(new Set(allRows.map((a) => a.zone))), [allRows]);
  const assignees = useMemo(() => Array.from(new Set(allRows.map((a) => a.assignedTo))), [allRows]);

  // Enrich rows with start/expiry/vrm for the list view
  const enrichedRows = useMemo(() => allRows.map((a) => {
    const dyn = readStartEnd(a.id) ?? (a.status === 'Active' ? computeStartEnd(a.id, a.submitted) : undefined);
    let vrm = '';
    try {
      const raw = localStorage.getItem(`prototype:applications:vehicles:${a.id}`);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) vrm = list[0].vrm ?? '';
      }
    } catch { /* ignore */ }
    return { ...a, startDate: a.startDate ?? dyn?.startDate ?? '', expiryDate: a.expiryDate ?? dyn?.endDate ?? '', vrm };
  }), [allRows]);

  const rows = useMemo(() => enrichedRows.filter((a) =>
    (!typeLabel || a.type === typeLabel) &&
    (status === 'All' || a.status === status) &&
    (zone === 'All' || a.zone === zone) &&
    (assignee === 'All' || a.assignedTo === assignee) &&
    (q === '' || a.ref.toLowerCase().includes(q.toLowerCase()) || a.applicant.toLowerCase().includes(q.toLowerCase()) || (a.vrm && a.vrm.toLowerCase().includes(q.toLowerCase())))
  ), [enrichedRows, q, status, zone, assignee, typeLabel]);

  const cols: GridColDef[] = [
    { field: 'ref',        headerName: 'Reference',   width: 150 },
    { field: 'applicant',  headerName: 'Applicant',   flex: 1,   minWidth: 180 },
    { field: 'permission', headerName: 'Permission',  flex: 1.2, minWidth: 200 },
    { field: 'type',       headerName: 'Type',        width: 110 },
    ...(!isLicence ? [{ field: 'vrm', headerName: 'VRM', width: 120, renderCell: (p: any) => (
      p.value ? <Typography fontFamily="monospace" variant="body2">{p.value}</Typography> : <Typography variant="caption" color="text.secondary">—</Typography>
    ) } as GridColDef] : []),
    { field: 'zone',       headerName: 'Zone',        width: 160 },
    { field: 'submitted',  headerName: 'Submitted',   width: 120 },
    { field: 'startDate',  headerName: 'Start',       width: 110, renderCell: (p) => p.value || <Typography variant="caption" color="text.secondary">—</Typography> },
    { field: 'expiryDate', headerName: 'Expiry',      width: 110, renderCell: (p) => p.value || <Typography variant="caption" color="text.secondary">—</Typography> },
    { field: 'amount',     headerName: 'Amount',      width: 100, valueFormatter: (v) => `£${v}` },
    { field: 'assignedTo', headerName: 'Assigned to', width: 150 },
    { field: 'status',     headerName: 'Status',      width: 170, renderCell: (p) => {
      const statusId = STATUS_LABEL_TO_ID[p.value as string];
      const color = statusId ? statusChipColor(statusId) : 'default';
      return <Chip label={p.value} size="small" color={color} />;
    } },
  ];

  const handleBulkApprove = () => {
    setAllRows((prev) => prev.map((r) => selection.includes(r.id) ? { ...r, status: 'Approved' } : r));
    showToast(`${selection.length} application(s) approved`, 'success');
    setSelection([]);
  };

  const handleBulkReject = () => {
    setAllRows((prev) => prev.map((r) => selection.includes(r.id) ? { ...r, status: 'Rejected' } : r));
    showToast(`${selection.length} application(s) rejected`, 'success');
    setSelection([]);
  };

  const handleBulkDelete = () => {
    setAllRows((prev) => prev.filter((r) => !selection.includes(r.id)));
    showToast(`${selection.length} application(s) deleted`, 'success');
    setSelection([]);
  };

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
            <Button variant={waitingListOnly ? 'contained' : 'outlined'} startIcon={<ListAltOutlined />}
              onClick={() => {
                const next = new URLSearchParams(params);
                if (waitingListOnly) { next.delete('view'); setStatus('All'); }
                else { next.set('view', 'waiting-list'); setStatus('Waiting List'); }
                setParams(next);
              }} data-testid="waiting-list-filter">
              {waitingListOnly ? 'Show all' : 'Waiting List'}
            </Button>
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
      
      {selection.length > 0 && (
        <Card sx={{ mb: 2, bgcolor: '#EAF3FB' }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ fontWeight: 600, color: '#0D3E66' }}>
                {selection.length} row(s) selected
              </Typography>
              <Button variant="outlined" size="small" startIcon={<CheckCircle />} onClick={handleBulkApprove}>Approve</Button>
              <Button variant="outlined" size="small" startIcon={<Cancel />} onClick={handleBulkReject}>Reject</Button>
              <Button variant="outlined" size="small" color="error" startIcon={<DeleteOutline />} onClick={handleBulkDelete}>Delete</Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Paper>
        <Box sx={{ height: 620 }}>
          <DataGrid 
            rows={rows} 
            columns={cols} 
            onRowClick={(p) => nav(`/applications/${p.id}`)} 
            disableRowSelectionOnClick 
            pageSizeOptions={[10, 25, 50]} 
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} 
            checkboxSelection 
            rowSelectionModel={selection}
            onRowSelectionModelChange={setSelection}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
          />
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
