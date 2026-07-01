import { Alert, Button, FormControlLabel, Grid, InputAdornment, Paper, Stack, Switch, TextField, Typography } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { Section } from '../../../shared/Section';
import { FieldHint } from '../../../shared/FieldHint';

type Tier = { minProps: number; maxProps: number; price: number };

export function PricingTab() {
  const [basePrice, setBasePrice] = useState('120.00');
  const [tierPricing, setTierPricing] = useState(true);
  const [dieselSurcharge, setDieselSurcharge] = useState(true);
  const [surcharge, setSurcharge] = useState('30.00');
  const [tiers, setTiers] = useState<Tier[]>([
    { minProps: 1, maxProps: 5, price: 120 },
    { minProps: 6, maxProps: 20, price: 100 },
    { minProps: 21, maxProps: 99, price: 80 },
  ]);

  return (
    <>
      <Section title="Base price">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Standard price</Typography>
            <TextField value={basePrice} onChange={(e) => setBasePrice(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">£</InputAdornment> }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <FormControlLabel control={<Switch checked={tierPricing} onChange={(_, c) => setTierPricing(c)} />} label={<>Enable tier pricing<FieldHint text="Price varies by the number of permits already issued for a property." /></>} />
            <FormControlLabel control={<Switch checked={dieselSurcharge} onChange={(_, c) => setDieselSurcharge(c)} />} label={<>Apply diesel surcharge<FieldHint text="Adds a fixed amount for diesel vehicles at checkout." /></>} />
          </Grid>
        </Grid>
      </Section>

      {tierPricing && (
        <Section title="Tiered pricing" description="Applies per property count." actions={<Button startIcon={<Add />} variant="outlined" size="small" onClick={() => setTiers((t) => [...t, { minProps: 0, maxProps: 0, price: 0 }])}>Add tier</Button>}>
          <Stack spacing={1.5}>
            {tiers.map((t, i) => (
              <Paper key={i} sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}><TextField label="Min properties" type="number" value={t.minProps} onChange={(e) => setTiers((old) => old.map((r, ri) => ri === i ? { ...r, minProps: +e.target.value } : r))} /></Grid>
                  <Grid item xs={12} md={3}><TextField label="Max properties" type="number" value={t.maxProps} onChange={(e) => setTiers((old) => old.map((r, ri) => ri === i ? { ...r, maxProps: +e.target.value } : r))} /></Grid>
                  <Grid item xs={12} md={3}><TextField label="Price" value={t.price} onChange={(e) => setTiers((old) => old.map((r, ri) => ri === i ? { ...r, price: +e.target.value } : r))} InputProps={{ startAdornment: <InputAdornment position="start">£</InputAdornment> }} /></Grid>
                  <Grid item xs={12} md={3}><Button color="error" startIcon={<Delete />} onClick={() => setTiers((old) => old.filter((_, ri) => ri !== i))}>Remove</Button></Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        </Section>
      )}

      {dieselSurcharge && (
        <Section title="Diesel surcharge">
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" fontWeight={600} mb={0.5}>Surcharge amount</Typography>
              <TextField value={surcharge} onChange={(e) => setSurcharge(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">£</InputAdornment> }} />
            </Grid>
          </Grid>
          <Alert severity="info" sx={{ mt: 2 }}>Diesel surcharge is applied to the calculated price at checkout for any vehicle whose fuel type is diesel.</Alert>
        </Section>
      )}
    </>
  );
}
