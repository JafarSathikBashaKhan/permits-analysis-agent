/*
 * Custom Fields tab — allows BO user to create Single Select and Multi Select
 * custom fields that will appear in the Application Form Builder.
 *
 * Per US-135718, US-136288:
 *   - CRUD for Single Select fields (field name + list of options)
 *   - CRUD for Multi Select fields (field name + list of options)
 *   - Delete confirmation dialog
 *   - Inline add/edit/delete options
 *   - Persist per permission id
 */
import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, Grid, IconButton, MenuItem, Paper, Stack, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '../../../theme';
import { Section } from '../../../shared/Section';
import { useToast } from '../../../components/Toast';

type FieldType = 'single' | 'multi';
interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  options: string[];
}

interface CustomFieldsState {
  fields: CustomField[];
}

const DEFAULT_STATE: CustomFieldsState = {
  fields: [],
};

function FieldEditorDialog({
  open, onClose, field, onSave,
}: {
  open: boolean; onClose: () => void; field: CustomField | null; onSave: (f: CustomField) => void;
}) {
  const [form, setForm] = useState<CustomField>({
    id: '', name: '', type: 'single', options: [''],
  });
  const [error, setError] = useState<string | null>(null);

  useMemo(() => {
    if (field) {
      setForm(field);
    } else {
      setForm({ id: `cf-${Date.now()}`, name: '', type: 'single', options: [''] });
    }
    setError(null);
  }, [open, field]);

  const addOption = () => setForm({ ...form, options: [...form.options, ''] });
  const removeOption = (i: number) => setForm({ ...form, options: form.options.filter((_, idx) => idx !== i) });
  const updateOption = (i: number, val: string) => setForm({ ...form, options: form.options.map((o, idx) => idx === i ? val : o) });

  const submit = () => {
    if (!form.name.trim()) return setError('Field Name is required');
    const nonEmpty = form.options.filter((o) => o.trim());
    if (nonEmpty.length === 0) return setError('At least one option is required');
    setForm({ ...form, options: nonEmpty });
    onSave({ ...form, options: nonEmpty });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>{field ? 'Edit Custom Field' : 'New Custom Field'}</Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Field Name"
            placeholder="e.g. Parking Preference"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            label="Field Type"
            select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as FieldType })}
            required
          >
            <MenuItem value="single">Single Select (dropdown)</MenuItem>
            <MenuItem value="multi">Multi Select (checkboxes)</MenuItem>
          </TextField>
          <Divider />
          <Typography variant="body2" fontWeight={600}>Options</Typography>
          <Stack spacing={1}>
            {form.options.map((opt, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                />
                <IconButton size="small" onClick={() => removeOption(i)} disabled={form.options.length === 1}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
          <Button startIcon={<AddIcon />} onClick={addOption} size="small" variant="outlined">
            Add Option
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submit} variant="contained">
          {field ? 'Update Field' : 'Create Field'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DeleteFieldDialog({
  open, onClose, onConfirm,
}: {
  open: boolean; onClose: () => void; onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>Delete Custom Field</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this custom field? This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export function CustomFieldsTab({ permissionId = 'default' }: { permissionId?: string }) {
  const storageKey = `prototype:builder:customfields:${permissionId}`;
  const showToast = useToast();
  const [state, setState] = useState<CustomFieldsState>(DEFAULT_STATE);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setState(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {}
  }, [state, storageKey]);

  const openEditor = (field?: CustomField) => {
    setEditingField(field ?? null);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingField(null);
  };

  const saveField = (f: CustomField) => {
    const exists = state.fields.find((x) => x.id === f.id);
    if (exists) {
      setState((s) => ({ ...s, fields: s.fields.map((x) => x.id === f.id ? f : x) }));
      showToast('Custom field updated', 'success');
    } else {
      setState((s) => ({ ...s, fields: [...s.fields, f] }));
      showToast('Custom field created', 'success');
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeleteFieldId(id);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    setDeleteFieldId(null);
  };

  const confirmDelete = () => {
    if (deleteFieldId) {
      setState((s) => ({ ...s, fields: s.fields.filter((f) => f.id !== deleteFieldId) }));
      showToast('Custom field deleted', 'success');
    }
    closeDeleteDialog();
  };

  return (
    <>
      <Alert severity="info" sx={{ mb: 3, background: '#FFF7EC', border: '1px solid #EDEFF3', color: 'text.primary' }}>
        Create custom Single Select and Multi Select fields that will appear in the Application Form. These fields are available in the Form Builder drag palette.
      </Alert>

      <Section
        title="Custom Fields"
        description={`${state.fields.length} field${state.fields.length === 1 ? '' : 's'} defined`}
        actions={
          <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={() => openEditor()}>
            Add Field
          </Button>
        }
      >
        {state.fields.length === 0 && (
          <Typography color="text.secondary">
            No custom fields yet. Click <b>Add Field</b> to create a Single Select or Multi Select field.
          </Typography>
        )}
        {state.fields.length > 0 && (
          <Stack spacing={1.5}>
            {state.fields.map((field) => (
              <Paper key={field.id} sx={{ p: 2 }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  <Box flex={1}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 600, fontSize: '1rem' }}>
                        {field.name}
                      </Typography>
                      <Chip label={field.type === 'single' ? 'Single Select' : 'Multi Select'} size="small" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {field.options.length} option{field.options.length === 1 ? '' : 's'}: {field.options.slice(0, 3).join(', ')}
                      {field.options.length > 3 && ` +${field.options.length - 3} more`}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={() => openEditor(field)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => openDeleteDialog(field.id)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Section>

      <FieldEditorDialog open={editorOpen} onClose={closeEditor} field={editingField} onSave={saveField} />
      <DeleteFieldDialog open={deleteOpen} onClose={closeDeleteDialog} onConfirm={confirmDelete} />
    </>
  );
}
