import { useMemo, useState } from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Autocomplete, Box, Button,
  Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
  FormControlLabel, IconButton, LinearProgress, MenuItem, Paper, Radio, RadioGroup,
  Snackbar, Stack, TextField, Typography, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';
import PoundIcon from '@mui/icons-material/CurrencyPound';
import PaymentIcon from '@mui/icons-material/Payment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { tokens } from '../../../theme';

// ---------------- Templates & mocks ----------------
const TEMPLATES = [
  { id: 'RES',  name: 'Resident Permit'   },
  { id: 'VIS',  name: 'Visitor Permit'    },
  { id: 'TRD',  name: 'Trades Permit'     },
  { id: 'BUS',  name: 'Business Permit'   },
  { id: 'BLU',  name: 'Blue Badge Permit' },
];

const POSTCODE_PROPERTIES: Record<string, { uprn: string; addressLine: string; town: string; postCode: string }[]> = {
  'RG1 1AA': [
    { uprn: '100091234567', addressLine: '12 Church Lane', town: 'Reading',   postCode: 'RG1 1AA' },
    { uprn: '100091234568', addressLine: '14 Church Lane', town: 'Reading',   postCode: 'RG1 1AA' },
  ],
  'RG2 8BB': [
    { uprn: '100091234570', addressLine: '48 Kingsway',    town: 'Reading',   postCode: 'RG2 8BB' },
  ],
  'RG4 5CC': [
    { uprn: '100091234572', addressLine: '1 Mill Road',    town: 'Caversham', postCode: 'RG4 5CC' },
  ],
};

const VEHICLE_DB: Record<string, { make: string; model: string; colour: string; fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'; co2: number; euro: string }> = {
  'AB12CDE': { make: 'Ford',     model: 'Focus',   colour: 'Blue',   fuel: 'Petrol',   co2: 120, euro: 'Euro 6' },
  'BD65XYZ': { make: 'Toyota',   model: 'Prius',   colour: 'Silver', fuel: 'Hybrid',   co2:  90, euro: 'Euro 6' },
  'EV24GRN': { make: 'Tesla',    model: 'Model 3', colour: 'White',  fuel: 'Electric', co2:   0, euro: 'N/A'    },
  'DV70FUL': { make: 'BMW',      model: '320d',    colour: 'Black',  fuel: 'Diesel',   co2: 130, euro: 'Euro 6' },
};

const DOC_TYPES = [
  { key: 'residency', label: 'Proof of Residency', required: true,  help: 'Recent utility bill or Council Tax letter (last 3 months).' },
  { key: 'vehicle',   label: 'Vehicle Ownership',  required: true,  help: 'V5C logbook or lease agreement.' },
  { key: 'blue',      label: 'Blue Badge',         required: false, help: 'Optional — attach if applicable.' },
];

const DURATION_PRICES: Record<string, number> = { '3 months': 22, '6 months': 40, '12 months': 75 };

const STEPS = [
  { key: 'address',  label: 'Address',  icon: <HomeIcon fontSize="small" /> },
  { key: 'vehicle',  label: 'Vehicle',  icon: <DirectionsCarIcon fontSize="small" /> },
  { key: 'document', label: 'Document', icon: <DescriptionIcon fontSize="small" /> },
  { key: 'pricing',  label: 'Pricing',  icon: <PoundIcon fontSize="small" /> },
  { key: 'checkout', label: 'Check Out',icon: <PaymentIcon fontSize="small" /> },
] as const;
type StepKey = typeof STEPS[number]['key'];

type Vehicle = { id: string; vrm: string; make: string; model: string; colour: string; fuel: string; co2: number; euro: string };
type DocFile = { name: string; size: number };
type PermitMode = 'digital' | 'physical';

export function ApplicationFormTab() {
  const [templateId, setTemplateId] = useState<string | null>('RES');
  const template = TEMPLATES.find((t) => t.id === templateId) || null;
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [confirmChangeOpen, setConfirmChangeOpen] = useState(false);

  // Builder shell state
  const [mode, setMode] = useState<'design' | 'preview'>('preview');
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>('draft');
  const [lastSaved, setLastSaved] = useState<string>('never');

  // Designer schema: sections mirror the wizard steps; each has a list of fields
  type DesignField = { id: string; type: 'text' | 'select' | 'radio' | 'checkbox' | 'file' | 'number' | 'date' | 'panel'; label: string; required: boolean; helper?: string; };
  type DesignSection = { key: StepKey; label: string; fields: DesignField[] };
  const [sections, setSections] = useState<DesignSection[]>(() => ([
    { key: 'address',  label: 'Address',
      fields: [
        { id: 'f1', type: 'radio',  label: 'Permit mode',       required: true },
        { id: 'f2', type: 'text',   label: 'Postcode',          required: true, helper: 'UK format (e.g. RG1 1AA)' },
        { id: 'f3', type: 'select', label: 'Property',          required: true, helper: 'Pick from lookup results' },
        { id: 'f4', type: 'text',   label: 'Address line 1',    required: false, helper: 'Auto-filled from UPRN' },
        { id: 'f5', type: 'text',   label: 'Town',              required: false },
        { id: 'f6', type: 'text',   label: 'UPRN',              required: false },
      ] },
    { key: 'vehicle', label: 'Vehicle',
      fields: [
        { id: 'f7', type: 'text',   label: 'VRM (Vehicle Registration Mark)', required: true, helper: 'Autoguru lookup' },
        { id: 'f8', type: 'number', label: 'Max Vehicles',      required: true, helper: 'Rule from permit type' },
      ] },
    { key: 'document', label: 'Document',
      fields: [
        { id: 'f9',  type: 'file', label: 'Proof of Residency', required: true, helper: 'Utility bill / Council Tax letter' },
        { id: 'f10', type: 'file', label: 'Vehicle Ownership',  required: true, helper: 'V5C logbook or lease agreement' },
        { id: 'f11', type: 'file', label: 'Blue Badge',         required: false, helper: 'Optional' },
      ] },
    { key: 'pricing', label: 'Pricing',
      fields: [
        { id: 'f12', type: 'select', label: 'Duration',         required: true },
        { id: 'f13', type: 'number', label: 'Quantity',         required: true },
        { id: 'f14', type: 'panel',  label: 'Diesel Surcharge', required: false, helper: 'Computed from vehicles' },
        { id: 'f15', type: 'panel',  label: 'Admin Fee',        required: false, helper: 'Contract setting' },
      ] },
    { key: 'checkout', label: 'Check Out',
      fields: [
        { id: 'f16', type: 'radio',    label: 'Payment method',     required: true },
        { id: 'f17', type: 'checkbox', label: 'Accept T&C',         required: true },
        { id: 'f18', type: 'checkbox', label: 'Privacy Policy',     required: true },
      ] },
  ]));
  const [selectedSection, setSelectedSection] = useState<StepKey>('address');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Wizard runtime state (unchanged — used only in Preview mode)
  const [step, setStep] = useState<number>(0);
  const [expanded, setExpanded] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Address
  const [permitMode, setPermitMode] = useState<PermitMode>('digital');
  const [addressChoice, setAddressChoice] = useState<'saved' | 'new'>('new');
  const [postcode, setPostcode] = useState('');
  const [selectedUprn, setSelectedUprn] = useState('');
  const postcodeMatches = POSTCODE_PROPERTIES[postcode.toUpperCase().trim()] || [];
  const chosenProperty = postcodeMatches.find((p) => p.uprn === selectedUprn);

  // Vehicle
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vrmInput, setVrmInput] = useState('');
  const [vrmError, setVrmError] = useState<string | null>(null);
  const [autoLoading, setAutoLoading] = useState(false);
  const maxVehicles = 3;

  const lookupAndAdd = () => {
    setVrmError(null);
    const cleaned = vrmInput.replace(/\s/g, '').toUpperCase();
    if (!cleaned) { setVrmError('Enter a VRM.'); return; }
    if (vehicles.length >= maxVehicles) { setVrmError(`Max ${maxVehicles} vehicles allowed.`); return; }
    if (vehicles.some((v) => v.vrm.replace(/\s/g, '') === cleaned)) { setVrmError('Already added.'); return; }
    setAutoLoading(true);
    setTimeout(() => {
      setAutoLoading(false);
      const hit = VEHICLE_DB[cleaned];
      if (!hit) { setVrmError('Vehicle not found. Please check the registration.'); return; }
      const formatted = `${cleaned.slice(0, cleaned.length - 3)} ${cleaned.slice(-3)}`;
      setVehicles((prev) => [...prev, { id: `V-${Date.now()}`, vrm: formatted, ...hit }]);
      setVrmInput('');
    }, 400);
  };

  // Documents
  const [docFiles, setDocFiles] = useState<Record<string, DocFile[]>>({ residency: [], vehicle: [], blue: [] });
  const addFile = (k: string, name: string) => {
    const size = 250 + Math.floor(Math.random() * 1800);
    setDocFiles((prev) => ({ ...prev, [k]: [...prev[k], { name, size }] }));
  };

  // Pricing
  const [duration, setDuration] = useState('12 months');
  const [qty, setQty] = useState(1);
  const adminFee = 3.5;
  const subtotal = DURATION_PRICES[duration] * qty;
  const dieselCount = vehicles.filter((v) => v.fuel === 'Diesel').length;
  const dieselSurcharge = dieselCount * 15;
  const total = subtotal + adminFee + dieselSurcharge;

  // Checkout
  const [payment, setPayment] = useState<'credit' | 'debit' | 'costCenter' | 'scratch' | ''>('');
  const [costCenter, setCostCenter] = useState('');
  const [scratchCode, setScratchCode] = useState('');
  const [tcAgreed, setTcAgreed] = useState(false);
  const [tcOpen, setTcOpen] = useState(false);
  const [ppOpen, setPpOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  // Validation
  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (addressChoice === 'new') {
        if (!postcode.trim()) e.postcode = 'This field is required.';
        if (!selectedUprn) e.property = 'Please select a property.';
      }
    }
    if (step === 1 && vehicles.length === 0) e.vehicles = 'Add at least one vehicle to continue.';
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
  const doSubmit = () => { if (validate()) setApplyOpen(true); };

  const summaryReady = useMemo(() => ({
    address:  !!chosenProperty || addressChoice === 'saved',
    vehicle:  vehicles.length > 0,
    document: DOC_TYPES.filter((d) => d.required).every((d) => docFiles[d.key].length > 0),
    pricing:  true,
    checkout: !!payment && tcAgreed,
  }), [chosenProperty, addressChoice, vehicles.length, docFiles, payment, tcAgreed]);

  // Builder shell handlers
  const nowStamp = () => new Date().toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
  const saveDraft = () => { setLastSaved(nowStamp()); setPublishStatus('draft'); setSavedToast('Draft saved.'); };
  const publish = () => { setLastSaved(nowStamp()); setPublishStatus('published'); setPublishOpen(false); setSavedToast('Form published to Apply portal.'); };
  const discardChanges = () => { setSavedToast('Changes discarded.'); };
  const confirmChangeTemplate = (newId: string) => { setTemplateId(newId); setConfirmChangeOpen(false); setTemplatePickerOpen(false); setSavedToast(`Template switched to ${TEMPLATES.find((t) => t.id === newId)?.name}.`); };

  const totalFields = sections.reduce((s, sec) => s + sec.fields.length, 0);
  const requiredFields = sections.reduce((s, sec) => s + sec.fields.filter((f) => f.required).length, 0);

  // Empty state — no template chosen yet
  if (!template) {
    return (
      <Box sx={{ maxWidth: 640, mx: 'auto', mt: 6, textAlign: 'center' }}>
        <Paper variant="outlined" sx={{ p: 5 }}>
          <Typography variant="h5" sx={{ fontFamily: tokens.HEADING, fontWeight: 700, mb: 1 }}>
            Application Form
          </Typography>
          <Typography sx={{ color: tokens.MUTED, mb: 3 }}>
            No form template selected yet. Choose a starter template to configure the applicant-facing form.
          </Typography>
          <Button variant="contained" onClick={() => setTemplatePickerOpen(true)}>Select Template</Button>
        </Paper>
        <TemplatePickerDialog
          open={templatePickerOpen}
          onClose={() => setTemplatePickerOpen(false)}
          onSelect={(id) => confirmChangeTemplate(id)}
          currentId={null}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* ---------------- Builder Shell Toolbar ---------------- */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#FAFBFC' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
            <Chip
              size="small" label="Template"
              sx={{ bgcolor: '#EAF3FB', color: '#0D3E66', fontWeight: 700, letterSpacing: '.05em' }}
            />
            <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.05rem', color: tokens.INK }}>
              {template.name}
            </Typography>
            <Button size="small" onClick={() => setConfirmChangeOpen(true)} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Change Template
            </Button>
            <Chip
              size="small"
              label={publishStatus === 'published' ? 'Published' : 'Draft'}
              sx={{
                bgcolor: publishStatus === 'published' ? '#E7F5EC' : '#FFF7E0',
                color:   publishStatus === 'published' ? '#1E7E34' : '#8A6D00',
                fontWeight: 600,
              }}
            />
            <Typography variant="caption" sx={{ color: tokens.MUTED }}>
              {totalFields} fields · {requiredFields} required · saved {lastSaved}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <ToggleButtonGroup
              size="small" exclusive value={mode}
              onChange={(_, v) => v && setMode(v)}
              sx={{ mr: 1 }}
            >
              <ToggleButton value="design"><EditIcon fontSize="small" sx={{ mr: 0.5 }} />Design</ToggleButton>
              <ToggleButton value="preview"><InsertDriveFileIcon fontSize="small" sx={{ mr: 0.5 }} />Preview</ToggleButton>
            </ToggleButtonGroup>
            <Button size="small" variant="outlined" onClick={discardChanges}>Discard</Button>
            <Button size="small" variant="outlined" onClick={saveDraft}>Save Draft</Button>
            <Button size="small" variant="contained" onClick={() => setPublishOpen(true)}>Publish</Button>
          </Stack>
        </Stack>
      </Paper>

      {/* ---------------- Design mode ---------------- */}
      {mode === 'design' && (
        <DesignerView
          sections={sections}
          setSections={setSections}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          selectedFieldId={selectedFieldId}
          setSelectedFieldId={setSelectedFieldId}
        />
      )}

      {/* ---------------- Preview mode (live wizard) ---------------- */}
      {mode === 'preview' && (
      <>
      {/* Numbered horizontal stepper */}
      <NumberedStepper current={step} onSelect={(i) => setStep(i)} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' }, gap: 3, mt: 3 }}>
        {/* Main form */}
        <Box>
          <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}
            sx={{ bgcolor: '#EAF3FB', boxShadow: 'none', border: '1px solid #C3DCF1', borderRadius: '6px !important', mb: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <InfoOutlinedIcon sx={{ color: '#1976D2' }} />
                <Typography sx={{ fontWeight: 600, color: '#0D3E66' }}>
                  Application for Permit Purchase
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#0D3E66' }}>
                Complete each step to submit your permit application. Fields marked with * are mandatory. You can
                save your progress as a draft and return later.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {step === 0 && (
            <Stack spacing={2.5}>
              <Section title="Select the Permit mode">
                <RadioGroup row value={permitMode} onChange={(e) => setPermitMode(e.target.value as PermitMode)}>
                  <FormControlLabel value="digital"  control={<Radio />} label="Digital permit (email + PDF)" />
                  <FormControlLabel value="physical" control={<Radio />} label="Physical permit (posted)" />
                </RadioGroup>
              </Section>

              <Section title="Address section">
                <ToggleButtonGroup exclusive size="small" value={addressChoice}
                  onChange={(_, v) => v && setAddressChoice(v)} sx={{ mb: 2 }}>
                  <ToggleButton value="saved">Use saved address</ToggleButton>
                  <ToggleButton value="new">Search a new address</ToggleButton>
                </ToggleButtonGroup>

                {addressChoice === 'saved' ? (
                  <Alert severity="success">
                    Using saved address: <strong>12 Church Lane, Reading, RG1 1AA</strong> — UPRN 100091234567
                  </Alert>
                ) : (
                  <Stack spacing={2}>
                    <FieldRow
                      label="Postcode *"
                      error={errors.postcode}
                      hint="Try RG1 1AA, RG2 8BB, RG4 5CC">
                      <TextField size="small" fullWidth value={postcode}
                        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                        placeholder="Enter postcode" error={!!errors.postcode} />
                    </FieldRow>

                    {postcode && postcodeMatches.length === 0 && (
                      <Alert severity="warning">No properties found for this postcode.</Alert>
                    )}

                    {postcodeMatches.length > 0 && (
                      <FieldRow label="Property *" error={errors.property}>
                        <Autocomplete size="small" options={postcodeMatches}
                          value={chosenProperty || null}
                          onChange={(_, v) => setSelectedUprn(v?.uprn || '')}
                          getOptionLabel={(o) => `${o.addressLine} — UPRN ${o.uprn}`}
                          renderInput={(p) => <TextField {...p} placeholder="Select property" error={!!errors.property} />} />
                      </FieldRow>
                    )}

                    <FieldRow label="Address line 1"><TextField size="small" fullWidth value={chosenProperty?.addressLine || ''} disabled /></FieldRow>
                    <FieldRow label="Town"><TextField size="small" fullWidth value={chosenProperty?.town || ''} disabled /></FieldRow>
                    <FieldRow label="UPRN"><TextField size="small" fullWidth value={chosenProperty?.uprn || ''} disabled /></FieldRow>
                  </Stack>
                )}
              </Section>
            </Stack>
          )}

          {step === 1 && (
            <Section title="Vehicle section">
              <Alert severity="info" sx={{ mb: 2 }}>
                Up to <strong>{maxVehicles}</strong> vehicles allowed. Autoguru autofills make, model, colour, CO₂ and Euro standard from the VRM.
              </Alert>
              <Stack direction="row" spacing={1}>
                <TextField size="small" label="VRM" value={vrmInput}
                  onChange={(e) => setVrmInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lookupAndAdd(); } }}
                  placeholder="e.g. AB12 CDE"
                  error={!!vrmError} helperText={vrmError || 'Try AB12 CDE, BD65 XYZ, EV24 GRN, DV70 FUL'}
                  disabled={vehicles.length >= maxVehicles} sx={{ flex: 1 }} />
                <Button variant="contained" onClick={lookupAndAdd} disabled={autoLoading || vehicles.length >= maxVehicles}>
                  {autoLoading ? 'Looking up…' : 'Add Vehicle'}
                </Button>
              </Stack>
              {autoLoading && <LinearProgress sx={{ mt: 1 }} />}
              {errors.vehicles && <Alert severity="error" sx={{ mt: 2 }}>{errors.vehicles}</Alert>}

              <Divider sx={{ my: 2 }}>Registered ({vehicles.length}/{maxVehicles})</Divider>

              {vehicles.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No vehicles added yet.
                </Typography>
              ) : vehicles.map((v) => (
                <Paper key={v.id} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip label={v.vrm} color="primary" sx={{ fontWeight: 700 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>{v.make} {v.model} · {v.colour}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {v.fuel} · CO₂ {v.co2} g/km · {v.euro}
                      </Typography>
                    </Box>
                    {v.fuel === 'Diesel'   && <Chip size="small" color="warning" variant="outlined" label="Diesel surcharge" />}
                    {v.fuel === 'Electric' && <Chip size="small" color="success" variant="outlined" label="Zero-emission" />}
                    <IconButton size="small" onClick={() => setVehicles((prev) => prev.filter((x) => x.id !== v.id))}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
            </Section>
          )}

          {step === 2 && (
            <Section title="Document section">
              <Alert severity="info" sx={{ mb: 2 }}>
                Maximum file size <strong>2 MB</strong>. Accepted formats: PDF, JPG, PNG. * denotes required.
              </Alert>
              {DOC_TYPES.map((d) => (
                <Paper key={d.key} variant="outlined" sx={{ p: 2, mb: 1.5 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">{d.label}{d.required && ' *'}</Typography>
                      <Typography variant="caption" color="text.secondary">{d.help}</Typography>
                    </Box>
                    <Button size="small" variant="outlined" startIcon={<CloudUploadIcon />}
                      onClick={() => addFile(d.key, `${d.key}-${docFiles[d.key].length + 1}.pdf`)}>
                      Upload
                    </Button>
                  </Stack>
                  {errors[`doc_${d.key}`] && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
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
            </Section>
          )}

          {step === 3 && (
            <Section title="Pricing section">
              <Stack spacing={2} sx={{ maxWidth: 460 }}>
                <TextField size="small" select label="Duration" value={duration}
                  onChange={(e) => setDuration(e.target.value)}>
                  {Object.entries(DURATION_PRICES).map(([k, v]) => (
                    <MenuItem key={k} value={k}>{k} — £{v.toFixed(2)}</MenuItem>
                  ))}
                </TextField>
                <TextField size="small" type="number" label="Quantity" value={qty}
                  inputProps={{ min: 1, max: 10 }}
                  onChange={(e) => setQty(Math.max(1, Math.min(10, +e.target.value)))} />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Paper variant="outlined" sx={{ p: 2, maxWidth: 460 }}>
                <Row label={`Base (${duration} × ${qty})`} value={subtotal} />
                <Row label={`Diesel surcharge (${dieselCount} × £15)`} value={dieselSurcharge} />
                <Row label="Admin fee" value={adminFee} />
                <Divider sx={{ my: 1 }} />
                <Row label="Total" value={total} bold />
              </Paper>
            </Section>
          )}

          {step === 4 && (
            <Section title="Check Out section">
              <Typography variant="subtitle2" gutterBottom>Payment method</Typography>
              <RadioGroup value={payment} onChange={(e) => setPayment(e.target.value as any)}>
                <FormControlLabel value="credit"     control={<Radio />} label="Credit card" />
                <FormControlLabel value="debit"      control={<Radio />} label="Debit card" />
                <FormControlLabel value="costCenter" control={<Radio />} label="Cost centre / Budget code" />
                <FormControlLabel value="scratch"    control={<Radio />} label="Scratch card voucher" />
              </RadioGroup>
              {errors.payment && <Typography variant="caption" color="error">{errors.payment}</Typography>}
              {payment === 'costCenter' && (
                <TextField size="small" fullWidth label="Cost centre code *" value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  error={!!errors.costCenter} helperText={errors.costCenter} sx={{ mt: 1, maxWidth: 460 }} />
              )}
              {payment === 'scratch' && (
                <TextField size="small" fullWidth label="Scratch card voucher *" value={scratchCode}
                  onChange={(e) => setScratchCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SC-2026-000123"
                  error={!!errors.scratch} helperText={errors.scratch} sx={{ mt: 1, maxWidth: 460 }} />
              )}
              <Divider sx={{ my: 2 }} />
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
            </Section>
          )}

          {/* Nav buttons */}
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
            <Button disabled={step === 0} onClick={back}>Back</Button>
            <Stack direction="row" spacing={1}>
              <Button onClick={() => setToast('Progress saved as Draft.')}>Save Draft</Button>
              {step < STEPS.length - 1 ? (
                <Button variant="contained" onClick={next}>Next</Button>
              ) : (
                <Button variant="contained" color="success" onClick={doSubmit}>Apply</Button>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* Summary sidebar */}
        <Paper variant="outlined" sx={{ p: 2, alignSelf: 'flex-start', position: { lg: 'sticky' }, top: { lg: 16 } }}>
          <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.05rem', mb: 1 }}>
            Summary
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Stack spacing={1.5}>
            <SummaryRow ready={summaryReady.address}  label="Address"  onEdit={() => setStep(0)}
              value={chosenProperty ? `${chosenProperty.addressLine}, ${chosenProperty.postCode}` : (addressChoice === 'saved' ? '12 Church Lane, RG1 1AA' : '—')} />
            <SummaryRow ready={summaryReady.vehicle}  label="Vehicle"  onEdit={() => setStep(1)}
              value={vehicles.length === 0 ? '—' : vehicles.map((v) => v.vrm).join(', ')} />
            <SummaryRow ready={summaryReady.document} label="Document" onEdit={() => setStep(2)}
              value={DOC_TYPES.filter((d) => docFiles[d.key].length > 0).map((d) => d.label).join(', ') || '—'} />
            <SummaryRow ready={summaryReady.pricing}  label="Pricing"  onEdit={() => setStep(3)}
              value={`£${total.toFixed(2)} · ${duration} × ${qty}`} />
            <SummaryRow ready={summaryReady.checkout} label="Check Out" onEdit={() => setStep(4)}
              value={payment ? paymentLabel(payment) : '—'} />
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Total due</Typography>
            <Typography variant="body2" fontWeight={700}>£{total.toFixed(2)}</Typography>
          </Stack>
        </Paper>
      </Box>
      </>
      )}

      {/* Change template picker (via toolbar Change Template) */}
      <TemplatePickerDialog
        open={templatePickerOpen}
        onClose={() => setTemplatePickerOpen(false)}
        onSelect={(id) => confirmChangeTemplate(id)}
        currentId={templateId}
      />

      {/* Confirm change template */}
      <Dialog open={confirmChangeOpen} onClose={() => setConfirmChangeOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Change template?</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Switching template will replace the current form structure. Any unsaved
            customisations will be lost. Continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmChangeOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { setConfirmChangeOpen(false); setTemplatePickerOpen(true); }}>
            Yes, pick another
          </Button>
        </DialogActions>
      </Dialog>

      {/* Publish confirm */}
      <Dialog open={publishOpen} onClose={() => setPublishOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Publish Application Form</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Publishing will make this form live on the Apply portal for
            <b> {template.name}</b>. Any active applicants will start seeing the updated form.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={publish}>Publish</Button>
        </DialogActions>
      </Dialog>

      {/* T&C */}
      <Dialog open={tcOpen} onClose={() => setTcOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Terms and Conditions — {template.name}
          <IconButton sx={{ float: 'right' }} onClick={() => setTcOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            These are the illustrative Terms and Conditions attached to this permission via the Templates module.
            The permit holder must display the permit as required, notify the council of any change of address or
            vehicle, and abide by all restrictions of the applicable Traffic Regulation Order.
          </Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => setTcOpen(false)}>Close</Button></DialogActions>
      </Dialog>

      {/* Privacy */}
      <Dialog open={ppOpen} onClose={() => setPpOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Privacy Policy
          <IconButton sx={{ float: 'right' }} onClick={() => setPpOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Your personal data is processed by the local authority for the purposes of managing your permit application.
            Full policy content is configured in Contract Settings → Policy URLs.
          </Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => setPpOpen(false)}>Close</Button></DialogActions>
      </Dialog>

      {/* Apply success */}
      <Dialog open={applyOpen} onClose={() => setApplyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckIcon color="success" /> Application Submitted
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Thank you for submitting your application. Your permit will either be auto-approved or sent to the
            processing team for review, depending on the permit type. You will receive an email with the next steps
            once your permit is approved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setApplyOpen(false); setStep(0); }}>No Thanks</Button>
          <Button variant="contained" onClick={() => { setApplyOpen(false); setStep(0); }}>Yes! Please</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!toast || !!savedToast} autoHideDuration={2500} onClose={() => { setToast(null); setSavedToast(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" onClose={() => { setToast(null); setSavedToast(null); }}>{toast || savedToast}</Alert>
      </Snackbar>
    </Box>
  );
}

// ---------------- Presentational helpers ----------------

function NumberedStepper({ current, onSelect }: { current: number; onSelect: (i: number) => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 0, py: 2 }}>
      {STEPS.map((s, i) => {
        const isActive = i === current;
        const isDone = i < current;
        const filled = isActive || isDone;
        return (
          <Box key={s.key} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box onClick={() => onSelect(i)}
              sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                cursor: 'pointer', minWidth: 96,
              }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: '50%',
                display: 'grid', placeItems: 'center',
                bgcolor: filled ? '#1976D2' : '#BDBDBD',
                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                transition: 'background-color .2s',
              }}>
                {isDone ? <CheckIcon fontSize="small" /> : i + 1}
              </Box>
              <Typography sx={{
                mt: 0.75, fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem', color: filled ? tokens.INK : tokens.MUTED,
              }}>
                {s.label}
              </Typography>
            </Box>
            {i < STEPS.length - 1 && (
              <Box sx={{ width: 64, height: 2, bgcolor: i < current ? '#1976D2' : '#E0E0E0', mx: -1.5, mt: -3 }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography sx={{ fontWeight: 600, color: tokens.INK, mb: 1.5 }}>{title}</Typography>
      {children}
    </Box>
  );
}

function FieldRow({ label, error, hint, children }: {
  label: string; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <Box sx={{
      p: 1.5, borderRadius: 1,
      border: error ? '1px solid #EF9A9A' : '1px solid #E0E0E0',
      bgcolor: error ? '#FDECEA' : 'transparent',
    }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
        {error && <ErrorOutlineIcon fontSize="small" color="error" />}
        <Typography variant="caption" fontWeight={600} color={error ? 'error' : 'text.secondary'}>
          {label}
        </Typography>
      </Stack>
      {children}
      {(error || hint) && (
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: error ? 'error.main' : 'text.secondary' }}>
          {error || hint}
        </Typography>
      )}
    </Box>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
      <Typography sx={{ fontWeight: bold ? 700 : 400 }}>{label}</Typography>
      <Typography sx={{ fontWeight: bold ? 700 : 400 }}>£{value.toFixed(2)}</Typography>
    </Stack>
  );
}

function SummaryRow({ ready, label, value, onEdit }: {
  ready: boolean; label: string; value: string; onEdit: () => void;
}) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <CheckIcon fontSize="small" sx={{ color: ready ? 'success.main' : 'grey.400' }} />
          <Typography variant="caption" fontWeight={600}>{label}</Typography>
        </Stack>
        <IconButton size="small" onClick={onEdit}><EditIcon fontSize="inherit" /></IconButton>
      </Stack>
      <Typography variant="body2" sx={{ pl: 2.5, wordBreak: 'break-word' }}>{value}</Typography>
    </Box>
  );
}

function paymentLabel(v: string) {
  return v === 'credit'     ? 'Credit card'
       : v === 'debit'      ? 'Debit card'
       : v === 'costCenter' ? 'Cost centre'
       : v === 'scratch'    ? 'Scratch voucher'
       : v;
}

// ---------------- Designer view (Form.io-style palette / canvas / properties) ----------------

type FieldType = 'text' | 'select' | 'radio' | 'checkbox' | 'file' | 'number' | 'date' | 'panel';
type DesignField = { id: string; type: FieldType; label: string; required: boolean; helper?: string };
type DesignSection = { key: 'address' | 'vehicle' | 'document' | 'pricing' | 'checkout'; label: string; fields: DesignField[] };

const PALETTE: { type: FieldType; label: string; }[] = [
  { type: 'text',     label: 'Text Field'   },
  { type: 'number',   label: 'Number'       },
  { type: 'date',     label: 'Date'         },
  { type: 'select',   label: 'Dropdown'     },
  { type: 'radio',    label: 'Radio Group'  },
  { type: 'checkbox', label: 'Checkbox'     },
  { type: 'file',     label: 'File Upload'  },
  { type: 'panel',    label: 'Info Panel'   },
];

function DesignerView({
  sections, setSections, selectedSection, setSelectedSection, selectedFieldId, setSelectedFieldId,
}: {
  sections: DesignSection[];
  setSections: (s: DesignSection[]) => void;
  selectedSection: DesignSection['key'];
  setSelectedSection: (k: DesignSection['key']) => void;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
}) {
  const current = sections.find((s) => s.key === selectedSection)!;
  const selectedField = current.fields.find((f) => f.id === selectedFieldId) || null;

  const addField = (type: FieldType) => {
    const nf: DesignField = {
      id: `nf-${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
      helper: '',
    };
    setSections(sections.map((s) => s.key === selectedSection ? { ...s, fields: [...s.fields, nf] } : s));
    setSelectedFieldId(nf.id);
  };
  const removeField = (id: string) => {
    setSections(sections.map((s) => s.key === selectedSection ? { ...s, fields: s.fields.filter((f) => f.id !== id) } : s));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };
  const move = (id: string, dir: -1 | 1) => {
    const list = [...current.fields];
    const i = list.findIndex((f) => f.id === id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    setSections(sections.map((s) => s.key === selectedSection ? { ...s, fields: list } : s));
  };
  const updateField = (patch: Partial<DesignField>) => {
    if (!selectedField) return;
    setSections(sections.map((s) => s.key === selectedSection
      ? { ...s, fields: s.fields.map((f) => f.id === selectedField.id ? { ...f, ...patch } : f) }
      : s));
  };

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', lg: '240px minmax(0, 1fr) 320px' },
      gap: 2,
      alignItems: 'start',
    }}>
      {/* -------- Palette -------- */}
      <Paper variant="outlined" sx={{ p: 1.5, position: { lg: 'sticky' }, top: { lg: 16 } }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '.08em', textTransform: 'uppercase', color: tokens.MUTED, mb: 1 }}>
          Components
        </Typography>
        <Stack spacing={0.75}>
          {PALETTE.map((p) => (
            <Box key={p.type}
              onClick={() => addField(p.type)}
              sx={{
                p: 1, borderRadius: 1, border: '1px dashed #C7D2DA', bgcolor: '#FAFBFC',
                cursor: 'grab', display: 'flex', alignItems: 'center', gap: 1,
                fontSize: '0.85rem', fontWeight: 500,
                '&:hover': { bgcolor: '#EAF3FB', borderColor: '#1976D2' },
              }}>
              <Box sx={{ width: 22, height: 22, borderRadius: '4px', bgcolor: '#E5EEF6', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#0D3E66' }}>
                {p.type[0].toUpperCase()}
              </Box>
              {p.label}
            </Box>
          ))}
        </Stack>
        <Typography variant="caption" sx={{ color: tokens.MUTED, mt: 1.5, display: 'block' }}>
          Click a component to add it to the current section.
        </Typography>
      </Paper>

      {/* -------- Canvas -------- */}
      <Box>
        {/* Section tabs */}
        <Paper variant="outlined" sx={{ p: 1, mb: 1.5 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {sections.map((s, i) => {
              const active = s.key === selectedSection;
              return (
                <Chip key={s.key} clickable
                  label={`${i + 1}. ${s.label} � ${s.fields.length}`}
                  onClick={() => { setSelectedSection(s.key); setSelectedFieldId(null); }}
                  sx={{
                    fontWeight: active ? 700 : 500,
                    bgcolor: active ? '#1976D2' : '#F0F3F6',
                    color: active ? '#FFF' : tokens.INK,
                    '&:hover': { bgcolor: active ? '#1565C0' : '#E5EEF6' },
                  }} />
              );
            })}
          </Stack>
        </Paper>

        {/* Field canvas */}
        <Paper variant="outlined" sx={{ p: 2, minHeight: 400, bgcolor: '#FAFBFC' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontFamily: tokens.HEADING, color: tokens.INK }}>
              {current.label} section
            </Typography>
            <Typography variant="caption" sx={{ color: tokens.MUTED }}>
              {current.fields.length} fields
            </Typography>
          </Stack>

          {current.fields.length === 0 && (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: '#FFF', borderStyle: 'dashed' }}>
              <Typography sx={{ color: tokens.MUTED, mb: 1 }}>No fields in this section yet.</Typography>
              <Typography variant="caption" sx={{ color: tokens.MUTED }}>
                Add fields from the Components panel on the left.
              </Typography>
            </Paper>
          )}

          <Stack spacing={1}>
            {current.fields.map((f, idx) => {
              const isSelected = f.id === selectedFieldId;
              return (
                <Paper key={f.id} variant="outlined"
                  onClick={() => setSelectedFieldId(f.id)}
                  sx={{
                    p: 1.5, cursor: 'pointer', bgcolor: '#FFF',
                    borderColor: isSelected ? '#1976D2' : '#E0E0E0',
                    boxShadow: isSelected ? '0 0 0 2px rgba(25,118,210,0.18)' : 'none',
                    '&:hover': { borderColor: '#1976D2' },
                  }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{
                      width: 24, height: 24, borderRadius: '4px',
                      bgcolor: '#E5EEF6', color: '#0D3E66',
                      display: 'grid', placeItems: 'center',
                      fontSize: '0.72rem', fontWeight: 700,
                    }}>{f.type[0].toUpperCase()}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ fontWeight: 600 }}>{f.label}</Typography>
                        {f.required && <Chip size="small" label="Required" sx={{ height: 18, bgcolor: '#FDECEA', color: '#B71C1C', fontWeight: 600, fontSize: '0.68rem' }} />}
                        <Chip size="small" variant="outlined" label={f.type} sx={{ height: 18, fontSize: '0.68rem' }} />
                      </Stack>
                      {f.helper && (
                        <Typography variant="caption" sx={{ color: tokens.MUTED }}>{f.helper}</Typography>
                      )}
                    </Box>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); move(f.id, -1); }} disabled={idx === 0} title="Move up">?</IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); move(f.id, 1); }} disabled={idx === current.fields.length - 1} title="Move down">?</IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeField(f.id); }} title="Delete">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Paper>
      </Box>

      {/* -------- Properties -------- */}
      <Paper variant="outlined" sx={{ p: 1.5, position: { lg: 'sticky' }, top: { lg: 16 } }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '.08em', textTransform: 'uppercase', color: tokens.MUTED, mb: 1.5 }}>
          Field Properties
        </Typography>
        {!selectedField && (
          <Typography variant="caption" sx={{ color: tokens.MUTED }}>
            Select a field on the canvas to edit its properties.
          </Typography>
        )}
        {selectedField && (
          <Stack spacing={1.5}>
            <TextField size="small" label="Label" value={selectedField.label} onChange={(e) => updateField({ label: e.target.value })} fullWidth />
            <TextField size="small" select label="Type" value={selectedField.type} onChange={(e) => updateField({ type: e.target.value as FieldType })} fullWidth>
              {PALETTE.map((p) => <MenuItem key={p.type} value={p.type}>{p.label}</MenuItem>)}
            </TextField>
            <TextField size="small" label="Helper text" value={selectedField.helper || ''} onChange={(e) => updateField({ helper: e.target.value })} fullWidth multiline rows={2} />
            <FormControlLabel control={<Checkbox checked={selectedField.required} onChange={(e) => updateField({ required: e.target.checked })} />} label="Required" />
            <Divider />
            <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => removeField(selectedField.id)}>
              Delete field
            </Button>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}

// ---------------- Template picker dialog ----------------

function TemplatePickerDialog({
  open, onClose, onSelect, currentId,
}: { open: boolean; onClose: () => void; onSelect: (id: string) => void; currentId: string | null }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Form Template</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ color: tokens.MUTED, mb: 2 }}>
          Choose a template as the starting point for this permission's application form.
          You can further customise fields in the Designer.
        </Typography>
        <Stack spacing={1}>
          {TEMPLATES.map((t) => {
            const active = currentId === t.id;
            return (
              <Paper key={t.id} variant="outlined"
                onClick={() => onSelect(t.id)}
                sx={{
                  p: 1.5, cursor: 'pointer',
                  borderColor: active ? '#1976D2' : '#E0E0E0',
                  bgcolor: active ? '#EAF3FB' : '#FFF',
                  '&:hover': { borderColor: '#1976D2' },
                }}>
                <Stack direction="row" alignItems="center" spacing={1.25}>
                  <Box sx={{
                    width: 34, height: 34, borderRadius: 1,
                    bgcolor: '#0D3E66', color: '#FFF',
                    display: 'grid', placeItems: 'center', fontWeight: 700,
                  }}>{t.id}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{t.name}</Typography>
                    <Typography variant="caption" sx={{ color: tokens.MUTED }}>
                      Standard 5-step form (Address � Vehicle � Document � Pricing � Check Out)
                    </Typography>
                  </Box>
                  {active && <Chip size="small" label="Current" color="primary" />}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
