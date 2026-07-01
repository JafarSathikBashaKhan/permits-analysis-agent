import { Box, Button, Divider, Grid, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { ArrowBack, Cancel, CheckCircle, Pause, Undo } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../shared/PageHeader';
import { Section } from '../../shared/Section';
import { StatusChip } from '../../shared/StatusChip';
import { applications } from '../../data/mock';

const TABS = ['Overview', 'Vehicles', 'Documents', 'Notes', 'Emails', 'Zones', 'History'];

export function ApplicationDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const app = applications.find((a) => a.id === id) ?? applications[0];
  const [tab, setTab] = useState(0);

  return (
    <>
      <Button startIcon={<ArrowBack />} onClick={() => nav('/applications')} sx={{ mb: 1 }}>All applications</Button>
      <PageHeader
        eyebrow={`Application · ${app.ref}`}
        title={app.applicant}
        description={app.permission}
        actions={<Stack direction="row" spacing={1}>
          <Button color="success" variant="contained" startIcon={<CheckCircle />}>Approve</Button>
          <Button color="error" variant="outlined" startIcon={<Cancel />}>Reject</Button>
          <Button color="warning" variant="outlined" startIcon={<Pause />}>On hold</Button>
          <Button variant="outlined" startIcon={<Undo />}>Suspend</Button>
        </Stack>}
      />

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={3}>
          <Fact label="Status" value={<StatusChip status={app.status} />} />
          <Fact label="Zone" value={app.zone} />
          <Fact label="Submitted" value={app.submitted} />
          <Fact label="Amount" value={`£${app.amount.toFixed(2)}`} />
          <Fact label="Assigned to" value={app.assignedTo} />
        </Grid>
      </Paper>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
          {TABS.map((t) => <Tab key={t} label={t} />)}
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Section title="Applicant" description="Contact details and address for this application.">
              <Grid container spacing={2}>
                <Fact label="Full name" value={app.applicant} />
                <Fact label="Email" value={app.applicant.toLowerCase().replace(/[^a-z]/g, '.') + '@example.co.uk'} />
                <Fact label="Phone" value="+44 7700 900123" />
                <Fact label="Address" value="Flat 12, Riverside Walk, City Centre, CC1 3AA" />
              </Grid>
            </Section>
            <Section title="Permit summary">
              <Grid container spacing={2}>
                <Fact label="Permission" value={app.permission} />
                <Fact label="Reference" value={app.ref} />
                <Fact label="Valid from" value="2026-07-01" />
                <Fact label="Valid to" value="2027-06-30" />
              </Grid>
            </Section>
          </Grid>
          <Grid item xs={12} md={4}>
            <Section title="Timeline">
              <Stack spacing={1}>
                {['Submitted', 'Under Review', 'Approved', 'Payment', 'Active'].map((step, i) => (
                  <Box key={step}>
                    <Typography variant="body2" fontWeight={600}>{step}</Typography>
                    <Typography variant="body2" color="text.secondary">{i === 0 ? app.submitted : '—'}</Typography>
                    {i < 4 && <Divider sx={{ mt: 1 }} />}
                  </Box>
                ))}
              </Stack>
            </Section>
          </Grid>
        </Grid>
      )}
      {tab !== 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">The <b>{TABS[tab]}</b> tab is a placeholder in this prototype.</Typography>
        </Paper>
      )}
    </>
  );
}

function Fact({ label, value }: { label: string; value: any }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</Typography>
      <Typography>{value}</Typography>
    </Grid>
  );
}
