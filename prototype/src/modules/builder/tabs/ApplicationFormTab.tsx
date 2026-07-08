import { useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControlLabel, IconButton, MenuItem, Paper,
  Radio, RadioGroup, Stack, Switch, TextField, Typography, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';
import PoundIcon from '@mui/icons-material/CurrencyPound';
import PaymentIcon from '@mui/icons-material/Payment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { tokens } from '../../../theme';

type SectionKey = 'address' | 'vehicles' | 'documents' | 'price' | 'checkout';

const SECTION_META: Record<SectionKey, { title: string; icon: JSX.Element; description: string }> = {
  address:   { title: 'Address',       icon: <HomeIcon fontSize="small" />,          description: 'How applicants confirm their permit address.' },
  vehicles:  { title: 'Vehicle Details', icon: <DirectionsCarIcon fontSize="small" />, description: 'Vehicle capture and Autoguru autofill rules.' },
  documents: { title: 'Documents',     icon: <DescriptionIcon fontSize="small" />,   description: 'Documents required for this permission.' },
  price:     { title: 'Price',         icon: <PoundIcon fontSize="small" />,         description: 'Read-only summary — configure amounts in the Pricing tab.' },
  checkout:  { title: 'Checkout',      icon: <PaymentIcon fontSize="small" />,       description: 'Allowed payment methods and terms & conditions binding.' },
};

const DOC_LIBRARY = [
  'Proof of Residency', 'Vehicle Ownership (V5C)', 'Blue Badge',
  'Council Tax Statement', 'Utility Bill', 'Driving Licence',
  'Insurance Certificate', 'Business Rates Bill', 'Tenancy Agreement',
];

const PAYMENT_METHODS = [
  { key: 'credit',     label: 'Credit card' },
  { key: 'debit',      label: 'Debit card' },
  { key: 'costCenter', label: 'Cost centre / Budget code' },
  { key: 'scratch',    label: 'Scratch card voucher' },
] as const;

type CustomField = {
  id: string;
  section: SectionKey;
  label: string;
  type: 'text' | 'single-select' | 'multi-select' | 'checkbox' | 'number';
  required: boolean;
  options?: string[];
  help?: string;
};

export function ApplicationFormTab() {
  // Section order + enable state
  const [order, setOrder] = useState<SectionKey[]>(['address', 'vehicles', 'documents', 'price', 'checkout']);
  const [enabled, setEnabled] = useState<Record<SectionKey, boolean>>({
    address: true, vehicles: true, documents: true, price: true, checkout: true,
  });
  const [active, setActive] = useState<SectionKey>('address');

  // Address settings
  const [addr, setAddr] = useState({
    savedAddressAllowed: true,
    postcodeLookup: true,
    manualAddress: false,
    permitModeChoice: 'both' as 'digital' | 'physical' | 'both',
    zoneValidation: true,
  });

  // Vehicles settings
  const [veh, setVeh] = useState({
    maxVehicles: 3,
    tempVehiclesAllowed: true,
    tempLimit: 2,
    autoguruLookup: true,
    manualVehicleEntry: false,
    requireInsurance: false,
    dieselSurcharge: true,
    experianCheck: false,
  });

  // Documents settings
  const [docConfig, setDocConfig] = useState<{ name: string; required: boolean }[]>([
    { name: 'Proof of Residency', required: true },
    { name: 'Vehicle Ownership (V5C)', required: true },
    { name: 'Blue Badge', required: false },
  ]);
  const [docLibOpen, setDocLibOpen] = useState(false);
  const [docPick, setDocPick] = useState<string>('');

  // Price settings (read-only summary)
  // — no editable state here; pricing lives on the Pricing tab.

  // Checkout settings
  const [checkout, setCheckout] = useState({
    payments: { credit: true, debit: true, costCenter: false, scratch: false },
    termsAndConditionsId: 'TC-RES-2026',
    privacyPolicyId: 'PP-CONTRACT',
    requireTcAcceptance: true,
    showSummary: true,
  });

  // Custom fields
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [cfDialogOpen, setCfDialogOpen] = useState(false);
  const [cfDraft, setCfDraft] = useState<CustomField>({
    id: '', section: 'address', label: '', type: 'text', required: false, options: [],
  });
  const [cfEditingId, setCfEditingId] = useState<string | null>(null);
  const [optionText, setOptionText] = useState('');

  // Preview dialog
  const [previewOpen, setPreviewOpen] = useState(false);

  const moveSection = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  const openNewCf = () => {
    setCfEditingId(null);
    setCfDraft({ id: '', section: active, label: '', type: 'text', required: false, options: [] });
    setOptionText('');
    setCfDialogOpen(true);
  };

  const openEditCf = (cf: CustomField) => {
    setCfEditingId(cf.id);
    setCfDraft({ ...cf, options: [...(cf.options || [])] });
    setOptionText('');
    setCfDialogOpen(true);
  };

  const saveCf = () => {
    if (!cfDraft.label.trim()) return;
    const id = cfEditingId || `CF-${Date.now()}`;
    const next: CustomField = { ...cfDraft, id, options: cfDraft.options || [] };
    setCustomFields((prev) => cfEditingId ? prev.map((c) => c.id === id ? next : c) : [...prev, next]);
    setCfDialogOpen(false);
  };

  const removeCf = (id: string) => setCustomFields((prev) => prev.filter((c) => c.id !== id));

  const addOption = () => {
    if (!optionText.trim()) return;
    setCfDraft((prev) => ({ ...prev, options: [...(prev.options || []), optionText.trim()] }));
    setOptionText('');
  };

  const removeOption = (i: number) =>
    setCfDraft((prev) => ({ ...prev, options: (prev.options || []).filter((_, k) => k !== i) }));

  const needsOptions = cfDraft.type === 'single-select' || cfDraft.type === 'multi-select';

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px minmax(0, 1fr)' }, gap: 2 }}>
      {/* Left: section list + reorder */}
      <Paper sx={{ p: 1.5, alignSelf: 'flex-start' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, pb: 1 }}>
          <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '0.95rem' }}>
            Form sections
          </Typography>
          <Tooltip title="Drag or use arrows to change the order in which tabs appear to applicants.">
            <HelpOutlineIcon sx={{ fontSize: 16, color: tokens.MUTED }} />
          </Tooltip>
        </Stack>
        <Divider />
        <Stack sx={{ mt: 1 }}>
          {order.map((key, i) => {
            const meta = SECTION_META[key];
            const isActive = active === key;
            return (
              <Box key={key}
                sx={{
                  display: 'flex', alignItems: 'center', px: 1, py: 0.75, borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: isActive ? 'action.selected' : 'transparent',
                  '&:hover': { bgcolor: isActive ? 'action.selected' : 'action.hover' },
                }}
                onClick={() => setActive(key)}>
                <DragIndicatorIcon fontSize="small" sx={{ color: tokens.MUTED, mr: 0.5 }} />
                <Box sx={{ mr: 1, color: enabled[key] ? tokens.NAVY : tokens.MUTED }}>{meta.icon}</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: enabled[key] ? tokens.INK : tokens.MUTED }}>
                    {i + 1}. {meta.title}
                  </Typography>
                  {!enabled[key] && (
                    <Typography variant="caption" color="text.secondary">Disabled</Typography>
                  )}
                </Box>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); moveSection(i, -1); }} disabled={i === 0}>
                  <KeyboardArrowUpIcon fontSize="inherit" />
                </IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); moveSection(i, 1); }} disabled={i === order.length - 1}>
                  <KeyboardArrowDownIcon fontSize="inherit" />
                </IconButton>
              </Box>
            );
          })}
        </Stack>
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Button fullWidth variant="outlined" startIcon={<VisibilityIcon />}
          onClick={() => setPreviewOpen(true)}>
          Preview Form
        </Button>
      </Paper>

      {/* Right: section config */}
      <Box>
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Box>
              <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.15rem' }}>
                {SECTION_META[active].title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {SECTION_META[active].description}
              </Typography>
            </Box>
            <FormControlLabel control={
              <Switch checked={enabled[active]} onChange={(_, c) => setEnabled((p) => ({ ...p, [active]: c }))} />
            } label={enabled[active] ? 'Enabled' : 'Disabled'} labelPlacement="start" />
          </Stack>
          <Divider sx={{ mb: 3 }} />

          {active === 'address' && (
            <Stack spacing={2}>
              <FormControlLabel control={
                <Checkbox checked={addr.savedAddressAllowed} onChange={(_, c) => setAddr({ ...addr, savedAddressAllowed: c })} />
              } label="Allow saved-address selection (for existing applicants)" />
              <FormControlLabel control={
                <Checkbox checked={addr.postcodeLookup} onChange={(_, c) => setAddr({ ...addr, postcodeLookup: c })} />
              } label="Enable postcode → property lookup (UPRN)" />
              <FormControlLabel control={
                <Checkbox checked={addr.manualAddress} onChange={(_, c) => setAddr({ ...addr, manualAddress: c })} />
              } label="Allow manual address entry (fallback when lookup fails)" />
              <FormControlLabel control={
                <Checkbox checked={addr.zoneValidation} onChange={(_, c) => setAddr({ ...addr, zoneValidation: c })} />
              } label="Validate that the property belongs to a permission zone" />
              <Divider />
              <TextField size="small" select label="Permit mode offered" value={addr.permitModeChoice}
                onChange={(e) => setAddr({ ...addr, permitModeChoice: e.target.value as any })} sx={{ maxWidth: 320 }}>
                <MenuItem value="digital">Digital only</MenuItem>
                <MenuItem value="physical">Physical only</MenuItem>
                <MenuItem value="both">Both (applicant chooses)</MenuItem>
              </TextField>
            </Stack>
          )}

          {active === 'vehicles' && (
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField size="small" type="number" label="Maximum vehicles per permit"
                  value={veh.maxVehicles} inputProps={{ min: 1, max: 20 }}
                  onChange={(e) => setVeh({ ...veh, maxVehicles: Math.max(1, +e.target.value) })}
                  sx={{ maxWidth: 260 }} />
                <TextField size="small" type="number" label="Temporary vehicle limit"
                  value={veh.tempLimit} inputProps={{ min: 0, max: 20 }}
                  disabled={!veh.tempVehiclesAllowed}
                  onChange={(e) => setVeh({ ...veh, tempLimit: Math.max(0, +e.target.value) })}
                  sx={{ maxWidth: 260 }} />
              </Stack>
              <FormControlLabel control={
                <Checkbox checked={veh.autoguruLookup} onChange={(_, c) => setVeh({ ...veh, autoguruLookup: c })} />
              } label="Enable Autoguru VRM lookup (autofill make / model / colour / CO₂ / Euro standard)" />
              <FormControlLabel control={
                <Checkbox checked={veh.manualVehicleEntry} onChange={(_, c) => setVeh({ ...veh, manualVehicleEntry: c })} />
              } label="Allow manual vehicle entry (when Autoguru unavailable)" />
              <FormControlLabel control={
                <Checkbox checked={veh.tempVehiclesAllowed} onChange={(_, c) => setVeh({ ...veh, tempVehiclesAllowed: c })} />
              } label="Allow temporary vehicles" />
              <FormControlLabel control={
                <Checkbox checked={veh.requireInsurance} onChange={(_, c) => setVeh({ ...veh, requireInsurance: c })} />
              } label="Require insurance certificate for each vehicle" />
              <FormControlLabel control={
                <Checkbox checked={veh.dieselSurcharge} onChange={(_, c) => setVeh({ ...veh, dieselSurcharge: c })} />
              } label="Apply diesel surcharge (rate configured on Pricing tab)" />
              <FormControlLabel control={
                <Checkbox checked={veh.experianCheck} onChange={(_, c) => setVeh({ ...veh, experianCheck: c })} />
              } label="Enable Experian check (validates ownership against DVLA)" />
            </Stack>
          )}

          {active === 'documents' && (
            <Stack spacing={2}>
              <Alert severity="info">
                Applicants will be asked to upload these documents when applying. Documents marked required
                block form submission until provided.
              </Alert>
              {docConfig.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No documents added yet.
                </Typography>
              )}
              {docConfig.map((d, i) => (
                <Paper key={d.name} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <DescriptionIcon fontSize="small" color="action" />
                    <Typography sx={{ flex: 1, fontWeight: 500 }}>{d.name}</Typography>
                    <FormControlLabel control={
                      <Checkbox checked={d.required} onChange={(_, c) => {
                        const next = [...docConfig]; next[i] = { ...d, required: c }; setDocConfig(next);
                      }} />
                    } label="Required" />
                    <IconButton size="small" onClick={() => setDocConfig(docConfig.filter((_, k) => k !== i))}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDocLibOpen(true)}
                sx={{ alignSelf: 'flex-start' }}>
                Add Document Type
              </Button>
            </Stack>
          )}

          {active === 'price' && (
            <Stack spacing={2}>
              <Alert severity="info">
                Pricing amounts, tier configuration, admin fee and diesel surcharge rate are managed on the
                <strong> Pricing </strong> tab. This section controls only how the Price tab is displayed to applicants.
              </Alert>
              <FormControlLabel control={<Checkbox defaultChecked />} label="Show duration selector" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Show quantity selector (multi-permit purchase)" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Show line-item breakdown (base / diesel / admin fee)" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Show total in persistent summary sidebar" />
            </Stack>
          )}

          {active === 'checkout' && (
            <Stack spacing={2}>
              <Typography variant="subtitle2">Payment methods allowed</Typography>
              <Paper variant="outlined" sx={{ p: 1.5 }}>
                <Stack>
                  {PAYMENT_METHODS.map((m) => (
                    <FormControlLabel key={m.key} control={
                      <Checkbox checked={(checkout.payments as any)[m.key]}
                        onChange={(_, c) => setCheckout({ ...checkout, payments: { ...checkout.payments, [m.key]: c } })} />
                    } label={m.label} />
                  ))}
                </Stack>
              </Paper>
              <Divider />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField size="small" select label="Terms & Conditions template"
                  value={checkout.termsAndConditionsId}
                  onChange={(e) => setCheckout({ ...checkout, termsAndConditionsId: e.target.value })}
                  sx={{ flex: 1 }}>
                  <MenuItem value="TC-RES-2026">Resident Permit — 2026 v3</MenuItem>
                  <MenuItem value="TC-VIS-2026">Visitor Permit — 2026 v1</MenuItem>
                  <MenuItem value="TC-TRD-2026">Trades Permit — 2026 v1</MenuItem>
                  <MenuItem value="">— None —</MenuItem>
                </TextField>
                <TextField size="small" select label="Privacy Policy source"
                  value={checkout.privacyPolicyId}
                  onChange={(e) => setCheckout({ ...checkout, privacyPolicyId: e.target.value })}
                  sx={{ flex: 1 }}>
                  <MenuItem value="PP-CONTRACT">Contract Settings → Data Sharing URL</MenuItem>
                  <MenuItem value="PP-CUSTOM">Custom template</MenuItem>
                </TextField>
              </Stack>
              <FormControlLabel control={
                <Checkbox checked={checkout.requireTcAcceptance}
                  onChange={(_, c) => setCheckout({ ...checkout, requireTcAcceptance: c })} />
              } label="Require applicant to explicitly accept T&C before submitting" />
              <FormControlLabel control={
                <Checkbox checked={checkout.showSummary}
                  onChange={(_, c) => setCheckout({ ...checkout, showSummary: c })} />
              } label="Show application summary on the Checkout page" />
            </Stack>
          )}

          {/* Custom fields for this section */}
          <Divider sx={{ my: 3 }} />
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1rem' }}>
              Custom fields on this section
            </Typography>
            <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={openNewCf}>
              Add Custom Field
            </Button>
          </Stack>

          {customFields.filter((c) => c.section === active).length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No custom fields defined for this section.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {customFields.filter((c) => c.section === active).map((cf) => (
                <Paper key={cf.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip size="small" label={cf.type} variant="outlined" color="info" />
                    <Typography sx={{ flex: 1 }}>
                      {cf.label} {cf.required && <Typography component="span" color="error">*</Typography>}
                    </Typography>
                    {cf.options && cf.options.length > 0 && (
                      <Chip size="small" label={`${cf.options.length} option(s)`} />
                    )}
                    <IconButton size="small" onClick={() => openEditCf(cf)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => removeCf(cf.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                  </Stack>
                  {cf.help && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, pl: 0.5 }}>
                      Helper: {cf.help}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>

      {/* Add document from library */}
      <Dialog open={docLibOpen} onClose={() => setDocLibOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Document Type</DialogTitle>
        <DialogContent>
          <TextField size="small" select fullWidth label="Choose from library" value={docPick}
            onChange={(e) => setDocPick(e.target.value)} sx={{ mt: 1 }}
            helperText="Managed globally in Templates → Document Types.">
            {DOC_LIBRARY.filter((d) => !docConfig.some((x) => x.name === d)).map((d) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocLibOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={!docPick}
            onClick={() => {
              setDocConfig([...docConfig, { name: docPick, required: false }]);
              setDocPick(''); setDocLibOpen(false);
            }}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Custom field editor */}
      <Dialog open={cfDialogOpen} onClose={() => setCfDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{cfEditingId ? 'Edit Custom Field' : 'Add Custom Field'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField size="small" fullWidth label="Field label *" value={cfDraft.label}
              onChange={(e) => setCfDraft({ ...cfDraft, label: e.target.value })} />
            <Stack direction="row" spacing={2}>
              <TextField size="small" select label="Section" value={cfDraft.section}
                onChange={(e) => setCfDraft({ ...cfDraft, section: e.target.value as SectionKey })}
                sx={{ flex: 1 }}>
                {order.map((k) => <MenuItem key={k} value={k}>{SECTION_META[k].title}</MenuItem>)}
              </TextField>
              <TextField size="small" select label="Field type" value={cfDraft.type}
                onChange={(e) => setCfDraft({ ...cfDraft, type: e.target.value as any })}
                sx={{ flex: 1 }}>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="single-select">Single Select</MenuItem>
                <MenuItem value="multi-select">Multi Select</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
              </TextField>
            </Stack>
            <TextField size="small" fullWidth label="Helper text (optional)" value={cfDraft.help || ''}
              onChange={(e) => setCfDraft({ ...cfDraft, help: e.target.value })} />
            <FormControlLabel control={
              <Checkbox checked={cfDraft.required} onChange={(_, c) => setCfDraft({ ...cfDraft, required: c })} />
            } label="Required field" />
            {needsOptions && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Options</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField size="small" fullWidth placeholder="New option" value={optionText}
                    onChange={(e) => setOptionText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }} />
                  <Button variant="outlined" onClick={addOption}>Add</Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(cfDraft.options || []).map((o, i) => (
                    <Chip key={i} label={o} onDelete={() => removeOption(i)} />
                  ))}
                  {(cfDraft.options || []).length === 0 && (
                    <Typography variant="caption" color="text.secondary">No options yet.</Typography>
                  )}
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCfDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={!cfDraft.label.trim() || (needsOptions && (cfDraft.options || []).length === 0)}
            onClick={saveCf}>{cfEditingId ? 'Save' : 'Add Field'}</Button>
        </DialogActions>
      </Dialog>

      {/* Preview */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Form Preview
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Applicant-facing tabs, in the configured order.
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {order.filter((k) => enabled[k]).map((k, i) => {
              const meta = SECTION_META[k];
              const cfs = customFields.filter((c) => c.section === k);
              return (
                <Paper key={k} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Chip size="small" color="primary" label={`Step ${i + 1}`} />
                    <Typography fontWeight={700}>{meta.title}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {meta.description}
                  </Typography>
                  {k === 'address' && (
                    <Typography variant="caption" component="div" color="text.secondary">
                      · Saved: {addr.savedAddressAllowed ? 'yes' : 'no'} · Lookup: {addr.postcodeLookup ? 'yes' : 'no'} ·
                      Manual: {addr.manualAddress ? 'yes' : 'no'} · Permit mode: {addr.permitModeChoice}
                    </Typography>
                  )}
                  {k === 'vehicles' && (
                    <Typography variant="caption" component="div" color="text.secondary">
                      · Max {veh.maxVehicles} · Autoguru {veh.autoguruLookup ? 'on' : 'off'} ·
                      Temp {veh.tempVehiclesAllowed ? `up to ${veh.tempLimit}` : 'off'} ·
                      Diesel surcharge {veh.dieselSurcharge ? 'on' : 'off'}
                    </Typography>
                  )}
                  {k === 'documents' && (
                    <Typography variant="caption" component="div" color="text.secondary">
                      {docConfig.length === 0 ? 'No documents required.' :
                        docConfig.map((d) => `${d.name}${d.required ? ' *' : ''}`).join(' · ')}
                    </Typography>
                  )}
                  {k === 'checkout' && (
                    <Typography variant="caption" component="div" color="text.secondary">
                      · Payments: {PAYMENT_METHODS.filter((m) => (checkout.payments as any)[m.key]).map((m) => m.label).join(', ') || 'None enabled'} ·
                      T&C: {checkout.termsAndConditionsId || 'None'} ·
                      Require acceptance: {checkout.requireTcAcceptance ? 'yes' : 'no'}
                    </Typography>
                  )}
                  {cfs.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" fontWeight={700}>Custom fields:</Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                        {cfs.map((c) => (
                          <Chip key={c.id} size="small" variant="outlined"
                            label={`${c.label}${c.required ? ' *' : ''} (${c.type})`} />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Paper>
              );
            })}
            {order.every((k) => !enabled[k]) && (
              <Alert severity="warning">All sections are disabled — applicants would see an empty form.</Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button variant="contained"
            onClick={() => window.open('/formbuilder?permission=Preview', '_blank')}>
            Open Live Preview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Placeholder RadioGroup import to keep tree-shaking happy if unused
void RadioGroup; void Radio;
