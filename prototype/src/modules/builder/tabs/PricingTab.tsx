/*
 * Pricing tab — mirrors the real Marston MNPS-Permission-UI PricingComponent
 *   src/app/(pages)/builder/(permissionBuilder)/PricingComponent.tsx
 *   + StandardPricing.tsx, MinIncrementalPricing.tsx, FixedDurationPricing.tsx,
 *     SuspensionPricingRules.tsx
 *
 * Three pricing modes selectable via the top-of-page radio card selector:
 *   1. Standard Pricing        — flat rate per bay per duration; bay-type table
 *   2. Min + Incremental       — minimum charge for first N units, then per-unit
 *   3. Fixed Per Duration      — flat fee per duration band; no bay scaling
 *
 * Currency symbol pulled from Contract Settings (defaults to £).
 * Bulk import side slider + download sample file (visual only in prototype).
 * Persists to localStorage per permission id so refresh keeps state.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControlLabel, IconButton, InputAdornment, MenuItem,
  Paper, Radio, RadioGroup, Stack, Switch, Table, TableBody, TableCell, TableHead,
  TableRow, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { tokens } from '../../../theme';
import { useToast } from '../../../components/Toast';

// ─── Types ───────────────────────────────────────────────────────────────
type PricingMode = 'standard' | 'minIncremental' | 'fixed';
type DurationKey = 'hour' | 'day' | 'week' | 'month';

interface BayTypeRow {
  bayType: string;
  hour: string; day: string; week: string; month: string;
}
interface DurationBandRow {
  id: string;
  frequency: string;
  period: DurationKey;
  price: string;
}
interface MinIncrementalConfig {
  minDuration: string;
  maxDuration: string;
  minCharge: string;
}
interface PricingState {
  mode: PricingMode;
  enabledDurations: Record<DurationKey, boolean>;
  flatBayPrice: boolean;                       // true → single row; false → bay-type table
  flatRates: Record<DurationKey, string>;      // used when flatBayPrice=true
  bayTypes: BayTypeRow[];                      // used when flatBayPrice=false
  // Min + Incremental only
  minIncremental: Record<DurationKey, MinIncrementalConfig>;
  // Fixed Duration only
  fixedPriceSingle: boolean;                   // yes/no toggle for Fixed mode
  fixedSinglePrice: string;
  durationBands: DurationBandRow[];
}

const DURATION_LABEL: Record<DurationKey, string> = {
  hour: 'Hour(s)', day: 'Day(s)', week: 'Week(s)', month: 'Month(s)',
};
const DURATION_RATE_LABEL: Record<DurationKey, string> = {
  hour: 'Hourly Rate', day: 'Daily Rate', week: 'Weekly Rate', month: 'Monthly Rate',
};

const DEFAULT_STATE: PricingState = {
  mode: 'standard',
  enabledDurations: { hour: true, day: true, week: false, month: false },
  flatBayPrice: true,
  flatRates: { hour: '2.50', day: '15.00', week: '', month: '' },
  bayTypes: [
    { bayType: 'Loading Bay', hour: '3.00', day: '18.00', week: '', month: '' },
    { bayType: 'Disabled Bay', hour: '2.50', day: '15.00', week: '', month: '' },
  ],
  minIncremental: {
    hour:  { minDuration: '1',  maxDuration: '24', minCharge: '5.00' },
    day:   { minDuration: '1',  maxDuration: '7',  minCharge: '20.00' },
    week:  { minDuration: '1',  maxDuration: '4',  minCharge: '80.00' },
    month: { minDuration: '1',  maxDuration: '12', minCharge: '300.00' },
  },
  fixedPriceSingle: false,
  fixedSinglePrice: '50.00',
  durationBands: [
    { id: 'b-1', frequency: '1', period: 'day',  price: '25.00' },
    { id: 'b-2', frequency: '1', period: 'week', price: '120.00' },
  ],
};

// ─── Main component ──────────────────────────────────────────────────────
export function PricingTab({ permissionId = 'default' }: { permissionId?: string }) {
  const showToast = useToast();
  const storageKey = `prototype:pricing:${permissionId}`;
  const [state, setState] = useState<PricingState>(DEFAULT_STATE);
  const [importOpen, setImportOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const currency = '£'; // Real app reads from selectedLocation.currency

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
      else setState(DEFAULT_STATE);
    } catch { /* ignore */ }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Save
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* ignore */ }
  }, [hydrated, storageKey, state]);

  const patch = (p: Partial<PricingState>) => setState((s) => ({ ...s, ...p }));
  const enabledList = useMemo(
    () => (['hour', 'day', 'week', 'month'] as DurationKey[]).filter((k) => state.enabledDurations[k]),
    [state.enabledDurations],
  );

  return (
    <Stack spacing={2.5}>
      {/* Mode selector */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Pricing Method</Typography>
        <RadioGroup row value={state.mode} onChange={(_, v) => patch({ mode: v as PricingMode })}>
          <ModeCard value="standard"       label="Standard Pricing"   description="Flat rate per bay per duration. Price scales with bay spaces." />
          <ModeCard value="minIncremental" label="Min + Incremental"  description="Minimum charge for first N units, then incremental rate per space." />
          <ModeCard value="fixed"          label="Fixed Per Duration" description="Flat fee per duration. Does not scale with bay spaces." />
        </RadioGroup>
      </Paper>

      {/* Header actions */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontWeight: 600, color: tokens.MUTED, fontSize: '0.85rem' }}>
          Currency: <b style={{ color: tokens.INK }}>{currency} GBP</b>
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" startIcon={<CloudDownloadIcon />} onClick={() => alert('Sample file downloaded (prototype).')}>
            Download Sample
          </Button>
          <Button size="small" variant="outlined" startIcon={<CloudUploadIcon />} onClick={() => setImportOpen(true)}>
            Bulk Import
          </Button>
        </Stack>
      </Stack>

      {/* Duration selector — used by Standard and Min+Incremental */}
      {state.mode !== 'fixed' && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Applicable Durations</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {(['hour', 'day', 'week', 'month'] as DurationKey[]).map((k) => (
              <FormControlLabel key={k}
                control={<Checkbox checked={state.enabledDurations[k]}
                  onChange={(_, c) => patch({ enabledDurations: { ...state.enabledDurations, [k]: c } })} />}
                label={DURATION_LABEL[k]} />
            ))}
          </Stack>
          {enabledList.length === 0 && (
            <Alert severity="warning" sx={{ mt: 1.5 }}>Select at least one duration.</Alert>
          )}
        </Paper>
      )}

      {/* Standard */}
      {state.mode === 'standard' && enabledList.length > 0 && (
        <StandardPricingSection state={state} patch={patch} currency={currency} enabledList={enabledList} />
      )}

      {/* Min + Incremental */}
      {state.mode === 'minIncremental' && enabledList.length > 0 && (
        <MinIncrementalSection state={state} patch={patch} currency={currency} enabledList={enabledList} />
      )}

      {/* Fixed Duration */}
      {state.mode === 'fixed' && (
        <FixedDurationSection state={state} patch={patch} currency={currency} />
      )}

      {/* Bulk import side dialog */}
      <Dialog open={importOpen} onClose={() => setImportOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Bulk Import Pricing
          <IconButton onClick={() => setImportOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Upload a filled-in CSV template to configure pricing in bulk.
          </Alert>
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderStyle: 'dashed' }}>
            <CloudUploadIcon sx={{ fontSize: 40, color: tokens.MUTED, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">Drop CSV here or click to browse</Typography>
            <Button variant="outlined" size="small" sx={{ mt: 1.5 }} onClick={() => showToast('File chooser coming soon', 'info')}>Choose File</Button>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<CloudDownloadIcon />} onClick={() => alert('Sample downloaded (prototype).')}>
            Download Sample
          </Button>
          <Button variant="contained" onClick={() => { setImportOpen(false); alert('Imported (prototype).'); }}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

// ─── Mode selector card ──────────────────────────────────────────────────
function ModeCard({ value, label, description }: { value: string; label: string; description: string }) {
  return (
    <FormControlLabel value={value} control={<Radio />}
      sx={{ alignItems: 'flex-start', mr: 3, mb: 1, '& .MuiFormControlLabel-label': { pt: 0.5 } }}
      label={
        <Box>
          <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
          <Typography variant="caption" color="text.secondary">{description}</Typography>
        </Box>
      } />
  );
}

// ─── Standard Pricing ────────────────────────────────────────────────────
function StandardPricingSection({ state, patch, currency, enabledList }: {
  state: PricingState; patch: (p: Partial<PricingState>) => void;
  currency: string; enabledList: DurationKey[];
}) {
  const updateFlatRate = (k: DurationKey, v: string) =>
    patch({ flatRates: { ...state.flatRates, [k]: v } });
  const updateBayCell = (i: number, k: keyof BayTypeRow, v: string) =>
    patch({ bayTypes: state.bayTypes.map((r, ri) => ri === i ? { ...r, [k]: v } : r) });
  const addBay = () =>
    patch({ bayTypes: [...state.bayTypes, { bayType: `New Bay ${state.bayTypes.length + 1}`, hour: '', day: '', week: '', month: '' }] });
  const removeBay = (i: number) => patch({ bayTypes: state.bayTypes.filter((_, ri) => ri !== i) });

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
        Fixed rate per bay per duration. Price scales with the number of bay spaces requested.
      </Alert>

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>Flat Bay Price</Typography>
        <FormControlLabel control={<Switch checked={state.flatBayPrice}
          onChange={(_, c) => patch({ flatBayPrice: c })} />} label={state.flatBayPrice ? 'Yes — same price for all bay types' : 'No — separate price per bay type'} />
      </Stack>

      {state.flatBayPrice ? (
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {enabledList.map((k) => (
            <TextField key={k} size="small" sx={{ minWidth: 200, flex: 1 }}
              label={DURATION_RATE_LABEL[k]} value={state.flatRates[k]}
              onChange={(e) => updateFlatRate(k, sanitize(e.target.value))}
              InputProps={{ startAdornment: <InputAdornment position="start">{currency}</InputAdornment> }} />
          ))}
        </Stack>
      ) : (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Bay Type</TableCell>
                {enabledList.map((k) => <TableCell key={k} sx={{ fontWeight: 700 }}>{DURATION_RATE_LABEL[k]}</TableCell>)}
                <TableCell width={48} />
              </TableRow>
            </TableHead>
            <TableBody>
              {state.bayTypes.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <TextField size="small" fullWidth value={r.bayType}
                      onChange={(e) => updateBayCell(i, 'bayType', e.target.value)} />
                  </TableCell>
                  {enabledList.map((k) => (
                    <TableCell key={k}>
                      <TextField size="small" fullWidth value={r[k]}
                        onChange={(e) => updateBayCell(i, k, sanitize(e.target.value))}
                        InputProps={{ startAdornment: <InputAdornment position="start">{currency}</InputAdornment> }} />
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => removeBay(i)} disabled={state.bayTypes.length === 1}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button size="small" startIcon={<AddIcon />} onClick={addBay} sx={{ mt: 1.5 }}>Add Bay Type</Button>
        </>
      )}
    </Paper>
  );
}

// ─── Min + Incremental Pricing ───────────────────────────────────────────
function MinIncrementalSection({ state, patch, currency, enabledList }: {
  state: PricingState; patch: (p: Partial<PricingState>) => void;
  currency: string; enabledList: DurationKey[];
}) {
  const updateMi = (k: DurationKey, field: keyof MinIncrementalConfig, v: string) =>
    patch({ minIncremental: { ...state.minIncremental, [k]: { ...state.minIncremental[k], [field]: v } } });
  const updateFlatRate = (k: DurationKey, v: string) =>
    patch({ flatRates: { ...state.flatRates, [k]: v } });
  const updateBayCell = (i: number, k: keyof BayTypeRow, v: string) =>
    patch({ bayTypes: state.bayTypes.map((r, ri) => ri === i ? { ...r, [k]: v } : r) });

  return (
    <Stack spacing={2}>
      <Alert severity="info" icon={<InfoOutlinedIcon />}>
        Minimum charge for the first N units, then an incremental rate per space per unit.
      </Alert>

      {/* Per-duration config */}
      {enabledList.map((k) => (
        <Paper key={k} variant="outlined" sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 600, mb: 1.5 }}>{DURATION_LABEL[k]} — Configuration</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField size="small" label={`Min ${DURATION_LABEL[k]}`} type="number"
              value={state.minIncremental[k].minDuration}
              onChange={(e) => updateMi(k, 'minDuration', e.target.value)}
              inputProps={{ min: 0, max: 100 }} sx={{ minWidth: 160 }} />
            <TextField size="small" label={`Max ${DURATION_LABEL[k]}`} type="number"
              value={state.minIncremental[k].maxDuration}
              onChange={(e) => updateMi(k, 'maxDuration', e.target.value)}
              inputProps={{ min: 0, max: 100 }} sx={{ minWidth: 160 }} />
            <TextField size="small" label="Min Suspension Charge"
              value={state.minIncremental[k].minCharge}
              onChange={(e) => updateMi(k, 'minCharge', sanitize(e.target.value))}
              InputProps={{ startAdornment: <InputAdornment position="start">{currency}</InputAdornment> }}
              sx={{ minWidth: 200 }} />
          </Stack>
        </Paper>
      ))}

      {/* Flat bay price toggle + incremental rate table */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 600 }}>Incremental Rate</Typography>
          <FormControlLabel control={<Switch checked={state.flatBayPrice}
            onChange={(_, c) => patch({ flatBayPrice: c })} />}
            label={state.flatBayPrice ? 'Flat Bay Price' : 'Per Bay Type'} />
        </Stack>
        {state.flatBayPrice ? (
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {enabledList.map((k) => (
              <TextField key={k} size="small" sx={{ minWidth: 200, flex: 1 }}
                label={`Incremental ${DURATION_RATE_LABEL[k]}`} value={state.flatRates[k]}
                onChange={(e) => updateFlatRate(k, sanitize(e.target.value))}
                InputProps={{ startAdornment: <InputAdornment position="start">{currency}</InputAdornment> }} />
            ))}
          </Stack>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Bay Type</TableCell>
                {enabledList.map((k) => <TableCell key={k} sx={{ fontWeight: 700 }}>Inc. {DURATION_RATE_LABEL[k]}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {state.bayTypes.map((r, i) => (
                <TableRow key={i}>
                  <TableCell><TextField size="small" fullWidth value={r.bayType} onChange={(e) => updateBayCell(i, 'bayType', e.target.value)} /></TableCell>
                  {enabledList.map((k) => (
                    <TableCell key={k}>
                      <TextField size="small" fullWidth value={r[k]}
                        onChange={(e) => updateBayCell(i, k, sanitize(e.target.value))}
                        InputProps={{ startAdornment: <InputAdornment position="start">{currency}</InputAdornment> }} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Stack>
  );
}

// ─── Fixed Duration Pricing ──────────────────────────────────────────────
function FixedDurationSection({ state, patch, currency }: {
  state: PricingState; patch: (p: Partial<PricingState>) => void; currency: string;
}) {
  const addBand = () =>
    patch({ durationBands: [...state.durationBands, { id: `b-${Date.now()}`, frequency: '1', period: 'day', price: '' }] });
  const removeBand = (id: string) =>
    patch({ durationBands: state.durationBands.filter((r) => r.id !== id) });
  const updateBand = (id: string, field: keyof DurationBandRow, v: string) =>
    patch({ durationBands: state.durationBands.map((r) => r.id === id ? { ...r, [field]: v } : r) });

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
        Flat fee per duration. Does not scale with bay spaces. Same price for all bay types.
      </Alert>

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>Fixed Single Price</Typography>
        <FormControlLabel control={<Switch checked={state.fixedPriceSingle}
          onChange={(_, c) => patch({ fixedPriceSingle: c })} />}
          label={state.fixedPriceSingle ? 'Yes — one flat price' : 'No — multiple duration bands'} />
      </Stack>

      {state.fixedPriceSingle ? (
        <TextField size="small" label="Price" value={state.fixedSinglePrice}
          onChange={(e) => patch({ fixedSinglePrice: sanitize(e.target.value) })}
          InputProps={{ startAdornment: <InputAdornment position="start">{currency}</InputAdornment> }}
          sx={{ maxWidth: 260 }} />
      ) : (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Frequency</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell width={48} />
              </TableRow>
            </TableHead>
            <TableBody>
              {state.durationBands.length === 0 && (
                <TableRow><TableCell colSpan={4} align="center" sx={{ color: tokens.MUTED, py: 3 }}>
                  No duration bands yet — click <b>Add Duration</b>.
                </TableCell></TableRow>
              )}
              {state.durationBands.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <TextField size="small" type="number" value={r.frequency}
                      onChange={(e) => updateBand(r.id, 'frequency', e.target.value)}
                      inputProps={{ min: 0, max: 100 }} sx={{ maxWidth: 100 }} />
                  </TableCell>
                  <TableCell>
                    <TextField select size="small" value={r.period}
                      onChange={(e) => updateBand(r.id, 'period', e.target.value)} sx={{ minWidth: 130 }}>
                      {(['hour', 'day', 'week', 'month'] as DurationKey[]).map((k) => (
                        <MenuItem key={k} value={k}>{DURATION_LABEL[k]}</MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField size="small" value={r.price}
                      onChange={(e) => updateBand(r.id, 'price', sanitize(e.target.value))}
                      InputProps={{ startAdornment: <InputAdornment position="start">{currency}</InputAdornment> }}
                      sx={{ maxWidth: 160 }} />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => removeBand(r.id)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button size="small" startIcon={<AddIcon />} onClick={addBand} sx={{ mt: 1.5 }} variant="outlined">
            Add Duration
          </Button>
        </>
      )}

      <Divider sx={{ my: 2.5 }} />
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip label={state.fixedPriceSingle ? 'Single price mode' : `${state.durationBands.length} band(s) configured`}
          color={state.fixedPriceSingle ? 'primary' : 'default'} size="small" />
        <Typography variant="caption" color="text.secondary">
          Applied at checkout as a fixed line item — no per-bay multiplication.
        </Typography>
      </Stack>
    </Paper>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────
// Restrict to numeric with up to 2 decimals
function sanitize(v: string): string {
  if (v === '') return '';
  const m = v.replace(/[^0-9.]/g, '').match(/^\d*(\.\d{0,2})?/);
  return m ? m[0] : '';
}
