import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Typography, Chip,
} from '@mui/material';
import { Search, Star, StarBorder } from '@mui/icons-material';
import { useMemo, useState, useEffect } from 'react';

/**
 * US-161845 / US-176354 — Swap Vehicle on a permit.
 *
 * Shows the applicant's other mapped vehicles (excluding the currently tied one),
 * with search by VRM, favourites-first ordering, and star toggle.
 * "No additional vehicles available" state when list is empty.
 */

export type SwapVehicle = {
  id: string;
  vrm: string;
  make: string;
  model: string;
  colour: string;
  fuel: string;
  favourite?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSwap: (v: SwapVehicle) => void;
  onToggleFavourite: (id: string) => void;
  candidateVehicles: SwapVehicle[];
  currentVrm: string;
};

export function SwapVehicleDialog({ open, onClose, onSwap, onToggleFavourite, candidateVehicles, currentVrm }: Props) {
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (open) { setQ(''); setSelectedId(null); setConfirming(false); }
  }, [open]);

  const sorted = useMemo(() => {
    const q2 = q.toLowerCase();
    return [...candidateVehicles]
      .filter((v) => v.vrm !== currentVrm)
      .filter((v) => q2 === '' || v.vrm.toLowerCase().includes(q2))
      .sort((a, b) => Number(!!b.favourite) - Number(!!a.favourite));
  }, [candidateVehicles, currentVrm, q]);

  const selected = sorted.find((v) => v.id === selectedId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Swap Vehicle</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            placeholder="Search by VRM" value={q} onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            data-testid="swap-search"
          />
          {sorted.length === 0 ? (
            <Alert severity="info">No additional vehicles available to swap.</Alert>
          ) : (
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Fav</TableCell>
                    <TableCell>VRM</TableCell>
                    <TableCell>Make</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Colour</TableCell>
                    <TableCell>Fuel</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sorted.map((v) => (
                    <TableRow
                      key={v.id}
                      hover selected={selectedId === v.id}
                      onClick={() => setSelectedId(v.id)}
                      sx={{ cursor: 'pointer' }}
                      data-testid={`swap-row-${v.vrm}`}
                    >
                      <TableCell>
                        <input type="radio" checked={selectedId === v.id} readOnly />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggleFavourite(v.id); }}>
                          {v.favourite ? <Star sx={{ color: '#F5B301' }} fontSize="small" /> : <StarBorder fontSize="small" />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography fontFamily="monospace">{v.vrm}</Typography>
                          {v.favourite && <Chip size="small" label="Favourite" sx={{ height: 18 }} />}
                        </Stack>
                      </TableCell>
                      <TableCell>{v.make}</TableCell>
                      <TableCell>{v.model}</TableCell>
                      <TableCell>{v.colour}</TableCell>
                      <TableCell>{v.fuel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {confirming && selected && (
            <Alert severity="warning">
              Are you sure you want to change the vehicle for this permit? The current vehicle
              <b> {currentVrm}</b> will be released and <b>{selected.vrm}</b> will become the primary vehicle.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {!confirming ? (
          <Button
            variant="contained" disabled={!selected}
            onClick={() => setConfirming(true)}
            data-testid="change-btn"
          >
            Change
          </Button>
        ) : (
          <Button
            variant="contained" color="warning"
            onClick={() => { onSwap(selected!); onClose(); }}
            data-testid="confirm-swap"
          >
            Confirm
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
