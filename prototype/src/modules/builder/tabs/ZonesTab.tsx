import { Alert, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useState } from 'react';
import { Section } from '../../../shared/Section';
import { zones } from '../../../data/mock';

export function ZonesTab() {
  const [selected, setSelected] = useState<string[]>(['Z-CC', 'Z-N1']);
  const toggle = (code: string) => setSelected((s) => s.includes(code) ? s.filter((x) => x !== code) : [...s, code]);

  return (
    <>
      <Alert severity="info" sx={{ mb: 3, background: '#FFF7EC', border: '1px solid #EDEFF3', color: 'text.primary' }}>
        Map the zones where this permission is valid. Only <b>published</b> zones can be selected.
      </Alert>

      <Section title="Available zones" description={`${selected.length} of ${zones.length} zones mapped`}>
        <Grid container spacing={2}>
          {zones.map((z) => {
            const isSelected = selected.includes(z.code);
            return (
              <Grid item xs={12} sm={6} md={4} key={z.code}>
                <Paper
                  onClick={() => toggle(z.code)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderColor: isSelected ? 'primary.main' : '#EDEFF3',
                    borderWidth: isSelected ? 2 : 1,
                    background: isSelected ? '#EEF2F8' : '#FFFFFF',
                    transition: 'all 120ms',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <div>
                      <Typography variant="body2" color="text.secondary">{z.code}</Typography>
                      <Typography sx={{ fontFamily: '"Open Sans", Georgia, serif', fontSize: '1.1rem', fontWeight: 600 }}>{z.name}</Typography>
                      <Typography variant="body2" color="text.secondary" mt={0.5}>{z.streets} streets · {z.permissions} permissions</Typography>
                    </div>
                    {isSelected && <CheckCircle color="primary" fontSize="small" />}
                  </Stack>
                  <Chip label={z.published ? 'Published' : 'Draft'} size="small" sx={{ mt: 1.5 }} />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Section>
    </>
  );
}
