import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Stack, Typography,
} from '@mui/material';
import UploadOutlined from '@mui/icons-material/UploadOutlined';
import { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (fileName: string) => void;
  title: string;
  hint?: string;
};

export function UploadImageDialog({ open, onClose, onSave, title, hint }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const reset = () => { setFile(null); setPreview(null); };

  const handleFile = (f: File | null) => {
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleSave = () => {
    onSave(file!.name);
    reset();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, alignItems: 'center' }}>
          {preview ? (
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain', border: '1px solid #E0E0E0', borderRadius: 1 }}
            />
          ) : (
            <Box sx={{ width: '100%', height: 120, border: '2px dashed #E0E0E0', borderRadius: 1, display: 'grid', placeItems: 'center', bgcolor: '#FAFBFC' }}>
              <UploadOutlined sx={{ fontSize: 40, color: '#B0B8C4' }} />
            </Box>
          )}
          <Button variant="outlined" component="label" startIcon={<UploadOutlined />}>
            {file ? 'Change file' : 'Choose image'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </Button>
          {file && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{file.name}</Typography>
          )}
          {hint && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{hint}</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={!file} onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
