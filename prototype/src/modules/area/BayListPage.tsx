import { useMemo, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Stack, TextField, Typography, Menu, Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageHeader } from '../../shared/PageHeader';

type Bay = {
  id: string;
  displayName: string;
  name: string;
  createdByUser: string;
  createdOn: string;
  updatedByUser: string;
  updatedOn: string;
};

const seedBays = (): Bay[] =>
  Array.from({ length: 12 }, (_, i) => ({
    id: `b-${1000 + i}`,
    displayName: `Bay ${(i + 1).toString().padStart(3, '0')}`,
    name: `bay_${(i + 1).toString().padStart(3, '0')}`,
    createdByUser: 'admin.user',
    createdOn: `2025-${String((i % 12) + 1).padStart(2, '0')}-14 09:12`,
    updatedByUser: 'ops.team',
    updatedOn: `2026-${String((i % 6) + 1).padStart(2, '0')}-02 14:22`,
  }));

function BayDialog({
  open, onClose, bay, mode, onSave, onEditClick,
}: {
  open: boolean; onClose: () => void; bay: Bay | null; mode: 'add' | 'edit' | 'view';
  onSave: (b: Bay) => void; onEditClick?: () => void;
}) {
  const [form, setForm] = useState<Bay>({
    id: '', displayName: '', name: '', createdByUser: '', createdOn: '',
    updatedByUser: '', updatedOn: '',
  });
  const [error, setError] = useState<string | null>(null);

  useMemo(() => {
    if (bay) setForm(bay);
    else setForm({
      id: `b-${Date.now()}`, displayName: '', name: '',
      createdByUser: 'you', createdOn: new Date().toISOString().slice(0, 10),
      updatedByUser: 'you', updatedOn: new Date().toISOString().slice(0, 10),
    });
    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, bay?.id]);

  const readonly = mode === 'view';

  const submit = () => {
    if (!form.displayName.trim()) return setError('Bay Display Name is required');
    if (!form.name.trim()) return setError('Bay Internal Name is required');
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <span>
            {mode === 'add' && 'New Bay'}
            {mode === 'view' && `Bay · ${form.displayName}`}
            {mode === 'edit' && 'Edit Bay'}
          </span>
          {readonly && onEditClick && (
            <IconButton size="small" onClick={onEditClick}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Bay Display Name" required fullWidth value={form.displayName}
            disabled={readonly}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          <TextField label="Bay Internal Name" required fullWidth value={form.name}
            disabled={readonly}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {mode !== 'add' && (
            <Stack direction="row" spacing={2}>
              <TextField label="Created By" fullWidth value={form.createdByUser} disabled />
              <TextField label="Created On" fullWidth value={form.createdOn} disabled />
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {!readonly && (
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={submit}>
            {mode === 'add' ? 'Create' : 'Save Changes'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export function BayListPage() {
  const [rows, setRows] = useState<Bay[]>(seedBays);
  const [q, setQ] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selected, setSelected] = useState<Bay | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; row: Bay } | null>(null);
  const [deleting, setDeleting] = useState<Bay | null>(null);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return rows;
    return rows.filter((r) =>
      r.displayName.toLowerCase().includes(ql) || r.name.toLowerCase().includes(ql));
  }, [rows, q]);

  const save = (b: Bay) =>
    setRows((prev) => {
      const exists = prev.some((r) => r.id === b.id);
      return exists ? prev.map((r) => (r.id === b.id ? b : r)) : [b, ...prev];
    });

  const columns: GridColDef<Bay>[] = [
    {
      field: 'displayName', headerName: 'Bay List', flex: 1.2, minWidth: 180,
      renderCell: (p) => (
        <Button size="small" variant="text" onClick={() => { setSelected(p.row); setPanelMode('view'); setPanelOpen(true); }}>
          {p.value}
        </Button>
      ),
    },
    { field: 'createdByUser', headerName: 'Created By', width: 160 },
    { field: 'createdOn', headerName: 'Created On', width: 170 },
    { field: 'updatedByUser', headerName: 'Last Updated By', width: 180 },
    { field: 'updatedOn', headerName: 'Last Updated On', width: 180 },
    {
      field: 'actions', headerName: 'Actions', width: 100, sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={(e) => setMenuAnchor({ el: e.currentTarget, row: p.row })}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setDeleting(p.row)}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Area" title="Bay List"
        description="Physical parking bays. Referenced by streets and enforcement."
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />}>Export</Button>
            <Button variant="outlined" startIcon={<UploadFileIcon />}>Import</Button>
            <Button variant="contained" startIcon={<AddIcon />}
              onClick={() => { setSelected(null); setPanelMode('add'); setPanelOpen(true); }}>
              Add Bay
            </Button>
          </Stack>
        } />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField size="small" placeholder="Search" value={q}
          onChange={(e) => setQ(e.target.value)} sx={{ flex: 1, maxWidth: 420 }} />
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DataGrid<Bay> rows={filtered} columns={columns} autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: 'createdOn', sort: 'desc' }] },
          }} />
      </Box>

      <Menu anchorEl={menuAnchor?.el} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => { if (menuAnchor) { setSelected(menuAnchor.row); setPanelMode('edit'); setPanelOpen(true); setMenuAnchor(null); } }}>
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
      </Menu>

      <BayDialog open={panelOpen} onClose={() => setPanelOpen(false)}
        bay={selected} mode={panelMode} onSave={save}
        onEditClick={() => setPanelMode('edit')} />

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Bay?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to permanently delete <b>{deleting?.displayName}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => {
            if (deleting) setRows((prev) => prev.filter((r) => r.id !== deleting.id));
            setDeleting(null);
          }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
