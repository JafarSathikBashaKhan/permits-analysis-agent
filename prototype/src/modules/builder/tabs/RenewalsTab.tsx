import { Alert, FormControlLabel, Grid, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Section } from '../../../shared/Section';
import { FieldHint } from '../../../shared/FieldHint';

export function RenewalsTab() {
  const [enabled, setEnabled] = useState(true);
  const [autoRenew, setAutoRenew] = useState(false);
  const [renewalWindow, setRenewalWindow] = useState(30);
  const [reminderDays, setReminderDays] = useState(14);
  const [maxRenewals, setMaxRenewals] = useState<'unlimited' | 'limited'>('unlimited');
  const [maxCount, setMaxCount] = useState(3);

  return (
    <>
      <Section title="Renewals">
        <Stack spacing={2}>
          <FormControlLabel control={<Switch checked={enabled} onChange={(_, c) => setEnabled(c)} />} label="Allow renewals for this permission" />
          {enabled && (
            <FormControlLabel control={<Switch checked={autoRenew} onChange={(_, c) => setAutoRenew(c)} />} label={<>Auto-renew when a valid payment method is on file<FieldHint text="Applicants can still opt out from their portal at any time." /></>} />
          )}
        </Stack>
      </Section>

      {enabled && (
        <Section title="Renewal window">
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" fontWeight={600} mb={0.5}>Renewal window (days before expiry)<FieldHint text="How many days before expiry the renewal option appears to the applicant." /></Typography>
              <TextField type="number" value={renewalWindow} onChange={(e) => setRenewalWindow(+e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" fontWeight={600} mb={0.5}>Reminder email (days before expiry)</Typography>
              <TextField type="number" value={reminderDays} onChange={(e) => setReminderDays(+e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" fontWeight={600} mb={0.5}>Renewal cap</Typography>
              <TextField select value={maxRenewals} onChange={(e) => setMaxRenewals(e.target.value as any)}>
                <MenuItem value="unlimited">Unlimited</MenuItem>
                <MenuItem value="limited">Limit renewals</MenuItem>
              </TextField>
            </Grid>
            {maxRenewals === 'limited' && (
              <Grid item xs={12} md={4}>
                <Typography variant="body2" fontWeight={600} mb={0.5}>Maximum renewals</Typography>
                <TextField type="number" value={maxCount} onChange={(e) => setMaxCount(+e.target.value)} inputProps={{ min: 1, max: 99 }} />
              </Grid>
            )}
          </Grid>
          <Alert severity="info" sx={{ mt: 2 }}>Renewal reminders are sent via the <b>Renewal Reminder</b> email template configured under Templates.</Alert>
        </Section>
      )}
    </>
  );
}
