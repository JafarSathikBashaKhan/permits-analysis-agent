import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem,
  Stack, TextField, Typography, Radio, FormControlLabel, RadioGroup,
} from '@mui/material';
import { useState } from 'react';

/**
 * US-195183 — Skip Document upload for renewal (all docs still valid) → confirm.
 * "Proceed" uses default card, "Choose different method" opens payment method picker,
 * "Cancel" closes.
 * Also used by US-193350 (BO-initiated renew) to launch the renewal payment step.
 */

export type RenewalConfirmChoice = 'proceed' | 'choose-method' | 'cancel';

type Props = {
  open: boolean;
  onClose: () => void;
  onProceed: (paymentMethod: string) => void;
  defaultCardLast4: string;
  paymentMethods: string[];
};

export function RenewalConfirmDialog({ open, onClose, onProceed, defaultCardLast4, paymentMethods }: Props) {
  const [showMethods, setShowMethods] = useState(false);
  const [method, setMethod] = useState(paymentMethods[0] ?? '');

  const handleProceedDefault = () => {
    onProceed(`Card · **** ${defaultCardLast4}`);
    onClose();
  };
  const handleProceedNew = () => {
    onProceed(method);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Renewal Payment</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {!showMethods ? (
            <>
              <Alert severity="info">
                All required documents are still valid. Ready to trigger renewal payment.
              </Alert>
              <Typography>
                Default registered card: <b>**** {defaultCardLast4}</b>
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">Choose a different payment method</Typography>
              <TextField
                select label="Payment Method" fullWidth
                value={method} onChange={(e) => setMethod(e.target.value)}
              >
                {paymentMethods.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {!showMethods ? (
          <>
            <Button onClick={() => setShowMethods(true)} data-testid="choose-method">
              Choose different method
            </Button>
            <Button variant="contained" onClick={handleProceedDefault} data-testid="proceed-default">
              Proceed
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={handleProceedNew} disabled={!method}>
            Continue
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
