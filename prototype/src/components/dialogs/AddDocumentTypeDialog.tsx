import {
  Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, FormGroup, FormLabel, Stack, TextField, Typography,
} from '@mui/material';
import { useState } from 'react';

export type DocumentTypePayload = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  maxFileSizeMB: number;
  acceptedFormats: string[];
  createdAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (docType: DocumentTypePayload) => void;
};

const FORMAT_OPTIONS = ['PDF', 'JPG', 'PNG', 'DOCX'];

export function AddDocumentTypeDialog({ open, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [required, setRequired] = useState(false);
  const [maxFileSizeMB, setMaxFileSizeMB] = useState('');
  const [formats, setFormats] = useState<string[]>([]);

  const reset = () => { setName(''); setDescription(''); setRequired(false); setMaxFileSizeMB(''); setFormats([]); };

  const toggleFormat = (f: string) =>
    setFormats((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const canSave = name && maxFileSizeMB && formats.length > 0;

  const handleSave = () => {
    onSave({
      id: `DT-${Date.now()}`,
      name, description, required,
      maxFileSizeMB: parseFloat(maxFileSizeMB),
      acceptedFormats: formats,
      createdAt: new Date().toISOString(),
    });
    reset();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Document Type</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name" required fullWidth
            value={name} onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description" multiline rows={3} fullWidth
            value={description} onChange={(e) => setDescription(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox checked={required} onChange={(e) => setRequired(e.target.checked)} />}
            label="Required document"
          />
          <TextField
            label="Max File Size (MB)" type="number" required fullWidth
            value={maxFileSizeMB} onChange={(e) => setMaxFileSizeMB(e.target.value)}
            inputProps={{ min: 1, max: 100 }}
          />
          <Stack>
            <FormLabel sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              Accepted Formats <Typography component="span" sx={{ color: 'error.main' }}>*</Typography>
            </FormLabel>
            <FormGroup row>
              {FORMAT_OPTIONS.map((f) => (
                <FormControlLabel
                  key={f}
                  control={<Checkbox checked={formats.includes(f)} onChange={() => toggleFormat(f)} />}
                  label={f}
                />
              ))}
            </FormGroup>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
