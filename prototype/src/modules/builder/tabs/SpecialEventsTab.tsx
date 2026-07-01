import { Alert, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { Add, Delete, Event } from '@mui/icons-material';
import { useState } from 'react';
import { Section } from '../../../shared/Section';

type Ev = { name: string; from: string; to: string };

export function SpecialEventsTab() {
  const [events, setEvents] = useState<Ev[]>([
    { name: 'City Marathon', from: '2026-04-12', to: '2026-04-12' },
    { name: 'Summer Festival', from: '2026-07-18', to: '2026-07-20' },
  ]);

  return (
    <>
      <Alert severity="info" sx={{ mb: 3, background: '#FFF7EC', border: '1px solid #E1E4E8', color: 'text.primary' }}>
        Configure the calendar of event dates on which this permission is valid. Only used when the <b>Special Event</b> toggle is enabled in General Settings.
      </Alert>

      <Section title="Event calendar" actions={<Button startIcon={<Add />} variant="outlined" size="small" onClick={() => setEvents((e) => [...e, { name: '', from: '', to: '' }])}>Add event</Button>}>
        <Stack spacing={1.5}>
          {events.length === 0 && <Typography color="text.secondary">No events yet.</Typography>}
          {events.map((ev, i) => (
            <Paper key={i} sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}><TextField label="Event name" InputProps={{ startAdornment: <Event fontSize="small" color="disabled" style={{ marginRight: 8 }} /> }} value={ev.name} onChange={(e) => setEvents((old) => old.map((r, ri) => ri === i ? { ...r, name: e.target.value } : r))} /></Grid>
                <Grid item xs={6} md={3}><TextField label="From" type="date" InputLabelProps={{ shrink: true }} value={ev.from} onChange={(e) => setEvents((old) => old.map((r, ri) => ri === i ? { ...r, from: e.target.value } : r))} /></Grid>
                <Grid item xs={6} md={3}><TextField label="To" type="date" InputLabelProps={{ shrink: true }} value={ev.to} onChange={(e) => setEvents((old) => old.map((r, ri) => ri === i ? { ...r, to: e.target.value } : r))} /></Grid>
                <Grid item xs={12} md={1}><Button color="error" onClick={() => setEvents((old) => old.filter((_, ri) => ri !== i))}><Delete /></Button></Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
      </Section>
    </>
  );
}
