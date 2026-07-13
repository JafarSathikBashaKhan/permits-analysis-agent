import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: 'primary' | 'error' | 'warning' | 'success';
};

export function ConfirmDialog({
  open, onClose, onConfirm,
  title, message,
  confirmLabel = 'Confirm',
  confirmColor = 'primary',
}: Props) {
  const handleConfirm = () => { onConfirm(); onClose(); };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color={confirmColor} onClick={handleConfirm}>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
