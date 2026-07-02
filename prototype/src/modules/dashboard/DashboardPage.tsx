import {
  Box, Grid, Paper, Stack, Tab, Tabs, Typography, MenuItem, Select, Link,
} from '@mui/material';
import { ArrowForward, ChevronRight } from '@mui/icons-material';
import { useState } from 'react';
import { PageHeader } from '../../shared/PageHeader';
import { tokens } from '../../theme';

type Range = 'today' | 'week' | 'month';

const kpis = [
  { label: 'Permit',       value: 0, delta: 0 },
  { label: 'Suspension',   value: 0, delta: 0 },
  { label: 'Dispensation', value: 0, delta: 0 },
];

const applicantSegments = [
  { label: 'Active',               value: 0, color: '#266798' },
  { label: 'Verification Pending', value: 1, color: '#E91E63' },
  { label: 'Deactivated',          value: 0, color: '#FFCCBC' },
];

export function DashboardPage() {
  const [tab, setTab] = useState<'apps' | 'finance'>('apps');
  const [approvedRange, setApprovedRange] = useState<Range>('today');
  const [renewalRange, setRenewalRange] = useState<'7' | '14' | '30'>('7');
  const [statusRange, setStatusRange] = useState<Range>('today');

  return (
    <>
      <PageHeader title="Dashboard" />

      <Paper sx={{ mb: 2.5 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Applications" value="apps" />
          <Tab label="Finance" value="finance" />
        </Tabs>
      </Paper>

      {tab === 'apps' && (
        <ApplicationsDashboard
          approvedRange={approvedRange} setApprovedRange={setApprovedRange}
          renewalRange={renewalRange} setRenewalRange={setRenewalRange}
          statusRange={statusRange} setStatusRange={setStatusRange}
        />
      )}
      {tab === 'finance' && <FinancePlaceholder />}
    </>
  );
}

function ApplicationsDashboard(props: {
  approvedRange: Range; setApprovedRange: (v: Range) => void;
  renewalRange: '7' | '14' | '30'; setRenewalRange: (v: '7' | '14' | '30') => void;
  statusRange: Range; setStatusRange: (v: Range) => void;
}) {
  return (
    <Stack spacing={2.5}>
      <Box>
        <SectionTitle>Active Applications</SectionTitle>
        <Grid container spacing={2.5}>
          {kpis.map((k) => (
            <Grid item xs={12} sm={6} md={4} key={k.label}>
              <KpiCard label={k.label} value={k.value} delta={k.delta} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <PanelCard
            title="Approved"
            action={<RangeSelect value={props.approvedRange} onChange={props.setApprovedRange} />}
            footer={<FooterStat label="Total Approved" value={0} />}
          >
            <EmptyState message="No Approved Applications Found" />
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <PanelCard
            title="Waiting for Approval"
            footer={<FooterStat label="Total Waiting for Approval" value={0} />}
          >
            <EmptyState message="0 Pending Approvals" />
          </PanelCard>
        </Grid>
      </Grid>

      <PanelCard
        title="Upcoming Renewals"
        action={
          <Select
            size="small"
            value={props.renewalRange}
            onChange={(e) => props.setRenewalRange(e.target.value as any)}
            sx={{ minWidth: 140, bgcolor: '#FFF' }}
          >
            <MenuItem value="7">Next 7 Days</MenuItem>
            <MenuItem value="14">Next 14 Days</MenuItem>
            <MenuItem value="30">Next 30 Days</MenuItem>
          </Select>
        }
      >
        <EmptyState message="No upcoming renewals found for the selected period." minHeight={280} />
      </PanelCard>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
          <PanelCard
            title="Application Status"
            action={<RangeSelect value={props.statusRange} onChange={props.setStatusRange} />}
          >
            <EmptyState message="No Data Available" minHeight={260} />
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <PanelCard
            title="Applicants"
            action={
              <Link component="button" underline="none" sx={{ display: 'inline-flex', alignItems: 'center', color: tokens.NAVY, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                View Report <ChevronRight fontSize="small" />
              </Link>
            }
          >
            <ApplicantsDonut />
          </PanelCard>
        </Grid>
      </Grid>
    </Stack>
  );
}

function FinancePlaceholder() {
  return (
    <PanelCard title="Finance">
      <EmptyState message="Finance dashboard is not available in this prototype." minHeight={320} />
    </PanelCard>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.25rem', color: tokens.INK, mb: 1.5 }}>
      {children}
    </Typography>
  );
}

function KpiCard({ label, value, delta }: { label: string; value: number; delta: number }) {
  const positive = delta > 0;
  const zero = delta === 0;
  const color = zero ? tokens.MUTED : positive ? '#2E7D32' : '#C62828';
  return (
    <Paper sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 600, fontSize: '1.05rem', color: tokens.INK }}>
          {label}
        </Typography>
        <Stack alignItems="flex-end" sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography sx={{ fontSize: '0.85rem', color, fontWeight: 600 }}>{delta}%</Typography>
            <ArrowForward sx={{ fontSize: 16, color }} />
          </Stack>
          <Typography sx={{ fontSize: '0.72rem', color: tokens.MUTED }}>from last month</Typography>
        </Stack>
      </Stack>
      <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '2.75rem', color: tokens.INK, lineHeight: 1.1, mt: 1.5 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function PanelCard({
  title, action, children, footer,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', minHeight: 320 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.05rem', color: tokens.INK }}>
          {title}
        </Typography>
        {action}
      </Stack>
      <Box sx={{ px: 3, py: 1, flex: 1, display: 'flex' }}>{children}</Box>
      {footer && (
        <Box sx={{ px: 3, py: 1.5, borderTop: `1px solid ${tokens.LINE}` }}>
          {footer}
        </Box>
      )}
    </Paper>
  );
}

function RangeSelect({ value, onChange }: { value: Range; onChange: (v: Range) => void }) {
  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value as Range)}
      sx={{ minWidth: 120, bgcolor: '#FFF' }}
    >
      <MenuItem value="today">Today</MenuItem>
      <MenuItem value="week">This Week</MenuItem>
      <MenuItem value="month">This Month</MenuItem>
    </Select>
  );
}

function EmptyState({ message, minHeight = 200 }: { message: string; minHeight?: number }) {
  return (
    <Box sx={{ flex: 1, minHeight, display: 'grid', placeItems: 'center' }}>
      <Typography sx={{ color: tokens.MUTED, fontSize: '0.9rem' }}>{message}</Typography>
    </Box>
  );
}

function FooterStat({ label, value }: { label: string; value: number }) {
  return (
    <Typography sx={{ fontSize: '0.85rem', color: tokens.INK }}>
      {label} - <Box component="span" sx={{ fontWeight: 700 }}>{value}</Box>
    </Typography>
  );
}

function ApplicantsDonut() {
  const size = 180;
  const stroke = 26;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = applicantSegments.reduce((sum, s) => sum + s.value, 0) || 1;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const arcs = applicantSegments.map((s) => {
    const length = (s.value / total) * circumference;
    const dashArray = `${length} ${circumference - length}`;
    const el = (
      <circle
        key={s.label}
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={s.color}
        strokeWidth={stroke}
        strokeDasharray={dashArray}
        strokeDashoffset={-offset}
      />
    );
    offset += length;
    return el;
  });

  return (
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {arcs}
      </svg>
      <Stack spacing={1.5} sx={{ flex: 1 }}>
        {applicantSegments.map((s) => {
          const pct = Math.round((s.value / total) * 100);
          return (
            <Box key={s.label}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 12, height: 12, bgcolor: s.color, borderRadius: '2px' }} />
                <Typography sx={{ fontSize: '0.85rem', color: tokens.INK, fontWeight: 500 }}>{s.label}</Typography>
              </Stack>
              <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ ml: 2.5 }}>
                <Typography sx={{ fontFamily: tokens.HEADING, fontSize: '1.35rem', fontWeight: 700, color: tokens.INK }}>{s.value}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: tokens.MUTED }}>({pct}%)</Typography>
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
