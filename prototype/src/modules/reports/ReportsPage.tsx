import { Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { AttachMoney, Description, LocalGasStation, Download } from '@mui/icons-material';
import { PageHeader } from '../../shared/PageHeader';

const REPORTS = [
  { icon: <Description fontSize="large" />, title: 'Application NFI Report', desc: 'Lists all applications awaiting further information from the applicant.', frequency: 'Refreshed hourly' },
  { icon: <AttachMoney fontSize="large" />, title: 'Financial Income Report', desc: 'Revenue by permission type, zone and period, including admin fees and VAT.', frequency: 'Refreshed daily at 02:00' },
  { icon: <LocalGasStation fontSize="large" />, title: 'Diesel Surcharge Report', desc: 'Diesel surcharge collected, split by permission and zone.', frequency: 'Refreshed weekly' },
];

export function ReportsPage() {
  return (
    <>
      <PageHeader eyebrow="Insights" title="Reports" description="Download the core operational and financial reports for the contract." />
      <Grid container spacing={2.5}>
        {REPORTS.map((r) => (
          <Grid item xs={12} md={4} key={r.title}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Stack spacing={1.5} height="100%">
                <div style={{ color: '#E77E08' }}>{r.icon}</div>
                <Typography sx={{ fontFamily: '"Roboto Slab", Georgia, serif', fontSize: '1.3rem', fontWeight: 600 }}>{r.title}</Typography>
                <Typography variant="body2" color="text.secondary" flex={1}>{r.desc}</Typography>
                <Typography variant="caption" color="text.secondary">{r.frequency}</Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" startIcon={<Download />}>Download CSV</Button>
                  <Button variant="outlined">Preview</Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
