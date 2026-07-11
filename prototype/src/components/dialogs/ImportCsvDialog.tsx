import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Link, Stack, Typography,
} from '@mui/material';
import UploadFileOutlined from '@mui/icons-material/UploadFileOutlined';
import { useState } from 'react';
import { useToast } from '../Toast';

type Props = {
  open: boolean;
  onClose: () => void;
  onImport: (rowCount: number) => void;
  entityName: string;
};

export function ImportCsvDialog({ open, onClose, onImport, entityName }: Props) {
  const showToast = useToast();
  const [file, setFile] = useState<File | null>(null);

  const reset = () => setFile(null);

  const handleSave = () => {
    const count = Math.floor(Math.random() * 21) + 5; // 5–25
    onImport(count);
    showToast(`${count} ${entityName} imported`, 'success');
    reset();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import {entityName}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Upload a CSV file.{' '}
            <Link href="#" underline="hover" onClick={(e) => { e.preventDefault(); showToast('Sample CSV downloaded', 'info'); }}>
              Download the sample
            </Link>{' '}
            first to see the expected format.
          </Typography>

          <Stack spacing={0.75}>
            <Button variant="outlined" component="label" startIcon={<UploadFileOutlined />} sx={{ alignSelf: 'flex-start' }}>
              Choose CSV file
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </Button>
            {file && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{file.name}</Typography>
            )}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={!file} onClick={handleSave}>Import</Button>
      </DialogActions>
    </Dialog>
  );
}
