import {
  Box, Button, Chip, Divider, IconButton, Paper, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography,
} from '@mui/material';
import {
  AddOutlined, DeleteOutlineOutlined, EditOutlined, SwapHorizOutlined, Star, StarBorder,
  ReceiptLongOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import { tokens } from '../../../theme';
import { usePersistentState } from '../../../hooks/usePersistentState';
import { useToast } from '../../../components/Toast';
import { AddVehicleDialog } from '../../../components/dialogs/AddVehicleDialog';
import { SwapVehicleDialog, SwapVehicle } from '../../../components/dialogs/SwapVehicleDialog';
import { PcnLookupDialog, PcnRecord } from '../../../components/dialogs/PcnLookupDialog';
import { pushAudit } from '../helpers/auditLog';
import { isPcnLookupEnabled } from '../helpers/settings';

/**
 * US-164967 (Vehicles tab), US-161845 (Swap), US-176354 (Favourites),
 * US-160554 (PCN lookup).
 */

export type Vehicle = {
  id: string;
  vrm: string;
  make: string;
  model: string;
  colour: string;
  fuel: string;
  co2: number;
  source: string;
  favourite?: boolean;
  primary?: boolean;
  temporary?: boolean;
  validUntil?: string;
};

// Mock PCN dataset per-vehicle — TODO(real-backend): US-160554 API call
const MOCK_PCNS: Record<string, PcnRecord[]> = {
  'AB19 XYZ': [
    { caseNumber: 'PCN-100234', contraventionAt: '2025-11-14 09:22', location: 'Riverside Walk', balance: 60, status: 'Outstanding' },
    { caseNumber: 'PCN-100518', contraventionAt: '2025-12-06 15:41', location: 'High Street',    balance: 130, status: 'Overdue' },
    { caseNumber: 'PCN-100901', contraventionAt: '2026-01-12 11:08', location: 'Northgate',      balance: 0,   status: 'Paid' },
  ],
  'BC22 CDE': [
    { caseNumber: 'PCN-100776', contraventionAt: '2026-02-04 08:33', location: 'Southbank',      balance: 60,  status: 'Outstanding' },
  ],
};

export function VehiclesTab({ appId }: { appId: string }) {
  const showToast = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [swapVrm, setSwapVrm] = useState<string | null>(null);
  const [pcnVrm, setPcnVrm] = useState<string | null>(null);

  const pcnEnabled = isPcnLookupEnabled();

  const [vehicles, setVehicles] = usePersistentState<Vehicle[]>(
    `prototype:applications:vehicles:${appId}`,
    () => [
      { id: 'v1', vrm: 'AB19 XYZ', make: 'Ford', model: 'Focus', colour: 'Silver', fuel: 'Petrol', co2: 118, source: 'AutoGuru', primary: true, favourite: true },
      { id: 'v2', vrm: 'BC22 CDE', make: 'Tesla', model: 'Model 3', colour: 'White', fuel: 'Electric', co2: 0, source: 'AutoGuru' },
    ]
  );

  // Applicant's other vehicles (pool for swap) — shared across permits per applicant
  const [applicantPool, setApplicantPool] = usePersistentState<Vehicle[]>(
    `prototype:applications:vehicle-pool:${appId}`,
    () => [
      { id: 'p1', vrm: 'CD23 FGH', make: 'Honda', model: 'Civic', colour: 'Blue',  fuel: 'Petrol',  co2: 108, source: 'AutoGuru' },
      { id: 'p2', vrm: 'DE24 IJK', make: 'BMW',   model: 'i3',    colour: 'Black', fuel: 'Electric', co2: 0,   source: 'AutoGuru', favourite: true },
    ]
  );

  const handleDelete = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    showToast('Vehicle deleted', 'success');
    pushAudit(appId, {
      actor: 'You', actorRole: 'BO User',
      eventName: 'Vehicle Removed',
      eventDescription: 'A vehicle was removed from the application.',
      eventCategory: 'Application Processing',
    });
  };

  const handleToggleFav = (id: string) => {
    setVehicles((prev) => prev.map((v) => v.id === id ? { ...v, favourite: !v.favourite } : v));
    setApplicantPool((prev) => prev.map((v) => v.id === id ? { ...v, favourite: !v.favourite } : v));
  };

  const handleToggleFavPool = (id: string) => {
    setApplicantPool((prev) => prev.map((v) => v.id === id ? { ...v, favourite: !v.favourite } : v));
  };

  const handleSwap = (from: Vehicle, to: SwapVehicle) => {
    // Replace the currently primary vehicle with the selected one; mark it primary.
    setVehicles((prev) => prev.map((v) => v.id === from.id
      ? { id: `v${Date.now()}`, vrm: to.vrm, make: to.make, model: to.model, colour: to.colour, fuel: to.fuel, co2: 0, source: 'Applicant Pool', primary: true, favourite: to.favourite }
      : v
    ));
    // Return old vehicle to the pool
    setApplicantPool((prev) => [
      { id: from.id, vrm: from.vrm, make: from.make, model: from.model, colour: from.colour, fuel: from.fuel, co2: from.co2, source: from.source, favourite: from.favourite },
      ...prev.filter((p) => p.id !== to.id),
    ]);
    pushAudit(appId, {
      actor: 'You', actorRole: 'BO User',
      eventName: 'Vehicle Swapped',
      eventDescription: `Vehicle ${from.vrm} replaced with ${to.vrm} (new primary).`,
      eventCategory: 'Application Processing',
      from: from.vrm, to: to.vrm,
    });
    showToast(`Vehicle changed from ${from.vrm} to ${to.vrm}`, 'success');
  };

  const swappingFrom = swapVrm ? vehicles.find((v) => v.vrm === swapVrm) : null;

  return (
    <>
      <Paper sx={{ p: 2.5, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.1rem', color: tokens.INK }}>Vehicles</Typography>
          <Button size="small" variant="contained" startIcon={<AddOutlined />} onClick={() => setAddOpen(true)}>Add Vehicle</Button>
        </Stack>
        <Divider sx={{ mb: 2 }} />
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
              <TableCell>CO₂</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell>{v.primary && <Chip size="small" color="primary" label="Primary" />}{v.temporary && <Chip size="small" label="Temporary" color="warning" sx={{ ml: 0.5 }} />}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleToggleFav(v.id)} data-testid={`fav-${v.vrm}`}>
                    {v.favourite ? <Star sx={{ color: '#F5B301' }} fontSize="small" /> : <StarBorder fontSize="small" />}
                  </IconButton>
                </TableCell>
                <TableCell><Typography fontFamily="monospace">{v.vrm}</Typography></TableCell>
                <TableCell>{v.make}</TableCell>
                <TableCell>{v.model}</TableCell>
                <TableCell>{v.colour}</TableCell>
                <TableCell>{v.fuel}</TableCell>
                <TableCell>{v.co2} g/km</TableCell>
                <TableCell><Typography variant="caption">{v.source}</Typography></TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    {pcnEnabled && (
                      <Tooltip title="Show Active PCN">
                        <IconButton size="small" onClick={() => setPcnVrm(v.vrm)} data-testid={`pcn-${v.vrm}`}>
                          <ReceiptLongOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Swap Vehicle">
                      <IconButton size="small" onClick={() => setSwapVrm(v.vrm)} data-testid={`swap-${v.vrm}`}>
                        <SwapHorizOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small" onClick={() => setEditVehicle(v)}><EditOutlined fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleDelete(v.id)}><DeleteOutlineOutlined fontSize="small" /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {vehicles.length === 0 && (
              <TableRow><TableCell colSpan={10} align="center" sx={{ py: 4, color: tokens.MUTED }}>No vehicles</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <AddVehicleDialog
        open={addOpen || !!editVehicle}
        onClose={() => { setAddOpen(false); setEditVehicle(null); }}
        onSave={(v) => {
          if (editVehicle) {
            setVehicles((prev) => prev.map((veh) => veh.id === editVehicle.id
              ? { ...editVehicle, vrm: v.vrm, make: v.make, model: v.model, colour: v.colour, fuel: v.fuelType, temporary: v.temporary, validUntil: v.validUntil }
              : veh));
            showToast('Vehicle updated', 'success');
            setEditVehicle(null);
          } else {
            setVehicles((prev) => [...prev, {
              id: `v${Date.now()}`, vrm: v.vrm, make: v.make, model: v.model, colour: v.colour,
              fuel: v.fuelType, co2: 0, source: 'Manual',
              temporary: v.temporary, validUntil: v.validUntil,
            }]);
            showToast('Vehicle added', 'success');
            setAddOpen(false);
            pushAudit(appId, {
              actor: 'You', actorRole: 'BO User',
              eventName: 'Vehicle Added',
              eventDescription: `Vehicle ${v.vrm} added to the application.`,
              eventCategory: 'Application Processing',
              to: v.vrm,
            });
          }
        }}
      />

      {swappingFrom && (
        <SwapVehicleDialog
          open={!!swapVrm}
          onClose={() => setSwapVrm(null)}
          onSwap={(v) => handleSwap(swappingFrom, v)}
          onToggleFavourite={handleToggleFavPool}
          currentVrm={swappingFrom.vrm}
          candidateVehicles={applicantPool}
        />
      )}

      {pcnVrm && (
        <PcnLookupDialog
          open={!!pcnVrm}
          onClose={() => setPcnVrm(null)}
          vrm={pcnVrm}
          records={MOCK_PCNS[pcnVrm] ?? []}
        />
      )}
    </>
  );
}
