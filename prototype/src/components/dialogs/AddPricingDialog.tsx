import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  InputAdornment, MenuItem, Stack, TextField,
} from '@mui/material';
import { useState } from 'react';

export type PricingPayload = {
  id: string;
  name: string;
  type: string;
  basePrice: number;
  duration: string;
  status: string;
  createdAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (pricing: PricingPayload) => void;
};

const PRICING_TYPES = ['Standard', 'Tiered', 'Fixed Duration'];
const DURATIONS = ['1 hr', '4 hrs', '1 day', '1 week', '1 month', '1 year'];
const STATUSES = ['Active', 'Draft'];

export function AddPricingDialog({ open, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('');

  const reset = () => { setName(''); setType(''); setBasePrice(''); setDuration(''); setStatus(''); };

  const canSave = name && type && basePrice && duration && status;

  const handleSave = () => {
    onSave({
      id: `PRC-${Date.now()}`,
      name, type,
      basePrice: parseFloat(basePrice),
      duration, status,
      createdAt: new Date().toISOString(),
    });
    reset();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Pricing</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name" required fullWidth
            value={name} onChange={(e) => setName(e.target.value)}
          />
          <TextField select label="Type" required fullWidth value={type} onChange={(e) => setType(e.target.value)}>
            {PRICING_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField
            label="Base Price" type="number" required fullWidth
            value={basePrice} onChange={(e) => setBasePrice(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start">£</InputAdornment> }}
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField select label="Duration" required fullWidth value={duration} onChange={(e) => setDuration(e.target.value)}>
            {DURATIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </TextField>
          <TextField select label="Status" required fullWidth value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
