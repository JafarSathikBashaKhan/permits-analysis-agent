import { Button, FormControlLabel, Grid, InputAdornment, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
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
    ],
  },
  {
    title: 'Vehicles & pricing',
    description: 'Behaviour used in Buy Now and application review.',
    toggles: [
      { key: 'dieselSurcharge', label: 'Enable diesel surcharge', hint: 'Adds diesel surcharge to relevant permissions.', defaultOn: true },
      { key: 'tierPricing', label: 'Enable tier pricing', hint: 'Permits can charge by number of properties.', defaultOn: true },
      { key: 'experian', label: 'Experian vehicle check', hint: 'Runs an Experian score at VRM entry.' },
    ],
  },
  {
    title: 'Channels & notifications',
    description: 'How you communicate with applicants.',
    toggles: [
      { key: 'sms', label: 'SMS notifications', hint: 'Sends key updates via SMS in addition to email.' },
      { key: 'visitorPortal', label: 'Visitor portal', hint: 'Enables the visitor-facing portal for scratchcard purchase.', defaultOn: true },
    ],
  },
];

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
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.5, border: '1px solid #E1E4E8', borderRadius: 1, background: '#FFFFFF' }}>
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

      <Section title="Policy URLs">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Data sharing policy URL</Typography>
            <TextField defaultValue="https://marston.co.uk/policies/data-sharing" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Cookie policy URL</Typography>
            <TextField defaultValue="https://marston.co.uk/policies/cookies" />
          </Grid>
        </Grid>
      </Section>
    </>
  );
}
