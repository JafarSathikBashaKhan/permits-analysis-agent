import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
  IconButton, MenuItem, Stack, TextField, Typography, Alert, Divider,
  RadioGroup, FormControlLabel, Radio, Checkbox,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';

const FIELD_TYPES = ['Text', 'Number', 'Single Select', 'Multi Select', 'Date', 'Checkbox', 'Radio'];

type AdditionalField = {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  options?: string;
};

type PurchaseReason = {
  id: string;
  reason: string;
  permissionType: 'Suspension' | 'Dispensation' | 'Both';
  fields: AdditionalField[];
  referenced: boolean;
  createdByUser: string;
  createdOn: string;
  updatedByUser: string;
};

const seedReasons = (): PurchaseReason[] => [
  { id: 'pr-1', reason: 'Roadworks', permissionType: 'Suspension',
    fields: [{ id: 'f1', label: 'Works Order Number', type: 'Text', required: true }],
    referenced: true, createdByUser: 'admin.user', createdOn: '2025-11-14 09:12', updatedByUser: 'ops.team' },
  { id: 'pr-2', reason: 'Skip Delivery', permissionType: 'Dispensation',
    fields: [{ id: 'f2', label: 'Skip Size', type: 'Single Select', required: false, options: 'Small,Medium,Large' }],
    referenced: false, createdByUser: 'admin.user', createdOn: '2025-11-15 10:22', updatedByUser: 'ops.team' },
  { id: 'pr-3', reason: 'Film Shoot', permissionType: 'Both', fields: [],
    referenced: true, createdByUser: 'admin.user', createdOn: '2025-11-18 11:03', updatedByUser: 'ops.team' },
  { id: 'pr-4', reason: 'House Move', permissionType: 'Dispensation',
    fields: [
      { id: 'f4a', label: 'Van Registration', type: 'Text', required: true },
      { id: 'f4b', label: 'Move Date', type: 'Date', required: true },
    ],
    referenced: false, createdByUser: 'admin.user', createdOn: '2025-12-01 08:45', updatedByUser: 'ops.team' },
];

function ReasonPanel({
  open, onClose, reason, onSave,
}: {
  open: boolean; onClose: () => void; reason: PurchaseReason | null; onSave: (r: PurchaseReason) => void;
}) {
  const [form, setForm] = useState<PurchaseReason>({
    id: '', reason: '', permissionType: 'Suspension', fields: [],
    referenced: false, createdByUser: '', createdOn: '', updatedByUser: '',
  });
  const [error, setError] = useState<string | null>(null);

  useMemo(() => {
    if (reason) setForm(reason);
    else setForm({
      id: `pr-${Date.now()}`, reason: '', permissionType: 'Suspension', fields: [],
      referenced: false, createdByUser: 'you',
      createdOn: new Date().toISOString().slice(0, 10),
      updatedByUser: 'you',
    });
    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reason?.id]);

  const addField = () =>
    setForm((f) => ({ ...f, fields: [...f.fields, { id: `f-${Date.now()}`, label: '', type: 'Text', required: false }] }));
  const removeField = (id: string) =>
    setForm((f) => ({ ...f, fields: f.fields.filter((x) => x.id !== id) }));
  const updateField = (id: string, key: keyof AdditionalField, val: any) =>
    setForm((f) => ({ ...f, fields: f.fields.map((x) => x.id === id ? { ...x, [key]: val } : x) }));

  const submit = () => {
    if (!form.reason.trim()) return setError('Purchase Reason is required');
    onSave(form);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 760 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>Purchase Reason</Typography>
          <Typography variant="h6" fontWeight={700}>{reason ? 'Edit Purchase Reason' : 'New Purchase Reason'}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </Stack>
      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2}>
          <TextField label="Purchase Reason" required fullWidth value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          <Box>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Permission Type</Typography>
            <RadioGroup row value={form.permissionType}
              onChange={(e) => setForm({ ...form, permissionType: e.target.value as any })}>
              <FormControlLabel value="Suspension" control={<Radio size="small" />} label="Suspension" />
              <FormControlLabel value="Dispensation" control={<Radio size="small" />} label="Dispensation" />
              <FormControlLabel value="Both" control={<Radio size="small" />} label="Both" />
            </RadioGroup>
          </Box>

          <Divider />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={700}>Additional Fields ({form.fields.length})</Typography>
            <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={addField}>Add Field</Button>
          </Stack>
          {form.fields.map((f) => (
            <Box key={f.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Stack spacing={1.5} sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <TextField size="small" label="Field Label" required fullWidth value={f.label}
                      onChange={(e) => updateField(f.id, 'label', e.target.value)} />
                    <TextField size="small" select label="Field Type" required sx={{ minWidth: 170 }} value={f.type}
                      onChange={(e) => updateField(f.id, 'type', e.target.value)}>
                      {FIELD_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </TextField>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField size="small" label="Placeholder" fullWidth value={f.placeholder || ''}
                      onChange={(e) => updateField(f.id, 'placeholder', e.target.value)} />
                    <FormControlLabel control={
                      <Checkbox size="small" checked={f.required}
                        onChange={(e) => updateField(f.id, 'required', e.target.checked)} />
                    } label="Required" />
                  </Stack>
                  {f.type === 'Number' && (
                    <Stack direction="row" spacing={1}>
                      <TextField size="small" type="number" label="Min Value" fullWidth value={f.minValue ?? ''}
                        onChange={(e) => updateField(f.id, 'minValue', +e.target.value)} />
                      <TextField size="small" type="number" label="Max Value" fullWidth value={f.maxValue ?? ''}
                        onChange={(e) => updateField(f.id, 'maxValue', +e.target.value)} />
                    </Stack>
                  )}
                  {['Single Select', 'Multi Select', 'Checkbox', 'Radio'].includes(f.type) && (
                    <TextField size="small" label="Options (comma separated)" fullWidth value={f.options || ''}
                      onChange={(e) => updateField(f.id, 'options', e.target.value)} />
                  )}
                </Stack>
                <IconButton size="small" onClick={() => removeField(f.id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
      <Stack direction="row" justifyContent="flex-end" spacing={1}
        sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', position: 'sticky', bottom: 0, bgcolor: 'background.paper' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={submit}>
          {reason ? 'Save Changes' : 'Create'}
        </Button>
      </Stack>
    </Drawer>
  );
}

export function PurchaseReasonPage() {
  const [rows, setRows] = usePersistentState<PurchaseReason[]>('prototype:purchase-reason:rows', seedReasons);
  const [q, setQ] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<PurchaseReason | null>(null);
  const [deleting, setDeleting] = useState<PurchaseReason | null>(null);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return rows;
    return rows.filter((r) => r.reason.toLowerCase().includes(ql) || r.permissionType.toLowerCase().includes(ql));
  }, [rows, q]);

  const save = (r: PurchaseReason) =>
    setRows((prev) => {
      const exists = prev.some((x) => x.id === r.id);
      return exists ? prev.map((x) => (x.id === r.id ? r : x)) : [r, ...prev];
    });

  const columns: GridColDef<PurchaseReason>[] = [
    {
      field: 'reason', headerName: 'Purchase Reason', flex: 1.4, minWidth: 180,
      renderCell: (p) => (
        <Button size="small" variant="text" onClick={() => { setSelected(p.row); setPanelOpen(true); }}>
          {p.value}
        </Button>
      ),
    },
    {
      field: 'fields', headerName: 'Additional Fields', width: 180, sortable: false,
      renderCell: (p) => {
        const n = (p.value as AdditionalField[]).length;
        return n > 0
          ? <Chip size="small" variant="outlined" label={`${n} field${n > 1 ? 's' : ''}`} />
          : <Typography variant="body2" color="text.secondary">—</Typography>;
      },
    },
    { field: 'permissionType', headerName: 'Permission Type', width: 150 },
    { field: 'createdByUser', headerName: 'Created By', width: 140 },
    { field: 'createdOn', headerName: 'Created On', width: 160 },
    { field: 'updatedByUser', headerName: 'Last Updated By', width: 170 },
    {
      field: 'actions', headerName: 'Actions', width: 100, sortable: false,
      renderCell: (p) => (
        <IconButton size="small" onClick={() => setDeleting(p.row)}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Permission Setup" title="Purchase Reason"
        description="Reasons offered to applicants (Suspension / Dispensation) with optional collection fields."
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="text" startIcon={<DownloadIcon />}>Export</Button>
            <Button variant="outlined" startIcon={<UploadFileIcon />}>Import</Button>
            <Button variant="contained" startIcon={<AddIcon />}
              onClick={() => { setSelected(null); setPanelOpen(true); }}>
              Add Purchase Reason
            </Button>
          </Stack>
        } />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField size="small" placeholder="Search by Purchase Reason, Permission Type" value={q}
          onChange={(e) => setQ(e.target.value)} sx={{ flex: 1, maxWidth: 420 }} />
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DataGrid<PurchaseReason> rows={filtered} columns={columns} autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} />
      </Box>

      <ReasonPanel open={panelOpen} onClose={() => setPanelOpen(false)}
        reason={selected} onSave={save} />

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Purchase Reason?</DialogTitle>
        <DialogContent>
          {deleting?.referenced ? (
            <Alert severity="warning">
              This reason is currently referenced by one or more applications and cannot be removed.
            </Alert>
          ) : (
            <Typography>
              Deleting this reason will remove it from future purchases. Existing records won't be affected. Are you sure you want to continue?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>{deleting?.referenced ? 'OK' : 'Cancel'}</Button>
          {!deleting?.referenced && (
            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => {
              if (deleting) setRows((prev) => prev.filter((r) => r.id !== deleting.id));
              setDeleting(null);
            }}>Delete</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
