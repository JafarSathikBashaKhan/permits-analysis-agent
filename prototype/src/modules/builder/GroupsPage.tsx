import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
  IconButton, MenuItem, Stack, TextField, Tooltip, Typography, Alert, Divider,
  Menu, RadioGroup, FormControlLabel, Radio, Switch,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';

const PERMISSION_TYPES = [
  'Residents Permit', 'Business Permit', 'Visitor Permit', 'Contractor Permit',
  'Suspension', 'Dispensation', 'Taxi Card',
];

type Group = {
  id: string;
  name: string;
  permissionType: string;
  groupType: 'Zonal' | 'Non-Zonal';
  householdLimit: number;
  maxVouchers: number;
  backOfficeUse: boolean;
  status: 'Active' | 'InActive';
  linkedPermissions: number;
  createdOn: string;
  createdByUser: string;
  updatedOn: string;
  updatedByUser: string;
};

const seedGroups = (): Group[] => {
  const names = ['City Centre', 'North Zone', 'South Zone', 'Riverside', 'Business District', 'Suburbs'];
  return names.map((n, i) => ({
    id: `g-${i + 1}`,
    name: n,
    permissionType: PERMISSION_TYPES[i % PERMISSION_TYPES.length],
    groupType: i % 3 === 0 ? 'Non-Zonal' : 'Zonal',
    householdLimit: (i + 1) * 2,
    maxVouchers: (i + 1) * 10,
    backOfficeUse: i % 2 === 0,
    status: i % 4 === 0 ? 'InActive' : 'Active',
    linkedPermissions: i % 3 === 0 ? 0 : (i + 1) * 2,
    createdOn: `2025-${String((i % 12) + 1).padStart(2, '0')}-10 09:12`,
    createdByUser: 'admin.user',
    updatedOn: `2026-${String((i % 6) + 1).padStart(2, '0')}-02 14:22`,
    updatedByUser: 'ops.team',
  }));
};

function GroupPanel({
  open, onClose, group, onSave,
}: {
  open: boolean; onClose: () => void; group: Group | null; onSave: (g: Group) => void;
}) {
  const [form, setForm] = useState<Group>({
    id: '', name: '', permissionType: '', groupType: 'Zonal',
    householdLimit: 0, maxVouchers: 0, backOfficeUse: false,
    status: 'Active', linkedPermissions: 0,
    createdOn: '', createdByUser: '', updatedOn: '', updatedByUser: '',
  });
  const [error, setError] = useState<string | null>(null);

  useMemo(() => {
    if (group) setForm(group);
    else setForm({
      id: `g-${Date.now()}`, name: '', permissionType: '', groupType: 'Zonal',
      householdLimit: 0, maxVouchers: 0, backOfficeUse: false,
      status: 'Active', linkedPermissions: 0,
      createdOn: new Date().toISOString().slice(0, 10),
      createdByUser: 'you',
      updatedOn: new Date().toISOString().slice(0, 10),
      updatedByUser: 'you',
    });
    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, group?.id]);

  const submit = () => {
    if (!form.name.trim()) return setError('Group Name is required');
    if (!form.permissionType) return setError('Permission Type is required');
    onSave(form);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 640 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>Permission Group</Typography>
          <Typography variant="h6" fontWeight={700}>{group ? 'Edit Group' : 'New Group'}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </Stack>
      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2}>
          <TextField label="Group Name" required fullWidth value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField select label="Permission Type" required fullWidth value={form.permissionType}
            onChange={(e) => setForm({ ...form, permissionType: e.target.value })}>
            {PERMISSION_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <Box>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Group Related To</Typography>
            <RadioGroup row value={form.groupType}
              onChange={(e) => setForm({ ...form, groupType: e.target.value as any })}>
              <FormControlLabel value="Zonal" control={<Radio size="small" />} label="Zonal" />
              <FormControlLabel value="Non-Zonal" control={<Radio size="small" />} label="Non-Zonal" />
            </RadioGroup>
          </Box>
          <Stack direction="row" spacing={2}>
            <TextField type="number" label="House Hold Limit" fullWidth inputProps={{ min: 0, max: 100 }}
              value={form.householdLimit}
              onChange={(e) => setForm({ ...form, householdLimit: +e.target.value })} />
            <TextField type="number" label="Max vouchers books per household" fullWidth inputProps={{ min: 0, max: 1000 }}
              value={form.maxVouchers}
              onChange={(e) => setForm({ ...form, maxVouchers: +e.target.value })} />
          </Stack>
          <Divider />
          <FormControlLabel control={
            <Switch checked={form.backOfficeUse}
              onChange={(e) => setForm({ ...form, backOfficeUse: e.target.checked })} />
          } label="Back Office Use" />
        </Stack>
      </Box>
      <Stack direction="row" justifyContent="flex-end" spacing={1}
        sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', position: 'sticky', bottom: 0, bgcolor: 'background.paper' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={submit}>
          {group ? 'Save Changes' : 'Create'}
        </Button>
      </Stack>
    </Drawer>
  );
}

export function GroupsPage() {
  const [rows, setRows] = usePersistentState<Group[]>('prototype:builder:groups:rows', seedGroups);
  const [q, setQ] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<Group | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; row: Group } | null>(null);
  const [deleting, setDeleting] = useState<Group | null>(null);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(ql));
  }, [rows, q]);

  const save = (g: Group) =>
    setRows((prev) => {
      const exists = prev.some((r) => r.id === g.id);
      return exists ? prev.map((r) => (r.id === g.id ? g : r)) : [g, ...prev];
    });

  const columns: GridColDef<Group>[] = [
    { field: 'name', headerName: 'Group Name', flex: 1.2, minWidth: 160 },
    { field: 'groupType', headerName: 'Group Type', width: 130,
      renderCell: (p) => <Chip size="small" variant="outlined" label={p.value} /> },
    { field: 'householdLimit', headerName: 'House hold limit', width: 150, type: 'number' },
    { field: 'maxVouchers', headerName: 'Max vouchers per HH', width: 170, type: 'number' },
    { field: 'createdOn', headerName: 'Created On', width: 140 },
    { field: 'createdByUser', headerName: 'Created By', width: 130 },
    { field: 'updatedOn', headerName: 'Updated On', width: 140 },
    { field: 'updatedByUser', headerName: 'Updated By', width: 130 },
    {
      field: 'actions', headerName: 'Actions', width: 80, sortable: false,
      renderCell: (p) => (
        <IconButton size="small" onClick={(e) => setMenuAnchor({ el: e.currentTarget, row: p.row })}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Permission Setup" title="Groups"
        description="Group permissions by zone or entitlement to control household limits and voucher allocation."
        actions={
          <Button variant="contained" startIcon={<AddIcon />}
            onClick={() => { setSelected(null); setPanelOpen(true); }}>
            New Group
          </Button>
        } />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField size="small" placeholder="Search by Group Name" value={q}
          onChange={(e) => setQ(e.target.value)} sx={{ flex: 1, maxWidth: 420 }} />
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DataGrid<Group> rows={filtered} columns={columns} autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} />
      </Box>

      <Menu anchorEl={menuAnchor?.el} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => { if (menuAnchor) { setSelected(menuAnchor.row); setPanelOpen(true); setMenuAnchor(null); } }}>
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { if (menuAnchor) { setDeleting(menuAnchor.row); setMenuAnchor(null); } }}>
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <GroupPanel open={panelOpen} onClose={() => setPanelOpen(false)} group={selected} onSave={save} />

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Group?</DialogTitle>
        <DialogContent>
          {deleting && deleting.linkedPermissions > 0 ? (
            <Alert severity="warning">
              The selected group is currently linked to active permissions and cannot be deleted.
            </Alert>
          ) : (
            <Typography>Are you sure wish to delete the group <b>{deleting?.name}</b>?</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          {deleting && deleting.linkedPermissions === 0 && (
            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => {
              setRows((prev) => prev.filter((r) => r.id !== deleting.id));
              setDeleting(null);
            }}>Delete</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
