import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Stack, TextField,
} from '@mui/material';
import { useState } from 'react';
import { FIELD_LIMITS } from '../../constants/enums';

export type BlueBadgePayload = {
  id: string;
  badgeNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  addedAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (badge: BlueBadgePayload) => void;
};

export function AddBlueBadgeDialog({ open, onClose, onSave }: Props) {
  const [badgeNumber, setBadgeNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');

  const reset = () => { setBadgeNumber(''); setIssueDate(''); setExpiryDate(''); setIssuingAuthority(''); };

  const canSave = badgeNumber && issueDate && expiryDate && issuingAuthority;

  const handleSave = () => {
    onSave({
      id: `BB-${Date.now()}`,
      badgeNumber, issueDate, expiryDate, issuingAuthority,
      addedAt: new Date().toISOString(),
    });
    reset();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Blue Badge</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Badge Number" required fullWidth
            value={badgeNumber} onChange={(e) => setBadgeNumber(e.target.value)}
            inputProps={{ maxLength: FIELD_LIMITS.BLUE_BADGE_NUMBER }}
            helperText={`Max ${FIELD_LIMITS.BLUE_BADGE_NUMBER} characters`}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Issue Date" type="date" required fullWidth
              value={issueDate} onChange={(e) => setIssueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Expiry Date" type="date" required fullWidth
              value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
          <TextField
            label="Issuing Authority" required fullWidth
            value={issuingAuthority} onChange={(e) => setIssuingAuthority(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
