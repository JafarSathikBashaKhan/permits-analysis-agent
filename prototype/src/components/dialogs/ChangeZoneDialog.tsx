import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, Grid, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

/**
 * US-170243 (Change Zone, no cost) / US-194295 (Change Zone with cost).
 *
 * Same UI, different behaviour: `chargesApply` = true means the flow surfaces
 * a cost summary + admin fee + a "Waiting for Payment" outcome. The parent
 * decides which mode based on business rules.
 */

export type ChangeZonePayload = {
  newZone: string;
  chargesApply: boolean;
  amount: number;
  adminFee: number;
  refund: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (p: ChangeZonePayload) => void;
  currentZone: string;
  currentPrice: number;
  zones: string[];
  /** If true, price difference + admin fee are calculated (US-194295). */
  chargesApply: boolean;
  /** Fixed price per zone (mock). */
  zonePrices?: Record<string, number>;
};

const ADMIN_FEE = 10;

export function ChangeZoneDialog({
  open, onClose, onConfirm,
  currentZone, currentPrice, zones, chargesApply, zonePrices,
}: Props) {
  const [zone, setZone] = useState('');

  useEffect(() => { if (open) setZone(''); }, [open]);

  const newPrice = zone && zonePrices ? (zonePrices[zone] ?? currentPrice) : currentPrice;
  const diff = newPrice - currentPrice;
  const total = chargesApply ? Math.abs(diff) + ADMIN_FEE : 0;
  const isRefund = diff < 0;

  const canConfirm = !!zone && zone !== currentZone;

  const handleConfirm = () => {
    onConfirm({
      newZone: zone,
      chargesApply,
      amount: chargesApply ? total : 0,
      adminFee: chargesApply ? ADMIN_FEE : 0,
      refund: chargesApply && isRefund,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{chargesApply ? 'Change Zone (with cost)' : 'Change Zone'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <TextField label="Current Zone" fullWidth value={currentZone} InputProps={{ readOnly: true }} />
          <TextField
            select label="New Zone" required fullWidth
            value={zone} onChange={(e) => setZone(e.target.value)}
            data-testid="new-zone-select"
          >
            {zones.filter((z) => z !== currentZone).map((z) => (
              <MenuItem key={z} value={z}>{z}{zonePrices ? ` — £${zonePrices[z] ?? currentPrice}` : ''}</MenuItem>
            ))}
          </TextField>

          {chargesApply && zone && (
            <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }} data-testid="cost-summary">
              <Typography fontWeight={700} sx={{ mb: 1 }}>Cost Summary</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}><Typography variant="body2">Current Zone price</Typography></Grid>
                <Grid item xs={6} textAlign="right"><Typography>£{currentPrice.toFixed(2)}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">New Zone price</Typography></Grid>
                <Grid item xs={6} textAlign="right"><Typography>£{newPrice.toFixed(2)}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">Price difference</Typography></Grid>
                <Grid item xs={6} textAlign="right"><Typography>£{diff.toFixed(2)}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">Admin fee</Typography></Grid>
                <Grid item xs={6} textAlign="right"><Typography>£{ADMIN_FEE.toFixed(2)}</Typography></Grid>
                <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                <Grid item xs={6}><Typography fontWeight={700}>{isRefund ? 'Refund due' : 'Amount payable'}</Typography></Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography fontWeight={700} color={isRefund ? 'success.main' : 'text.primary'}>
                    £{total.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              {isRefund && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  New zone price is lower — a refund will be initiated once confirmed.
                </Alert>
              )}
            </Box>
          )}

          {!chargesApply && (
            <Alert severity="info">No charges apply. The zone change will be applied immediately.</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!canConfirm} onClick={handleConfirm} data-testid="confirm-zone">
          {chargesApply ? 'Proceed to Payment' : 'Confirm Change'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
