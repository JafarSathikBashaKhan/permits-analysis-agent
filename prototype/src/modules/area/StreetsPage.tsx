import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
  IconButton, MenuItem, Stack, Tab, Tabs, TextField, Tooltip, Typography, Menu,
  Accordion, AccordionSummary, AccordionDetails, Divider, Alert,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BlockIcon from '@mui/icons-material/Block';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageHeader } from '../../shared/PageHeader';
import { Street, PropertyRow, TOWNS, seedStreets, BLACKLIST_DURATIONS } from './areaFixtures';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';
import { ImportCsvDialog } from '../../components/dialogs/ImportCsvDialog';
import { ConfirmDialog } from '../../components/dialogs/ConfirmDialog';

type BlackStreet = Street & { blacklistedUntil: string; reason?: string };
type BlackProperty = PropertyRow & {
  street: string;
  town: string;
  blacklistedUntil: string;
  reason?: string;
};

const seedBlackStreets = (base: Street[]): BlackStreet[] =>
  base.slice(0, 3).map((s, i) => ({
    ...s,
    id: `bs-${i}`,
    blacklistedUntil: i === 0 ? 'Indefinite' : `2026-${String(i + 6).padStart(2, '0')}-01`,
    reason: ['Anti-social behaviour', 'Fraud investigation', 'Ongoing dispute'][i],
  }));
const seedBlackProperties = (base: Street[]): BlackProperty[] =>
  base.slice(0, 3).flatMap((s, i) =>
    s.properties.slice(0, 1).map((p) => ({
      ...p,
      id: `bp-${s.id}-${p.id}`,
      street: s.name,
      town: s.town,
      blacklistedUntil: i === 0 ? 'Indefinite' : `2026-${String(i + 6).padStart(2, '0')}-01`,
      reason: ['Nuisance complaint', 'Landlord request', 'Duplicate address'][i],
    }))
  );

// ─────────────────────────────────────────────────────────────
// Street Add / Edit slider
// ─────────────────────────────────────────────────────────────
function StreetSlider({
  open, onClose, street, onSave,
}: {
  open: boolean; onClose: () => void; street: Street | null; onSave: (s: Street) => void;
}) {
  const [form, setForm] = useState<Street>({
    id: '', name: '', usrn: '', town: '', noOfProperties: 0,
    status: 'Active', createdOn: '', createdByUser: '', updatedOn: '', updatedByUser: '',
    properties: [],
  });
  const [propInput, setPropInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useMemo(() => {
    if (street) setForm(street);
    else setForm({
      id: `st-${Date.now()}`, name: '', usrn: '', town: '',
      noOfProperties: 0, status: 'Active',
      createdOn: new Date().toISOString().slice(0, 10),
      createdByUser: 'you',
      updatedOn: new Date().toISOString().slice(0, 10),
      updatedByUser: 'you',
      properties: [],
    });
    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, street?.id]);

  const addProp = () => {
    if (!propInput.trim()) return;
    setForm({
      ...form,
      properties: [
        ...form.properties,
        { id: `p-${Date.now()}`, name: propInput.trim(), uprn: '', postcode: '', permissionLimit: 1 },
      ],
    });
    setPropInput('');
  };
  const removeProp = (id: string) =>
    setForm({ ...form, properties: form.properties.filter((p) => p.id !== id) });
  const updateProp = (id: string, key: keyof PropertyRow, val: any) =>
    setForm({
      ...form,
      properties: form.properties.map((p) => (p.id === id ? { ...p, [key]: val } : p)),
    });

  const submit = () => {
    if (!form.name.trim()) return setError('Street Name is required');
    if (!form.usrn.trim()) return setError('USRN is required');
    if (!form.town) return setError('Town is required');
    onSave({ ...form, noOfProperties: form.properties.length });
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 780 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>Street</Typography>
          <Typography variant="h6" fontWeight={700}>{street ? 'Edit Street' : 'New Street'}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </Stack>

      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField label="Street Name" required fullWidth value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="USRN" required fullWidth value={form.usrn}
              onChange={(e) => setForm({ ...form, usrn: e.target.value })} />
          </Stack>
          <TextField select label="Town" required fullWidth value={form.town}
            onChange={(e) => setForm({ ...form, town: e.target.value })}>
            {TOWNS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>

          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" fontWeight={700}>Properties ({form.properties.length})</Typography>

          <Stack direction="row" spacing={1}>
            <TextField size="small" fullWidth placeholder="Enter property name or number"
              value={propInput}
              onChange={(e) => setPropInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addProp(); } }} />
            <Button variant="outlined" onClick={addProp} startIcon={<AddIcon />}>Add Property</Button>
          </Stack>

          {form.properties.length > 0 && (
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
              <Stack direction="row" sx={{ px: 1.5, py: 1, bgcolor: 'grey.100', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="caption" fontWeight={700} sx={{ flex: 1.4 }}>Property Name</Typography>
                <Typography variant="caption" fontWeight={700} sx={{ flex: 1.2 }}>UPRN</Typography>
                <Typography variant="caption" fontWeight={700} sx={{ flex: 1 }}>Postcode</Typography>
                <Typography variant="caption" fontWeight={700} sx={{ width: 130, textAlign: 'center' }}>Permission Limit</Typography>
                <Typography variant="caption" fontWeight={700} sx={{ width: 40 }}></Typography>
              </Stack>
              {form.properties.map((p) => (
                <Stack key={p.id} direction="row" alignItems="center" spacing={1} sx={{ px: 1.5, py: 0.75, borderBottom: 1, borderColor: 'divider' }}>
                  <TextField size="small" variant="standard" value={p.name} sx={{ flex: 1.4 }}
                    onChange={(e) => updateProp(p.id, 'name', e.target.value)} />
                  <TextField size="small" variant="standard" value={p.uprn} sx={{ flex: 1.2 }}
                    onChange={(e) => updateProp(p.id, 'uprn', e.target.value)} />
                  <TextField size="small" variant="standard" value={p.postcode} sx={{ flex: 1 }}
                    onChange={(e) => updateProp(p.id, 'postcode', e.target.value)} />
                  <TextField size="small" variant="standard" type="number" sx={{ width: 130 }}
                    inputProps={{ min: 0, max: 99, style: { textAlign: 'center' } }}
                    value={p.permissionLimit}
                    onChange={(e) => updateProp(p.id, 'permissionLimit', +e.target.value)} />
                  <IconButton size="small" onClick={() => removeProp(p.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Box>
          )}
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={1}
        sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', position: 'sticky', bottom: 0, bgcolor: 'background.paper' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={submit}>
          {street ? 'Save Changes' : 'Create'}
        </Button>
      </Stack>
    </Drawer>
  );
}

// ─────────────────────────────────────────────────────────────
// Blacklist duration dialog
// ─────────────────────────────────────────────────────────────
function BlacklistDialog({
  open, onClose, onConfirm, target,
}: {
  open: boolean; onClose: () => void; onConfirm: (duration: string, from?: string, to?: string) => void; target?: string;
}) {
  const [duration, setDuration] = useState(BLACKLIST_DURATIONS[0]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Blacklist {target || 'Selected'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField select label="Duration" fullWidth value={duration}
            onChange={(e) => setDuration(e.target.value)}>
            {BLACKLIST_DURATIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </TextField>
          {duration === 'Custom Date Range' && (
            <Stack direction="row" spacing={2}>
              <TextField label="From Date" type="date" fullWidth InputLabelProps={{ shrink: true }}
                value={from} onChange={(e) => setFrom(e.target.value)} />
              <TextField label="To Date" type="date" fullWidth InputLabelProps={{ shrink: true }}
                value={to} onChange={(e) => setTo(e.target.value)} />
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />}
          onClick={() => { onConfirm(duration, from, to); onClose(); }}>
          Blacklist
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Streets page (3 tabs)
// ─────────────────────────────────────────────────────────────
export function StreetsPage() {
  const showToast = useToast();
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState('');
  const [rows, setRows] = usePersistentState<Street[]>('prototype:area:streets:rows', seedStreets);
  const [blackStreets, setBlackStreets] = usePersistentState<BlackStreet[]>('prototype:area:streets:black-streets', () => seedBlackStreets(seedStreets()));
  const [blackProps, setBlackProps] = usePersistentState<BlackProperty[]>('prototype:area:streets:black-props', () => seedBlackProperties(seedStreets()));
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<Street | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; row: Street } | null>(null);
  const [blacklistOpen, setBlacklistOpen] = useState<{ target?: string; ids: string[] } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(ql) || r.usrn.toLowerCase().includes(ql));
  }, [rows, q]);

  const openAdd = () => { setSelected(null); setPanelOpen(true); };
  const openEdit = (s: Street) => { setSelected(s); setPanelOpen(true); };
  const save = (s: Street) => {
    const isEdit = rows.some((r) => r.id === s.id);
    setRows((prev) => {
      const exists = prev.some((r) => r.id === s.id);
      return exists ? prev.map((r) => (r.id === s.id ? s : r)) : [s, ...prev];
    });
    showToast(isEdit ? 'Street updated successfully' : 'Street created successfully', 'success');
  };
  const remove = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));
  const bulkDelete = () => { setRows((prev) => prev.filter((r) => !selection.includes(r.id))); setSelection([]); };
  const confirmBlacklist = (duration: string, from?: string, to?: string) => {
    const label = duration === 'Custom Date Range' ? `${from} → ${to}` : duration;
    if (!blacklistOpen) return;
    const toMove = rows.filter((r) => blacklistOpen.ids.includes(r.id));
    setBlackStreets((prev) => [
      ...prev,
      ...toMove.map((s) => ({ ...s, id: `bs-${s.id}`, blacklistedUntil: label, reason: '—' })),
    ]);
    setRows((prev) => prev.filter((r) => !blacklistOpen.ids.includes(r.id)));
    setSelection([]);
    showToast('Street blacklisted successfully', 'success');
  };

  const whiteCols: GridColDef<Street>[] = [
    { field: 'name', headerName: 'Street Name', flex: 1.4, minWidth: 180 },
    { field: 'noOfProperties', headerName: 'No. Of Properties', width: 150, type: 'number' },
    { field: 'createdOn', headerName: 'Created On', width: 150 },
    { field: 'createdByUser', headerName: 'Created By', width: 140 },
    { field: 'updatedOn', headerName: 'Updated On', width: 150 },
    { field: 'updatedByUser', headerName: 'Updated By', width: 140 },
    { field: 'status', headerName: 'Status', width: 110,
      renderCell: (p) => <Chip size="small" variant="outlined" label={p.value}
        color={p.value === 'Active' ? 'success' : 'default'} /> },
    {
      field: 'actions', headerName: 'Actions', width: 80, sortable: false,
      renderCell: (p) => (
        <IconButton size="small" onClick={(e) => setMenuAnchor({ el: e.currentTarget, row: p.row })}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const blackStreetCols: GridColDef<BlackStreet>[] = [
    { field: 'name', headerName: 'Street Name', flex: 1.4, minWidth: 180 },
    { field: 'town', headerName: 'Town', width: 140 },
    { field: 'blacklistedUntil', headerName: 'Blacklisted Until', width: 170 },
    { field: 'reason', headerName: 'Reason', flex: 1, minWidth: 160 },
    { field: 'createdOn', headerName: 'Created On', width: 150 },
    { field: 'createdByUser', headerName: 'Created By', width: 140 },
    {
      field: 'actions', headerName: 'Actions', width: 100, sortable: false,
      renderCell: () => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit expiry"><IconButton size="small"><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Remove from blacklist"><IconButton size="small"><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ];

  const blackPropCols: GridColDef<BlackProperty>[] = [
    { field: 'name', headerName: 'Property', flex: 1, minWidth: 140 },
    { field: 'uprn', headerName: 'UPRN', width: 150 },
    { field: 'street', headerName: 'Street', flex: 1.2, minWidth: 160 },
    { field: 'town', headerName: 'Town', width: 140 },
    { field: 'blacklistedUntil', headerName: 'Blacklisted Until', width: 170 },
    { field: 'reason', headerName: 'Reason', flex: 1, minWidth: 160 },
    {
      field: 'actions', headerName: 'Actions', width: 100, sortable: false,
      renderCell: () => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit expiry"><IconButton size="small"><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Remove from blacklist"><IconButton size="small"><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Area" title="Streets"
        description="White-list streets containing permit-eligible properties; blacklist streets or individual properties for restrictions." />

      <Tabs value={tab} onChange={(_, v) => { setTab(v); setSelection([]); }} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tab label="White List" />
        <Tab label="Black List Street" />
        <Tab label="Black List Property" />
      </Tabs>

      {/* Toolbar row */}
      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <TextField size="small" placeholder={
          tab === 0 ? 'Search by Street Name' : tab === 1 ? 'Search by Street Name' : 'Search by Property or UPRN'
        } value={q} onChange={(e) => setQ(e.target.value)} sx={{ flex: 1, maxWidth: 420 }} />
        {tab === 0 && selection.length > 0 && (
          <>
            <Button variant="outlined" color="warning" startIcon={<BlockIcon />}
              onClick={() => setBlacklistOpen({ target: `${selection.length} streets`, ids: selection.map(String) })}>
              Black List
            </Button>
            <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} onClick={bulkDelete}>
              Delete
            </Button>
          </>
        )}
        <Box sx={{ flex: 1 }} />
        {tab === 0 && (
          <>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => showToast('Sample downloaded', 'success')}>Download Sample</Button>
            <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setImportOpen(true)}>Import</Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Street</Button>
          </>
        )}
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        {tab === 0 && (
          <DataGrid<Street>
            rows={filtered} columns={whiteCols} autoHeight checkboxSelection
            rowSelectionModel={selection} onRowSelectionModelChange={setSelection}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} />
        )}
        {tab === 1 && (
          <DataGrid<BlackStreet>
            rows={blackStreets} columns={blackStreetCols} autoHeight
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} />
        )}
        {tab === 2 && (
          <DataGrid<BlackProperty>
            rows={blackProps} columns={blackPropCols} autoHeight
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} />
        )}
      </Box>

      {/* Row action menu */}
      <Menu anchorEl={menuAnchor?.el} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => { if (menuAnchor) { openEdit(menuAnchor.row); setMenuAnchor(null); } }}>
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { if (menuAnchor) { setBlacklistOpen({ target: menuAnchor.row.name, ids: [menuAnchor.row.id] }); setMenuAnchor(null); } }}>
          <BlockIcon fontSize="small" sx={{ mr: 1 }} /> Add to Blacklist
        </MenuItem>
        <MenuItem onClick={() => { if (menuAnchor) { setConfirmDeleteId(menuAnchor.row.id); setMenuAnchor(null); } }}>
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <StreetSlider open={panelOpen} onClose={() => setPanelOpen(false)} street={selected} onSave={save} />
      <BlacklistDialog open={!!blacklistOpen} onClose={() => setBlacklistOpen(null)}
        onConfirm={confirmBlacklist} target={blacklistOpen?.target} />

      <ImportCsvDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        entityName="streets"
        onImport={() => {}}
      />
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Street?"
        message="This cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={() => { remove(confirmDeleteId!); showToast('Street deleted successfully', 'success'); setConfirmDeleteId(null); }}
        onClose={() => setConfirmDeleteId(null)}
      />
    </>
  );
}
