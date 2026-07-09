/*
 * Application Form tab — mirrors the real Marston MNPS FormBuilderPage
 * (src/app/(pages)/builder/(dynamicformbuilder)/FormBuilderPage.tsx).
 *
 * Three-state flow, matching the real app 1:1:
 *   A. No draft yet     → "Select Template" label + template autocomplete + [EDIT]
 *   B. Draft saved      → "<template name>" label + "Change Template" link + read-only wizard preview
 *   C. Editing (showPreview=true) → "Edit <template name>" + [Cancel][Save/Update Form] + FormBuilder canvas
 *
 * Change Template popup:
 *   "Changing the template and saving it as a draft will retain only the changes
 *    made to the selected template. All other template changes will be lost."
 *   Actions: [Cancel] [Change Template]
 *
 * We render the Form.io wizard as a static preview (Address/Vehicle/Document/
 * Pricing/Check Out) and the FormBuilder as a Form.io-style drag-drop palette
 * + canvas + properties layout. All code is original.
 */
import { useMemo, useState } from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Autocomplete, Box, Button,
  Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
  FormControlLabel, IconButton, MenuItem, Paper, Radio, RadioGroup,
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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { tokens } from '../../../theme';

// ─── Template catalogue (mirrors real templateDataLoad shape) ───────────────
const TEMPLATES: { id: string; name: string; description: string }[] = [
  { id: 'RES', name: 'Resident Permit',   description: 'Standard 5-step form for residents' },
  { id: 'VIS', name: 'Visitor Permit',    description: 'Short form for visitor scratch/day permits' },
  { id: 'TRD', name: 'Trades Permit',     description: 'Trader / contractor permit with business details' },
  { id: 'BUS', name: 'Business Permit',   description: 'Business permit with fleet vehicle support' },
  { id: 'BLU', name: 'Blue Badge Permit', description: 'Blue badge holder with disability documentation' },
];

// ─── Address / vehicle / document mock DBs (used by the wizard preview) ────
const POSTCODE_PROPERTIES: Record<string, { uprn: string; addressLine: string; town: string; postCode: string }[]> = {
  'RG1 1AA': [
    { uprn: '100091234567', addressLine: '12 Church Lane', town: 'Reading',   postCode: 'RG1 1AA' },
    { uprn: '100091234568', addressLine: '14 Church Lane', town: 'Reading',   postCode: 'RG1 1AA' },
  ],
  'RG2 8BB': [
    { uprn: '100091234570', addressLine: '48 Kingsway', town: 'Reading', postCode: 'RG2 8BB' },
  ],
  'RG4 5CC': [
    { uprn: '100091234572', addressLine: '1 Mill Road', town: 'Caversham', postCode: 'RG4 5CC' },
  ],
};

const VEHICLE_DB: Record<string, { make: string; model: string; colour: string; fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'; co2: number; euro: string }> = {
  'AB12CDE': { make: 'Ford',   model: 'Focus',   colour: 'Blue',   fuel: 'Petrol',   co2: 120, euro: 'Euro 6' },
  'BD65XYZ': { make: 'Toyota', model: 'Prius',   colour: 'Silver', fuel: 'Hybrid',   co2:  90, euro: 'Euro 6' },
  'EV24GRN': { make: 'Tesla',  model: 'Model 3', colour: 'White',  fuel: 'Electric', co2:   0, euro: 'N/A'    },
  'DV70FUL': { make: 'BMW',    model: '320d',    colour: 'Black',  fuel: 'Diesel',   co2: 130, euro: 'Euro 6' },
};

const DOC_TYPES = [
  { key: 'residency', label: 'Proof of Residency', required: true,  help: 'Recent utility bill or Council Tax letter (last 3 months).' },
  { key: 'vehicle',   label: 'Vehicle Ownership',  required: true,  help: 'V5C logbook or lease agreement.' },
  { key: 'blue',      label: 'Blue Badge',         required: false, help: 'Optional — attach if applicable.' },
];

const DURATION_PRICES: Record<string, number> = { '3 months': 22, '6 months': 40, '12 months': 75 };

const STEPS = [
  { key: 'address',  label: 'Address',   icon: <HomeIcon fontSize="small" /> },
  { key: 'vehicle',  label: 'Vehicle',   icon: <DirectionsCarIcon fontSize="small" /> },
  { key: 'document', label: 'Document',  icon: <DescriptionIcon fontSize="small" /> },
  { key: 'pricing',  label: 'Pricing',   icon: <PoundIcon fontSize="small" /> },
  { key: 'checkout', label: 'Check Out', icon: <PaymentIcon fontSize="small" /> },
] as const;
type StepKey = typeof STEPS[number]['key'];

// ─── Form.io-style builder palette (mirrors the real drag palette) ─────────
type FormioType =
  | 'textfield' | 'textarea' | 'number' | 'password' | 'checkbox' | 'selectboxes'
  | 'select' | 'radio' | 'button' | 'email' | 'url' | 'phoneNumber' | 'tags'
  | 'address' | 'datetime' | 'day' | 'time' | 'currency' | 'survey' | 'signature' | 'file'
  | 'htmlelement' | 'content' | 'columns' | 'fieldset' | 'panel' | 'table' | 'tabs' | 'well'
  | 'datagrid' | 'editgrid' | 'container';

type PaletteGroup = { title: string; items: { type: FormioType; label: string }[] };
const PALETTE: PaletteGroup[] = [
  { title: 'Basic', items: [
    { type: 'textfield', label: 'Text Field' }, { type: 'textarea', label: 'Text Area' },
    { type: 'number', label: 'Number' }, { type: 'password', label: 'Password' },
    { type: 'checkbox', label: 'Checkbox' }, { type: 'selectboxes', label: 'Select Boxes' },
    { type: 'select', label: 'Select' }, { type: 'radio', label: 'Radio' },
    { type: 'button', label: 'Button' },
  ]},
  { title: 'Advanced', items: [
    { type: 'email', label: 'Email' }, { type: 'url', label: 'Url' },
    { type: 'phoneNumber', label: 'Phone Number' }, { type: 'tags', label: 'Tags' },
    { type: 'address', label: 'Address' }, { type: 'datetime', label: 'Date / Time' },
    { type: 'day', label: 'Day' }, { type: 'time', label: 'Time' },
    { type: 'currency', label: 'Currency' }, { type: 'survey', label: 'Survey' },
    { type: 'signature', label: 'Signature' }, { type: 'file', label: 'File' },
  ]},
  { title: 'Layout', items: [
    { type: 'htmlelement', label: 'HTML Element' }, { type: 'content', label: 'Content' },
    { type: 'columns', label: 'Columns' }, { type: 'fieldset', label: 'Field Set' },
    { type: 'panel', label: 'Panel' }, { type: 'table', label: 'Table' },
    { type: 'tabs', label: 'Tabs' }, { type: 'well', label: 'Well' },
  ]},
  { title: 'Data', items: [
    { type: 'datagrid', label: 'Data Grid' }, { type: 'editgrid', label: 'Edit Grid' },
    { type: 'container', label: 'Container' },
  ]},
];

type BuilderComponent = {
  id: string;
  type: FormioType;
  label: string;
  key: string;
  input: boolean;
  required?: boolean;
  placeholder?: string;
  description?: string;
};

type PermitMode = 'digital' | 'physical';
type Vehicle = { id: string; vrm: string; make: string; model: string; colour: string; fuel: string; co2: number; euro: string };
type DocFile = { name: string; size: number };

// ─── Component ─────────────────────────────────────────────────────────────
export function ApplicationFormTab() {
  // Template + draft state (mirrors real basicInformationData.isDraftAvailable)
  const [selectedTemplate, setSelectedTemplate] = useState<typeof TEMPLATES[number] | null>(null);
  const [isDraftAvailable, setIsDraftAvailable] = useState(false);   // has a saved draft
  const [draftChangeTemplate, setDraftChangeTemplate] = useState(false); // "swap template" mode
  const [showPreview, setShowPreview] = useState(false);             // real code names this `showPreview` but it means "in EDIT mode"
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [changeTemplatePopupOpen, setChangeTemplatePopupOpen] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [applicationFormError] = useState(0);                        // "Configure at least 1 form to publish"

  // Builder canvas state (used inside edit mode)
  const [builderComponents, setBuilderComponents] = useState<BuilderComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const selectedComponent = builderComponents.find((c) => c.id === selectedComponentId) || null;

  // Wizard preview interactive state (only for preview mode)
  const [step, setStep] = useState(0);
  const [permitMode, setPermitMode] = useState<PermitMode>('digital');
  const [postcode, setPostcode] = useState('');
  const [selectedUprn, setSelectedUprn] = useState('');
  const postcodeMatches = POSTCODE_PROPERTIES[postcode.toUpperCase().trim()] || [];
  const chosenProperty = postcodeMatches.find((p) => p.uprn === selectedUprn);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vrmInput, setVrmInput] = useState('');
  const [vrmError, setVrmError] = useState<string | null>(null);
  const [docFiles, setDocFiles] = useState<Record<string, DocFile[]>>({ residency: [], vehicle: [], blue: [] });
  const [duration, setDuration] = useState('12 months');
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState<'credit' | 'debit' | 'costCenter' | 'scratch' | ''>('');
  const [tcAgreed, setTcAgreed] = useState(false);

  // Handlers
  const handleSelectTemplate = (tpl: typeof TEMPLATES[number] | null) => {
    setSelectedTemplate(tpl);
    if (tpl) {
      // Seed the builder canvas from the template's baseline schema
      setBuilderComponents(seedComponentsForTemplate(tpl.id));
    }
  };
  const openEditor = () => setShowPreview(true);
  const cancelEditor = () => setShowPreview(false);
  const saveForm = () => {
    setIsDraftAvailable(true);
    setDraftChangeTemplate(false);
    setFormMode('edit');
    setShowPreview(false);
    setFlash(formMode === 'edit' ? 'Form updated successfully.' : 'Form saved successfully.');
  };
  const publish = () => {
    setPublishConfirmOpen(false);
    setFlash('Application form published to Apply portal.');
  };

  const addPaletteComponent = (t: FormioType, label: string) => {
    const id = `c-${Date.now()}`;
    const key = label.replace(/\s+/g, '').charAt(0).toLowerCase() + label.replace(/\s+/g, '').slice(1);
    const nc: BuilderComponent = { id, type: t, label, key, input: !['button', 'htmlelement', 'content', 'columns', 'fieldset', 'panel', 'table', 'tabs', 'well', 'container'].includes(t), required: false };
    setBuilderComponents((prev) => [...prev, nc]);
    setSelectedComponentId(id);
  };
  const updateComponent = (patch: Partial<BuilderComponent>) => {
    if (!selectedComponent) return;
    setBuilderComponents((prev) => prev.map((c) => c.id === selectedComponent.id ? { ...c, ...patch } : c));
  };
  const removeComponent = (id: string) => {
    setBuilderComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedComponentId === id) setSelectedComponentId(null);
  };
  const moveComponent = (id: string, dir: -1 | 1) => {
    setBuilderComponents((prev) => {
      const i = prev.findIndex((c) => c.id === id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  // Label logic (mirrors the real ternary): if no draft OR switching draft template -> "Select Template"; else show template name
  const showTemplatePicker = !isDraftAvailable || draftChangeTemplate;
  const headerLabel = showTemplatePicker ? 'Select Template' : (selectedTemplate?.name || '');

  return (
    <Box className="form-builder" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {applicationFormError > 0 && (
        <Alert severity="error">Configure at least 1 form to publish</Alert>
      )}

      {!showPreview ? (
        // ═══════════════════════════════ PREVIEW MODE ═══════════════════════════════
        <>
          {/* Template selection row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontWeight: 600, color: tokens.INK, minWidth: 200 }}>
                {headerLabel}
              </Typography>
              {showTemplatePicker ? (
                <Autocomplete
                  size="small"
                  sx={{ width: 320 }}
                  options={TEMPLATES}
                  value={selectedTemplate}
                  onChange={(_, v) => handleSelectTemplate(v)}
                  getOptionLabel={(o) => o.name}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  renderInput={(p) => <TextField {...p} placeholder="Type and select" />}
                />
              ) : (
                <Typography
                  onClick={() => setChangeTemplatePopupOpen(true)}
                  sx={{
                    cursor: 'pointer', color: '#1976D2', fontWeight: 600, fontSize: '0.9rem',
                    '&:hover': { textDecoration: 'underline' },
                  }}>
                  Change Template
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={1}>
              {showTemplatePicker && (
                <Button
                  variant="contained"
                  disabled={!selectedTemplate}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                  onClick={openEditor}>
                  EDIT
                </Button>
              )}
              {isDraftAvailable && !draftChangeTemplate && (
                <>
                  <Button variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }} onClick={openEditor}>
                    Edit Form
                  </Button>
                  <Button variant="contained" sx={{ borderRadius: 2, textTransform: 'none' }} onClick={() => setPublishConfirmOpen(true)}>
                    Publish
                  </Button>
                </>
              )}
            </Stack>
          </Box>

          {/* Preview area — read-only Form.io wizard rendering */}
          <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
            {!selectedTemplate ? (
              <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#FAFBFC' }}>
                <InsertDriveFileIcon sx={{ fontSize: 48, color: tokens.MUTED, mb: 1 }} />
                <Typography sx={{ fontWeight: 600, color: tokens.INK, mb: 0.5 }}>No template selected</Typography>
                <Typography sx={{ color: tokens.MUTED, fontSize: '0.9rem' }}>
                  Choose a template above to preview the applicant-facing form.
                </Typography>
              </Box>
            ) : (
              <WizardPreview
                templateName={selectedTemplate.name}
                step={step} setStep={setStep}
                permitMode={permitMode} setPermitMode={setPermitMode}
                postcode={postcode} setPostcode={setPostcode}
                postcodeMatches={postcodeMatches}
                chosenProperty={chosenProperty}
                selectedUprn={selectedUprn} setSelectedUprn={setSelectedUprn}
                vehicles={vehicles} setVehicles={setVehicles}
                vrmInput={vrmInput} setVrmInput={setVrmInput}
                vrmError={vrmError} setVrmError={setVrmError}
                docFiles={docFiles} setDocFiles={setDocFiles}
                duration={duration} setDuration={setDuration}
                qty={qty} setQty={setQty}
                payment={payment} setPayment={setPayment}
                tcAgreed={tcAgreed} setTcAgreed={setTcAgreed}
              />
            )}
          </Paper>
        </>
      ) : (
        // ═══════════════════════════════ EDIT MODE ═══════════════════════════════
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: tokens.INK }}>
              {`Edit ${selectedTemplate?.name || ''}`}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }} onClick={cancelEditor}>
                Cancel
              </Button>
              <Button variant="contained" sx={{ borderRadius: 2, textTransform: 'none' }} onClick={saveForm}>
                {formMode === 'edit' ? 'Update Form' : 'Save Form'}
              </Button>
            </Stack>
          </Box>

          <FormioBuilderCanvas
            components={builderComponents}
            selectedId={selectedComponentId}
            onSelect={setSelectedComponentId}
            onAdd={addPaletteComponent}
            onRemove={removeComponent}
            onMove={moveComponent}
            selectedComponent={selectedComponent}
            onUpdate={updateComponent}
          />
        </>
      )}

      {/* ═══════════════════════ Change Template popup (matches real DPSDialog) ═══════════════════════ */}
      <Dialog open={changeTemplatePopupOpen} onClose={() => setChangeTemplatePopupOpen(false)} maxWidth="xs" fullWidth
        TransitionProps={{ timeout: 200 }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Change Template</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2, color: '#252627' }}>
            Changing the template and saving it as a draft will retain only the changes made to
            the selected template. All other template changes will be lost.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#252627' }}>
            Are you okay to change the template?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setChangeTemplatePopupOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ borderRadius: 2, textTransform: 'none' }}
            onClick={() => { setDraftChangeTemplate(true); setChangeTemplatePopupOpen(false); }}>
            Change Template
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={publishConfirmOpen} onClose={() => setPublishConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Publish Application Form</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Publishing will make this application form live on the Apply portal for
            <b> {selectedTemplate?.name}</b>. Active applicants will start seeing the updated form immediately.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={publish}>Publish</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!flash} autoHideDuration={2600} onClose={() => setFlash(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" onClose={() => setFlash(null)}>{flash}</Alert>
      </Snackbar>
    </Box>
  );
}

// ═══════════════════════ Wizard Preview (read-only render of the applicant form) ═══════════════════════

type WizardProps = {
  templateName: string;
  step: number; setStep: (n: number) => void;
  permitMode: PermitMode; setPermitMode: (m: PermitMode) => void;
  postcode: string; setPostcode: (s: string) => void;
  postcodeMatches: { uprn: string; addressLine: string; town: string; postCode: string }[];
  chosenProperty: { uprn: string; addressLine: string; town: string; postCode: string } | undefined;
  selectedUprn: string; setSelectedUprn: (s: string) => void;
  vehicles: Vehicle[]; setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  vrmInput: string; setVrmInput: (s: string) => void;
  vrmError: string | null; setVrmError: (s: string | null) => void;
  docFiles: Record<string, DocFile[]>; setDocFiles: React.Dispatch<React.SetStateAction<Record<string, DocFile[]>>>;
  duration: string; setDuration: (s: string) => void;
  qty: number; setQty: (n: number) => void;
  payment: 'credit' | 'debit' | 'costCenter' | 'scratch' | ''; setPayment: (v: any) => void;
  tcAgreed: boolean; setTcAgreed: (b: boolean) => void;
};

function WizardPreview(p: WizardProps) {
  const {
    templateName, step, setStep, permitMode, setPermitMode,
    postcode, setPostcode, postcodeMatches, chosenProperty, selectedUprn, setSelectedUprn,
    vehicles, setVehicles, vrmInput, setVrmInput, vrmError, setVrmError,
    docFiles, setDocFiles, duration, setDuration, qty, setQty, payment, setPayment, tcAgreed, setTcAgreed,
  } = p;

  const adminFee = 3.5;
  const subtotal = DURATION_PRICES[duration] * qty;
  const dieselCount = vehicles.filter((v) => v.fuel === 'Diesel').length;
  const dieselSurcharge = dieselCount * 15;
  const total = subtotal + adminFee + dieselSurcharge;

  const addVehicle = () => {
    setVrmError(null);
    const cleaned = vrmInput.replace(/\s/g, '').toUpperCase();
    if (!cleaned) { setVrmError('Enter a VRM.'); return; }
    if (vehicles.length >= 3) { setVrmError('Max 3 vehicles allowed.'); return; }
    if (vehicles.some((v) => v.vrm.replace(/\s/g, '') === cleaned)) { setVrmError('Already added.'); return; }
    const hit = VEHICLE_DB[cleaned];
    if (!hit) { setVrmError('Vehicle not found. Try AB12CDE, BD65XYZ, EV24GRN, DV70FUL.'); return; }
    const formatted = `${cleaned.slice(0, cleaned.length - 3)} ${cleaned.slice(-3)}`;
    setVehicles((prev) => [...prev, { id: `V-${Date.now()}`, vrm: formatted, ...hit }]);
    setVrmInput('');
  };

  const addFile = (k: string, name: string) =>
    setDocFiles((prev) => ({ ...prev, [k]: [...prev[k], { name, size: 200 + Math.floor(Math.random() * 1800) }] }));

  const summary = {
    address: !!chosenProperty ? `${chosenProperty.addressLine}, ${chosenProperty.town}` : '—',
    vehicle: vehicles.length ? `${vehicles.length} vehicle${vehicles.length > 1 ? 's' : ''}` : '—',
    document: DOC_TYPES.filter((d) => d.required).every((d) => docFiles[d.key].length > 0) ? 'Uploaded' : '—',
    pricing: `${duration} × ${qty}`,
    checkout: payment ? paymentLabel(payment) : '—',
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#FFF' }}>
      <NumberedStepper current={step} onSelect={setStep} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' }, gap: 3, mt: 3 }}>
        <Box>
          <Accordion defaultExpanded sx={{ bgcolor: '#EAF3FB', boxShadow: 'none', border: '1px solid #C3DCF1', borderRadius: '6px !important', mb: 2, '&:before': { display: 'none' } }}>
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
                Live preview of the <b>{templateName}</b> applicant form. Interact with any step
                below to see how it behaves for citizens on the Apply portal.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {step === 0 && (
            <Stack spacing={2}>
              <Section title="Select the Permit mode">
                <RadioGroup row value={permitMode} onChange={(e) => setPermitMode(e.target.value as PermitMode)}>
                  <FormControlLabel value="digital"  control={<Radio />} label="Digital permit (email + PDF)" />
                  <FormControlLabel value="physical" control={<Radio />} label="Physical permit (posted)" />
                </RadioGroup>
              </Section>
              <Section title="Address section">
                <FieldRow label="Postcode *" hint="Try RG1 1AA, RG2 8BB, RG4 5CC">
                  <TextField size="small" fullWidth value={postcode} onChange={(e) => setPostcode(e.target.value.toUpperCase())} placeholder="Enter postcode" />
                </FieldRow>
                {postcode && postcodeMatches.length === 0 && (
                  <Alert severity="warning">No properties found for this postcode.</Alert>
                )}
                {postcodeMatches.length > 0 && (
                  <FieldRow label="Property *">
                    <Autocomplete size="small" options={postcodeMatches}
                      value={chosenProperty || null}
                      onChange={(_, v) => setSelectedUprn(v?.uprn || '')}
                      getOptionLabel={(o) => `${o.addressLine} — UPRN ${o.uprn}`}
                      renderInput={(p) => <TextField {...p} placeholder="Select property" />} />
                  </FieldRow>
                )}
                <FieldRow label="Address line 1"><TextField size="small" fullWidth value={chosenProperty?.addressLine || ''} disabled /></FieldRow>
                <FieldRow label="Town"><TextField size="small" fullWidth value={chosenProperty?.town || ''} disabled /></FieldRow>
                <FieldRow label="UPRN"><TextField size="small" fullWidth value={chosenProperty?.uprn || ''} disabled /></FieldRow>
              </Section>
            </Stack>
          )}

          {step === 1 && (
            <Stack spacing={2}>
              <Section title="Add Vehicle (Autoguru lookup)">
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <TextField size="small" placeholder="VRM (e.g. AB12CDE)" value={vrmInput}
                    onChange={(e) => setVrmInput(e.target.value.toUpperCase())} sx={{ flex: 1 }} />
                  <Button variant="contained" onClick={addVehicle} disabled={vehicles.length >= 3}>Add Vehicle</Button>
                </Stack>
                {vrmError && <Alert severity="error" sx={{ mb: 1 }}>{vrmError}</Alert>}
                {vehicles.map((v) => (
                  <Paper key={v.id} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{v.vrm}</Typography>
                        <Typography variant="caption" color="text.secondary">{v.make} {v.model} · {v.colour} · {v.fuel} · CO2 {v.co2} · {v.euro}</Typography>
                      </Box>
                      <IconButton size="small" onClick={() => setVehicles((prev) => prev.filter((x) => x.id !== v.id))}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Paper>
                ))}
              </Section>
            </Stack>
          )}

          {step === 2 && (
            <Stack spacing={2}>
              {DOC_TYPES.map((d) => (
                <Section key={d.key} title={`${d.label}${d.required ? ' *' : ''}`}>
                  <Typography variant="caption" color="text.secondary">{d.help}</Typography>
                  <Button component="label" variant="outlined" size="small" startIcon={<CloudUploadIcon />} sx={{ mt: 1 }}>
                    Upload
                    <input hidden type="file" onChange={(e) => e.target.files?.[0] && addFile(d.key, e.target.files[0].name)} />
                  </Button>
                  {docFiles[d.key].map((f) => (
                    <Chip key={f.name} label={`${f.name} (${f.size} KB)`} size="small" sx={{ mt: 1, mr: 0.5 }}
                      onDelete={() => setDocFiles((prev) => ({ ...prev, [d.key]: prev[d.key].filter((x) => x.name !== f.name) }))} />
                  ))}
                </Section>
              ))}
            </Stack>
          )}

          {step === 3 && (
            <Section title="Pricing">
              <Stack direction="row" spacing={2}>
                <TextField select size="small" label="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} sx={{ minWidth: 180 }}>
                  {Object.keys(DURATION_PRICES).map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </TextField>
                <TextField type="number" size="small" label="Quantity" value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))} sx={{ width: 120 }} />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Row label={`Base (${duration} × ${qty})`} value={subtotal} />
              <Row label="Admin fee" value={adminFee} />
              <Row label={`Diesel surcharge (${dieselCount} × £15)`} value={dieselSurcharge} />
              <Divider sx={{ my: 1 }} />
              <Row label="Total" value={total} bold />
            </Section>
          )}

          {step === 4 && (
            <Section title="Check Out">
              <RadioGroup value={payment} onChange={(e) => setPayment(e.target.value as any)}>
                <FormControlLabel value="credit" control={<Radio />} label="Credit card" />
                <FormControlLabel value="debit"  control={<Radio />} label="Debit card" />
                <FormControlLabel value="costCenter" control={<Radio />} label="Cost centre" />
                <FormControlLabel value="scratch" control={<Radio />} label="Scratch voucher" />
              </RadioGroup>
              <FormControlLabel sx={{ mt: 1 }}
                control={<Checkbox checked={tcAgreed} onChange={(e) => setTcAgreed(e.target.checked)} />}
                label="I agree to the Terms & Conditions and Privacy Policy" />
            </Section>
          )}

          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button variant="text" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>Back</Button>
            {step < STEPS.length - 1 ? (
              <Button variant="contained" onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>Next</Button>
            ) : (
              <Button variant="contained" color="success" disabled={!tcAgreed || !payment}>Apply</Button>
            )}
          </Stack>
        </Box>

        {/* Summary sidebar */}
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#FAFBFC' }}>
          <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Summary</Typography>
          <Stack spacing={1}>
            {STEPS.map((s, i) => (
              <SummaryRow key={s.key}
                ready={!!(summary as any)[s.key] && (summary as any)[s.key] !== '—'}
                label={s.label}
                value={(summary as any)[s.key]}
                onEdit={() => setStep(i)} />
            ))}
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography sx={{ fontWeight: 700 }}>£{total.toFixed(2)}</Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

// ═══════════════════════ Form.io FormBuilder Canvas ═══════════════════════

function FormioBuilderCanvas({
  components, selectedId, onSelect, onAdd, onRemove, onMove, selectedComponent, onUpdate,
}: {
  components: BuilderComponent[]; selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: (t: FormioType, label: string) => void;
  onRemove: (id: string) => void; onMove: (id: string, dir: -1 | 1) => void;
  selectedComponent: BuilderComponent | null;
  onUpdate: (patch: Partial<BuilderComponent>) => void;
}) {
  const [openGroup, setOpenGroup] = useState<Record<string, boolean>>({ Basic: true, Advanced: true, Layout: false, Data: false });
  const [propTab, setPropTab] = useState<'display' | 'data' | 'validation'>('display');

  return (
    <Paper variant="outlined" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0, 1fr) 320px' }, minHeight: '65vh' }}>
      {/* ─── Palette (real form.io builder has this on the left) ─── */}
      <Box sx={{ borderRight: { lg: '1px solid #E0E0E0' }, p: 1.5, overflowY: 'auto', maxHeight: { lg: '65vh' } }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '.08em', textTransform: 'uppercase', color: tokens.MUTED, mb: 1 }}>
          Form Components
        </Typography>
        {PALETTE.map((grp) => (
          <Box key={grp.title} sx={{ mb: 1 }}>
            <Box onClick={() => setOpenGroup((g) => ({ ...g, [grp.title]: !g[grp.title] }))}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                p: 0.75, borderRadius: 1, cursor: 'pointer', bgcolor: '#F5F7FA', '&:hover': { bgcolor: '#EAF3FB' } }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: tokens.INK }}>{grp.title}</Typography>
              <ExpandMoreIcon sx={{ fontSize: 16, transform: openGroup[grp.title] ? 'rotate(180deg)' : 'none' }} />
            </Box>
            {openGroup[grp.title] && (
              <Stack spacing={0.5} sx={{ mt: 0.5, pl: 0.5 }}>
                {grp.items.map((it) => (
                  <Box key={it.type}
                    onClick={() => onAdd(it.type, it.label)}
                    sx={{
                      p: 0.75, borderRadius: 1, border: '1px dashed #C7D2DA', bgcolor: '#FFF',
                      cursor: 'grab', display: 'flex', alignItems: 'center', gap: 0.75,
                      fontSize: '0.8rem', fontWeight: 500,
                      '&:hover': { bgcolor: '#EAF3FB', borderColor: '#1976D2' },
                    }}>
                    <DragIndicatorIcon sx={{ fontSize: 16, color: tokens.MUTED }} />
                    {it.label}
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        ))}
      </Box>

      {/* ─── Canvas ─── */}
      <Box sx={{ p: 2, borderRight: { lg: '1px solid #E0E0E0' }, minHeight: '65vh', bgcolor: '#FAFBFC' }}>
        {components.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 5, textAlign: 'center', bgcolor: '#FFF', borderStyle: 'dashed' }}>
            <Typography sx={{ color: tokens.MUTED, mb: 1 }}>Drop or click components to build the form.</Typography>
            <Typography variant="caption" sx={{ color: tokens.MUTED }}>
              This is a preview of the Form.io drag-and-drop builder. Palette on the left → click to add.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={1}>
            {components.map((c, idx) => {
              const isSel = c.id === selectedId;
              return (
                <Paper key={c.id} variant="outlined"
                  onClick={() => onSelect(c.id)}
                  sx={{
                    p: 1.5, cursor: 'pointer', bgcolor: '#FFF',
                    borderColor: isSel ? '#1976D2' : '#E0E0E0',
                    boxShadow: isSel ? '0 0 0 2px rgba(25,118,210,0.18)' : 'none',
                    '&:hover': { borderColor: '#1976D2' },
                  }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <DragIndicatorIcon sx={{ color: tokens.MUTED }} />
                    <Box sx={{
                      width: 26, height: 26, borderRadius: '4px',
                      bgcolor: '#E5EEF6', color: '#0D3E66',
                      display: 'grid', placeItems: 'center', fontSize: '0.68rem', fontWeight: 700,
                    }}>{c.type.slice(0, 3).toUpperCase()}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600 }}>
                        {c.label} {c.required && <span style={{ color: '#B71C1C' }}>*</span>}
                      </Typography>
                      <Typography variant="caption" sx={{ color: tokens.MUTED }}>
                        {c.type} · key: <code>{c.key}</code>
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onMove(c.id, -1); }} disabled={idx === 0} title="Move up">▲</IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onMove(c.id, 1); }} disabled={idx === components.length - 1} title="Move down">▼</IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onRemove(c.id); }} title="Remove">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* ─── Properties (Display/Data/Validation tabs like Form.io) ─── */}
      <Box sx={{ p: 1.5, maxHeight: '65vh', overflowY: 'auto' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '.08em', textTransform: 'uppercase', color: tokens.MUTED, mb: 1 }}>
          Component Settings
        </Typography>
        {!selectedComponent && (
          <Typography variant="caption" sx={{ color: tokens.MUTED }}>
            Select a component on the canvas to edit its properties.
          </Typography>
        )}
        {selectedComponent && (
          <>
            <ToggleButtonGroup exclusive size="small" value={propTab} onChange={(_, v) => v && setPropTab(v)} sx={{ mb: 1.5 }}>
              <ToggleButton value="display">Display</ToggleButton>
              <ToggleButton value="data">Data</ToggleButton>
              <ToggleButton value="validation">Validation</ToggleButton>
            </ToggleButtonGroup>

            {propTab === 'display' && (
              <Stack spacing={1.5}>
                <TextField size="small" label="Label" value={selectedComponent.label} onChange={(e) => onUpdate({ label: e.target.value })} fullWidth />
                <TextField size="small" label="Placeholder" value={selectedComponent.placeholder || ''} onChange={(e) => onUpdate({ placeholder: e.target.value })} fullWidth />
                <TextField size="small" label="Description" value={selectedComponent.description || ''} onChange={(e) => onUpdate({ description: e.target.value })} fullWidth multiline rows={2} />
              </Stack>
            )}
            {propTab === 'data' && (
              <Stack spacing={1.5}>
                <TextField size="small" label="Property Name (key)" value={selectedComponent.key} onChange={(e) => onUpdate({ key: e.target.value })} fullWidth />
                <TextField size="small" label="Type" value={selectedComponent.type} disabled fullWidth />
                <FormControlLabel control={<Checkbox checked={selectedComponent.input} onChange={(e) => onUpdate({ input: e.target.checked })} />} label="Input Component" />
              </Stack>
            )}
            {propTab === 'validation' && (
              <Stack spacing={1.5}>
                <FormControlLabel control={<Checkbox checked={!!selectedComponent.required} onChange={(e) => onUpdate({ required: e.target.checked })} />} label="Required" />
                <Typography variant="caption" sx={{ color: tokens.MUTED }}>
                  Additional validators (min/max/pattern) can be attached at publish time.
                </Typography>
              </Stack>
            )}
            <Divider sx={{ my: 2 }} />
            <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => onRemove(selectedComponent.id)}>
              Remove component
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
}

// ─── Seed the builder canvas from a template ─────────────────────────────
function seedComponentsForTemplate(id: string): BuilderComponent[] {
  const t = (label: string, key: string, type: FormioType, required = false): BuilderComponent =>
    ({ id: `s-${key}-${Math.random().toString(36).slice(2, 8)}`, label, key, type, input: true, required });
  const base = [
    t('Postcode',        'postcode',   'textfield',  true),
    t('Property',        'property',   'select',     true),
    t('Address Line',    'addressLine','textfield'),
    t('Town',            'town',       'textfield'),
    t('UPRN',            'uprn',       'textfield'),
    t('VRM',             'vrm',        'textfield',  true),
    t('Proof of Residency','proofOfResidency','file', true),
    t('Vehicle Ownership','vehicleOwnership','file', true),
    t('Duration',        'duration',   'select',     true),
    t('Quantity',        'quantity',   'number',     true),
    t('Payment Method',  'paymentMethod','radio',    true),
    t('Accept T&C',      'acceptTc',   'checkbox',   true),
  ];
  if (id === 'BLU') base.splice(6, 0, t('Blue Badge', 'blueBadge', 'file', true), t('Date of Birth', 'dob', 'day', true));
  if (id === 'BUS') base.splice(5, 1, t('Fleet VRMs', 'fleetVrms', 'datagrid', true));
  return base;
}

// ═══════════════════════ Small presentational helpers ═══════════════════════

function NumberedStepper({ current, onSelect }: { current: number; onSelect: (i: number) => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 0, py: 2 }}>
      {STEPS.map((s, i) => {
        const isActive = i === current;
        const isDone = i < current;
        const filled = isActive || isDone;
        return (
          <Box key={s.key} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box onClick={() => onSelect(i)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: 96 }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center',
                bgcolor: filled ? '#1976D2' : '#BDBDBD', color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              }}>{isDone ? <CheckIcon fontSize="small" /> : i + 1}</Box>
              <Typography sx={{ mt: 0.75, fontWeight: isActive ? 700 : 500, fontSize: '0.85rem', color: filled ? tokens.INK : tokens.MUTED }}>
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
  return <Box><Typography sx={{ fontWeight: 600, color: tokens.INK, mb: 1.5 }}>{title}</Typography>{children}</Box>;
}

function FieldRow({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <Box sx={{ p: 1.5, borderRadius: 1, border: error ? '1px solid #EF9A9A' : '1px solid #E0E0E0', bgcolor: error ? '#FDECEA' : 'transparent' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
        {error && <ErrorOutlineIcon fontSize="small" color="error" />}
        <Typography variant="caption" fontWeight={600} color={error ? 'error' : 'text.secondary'}>{label}</Typography>
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

function SummaryRow({ ready, label, value, onEdit }: { ready: boolean; label: string; value: string; onEdit: () => void }) {
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
  return v === 'credit' ? 'Credit card'
       : v === 'debit'  ? 'Debit card'
       : v === 'costCenter' ? 'Cost centre'
       : v === 'scratch' ? 'Scratch voucher' : v;
}
