import {
  Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, MenuItem, Stack, TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FUEL_TYPE_OPTIONS, VEHICLE_TYPE_OPTIONS } from '../../constants/enums';

export type VehiclePayload = {
  id: string;
  vrm: string;
  make: string;
  model: string;
  colour: string;
  fuelType: string;
  vehicleType: string;
  temporary: boolean;
  validUntil?: string;
  addedAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (vehicle: VehiclePayload) => void;
  title?: string;
  defaultTemporary?: boolean;
  initial?: Partial<Pick<VehiclePayload, 'vrm' | 'make' | 'model' | 'colour' | 'fuelType' | 'vehicleType' | 'temporary' | 'validUntil'>>;
};

const FUEL_TYPES = FUEL_TYPE_OPTIONS.map((o) => o.label);
const VEHICLE_TYPES = VEHICLE_TYPE_OPTIONS.map((o) => o.label);

export function AddVehicleDialog({ open, onClose, onSave, title = 'Add Vehicle', defaultTemporary = false, initial }: Props) {
  const [vrm, setVrm] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [colour, setColour] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [temporary, setTemporary] = useState(defaultTemporary);
  const [validUntil, setValidUntil] = useState('');

  useEffect(() => {
    if (open && initial) {
      setVrm(initial.vrm ?? '');
      setMake(initial.make ?? '');
      setModel(initial.model ?? '');
      setColour(initial.colour ?? '');
      setFuelType(initial.fuelType ?? '');
      setVehicleType(initial.vehicleType ?? '');
      setTemporary(initial.temporary ?? defaultTemporary);
      setValidUntil(initial.validUntil ?? '');
    } else if (open && !initial) {
      setVrm(''); setMake(''); setModel(''); setColour('');
      setFuelType(''); setVehicleType('');
      setTemporary(defaultTemporary); setValidUntil('');
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setVrm(''); setMake(''); setModel(''); setColour('');
    setFuelType(''); setVehicleType('');
    setTemporary(defaultTemporary); setValidUntil('');
  };

  const canSave = vrm && make && model && colour && fuelType && vehicleType && (!temporary || validUntil);

  const handleSave = () => {
    onSave({
      id: `V-${Date.now()}`,
      vrm: vrm.toUpperCase(),
      make, model, colour, fuelType, vehicleType,
      temporary,
      validUntil: temporary ? validUntil : undefined,
      addedAt: new Date().toISOString(),
    });
    reset();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="VRM (Registration)" required fullWidth
            value={vrm} onChange={(e) => setVrm(e.target.value.toUpperCase())}
            inputProps={{ style: { textTransform: 'uppercase', fontFamily: 'monospace' } }}
          />
          <Stack direction="row" spacing={2}>
            <TextField label="Make" required fullWidth value={make} onChange={(e) => setMake(e.target.value)} />
            <TextField label="Model" required fullWidth value={model} onChange={(e) => setModel(e.target.value)} />
          </Stack>
          <TextField label="Colour" required fullWidth value={colour} onChange={(e) => setColour(e.target.value)} />
          <Stack direction="row" spacing={2}>
            <TextField select label="Fuel Type" required fullWidth value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
              {FUEL_TYPES.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </TextField>
            <TextField select label="Vehicle Type" required fullWidth value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
              {VEHICLE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </Stack>
          <FormControlLabel
            control={<Checkbox checked={temporary} onChange={(e) => setTemporary(e.target.checked)} />}
            label="Temporary vehicle"
          />
          {temporary && (
            <TextField
              label="Valid until" type="date" required fullWidth
              value={validUntil} onChange={(e) => setValidUntil(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
