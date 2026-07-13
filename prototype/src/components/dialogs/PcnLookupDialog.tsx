import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip,
} from '@mui/material';

/**
 * US-160554 — Show Active PCN for a vehicle.
 * Filters to active/outstanding PCNs (excludes Paid/Cancelled). Multi-vehicle: parent
 * passes per-vehicle records.
 * TODO(real-backend): US-160554 — real PCN lookup via MNPS API.
 */

export type PcnRecord = {
  caseNumber: string;
  contraventionAt: string;
  location: string;
  balance: number;
  status: 'Outstanding' | 'Overdue' | 'Paid' | 'Cancelled';
};

type Props = {
  open: boolean;
  onClose: () => void;
  vrm: string;
  records: PcnRecord[];
};

export function PcnLookupDialog({ open, onClose, vrm, records }: Props) {
  const active = records.filter((r) => r.status === 'Outstanding' || r.status === 'Overdue');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Active PCNs — {vrm}</DialogTitle>
      <DialogContent dividers>
        {active.length === 0 ? (
          <Alert severity="success">No active PCNs found for this vehicle.</Alert>
        ) : (
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Showing {active.length} outstanding PCN(s). Paid/Cancelled PCNs are excluded.
            </Typography>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Case Number</TableCell>
                    <TableCell>Contravention Date & Time</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {active.map((r) => (
                    <TableRow key={r.caseNumber} hover>
                      <TableCell><Typography fontFamily="monospace">{r.caseNumber}</Typography></TableCell>
                      <TableCell>{r.contraventionAt}</TableCell>
                      <TableCell>{r.location}</TableCell>
                      <TableCell align="right">£{r.balance.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip size="small" label={r.status}
                          color={r.status === 'Overdue' ? 'error' : 'warning'} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
