import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
  IconButton, MenuItem, Stack, TextField, Tooltip, Typography, Menu, Divider,
  Accordion, AccordionSummary, AccordionDetails, Alert, RadioGroup, FormControlLabel, Radio,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
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
  const allStreets = useMemo(() => seedStreets(), []);
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
  const [rows, setRows] = useState<Zone[]>(seedZones);
  const [q, setQ] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<Zone | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; row: Zone } | null>(null);
  const [confirm, setConfirm] = useState<{ kind: 'delete' | 'publish' | 'unpublish'; row: Zone } | null>(null);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(ql));
  }, [rows, q]);

  const save = (z: Zone) =>
    setRows((prev) => {
      const exists = prev.some((r) => r.id === z.id);
      return exists ? prev.map((r) => (r.id === z.id ? z : r)) : [z, ...prev];
    });

  const publish = (id: string, s: 'Published' | 'Unpublished') =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: s } : r)));

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
            <Button variant="outlined" startIcon={<DownloadIcon />}>Download Sample</Button>
            <Button variant="outlined" startIcon={<UploadFileIcon />}>Import</Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelected(null); setPanelOpen(true); }}>Add Zone</Button>
          </Stack>
        } />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField size="small" placeholder="Search by Zone Name" value={q}
          onChange={(e) => setQ(e.target.value)} sx={{ flex: 1, maxWidth: 420 }} />
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DataGrid<Zone> rows={filtered} columns={columns} autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} />
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
            <Typography>Permanently delete <b>{confirm.row.name}</b>? Only unpublished zones can be deleted.</Typography>}
          {confirm?.kind === 'publish' &&
            <Typography>Publish <b>{confirm.row.name}</b>? Permit types will be able to reference this zone.</Typography>}
          {confirm?.kind === 'unpublish' && (
            <>
              <Alert severity="warning" sx={{ mb: 1 }}>
                Any active permissions currently linked to this zone will remain valid but no new permits can be issued.
              </Alert>
              <Typography>Unpublish <b>{confirm.row.name}</b>?</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(null)}>Cancel</Button>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => {
            if (!confirm) return;
            if (confirm.kind === 'delete') setRows((prev) => prev.filter((r) => r.id !== confirm.row.id));
            if (confirm.kind === 'publish') publish(confirm.row.id, 'Published');
            if (confirm.kind === 'unpublish') publish(confirm.row.id, 'Unpublished');
            setConfirm(null);
          }}>
            {confirm?.kind === 'delete' ? 'Delete' : confirm?.kind === 'publish' ? 'Publish' : 'Unpublish'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
