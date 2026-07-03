import { useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Stack, Step, StepLabel, Stepper, TextField, Typography,
  Alert, Divider, RadioGroup, Radio, FormControlLabel, Checkbox,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { PageHeader } from '../../shared/PageHeader';

const STEPS = ['Address', 'Vehicles', 'Documents', 'Pricing', 'Payment Method', 'Summary'];

export function FormBuilderPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const permissionType = params.get('permission') || 'Resident Permit';

  const [active, setActive] = useState(0);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');

  const [vehicles, setVehicles] = useState<{ vrm: string; make: string; model: string; colour: string; fuel: string }[]>([
    { vrm: 'AB12 CDE', make: 'Ford', model: 'Focus', colour: 'Blue', fuel: 'Petrol' },
  ]);
  const [vrmInput, setVrmInput] = useState('');
  const maxVehicles = 3;

  const [docTypeSel, setDocTypeSel] = useState<Record<string, boolean>>({
    'Proof of Residency': false, 'Vehicle Ownership': false, 'Blue Badge': false,
  });

  const [duration, setDuration] = useState('12 months');
  const [priceQty, setPriceQty] = useState(1);
  const [adminFee] = useState(3.5);
  const priceMap: Record<string, number> = { '3 months': 22, '6 months': 40, '12 months': 75 };
  const subtotal = priceMap[duration] * priceQty;
  const total = subtotal + adminFee;

  const [method, setMethod] = useState<'credit' | 'debit' | 'costCenter' | null>(null);
  const [costCenter, setCostCenter] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);

  const addVehicle = () => {
    if (!vrmInput.trim() || vehicles.length >= maxVehicles) return;
    setVehicles([...vehicles, { vrm: vrmInput.trim().toUpperCase(), make: '—', model: '—', colour: '—', fuel: '—' }]);
    setVrmInput('');
  };

  const validateAndNext = () => {
    setValidationError(null);
    if (active === 0 && (!postcode || !address)) { setValidationError('Please enter postcode and select an address.'); return; }
    if (active === 1 && vehicles.length === 0) { setValidationError('Add at least one vehicle.'); return; }
    if (active === 4 && !method) { setValidationError('Please select a payment method.'); return; }
    if (active === 4 && method === 'costCenter' && !costCenter.trim()) { setValidationError('Enter a cost centre / budget code.'); return; }
    setActive((a) => a + 1);
  };

  const submit = () => {
    setSubmitted(true);
    setTimeout(() => nav('/applications'), 1200);
  };

  return (
    <Box>
      <PageHeader eyebrow="Buy Now" title={`Form Builder — ${permissionType}`}
        description="Wizard-driven purchase flow rendered by Form.io in production. This prototype shows the same 6-step shape."
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<SaveIcon />}>Save Draft</Button>
            <Button variant="text" color="error" onClick={() => setConfirmCancel(true)}>Cancel</Button>
          </Stack>
        } />

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider', p: 3 }}>
        <Stepper activeStep={active} alternativeLabel sx={{ mb: 4 }}>
          {STEPS.map((s) => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
        </Stepper>

        {validationError && <Alert severity="error" sx={{ mb: 2 }}>{validationError}</Alert>}

        {active === 0 && (
          <Stack spacing={2} sx={{ maxWidth: 640 }}>
            <TextField label="Postcode *" size="small" value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())} />
            <TextField label="Address *" size="small" select value={address}
              onChange={(e) => setAddress(e.target.value)}
              helperText="Populated by address lookup in production.">
              <MenuItem value="">Select address…</MenuItem>
              <MenuItem value="1 Church Lane">1 Church Lane</MenuItem>
              <MenuItem value="12 Church Lane">12 Church Lane</MenuItem>
              <MenuItem value="48 Kingsway">48 Kingsway</MenuItem>
            </TextField>
          </Stack>
        )}

        {active === 1 && (
          <Stack spacing={2}>
            <Alert severity="info">Max {maxVehicles} vehicles for this permission. Autoguru autofills Make/Model/CO2 from VRM.</Alert>
            <Stack direction="row" spacing={1}>
              <TextField size="small" label="Add VRM" value={vrmInput}
                onChange={(e) => setVrmInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addVehicle(); } }}
                disabled={vehicles.length >= maxVehicles} />
              <Button variant="outlined" onClick={addVehicle} disabled={vehicles.length >= maxVehicles}>Add Vehicle</Button>
            </Stack>
            <Divider>Registered vehicles ({vehicles.length}/{maxVehicles})</Divider>
            {vehicles.map((v, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="center"
                sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Chip label={v.vrm} color="primary" variant="outlined" />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {v.make} · {v.model} · {v.colour} · {v.fuel}
                </Typography>
                <IconButton size="small" onClick={() => setVehicles(vehicles.filter((_, k) => k !== i))}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        )}

        {active === 2 && (
          <Stack spacing={2} sx={{ maxWidth: 640 }}>
            <Alert severity="info">Select the documents you can provide. Real form uses file uploads.</Alert>
            {Object.keys(docTypeSel).map((d) => (
              <FormControlLabel key={d}
                control={<Checkbox checked={docTypeSel[d]}
                  onChange={(_, c) => setDocTypeSel({ ...docTypeSel, [d]: c })} />}
                label={d} />
            ))}
          </Stack>
        )}

        {active === 3 && (
          <Stack spacing={2} sx={{ maxWidth: 640 }}>
            <TextField label="Duration" size="small" select value={duration}
              onChange={(e) => setDuration(e.target.value)}>
              {Object.keys(priceMap).map((d) => <MenuItem key={d} value={d}>{d} — £{priceMap[d]}</MenuItem>)}
            </TextField>
            <TextField label="Quantity" size="small" type="number" value={priceQty}
              inputProps={{ min: 1, max: 10 }} onChange={(e) => setPriceQty(Math.max(1, +e.target.value))} />
            <Divider />
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Stack direction="row" justifyContent="space-between"><Typography>Subtotal</Typography><Typography>£{subtotal.toFixed(2)}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography>Admin fee</Typography><Typography>£{adminFee.toFixed(2)}</Typography></Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between"><Typography fontWeight={700}>Total</Typography><Typography fontWeight={700}>£{total.toFixed(2)}</Typography></Stack>
            </Box>
          </Stack>
        )}

        {active === 4 && (
          <Stack spacing={2} sx={{ maxWidth: 640 }}>
            <RadioGroup value={method || ''} onChange={(e) => setMethod(e.target.value as any)}>
              <FormControlLabel value="credit" control={<Radio />} label="Credit card" />
              <FormControlLabel value="debit" control={<Radio />} label="Debit card" />
              <FormControlLabel value="costCenter" control={<Radio />} label="Cost centre / Budget code" />
            </RadioGroup>
            {method === 'costCenter' && (
              <TextField label="Cost centre code *" size="small" value={costCenter}
                onChange={(e) => setCostCenter(e.target.value)} />
            )}
          </Stack>
        )}

        {active === 5 && (
          <Stack spacing={2} sx={{ maxWidth: 640 }}>
            <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Address</Typography>
              <Typography variant="body2">{address}, {postcode}</Typography>
            </Box>
            <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Vehicles</Typography>
              {vehicles.map((v, i) => <Typography key={i} variant="body2">{v.vrm} — {v.make} {v.model}</Typography>)}
            </Box>
            <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Pricing</Typography>
              <Typography variant="body2">{duration} × {priceQty} = £{subtotal.toFixed(2)} + £{adminFee.toFixed(2)} admin</Typography>
              <Typography variant="body1" fontWeight={700}>Total £{total.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Payment</Typography>
              <Typography variant="body2">{method === 'costCenter' ? `Cost centre: ${costCenter}` : method || 'Not selected'}</Typography>
            </Box>
          </Stack>
        )}

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" justifyContent="space-between">
          <Button startIcon={<ArrowBackIcon />} disabled={active === 0}
            onClick={() => { setValidationError(null); setActive((a) => a - 1); }}>
            Previous
          </Button>
          {active < STEPS.length - 1
            ? <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={validateAndNext}>Next</Button>
            : <Button variant="contained" color="success" startIcon={<DoneAllIcon />} onClick={submit}>Submit</Button>}
        </Stack>
      </Box>

      {submitted && (
        <Alert severity="success" sx={{ position: 'fixed', bottom: 24, right: 24, boxShadow: 3, zIndex: 2000 }}>
          Application submitted — redirecting…
        </Alert>
      )}

      <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Cancel purchase?
          <IconButton onClick={() => setConfirmCancel(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>Your progress can be saved as a draft. What would you like to do?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancel(false)}>Continue Purchase</Button>
          <Button color="error" onClick={() => nav('/exploreapplications')}>Discard</Button>
          <Button variant="contained" onClick={() => nav('/exploreapplications')}>Save & Exit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
