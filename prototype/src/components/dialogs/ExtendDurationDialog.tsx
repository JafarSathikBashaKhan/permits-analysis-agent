import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Stack, TextField,
} from '@mui/material';
import { useState } from 'react';

export type ExtendDurationPayload = {
  reason: string;
  extendBy: string;
  newEndDate?: string;
  notes: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: ExtendDurationPayload) => void;
  currentEnd?: string;
};

const REASONS = ['Payment Delay', 'Customer Request', 'Admin Correction', 'Other'];
const EXTEND_OPTIONS = ['1 week', '2 weeks', '1 month', '3 months', 'Custom'];

export function ExtendDurationDialog({ open, onClose, onSave, currentEnd }: Props) {
  const [reason, setReason] = useState('');
  const [extendBy, setExtendBy] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => { setReason(''); setExtendBy(''); setNewEndDate(''); setNotes(''); };

  const isCustom = extendBy === 'Custom';
  const canSave = reason && extendBy && (!isCustom || newEndDate);

  const handleSave = () => {
    onSave({ reason, extendBy, newEndDate: isCustom ? newEndDate : undefined, notes });
    reset();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Extend Duration</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {currentEnd && (
            <TextField label="Current End Date" value={currentEnd} fullWidth disabled />
          )}
          <TextField select label="Reason" required fullWidth value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>
          <TextField select label="Extend By" required fullWidth value={extendBy} onChange={(e) => setExtendBy(e.target.value)}>
            {EXTEND_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
          {isCustom && (
            <TextField
              label="New End Date" type="date" required fullWidth
              value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          )}
          <TextField
            label="Notes" multiline rows={3} fullWidth
            value={notes} onChange={(e) => setNotes(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={handleSave}>Extend</Button>
      </DialogActions>
    </Dialog>
  );
}
