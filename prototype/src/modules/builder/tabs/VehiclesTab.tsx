import { Alert, Checkbox, FormControlLabel, Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Section } from '../../../shared/Section';
import { FieldHint } from '../../../shared/FieldHint';

const FIELDS = [
  'VRM (registration)', 'Make', 'Model', 'Colour', 'Fuel type', 'CO₂ emissions', 'Euro standard', 'Body type', 'Year',
];

export function VehiclesTab() {
  const [required, setRequired] = useState<string[]>(['VRM (registration)', 'Make', 'Model', 'Colour', 'Fuel type']);
  const [autoguru, setAutoguru] = useState(true);
  const [tempAllowed, setTempAllowed] = useState(3);

  const toggle = (f: string) => setRequired((r) => r.includes(f) ? r.filter((x) => x !== f) : [...r, f]);

  return (
    <>
      <Alert severity="info" sx={{ mb: 3, background: '#F4F1E8', border: '1px solid #E4E1D8', color: 'text.primary' }}>
        Choose which vehicle fields applicants must provide and whether Autoguru VRM lookup is enabled.
      </Alert>

      <Section title="Required vehicle fields" description="These fields will be mandatory in Buy Now and in Back Office vehicle entry.">
        <Grid container spacing={1}>
          {FIELDS.map((f) => (
            <Grid item xs={12} md={4} key={f}>
              <FormControlLabel control={<Checkbox checked={required.includes(f)} onChange={() => toggle(f)} />} label={f} />
            </Grid>
          ))}
        </Grid>
      </Section>

      <Section title="Lookup & temporaries">
        <Stack spacing={2}>
          <FormControlLabel control={<Checkbox checked={autoguru} onChange={(_, c) => setAutoguru(c)} />} label={<>Enable Autoguru VRM lookup<FieldHint text="Pre-fills make, model, colour, CO₂ and euro standard from the DVLA/Autoguru API." /></>} />
          <div>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Temporary vehicles allowed per permit<FieldHint text="Number of times a permit holder can swap in a temporary vehicle (e.g. courtesy car)." /></Typography>
            <TextField type="number" value={tempAllowed} onChange={(e) => setTempAllowed(+e.target.value)} inputProps={{ min: 0, max: 20 }} sx={{ maxWidth: 200 }} />
          </div>
        </Stack>
      </Section>
    </>
  );
}
