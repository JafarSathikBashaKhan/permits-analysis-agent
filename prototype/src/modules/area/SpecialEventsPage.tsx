import { Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { Add, Event } from '@mui/icons-material';
import { PageHeader } from '../../shared/PageHeader';

const EVENTS = [
  { name: 'City Marathon', from: '2026-04-12', to: '2026-04-12', permissions: 3, zones: 2, status: 'Published' },
  { name: 'Summer Festival', from: '2026-07-18', to: '2026-07-20', permissions: 5, zones: 4, status: 'Published' },
  { name: 'Christmas Market', from: '2026-11-28', to: '2026-12-24', permissions: 2, zones: 1, status: 'Draft' },
  { name: 'New Year Fireworks', from: '2026-12-31', to: '2027-01-01', permissions: 4, zones: 3, status: 'Draft' },
];

export function SpecialEventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Area"
        title="Special Events"
        description="Configure calendar dates that restrict when event-only permissions are valid."
        actions={<Button variant="contained" startIcon={<Add />}>New event</Button>}
      />
      <Grid container spacing={2.5}>
        {EVENTS.map((e) => (
          <Grid item xs={12} md={6} lg={4} key={e.name}>
            <Paper sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack direction="row" spacing={1.5}>
                  <Event color="primary" />
                  <div>
                    <Typography sx={{ fontFamily: '"Roboto Slab", Georgia, serif', fontSize: '1.15rem', fontWeight: 600 }}>{e.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{e.from} → {e.to}</Typography>
                  </div>
                </Stack>
                <Chip label={e.status} size="small" color={e.status === 'Published' ? 'success' : 'default'} />
              </Stack>
              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <div>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Permissions</Typography>
                  <Typography sx={{ fontFamily: '"Roboto Slab", Georgia, serif', fontSize: '1.4rem', fontWeight: 600 }}>{e.permissions}</Typography>
                </div>
                <div>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Zones</Typography>
                  <Typography sx={{ fontFamily: '"Roboto Slab", Georgia, serif', fontSize: '1.4rem', fontWeight: 600 }}>{e.zones}</Typography>
                </div>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button size="small" variant="outlined">Edit</Button>
                <Button size="small">Duplicate</Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
