import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
  IconButton, MenuItem, Stack, TextField, Typography, Menu, Divider,
  Accordion, AccordionSummary, AccordionDetails, Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageHeader } from '../../shared/PageHeader';
import { seedStreets, Street } from './areaFixtures';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';
import { ImportCsvDialog } from '../../components/dialogs/ImportCsvDialog';

type Location = {
  id: string;
  name: string;
  mappedStreets: number;
  noofProperties: number;
  createdOn: string;
  createdByUser: string;
  updatedOn: string;
  updatedByUser: string;
  streets: Street[];
};

const seedLocations = (): Location[] => {
  const s = seedStreets();
  const defs = ['Central Depot', 'North Yard', 'South Yard', 'Riverside Compound'];
  return defs.map((n, i) => ({
    id: `loc-${i + 1}`,
    name: n,
    mappedStreets: i + 2,
    noofProperties: s.slice(i, i + 2 + i).reduce((a, x) => a + x.properties.length, 0),
    createdOn: `2025-${String((i % 12) + 1).padStart(2, '0')}-10 09:12`,
    createdByUser: 'admin.user',
    updatedOn: `2026-${String((i % 6) + 1).padStart(2, '0')}-02 14:22`,
    updatedByUser: 'ops.team',
    streets: s.slice(i, i + 2 + i),
  }));
};

function LocationSlider({
  open, onClose, location, onSave,
}: {
  open: boolean; onClose: () => void; location: Location | null; onSave: (l: Location) => void;
}) {
  const [form, setForm] = useState<Location>({
    id: '', name: '', mappedStreets: 0, noofProperties: 0,
    createdOn: '', createdByUser: '', updatedOn: '', updatedByUser: '', streets: [],
  });
  const [error, setError] = useState<string | null>(null);
  const allStreets = useMemo(() => seedStreets(), []);
  const [addStreet, setAddStreet] = useState('');

  useMemo(() => {
    if (location) setForm(location);
    else setForm({
      id: `loc-${Date.now()}`, name: '', mappedStreets: 0, noofProperties: 0,
      createdOn: new Date().toISOString().slice(0, 10),
      createdByUser: 'you',
      updatedOn: new Date().toISOString().slice(0, 10),
      updatedByUser: 'you',
      streets: [],
    });
    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, location?.id]);

  const attach = () => {
    if (!addStreet) return;
    const s = allStreets.find((x) => x.id === addStreet);
    if (!s || form.streets.some((x) => x.id === s.id)) return;
    setForm({ ...form, streets: [...form.streets, s] });
    setAddStreet('');
  };
  const detach = (id: string) =>
    setForm({ ...form, streets: form.streets.filter((s) => s.id !== id) });

  const submit = () => {
    if (!form.name.trim()) return setError('Location Name is required');
    if (form.streets.length === 0) return setError('Attach at least one street.');
    onSave({
      ...form,
      mappedStreets: form.streets.length,
      noofProperties: form.streets.reduce((a, s) => a + s.properties.length, 0),
    });
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 780 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>Location</Typography>
          <Typography variant="h6" fontWeight={700}>{location ? 'Edit Location' : 'New Location'}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </Stack>

      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2}>
          <TextField label="Location Name" required fullWidth value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

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
                    <Typography variant="caption" color="text.secondary">{s.town} · {s.properties.length} properties</Typography>
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
          {location ? 'Save Changes' : 'Create'}
        </Button>
      </Stack>
    </Drawer>
  );
}

export function LocationsPage() {
  const showToast = useToast();
  const [rows, setRows] = usePersistentState<Location[]>('prototype:area:locations:rows', seedLocations);
  const [q, setQ] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<Location | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; row: Location } | null>(null);
  const [deleting, setDeleting] = useState<Location | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(ql));
  }, [rows, q]);

  const save = (l: Location) => {
    const isEdit = rows.some((r) => r.id === l.id);
    setRows((prev) => {
      const exists = prev.some((r) => r.id === l.id);
      return exists ? prev.map((r) => (r.id === l.id ? l : r)) : [l, ...prev];
    });
    showToast(isEdit ? 'Location updated successfully' : 'Location created successfully', 'success');
  };

  const columns: GridColDef<Location>[] = [
    { field: 'name', headerName: 'Location Name', flex: 1.4, minWidth: 180 },
    { field: 'mappedStreets', headerName: 'No of Streets', width: 140, type: 'number' },
    { field: 'noofProperties', headerName: 'No. of Properties', width: 160, type: 'number' },
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
      <PageHeader eyebrow="Area" title="Locations"
        description="Named collections of streets used by parking enforcement and physical permit logistics."
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => showToast('Sample downloaded', 'info')}>Download Sample</Button>
            <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setImportOpen(true)}>Import</Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelected(null); setPanelOpen(true); }}>Add Location</Button>
          </Stack>
        } />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField size="small" placeholder="Search by Location Name" value={q}
          onChange={(e) => setQ(e.target.value)} sx={{ flex: 1, maxWidth: 420 }} />
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DataGrid<Location> rows={filtered} columns={columns} autoHeight
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

      <LocationSlider open={panelOpen} onClose={() => setPanelOpen(false)} location={selected} onSave={save} />

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Location?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to permanently delete <b>{deleting?.name}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => {
            if (deleting) setRows((prev) => prev.filter((r) => r.id !== deleting.id));
            showToast('Location deleted successfully', 'success');
            setDeleting(null);
          }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <ImportCsvDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        entityName="locations"
        onImport={() => {}}
      />
    </>
  );
}