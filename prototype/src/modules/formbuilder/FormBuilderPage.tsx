import { useMemo, useState } from 'react';
import {
  Alert, Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControlLabel, IconButton, MenuItem, Paper, Radio,
  RadioGroup, Stack, Step, StepLabel, Stepper, TextField, Typography, Tooltip,
  ToggleButton, ToggleButtonGroup, LinearProgress, Snackbar, Checkbox,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import PoundIcon from '@mui/icons-material/CurrencyPound';
import { PageHeader } from '../../shared/PageHeader';

// ---------- Mock lookups ----------
const POSTCODE_PROPERTIES: Record<string, { uprn: string; addressLine: string; streetName: string; town: string; postCode: string }[]> = {
  'RG1 1AA': [
    { uprn: '100091234567', addressLine: '12 Church Lane', streetName: 'Church Lane', town: 'Reading', postCode: 'RG1 1AA' },
    { uprn: '100091234568', addressLine: '14 Church Lane', streetName: 'Church Lane', town: 'Reading', postCode: 'RG1 1AA' },
    { uprn: '100091234569', addressLine: '16 Church Lane', streetName: 'Church Lane', town: 'Reading', postCode: 'RG1 1AA' },
  ],
  'RG2 8BB': [
    { uprn: '100091234570', addressLine: '48 Kingsway', streetName: 'Kingsway', town: 'Reading', postCode: 'RG2 8BB' },
    { uprn: '100091234571', addressLine: '50 Kingsway', streetName: 'Kingsway', town: 'Reading', postCode: 'RG2 8BB' },
  ],
  'RG4 5CC': [
    { uprn: '100091234572', addressLine: '1 Mill Road', streetName: 'Mill Road', town: 'Caversham', postCode: 'RG4 5CC' },
  ],
};

const SAVED_ADDRESSES = [
  { uprn: '100091234567', addressLine: '12 Church Lane', streetName: 'Church Lane', town: 'Reading', postCode: 'RG1 1AA', label: '12 Church Lane, Reading (Primary)' },
];

// Autoguru mock
const VEHICLE_DB: Record<string, { make: string; model: string; colour: string; fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'; co2: number; euro: string }> = {
  'AB12CDE': { make: 'Ford',     model: 'Focus',    colour: 'Blue',   fuel: 'Petrol',   co2: 120, euro: 'Euro 6' },
  'BD65XYZ': { make: 'Toyota',   model: 'Prius',    colour: 'Silver', fuel: 'Hybrid',   co2:  90, euro: 'Euro 6' },
  'EV24GRN': { make: 'Tesla',    model: 'Model 3',  colour: 'White',  fuel: 'Electric', co2:   0, euro: 'N/A'    },
  'DV70FUL': { make: 'BMW',      model: '320d',     colour: 'Black',  fuel: 'Diesel',   co2: 130, euro: 'Euro 6' },
  'CH19PET': { make: 'Vauxhall', model: 'Corsa',    colour: 'Red',    fuel: 'Petrol',   co2: 115, euro: 'Euro 6' },
};

type Vehicle = { id: string; vrm: string; make: string; model: string; colour: string; fuel: string; co2: number; euro: string; saved: boolean };
type DocFile = { name: string; size: number };
type PermitMode = 'digital' | 'physical';
type AddressSelection = 'saved' | 'new';

const DOC_TYPES = [
  { key: 'residency', label: 'Proof of Residency', required: true, help: 'Recent utility bill or Council Tax letter (last 3 months).' },
  { key: 'vehicle',   label: 'Vehicle Ownership',  required: true, help: 'V5C logbook or lease agreement.' },
  { key: 'blue',      label: 'Blue Badge',         required: false, help: 'Optional — attach if applicable.' },
];

const DURATION_PRICES: Record<string, number> = { '3 months': 22, '6 months': 40, '12 months': 75 };

const STEPS = [
  { key: 'address',  label: 'Address',         icon: <HomeIcon fontSize="small" /> },
  { key: 'vehicles', label: 'Vehicle Details', icon: <DirectionsCarIcon fontSize="small" /> },
  { key: 'docs',     label: 'Documents',       icon: <DescriptionIcon fontSize="small" /> },
  { key: 'price',    label: 'Price',           icon: <PoundIcon fontSize="small" /> },
  { key: 'checkout', label: 'Checkout',        icon: <PaymentIcon fontSize="small" /> },
];

export function FormBuilderPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const permissionType = params.get('permission') || 'Resident Permit';
  const maxVehicles = Number(params.get('maxVehicles') || 3);

  const [step, setStep] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [tcOpen, setTcOpen] = useState(false);
  const [ppOpen, setPpOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---- Address ----
  const [addressSelection, setAddressSelection] = useState<AddressSelection>('saved');
  const [savedAddressId, setSavedAddressId] = useState<string>(SAVED_ADDRESSES[0].uprn);
  const [postcode, setPostcode] = useState('');
  const [selectedUprn, setSelectedUprn] = useState<string>('');
  const [permitMode, setPermitMode] = useState<PermitMode>('digital');

  const savedAddress = SAVED_ADDRESSES.find((a) => a.uprn === savedAddressId);
  const postcodeMatches = POSTCODE_PROPERTIES[postcode.toUpperCase().trim()] || [];
  const chosenNewProperty = postcodeMatches.find((p) => p.uprn === selectedUprn);
  const effectiveAddress = addressSelection === 'saved' ? savedAddress : chosenNewProperty;

  // ---- Vehicles ----
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vrmInput, setVrmInput] = useState('');
  const [autoLoading, setAutoLoading] = useState(false);
  const [vrmError, setVrmError] = useState<string | null>(null);

  const lookupAndAdd = () => {
    setVrmError(null);
    const cleaned = vrmInput.replace(/\s/g, '').toUpperCase();
    if (!cleaned) { setVrmError('Enter a VRM.'); return; }
    if (vehicles.length >= maxVehicles) { setVrmError(`Max ${maxVehicles} vehicles allowed for this permission.`); return; }
    if (vehicles.some((v) => v.vrm.replace(/\s/g, '') === cleaned)) { setVrmError('This vehicle is already added.'); return; }
    setAutoLoading(true);
    setTimeout(() => {
      setAutoLoading(false);
      const hit = VEHICLE_DB[cleaned];
      if (!hit) {
        setVrmError('Vehicle not found. Please check the registration.');
        return;
      }
      const formatted = cleaned.length > 4 ? `${cleaned.slice(0, cleaned.length - 3)} ${cleaned.slice(-3)}` : cleaned;
      setVehicles((prev) => [...prev, { id: `V-${Date.now()}`, vrm: formatted, saved: false, ...hit }]);
      setVrmInput('');
    }, 500);
  };

  // ---- Documents ----
  const [docFiles, setDocFiles] = useState<Record<string, DocFile[]>>({ residency: [], vehicle: [], blue: [] });
  const addFakeFile = (docKey: string, name: string) => {
    const size = 250 + Math.floor(Math.random() * 1800); // KB
    if (size > 2048) return; // reject > 2MB
    setDocFiles((prev) => ({ ...prev, [docKey]: [...prev[docKey], { name, size }] }));
  };

  // ---- Price ----
  const [duration, setDuration] = useState('12 months');
  const [qty, setQty] = useState(1);
  const [dieselSurcharge, setDieselSurcharge] = useState(true);
  const adminFee = 3.5;
  const subtotal = DURATION_PRICES[duration] * qty;
  const dieselCount = vehicles.filter((v) => v.fuel === 'Diesel').length;
  const dieselSurchargeAmount = dieselSurcharge ? dieselCount * 15 : 0;
  const total = subtotal + adminFee + dieselSurchargeAmount;

  // ---- Checkout ----
  const [payment, setPayment] = useState<'credit' | 'debit' | 'costCenter' | 'scratch' | ''>('');
  const [costCenter, setCostCenter] = useState('');
  const [scratchCode, setScratchCode] = useState('');
  const [tcAgreed, setTcAgreed] = useState(false);

  // ---- Validation per step ----
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (addressSelection === 'new') {
        if (!postcode.trim()) e.postcode = 'This field is required.';
        if (!selectedUprn) e.property = 'Please select a property.';
      }
    }
    if (step === 1) {
      if (vehicles.length === 0) e.vehicles = 'Add at least one vehicle to continue.';
    }
    if (step === 2) {
      DOC_TYPES.filter((d) => d.required).forEach((d) => {
        if (docFiles[d.key].length === 0) e[`doc_${d.key}`] = `Please upload ${d.label}.`;
      });
    }
    if (step === 4) {
      if (!payment) e.payment = 'Please select a payment method.';
      if (payment === 'costCenter' && !costCenter.trim()) e.costCenter = 'This field is required.';
      if (payment === 'scratch' && !scratchCode.trim()) e.scratch = 'Enter a scratch card voucher code.';
      if (!tcAgreed) e.tc = 'You must accept the Terms and Conditions to submit.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(STEPS.length - 1, s + 1)); };
  const back = () => { setErrors({}); setStep((s) => Math.max(0, s - 1)); };

  const handleSaveDraft = () => setToast('Progress saved successfully as Draft.');

  const doSubmit = () => {
    if (!validate()) return;
    setApplyOpen(true);
  };

  const applyAgain = () => { setApplyOpen(false); setStep(0); setToast('Ready to apply again.'); };
  const backToPermits = () => { setApplyOpen(false); nav('/applications'); };

  // ---- Summary content ----
  const summaryReady = useMemo(() => ({
    address: !!effectiveAddress,
    vehicles: vehicles.length > 0,
    docs: DOC_TYPES.filter((d) => d.required).every((d) => docFiles[d.key].length > 0),
    price: true,
    checkout: !!payment && tcAgreed,
  }), [effectiveAddress, vehicles.length, docFiles, payment, tcAgreed]);

  return (
    <Box>
      <PageHeader eyebrow="Buy Now"
        title={`Application Form — ${permissionType}`}
        description="5-step apply flow (Address → Vehicles → Documents → Price → Checkout). Real production form is rendered via Form.io; this prototype implements the same acceptance criteria."
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSaveDraft}>Save Draft</Button>
            <Button variant="text" color="error" onClick={() => setCancelOpen(true)}>Cancel</Button>
          </Stack>
        } />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' }, gap: 2.5 }}>
        {/* Main form */}
        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
            {STEPS.map((s, i) => (
              <Step key={s.key} completed={i < step}>
                <StepLabel icon={s.icon}>{s.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* --- Address --- */}
          {step === 0 && (
            <Stack spacing={2.5} sx={{ maxWidth: 720 }}>
              <Typography variant="h6">Applicant address</Typography>
              <ToggleButtonGroup exclusive size="small" value={addressSelection}
                onChange={(_, v) => v && setAddressSelection(v)}>
                <ToggleButton value="saved">Use saved address</ToggleButton>
                <ToggleButton value="new">Search a new address</ToggleButton>
              </ToggleButtonGroup>

              {addressSelection === 'saved' && (
                <TextField size="small" select label="Saved address" value={savedAddressId}
                  onChange={(e) => setSavedAddressId(e.target.value)}>
                  {SAVED_ADDRESSES.map((a) => (
                    <MenuItem key={a.uprn} value={a.uprn}>{a.label}</MenuItem>
                  ))}
                </TextField>
              )}

              {addressSelection === 'new' && (
                <>
                  <Stack direction="row" spacing={1}>
                    <TextField size="small" label="Postcode *" value={postcode}
                      onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                      error={!!errors.postcode} helperText={errors.postcode || 'Try RG1 1AA, RG2 8BB or RG4 5CC.'}
                      sx={{ flex: 1 }} />
                    <Button variant="outlined" onClick={() => { /* postcodeMatches is derived */ }}>Find</Button>
                  </Stack>
                  {postcode && postcodeMatches.length === 0 && (
                    <Alert severity="warning">No properties found for this postcode.</Alert>
                  )}
                  {postcodeMatches.length > 0 && (
                    <Autocomplete
                      options={postcodeMatches}
                      value={chosenNewProperty || null}
                      onChange={(_, v) => setSelectedUprn(v?.uprn || '')}
                      getOptionLabel={(o) => `${o.addressLine} — ${o.town} (UPRN ${o.uprn})`}
                      renderInput={(p) => <TextField {...p} size="small" label="Property *"
                        error={!!errors.property} helperText={errors.property} />} />
                  )}
                </>
              )}

              <Divider />
              <Typography variant="subtitle2">Permit mode</Typography>
              <RadioGroup row value={permitMode} onChange={(e) => setPermitMode(e.target.value as PermitMode)}>
                <FormControlLabel value="digital" control={<Radio />} label="Digital permit (email + PDF)" />
                <FormControlLabel value="physical" control={<Radio />} label="Physical permit (posted)" />
              </RadioGroup>

              {effectiveAddress && (
                <Alert severity="success" icon={<CheckCircleIcon />}>
                  <strong>{effectiveAddress.addressLine}</strong>, {effectiveAddress.town}, {effectiveAddress.postCode}
                  {' — '}UPRN {effectiveAddress.uprn}
                </Alert>
              )}
            </Stack>
          )}

          {/* --- Vehicles --- */}
          {step === 1 && (
            <Stack spacing={2.5} sx={{ maxWidth: 720 }}>
              <Typography variant="h6">Vehicle details</Typography>
              <Alert severity="info">
                Up to <strong>{maxVehicles}</strong> vehicles allowed. Enter a VRM below — Autoguru will look up the
                make, model, colour, CO₂ and Euro standard automatically.
              </Alert>

              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField size="small" label="VRM" value={vrmInput}
                  onChange={(e) => setVrmInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lookupAndAdd(); } }}
                  placeholder="e.g. AB12 CDE"
                  disabled={vehicles.length >= maxVehicles}
                  error={!!vrmError} helperText={vrmError || 'Try AB12 CDE, BD65 XYZ, EV24 GRN, DV70 FUL, CH19 PET'}
                  sx={{ flex: 1 }} />
                <Button variant="contained" onClick={lookupAndAdd}
                  disabled={autoLoading || vehicles.length >= maxVehicles}>
                  {autoLoading ? 'Looking up…' : 'Add Vehicle'}
                </Button>
              </Stack>
              {autoLoading && <LinearProgress />}

              {errors.vehicles && <Alert severity="error">{errors.vehicles}</Alert>}

              <Divider>
                Registered vehicles ({vehicles.length}/{maxVehicles})
              </Divider>

              {vehicles.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No vehicles added yet.
                </Typography>
              ) : vehicles.map((v) => (
                <Paper key={v.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip label={v.vrm} color="primary" sx={{ fontWeight: 700, letterSpacing: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {v.make} {v.model} · {v.colour}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {v.fuel} · CO₂ {v.co2} g/km · {v.euro}
                      </Typography>
                    </Box>
                    {v.fuel === 'Diesel' && (
                      <Tooltip title="Diesel surcharge may apply">
                        <Chip size="small" label="Diesel" color="warning" variant="outlined" />
                      </Tooltip>
                    )}
                    {v.fuel === 'Electric' && (
                      <Chip size="small" label="Zero-emission" color="success" variant="outlined" />
                    )}
                    <IconButton size="small" onClick={() => setVehicles((prev) => prev.filter((x) => x.id !== v.id))}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}

          {/* --- Documents --- */}
          {step === 2 && (
            <Stack spacing={2.5} sx={{ maxWidth: 760 }}>
              <Typography variant="h6">Documents</Typography>
              <Alert severity="info">
                Maximum file size <strong>2 MB</strong>. Accepted formats: PDF, JPG, PNG. Files marked * are required.
              </Alert>

              {DOC_TYPES.map((d) => (
                <Paper key={d.key} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2">{d.label}{d.required && ' *'}</Typography>
                      <Typography variant="caption" color="text.secondary">{d.help}</Typography>
                    </Box>
                    <Button size="small" variant="outlined" startIcon={<CloudUploadIcon />}
                      onClick={() => addFakeFile(d.key, `${d.key}-${docFiles[d.key].length + 1}.pdf`)}>
                      Upload
                    </Button>
                  </Stack>

                  {errors[`doc_${d.key}`] && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                      {errors[`doc_${d.key}`]}
                    </Typography>
                  )}

                  {docFiles[d.key].length > 0 && (
                    <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                      {docFiles[d.key].map((f, i) => (
                        <Stack key={i} direction="row" spacing={1} alignItems="center"
                          sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <InsertDriveFileIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ flex: 1 }}>{f.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{f.size} KB</Typography>
                          <IconButton size="small" onClick={() =>
                            setDocFiles((prev) => ({ ...prev, [d.key]: prev[d.key].filter((_, k) => k !== i) }))
                          }><CloseIcon fontSize="small" /></IconButton>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Paper>
              ))}
            </Stack>
          )}

          {/* --- Price --- */}
          {step === 3 && (
            <Stack spacing={2.5} sx={{ maxWidth: 640 }}>
              <Typography variant="h6">Pricing</Typography>
              <TextField size="small" select label="Duration" value={duration}
                onChange={(e) => setDuration(e.target.value)}>
                {Object.entries(DURATION_PRICES).map(([k, v]) =>
                  <MenuItem key={k} value={k}>{k} — £{v.toFixed(2)}</MenuItem>)}
              </TextField>
              <TextField size="small" type="number" label="Quantity" value={qty}
                inputProps={{ min: 1, max: 10 }}
                onChange={(e) => setQty(Math.max(1, Math.min(10, +e.target.value)))} />
              <FormControlLabel control={
                <Checkbox checked={dieselSurcharge} onChange={(_, c) => setDieselSurcharge(c)} />
              } label={`Apply diesel surcharge (${dieselCount} diesel vehicle${dieselCount === 1 ? '' : 's'} × £15)`} />

              <Divider />
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Row label={`Base (${duration} × ${qty})`} value={subtotal} />
                  <Row label="Diesel surcharge" value={dieselSurchargeAmount} />
                  <Row label="Admin fee" value={adminFee} />
                  <Divider />
                  <Row label="Total" value={total} bold />
                </Stack>
              </Paper>
            </Stack>
          )}

          {/* --- Checkout --- */}
          {step === 4 && (
            <Stack spacing={2.5} sx={{ maxWidth: 720 }}>
              <Typography variant="h6">Checkout</Typography>
              <Typography variant="subtitle2">Payment method</Typography>
              <RadioGroup value={payment} onChange={(e) => setPayment(e.target.value as any)}>
                <FormControlLabel value="credit"     control={<Radio />} label="Credit card" />
                <FormControlLabel value="debit"      control={<Radio />} label="Debit card" />
                <FormControlLabel value="costCenter" control={<Radio />} label="Cost centre / Budget code" />
                <FormControlLabel value="scratch"    control={<Radio />} label="Scratch card voucher" />
              </RadioGroup>
              {errors.payment && <Typography variant="caption" color="error">{errors.payment}</Typography>}

              {payment === 'costCenter' && (
                <TextField size="small" label="Cost centre code *" value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  error={!!errors.costCenter} helperText={errors.costCenter} />
              )}
              {payment === 'scratch' && (
                <TextField size="small" label="Scratch card voucher *" value={scratchCode}
                  onChange={(e) => setScratchCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SC-2026-000123"
                  error={!!errors.scratch} helperText={errors.scratch} />
              )}

              <Divider />
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2">
                  By clicking <strong>Apply</strong>, you agree to our{' '}
                  <Button size="small" onClick={() => setTcOpen(true)} sx={{ p: 0, minWidth: 0 }}>Terms and Conditions</Button>{' '}
                  and{' '}
                  <Button size="small" onClick={() => setPpOpen(true)} sx={{ p: 0, minWidth: 0 }}>Privacy Policy</Button>.
                </Typography>
                <FormControlLabel sx={{ mt: 1 }} control={
                  <Checkbox checked={tcAgreed} onChange={(_, c) => setTcAgreed(c)} />
                } label="I have read and accept the Terms and Conditions" />
                {errors.tc && <Typography variant="caption" color="error" sx={{ display: 'block' }}>{errors.tc}</Typography>}
              </Paper>
            </Stack>
          )}

          {/* Nav buttons */}
          <Divider sx={{ my: 3 }} />
          <Stack direction="row" justifyContent="space-between">
            <Button startIcon={<ArrowBackIcon />} disabled={step === 0} onClick={back}>Back</Button>
            {step < STEPS.length - 1 ? (
              <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={next}>Next</Button>
            ) : (
              <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={doSubmit}>Apply</Button>
            )}
          </Stack>
        </Paper>

        {/* Persistent summary sidebar */}
        <Paper sx={{ p: 2.5, alignSelf: 'flex-start', position: { lg: 'sticky' }, top: { lg: 16 } }}>
          <Typography variant="subtitle2" gutterBottom>Application summary</Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Stack spacing={1.5}>
            <SummaryRow ready={summaryReady.address} label="Address" onEdit={() => setStep(0)}
              value={effectiveAddress ? `${effectiveAddress.addressLine}, ${effectiveAddress.postCode}` : '—'}
              extra={effectiveAddress ? `Permit mode: ${permitMode}` : undefined} />
            <SummaryRow ready={summaryReady.vehicles} label="Vehicles" onEdit={() => setStep(1)}
              value={vehicles.length === 0 ? '—' : vehicles.map((v) => v.vrm).join(', ')}
              extra={vehicles.length > 0 ? `${vehicles.length}/${maxVehicles} added` : undefined} />
            <SummaryRow ready={summaryReady.docs} label="Documents" onEdit={() => setStep(2)}
              value={
                DOC_TYPES.filter((d) => docFiles[d.key].length > 0)
                  .map((d) => `${d.label} (${docFiles[d.key].length})`).join(', ') || '—'
              } />
            <SummaryRow ready={summaryReady.price} label="Price" onEdit={() => setStep(3)}
              value={`£${total.toFixed(2)} · ${duration} × ${qty}`} />
            <SummaryRow ready={summaryReady.checkout} label="Payment" onEdit={() => setStep(4)}
              value={payment ? paymentLabel(payment) : '—'} />
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Total due</Typography>
            <Typography variant="body2" fontWeight={700}>£{total.toFixed(2)}</Typography>
          </Stack>
        </Paper>
      </Box>

      {/* Cancel dialog */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Would you like to save your work as draft before leaving?
          <IconButton onClick={() => setCancelOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Choose <strong>Continue Purchase</strong> to stay on this page, <strong>Discard</strong> to leave without saving,
            or <strong>Save and Exit</strong> to keep your progress as a Draft you can resume later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)}>Continue Purchase</Button>
          <Button color="error" onClick={() => { setCancelOpen(false); nav('/exploreapplications'); }}>Discard</Button>
          <Button variant="contained" onClick={() => {
            setCancelOpen(false); handleSaveDraft();
            setTimeout(() => nav('/applications?tab=draft'), 900);
          }}>Save and Exit</Button>
        </DialogActions>
      </Dialog>

      {/* Apply success dialog */}
      <Dialog open={applyOpen} onClose={() => setApplyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon color="success" /> Application Submitted
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Thank you for submitting your application. Your permit will either be auto-approved or sent to the
            processing team for review, depending on the permit type. You will receive an email with the next steps
            once your permit is approved. To check your permit status, go to <strong>Manage Permits</strong> on the
            account home page. Your permit is not valid until its status shows <strong>Active</strong>.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">
            Would you like to apply for another <strong>{permissionType}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={backToPermits}>No Thanks — take me back to my permits</Button>
          <Button variant="contained" onClick={applyAgain}>Yes! Please</Button>
        </DialogActions>
      </Dialog>

      {/* T&C dialog */}
      <Dialog open={tcOpen} onClose={() => setTcOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Terms and Conditions — {permissionType}
          <IconButton sx={{ float: 'right' }} onClick={() => setTcOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" component="div">
            <p>These are the illustrative Terms and Conditions attached to this permission type in the Templates
              module. In production the content is looked up from the Terms and Conditions template linked to the
              permission via Permission Builder.</p>
            <p>The permit holder must display the permit as required, notify the council of any change of address or
              vehicle, and abide by all restrictions of the applicable Traffic Regulation Order.</p>
            <p>Refunds are subject to the refund policy set by your local authority.</p>
          </Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => setTcOpen(false)}>Close</Button></DialogActions>
      </Dialog>

      {/* Privacy dialog */}
      <Dialog open={ppOpen} onClose={() => setPpOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Privacy Policy
          <IconButton sx={{ float: 'right' }} onClick={() => setPpOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Your personal data is processed by the local authority for the purposes of managing your permit
            application. Full policy content is configured in Contract Settings → Policy URLs (Data Sharing).
          </Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => setPpOpen(false)}>Close</Button></DialogActions>
      </Dialog>

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" onClose={() => setToast(null)}>{toast}</Alert>
      </Snackbar>
    </Box>
  );
}

function paymentLabel(v: string) {
  return v === 'credit' ? 'Credit card'
       : v === 'debit'  ? 'Debit card'
       : v === 'costCenter' ? 'Cost centre / Budget code'
       : v === 'scratch' ? 'Scratch card voucher'
       : v;
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography sx={{ fontWeight: bold ? 700 : 400 }}>{label}</Typography>
      <Typography sx={{ fontWeight: bold ? 700 : 400 }}>£{value.toFixed(2)}</Typography>
    </Stack>
  );
}

function SummaryRow({ ready, label, value, extra, onEdit }: {
  ready: boolean; label: string; value: string; extra?: string; onEdit: () => void;
}) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <CheckCircleIcon fontSize="small" sx={{ color: ready ? 'success.main' : 'grey.400' }} />
          <Typography variant="caption" fontWeight={600}>{label}</Typography>
        </Stack>
        <IconButton size="small" onClick={onEdit}><EditIcon fontSize="inherit" /></IconButton>
      </Stack>
      <Typography variant="body2" sx={{ pl: 2.5, wordBreak: 'break-word' }}>{value}</Typography>
      {extra && <Typography variant="caption" color="text.secondary" sx={{ pl: 2.5 }}>{extra}</Typography>}
    </Box>
  );
}
