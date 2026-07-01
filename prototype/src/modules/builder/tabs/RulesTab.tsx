import { Grid, TextField, Typography, MenuItem, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { Section } from '../../../shared/Section';
import { FieldHint } from '../../../shared/FieldHint';

export function RulesTab() {
  const [maxVehicles, setMaxVehicles] = useState(3);
  const [minDuration, setMinDuration] = useState(1);
  const [maxDuration, setMaxDuration] = useState(12);
  const [durationUnit, setDurationUnit] = useState('Months');
  const [permitLimit, setPermitLimit] = useState(2);

  return (
    <>
      <Section title="Vehicle & duration limits">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Maximum vehicles per permit<FieldHint text="How many vehicles may be linked to a single permit." /></Typography>
            <TextField type="number" value={maxVehicles} onChange={(e) => setMaxVehicles(+e.target.value)} inputProps={{ min: 1, max: 20 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Minimum duration</Typography>
            <TextField type="number" value={minDuration} onChange={(e) => setMinDuration(+e.target.value)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Maximum duration</Typography>
            <TextField type="number" value={maxDuration} onChange={(e) => setMaxDuration(+e.target.value)} InputProps={{ endAdornment: <InputAdornment position="end">
              <TextField select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value)} variant="standard" sx={{ minWidth: 90 }}>
                {['Days','Weeks','Months','Years'].map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
              </TextField>
            </InputAdornment> }} />
          </Grid>
        </Grid>
      </Section>

      <Section title="Property rules" description="Prevents abuse by capping permits per property.">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Permit limit per property<FieldHint text="0 – 99. Applications for a property that has reached this limit will be blocked." /></Typography>
            <TextField type="number" value={permitLimit} onChange={(e) => setPermitLimit(+e.target.value)} inputProps={{ min: 0, max: 99 }} />
          </Grid>
        </Grid>
      </Section>
    </>
  );
}
