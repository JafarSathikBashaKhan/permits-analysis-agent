import { Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { PageHeader } from '../../shared/PageHeader';
import { zones } from '../../data/mock';

export function ZonesPage() {
  return (
    <>
      <PageHeader eyebrow="Area" title="Zones" description="Groupings of streets used for permit management. Only published zones are active."
        actions={<Button variant="contained" startIcon={<Add />}>New zone</Button>} />
      <Grid container spacing={2.5}>
        {zones.map((z) => (
          <Grid item xs={12} sm={6} md={4} key={z.code}>
            <Paper sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <div>
                  <Typography variant="body2" color="text.secondary">{z.code}</Typography>
                  <Typography sx={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: '1.2rem', fontWeight: 600, mt: 0.5 }}>{z.name}</Typography>
                </div>
                <Chip label={z.published ? 'Published' : 'Draft'} size="small" color={z.published ? 'success' : 'default'} />
              </Stack>
              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <div>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Streets</Typography>
                  <Typography sx={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: '1.5rem', fontWeight: 600 }}>{z.streets}</Typography>
                </div>
                <div>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Permissions</Typography>
                  <Typography sx={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: '1.5rem', fontWeight: 600 }}>{z.permissions}</Typography>
                </div>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button size="small" variant="outlined">Edit</Button>
                <Button size="small" variant="text">{z.published ? 'Unpublish' : 'Publish'}</Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
