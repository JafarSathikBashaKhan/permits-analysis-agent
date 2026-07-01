import { Alert, FormControlLabel, Grid, InputAdornment, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Section } from '../../../shared/Section';
import { FieldHint } from '../../../shared/FieldHint';
import { Permission } from '../../../data/mock';

export function GeneralSettingsTab({ permission }: { permission?: Permission }) {
  const [prefix, setPrefix] = useState(permission?.prefix ?? '');
  const [retention, setRetention] = useState<number>(90);
  const [adminFee, setAdminFee] = useState<string>('0.00');
  const [displayDesc, setDisplayDesc] = useState<string>('Purchase your permission with ease');
  const [startPolicy, setStartPolicy] = useState<string>('Same day');
  const [tsAndCs, setTsAndCs] = useState<string>('Standard T&Cs 2026');
  const [specialEvent, setSpecialEvent] = useState<'enable' | 'disable'>('disable');
  const [permitDays, setPermitDays] = useState<'enable' | 'disable'>('disable');
  const [toggles, setToggles] = useState({
    hoursOfOp: false, backOfficeUse: false, vat: false, requireIdCheck: false,
    allowVisitorScratchcards: false, appliesToBlueBadge: false, appliesToResidentBusiness: false,
  });

  const prefixValid = prefix === '' || /^[a-zA-Z][a-zA-Z0-9]*$/.test(prefix);
  const adminFeeNum = parseFloat(adminFee);
  const adminFeeError = !isNaN(adminFeeNum) && (adminFeeNum < 0 || adminFeeNum > 1000)
    ? 'Amount must be between 0 and 1000.' : '';

  return (
    <>
      <Alert severity="info" sx={{ mb: 3, background: '#F4F1E8', border: '1px solid #E4E1D8', color: 'text.primary' }}>
        Configure the general parameters used across the applicant portal and Back Office. Toggles marked with an <b>info</b> icon inherit from Contract Settings unless overridden.
      </Alert>

      <Section title="Identifiers & retention">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Prefix
              <FieldHint text="Unique alphanumeric prefix, up to 10 characters. Must start with a letter. Optional when saving as Draft; required to Publish." />
            </Typography>
            <TextField
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.slice(0, 10))}
              inputProps={{ maxLength: 10 }}
              error={!prefixValid}
              helperText={!prefixValid ? 'Alphanumeric only allowed' : `${prefix.length}/10`}
              placeholder="e.g. CCR"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Retention period (days)
              <FieldHint text="Number of days expired permits remain visible before being archived. Default 90 days. 0 = hide immediately on expiry." />
            </Typography>
            <TextField
              type="number"
              value={retention}
              onChange={(e) => setRetention(Math.max(0, parseInt(e.target.value || '0', 10)))}
              InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Admin fee
              <FieldHint text="Applied per permission at checkout. Range £0.00 – £1000.00 with two decimals." />
            </Typography>
            <TextField
              value={adminFee}
              onChange={(e) => setAdminFee(e.target.value)}
              error={!!adminFeeError}
              helperText={adminFeeError || 'Amount must be between 0 and 1000.'}
              InputProps={{ startAdornment: <InputAdornment position="start">£</InputAdornment> }}
            />
          </Grid>
        </Grid>
      </Section>

      <Section title="Applicant experience">
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Display description
              <FieldHint text="Shown at the top of the permission's Buy Now card. Up to 1000 characters." />
            </Typography>
            <TextField
              value={displayDesc}
              onChange={(e) => setDisplayDesc(e.target.value.slice(0, 1000))}
              multiline
              minRows={2}
              helperText={`${displayDesc.length}/1000`}
              inputProps={{ maxLength: 1000 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Start date policy
              <FieldHint text="Determines when a purchased permission becomes active. Sourced from the Start Date Policy library." />
            </Typography>
            <TextField select value={startPolicy} onChange={(e) => setStartPolicy(e.target.value)}>
              {['Same day', 'Next day', 'On approval', 'Applicant-selected date'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Terms &amp; conditions template
              <FieldHint text="The T&C document shown at checkout. Managed under Templates." />
            </Typography>
            <TextField select value={tsAndCs} onChange={(e) => setTsAndCs(e.target.value)}>
              {['Standard T&Cs 2026', 'Business T&Cs 2026', 'Blue Badge T&Cs'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Section>

      <Section title="Behaviour toggles">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ToggleRow
              label="Special Event"
              hint="Restrict this permission to event dates configured under Special Events."
              value={specialEvent === 'enable'}
              onChange={(v) => setSpecialEvent(v ? 'enable' : 'disable')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ToggleRow
              label="Permit days selection"
              hint="Allow applicants to pick specific weekdays their permit applies (e.g. Mon–Fri only)."
              value={permitDays === 'enable'}
              onChange={(v) => setPermitDays(v ? 'enable' : 'disable')}
            />
          </Grid>
          {[
            ['hoursOfOp', 'Hours of operation', 'Enforce start/end times each day the permit is valid.'],
            ['backOfficeUse', 'Back Office use only', 'Hide from Buy Now; only staff can create applications.'],
            ['vat', 'Charge VAT', 'Add UK VAT to the price. Rate inherited from Contract Settings.'],
            ['requireIdCheck', 'Require ID check', 'Prompt applicants to upload a valid ID at checkout.'],
            ['allowVisitorScratchcards', 'Allow visitor scratchcards', 'Include visitor books for holders of this permit.'],
            ['appliesToBlueBadge', 'Applies to Blue Badge', 'Blue Badge holders can apply for this permission.'],
          ].map(([key, label, hint]) => (
            <Grid item xs={12} md={6} key={key}>
              <ToggleRow label={label} hint={hint} value={(toggles as any)[key]} onChange={(v) => setToggles((t) => ({ ...t, [key]: v }))} />
            </Grid>
          ))}
        </Grid>
      </Section>
    </>
  );
}

function ToggleRow({ label, hint, value, onChange }: { label: string; hint: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.5, border: '1px solid #E4E1D8', borderRadius: 1, background: '#FFFFFF' }}>
      <div>
        <Typography variant="body2" fontWeight={600}>{label}<FieldHint text={hint} /></Typography>
      </div>
      <FormControlLabel control={<Switch checked={value} onChange={(_, c) => onChange(c)} color="primary" />} label="" />
    </Stack>
  );
}
