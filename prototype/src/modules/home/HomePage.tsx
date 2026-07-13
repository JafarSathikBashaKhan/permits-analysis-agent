import { Box, Chip, Divider, Grid, LinearProgress, Paper, Stack, Typography, Button } from '@mui/material';
import { NorthEast, TrendingUp, TrendingDown, ArrowForward, DescriptionOutlined, EventRepeatOutlined, PaidOutlined, TaskAltOutlined, HourglassEmptyOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { PageHeader } from '../../shared/PageHeader';
import { tokens } from '../../theme';
import { applications, kpis } from '../../data/mock';
import { StatusChip } from '../../shared/StatusChip';

function KpiCard({ icon, label, value, delta, tone = 'info' }: { icon: React.ReactNode; label: string; value: React.ReactNode; delta?: string; tone?: 'up' | 'down' | 'info' }) {
  return (
    <Paper sx={{ p: 2.5, height: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Box sx={{ p: 1, borderRadius: 1, bgcolor: `${tokens.NAVY}0F`, color: tokens.NAVY, display: 'inline-flex' }}>{icon}</Box>
        {delta && (
          <Chip
            size="small"
            icon={tone === 'down' ? <TrendingDown fontSize="small" /> : <TrendingUp fontSize="small" />}
            label={delta}
            sx={{ bgcolor: tone === 'down' ? '#F7DBDB' : '#DDECE1', color: tone === 'down' ? '#8C1F1F' : '#255C3B' }}
          />
        )}
      </Stack>
      <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ fontFamily: '"Open Sans", Georgia, serif', fontSize: '2rem', fontWeight: 600, lineHeight: 1.1, mt: 0.5 }}>{value}</Typography>
    </Paper>
  );
}

export function HomePage() {
  const recent = applications.slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Good afternoon, Jafar"
        description="A summary of what's happening across the AutomationApplyIQ contract today."
        actions={
          <>
            <Button variant="outlined" color="primary" component={RouterLink} to="/applications">Open work queue</Button>
            <Button variant="contained" color="primary" component={RouterLink} to="/builder">New permission</Button>
          </>
        }
      />

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={2.4}>
          <KpiCard icon={<TaskAltOutlined />} label="Active permits" value={kpis.activePermits.toLocaleString('en-GB')} delta="+3.2%" tone="up" />
        </Grid>
        <Grid item xs={12} md={6} lg={2.4}>
          <KpiCard icon={<HourglassEmptyOutlined />} label="Pending approval" value={kpis.pendingApproval} delta="+5" tone="down" />
        </Grid>
        <Grid item xs={12} md={6} lg={2.4}>
          <KpiCard icon={<PaidOutlined />} label="Awaiting payment" value={kpis.awaitingPayment} />
        </Grid>
        <Grid item xs={12} md={6} lg={2.4}>
          <KpiCard icon={<EventRepeatOutlined />} label="Upcoming renewals" value={kpis.upcomingRenewals} delta="7 days" />
        </Grid>
        <Grid item xs={12} md={6} lg={2.4}>
          <KpiCard icon={<DescriptionOutlined />} label="Applications (Jun)" value={kpis.applicationsThisMonth} delta="+12%" tone="up" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Box>
                <Typography variant="h4">Recent applications</Typography>
                <Typography variant="body2" color="text.secondary">Latest submissions across all permit types.</Typography>
              </Box>
              <Button component={RouterLink} to="/applications" endIcon={<ArrowForward />} size="small">View all</Button>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            <Stack divider={<Divider />}>
              {recent.map((a) => (
                <Box key={a.id} component={RouterLink} to={`/applications/${a.id}`} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, textDecoration: 'none', color: 'inherit', '&:hover': { bgcolor: `${tokens.NAVY}05` } }}>
                  <Box sx={{ width: 96 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{a.ref}</Typography>
                    <Typography variant="caption" color="text.secondary">{a.submitted}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{a.applicant}</Typography>
                    <Typography variant="caption" color="text.secondary">{a.permission} · {a.zone}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ width: 84, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>£{a.amount}</Typography>
                  <Box sx={{ width: 160, display: 'flex', justifyContent: 'flex-end' }}>
                    <StatusChip status={a.status} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" mb={1.5}>Weekly workload</Typography>
            {[
              { label: 'Approvals', value: 68, cap: 100 },
              { label: 'Reviews', value: 41, cap: 60 },
              { label: 'Renewals', value: 29, cap: 80 },
              { label: 'Print queue', value: 12, cap: 30 },
            ].map((r) => (
              <Box key={r.label} sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">{r.label}</Typography>
                  <Typography variant="body2" color="text.secondary">{r.value} / {r.cap}</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={(r.value / r.cap) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: `${tokens.NAVY}10`, '& .MuiLinearProgress-bar': { bgcolor: tokens.ORANGE } }} />
              </Box>
            ))}
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" mb={1}>Notices</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>Items that need your attention.</Typography>
            <Stack spacing={1.5}>
              {[
                { title: '3 permits expire tomorrow', body: 'Auto-renew is disabled for 2 of them.', tone: '#FBE9BE' },
                { title: 'Payment gateway health OK', body: 'Last sync 2 minutes ago.', tone: '#DDECE1' },
                { title: 'New MoM published', body: '29-06 Southend Visitor Scratchcards.', tone: '#DEE7F4' },
              ].map((n, i) => (
                <Box key={i} sx={{ p: 1.5, borderRadius: 1, bgcolor: n.tone }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{n.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{n.body}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
