import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, InputAdornment, Stack, Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Typography, Chip,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useState } from 'react';

/**
 * US-186077 — FPN Lookup for applicant.
 * Search by First name / Last name / Postcode / Property; mock records returned.
 * TODO(real-backend): US-186077 — real FPN lookup via MNPS API.
 */

export type FpnRecord = {
  caseNumber: string;
  contraventionAt: string;
  balance: number;
  status: 'Active' | 'Paid' | 'Cancelled';
};

type Props = {
  open: boolean;
  onClose: () => void;
  applicantName: string;
  postcode?: string;
  property?: string;
  records: FpnRecord[];
};

export function FpnLookupDialog({ open, onClose, applicantName, postcode, property, records }: Props) {
  const [firstName, setFirstName] = useState(applicantName.split(' ')[0] ?? '');
  const [lastName, setLastName] = useState(applicantName.split(' ').slice(1).join(' '));
  const [pc, setPc] = useState(postcode ?? '');
  const [prop, setProp] = useState(property ?? '');

  const active = records.filter((r) => r.status === 'Active');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>FPN Lookup — {applicantName}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <TextField label="First name" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Last name" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Postcode" fullWidth value={pc} onChange={(e) => setPc(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Property" fullWidth value={prop} onChange={(e) => setProp(e.target.value)} />
          </Grid>
        </Grid>

        {active.length === 0 ? (
          <Alert severity="info">No Fixed Penalty Notices found for this applicant.</Alert>
        ) : (
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography sx={{ px: 2, py: 1, bgcolor: '#F8FAFC' }}>
              {active.length} active FPN(s) found
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Case Number</TableCell>
                  <TableCell>Contravention Date & Time</TableCell>
                  <TableCell align="right">Balance Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {active.map((r) => (
                  <TableRow key={r.caseNumber} hover>
                    <TableCell><Typography fontFamily="monospace">{r.caseNumber}</Typography></TableCell>
                    <TableCell>{r.contraventionAt}</TableCell>
                    <TableCell align="right">£{r.balance.toFixed(2)}</TableCell>
                    <TableCell><Chip size="small" label={r.status} color="warning" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
