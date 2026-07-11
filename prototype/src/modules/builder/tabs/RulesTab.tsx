/*
 * Rules tab — mirrors the real Marston MNPS-Permission-UI Rules screen.
 * Sources:
 *   src/app/(pages)/builder/(permissionBuilder)/RefundSettings.tsx
 *   src/app/(pages)/builder/(permissionBuilder)/AutoApprovalSettings.tsx
 *   src/app/(pages)/builder/(permissionBuilder)/VehicleSettings.tsx
 *   src/app/(pages)/builder/(permissionBuilder)/TemplateSettings.tsx
 *
 * Layout: left navigation rail (four items) + right details panel.
 * State is persisted to localStorage per permission id.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Chip, Divider, FormControlLabel, InputAdornment,
  MenuItem, Paper, Radio, RadioGroup, Stack, TextField, Typography,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { tokens } from '../../../theme';
import { REFUND_POLICY_OPTIONS, VEHICLE_TYPE_OPTIONS, FUEL_TYPE_OPTIONS } from '../../../constants/enums';

type SectionKey = 'refund' | 'autoApproval' | 'vehicle' | 'template';

interface RulesState {
  refund: {
    applicable: 'yes' | 'no';
    policy: string;
    cancellationCharge: string;
    chargeType: 'percentage' | 'currency';
  };
  autoApproval: {
    onRenewal: boolean;
    onNew: boolean;
    onPlateChange: boolean;
    onVisitor: boolean;
  };
  vehicle: {
    plateChangeLimit: string;
    multipleAllowed: 'enable' | 'disable';
    countOfVehicles: string;
    experianEnabled: boolean;
    experianOperator: string;
    experianScore: string;
    eligibleVehicleTypes: string[];
    eligibleFuelTypes: string[];
    engineSize: string[];
    numberOfSeats: string;
    firstDateOfRegistration: string;
    co2Emission: string[];
    taxBand: string[];
    euroStandard: string[];
  };
  template: {
    activeTab: 'physical' | 'whitemail';
    permitMode: 'physical' | 'virtual';
  };
}

const DEFAULT_STATE: RulesState = {
  refund: { applicable: 'no', policy: '', cancellationCharge: '', chargeType: 'percentage' },
  autoApproval: { onRenewal: false, onNew: false, onPlateChange: false, onVisitor: false },
  vehicle: {
    plateChangeLimit: '3', multipleAllowed: 'disable', countOfVehicles: '',
    experianEnabled: false, experianOperator: '', experianScore: '',
    eligibleVehicleTypes: [], eligibleFuelTypes: [], engineSize: [],
    numberOfSeats: '', firstDateOfRegistration: '', co2Emission: [], taxBand: [], euroStandard: [],
  },
  template: { activeTab: 'physical', permitMode: 'physical' },
};

const REFUND_POLICIES = REFUND_POLICY_OPTIONS.map((o) => o.label);
const VEHICLE_TYPES = VEHICLE_TYPE_OPTIONS.map((o) => o.label);
const FUEL_TYPES = FUEL_TYPE_OPTIONS.map((o) => o.label);
const ENGINE_SIZES = ['Up to 1000cc', '1001–1500cc', '1501–2000cc', '2001–3000cc', 'Over 3000cc'];
const CO2_BANDS = ['A (0 g/km)', 'B (1–100 g/km)', 'C (101–120 g/km)', 'D (121–150 g/km)', 'E (151+ g/km)'];
const TAX_BANDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const EURO_STANDARDS = ['Euro 3', 'Euro 4', 'Euro 5', 'Euro 6'];
const EXPERIAN_OPERATORS = ['Greater than', 'Greater than or equal to', 'Less than', 'Less than or equal to', 'Equal to'];

export function RulesTab({ permissionId = 'default' }: { permissionId?: string }) {
  const storageKey = `prototype:rules:${permissionId}`;
  const [state, setState] = useState<RulesState>(DEFAULT_STATE);
  const [active, setActive] = useState<SectionKey>('refund');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setState(raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE);
    } catch { /* ignore */ }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* ignore */ }
  }, [hydrated, storageKey, state]);

  const patchRefund = (p: Partial<RulesState['refund']>) => setState((s) => ({ ...s, refund: { ...s.refund, ...p } }));
  const patchAuto   = (p: Partial<RulesState['autoApproval']>) => setState((s) => ({ ...s, autoApproval: { ...s.autoApproval, ...p } }));
  const patchVeh    = (p: Partial<RulesState['vehicle']>) => setState((s) => ({ ...s, vehicle: { ...s.vehicle, ...p } }));
  const patchTpl    = (p: Partial<RulesState['template']>) => setState((s) => ({ ...s, template: { ...s.template, ...p } }));

  // Per-section error indicators
  const errors = useMemo(() => {
    const e: Record<SectionKey, number> = { refund: 0, autoApproval: 0, vehicle: 0, template: 0 };
    if (state.refund.applicable === 'yes') {
      if (!state.refund.policy) e.refund++;
      if (!state.refund.cancellationCharge) e.refund++;
    }
    const anyAutoOn = state.autoApproval.onRenewal || state.autoApproval.onNew || state.autoApproval.onPlateChange || state.autoApproval.onVisitor;
    if (!anyAutoOn) e.autoApproval++;
    if (!state.vehicle.plateChangeLimit) e.vehicle++;
    if (state.vehicle.multipleAllowed === 'enable' && !state.vehicle.countOfVehicles) e.vehicle++;
    return e;
  }, [state]);

  const NAV: { key: SectionKey; label: string }[] = [
    { key: 'refund',       label: 'Refund Settings' },
    { key: 'autoApproval', label: 'Auto Approval Settings' },
    { key: 'vehicle',      label: 'Vehicle Settings' },
    { key: 'template',     label: 'Template Settings' },
  ];

  return (
    <Paper variant="outlined" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' }, minHeight: '60vh' }}>
      {/* Left nav */}
      <Box sx={{ borderRight: { md: '1px solid #E0E0E0' }, py: 1 }}>
        {NAV.map((n) => {
          const isActive = active === n.key;
          const err = errors[n.key];
          return (
            <Box key={n.key} onClick={() => setActive(n.key)}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: 2.5, py: 1.25, cursor: 'pointer',
                borderLeft: '3px solid',
                borderLeftColor: isActive ? '#1976D2' : 'transparent',
                bgcolor: isActive ? '#EAF3FB' : 'transparent',
                color: isActive ? '#1976D2' : tokens.INK,
                fontWeight: isActive ? 700 : 500,
                '&:hover': { bgcolor: isActive ? '#EAF3FB' : '#F5F7FA' },
              }}>
              <span>{n.label}</span>
              {err > 0 && <ErrorOutlineIcon sx={{ color: '#B71C1C', fontSize: 18 }} />}
            </Box>
          );
        })}
      </Box>

      {/* Right details */}
      <Box sx={{ p: 3 }}>
        {active === 'refund' && (
          <RefundSection state={state.refund} onChange={patchRefund} />
        )}
        {active === 'autoApproval' && (
          <AutoApprovalSection state={state.autoApproval} onChange={patchAuto}
            error={errors.autoApproval > 0} />
        )}
        {active === 'vehicle' && (
          <VehicleSection state={state.vehicle} onChange={patchVeh} />
        )}
        {active === 'template' && (
          <TemplateSection state={state.template} onChange={patchTpl} />
        )}
      </Box>
    </Paper>
  );
}

// ─── Refund Settings ─────────────────────────────────────────────────────
function RefundSection({ state, onChange }: {
  state: RulesState['refund'];
  onChange: (p: Partial<RulesState['refund']>) => void;
}) {
  return (
    <>
      <SectionHeader title="Refund Settings" />
      <FieldRow label="Refund Applicable">
        <RadioGroup row value={state.applicable}
          onChange={(_, v) => onChange({
            applicable: v as 'yes' | 'no',
            ...(v === 'no' ? { policy: '', cancellationCharge: '' } : {}),
          })}>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no"  control={<Radio />} label="No" />
        </RadioGroup>
      </FieldRow>

      {state.applicable === 'yes' && (
        <>
          <FieldRow label="Refund Policy" required>
            <TextField select size="small" fullWidth value={state.policy}
              onChange={(e) => onChange({ policy: e.target.value })}>
              <MenuItem value="">— Select policy —</MenuItem>
              {REFUND_POLICIES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
          </FieldRow>

          <FieldRow label="Charge Type">
            <RadioGroup row value={state.chargeType}
              onChange={(_, v) => onChange({ chargeType: v as 'percentage' | 'currency', cancellationCharge: '' })}>
              <FormControlLabel value="percentage" control={<Radio />} label="Percentage (%)" />
              <FormControlLabel value="currency"   control={<Radio />} label="Currency (£)" />
            </RadioGroup>
          </FieldRow>

          <FieldRow label="Cancellation Charge" required>
            <TextField size="small" type="number"
              value={state.cancellationCharge}
              onChange={(e) => {
                const raw = e.target.value;
                if (state.chargeType === 'percentage') {
                  const n = raw === '' ? '' : String(Math.max(0, Math.min(100, +raw)));
                  onChange({ cancellationCharge: n });
                } else {
                  onChange({ cancellationCharge: raw });
                }
              }}
              InputProps={{
                startAdornment: state.chargeType === 'currency'
                  ? <InputAdornment position="start">£</InputAdornment> : undefined,
                endAdornment: state.chargeType === 'percentage'
                  ? <InputAdornment position="end">%</InputAdornment> : undefined,
              }}
              inputProps={{ min: 0, max: state.chargeType === 'percentage' ? 100 : 100000, step: state.chargeType === 'percentage' ? 1 : 0.01 }}
              sx={{ maxWidth: 240 }} />
          </FieldRow>
        </>
      )}
    </>
  );
}

// ─── Auto Approval Settings ──────────────────────────────────────────────
function AutoApprovalSection({ state, onChange, error }: {
  state: RulesState['autoApproval'];
  onChange: (p: Partial<RulesState['autoApproval']>) => void;
  error: boolean;
}) {
  const options: { key: keyof RulesState['autoApproval']; label: string; help: string }[] = [
    { key: 'onRenewal',    label: 'Auto Approval on Renewal',
      help: 'Automatically approve user-submitted renewal requests for this permission.' },
    { key: 'onNew',        label: 'Auto Approval on New Applications',
      help: 'Automatically approve newly submitted applications under this permission.' },
    { key: 'onPlateChange',label: 'Auto Approval on Change Number Plate Request',
      help: 'Automatically approve requests to update vehicle registration numbers.' },
    { key: 'onVisitor',    label: 'Auto Approval for Visitor Permissions',
      help: 'Automatically approve visitor and scratch card applications under this permission if the user has an active resident permit already.' },
  ];

  return (
    <>
      <SectionHeader title="Auto Approval Settings" />
      {error && <Alert severity="error" sx={{ mb: 2 }}>Select at least one Auto Approval Settings</Alert>}
      <Stack spacing={2}>
        {options.map((o) => (
          <Box key={o.key}>
            <FormControlLabel
              control={<Checkbox checked={state[o.key]} onChange={(_, c) => onChange({ [o.key]: c } as Partial<RulesState['autoApproval']>)} />}
              label={<Typography sx={{ fontWeight: 600 }}>{o.label}</Typography>} />
            <Typography variant="caption" sx={{ display: 'block', ml: 4, color: tokens.MUTED }}>
              {o.help}
            </Typography>
          </Box>
        ))}
      </Stack>
    </>
  );
}

// ─── Vehicle Settings ────────────────────────────────────────────────────
function VehicleSection({ state, onChange }: {
  state: RulesState['vehicle'];
  onChange: (p: Partial<RulesState['vehicle']>) => void;
}) {
  return (
    <>
      <SectionHeader title="Vehicle Settings" />

      <Typography sx={{ fontWeight: 700, mt: 1, mb: 1, color: '#1976D2', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>
        Maximum Limit
      </Typography>

      <FieldRow label="Number Plate Change Limit" required>
        <TextField size="small" type="number" value={state.plateChangeLimit}
          onChange={(e) => onChange({ plateChangeLimit: e.target.value })}
          inputProps={{ min: 0, max: 100000 }} sx={{ maxWidth: 200 }} />
      </FieldRow>

      <FieldRow label="Multiple Vehicles Allowed">
        <RadioGroup row value={state.multipleAllowed}
          onChange={(_, v) => onChange({ multipleAllowed: v as 'enable' | 'disable', ...(v === 'disable' ? { countOfVehicles: '' } : {}) })}>
          <FormControlLabel value="enable"  control={<Radio />} label="Enable" />
          <FormControlLabel value="disable" control={<Radio />} label="Disable" />
        </RadioGroup>
      </FieldRow>

      {state.multipleAllowed === 'enable' && (
        <FieldRow label="Count of Vehicles Allowed" required>
          <TextField size="small" type="number" value={state.countOfVehicles}
            onChange={(e) => onChange({ countOfVehicles: e.target.value })}
            inputProps={{ min: 1, max: 100 }} sx={{ maxWidth: 200 }} />
        </FieldRow>
      )}

      <FormControlLabel sx={{ mt: 1 }}
        control={<Checkbox checked={state.experianEnabled} onChange={(_, c) => onChange({ experianEnabled: c })} />}
        label="Enable Experian Vehicle Pass Score" />

      {state.experianEnabled && (
        <Stack direction="row" spacing={2} sx={{ mt: 1, ml: 4, mb: 2 }}>
          <TextField select size="small" label="Operator" value={state.experianOperator}
            onChange={(e) => onChange({ experianOperator: e.target.value })} sx={{ minWidth: 200 }}>
            <MenuItem value="">— Select —</MenuItem>
            {EXPERIAN_OPERATORS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
          <TextField size="small" type="number" label="Score" value={state.experianScore}
            onChange={(e) => onChange({ experianScore: e.target.value })}
            inputProps={{ min: 1, max: 1000 }} sx={{ maxWidth: 200 }} />
        </Stack>
      )}

      <Divider sx={{ my: 2.5 }} />

      <Typography sx={{ fontWeight: 700, mb: 1, color: '#1976D2', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>
        Eligible Vehicles
      </Typography>
      <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
        Restrict which vehicles can apply for this permission. Fields shown depend on Contract Settings toggles.
      </Alert>

      <FieldRow label="Vehicle Type">
        <MultiSelect options={VEHICLE_TYPES} value={state.eligibleVehicleTypes}
          onChange={(v) => onChange({ eligibleVehicleTypes: v })} placeholder="Any vehicle type" />
      </FieldRow>
      <FieldRow label="Fuel Type">
        <MultiSelect options={FUEL_TYPES} value={state.eligibleFuelTypes}
          onChange={(v) => onChange({ eligibleFuelTypes: v })} placeholder="Any fuel type" />
      </FieldRow>
      <FieldRow label="Engine Size">
        <MultiSelect options={ENGINE_SIZES} value={state.engineSize}
          onChange={(v) => onChange({ engineSize: v })} placeholder="Any engine size" />
      </FieldRow>
      <FieldRow label="Number of Seats">
        <TextField size="small" type="number" value={state.numberOfSeats}
          onChange={(e) => onChange({ numberOfSeats: e.target.value })}
          inputProps={{ min: 0, max: 200 }} sx={{ maxWidth: 200 }} placeholder="Any" />
      </FieldRow>
      <FieldRow label="First Date of Registration">
        <TextField size="small" type="date" value={state.firstDateOfRegistration}
          onChange={(e) => onChange({ firstDateOfRegistration: e.target.value })}
          InputLabelProps={{ shrink: true }} sx={{ maxWidth: 240 }} />
      </FieldRow>
      <FieldRow label="CO2 Emission">
        <MultiSelect options={CO2_BANDS} value={state.co2Emission}
          onChange={(v) => onChange({ co2Emission: v })} placeholder="Any CO2 band" />
      </FieldRow>
      <FieldRow label="Number Plate Tax Band">
        <MultiSelect options={TAX_BANDS} value={state.taxBand}
          onChange={(v) => onChange({ taxBand: v })} placeholder="Any tax band" />
      </FieldRow>
      <FieldRow label="Euro Standard">
        <MultiSelect options={EURO_STANDARDS} value={state.euroStandard}
          onChange={(v) => onChange({ euroStandard: v })} placeholder="Any Euro standard" />
      </FieldRow>
    </>
  );
}

// ─── Template Settings ───────────────────────────────────────────────────
function TemplateSection({ state, onChange }: {
  state: RulesState['template'];
  onChange: (p: Partial<RulesState['template']>) => void;
}) {
  const showPhysical = state.permitMode === 'physical';
  const tabs: { key: RulesState['template']['activeTab']; label: string }[] =
    showPhysical
      ? [{ key: 'physical', label: 'Physical Permission Print' }, { key: 'whitemail', label: 'White Mail Reminder' }]
      : [{ key: 'whitemail', label: 'White Mail Reminder' }];

  useEffect(() => {
    if (!showPhysical && state.activeTab === 'physical') onChange({ activeTab: 'whitemail' });
  }, [showPhysical]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SectionHeader title="Template Settings" />

      <FieldRow label="Permit Mode">
        <RadioGroup row value={state.permitMode}
          onChange={(_, v) => onChange({ permitMode: v as 'physical' | 'virtual' })}>
          <FormControlLabel value="physical" control={<Radio />} label="Physical Permit" />
          <FormControlLabel value="virtual"  control={<Radio />} label="Virtual Permit" />
        </RadioGroup>
      </FieldRow>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {tabs.map((t) => (
          <Chip key={t.key} label={t.label} clickable
            color={state.activeTab === t.key ? 'primary' : 'default'}
            variant={state.activeTab === t.key ? 'filled' : 'outlined'}
            onClick={() => onChange({ activeTab: t.key })} />
        ))}
      </Stack>

      {state.activeTab === 'physical' && showPhysical && (
        <TemplateEditor
          title="Physical Permission Print"
          info="Configure the printed permit layout and merge fields. Applies when a physical permit is issued."
          mergeFields={['{{ApplicantName}}', '{{Vrm}}', '{{PermitNumber}}', '{{StartDate}}', '{{ExpiryDate}}']} />
      )}
      {state.activeTab === 'whitemail' && (
        <TemplateEditor
          title="White Mail Reminder"
          info="Reminder letter posted when the applicant is nearing expiry and has not renewed digitally."
          mergeFields={['{{ApplicantName}}', '{{PermitNumber}}', '{{ExpiryDate}}', '{{RenewalUrl}}']} />
      )}
    </>
  );
}

function TemplateEditor({ title, info, mergeFields }: { title: string; info: string; mergeFields: string[] }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>{title}</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>{info}</Alert>
      <TextField label="Subject" size="small" fullWidth defaultValue={title} sx={{ mb: 2 }} />
      <TextField label="Body" size="small" fullWidth multiline rows={8}
        defaultValue={`Dear {{ApplicantName}},\n\nThis is regarding your permit ${title.toLowerCase()}.\n\nRegards,\nMarston Permits Team`} />
      <Box sx={{ mt: 1.5 }}>
        <Typography variant="caption" sx={{ color: tokens.MUTED, mb: 0.5, display: 'block' }}>Merge fields:</Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {mergeFields.map((m) => <Chip key={m} label={m} size="small" variant="outlined" sx={{ mb: 0.5 }} />)}
        </Stack>
      </Box>
    </Paper>
  );
}

// ─── Shared helpers ──────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <>
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 1 }}>{title}</Typography>
      <Divider sx={{ mb: 2.5 }} />
    </>
  );
}

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-start' }} sx={{ mb: 2.5 }}>
      <Typography sx={{ fontWeight: 500, minWidth: 240, pt: { md: 1 } }}>
        {label}{required && <span style={{ color: '#B71C1C', marginLeft: 4 }}>*</span>}
      </Typography>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </Stack>
  );
}

function MultiSelect({ options, value, onChange, placeholder }: {
  options: string[]; value: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  return (
    <TextField select size="small" fullWidth
      SelectProps={{
        multiple: true, value, onChange: (e) => onChange(e.target.value as unknown as string[]),
        renderValue: (selected) => {
          const arr = selected as string[];
          if (arr.length === 0) return <span style={{ color: tokens.MUTED }}>{placeholder || 'Any'}</span>;
          return arr.join(', ');
        },
        displayEmpty: true,
      }}
      value={value as unknown as string} sx={{ maxWidth: 480 }}>
      {options.map((o) => (
        <MenuItem key={o} value={o}>
          <Checkbox checked={value.includes(o)} size="small" />
          {o}
        </MenuItem>
      ))}
    </TextField>
  );
}
