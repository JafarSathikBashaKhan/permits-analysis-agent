/*
 * Permission sub-sections — mirrors the "coming soon" placeholders under
 * the Permissions top-tab of the permission builder.
 *
 * Sections implemented:
 *   - Permission Label
 *   - Payment Settings
 *   - Discount Settings
 *   - Document Type Settings
 *   - Merchant Settings
 *   - Renewals and Reminders
 *   - Email Templates
 *   - Visitor Portal Settings
 *
 * Each section persists to localStorage per permission id and matches
 * the real Marston layouts (title + Divider + field rows / repeaters).
 */
import { useEffect, useRef, useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Chip, Divider, FormControlLabel, IconButton,
  InputAdornment, MenuItem, Paper, Radio, RadioGroup, Select, Stack, Switch, Table,
  TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { tokens } from '../../../theme';

// ─── Shared helpers ──────────────────────────────────────────────────────
function usePersistentState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Only merge when both sides are plain objects. For primitives / arrays,
        // use the parsed value directly — spreading a string would produce a
        // character-index object like {"0":"£"}.
        const isPlainObject = (v: any) => v && typeof v === 'object' && !Array.isArray(v);
        if (isPlainObject(initial) && isPlainObject(parsed)) {
          setState({ ...(initial as any), ...parsed } as T);
        } else {
          setState(parsed as T);
        }
      } else {
        setState(initial);
      }
    } catch { /* ignore */ }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore */ }
  }, [hydrated, key, state]);
  return [state, setState];
}

function SectionHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.15rem', color: tokens.INK }}>{title}</Typography>
        {actions}
      </Stack>
      <Divider sx={{ my: 2 }} />
    </>
  );
}

function FieldRow({ label, required, optional, info, error, children }: { label: string; required?: boolean; optional?: boolean; info?: string; error?: string | null; children: React.ReactNode }) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-start' }} sx={{ mb: 2.5 }}>
      <Box sx={{ width: { md: 220 }, pt: { md: 1 } }}>
        <Typography sx={{ fontSize: '0.95rem', color: tokens.INK, fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: '#B71C1C', marginLeft: 4 }}>*</span>}
          {optional && <Typography component="span" sx={{ color: tokens.MUTED, fontSize: '0.8rem', ml: 0.75 }}>(optional)</Typography>}
        </Typography>
        {info && (
          <Typography variant="caption" sx={{ color: tokens.MUTED, display: 'block', mt: 0.5 }}>
            {info}
          </Typography>
        )}
      </Box>
      <Box sx={{ flex: 1 }}>
        {children}
        {error && (
          <Typography sx={{ color: '#C62828', fontSize: '0.75rem', mt: 0.5 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

/**
 * Shared prop shape for permission sub-sections that participate in publish
 * validation. `showErrors` is toggled by the parent once the user has clicked
 * Publish; `error` is the message the validator returned for this section (or
 * null if the section is currently valid).
 */
export type SubSectionProps = { permissionId: string; showErrors?: boolean; error?: string | null };

// ═════════════════════════════════════════════════════════════════════════
//   PERMISSION LABEL
// ═════════════════════════════════════════════════════════════════════════

/**
 * US-181519 — Rich text editor for the Permission Label body text.
 * Uses contentEditable + document.execCommand which supports Bold/Italic/
 * Underline, Font size, Font style, Alignment, Ordered/unordered lists,
 * Hyperlinks, and native Cut/Copy/Paste/Undo/Redo.
 */
function RichTextEditor({
  value, onChange, ariaTestIdPrefix = 'permission-label',
}: { value: string; onChange: (html: string) => void; ariaTestIdPrefix?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const lastEmittedRef = useRef<string>(''); // track the HTML we last emitted so we don't overwrite our own edits
  const [fontSize, setFontSize] = useState('3'); // execCommand fontSize scale 1–7
  const [fontFamily, setFontFamily] = useState('Arial');

  // Sync value → DOM ONLY when the incoming value came from outside this editor
  // (i.e. it does not match the HTML we last emitted via onChange). This preserves
  // the browser's native undo/redo history for contentEditable.
  useEffect(() => {
    if (!ref.current) return;
    if (value === lastEmittedRef.current) return;
    if (ref.current.innerHTML !== value) ref.current.innerHTML = value || '';
    lastEmittedRef.current = value || '';
  }, [value]);

  const emit = () => {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    lastEmittedRef.current = html;
    onChange(html);
  };
  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    emit();
  };
  const onInput = () => emit();
  const promptLink = () => {
    const url = window.prompt('Enter URL', 'https://');
    if (url) exec('createLink', url);
  };

  return (
    <Box data-testid={`${ariaTestIdPrefix}-editor-wrapper`}
      sx={{ border: '1px solid #C7D2DA', borderRadius: 1, overflow: 'hidden', bgcolor: '#fff' }}>
      <Stack direction="row" spacing={0.5} alignItems="center"
        sx={{ px: 1, py: 0.5, borderBottom: '1px solid #E4E9EF', bgcolor: '#F7F9FB', flexWrap: 'wrap' }}
        data-testid={`${ariaTestIdPrefix}-toolbar`}>
        <Tooltip title="Bold"><IconButton size="small" data-testid={`${ariaTestIdPrefix}-btn-bold`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')}><FormatBoldIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Italic"><IconButton size="small" data-testid={`${ariaTestIdPrefix}-btn-italic`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')}><FormatItalicIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Underline"><IconButton size="small" data-testid={`${ariaTestIdPrefix}-btn-underline`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('underline')}><FormatUnderlinedIcon fontSize="small" /></IconButton></Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Select size="small" value={fontSize}
          onChange={(e) => { const v = String(e.target.value); setFontSize(v); exec('fontSize', v); }}
          SelectDisplayProps={{ 'data-testid': `${ariaTestIdPrefix}-font-size` } as any} sx={{ minWidth: 80 }}>
          {[
            ['1', '8pt'], ['2', '10pt'], ['3', '12pt'], ['4', '14pt'], ['5', '18pt'], ['6', '24pt'], ['7', '36pt'],
          ].map(([v, l]) => <MenuItem key={v} value={v} data-testid={`${ariaTestIdPrefix}-font-size-opt-${v}`}>{l}</MenuItem>)}
        </Select>
        <Select size="small" value={fontFamily}
          onChange={(e) => { const v = String(e.target.value); setFontFamily(v); exec('fontName', v); }}
          SelectDisplayProps={{ 'data-testid': `${ariaTestIdPrefix}-font-family` } as any} sx={{ minWidth: 130 }}>
          {['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana'].map((f) =>
            <MenuItem key={f} value={f} data-testid={`${ariaTestIdPrefix}-font-family-opt-${f.replace(/\s+/g, '-')}`} style={{ fontFamily: f }}>{f}</MenuItem>)}
        </Select>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title="Align Left"><IconButton size="small" data-testid={`${ariaTestIdPrefix}-btn-align-left`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyLeft')}><FormatAlignLeftIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Align Center"><IconButton size="small" data-testid={`${ariaTestIdPrefix}-btn-align-center`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyCenter')}><FormatAlignCenterIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Align Right"><IconButton size="small" data-testid={`${ariaTestIdPrefix}-btn-align-right`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyRight')}><FormatAlignRightIcon fontSize="small" /></IconButton></Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title="Unordered List"><IconButton size="small" data-testid={`${ariaTestIdPrefix}-btn-ul`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertUnorderedList')}><FormatListBulletedIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Ordered List"><IconButton size="small" data-testid={`${ariaTestIdPrefix}-btn-ol`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertOrderedList')}><FormatListNumberedIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Insert Hyperlink"><IconButton size="small" data-testid={`${ariaTestIdPrefix}-btn-link`} onMouseDown={(e) => e.preventDefault()} onClick={promptLink}><InsertLinkIcon fontSize="small" /></IconButton></Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title="Undo"><IconButton size="small" data-testid={`${ariaTestIdPrefix}-btn-undo`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('undo')}><UndoIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Redo"><IconButton size="small" data-testid={`${ariaTestIdPrefix}-btn-redo`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('redo')}><RedoIcon fontSize="small" /></IconButton></Tooltip>
      </Stack>
      <Box
        ref={ref}
        data-testid={`${ariaTestIdPrefix}-editor`}
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        sx={{
          minHeight: 160, p: 1.5, outline: 'none', fontSize: '0.95rem', color: tokens.INK,
          '& a': { color: tokens.NAVY, textDecoration: 'underline' },
          '& ul, & ol': { pl: 3, my: 0.5 },
        }}
      />
    </Box>
  );
}

export function PermissionLabelSection({ permissionId }: SubSectionProps) {
  type State = {
    labelText: string; // rich HTML — US-181519
    displayLabel: string;
    shortCode: string;
    colour: string;
    icon: string;
    showOnPermit: boolean;
    showOnBadge: boolean;
    showOnDashboard: boolean;
  };
  const [s, set] = usePersistentState<State>(`prototype:permissionLabel:${permissionId}`, {
    labelText: '',
    displayLabel: '', shortCode: '', colour: '#1976D2', icon: 'directions_car',
    showOnPermit: true, showOnBadge: true, showOnDashboard: true,
  });
  const patch = (p: Partial<State>) => set((prev) => ({ ...prev, ...p }));

  return (
    <>
      <SectionHeader title="Permission Label" />
      {/* US-181519 — Rich text editor for the Permission Label body shown on the application form. */}
      <FieldRow label="Label Text">
        <Stack sx={{ width: '100%' }} spacing={1}>
          <Typography variant="caption" sx={{ color: tokens.MUTED }}>
            Configure the label text shown in the application form for this permission. Supports bold, italic, underline, font size &amp; style, alignment, lists, hyperlinks and cut / copy / paste / undo / redo.
          </Typography>
          <RichTextEditor value={s.labelText} onChange={(html) => patch({ labelText: html })} />
        </Stack>
      </FieldRow>
      <FieldRow label="Display Label" required>
        <TextField size="small" fullWidth placeholder="e.g. Resident Permit" value={s.displayLabel}
          onChange={(e) => patch({ displayLabel: e.target.value })} />
      </FieldRow>
      <FieldRow label="Short Code" required>
        <TextField size="small" placeholder="e.g. RES" value={s.shortCode}
          onChange={(e) => patch({ shortCode: e.target.value.toUpperCase().slice(0, 5) })}
          sx={{ maxWidth: 160 }} inputProps={{ maxLength: 5 }} />
      </FieldRow>
      <FieldRow label="Badge Colour">
        <Stack direction="row" spacing={2} alignItems="center">
          <input type="color" value={s.colour} onChange={(e) => patch({ colour: e.target.value })}
            style={{ width: 46, height: 40, border: '1px solid #C7D2DA', borderRadius: 6, background: 'transparent' }} />
          <TextField size="small" value={s.colour} onChange={(e) => patch({ colour: e.target.value })} sx={{ width: 120 }} />
          <Chip label={s.shortCode || 'CODE'} sx={{ bgcolor: s.colour, color: '#fff', fontWeight: 700 }} />
        </Stack>
      </FieldRow>
      <FieldRow label="Icon">
        <TextField select size="small" value={s.icon} onChange={(e) => patch({ icon: e.target.value })} sx={{ maxWidth: 240 }}>
          {['directions_car', 'local_shipping', 'accessible', 'delivery_dining', 'event', 'star'].map((i) =>
            <MenuItem key={i} value={i}>{i}</MenuItem>)}
        </TextField>
      </FieldRow>
      <FieldRow label="Visibility">
        <Stack>
          <FormControlLabel control={<Checkbox checked={s.showOnPermit}    onChange={(_, c) => patch({ showOnPermit: c })} />}    label="Show on printed permit" />
          <FormControlLabel control={<Checkbox checked={s.showOnBadge}     onChange={(_, c) => patch({ showOnBadge: c })} />}     label="Show on physical badge / windscreen sticker" />
          <FormControlLabel control={<Checkbox checked={s.showOnDashboard} onChange={(_, c) => patch({ showOnDashboard: c })} />} label="Show in Back Office dashboard KPI cards" />
        </Stack>
      </FieldRow>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
//   PAYMENT SETTINGS
// ═════════════════════════════════════════════════════════════════════════

/**
 * US-135723 — Payment Settings: pre-defined methods grouped into
 * Online and Offline. Save-as-draft allows any/all unchecked; publish
 * requires at least one method (validation lives in publishValidation.ts).
 */
const ONLINE_PAYMENT_METHODS = [
  { key: 'useRegisteredCard', label: 'Use Registered Card', info: 'Charge the card the applicant has already saved to their profile — no card entry required at checkout.' },
  { key: 'payNow',            label: 'Pay Now',             info: 'Applicant pays the full amount by card at the point of application.' },
  { key: 'payAfterApproval',  label: 'Pay After Approval',  info: 'Payment is only collected once the application has been reviewed and approved by the back office.' },
  { key: 'payMonthly',        label: 'Pay Monthly',         info: 'Split the total into equal monthly instalments collected automatically each month.' },
  { key: 'payQuarterly',      label: 'Pay Quarterly',       info: 'Split the total into four instalments collected every three months over the permission term.' },
  { key: 'agentAssist',       label: 'Agent Assist',        info: 'A back-office agent takes payment on behalf of the applicant (phone / counter transaction).' },
  { key: 'wallet',            label: 'Wallet',              info: 'Applicant pays from a pre-loaded wallet balance held against their account.' },
] as const;
const OFFLINE_PAYMENT_METHODS = [
  { key: 'postalPayment',    label: 'Postal Payment',        info: 'Applicant posts a cheque or postal order that is banked by the back office and reconciled manually.' },
  { key: 'payOnCollection',  label: 'Pay on Collection',     info: 'Payment is taken in-person when the physical permit is collected from the office.' },
  { key: 'invoice',          label: 'Invoice',               info: 'Applicant is billed via an invoice sent by post or email and settles it out of band.' },
  { key: 'costCentreBudget', label: 'Cost Centre / Budget Code', info: 'Charge is booked against an internal cost centre or budget code — no cash handling required.' },
] as const;
const ALL_PAYMENT_METHODS = [...ONLINE_PAYMENT_METHODS, ...OFFLINE_PAYMENT_METHODS];
type PaymentMethodKey =
  | typeof ONLINE_PAYMENT_METHODS[number]['key']
  | typeof OFFLINE_PAYMENT_METHODS[number]['key'];

export function PaymentSettingsSection({ permissionId, showErrors, error }: SubSectionProps) {
  type State = Record<PaymentMethodKey, boolean> & {
    paymentMode: 'immediate' | 'invoice' | 'onApproval';
    invoiceDays: string;
    partialPaymentAllowed: boolean;
    helpDescription: string; // US-148756
  };
  const defaultState = ALL_PAYMENT_METHODS.reduce<Partial<State>>(
    (acc, m) => { (acc as any)[m.key] = false; return acc; },
    { paymentMode: 'immediate', invoiceDays: '14', partialPaymentAllowed: false, helpDescription: '' },
  ) as State;
  const [s, set] = usePersistentState<State>(`prototype:paymentSettings:${permissionId}`, defaultState);
  const patch = (p: Partial<State>) => set((prev) => ({ ...prev, ...p }));
  const hasMethods = ALL_PAYMENT_METHODS.some((m) => (s as any)[m.key]);
  const methodsError = showErrors && !hasMethods
    ? (error || 'At least one payment method is required to publish this permission')
    : null;
  // US-148756 — hard cap the help description at 500 characters.
  const HELP_MAX = 500;
  const helpValue = (s.helpDescription || '').slice(0, HELP_MAX);
  const helpRemaining = HELP_MAX - helpValue.length;

  const renderGroup = (
    title: string,
    testidPrefix: 'online' | 'offline',
    methods: readonly { key: string; label: string; info: string }[],
  ) => (
    <Box sx={{ mb: 2 }} data-testid={`payment-group-${testidPrefix}`}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: tokens.INK, mb: 0.5 }}>
        {title}
      </Typography>
      <Stack>
        {methods.map((m) => (
          <Box key={m.key} sx={{ borderTop: '1px solid #EEF1F5', py: 0.75 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!(s as any)[m.key]}
                  onChange={(_, c) => patch({ [m.key]: c } as any)}
                  inputProps={{ 'data-testid': `payment-method-${m.key}` } as any}
                />
              }
              label={
                <Stack>
                  <Typography variant="body2" fontWeight={600}>{m.label}</Typography>
                  <Typography variant="caption" sx={{ color: tokens.MUTED }} data-testid={`payment-method-info-${m.key}`}>
                    {m.info}
                  </Typography>
                </Stack>
              }
              sx={{ alignItems: 'flex-start', m: 0 }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );

  return (
    <>
      <SectionHeader title="Payment Settings" />
      {methodsError && (
        <Alert severity="error" sx={{ mb: 2 }} data-testid="payment-methods-error">{methodsError}</Alert>
      )}
      {!methodsError && (
        <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
          Select the payment methods applicants can use to pay for this permission. You can save the permission as draft with no methods selected, but at least one method is required before you can publish.
        </Alert>
      )}

      <FieldRow label="Accepted Payment Methods" required error={methodsError}>
        <Stack sx={{ width: '100%' }}>
          {renderGroup('Online Payments', 'online', ONLINE_PAYMENT_METHODS)}
          {renderGroup('Offline Payments', 'offline', OFFLINE_PAYMENT_METHODS)}
        </Stack>
      </FieldRow>

      {/* US-148756 — Payment Method Help Description (max 500 chars).
          Rendered as a tooltip on the application-form Payment Methods field. */}
      <FieldRow label="Payment Method Help Description">
        <Stack sx={{ width: '100%' }} spacing={0.5}>
          <TextField
            size="small"
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
            placeholder="Explain the available payment methods to the applicant — this appears as a tooltip on the application form."
            value={helpValue}
            onChange={(e) => patch({ helpDescription: e.target.value.slice(0, HELP_MAX) })}
            inputProps={{ maxLength: HELP_MAX, 'data-testid': 'payment-help-description' }}
          />
          <Typography
            variant="caption"
            data-testid="payment-help-description-counter"
            sx={{ alignSelf: 'flex-end', color: helpRemaining === 0 ? '#B91C1C' : tokens.MUTED }}
          >
            {helpValue.length}/{HELP_MAX} characters
          </Typography>
        </Stack>
      </FieldRow>

      <FieldRow label="Payment Mode">
        <RadioGroup value={s.paymentMode} onChange={(_, v) => patch({ paymentMode: v as State['paymentMode'] })}>
          <FormControlLabel value="immediate"  control={<Radio />} label="Immediate — charged at checkout" />
          <FormControlLabel value="invoice"    control={<Radio />} label="Invoice — billed monthly" />
          <FormControlLabel value="onApproval" control={<Radio />} label="On Approval — charged after back-office review" />
        </RadioGroup>
      </FieldRow>

      {s.paymentMode === 'invoice' && (
        <FieldRow label="Invoice Payment Terms">
          <TextField size="small" type="number" value={s.invoiceDays} onChange={(e) => patch({ invoiceDays: e.target.value })}
            InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }} sx={{ maxWidth: 160 }} />
        </FieldRow>
      )}

      <FieldRow label="Partial Payment">
        <FormControlLabel control={<Switch checked={s.partialPaymentAllowed} onChange={(_, c) => patch({ partialPaymentAllowed: c })} />}
          label="Allow applicants to pay in instalments" />
      </FieldRow>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
//   DISCOUNT SETTINGS — US-25058
// ═════════════════════════════════════════════════════════════════════════

/**
 * US-25058 — Discount Settings has two mandatory numeric fields
 * (Blue Badge discount, Pension discount), each with a Percentage /
 * Currency radio next to it. Screen is always editable. Percentage
 * accepts 0–100 with one decimal; Currency accepts 0–1000 with two.
 * Draft has no validation.
 */
type DiscountKind = 'percentage' | 'currency';
type DiscountFieldState = { value: string; kind: DiscountKind };

function validateDiscountValue(value: string, kind: DiscountKind): string | null {
  const raw = (value || '').trim();
  if (raw === '') return null; // blank allowed for drafts
  if (kind === 'percentage') {
    if (!/^\d+(\.\d)?$/.test(raw)) return 'Percentage must be between 0 and 100. ';
    const n = Number(raw);
    if (Number.isNaN(n) || n < 0 || n > 100) return 'Percentage must be between 0 and 100. ';
    return null;
  }
  // currency
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) return 'Amount must be between 0 and 1000. ';
  const n = Number(raw);
  if (Number.isNaN(n) || n < 0 || n > 1000) return 'Amount must be between 0 and 1000. ';
  return null;
}

export function DiscountSettingsSection({ permissionId }: SubSectionProps) {
  type State = { blueBadge: DiscountFieldState; pension: DiscountFieldState };
  const [s, set] = usePersistentState<State>(`prototype:discountSettings:${permissionId}`, {
    blueBadge: { value: '', kind: 'percentage' },
    pension:   { value: '', kind: 'percentage' },
  });
  const [mnpsCurrency] = usePersistentState<string>('prototype:mnps-contract:currency', '£');
  const patchField = (which: 'blueBadge' | 'pension', patch: Partial<DiscountFieldState>) =>
    set((prev) => ({ ...prev, [which]: { ...prev[which], ...patch } }));

  const blueBadgeError = validateDiscountValue(s.blueBadge.value, s.blueBadge.kind);
  const pensionError   = validateDiscountValue(s.pension.value,   s.pension.kind);

  const renderField = (
    label: string,
    which: 'blueBadge' | 'pension',
    field: DiscountFieldState,
    error: string | null,
  ) => (
    <FieldRow label={label} required>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
        <Stack sx={{ width: 220 }}>
          <TextField
            size="small"
            placeholder={field.kind === 'percentage' ? '0.0' : '0.00'}
            value={field.value}
            onChange={(e) => patchField(which, { value: e.target.value })}
            error={!!error}
            InputProps={{
              startAdornment: field.kind === 'currency'
                ? <InputAdornment position="start" data-testid={`discount-${which}-currency-symbol`}>{mnpsCurrency || '£'}</InputAdornment>
                : undefined,
              endAdornment: field.kind === 'percentage'
                ? <InputAdornment position="end">%</InputAdornment>
                : undefined,
            }}
            inputProps={{ 'data-testid': `discount-${which}-input`, inputMode: 'decimal' } as any}
          />
          {error && (
            <Typography variant="caption" data-testid={`discount-${which}-error`} sx={{ color: '#B91C1C', mt: 0.25 }}>
              {error}
            </Typography>
          )}
        </Stack>
        <RadioGroup
          row
          value={field.kind}
          onChange={(_, v) => patchField(which, { kind: v as DiscountKind })}
        >
          <FormControlLabel
            value="percentage"
            control={<Radio inputProps={{ 'data-testid': `discount-${which}-kind-percentage` } as any} />}
            label="Percentage"
          />
          <FormControlLabel
            value="currency"
            control={<Radio inputProps={{ 'data-testid': `discount-${which}-kind-currency` } as any} />}
            label="Currency"
          />
        </RadioGroup>
      </Stack>
    </FieldRow>
  );

  return (
    <>
      <SectionHeader title="Discount Settings" />
      <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
        Enter the discount value for each category and choose whether it is a percentage or a currency amount. The screen is always editable and no validation is required to save as draft.
      </Alert>
      {renderField('Blue Badge Discount', 'blueBadge', s.blueBadge, blueBadgeError)}
      {renderField('Pension Discount',    'pension',   s.pension,   pensionError)}
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
//   DOCUMENT TYPE SETTINGS
// ═════════════════════════════════════════════════════════════════════════
type DocRow = { id: string; name: string; required: boolean; formats: string[]; maxSize: string; expiryDays: string };
export function DocumentTypeSettingsSection({ permissionId, showErrors, error }: SubSectionProps) {
  type State = { rows: DocRow[] };
  const [s, set] = usePersistentState<State>(`prototype:documentTypes:${permissionId}`, {
    rows: [
      { id: 'doc-1', name: 'Proof of Residency',    required: true,  formats: ['PDF', 'JPG', 'PNG'], maxSize: '5', expiryDays: '90' },
      { id: 'doc-2', name: 'Vehicle Ownership (V5C)', required: true,  formats: ['PDF', 'JPG'],       maxSize: '5', expiryDays: '365' },
      { id: 'doc-3', name: 'Utility Bill',            required: false, formats: ['PDF', 'JPG', 'PNG'], maxSize: '5', expiryDays: '90' },
    ],
  });
  const FORMATS = ['PDF', 'JPG', 'PNG', 'HEIC', 'DOC'];
  const addRow = () => set((p) => ({ ...p, rows: [...p.rows, { id: `doc-${Date.now()}`, name: '', required: false, formats: ['PDF'], maxSize: '5', expiryDays: '' }] }));
  const rmRow  = (id: string) => set((p) => ({ ...p, rows: p.rows.filter((r) => r.id !== id) }));
  const upRow  = (id: string, patch: Partial<DocRow>) => set((p) => ({ ...p, rows: p.rows.map((r) => r.id === id ? { ...r, ...patch } : r) }));

  const enabledRows = s.rows.filter((r) => r.name.trim().length > 0);
  const docsError = showErrors && enabledRows.length === 0
    ? (error || 'At least one document type should be checked and enabled to publish')
    : null;

  return (
    <>
      <SectionHeader title="Document Type Settings" />
      {docsError && (
        <Alert severity="error" sx={{ mb: 2 }}>{docsError}</Alert>
      )}
      {!docsError && (
        <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
          Required documents are enforced in the Buy Now and Applications flows.
        </Alert>
      )}
      <Typography sx={{ fontSize: '0.95rem', color: tokens.INK, fontWeight: 500, mb: 1 }}>
        Documents<span style={{ color: '#B71C1C', marginLeft: 4 }}>*</span>
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Document Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Required</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Accepted Formats</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Max Size (MB)</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Expiry (days)</TableCell>
            <TableCell width={48} />
          </TableRow>
        </TableHead>
        <TableBody>
          {s.rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell><TextField size="small" fullWidth value={r.name} onChange={(e) => upRow(r.id, { name: e.target.value })} /></TableCell>
              <TableCell><Switch checked={r.required} onChange={(_, c) => upRow(r.id, { required: c })} /></TableCell>
              <TableCell>
                <TextField select size="small" fullWidth
                  SelectProps={{
                    multiple: true, value: r.formats,
                    onChange: (e) => upRow(r.id, { formats: e.target.value as unknown as string[] }),
                    renderValue: (v) => (v as string[]).join(', '),
                  }} value={r.formats as unknown as string} sx={{ minWidth: 180 }}>
                  {FORMATS.map((f) => <MenuItem key={f} value={f}><Checkbox size="small" checked={r.formats.includes(f)} />{f}</MenuItem>)}
                </TextField>
              </TableCell>
              <TableCell><TextField size="small" type="number" value={r.maxSize} onChange={(e) => upRow(r.id, { maxSize: e.target.value })} sx={{ maxWidth: 90 }} /></TableCell>
              <TableCell><TextField size="small" type="number" value={r.expiryDays} onChange={(e) => upRow(r.id, { expiryDays: e.target.value })} sx={{ maxWidth: 100 }} /></TableCell>
              <TableCell><IconButton size="small" color="error" onClick={() => rmRow(r.id)}><DeleteOutlineIcon fontSize="small" /></IconButton></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button size="small" startIcon={<AddIcon />} onClick={addRow} sx={{ mt: 1.5 }}>Add Document Type</Button>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
//   MERCHANT SETTINGS
// ═════════════════════════════════════════════════════════════════════════
export function MerchantSettingsSection({ permissionId }: SubSectionProps) {
  type State = {
    merchantId: string; merchantAccount: string; gateway: 'worldpay' | 'stripe' | 'opayo' | 'adyen';
    testMode: boolean; threeDSecure: boolean; savePaymentMethod: boolean;
    apiKey: string; webhookUrl: string; refundApiEnabled: boolean;
  };
  const [s, set] = usePersistentState<State>(`prototype:merchantSettings:${permissionId}`, {
    merchantId: '', merchantAccount: '', gateway: 'worldpay',
    testMode: true, threeDSecure: true, savePaymentMethod: false,
    apiKey: '', webhookUrl: '', refundApiEnabled: true,
  });
  const patch = (p: Partial<State>) => set((prev) => ({ ...prev, ...p }));

  return (
    <>
      <SectionHeader title="Merchant Settings" />
      <Alert severity="warning" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
        Live payments will be captured against this merchant account. Use Test Mode until production go-live.
      </Alert>

      <FieldRow label="Payment Gateway" required>
        <TextField select size="small" value={s.gateway} onChange={(e) => patch({ gateway: e.target.value as State['gateway'] })} sx={{ maxWidth: 260 }}>
          <MenuItem value="worldpay">Worldpay</MenuItem>
          <MenuItem value="stripe">Stripe</MenuItem>
          <MenuItem value="opayo">Opayo (Sage Pay)</MenuItem>
          <MenuItem value="adyen">Adyen</MenuItem>
        </TextField>
      </FieldRow>

      <FieldRow label="Merchant ID" required>
        <TextField size="small" fullWidth value={s.merchantId} onChange={(e) => patch({ merchantId: e.target.value })} />
      </FieldRow>
      <FieldRow label="Merchant Account">
        <TextField size="small" fullWidth value={s.merchantAccount} onChange={(e) => patch({ merchantAccount: e.target.value })} />
      </FieldRow>
      <FieldRow label="API Key" required>
        <TextField size="small" fullWidth type="password" value={s.apiKey} onChange={(e) => patch({ apiKey: e.target.value })} />
      </FieldRow>
      <FieldRow label="Webhook URL">
        <TextField size="small" fullWidth value={s.webhookUrl} onChange={(e) => patch({ webhookUrl: e.target.value })} placeholder="https://…/webhooks/payments" />
      </FieldRow>

      <FieldRow label="Options">
        <Stack>
          <FormControlLabel control={<Switch checked={s.testMode}          onChange={(_, c) => patch({ testMode: c })} />}          label="Test Mode (no real charges)" />
          <FormControlLabel control={<Switch checked={s.threeDSecure}      onChange={(_, c) => patch({ threeDSecure: c })} />}      label="Enforce 3-D Secure" />
          <FormControlLabel control={<Switch checked={s.savePaymentMethod} onChange={(_, c) => patch({ savePaymentMethod: c })} />} label="Allow save card for future use" />
          <FormControlLabel control={<Switch checked={s.refundApiEnabled}  onChange={(_, c) => patch({ refundApiEnabled: c })} />}  label="Enable refund API" />
        </Stack>
      </FieldRow>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
//   RENEWALS AND REMINDERS
// ═════════════════════════════════════════════════════════════════════════
export function RenewalsAndRemindersSection({ permissionId }: SubSectionProps) {
  type State = {
    autoRenew: boolean;
    renewalOpenDays: string; renewalWindow: string;
    firstReminder: string; secondReminder: string; finalReminder: string;
    smsReminders: boolean; emailReminders: boolean; postReminders: boolean;
    lateFee: string; graceDays: string;
  };
  const [s, set] = usePersistentState<State>(`prototype:renewals:${permissionId}`, {
    autoRenew: false, renewalOpenDays: '30', renewalWindow: '60',
    firstReminder: '30', secondReminder: '14', finalReminder: '3',
    smsReminders: false, emailReminders: true, postReminders: false,
    lateFee: '15.00', graceDays: '7',
  });
  const patch = (p: Partial<State>) => set((prev) => ({ ...prev, ...p }));

  return (
    <>
      <SectionHeader title="Renewals and Reminders" />

      <FieldRow label="Auto Renewal">
        <FormControlLabel control={<Switch checked={s.autoRenew} onChange={(_, c) => patch({ autoRenew: c })} />}
          label={s.autoRenew ? 'Enabled — charges saved card at expiry' : 'Disabled — applicant must renew manually'} />
      </FieldRow>

      <FieldRow label="Renewal Opens">
        <TextField size="small" type="number" value={s.renewalOpenDays} onChange={(e) => patch({ renewalOpenDays: e.target.value })}
          InputProps={{ endAdornment: <InputAdornment position="end">days before expiry</InputAdornment> }} sx={{ maxWidth: 260 }} />
      </FieldRow>
      <FieldRow label="Renewal Window">
        <TextField size="small" type="number" value={s.renewalWindow} onChange={(e) => patch({ renewalWindow: e.target.value })}
          InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }} sx={{ maxWidth: 260 }} />
      </FieldRow>

      <Divider sx={{ my: 2.5 }}><Chip label="Reminder schedule" /></Divider>

      <FieldRow label="First Reminder">
        <TextField size="small" type="number" value={s.firstReminder} onChange={(e) => patch({ firstReminder: e.target.value })}
          InputProps={{ endAdornment: <InputAdornment position="end">days before expiry</InputAdornment> }} sx={{ maxWidth: 260 }} />
      </FieldRow>
      <FieldRow label="Second Reminder">
        <TextField size="small" type="number" value={s.secondReminder} onChange={(e) => patch({ secondReminder: e.target.value })}
          InputProps={{ endAdornment: <InputAdornment position="end">days before expiry</InputAdornment> }} sx={{ maxWidth: 260 }} />
      </FieldRow>
      <FieldRow label="Final Reminder">
        <TextField size="small" type="number" value={s.finalReminder} onChange={(e) => patch({ finalReminder: e.target.value })}
          InputProps={{ endAdornment: <InputAdornment position="end">days before expiry</InputAdornment> }} sx={{ maxWidth: 260 }} />
      </FieldRow>

      <FieldRow label="Reminder Channels">
        <Stack direction="row" spacing={3}>
          <FormControlLabel control={<Checkbox checked={s.emailReminders} onChange={(_, c) => patch({ emailReminders: c })} />} label="Email" />
          <FormControlLabel control={<Checkbox checked={s.smsReminders}   onChange={(_, c) => patch({ smsReminders: c })} />}   label="SMS" />
          <FormControlLabel control={<Checkbox checked={s.postReminders}  onChange={(_, c) => patch({ postReminders: c })} />}  label="Post (White Mail)" />
        </Stack>
      </FieldRow>

      <Divider sx={{ my: 2.5 }}><Chip label="Late renewal" /></Divider>

      <FieldRow label="Grace Period">
        <TextField size="small" type="number" value={s.graceDays} onChange={(e) => patch({ graceDays: e.target.value })}
          InputProps={{ endAdornment: <InputAdornment position="end">days after expiry</InputAdornment> }} sx={{ maxWidth: 260 }} />
      </FieldRow>
      <FieldRow label="Late Fee">
        <TextField size="small" value={s.lateFee} onChange={(e) => patch({ lateFee: e.target.value })}
          InputProps={{ startAdornment: <InputAdornment position="start">£</InputAdornment> }} sx={{ maxWidth: 160 }} />
      </FieldRow>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
//   EMAIL TEMPLATES
// ═════════════════════════════════════════════════════════════════════════
type EmailKey = 'application' | 'approval' | 'rejection' | 'renewal' | 'expiry' | 'cancellation';
export function EmailTemplatesSection({ permissionId }: SubSectionProps) {
  type State = Record<EmailKey, { enabled: boolean; subject: string; body: string }>;
  const DEFAULTS: State = {
    application:  { enabled: true, subject: 'Application received',       body: 'Dear {{ApplicantName}},\n\nWe have received your application for {{PermitType}}.\nReference: {{ApplicationRef}}.\n\nRegards,\nMarston Permits' },
    approval:     { enabled: true, subject: 'Your permit is approved',    body: 'Dear {{ApplicantName}},\n\nYour permit {{PermitNumber}} for {{Vrm}} is now active from {{StartDate}} to {{ExpiryDate}}.\n\nRegards,\nMarston Permits' },
    rejection:    { enabled: true, subject: 'Application declined',       body: 'Dear {{ApplicantName}},\n\nUnfortunately your application {{ApplicationRef}} has been declined. Reason: {{RejectReason}}.\n\nRegards,\nMarston Permits' },
    renewal:      { enabled: true, subject: 'Time to renew your permit',  body: 'Dear {{ApplicantName}},\n\nYour permit {{PermitNumber}} expires on {{ExpiryDate}}. Renew online at {{RenewalUrl}}.\n\nRegards,\nMarston Permits' },
    expiry:       { enabled: true, subject: 'Your permit has expired',    body: 'Dear {{ApplicantName}},\n\nPermit {{PermitNumber}} expired on {{ExpiryDate}}. You may reapply at any time.\n\nRegards,\nMarston Permits' },
    cancellation: { enabled: true, subject: 'Your permit has been cancelled', body: 'Dear {{ApplicantName}},\n\nPermit {{PermitNumber}} was cancelled on {{CancelDate}}. Refund (if any): £{{RefundAmount}}.\n\nRegards,\nMarston Permits' },
  };
  const [s, set] = usePersistentState<State>(`prototype:emailTemplates:${permissionId}`, DEFAULTS);
  const [active, setActive] = useState<EmailKey>('application');
  const LABELS: Record<EmailKey, string> = {
    application: 'Application received', approval: 'Permit approved',    rejection: 'Application rejected',
    renewal:     'Renewal reminder',     expiry:   'Permit expired',    cancellation: 'Permit cancelled',
  };
  const cur = s[active];
  const patchActive = (p: Partial<State[EmailKey]>) => set((prev) => ({ ...prev, [active]: { ...prev[active], ...p } }));

  return (
    <>
      <SectionHeader title="Email Templates" />
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
        {(Object.keys(LABELS) as EmailKey[]).map((k) => (
          <Chip key={k} label={LABELS[k]} clickable
            color={active === k ? 'primary' : 'default'}
            variant={active === k ? 'filled' : 'outlined'}
            onClick={() => setActive(k)} sx={{ mb: 1 }} />
        ))}
      </Stack>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <FormControlLabel sx={{ mb: 1 }}
          control={<Switch checked={cur.enabled} onChange={(_, c) => patchActive({ enabled: c })} />}
          label={<Typography sx={{ fontWeight: 600 }}>{cur.enabled ? 'Sending enabled' : 'Sending disabled'}</Typography>} />
        <TextField label="Subject" size="small" fullWidth value={cur.subject} onChange={(e) => patchActive({ subject: e.target.value })} sx={{ mb: 2 }} disabled={!cur.enabled} />
        <TextField label="Body" size="small" fullWidth multiline rows={10} value={cur.body} onChange={(e) => patchActive({ body: e.target.value })} disabled={!cur.enabled} />
        <Typography variant="caption" sx={{ color: tokens.MUTED, mt: 1.5, display: 'block' }}>Merge fields:</Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
          {['{{ApplicantName}}', '{{PermitNumber}}', '{{Vrm}}', '{{StartDate}}', '{{ExpiryDate}}', '{{ApplicationRef}}', '{{RejectReason}}', '{{RenewalUrl}}', '{{CancelDate}}', '{{RefundAmount}}'].map((m) =>
            <Chip key={m} label={m} size="small" variant="outlined" sx={{ mb: 0.5 }} />)}
        </Stack>
      </Paper>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
//   VISITOR PORTAL SETTINGS
// ═════════════════════════════════════════════════════════════════════════
export function VisitorPortalSettingsSection({ permissionId }: SubSectionProps) {
  type State = {
    enabled: boolean;
    maxVisitorsPerHost: string; maxDailyPermits: string; maxMonthlyPermits: string;
    validityHours: string; requireHostApproval: boolean; hostSelfServe: boolean;
    allowedDays: string[]; startHour: string; endHour: string;
    portalUrl: string; welcomeMessage: string;
    requireVrm: boolean; requireVisitorName: boolean; requireContactNumber: boolean;
    // US-198805 — Start Session at Start of Day
    startSessionAtStartOfDay: boolean;
  };
  const [s, set] = usePersistentState<State>(`prototype:visitorPortal:${permissionId}`, {
    enabled: true,
    maxVisitorsPerHost: '5', maxDailyPermits: '2', maxMonthlyPermits: '30',
    validityHours: '24', requireHostApproval: false, hostSelfServe: true,
    allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], startHour: '08:00', endHour: '20:00',
    portalUrl: 'https://visitors.marston.example', welcomeMessage: 'Welcome to Marston Visitor Portal.',
    requireVrm: true, requireVisitorName: true, requireContactNumber: false,
    startSessionAtStartOfDay: false, // per AC — default disabled
  });
  const patch = (p: Partial<State>) => set((prev) => ({ ...prev, ...p }));
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const toggleDay = (d: string) => patch({ allowedDays: s.allowedDays.includes(d) ? s.allowedDays.filter((x) => x !== d) : [...s.allowedDays, d] });

  return (
    <>
      <SectionHeader title="Visitor Portal Settings" actions={
        <FormControlLabel control={<Switch checked={s.enabled} onChange={(_, c) => patch({ enabled: c })} />} label="Enable Visitor Portal" />
      } />
      {!s.enabled && <Alert severity="warning" sx={{ mb: 2 }}>Visitor portal is disabled for this permission.</Alert>}

      {s.enabled && (
        <>
          <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
            Residents holding this permit can create short-stay permits for guests via a self-service portal.
          </Alert>

          <FieldRow label="Portal URL"><TextField size="small" fullWidth value={s.portalUrl} onChange={(e) => patch({ portalUrl: e.target.value })} /></FieldRow>
          <FieldRow label="Welcome Message" optional>
            <TextField size="small" fullWidth multiline rows={2} value={s.welcomeMessage} onChange={(e) => patch({ welcomeMessage: e.target.value })} />
          </FieldRow>

          <Divider sx={{ my: 2 }}><Chip label="Quotas" /></Divider>
          <FieldRow label="Max Concurrent Visitors">
            <TextField size="small" type="number" value={s.maxVisitorsPerHost} onChange={(e) => patch({ maxVisitorsPerHost: e.target.value })}
              InputProps={{ endAdornment: <InputAdornment position="end">per host</InputAdornment> }} sx={{ maxWidth: 220 }} />
          </FieldRow>
          <FieldRow label="Max Daily Permits">
            <TextField size="small" type="number" value={s.maxDailyPermits} onChange={(e) => patch({ maxDailyPermits: e.target.value })}
              InputProps={{ endAdornment: <InputAdornment position="end">per day</InputAdornment> }} sx={{ maxWidth: 220 }} />
          </FieldRow>
          <FieldRow label="Max Monthly Permits">
            <TextField size="small" type="number" value={s.maxMonthlyPermits} onChange={(e) => patch({ maxMonthlyPermits: e.target.value })}
              InputProps={{ endAdornment: <InputAdornment position="end">per month</InputAdornment> }} sx={{ maxWidth: 220 }} />
          </FieldRow>
          <FieldRow label="Permit Validity">
            <TextField size="small" type="number" value={s.validityHours} onChange={(e) => patch({ validityHours: e.target.value })}
              InputProps={{ endAdornment: <InputAdornment position="end">hours</InputAdornment> }} sx={{ maxWidth: 220 }} />
          </FieldRow>

          <Divider sx={{ my: 2 }}><Chip label="Availability" /></Divider>
          <FieldRow label="Allowed Days">
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {DAYS.map((d) => (
                <Chip key={d} label={d} clickable
                  color={s.allowedDays.includes(d) ? 'primary' : 'default'}
                  variant={s.allowedDays.includes(d) ? 'filled' : 'outlined'}
                  onClick={() => toggleDay(d)} sx={{ mb: 0.5 }} />
              ))}
            </Stack>
          </FieldRow>
          <FieldRow label="Time Window">
            <Stack direction="row" spacing={2}>
              <TextField size="small" type="time" label="Start" InputLabelProps={{ shrink: true }} value={s.startHour} onChange={(e) => patch({ startHour: e.target.value })} sx={{ maxWidth: 160 }} />
              <TextField size="small" type="time" label="End"   InputLabelProps={{ shrink: true }} value={s.endHour}   onChange={(e) => patch({ endHour: e.target.value })} sx={{ maxWidth: 160 }} />
            </Stack>
          </FieldRow>

          <Divider sx={{ my: 2 }}><Chip label="Camera enforcement compatibility" /></Divider>
          <FieldRow label="Start session at the start of the day"
            info="US-198805. When enabled, any voucher activated on a given day is sent to Illuminate with a start time of 00:01 (and end time 23:59 for single-day vouchers). This prevents PCNs when the visitor drove past a camera before activating.">
            <Stack direction="row" spacing={3} alignItems="center">
              <FormControlLabel
                control={<Radio checked={s.startSessionAtStartOfDay === true}
                  onChange={() => patch({ startSessionAtStartOfDay: true })} />}
                label="Enable"
              />
              <FormControlLabel
                control={<Radio checked={s.startSessionAtStartOfDay === false}
                  onChange={() => patch({ startSessionAtStartOfDay: false })} />}
                label="Disable"
              />
            </Stack>
          </FieldRow>

          <Divider sx={{ my: 2 }}><Chip label="Guest form fields" /></Divider>
          <Stack>
            <FormControlLabel control={<Checkbox checked={s.requireVrm}           onChange={(_, c) => patch({ requireVrm: c })} />}           label="Require vehicle registration (VRM)" />
            <FormControlLabel control={<Checkbox checked={s.requireVisitorName}   onChange={(_, c) => patch({ requireVisitorName: c })} />}   label="Require visitor name" />
            <FormControlLabel control={<Checkbox checked={s.requireContactNumber} onChange={(_, c) => patch({ requireContactNumber: c })} />} label="Require contact number" />
            <FormControlLabel control={<Switch   checked={s.requireHostApproval}  onChange={(_, c) => patch({ requireHostApproval: c })} />}  label="Require Back Office approval before permit is issued" />
            <FormControlLabel control={<Switch   checked={s.hostSelfServe}        onChange={(_, c) => patch({ hostSelfServe: c })} />}        label="Allow residents to self-serve without back-office review" />
          </Stack>
        </>
      )}
    </>
  );
}
