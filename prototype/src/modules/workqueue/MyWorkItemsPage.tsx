import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
  IconButton, Stack, Tab, Tabs, TextField, Typography, Autocomplete, Divider,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../shared/PageHeader';
import { applications, systemUsers } from '../../data/mock';

const STATUS_COLORS: Record<string, { color: 'default'|'primary'|'success'|'warning'|'error'|'info'; variant: 'filled'|'outlined' }> = {
  'Pending Approval': { color: 'warning', variant: 'outlined' },
  'Awaiting Payment': { color: 'info', variant: 'outlined' },
  'Payment Failed':   { color: 'error', variant: 'outlined' },
  'Rejected':         { color: 'error', variant: 'outlined' },
  'Cancelled':        { color: 'default', variant: 'outlined' },
  'Expired':          { color: 'error', variant: 'outlined' },
  'Under Review':     { color: 'warning', variant: 'outlined' },
  'In Progress':      { color: 'success', variant: 'outlined' },
  'Active':           { color: 'success', variant: 'filled' },
  'On Hold':          { color: 'default', variant: 'outlined' },
  'Suspended':        { color: 'warning', variant: 'outlined' },
  'NFI':              { color: 'info', variant: 'outlined' },
  'Approved':         { color: 'success', variant: 'outlined' },
  'Closed':           { color: 'default', variant: 'outlined' },
};

type WorkItem = {
  id: string;
  ref: string;
  permissionGroup: string;
  vrm: string;
  workQueueStatus: string;
  applicant: string;
  address: string;
  postcode: string;
  appliedOn: string;
  startDate: string;
  expiryDate: string;
  assignedBy?: string;
  assignedTo?: string;
  bucket: 'unassigned' | 'assigned' | 'waiting';
};

const VRMS = ['AB12 CDE', 'LK21 MNP', 'BX70 XYZ', 'JS08 KLM', 'TR19 QWE', 'MN22 RTY', 'AA65 BCD', 'FR15 GHK'];
const POSTCODES = ['SK1 3AZ', 'M4 1LE', 'M1 2AB', 'SK7 5PP', 'M2 3JB', 'SK4 4NX'];
const ADDR = ['12 Church Lane', '48 Kingsway', '3 Market Street', '210 Mill Road', '77 Riverside Ave', '156 Oak Hill'];
const boUsers = systemUsers.filter((u) => u.status === 'Active').map((u) => u.name);

const seed = (): WorkItem[] => applications.slice(0, 18).map((a, i) => {
  const bucket: WorkItem['bucket'] = i < 6 ? 'unassigned' : i < 14 ? 'assigned' : 'waiting';
  return {
    id: a.id,
    ref: a.ref,
    permissionGroup: a.type + ' — ' + a.zone.split(' ')[0],
    vrm: VRMS[i % VRMS.length],
    workQueueStatus: a.status,
    applicant: a.applicant,
    address: ADDR[i % ADDR.length],
    postcode: POSTCODES[i % POSTCODES.length],
    appliedOn: '02/03/2026',
    startDate: '15/03/2026',
    expiryDate: '14/03/2027',
    assignedBy: bucket === 'assigned' ? 'Priya R.' : undefined,
    assignedTo: bucket === 'assigned' ? boUsers[i % boUsers.length] : undefined,
    bucket,
  };
});

type Mode = 'assign' | 'reassign';

export function MyWorkItemsPage() {
  const nav = useNavigate();
  const [rows, setRows] = useState<WorkItem[]>(seed());
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [panel, setPanel] = useState<Mode | null>(null);
  const [panelIds, setPanelIds] = useState<string[]>([]);
  const [chosenUser, setChosenUser] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; row: WorkItem } | null>(null);

  const bucket = tab === 0 ? 'unassigned' : tab === 1 ? 'assigned' : 'waiting';

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => r.bucket === bucket && (!q || r.ref.toLowerCase().includes(q)));
  }, [rows, bucket, search]);

  const counts = useMemo(() => ({
    unassigned: rows.filter((r) => r.bucket === 'unassigned').length,
    assigned:   rows.filter((r) => r.bucket === 'assigned').length,
    waiting:    rows.filter((r) => r.bucket === 'waiting').length,
  }), [rows]);

  const openAssign = (ids: string[]) => { setPanel('assign'); setPanelIds(ids); setChosenUser(null); };
  const openReassign = (ids: string[]) => { setPanel('reassign'); setPanelIds(ids); setChosenUser(null); };
  const doUnassign = (ids: string[]) => {
    setRows(rows.map((r) => ids.includes(r.id)
      ? { ...r, bucket: 'unassigned', assignedBy: undefined, assignedTo: undefined }
      : r));
    setSelection([]);
  };
  const submitPanel = () => {
    if (!chosenUser || !panel) return;
    setRows(rows.map((r) => panelIds.includes(r.id)
      ? { ...r, bucket: 'assigned', assignedBy: 'Current User', assignedTo: chosenUser }
      : r));
    setPanel(null); setPanelIds([]); setSelection([]);
  };

  const panelRows = rows.filter((r) => panelIds.includes(r.id));
  const removePanelId = (id: string) => setPanelIds(panelIds.filter((x) => x !== id));

  const baseCols: GridColDef[] = [
    {
      field: 'ref', headerName: 'Ref. Number', width: 160,
      renderCell: (p) => (
        <Button size="small" variant="text" sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={() => nav(`/applications/${p.row.id}`)}>{p.value}</Button>
      ),
    },
    { field: 'permissionGroup', headerName: 'Permission Group', flex: 1, minWidth: 180 },
    { field: 'vrm', headerName: 'VRM', width: 120,
      renderCell: (p) => <Chip size="small" label={p.value} variant="outlined" /> },
    { field: 'workQueueStatus', headerName: 'Work Queue Status', width: 170,
      renderCell: (p) => {
        const s = STATUS_COLORS[p.value] || { color: 'default' as const, variant: 'outlined' as const };
        return <Chip size="small" label={p.value} color={s.color} variant={s.variant} />;
      } },
    { field: 'applicant', headerName: 'Applicant Name', flex: 1, minWidth: 160 },
    { field: 'address', headerName: 'Address', flex: 1, minWidth: 170 },
    { field: 'postcode', headerName: 'Postcode', width: 110 },
    { field: 'appliedOn', headerName: 'Applied On', width: 120 },
    { field: 'startDate', headerName: 'Start Date', width: 120 },
    { field: 'expiryDate', headerName: 'Expiry Date', width: 120 },
  ];

  const unassignedCols: GridColDef[] = [
    ...baseCols,
    { field: 'actions', headerName: 'Actions', width: 110, sortable: false, filterable: false,
      renderCell: (p) => (
        <Button size="small" variant="outlined" onClick={() => openAssign([p.row.id])}>Assign</Button>
      ) },
  ];

  const assignedCols: GridColDef[] = [
    ...baseCols,
    { field: 'assignedBy', headerName: 'Assigned By', width: 140 },
    { field: 'assignedTo', headerName: 'Assigned To', width: 140 },
    { field: 'actions', headerName: 'Actions', width: 80, sortable: false, filterable: false,
      renderCell: (p) => (
        <IconButton size="small" onClick={(e) => setMenuAnchor({ el: e.currentTarget, row: p.row as WorkItem })}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ) },
  ];

  const cols = bucket === 'unassigned' ? unassignedCols : assignedCols;

  return (
    <Box>
      <PageHeader eyebrow="Applications" title="My Work Items"
        description="Case ownership queue — unassigned, assigned, and waiting list." />

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setSelection([]); }}
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`Unassigned (${counts.unassigned})`} />
          <Tab label={`Assigned (${counts.assigned})`} />
          <Tab label={`Waiting List (${counts.waiting})`} />
        </Tabs>

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2 }}>
          <TextField size="small" placeholder="Search…" sx={{ minWidth: 260 }}
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <Box sx={{ flex: 1 }} />
          {selection.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary">{selection.length} Row Selected</Typography>
              {bucket === 'unassigned' && (
                <Button variant="outlined" startIcon={<PersonAddAltIcon />}
                  onClick={() => openAssign(selection as string[])}>Assign</Button>
              )}
              {bucket === 'assigned' && (
                <>
                  <Button variant="outlined" color="secondary"
                    onClick={() => doUnassign(selection as string[])}>Unassign</Button>
                  <Button variant="outlined"
                    onClick={() => openReassign(selection as string[])}>Re Assign</Button>
                </>
              )}
            </>
          )}
        </Stack>

        <Box sx={{ height: 560, px: 2, pb: 2 }}>
          <DataGrid rows={filtered} columns={cols} getRowId={(r) => r.id} density="compact"
            checkboxSelection={bucket !== 'waiting'}
            disableRowSelectionOnClick
            rowSelectionModel={selection}
            onRowSelectionModelChange={setSelection}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
        </Box>
      </Box>

      <Dialog open={!!menuAnchor} onClose={() => setMenuAnchor(null)} maxWidth="xs">
        <DialogTitle>Row Action — {menuAnchor?.row.ref}</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <Button fullWidth variant="outlined" color="secondary"
              onClick={() => { if (menuAnchor) { doUnassign([menuAnchor.row.id]); setMenuAnchor(null); } }}>
              Unassign
            </Button>
            <Button fullWidth variant="outlined"
              onClick={() => { if (menuAnchor) { openReassign([menuAnchor.row.id]); setMenuAnchor(null); } }}>
              Re Assign
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMenuAnchor(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Drawer anchor="right" open={panel !== null} onClose={() => setPanel(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 520 } } }}>
        <Stack sx={{ height: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between"
            sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
            <Typography variant="h6">
              {panel === 'reassign' ? 'Re Assign Work Items' : 'Assign Work Items'}
            </Typography>
            <IconButton onClick={() => setPanel(null)}><CloseIcon /></IconButton>
          </Stack>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
            <Autocomplete
              options={boUsers} value={chosenUser}
              onChange={(_, v) => setChosenUser(v)}
              renderInput={(params) => (
                <TextField {...params} size="small"
                  label={panel === 'reassign' ? 'Team Member *' : 'BO User *'} />
              )}
            />
            <Divider sx={{ my: 2 }}>Selected Applications ({panelRows.length})</Divider>
            <Stack spacing={1.25}>
              {panelRows.map((r) => {
                const s = STATUS_COLORS[r.workQueueStatus] || { color: 'default' as const, variant: 'outlined' as const };
                return (
                  <Box key={r.id} sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{r.ref}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.permissionGroup} · {r.applicant}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip size="small" label={r.workQueueStatus} color={s.color} variant={s.variant} />
                        {panelIds.length > 1 && (
                          <IconButton size="small" onClick={() => removePanelId(r.id)}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} justifyContent="flex-end"
            sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button onClick={() => setPanel(null)}>Cancel</Button>
            <Button variant="contained" disabled={!chosenUser || panelIds.length === 0} onClick={submitPanel}>
              {panel === 'reassign' ? 'Re Assign' : 'Assign'}
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Box>
  );
}
