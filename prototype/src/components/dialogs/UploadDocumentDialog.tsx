import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import UploadFileOutlined from '@mui/icons-material/UploadFileOutlined';
import { useState } from 'react';
import { DOCUMENT_CATEGORY_OPTIONS } from '../../constants/enums';

export type DocumentPayload = {
  id: string;
  type: string;
  fileName: string;
  size: string;
  notes: string;
  uploadedAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (doc: DocumentPayload) => void;
};

const DOC_TYPES = DOCUMENT_CATEGORY_OPTIONS.map((o) => o.label);

export function UploadDocumentDialog({ open, onClose, onSave }: Props) {
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');

  const reset = () => { setDocType(''); setFile(null); setNotes(''); };

  const canSave = docType && file;

  const handleSave = () => {
    onSave({
      id: `DOC-${Date.now()}`,
      type: docType,
      fileName: file!.name,
      size: file!.size > 1048576
        ? `${(file!.size / 1048576).toFixed(1)} MB`
        : `${Math.round(file!.size / 1024)} KB`,
      notes,
      uploadedAt: new Date().toISOString(),
    });
    reset();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Document</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select label="Document Type" required fullWidth
            value={docType} onChange={(e) => setDocType(e.target.value)}
          >
            {DOC_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>

          <Stack spacing={0.75}>
            <Button variant="outlined" component="label" startIcon={<UploadFileOutlined />} sx={{ alignSelf: 'flex-start' }}>
              Choose File
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </Button>
            {file && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {file.name}
              </Typography>
            )}
          </Stack>

          <TextField
            label="Notes (optional)" multiline rows={3} fullWidth
            value={notes} onChange={(e) => setNotes(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={handleSave}>Upload</Button>
      </DialogActions>
    </Dialog>
  );
}
