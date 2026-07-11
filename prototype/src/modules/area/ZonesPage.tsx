import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
  IconButton, MenuItem, Stack, TextField, Tooltip, Typography, Menu, Divider,
  Accordion, AccordionSummary, AccordionDetails, Alert, RadioGroup, FormControlLabel, Radio,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageHeader } from '../../shared/PageHeader';
import { seedStreets, Street } from './areaFixtures';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';
import { ImportCsvDialog } from '../../components/dialogs/ImportCsvDialog';

type Zone = {
  id: string;
  name: string;
  streetCount: number;
  status: 'Published' | 'Unpublished';
  isBackOfficeUse: boolean;
  createdOn: string;
  createdByUser: string;
  updatedOn: string;
  updatedByUser: string;
  streets: Street[];
};

const seedZones = (): Zone[] => {
  const streets = seedStreets();
  const zoneDefs = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F'];
  return zoneDefs.map((n, i) => ({
    id: `z-${i + 1}`,
    name: n,
    streetCount: (i + 2),
    status: i % 3 === 0 ? 'Unpublished' : 'Published',
    isBackOfficeUse: i % 2 === 0,
    createdOn: `2025-${String((i % 12) + 1).padStart(2, '0')}-10 09:12`,
    createdByUser: 'admin.user',
    updatedOn: `2026-${String((i % 6) + 1).padStart(2, '0')}-02 14:22`,
    updatedByUser: 'ops.team',
    streets: streets.slice(i * 2, i * 2 + (i + 2)),
  }));
};

function ZoneSlider({
  open, onClose, zone, onSave,
}: {
  open: boolean; onClose: () => void; zone: Zone | null; onSave: (z: Zone) => void;
}) {
  const [form, setForm] = useState<Zone>({
    id: '', name: '', streetCount: 0, status: 'Unpublished', isBackOfficeUse: false,
    createdOn: '', createdByUser: '', updatedOn: '', updatedByUser: '', streets: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [persistedStreets] = usePersistentState<Street[]>('prototype:area:streets:rows', seedStreets);
  const allStreets = useMemo(
    () => (persistedStreets && persistedStreets.length > 0 ? persistedStreets : seedStreets()),
    [persistedStreets]
  );
  const [addStreet, setAddStreet] = useState('');

  useMemo(() => {
    if (zone) setForm(zone);
    else setForm({
      id: `z-${Date.now()}`, name: '', streetCount: 0, status: 'Unpublished',
      isBackOfficeUse: false,
      createdOn: new Date().toISOString().slice(0, 10),
      createdByUser: 'you',
      updatedOn: new Date().toISOString().slice(0, 10),
      updatedByUser: 'you',
      streets: [],
    });
    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, zone?.id]);

  const attach = () => {
    if (!addStreet) return;
    const s = allStreets.find((x) => x.id === addStreet);
    if (!s || form.streets.some((x) => x.id === s.id)) return;
    setForm({ ...form, streets: [...form.streets, s], streetCount: form.streets.length + 1 });
    setAddStreet('');
  };
  const detach = (id: string) =>
    setForm({ ...form, streets: form.streets.filter((s) => s.id !== id), streetCount: form.streets.length - 1 });

  const submit = () => {
    if (!form.name.trim()) return setError('Zone Name is required');
    if (form.streets.length === 0) return setError('This zone must be mapped to at least one street before it can be saved.');
    onSave({ ...form, streetCount: form.streets.length });
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 780 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>Zone</Typography>
          <Typography variant="h6" fontWeight={700}>{zone ? 'Edit Zone' : 'New Zone'}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </Stack>

      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2}>
          <TextField label="Zone Name" required fullWidth inputProps={{ maxLength: 100 }}
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Box>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Back Office Use</Typography>
            <RadioGroup row value={form.isBackOfficeUse ? 'enable' : 'disable'}
              onChange={(e) => setForm({ ...form, isBackOfficeUse: e.target.value === 'enable' })}>
              <FormControlLabel value="enable" control={<Radio size="small" />} label="Enable" />
              <FormControlLabel value="disable" control={<Radio size="small" />} label="Disable" />
            </RadioGroup>
          </Box>

          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" fontWeight={700}>Mapped Streets ({form.streets.length})</Typography>

          <Stack direction="row" spacing={1}>
            <TextField select size="small" fullWidth label="Add Street" value={addStreet}
              onChange={(e) => setAddStreet(e.target.value)}>
              {allStreets
                .filter((s) => !form.streets.some((x) => x.id === s.id))
                .map((s) => <MenuItem key={s.id} value={s.id}>{s.name} — {s.town}</MenuItem>)}
            </TextField>
            <Button variant="outlined" onClick={attach} startIcon={<AddIcon />}>Attach</Button>
          </Stack>

          {form.streets.map((s) => (
            <Accordion key={s.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', pr: 1 }}>
                  <Box>
                    <Typography fontWeight={600}>{s.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.usrn} · {s.town} · {s.properties.length} properties</Typography>
                  </Box>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); detach(s.id); }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                  <Stack direction="row" sx={{ px: 1.5, py: 1, bgcolor: 'grey.100' }}>
                    <Typography variant="caption" fontWeight={700} sx={{ flex: 1 }}>Property</Typography>
                    <Typography variant="caption" fontWeight={700} sx={{ flex: 1 }}>UPRN</Typography>
                    <Typography variant="caption" fontWeight={700} sx={{ width: 130, textAlign: 'center' }}>Permission Limit</Typography>
                  </Stack>
                  {s.properties.map((p) => (
                    <Stack key={p.id} direction="row" sx={{ px: 1.5, py: 0.5, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="body2" sx={{ flex: 1 }}>{p.name}</Typography>
                      <Typography variant="body2" sx={{ flex: 1 }}>{p.uprn}</Typography>
                      <Typography variant="body2" sx={{ width: 130, textAlign: 'center' }}>{p.permissionLimit}</Typography>
                    </Stack>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={1}
        sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', position: 'sticky', bottom: 0, bgcolor: 'background.paper' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={submit}>
          {zone ? 'Save Changes' : 'Create'}
        </Button>
      </Stack>
    </Drawer>
  );
}

export function ZonesPage() {
  const showToast = useToast();
  const [rows, setRows] = usePersistentState<Zone[]>('prototype:area:zones:rows', seedZones);
  const [q, setQ] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<Zone | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; row: Zone } | null>(null);
  const [confirm, setConfirm] = useState<{ kind: 'delete' | 'publish' | 'unpublish'; row: Zone } | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(ql));
  }, [rows, q]);

  const save = (z: Zone) => {
    const isEdit = rows.some((r) => r.id === z.id);
    setRows((prev) => {
      const exists = prev.some((r) => r.id === z.id);
      return exists ? prev.map((r) => (r.id === z.id ? z : r)) : [z, ...prev];
    });
    showToast(isEdit ? 'Zone updated successfully' : 'Zone created successfully', 'success');
  };

  const publish = (id: string, s: 'Published' | 'Unpublished') =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: s } : r)));

  const bulkPublish = () => {
    const ids = new Set(selection.map(String));
    const selected = rows.filter((r) => ids.has(String(r.id)));
    const unpublishedCount = selected.filter((r) => r.status === 'Unpublished').length;
    const publishedCount = selected.filter((r) => r.status === 'Published').length;
    // US-163644: Better validation messages
    if (unpublishedCount === 0) {
      showToast('All selected zones are already published', 'info');
      return;
    }
    if (publishedCount > 0 && unpublishedCount > 0) {
      if (!window.confirm(`${publishedCount} out of ${ids.size} zones cannot be published. Do you want to proceed with publishing the remaining ${unpublishedCount} zone(s)?`)) {
        return;
      }
    }
    setRows((prev) => prev.map((r) => ids.has(String(r.id)) && r.status === 'Unpublished' ? { ...r, status: 'Published' } : r));
    setSelection([]);
    showToast(`${unpublishedCount} zone(s) published successfully`, 'success');
  };

  const bulkUnpublish = () => {
    const ids = new Set(selection.map(String));
    const selected = rows.filter((r) => ids.has(String(r.id)));
    const publishedCount = selected.filter((r) => r.status === 'Published').length;
    const unpublishedCount = selected.filter((r) => r.status === 'Unpublished').length;
    // US-163644: Better validation messages
    if (publishedCount === 0) {
      showToast('All selected zones are already unpublished', 'info');
      return;
    }
    if (unpublishedCount > 0 && publishedCount > 0) {
      if (!window.confirm(`${unpublishedCount} out of ${ids.size} are in draft and cannot be unpublished. Do you want to proceed with unpublishing the remaining ${publishedCount} zone(s)?`)) {
        return;
      }
    }
    setRows((prev) => prev.map((r) => ids.has(String(r.id)) && r.status === 'Published' ? { ...r, status: 'Unpublished' } : r));
    setSelection([]);
    showToast(`${publishedCount} zone(s) unpublished successfully`, 'info');
  };

  const bulkDelete = () => {
    const ids = new Set(selection.map(String));
    const selected = rows.filter((r) => ids.has(String(r.id)));
    const unpublished = selected.filter((r) => r.status === 'Unpublished');
    const published = selected.filter((r) => r.status === 'Published');
    // US-163644: Better validation messages
    if (unpublished.length === 0) {
      showToast('Only unpublished zones can be deleted. All selected zones are published.', 'error');
      return;
    }
    if (published.length > 0 && unpublished.length > 0) {
      if (!window.confirm(`${published.length} out of ${ids.size} zones are published and cannot be deleted. Do you want to proceed with deleting the remaining ${unpublished.length} zone(s)?`)) {
        return;
      }
    }
    const toDelete = new Set(unpublished.map((r) => String(r.id)));
    setRows(rows.filter((r) => !toDelete.has(String(r.id))));
    setSelection([]);
    showToast(`${unpublished.length} zone(s) deleted successfully`, 'success');
  };

  const columns: GridColDef<Zone>[] = [
    { field: 'name', headerName: 'Zone Name', flex: 1.2, minWidth: 160 },
    { field: 'streetCount', headerName: 'No. of Streets', width: 140, type: 'number' },
    { field: 'status', headerName: 'Status', width: 140,
      renderCell: (p) => <Chip size="small" variant="outlined" label={p.value}
        color={p.value === 'Published' ? 'info' : 'default'} /> },
    { field: 'createdOn', headerName: 'Created On', width: 150 },
    { field: 'createdByUser', headerName: 'Created By', width: 140 },
    { field: 'updatedOn', headerName: 'Updated On', width: 150 },
    { field: 'updatedByUser', headerName: 'Updated By', width: 140 },
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
      <PageHeader eyebrow="Area" title="Zones"
        description="Group streets into zones. Zones must be published before permissions can be issued against them."
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => {
              // Generate CSV sample (US-148740)
              const csvContent = [
                'Zone Name,Street Names (comma-separated),Is Back Office Use',
                'Zone A,"Baker Street,Church Lane",Yes',
                'Zone B,"High Street,Kingsway",No',
              ].join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'zones-import-sample.csv';
              a.click();
              URL.revokeObjectURL(url);
              showToast('Sample CSV downloaded', 'info');
            }}>Download Sample</Button>
            <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setImportOpen(true)}>Import</Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelected(null); setPanelOpen(true); }}>Add Zone</Button>
          </Stack>
        } />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2} alignItems="center">
        <TextField size="small" placeholder="Search by Zone Name" value={q}
          onChange={(e) => setQ(e.target.value)} sx={{ flex: 1, maxWidth: 420 }} />
        {selection.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {selection.length} Row Selected
            </Typography>
            <Button variant="outlined" onClick={bulkPublish}>Publish</Button>
            <Button variant="outlined" onClick={bulkUnpublish}>Unpublish</Button>
            <Button variant="outlined" color="error" onClick={bulkDelete}>Delete</Button>
          </>
        )}
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DataGrid<Zone> rows={filtered} columns={columns} autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          checkboxSelection
          rowSelectionModel={selection}
          onRowSelectionModelChange={setSelection} />
      </Box>

      <Menu anchorEl={menuAnchor?.el} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => { if (menuAnchor) { setSelected(menuAnchor.row); setPanelOpen(true); setMenuAnchor(null); } }}>
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        {menuAnchor?.row.status === 'Unpublished' && (
          <MenuItem onClick={() => { if (menuAnchor) { setConfirm({ kind: 'publish', row: menuAnchor.row }); setMenuAnchor(null); } }}>
            <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} /> Publish
          </MenuItem>
        )}
        {menuAnchor?.row.status === 'Published' && (
          <MenuItem onClick={() => { if (menuAnchor) { setConfirm({ kind: 'unpublish', row: menuAnchor.row }); setMenuAnchor(null); } }}>
            <CloudOffIcon fontSize="small" sx={{ mr: 1 }} /> Unpublish
          </MenuItem>
        )}
        {menuAnchor?.row.status !== 'Published' && (
          <MenuItem onClick={() => { if (menuAnchor) { setConfirm({ kind: 'delete', row: menuAnchor.row }); setMenuAnchor(null); } }}>
            <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        )}
      </Menu>

      <ZoneSlider open={panelOpen} onClose={() => setPanelOpen(false)} zone={selected} onSave={save} />

      <Dialog open={!!confirm} onClose={() => setConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle>
          {confirm?.kind === 'delete' && 'Delete Zone?'}
          {confirm?.kind === 'publish' && 'Publish Zone?'}
          {confirm?.kind === 'unpublish' && 'Unpublish Zone?'}
        </DialogTitle>
        <DialogContent>
          {confirm?.kind === 'delete' &&
            <Typography>Permanently delete <b>{confirm.row.name}</b>? This zone is unpublished and can be safely deleted.</Typography>}
          {confirm?.kind === 'publish' &&
            <Typography>Are you sure you want to publish <b>{confirm.row.name}</b>? Permit types will be able to reference this zone.</Typography>}
          {confirm?.kind === 'unpublish' && (
            <>
              <Alert severity="warning" sx={{ mb: 1 }}>
                Any active permissions currently linked to this zone will remain valid but no new permits can be issued.
              </Alert>
              <Typography>Are you sure you want to unpublish <b>{confirm.row.name}</b>?</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(null)}>Cancel</Button>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => {
            if (!confirm) return;
            if (confirm.kind === 'delete') { setRows((prev) => prev.filter((r) => r.id !== confirm.row.id)); showToast('Zone deleted successfully', 'success'); }
            if (confirm.kind === 'publish') { publish(confirm.row.id, 'Published'); showToast('Zone published', 'success'); }
            if (confirm.kind === 'unpublish') { publish(confirm.row.id, 'Unpublished'); showToast('Zone unpublished', 'info'); }
            setConfirm(null);
          }}>
            {confirm?.kind === 'delete' ? 'Delete' : confirm?.kind === 'publish' ? 'Publish' : 'Unpublish'}
          </Button>
        </DialogActions>
      </Dialog>

      <ImportCsvDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        entityName="zones"
        onImport={() => {}}
      />
    </>
  );
}
