import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

/**
 * US-181869 — Temporary Permission → BO validates & approves address challenge.
 * BO inputs the real address (property/street/town/postcode) and maps it to a zone.
 * On approve: application moves to Address Challenge Approved → Active, and an
 * email confirmation is sent (parent handles).
 */

export type TemporaryAddressPayload = {
  property: string;
  street: string;
  town: string;
  postcode: string;
  zone: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onApprove: (p: TemporaryAddressPayload) => void;
  zones: string[];
  currentTempAddress: string;
};

export function TemporaryAddressDialog({ open, onClose, onApprove, zones, currentTempAddress }: Props) {
  const [property, setProperty] = useState('');
  const [street, setStreet] = useState('');
  const [town, setTown] = useState('');
  const [postcode, setPostcode] = useState('');
  const [zone, setZone] = useState('');

  useEffect(() => {
    if (open) { setProperty(''); setStreet(''); setTown(''); setPostcode(''); setZone(''); }
  }, [open]);

  const canApprove = property.trim() && street.trim() && town.trim() && postcode.trim() && zone;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Approve Address Challenge</DialogTitle>
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          Applicant supplied a temporary address: <b>{currentTempAddress}</b>.
          Enter the verified address and map it to the correct zone.
        </Alert>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Property *" fullWidth value={property} onChange={(e) => setProperty(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Street *" fullWidth value={street} onChange={(e) => setStreet(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Town *" fullWidth value={town} onChange={(e) => setTown(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Postcode *" fullWidth value={postcode} onChange={(e) => setPostcode(e.target.value.toUpperCase())} />
          </Grid>
          <Grid item xs={12}>
            <TextField select label="Assign to Zone *" fullWidth value={zone} onChange={(e) => setZone(e.target.value)}>
              {zones.map((z) => <MenuItem key={z} value={z}>{z}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              On approve, the address is added to the zone list and the application will move
              Address Challenge Approved → Active. Illumin8 will receive the zone update.
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained" disabled={!canApprove}
          onClick={() => { onApprove({ property, street, town, postcode, zone }); onClose(); }}
          data-testid="approve-temp"
        >
          Approve & Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}
