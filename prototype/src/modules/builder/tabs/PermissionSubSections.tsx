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
import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Chip, Divider, FormControlLabel, IconButton,
  InputAdornment, MenuItem, Paper, Radio, RadioGroup, Stack, Switch, Table,
  TableBody, TableCell, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { tokens } from '../../../theme';

// ─── Shared helpers ──────────────────────────────────────────────────────
function usePersistentState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      setState(raw ? { ...(initial as object), ...JSON.parse(raw) } as T : initial);
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

function FieldRow({ label, required, optional, children }: { label: string; required?: boolean; optional?: boolean; children: React.ReactNode }) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-start' }} sx={{ mb: 2.5 }}>
      <Box sx={{ width: { md: 220 }, pt: { md: 1 } }}>
        <Typography sx={{ fontSize: '0.95rem', color: tokens.INK, fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: '#B71C1C', marginLeft: 4 }}>*</span>}
          {optional && <Typography component="span" sx={{ color: tokens.MUTED, fontSize: '0.8rem', ml: 0.75 }}>(optional)</Typography>}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Stack>
  );
}

// ═════════════════════════════════════════════════════════════════════════
//   PERMISSION LABEL
// ═════════════════════════════════════════════════════════════════════════
export function PermissionLabelSection({ permissionId }: { permissionId: string }) {
  type State = {
    displayLabel: string;
    shortCode: string;
    colour: string;
    icon: string;
    showOnPermit: boolean;
    showOnBadge: boolean;
    showOnDashboard: boolean;
  };
  const [s, set] = usePersistentState<State>(`prototype:permissionLabel:${permissionId}`, {
    displayLabel: '', shortCode: '', colour: '#1976D2', icon: 'directions_car',
    showOnPermit: true, showOnBadge: true, showOnDashboard: true,
  });
  const patch = (p: Partial<State>) => set((prev) => ({ ...prev, ...p }));

  return (
    <>
      <SectionHeader title="Permission Label" />
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
export function PaymentSettingsSection({ permissionId }: { permissionId: string }) {
  type State = {
    creditCard: boolean; debitCard: boolean; costCentre: boolean; scratchVoucher: boolean; freeOfCharge: boolean;
    paymentMode: 'immediate' | 'invoice' | 'onApproval';
    invoiceDays: string;
    partialPaymentAllowed: boolean;
  };
  const [s, set] = usePersistentState<State>(`prototype:paymentSettings:${permissionId}`, {
    creditCard: true, debitCard: true, costCentre: false, scratchVoucher: false, freeOfCharge: false,
    paymentMode: 'immediate', invoiceDays: '14', partialPaymentAllowed: false,
  });
  const patch = (p: Partial<State>) => set((prev) => ({ ...prev, ...p }));

  return (
    <>
      <SectionHeader title="Payment Settings" />
      <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
        Configure which payment methods this permission accepts and how charges are collected.
      </Alert>

      <FieldRow label="Accepted Payment Methods" required>
        <Stack>
          <FormControlLabel control={<Checkbox checked={s.creditCard}     onChange={(_, c) => patch({ creditCard: c })} />}     label="Credit Card" />
          <FormControlLabel control={<Checkbox checked={s.debitCard}      onChange={(_, c) => patch({ debitCard: c })} />}      label="Debit Card" />
          <FormControlLabel control={<Checkbox checked={s.costCentre}     onChange={(_, c) => patch({ costCentre: c })} />}     label="Cost Centre / Purchase Order" />
          <FormControlLabel control={<Checkbox checked={s.scratchVoucher} onChange={(_, c) => patch({ scratchVoucher: c })} />} label="Scratch Voucher" />
          <FormControlLabel control={<Checkbox checked={s.freeOfCharge}   onChange={(_, c) => patch({ freeOfCharge: c })} />}   label="Free of Charge (£0.00)" />
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
//   DISCOUNT SETTINGS
// ═════════════════════════════════════════════════════════════════════════
type DiscountRow = { id: string; name: string; type: 'percentage' | 'fixed'; amount: string; criteria: string; active: boolean };
export function DiscountSettingsSection({ permissionId }: { permissionId: string }) {
  type State = { enabled: boolean; rows: DiscountRow[] };
  const [s, set] = usePersistentState<State>(`prototype:discountSettings:${permissionId}`, {
    enabled: true,
    rows: [
      { id: 'd-1', name: 'Concession (60+)',   type: 'percentage', amount: '20', criteria: 'Age >= 60',              active: true },
      { id: 'd-2', name: 'Blue Badge holder',  type: 'percentage', amount: '50', criteria: 'Has valid Blue Badge',   active: true },
      { id: 'd-3', name: 'Early renewal',      type: 'fixed',      amount: '10', criteria: 'Renewed 30+ days early', active: false },
    ],
  });
  const addRow = () => set((p) => ({ ...p, rows: [...p.rows, { id: `d-${Date.now()}`, name: '', type: 'percentage', amount: '', criteria: '', active: true }] }));
  const rmRow  = (id: string) => set((p) => ({ ...p, rows: p.rows.filter((r) => r.id !== id) }));
  const upRow  = (id: string, patch: Partial<DiscountRow>) => set((p) => ({ ...p, rows: p.rows.map((r) => r.id === id ? { ...r, ...patch } : r) }));

  return (
    <>
      <SectionHeader title="Discount Settings" actions={
        <FormControlLabel control={<Switch checked={s.enabled} onChange={(_, c) => set((p) => ({ ...p, enabled: c }))} />} label="Enable discounts" />
      } />
      {!s.enabled && <Alert severity="warning" sx={{ mb: 2 }}>Discounts are disabled — enable to configure rules.</Alert>}
      {s.enabled && (
        <>
          <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
            Discounts are applied at checkout when applicant data matches the criteria.
          </Alert>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Discount Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Criteria</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Active</TableCell>
                <TableCell width={48} />
              </TableRow>
            </TableHead>
            <TableBody>
              {s.rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><TextField size="small" fullWidth value={r.name} onChange={(e) => upRow(r.id, { name: e.target.value })} /></TableCell>
                  <TableCell>
                    <TextField select size="small" value={r.type} onChange={(e) => upRow(r.id, { type: e.target.value as DiscountRow['type'] })} sx={{ minWidth: 130 }}>
                      <MenuItem value="percentage">Percentage</MenuItem>
                      <MenuItem value="fixed">Fixed (£)</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField size="small" value={r.amount} onChange={(e) => upRow(r.id, { amount: e.target.value })}
                      InputProps={{
                        startAdornment: r.type === 'fixed' ? <InputAdornment position="start">£</InputAdornment> : undefined,
                        endAdornment:   r.type === 'percentage' ? <InputAdornment position="end">%</InputAdornment> : undefined,
                      }} sx={{ maxWidth: 130 }} />
                  </TableCell>
                  <TableCell><TextField size="small" fullWidth value={r.criteria} onChange={(e) => upRow(r.id, { criteria: e.target.value })} /></TableCell>
                  <TableCell><Switch checked={r.active} onChange={(_, c) => upRow(r.id, { active: c })} /></TableCell>
                  <TableCell><IconButton size="small" color="error" onClick={() => rmRow(r.id)}><DeleteOutlineIcon fontSize="small" /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button size="small" startIcon={<AddIcon />} onClick={addRow} sx={{ mt: 1.5 }}>Add Discount</Button>
        </>
      )}
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
//   DOCUMENT TYPE SETTINGS
// ═════════════════════════════════════════════════════════════════════════
type DocRow = { id: string; name: string; required: boolean; formats: string[]; maxSize: string; expiryDays: string };
export function DocumentTypeSettingsSection({ permissionId }: { permissionId: string }) {
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

  return (
    <>
      <SectionHeader title="Document Type Settings" />
      <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
        Required documents are enforced in the Buy Now and Applications flows.
      </Alert>
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
export function MerchantSettingsSection({ permissionId }: { permissionId: string }) {
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
export function RenewalsAndRemindersSection({ permissionId }: { permissionId: string }) {
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
export function EmailTemplatesSection({ permissionId }: { permissionId: string }) {
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
export function VisitorPortalSettingsSection({ permissionId }: { permissionId: string }) {
  type State = {
    enabled: boolean;
    maxVisitorsPerHost: string; maxDailyPermits: string; maxMonthlyPermits: string;
    validityHours: string; requireHostApproval: boolean; hostSelfServe: boolean;
    allowedDays: string[]; startHour: string; endHour: string;
    portalUrl: string; welcomeMessage: string;
    requireVrm: boolean; requireVisitorName: boolean; requireContactNumber: boolean;
  };
  const [s, set] = usePersistentState<State>(`prototype:visitorPortal:${permissionId}`, {
    enabled: true,
    maxVisitorsPerHost: '5', maxDailyPermits: '2', maxMonthlyPermits: '30',
    validityHours: '24', requireHostApproval: false, hostSelfServe: true,
    allowedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], startHour: '08:00', endHour: '20:00',
    portalUrl: 'https://visitors.marston.example', welcomeMessage: 'Welcome to Marston Visitor Portal.',
    requireVrm: true, requireVisitorName: true, requireContactNumber: false,
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
