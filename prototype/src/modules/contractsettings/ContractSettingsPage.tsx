import { Alert, Button, Divider, FormControlLabel, Grid, InputAdornment, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';
import { useState } from 'react';
import { PageHeader } from '../../shared/PageHeader';
import { Section } from '../../shared/Section';
import { FieldHint } from '../../shared/FieldHint';

const TOGGLE_GROUPS: { title: string; description: string; toggles: { key: string; label: string; hint: string; defaultOn?: boolean }[] }[] = [
  {
    title: 'Address & identifiers',
    description: 'Behaviour of street and property references.',
    toggles: [
      { key: 'autoUsrn', label: 'Auto-generate USRN', hint: 'When on, USRN is generated automatically. When off, staff must enter it.', defaultOn: true },
      { key: 'autoUprn', label: 'Auto-generate UPRN', hint: 'Property reference generated automatically.', defaultOn: true },
    ],
  },
  {
    title: 'Applicant data',
    description: 'What is collected and shown for applicants.',
    toggles: [
      { key: 'dob', label: 'Capture date of birth', hint: 'Adds a DOB field to applicant registration.' },
      { key: 'blueBadge', label: 'Blue Badge support', hint: 'Enables the Blue Badge section on applicant profiles.', defaultOn: true },
      { key: 'redact', label: 'Redact sensitive fields in Back Office', hint: 'Hides sensitive PII by default.' },
      { key: 'autoActivateUsers', label: 'Auto-activate new users', hint: 'Newly invited users become active without manual approval.' },
    ],
  },
  {
    title: 'Vehicles & pricing',
    description: 'Behaviour used in Buy Now and application review.',
    toggles: [
      { key: 'dieselSurcharge', label: 'Enable diesel surcharge', hint: 'Adds diesel surcharge to relevant permissions.', defaultOn: true },
      { key: 'tierPricing', label: 'Enable tier pricing', hint: 'Permits can charge by number of properties.', defaultOn: true },
      { key: 'keepTierOriginal', label: 'Keep tier price at original rate', hint: 'Override to stop tier prices from changing at renewal.' },
      { key: 'experian', label: 'Experian vehicle check', hint: 'Runs an Experian score at VRM entry.' },
      { key: 'autoguru', label: 'Autoguru VRM lookup', hint: 'Autofills vehicle make/model/CO2 from VRM.', defaultOn: true },
    ],
  },
  {
    title: 'Vehicle attributes shown at capture',
    description: 'Which optional vehicle fields appear on Buy Now and Applications.',
    toggles: [
      { key: 'attrMake',     label: 'Vehicle Make',            hint: 'Show the Make field.',            defaultOn: true },
      { key: 'attrModel',    label: 'Vehicle Model',           hint: 'Show the Model field.',           defaultOn: true },
      { key: 'attrColor',    label: 'Vehicle Colour',          hint: 'Show the Colour field.' },
      { key: 'attrFuel',     label: 'Fuel Type',               hint: 'Show fuel type.' },
      { key: 'attrEngine',   label: 'Engine Size',             hint: 'Show engine size in cc.' },
      { key: 'attrEuro',     label: 'Euro Standard',           hint: 'Show Euro emissions standard.' },
      { key: 'attrCo2',      label: 'CO2 Emission',            hint: 'Show CO2 g/km.' },
      { key: 'attrSeats',    label: 'Number of Seats',         hint: 'Show number of seats.' },
      { key: 'attrTaxBand',  label: 'Number Plate Tax Band',   hint: 'Show tax band code.' },
      { key: 'attrFirstReg', label: 'First Date Registration', hint: 'Show first registration date.' },
      { key: 'attrType',     label: 'Vehicle Type',            hint: 'Show broad vehicle type.' },
    ],
  },
  {
    title: 'Channels & notifications',
    description: 'How you communicate with applicants.',
    toggles: [
      { key: 'sms', label: 'SMS notifications', hint: 'Sends key updates via SMS in addition to email.' },
      { key: 'emailComms', label: 'Email communications', hint: 'Sends transactional emails to applicants.', defaultOn: true },
      { key: 'visitorPortal', label: 'Visitor portal', hint: 'Enables the visitor-facing portal for scratchcard purchase.', defaultOn: true },
    ],
  },
  {
    title: 'MNPS module toggles',
    description: 'Enable/disable optional MNPS features.',
    toggles: [
      { key: 'pcn',         label: 'PCN integration',         hint: 'Enable Penalty Charge Notice integration.' },
      { key: 'fpn',         label: 'FPN integration',         hint: 'Enable Fixed Penalty Notice integration.' },
      { key: 'illumin8',    label: 'Illumin8',                hint: 'Enable Illumin8 back-office integration.' },
      { key: 'agentAssist', label: 'Agent Assist',            hint: 'Enable Agent Assist tooling.' },
      { key: 'printPartner',label: 'Print partner',           hint: 'Route physical permits to the print partner.', defaultOn: true },
    ],
  },
];

const PERIODS = ['Hours', 'Days', 'Weeks', 'Months', 'Years'];
const STREET_MODES = ['Manual Entry', 'System Street', 'Maps'];

export function ContractSettingsPage() {
  const [state, setState] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {};
    TOGGLE_GROUPS.forEach((g) => g.toggles.forEach((t) => { s[t.key] = !!t.defaultOn; }));
    return s;
  });
  const [adminFee, setAdminFee] = useState('3.50');
  const [priceAlert, setPriceAlert] = useState('10');
  const [tempVehicles, setTempVehicles] = useState(3);
  const [documentExpiry, setDocumentExpiry] = useState(90);

  // Purchase quantity limits (visitor)
  const [minVouchers, setMinVouchers] = useState(1);
  const [maxVouchers, setMaxVouchers] = useState(50);
  const [minScratchBooks, setMinScratchBooks] = useState(1);
  const [maxScratchBooks, setMaxScratchBooks] = useState(5);
  const [tempSwitches, setTempSwitches] = useState(3);

  // Pricing alert reminders
  const [rem1On, setRem1On] = useState(true);
  const [rem1Freq, setRem1Freq] = useState('30');
  const [rem1Period, setRem1Period] = useState('Days');
  const [rem2On, setRem2On] = useState(false);
  const [rem2Freq, setRem2Freq] = useState('7');
  const [rem2Period, setRem2Period] = useState('Days');
  const remindersDuplicate = rem1On && rem2On && rem1Freq === rem2Freq && rem1Period === rem2Period;

  // Suspension / Dispensation
  const [suspLimitOn, setSuspLimitOn] = useState(false);
  const [suspLimit, setSuspLimit] = useState(10);
  const [dispLimitOn, setDispLimitOn] = useState(false);
  const [dispLimit, setDispLimit] = useState(5);
  const [dispStreetMode, setDispStreetMode] = useState('Manual Entry');

  // Merchant settings (single permission type example)
  const [merchantPermType, setMerchantPermType] = useState('Resident Permit');
  const [boProv, setBoProv] = useState('Stripe');
  const [boId, setBoId] = useState('MERCH-BO-001');
  const [boUser, setBoUser] = useState('bo-merchant');
  const [custProv, setCustProv] = useState('Stripe');
  const [custId, setCustId] = useState('MERCH-CU-001');
  const [custUser, setCustUser] = useState('cust-merchant');

  return (
    <>
      <PageHeader eyebrow="Configuration" title="Contract Settings"
        description="Global switches and defaults for the entire contract. These affect every module."
        actions={<Button variant="contained" startIcon={<Save />}>Save changes</Button>} />

      {TOGGLE_GROUPS.map((g) => (
        <Section key={g.title} title={g.title} description={g.description}>
          <Grid container spacing={1.5}>
            {g.toggles.map((t) => (
              <Grid item xs={12} md={6} key={t.key}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.5, border: '1px solid #EDEFF3', borderRadius: 1, background: '#FFFFFF' }}>
                  <div>
                    <Typography variant="body2" fontWeight={600}>{t.label}<FieldHint text={t.hint} /></Typography>
                  </div>
                  <FormControlLabel control={<Switch checked={state[t.key]} onChange={(_, c) => setState((s) => ({ ...s, [t.key]: c }))} />} label="" />
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Section>
      ))}

      <Section title="Configuration values" description="Numeric defaults used across the app.">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Default admin fee</Typography>
            <TextField value={adminFee} onChange={(e) => setAdminFee(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">£</InputAdornment> }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Price alert threshold<FieldHint text="Warn staff when a permission price changes by more than this %." /></Typography>
            <TextField value={priceAlert} onChange={(e) => setPriceAlert(e.target.value)} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Temporary vehicles limit</Typography>
            <TextField type="number" value={tempVehicles} onChange={(e) => setTempVehicles(+e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Document expiry (days)</Typography>
            <TextField type="number" value={documentExpiry} onChange={(e) => setDocumentExpiry(+e.target.value)} />
          </Grid>
        </Grid>
      </Section>

      <Section title="Purchase quantity limits — visitor permits"
        description="Min/max caps enforced during Buy Now for visitor vouchers and scratch cards.">
        <Grid container spacing={2}>
          <Grid item xs={6} md={2.4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Min visitor vouchers</Typography>
            <TextField type="number" value={minVouchers} onChange={(e) => setMinVouchers(+e.target.value)} />
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Max visitor vouchers</Typography>
            <TextField type="number" value={maxVouchers} onChange={(e) => setMaxVouchers(+e.target.value)} />
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Min scratch card books</Typography>
            <TextField type="number" value={minScratchBooks} onChange={(e) => setMinScratchBooks(+e.target.value)} />
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Max scratch card books</Typography>
            <TextField type="number" value={maxScratchBooks} onChange={(e) => setMaxScratchBooks(+e.target.value)} />
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Temporary switches</Typography>
            <TextField type="number" value={tempSwitches} onChange={(e) => setTempSwitches(+e.target.value)} />
          </Grid>
        </Grid>
      </Section>

      <Section title="Pricing alert reminders"
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
        </Grid>
      </Section>

      <Section title="Suspension & dispensation limits"
        description="Optional per-street caps that stop over-suspending a single road.">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControlLabel control={<Switch checked={suspLimitOn} onChange={(_, c) => setSuspLimitOn(c)} />}
              label="Enforce max suspensions per street" />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Suspensions limit" size="small" type="number"
              value={suspLimit} onChange={(e) => setSuspLimit(+e.target.value)} disabled={!suspLimitOn} />
          </Grid>
          <Grid item xs={12}><Divider /></Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel control={<Switch checked={dispLimitOn} onChange={(_, c) => setDispLimitOn(c)} />}
              label="Enforce max dispensations per street" />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Dispensations limit" size="small" type="number"
              value={dispLimit} onChange={(e) => setDispLimit(+e.target.value)} disabled={!dispLimitOn} />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField label="Dispensation street selection" size="small" select fullWidth
              value={dispStreetMode} onChange={(e) => setDispStreetMode(e.target.value)}>
              {STREET_MODES.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Section>

      <Section title="Merchant settings"
        description="Payment gateway credentials — separate configuration for Back Office and Customer-facing checkout.">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField label="Permission Type" size="small" select fullWidth
              value={merchantPermType} onChange={(e) => setMerchantPermType(e.target.value)}>
              {['Resident Permit', 'Visitor Permit', 'Business Permit', 'Blue Badge'].map((p) =>
                <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}><Divider>Back Office Merchant</Divider></Grid>
          <Grid item xs={12} md={4}><TextField label="Provider"  size="small" fullWidth value={boProv} onChange={(e) => setBoProv(e.target.value)} /></Grid>
          <Grid item xs={12} md={4}><TextField label="Merchant ID" size="small" fullWidth value={boId} onChange={(e) => setBoId(e.target.value)} /></Grid>
          <Grid item xs={12} md={4}><TextField label="Merchant User" size="small" fullWidth value={boUser} onChange={(e) => setBoUser(e.target.value)} /></Grid>
          <Grid item xs={12}><Divider>Customer Merchant</Divider></Grid>
          <Grid item xs={12} md={4}><TextField label="Provider"  size="small" fullWidth value={custProv} onChange={(e) => setCustProv(e.target.value)} /></Grid>
          <Grid item xs={12} md={4}><TextField label="Merchant ID" size="small" fullWidth value={custId} onChange={(e) => setCustId(e.target.value)} /></Grid>
          <Grid item xs={12} md={4}><TextField label="Merchant User" size="small" fullWidth value={custUser} onChange={(e) => setCustUser(e.target.value)} /></Grid>
        </Grid>
      </Section>

      <Section title="Policy URLs">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Data sharing policy URL</Typography>
            <TextField defaultValue="https://marston.co.uk/policies/data-sharing" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Cookie policy URL</Typography>
            <TextField defaultValue="https://marston.co.uk/policies/cookies" fullWidth />
          </Grid>
        </Grid>
      </Section>
    </>
  );
}
