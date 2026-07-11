import { useMemo, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
  IconButton, MenuItem, Stack, TextField, Typography, Menu, Divider,
  Accordion, AccordionSummary, AccordionDetails, Alert, Chip,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
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

type SpecialEvent = {
  id: string;
  name: string;
  noOfProperties: number;
  noOfPermission: number;
  startDate: string;
  endDate: string;
  createdOn: string;
  createdByUser: string;
  updatedOn: string;
  updatedByUser: string;
  streets: Street[];
  permissions: string[];
};

const PERMS = ['Residents Permit', 'Business Permit', 'Visitor Permit', 'Contractor Permit'];

const seedEvents = (): SpecialEvent[] => {
  const s = seedStreets();
  return ['Christmas Market', 'Marathon 2026', 'Summer Fair', 'Film Shoot'].map((n, i) => ({
    id: `se-${i + 1}`,
    name: n,
    noOfProperties: s.slice(i, i + 2).reduce((a, x) => a + x.properties.length, 0),
    noOfPermission: (i % 3) + 1,
    startDate: `2026-${String((i % 12) + 1).padStart(2, '0')}-15`,
    endDate: `2026-${String((i % 12) + 1).padStart(2, '0')}-22`,
    createdOn: `2025-${String((i % 12) + 1).padStart(2, '0')}-10 09:12`,
    createdByUser: 'admin.user',
    updatedOn: `2026-${String((i % 6) + 1).padStart(2, '0')}-02 14:22`,
    updatedByUser: 'ops.team',
    streets: s.slice(i, i + 2),
    permissions: PERMS.slice(0, (i % 3) + 1),
  }));
};

function SpecialEventSlider({
  open, onClose, event, onSave,
}: {
  open: boolean; onClose: () => void; event: SpecialEvent | null; onSave: (e: SpecialEvent) => void;
}) {
  const [form, setForm] = useState<SpecialEvent>({
    id: '', name: '', noOfProperties: 0, noOfPermission: 0,
    startDate: '', endDate: '',
    createdOn: '', createdByUser: '', updatedOn: '', updatedByUser: '',
    streets: [], permissions: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [persistedStreets] = usePersistentState<Street[]>('prototype:area:streets:rows', seedStreets);
  const allStreets = useMemo(
    () => (persistedStreets && persistedStreets.length > 0 ? persistedStreets : seedStreets()),
    [persistedStreets]
  );
  const [addStreet, setAddStreet] = useState('');

  useMemo(() => {
    if (event) setForm(event);
    else setForm({
      id: `se-${Date.now()}`, name: '', noOfProperties: 0, noOfPermission: 0,
      startDate: '', endDate: '',
      createdOn: new Date().toISOString().slice(0, 10),
      createdByUser: 'you',
      updatedOn: new Date().toISOString().slice(0, 10),
      updatedByUser: 'you',
      streets: [], permissions: [],
    });
    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, event?.id]);

  const attach = () => {
    if (!addStreet) return;
    const s = allStreets.find((x) => x.id === addStreet);
    if (!s || form.streets.some((x) => x.id === s.id)) return;
    setForm({ ...form, streets: [...form.streets, s] });
    setAddStreet('');
  };

  const submit = () => {
    if (!form.name.trim()) return setError('Event Name is required');
    if (!form.startDate || !form.endDate) return setError('Start and End dates are required');
    if (form.startDate > form.endDate) return setError('Start date must be before End date');
    if (form.streets.length === 0) return setError('Attach at least one street.');
    onSave({
      ...form,
      noOfProperties: form.streets.reduce((a, s) => a + s.properties.length, 0),
      noOfPermission: form.permissions.length,
    });
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 780 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>Special Event</Typography>
          <Typography variant="h6" fontWeight={700}>{event ? 'Edit Special Event' : 'New Special Event'}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </Stack>

      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2}>
          <TextField label="Event Name" required fullWidth value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Stack direction="row" spacing={2}>
            <TextField label="Start Date" type="date" required fullWidth InputLabelProps={{ shrink: true }}
              value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <TextField label="End Date" type="date" required fullWidth InputLabelProps={{ shrink: true }}
              value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </Stack>

          <TextField select label="Applicable Permissions" fullWidth
            SelectProps={{ multiple: true }} value={form.permissions}
            onChange={(e) => setForm({ ...form, permissions: e.target.value as any })}>
            {PERMS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </TextField>

          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" fontWeight={700}>Streets in Event ({form.streets.length})</Typography>

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
                <Typography fontWeight={600}>{s.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1, alignSelf: 'center' }}>
                  {s.properties.length} properties
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={0.5}>
                  {s.properties.map((p) => (
                    <Typography key={p.id} variant="body2">
                      {p.name} · UPRN {p.uprn} · Limit {p.permissionLimit}
                    </Typography>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={1}
        sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', position: 'sticky', bottom: 0, bgcolor: 'background.paper' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={submit}>
          {event ? 'Save Changes' : 'Create'}
        </Button>
      </Stack>
    </Drawer>
  );
}

export function SpecialEventsPage() {
  const showToast = useToast();
  const [rows, setRows] = usePersistentState<SpecialEvent[]>('prototype:area:special-events:rows', seedEvents);
  const [q, setQ] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<SpecialEvent | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; row: SpecialEvent } | null>(null);
  const [deleting, setDeleting] = useState<SpecialEvent | null>(null);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(ql));
  }, [rows, q]);

  const save = (e: SpecialEvent) => {
    const isEdit = rows.some((r) => r.id === e.id);
    setRows((prev) => {
      const exists = prev.some((r) => r.id === e.id);
      return exists ? prev.map((r) => (r.id === e.id ? e : r)) : [e, ...prev];
    });
    showToast(isEdit ? 'Special Event updated successfully' : 'Special Event created successfully', 'success');
  };

  const bulkDelete = () => {
    const ids = new Set(selection.map(String));
    setRows(rows.filter((r) => !ids.has(String(r.id))));
    setSelection([]);
    showToast(`${ids.size} event(s) deleted`, 'success');
  };

  const columns: GridColDef<SpecialEvent>[] = [
    { field: 'name', headerName: 'Name', flex: 1.4, minWidth: 180 },
    { field: 'startDate', headerName: 'Start Date', width: 130 },
    { field: 'endDate', headerName: 'End Date', width: 130 },
    { field: 'noOfProperties', headerName: 'No. of Properties', width: 160, type: 'number' },
    {
      field: 'noOfPermission', headerName: 'No. of Permissions', width: 170, type: 'number',
      renderCell: (p) => <Chip size="small" variant="outlined" label={p.value} />,
    },
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
      <PageHeader eyebrow="Area" title="Special Events"
        description="Time-bounded events that override normal permit rules for specific streets."
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => showToast('Sample downloaded', 'info')}>Download Sample</Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelected(null); setPanelOpen(true); }}>Add Event</Button>
          </Stack>
        } />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2} alignItems="center">
        <TextField size="small" placeholder="Search…" value={q}
          onChange={(e) => setQ(e.target.value)} sx={{ flex: 1, maxWidth: 420 }} />
        {selection.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {selection.length} Row Selected
            </Typography>
            <Button variant="outlined" color="error" onClick={bulkDelete}>Delete</Button>
          </>
        )}
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DataGrid<SpecialEvent> rows={filtered} columns={columns} autoHeight
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
        <MenuItem onClick={() => { if (menuAnchor) { setDeleting(menuAnchor.row); setMenuAnchor(null); } }}>
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <SpecialEventSlider open={panelOpen} onClose={() => setPanelOpen(false)} event={selected} onSave={save} />

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Special Event?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to permanently delete <b>{deleting?.name}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => {
            if (deleting) setRows((prev) => prev.filter((r) => r.id !== deleting.id));
            showToast('Special Event deleted successfully', 'success');
            setDeleting(null);
          }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
