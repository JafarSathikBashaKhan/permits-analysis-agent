/*
 * Contract Settings — mirrors the real Marston MNPS-Permission-UI
 * ContractSettings.tsx (260KB) with the 13-section scroll-spy layout.
 *
 * Sections (order mirrors real): Customer Settings, Purchase Quantity Limit,
 * Fees, Temporary Vehicle, Documents Expiration, Fields for Vehicles,
 * Permission Closure, Merchant Settings, Unique Reference Numbers,
 * Pricing Alert Configuration, Suspension Settings, Dispensation Settings, Others.
 *
 * Conditional visibility rules preserved:
 *   - Blue badge limit only when Blue badge = ON
 *   - Suspensions/Dispensations Limit only when respective toggle ON
 *   - Reminder Frequency/Period disabled when reminder OFF
 *   - Notification emails only when Reminder 1 OR 2 = ON
 *   - Experian Vehicle Pass Score only when Experian toggle = ON
 *   - Keep Tier Price at Original Rate disabled when Tier Pricing = OFF
 */
import {
  Alert, Box, Button, Divider, FormControlLabel, Grid, InputAdornment,
  MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../shared/PageHeader';
import { useToast } from '../../components/Toast';
import { Section } from '../../shared/Section';
import { FieldHint } from '../../shared/FieldHint';
import { usePersistentState } from '../../hooks/usePersistentState';

// ─── Left-nav sections (scroll-spy) ─────────────────────────────────────
const NAV_SECTIONS: { id: string; label: string }[] = [
  { id: 'customer-settings',           label: 'Customer Settings' },
  { id: 'purchase-quantity-limit',     label: 'Purchase Quantity Limit' },
  { id: 'fees',                        label: 'Fees' },
  { id: 'temporary-vehicle',           label: 'Temporary Vehicle' },
  { id: 'documents-expiration',        label: 'Documents Expiration' },
  { id: 'fields-for-vehicles',         label: 'Fields for Vehicles' },
  { id: 'permission-closure',          label: 'Permission Closure' },
  { id: 'merchant-settings',           label: 'Merchant Settings' },
  { id: 'unique-reference-numbers',    label: 'Unique Reference Numbers' },
  { id: 'pricing-alert-configuration', label: 'Pricing Alert Configuration' },
  { id: 'suspension-settings',         label: 'Suspension Settings' },
  { id: 'dispensation-settings',       label: 'Dispensation Settings' },
  { id: 'others',                      label: 'Others' },
];

type ToggleDef = { key: string; label: string; hint: string; defaultOn?: boolean };

const CUSTOMER_TOGGLES: ToggleDef[] = [
  { key: 'blueBadge',         label: 'Blue badge',                                    hint: 'Enables the Blue Badge section on applicant profiles.', defaultOn: true },
  { key: 'dob',               label: 'DOB field is mandatory for account creation',   hint: 'Adds a required DOB field to applicant registration.' },
  { key: 'autoActivateUsers', label: 'Auto-activate users',                           hint: 'Newly invited users become active without manual approval.' },
  { key: 'redact',            label: 'Redact sensitive fields in Back Office',        hint: 'Hides sensitive PII by default.' },
];

const VEHICLE_FIELD_TOGGLES: ToggleDef[] = [
  { key: 'attrType',     label: 'Vehicle type',              hint: 'Show broad vehicle type.', defaultOn: true },
  { key: 'attrFuel',     label: 'Fuel type',                 hint: 'Show fuel type.', defaultOn: true },
  { key: 'attrMake',     label: 'Make',                      hint: 'Show the Make field.', defaultOn: true },
  { key: 'attrModel',    label: 'Model',                     hint: 'Show the Model field.', defaultOn: true },
  { key: 'attrColor',    label: 'Colour',                    hint: 'Show the Colour field.' },
  { key: 'attrCo2',      label: 'CO₂ Emission (g/km)',       hint: 'Show CO2 g/km.' },
  { key: 'attrEuro',     label: 'Euro Standard 6',           hint: 'Show Euro emissions standard.' },
  { key: 'attrEngine',   label: 'Engine size',               hint: 'Show engine size in cc.' },
  { key: 'attrTaxBand',  label: 'Number Plate Tax Band',     hint: 'Show tax band code.' },
  { key: 'attrSeats',    label: 'Number of Seats',           hint: 'Show number of seats.' },
  { key: 'attrFirstReg', label: 'First Date of Registration',hint: 'Show first registration date.' },
];

const URN_TOGGLES: ToggleDef[] = [
  { key: 'autoUsrn', label: 'USRN (auto-generate)', hint: 'When on, USRN is generated automatically.', defaultOn: true },
  { key: 'autoUprn', label: 'UPRN (auto-generate)', hint: 'Property reference generated automatically.', defaultOn: true },
];

const OTHERS_TOGGLES: ToggleDef[] = [
  { key: 'sms',              label: 'SMS Reminder',                     hint: 'Sends key updates via SMS in addition to email.' },
  { key: 'emailComms',       label: 'Email Communication',              hint: 'Sends transactional emails to applicants.', defaultOn: true },
  { key: 'dieselSurcharge',  label: 'Diesel Surcharge',                 hint: 'Adds diesel surcharge to relevant permissions.', defaultOn: true },
  { key: 'tierPricing',      label: 'Tier Pricing',                     hint: 'Permits can charge by number of properties.', defaultOn: true },
  { key: 'keepTierOriginal', label: 'Keep Tier Price at Original Rate', hint: 'Disabled when Tier Pricing = OFF.' },
  { key: 'addressChallenge', label: 'Address Challenge Permission',     hint: 'Enables the Change Address Challenge workflow.' },
  { key: 'versionHistory',   label: 'Version History Retention',        hint: 'Retain historical versions of settings.', defaultOn: true },
  { key: 'experian',         label: 'Experian Vehicle Pass Score',      hint: 'Runs an Experian score at VRM entry.' },
  { key: 'visitorPortal',    label: 'Visitor portal',                   hint: 'Enables the visitor-facing portal.', defaultOn: true },
];

const PERIODS = ['Hours', 'Days', 'Weeks', 'Months', 'Years'];

// ─── Scroll-spy left nav ────────────────────────────────────────────────
function ScrollSpyNav() {
  const [active, setActive] = useState<string>(NAV_SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    NAV_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky', top: 72, alignSelf: 'flex-start',
        minWidth: 220, maxWidth: 220, pt: 1,
        borderRight: '1px solid', borderColor: 'divider',
        maxHeight: 'calc(100vh - 96px)', overflowY: 'auto',
      }}
    >
      <Typography variant="caption"
        sx={{ px: 2, color: 'text.secondary', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
        Sections
      </Typography>
      <Stack sx={{ mt: 1 }}>
        {NAV_SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <Box key={s.id} onClick={() => scrollTo(s.id)}
              sx={{
                px: 2, py: 1, cursor: 'pointer', fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'primary.main' : 'text.primary',
                borderLeft: '3px solid',
                borderLeftColor: isActive ? 'primary.main' : 'transparent',
                bgcolor: isActive ? 'rgba(25,118,210,0.06)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(25,118,210,0.04)' },
              }}>
              {s.label}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

export function ContractSettingsPage() {
  const showToast = useToast();
  // Toggle state — one flat map covers every switch/checkbox on the page.
  const initial = useMemo(() => {
    const s: Record<string, boolean> = {};
    [...CUSTOMER_TOGGLES, ...VEHICLE_FIELD_TOGGLES, ...URN_TOGGLES, ...OTHERS_TOGGLES]
      .forEach((t) => { s[t.key] = !!t.defaultOn; });
    return s;
  }, []);
  const [state, setState] = usePersistentState<Record<string, boolean>>('prototype:contract-settings:state', initial);

  // Customer
  const [blueBadgeLimit, setBlueBadgeLimit] = useState(2);

  // Purchase quantity
  const [minVouchers, setMinVouchers] = useState(1);
  const [maxVouchers, setMaxVouchers] = useState(50);
  const [minScratch, setMinScratch] = useState(1);
  const [maxScratch, setMaxScratch] = useState(5);

  // Fees
  const [adminFee, setAdminFee] = useState('3.50');
  const [priceAlert, setPriceAlert] = useState('10');

  // Temporary vehicle
  const [tempVehFreq, setTempVehFreq] = useState(3);
  const [tempVehPeriod, setTempVehPeriod] = useState('Days');
  const [tempVehLimitFreq, setTempVehLimitFreq] = useState(30);
  const [tempVehLimitPeriod, setTempVehLimitPeriod] = useState('Days');
  const [tempSwitches, setTempSwitches] = useState(3);

  // Documents Expiration
  const [docExpFreq, setDocExpFreq] = useState(90);
  const [docExpPeriod, setDocExpPeriod] = useState('Days');

  // Permission closure
  const [pfGraceFreq, setPfGraceFreq] = useState(7);
  const [pfGracePeriod, setPfGracePeriod] = useState('Days');
  const [pfClosureFreq, setPfClosureFreq] = useState(14);
  const [pfClosurePeriod, setPfClosurePeriod] = useState('Days');
  const [seGraceFreq, setSeGraceFreq] = useState(7);
  const [seGracePeriod, setSeGracePeriod] = useState('Days');
  const [seClosureFreq, setSeClosureFreq] = useState(21);
  const [seClosurePeriod, setSeClosurePeriod] = useState('Days');

  // Merchant
  const [merchantPermType, setMerchantPermType] = useState('Resident Permit');
  const [boProv, setBoProv] = useState('Stripe');
  const [boId, setBoId] = useState('MERCH-BO-001');
  const [boUser, setBoUser] = useState('bo-merchant');
  const [custProv, setCustProv] = useState('Stripe');
  const [custId, setCustId] = useState('MERCH-CU-001');
  const [custUser, setCustUser] = useState('cust-merchant');

  // Pricing alert reminders
  const [rem1On, setRem1On] = useState(true);
  const [rem1Freq, setRem1Freq] = useState('30');
  const [rem1Period, setRem1Period] = useState('Days');
  const [rem2On, setRem2On] = useState(false);
  const [rem2Freq, setRem2Freq] = useState('7');
  const [rem2Period, setRem2Period] = useState('Days');
  const [notifyEmails, setNotifyEmails] = useState<string[]>(['bo-alerts@marston.co.uk']);
  const [newEmail, setNewEmail] = useState('');
  const remindersDuplicate = rem1On && rem2On && rem1Freq === rem2Freq && rem1Period === rem2Period;
  const showNotifyEmails = rem1On || rem2On;

  // Suspension / Dispensation
  const [suspTown, setSuspTown] = useState(true);
  const [suspLimitOn, setSuspLimitOn] = useState(false);
  const [suspLimit, setSuspLimit] = useState(10);
  const [suspStreetMode, setSuspStreetMode] = useState('Manual Street Entry');
  const [dispTown, setDispTown] = useState(true);
  const [dispLimitOn, setDispLimitOn] = useState(false);
  const [dispLimit, setDispLimit] = useState(5);
  const [dispStreetMode, setDispStreetMode] = useState('Manual Entry');

  // Experian (conditional)
  const [experianOp, setExperianOp] = useState('>=');
  const [experianScore, setExperianScore] = useState('700');

  const addEmail = () => {
    const e = newEmail.trim();
    if (!e || notifyEmails.length >= 10) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return;
    setNotifyEmails((p) => [...p, e]);
    setNewEmail('');
  };

  return (
    <>
      <PageHeader eyebrow="Configuration" title="Contract Settings"
        description="Global switches and defaults for the entire contract. These affect every module."
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => showToast('Changes discarded', 'info')}>Cancel</Button>
            <Button variant="contained" startIcon={<Save />} onClick={() => showToast('Settings saved', 'success')}>Save Changes</Button>
          </Stack>
        } />

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        <ScrollSpyNav />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* ─── Customer Settings ─── */}
          <Section id="customer-settings" title="Customer Settings" description="What is captured for applicants.">
            <Grid container spacing={1.5}>
              {CUSTOMER_TOGGLES.map((t) => (
                <Grid item xs={12} md={6} key={t.key}>
                  <ToggleRow t={t} state={state} setState={setState} />
                </Grid>
              ))}
              {state['blueBadge'] && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" fontWeight={600} mb={0.5}>Blue badge limit
                    <FieldHint text="Max blue badges per household. Shown because Blue badge = ON." /></Typography>
                  <TextField type="number" size="small" value={blueBadgeLimit}
                    onChange={(e) => setBlueBadgeLimit(+e.target.value)} />
                </Grid>
              )}
            </Grid>
          </Section>

          {/* ─── Purchase Quantity Limit ─── */}
          <Section id="purchase-quantity-limit" title="Purchase Quantity Limit"
            description="Min/max caps enforced during Buy Now for visitor vouchers and scratch cards.">
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}><NumField label="Minimum Number Of Visitor Vouchers" value={minVouchers} setValue={setMinVouchers} /></Grid>
              <Grid item xs={6} md={3}><NumField label="Maximum Number Of Visitor Vouchers" value={maxVouchers} setValue={setMaxVouchers} /></Grid>
              <Grid item xs={6} md={3}><NumField label="Minimum Number Of Scratch Card" value={minScratch} setValue={setMinScratch} /></Grid>
              <Grid item xs={6} md={3}><NumField label="Maximum Number Of Scratch Card" value={maxScratch} setValue={setMaxScratch} /></Grid>
            </Grid>
            {(minVouchers > maxVouchers || minScratch > maxScratch) && (
              <Alert severity="error" sx={{ mt: 2 }}>Minimum values must be less than or equal to Maximum values.</Alert>
            )}
          </Section>

          {/* ─── Fees ─── */}
          <Section id="fees" title="Fees" description="Admin fee applied to every permission purchase.">
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" fontWeight={600} mb={0.5}>Admin fee for Permission</Typography>
                <TextField value={adminFee} size="small" fullWidth onChange={(e) => setAdminFee(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start">£</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" fontWeight={600} mb={0.5}>Price alert threshold
                  <FieldHint text="Warn staff when a permission price changes by more than this %." /></Typography>
                <TextField value={priceAlert} size="small" fullWidth onChange={(e) => setPriceAlert(e.target.value)}
                  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
              </Grid>
            </Grid>
          </Section>

          {/* ─── Temporary Vehicle ─── */}
          <Section id="temporary-vehicle" title="Temporary Vehicle"
            description="How long a temporary vehicle is valid and how often it can be added.">
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}><NumField label="Temporary Vehicle Validity - Frequency" value={tempVehFreq} setValue={setTempVehFreq} /></Grid>
              <Grid item xs={6} md={3}><SelField label="Temporary Vehicle Validity - Period" value={tempVehPeriod} setValue={setTempVehPeriod} options={PERIODS} /></Grid>
              <Grid item xs={6} md={3}><NumField label="Temporary Vehicle Add Limit - Frequency" value={tempVehLimitFreq} setValue={setTempVehLimitFreq} /></Grid>
              <Grid item xs={6} md={3}><SelField label="Temporary Vehicle Add Limit - Period" value={tempVehLimitPeriod} setValue={setTempVehLimitPeriod} options={PERIODS} /></Grid>
              <Grid item xs={6} md={3}><NumField label="Number of Temporary Switches" value={tempSwitches} setValue={setTempSwitches} /></Grid>
            </Grid>
          </Section>

          {/* ─── Documents Expiration ─── */}
          <Section id="documents-expiration" title="Documents Expiration" description="Default validity period for uploaded documents.">
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}><NumField label="Expiration Duration - Frequency" value={docExpFreq} setValue={setDocExpFreq} /></Grid>
              <Grid item xs={6} md={3}><SelField label="Expiration Duration - Period" value={docExpPeriod} setValue={setDocExpPeriod} options={PERIODS} /></Grid>
            </Grid>
          </Section>

          {/* ─── Fields for Vehicles ─── */}
          <Section id="fields-for-vehicles" title="Fields for Vehicles"
            description="Mandatory vehicle fields captured during Buy Now and application review.">
            <Grid container spacing={1.5}>
              {VEHICLE_FIELD_TOGGLES.map((t) => (
                <Grid item xs={12} md={6} key={t.key}>
                  <ToggleRow t={t} state={state} setState={setState} />
                </Grid>
              ))}
            </Grid>
          </Section>

          {/* ─── Permission Closure ─── */}
          <Section id="permission-closure" title="Permission Closure"
            description="Grace and closure periods for payment failure and support-evidence workflows.">
            <Typography variant="body2" fontWeight={700} sx={{ mt: 1, mb: 1.5 }}>Payment Failure</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}><NumField label="Grace period - Frequency" value={pfGraceFreq} setValue={setPfGraceFreq} /></Grid>
              <Grid item xs={6} md={3}><SelField label="Grace period - Period" value={pfGracePeriod} setValue={setPfGracePeriod} options={PERIODS} /></Grid>
              <Grid item xs={6} md={3}><NumField label="Closure Permission - Frequency" value={pfClosureFreq} setValue={setPfClosureFreq} /></Grid>
              <Grid item xs={6} md={3}><SelField label="Closure Permission - Period" value={pfClosurePeriod} setValue={setPfClosurePeriod} options={PERIODS} /></Grid>
            </Grid>
            <Divider sx={{ my: 2.5 }} />
            <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5 }}>Support Evidence</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}><NumField label="Grace Period - Frequency" value={seGraceFreq} setValue={setSeGraceFreq} /></Grid>
              <Grid item xs={6} md={3}><SelField label="Grace Period - Period" value={seGracePeriod} setValue={setSeGracePeriod} options={PERIODS} /></Grid>
              <Grid item xs={6} md={3}><NumField label="Closure Permission - Frequency" value={seClosureFreq} setValue={setSeClosureFreq} /></Grid>
              <Grid item xs={6} md={3}><SelField label="Closure Permission - Period" value={seClosurePeriod} setValue={setSeClosurePeriod} options={PERIODS} /></Grid>
            </Grid>
          </Section>

          {/* ─── Merchant Settings ─── */}
          <Section id="merchant-settings" title="Merchant Settings"
            description="Payment gateway credentials — separate configuration for Back Office and Customer-facing checkout, per Permission Type.">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField label="Permission Type" size="small" select fullWidth
                  value={merchantPermType} onChange={(e) => setMerchantPermType(e.target.value)}>
                  {['Resident Permit', 'Visitor Permit', 'Business Permit', 'Blue Badge'].map((p) =>
                    <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}><Divider>Back Office Merchant</Divider></Grid>
              <Grid item xs={12} md={4}><TextField label="Back Office Merchant Provider" size="small" fullWidth value={boProv} onChange={(e) => setBoProv(e.target.value)} /></Grid>
              <Grid item xs={12} md={4}><TextField label="Back Office Merchant ID" size="small" fullWidth value={boId} onChange={(e) => setBoId(e.target.value)} /></Grid>
              <Grid item xs={12} md={4}><TextField label="Back Office Merchant User" size="small" fullWidth value={boUser} onChange={(e) => setBoUser(e.target.value)} /></Grid>
              <Grid item xs={12}><Divider>Customer Merchant</Divider></Grid>
              <Grid item xs={12} md={4}><TextField label="Customer Merchant Provider" size="small" fullWidth value={custProv} onChange={(e) => setCustProv(e.target.value)} /></Grid>
              <Grid item xs={12} md={4}><TextField label="Customer Merchant ID" size="small" fullWidth value={custId} onChange={(e) => setCustId(e.target.value)} /></Grid>
              <Grid item xs={12} md={4}><TextField label="Customer Merchant User" size="small" fullWidth value={custUser} onChange={(e) => setCustUser(e.target.value)} /></Grid>
            </Grid>
          </Section>

          {/* ─── Unique Reference Numbers ─── */}
          <Section id="unique-reference-numbers" title="Unique Reference Numbers"
            description="USRN / UPRN generation for streets and properties.">
            <Grid container spacing={1.5}>
              {URN_TOGGLES.map((t) => (
                <Grid item xs={12} md={6} key={t.key}>
                  <ToggleRow t={t} state={state} setState={setState} />
                </Grid>
              ))}
            </Grid>
          </Section>

          {/* ─── Pricing Alert Configuration ─── */}
          <Section id="pricing-alert-configuration" title="Pricing Alert Configuration"
            description="Two independent price-change reminders that email BO staff before price rollovers.">
            {remindersDuplicate && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Both reminders have the same frequency and period. Give them different schedules for meaningful alerts.
              </Alert>
            )}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <FormControlLabel control={<Switch checked={rem1On} onChange={(_, c) => setRem1On(c)} />} label="Reminder 1" />
              </Grid>
              <Grid item xs={5} md={2}>
                <TextField label="Frequency" size="small" type="number" value={rem1Freq} onChange={(e) => setRem1Freq(e.target.value)} disabled={!rem1On} />
              </Grid>
              <Grid item xs={7} md={3}>
                <TextField label="Period" size="small" select value={rem1Period} onChange={(e) => setRem1Period(e.target.value)} disabled={!rem1On} fullWidth>
                  {PERIODS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12} md={2}>
                <FormControlLabel control={<Switch checked={rem2On} onChange={(_, c) => setRem2On(c)} />} label="Reminder 2" />
              </Grid>
              <Grid item xs={5} md={2}>
                <TextField label="Frequency" size="small" type="number" value={rem2Freq} onChange={(e) => setRem2Freq(e.target.value)} disabled={!rem2On} />
              </Grid>
              <Grid item xs={7} md={3}>
                <TextField label="Period" size="small" select value={rem2Period} onChange={(e) => setRem2Period(e.target.value)} disabled={!rem2On} fullWidth>
                  {PERIODS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>
              </Grid>
              {showNotifyEmails && (
                <>
                  <Grid item xs={12}><Divider /></Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" fontWeight={600} mb={1}>
                      Notification Email Address <FieldHint text="Max 10 recipients. Shown because at least one reminder is enabled." />
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1 }} useFlexGap>
                      {notifyEmails.map((e) => (
                        <Box key={e} sx={{ px: 1.5, py: 0.5, bgcolor: '#EAF3FB', borderRadius: 5, fontSize: '0.8rem' }}>
                          {e}
                          <Box component="span" sx={{ ml: 1, cursor: 'pointer', color: 'text.secondary' }}
                            onClick={() => setNotifyEmails((prev) => prev.filter((x) => x !== e))}>×</Box>
                        </Box>
                      ))}
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <TextField size="small" placeholder="email@example.com" value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEmail(); } }}
                        sx={{ flex: 1, maxWidth: 340 }} />
                      <Button variant="outlined" onClick={addEmail} disabled={notifyEmails.length >= 10}>Add</Button>
                    </Stack>
                    {notifyEmails.length >= 10 && <Typography variant="caption" color="error">Max 10 emails.</Typography>}
                  </Grid>
                </>
              )}
            </Grid>
          </Section>

          {/* ─── Suspension Settings ─── */}
          <Section id="suspension-settings" title="Suspension Settings"
            description="Per-street caps and street-selection mode for suspensions.">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControlLabel control={<Switch checked={suspTown} onChange={(_, c) => setSuspTown(c)} />} label="Town Field" />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel control={<Switch checked={suspLimitOn} onChange={(_, c) => setSuspLimitOn(c)} />}
                  label="Maximum Suspensions per street" />
              </Grid>
              {suspLimitOn && (
                <Grid item xs={12} md={3}>
                  <NumField label="Suspensions Limit" value={suspLimit} setValue={setSuspLimit} />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <SelField label="Street Selection" value={suspStreetMode} setValue={setSuspStreetMode}
                  options={['Manual Street Entry', 'System Street', 'Map Integration']} />
              </Grid>
            </Grid>
          </Section>

          {/* ─── Dispensation Settings ─── */}
          <Section id="dispensation-settings" title="Dispensation Settings"
            description="Per-street caps and street-selection mode for dispensations.">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControlLabel control={<Switch checked={dispTown} onChange={(_, c) => setDispTown(c)} />} label="Town Field" />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel control={<Switch checked={dispLimitOn} onChange={(_, c) => setDispLimitOn(c)} />}
                  label="Maximum Dispensations per street" />
              </Grid>
              {dispLimitOn && (
                <Grid item xs={12} md={3}>
                  <NumField label="Dispensations Limit" value={dispLimit} setValue={setDispLimit} />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <SelField label="Street Selection" value={dispStreetMode} setValue={setDispStreetMode}
                  options={['Manual Entry', 'System Street', 'Maps']} />
              </Grid>
            </Grid>
          </Section>

          {/* ─── Others ─── */}
          <Section id="others" title="Others" description="Miscellaneous global toggles.">
            <Grid container spacing={1.5}>
              {OTHERS_TOGGLES.map((t) => {
                const disabled = t.key === 'keepTierOriginal' && !state['tierPricing'];
                return (
                  <Grid item xs={12} md={6} key={t.key}>
                    <ToggleRow t={t} state={state} setState={setState} disabled={disabled} />
                  </Grid>
                );
              })}
              {state['experian'] && (
                <>
                  <Grid item xs={12}><Divider>Experian Vehicle Pass Score</Divider></Grid>
                  <Grid item xs={6} md={3}>
                    <SelField label="Operator" value={experianOp} setValue={setExperianOp} options={['>=', '>', '=', '<', '<=']} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" fontWeight={600} mb={0.5}>Score (1–1000)</Typography>
                    <TextField size="small" type="number" value={experianScore}
                      onChange={(e) => setExperianScore(e.target.value)} fullWidth />
                  </Grid>
                </>
              )}
            </Grid>
          </Section>
        </Box>
      </Box>
    </>
  );
}

// ─── Local helpers ─────────────────────────────────────────────────────
function ToggleRow({ t, state, setState, disabled }: {
  t: ToggleDef;
  state: Record<string, boolean>;
  setState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  disabled?: boolean;
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between"
      sx={{ p: 1.5, border: '1px solid #EDEFF3', borderRadius: 1, background: '#FFFFFF', opacity: disabled ? 0.5 : 1 }}>
      <div>
        <Typography variant="body2" fontWeight={600}>{t.label}<FieldHint text={t.hint} /></Typography>
      </div>
      <FormControlLabel control={<Switch disabled={disabled} checked={!!state[t.key]}
        onChange={(_, c) => setState((s) => ({ ...s, [t.key]: c }))} />} label="" />
    </Stack>
  );
}

function NumField({ label, value, setValue }: { label: string; value: number; setValue: (n: number) => void }) {
  return (
    <>
      <Typography variant="body2" fontWeight={600} mb={0.5}>{label}</Typography>
      <TextField type="number" size="small" fullWidth value={value} onChange={(e) => setValue(+e.target.value)} />
    </>
  );
}

function SelField({ label, value, setValue, options }: { label: string; value: string; setValue: (v: string) => void; options: string[] }) {
  return (
    <>
      <Typography variant="body2" fontWeight={600} mb={0.5}>{label}</Typography>
      <TextField select size="small" fullWidth value={value} onChange={(e) => setValue(e.target.value)}>
        {options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </TextField>
    </>
  );
}
