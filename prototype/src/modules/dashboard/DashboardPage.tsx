import {
  Box, Grid, Paper, Stack, Tab, Tabs, Typography, MenuItem, Select, Link,
} from '@mui/material';
import { ArrowForward, ChevronRight } from '@mui/icons-material';
import { useState } from 'react';
import { PageHeader } from '../../shared/PageHeader';
import { tokens } from '../../theme';

type Range = 'today' | 'week' | 'month';

const kpis = [
  { label: 'Permit',       value: 1287, delta: 12 },
  { label: 'Suspension',   value: 46,   delta: -3 },
  { label: 'Dispensation', value: 92,   delta: 4 },
];

const applicantSegments = [
  { label: 'Active',               value: 4210, color: '#266798' },
  { label: 'Verification Pending', value: 143,  color: '#E91E63' },
  { label: 'Deactivated',          value: 218,  color: '#FFCCBC' },
];

const renewalsByDay: Record<'7' | '14' | '30', { day: string; permit: number; suspension: number; dispensation: number }[]> = {
  '7': [
    { day: 'Mon', permit: 12, suspension: 2, dispensation: 3 },
    { day: 'Tue', permit: 18, suspension: 1, dispensation: 4 },
    { day: 'Wed', permit: 22, suspension: 4, dispensation: 6 },
    { day: 'Thu', permit: 15, suspension: 3, dispensation: 2 },
    { day: 'Fri', permit: 27, suspension: 5, dispensation: 7 },
    { day: 'Sat', permit: 9,  suspension: 1, dispensation: 1 },
    { day: 'Sun', permit: 6,  suspension: 0, dispensation: 2 },
  ],
  '14': Array.from({ length: 14 }, (_, i) => ({
    day: `D${i + 1}`, permit: 8 + Math.floor(Math.random() * 22),
    suspension: Math.floor(Math.random() * 6), dispensation: 1 + Math.floor(Math.random() * 8),
  })),
  '30': Array.from({ length: 30 }, (_, i) => ({
    day: `D${i + 1}`, permit: 4 + Math.floor(Math.random() * 26),
    suspension: Math.floor(Math.random() * 7), dispensation: Math.floor(Math.random() * 10),
  })),
};

const approvedByRange: Record<Range, number> = { today: 18, week: 96, month: 342 };
const waitingByRange = 27;
const statusBreakdown: Record<Range, { label: string; value: number; color: string }[]> = {
  today: [
    { label: 'Approved', value: 18, color: '#2E7D32' },
    { label: 'Pending',  value: 12, color: '#ED6C02' },
    { label: 'Rejected', value: 3,  color: '#C62828' },
    { label: 'On Hold',  value: 4,  color: '#0288D1' },
  ],
  week: [
    { label: 'Approved', value: 96, color: '#2E7D32' },
    { label: 'Pending',  value: 47, color: '#ED6C02' },
    { label: 'Rejected', value: 14, color: '#C62828' },
    { label: 'On Hold',  value: 21, color: '#0288D1' },
  ],
  month: [
    { label: 'Approved', value: 342, color: '#2E7D32' },
    { label: 'Pending',  value: 158, color: '#ED6C02' },
    { label: 'Rejected', value: 58,  color: '#C62828' },
    { label: 'On Hold',  value: 74,  color: '#0288D1' },
  ],
};

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
            footer={<FooterStat label="Total Approved" value={approvedByRange[props.approvedRange]} />}
          >
            <BigNumber value={approvedByRange[props.approvedRange]} caption={`Approved ${labelFor(props.approvedRange)}`} tone="#2E7D32" />
          </PanelCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <PanelCard
            title="Waiting for Approval"
            footer={<FooterStat label="Total Waiting for Approval" value={waitingByRange} />}
          >
            <BigNumber value={waitingByRange} caption="Pending review" tone="#ED6C02" />
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
        <RenewalsChart data={renewalsByDay[props.renewalRange]} />
      </PanelCard>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
          <PanelCard
            title="Application Status"
            action={<RangeSelect value={props.statusRange} onChange={props.setStatusRange} />}
          >
            <StatusBars data={statusBreakdown[props.statusRange]} />
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

function labelFor(r: Range) {
  return r === 'today' ? 'today' : r === 'week' ? 'this week' : 'this month';
}

function BigNumber({ value, caption, tone }: { value: number; caption: string; tone: string }) {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 3 }}>
      <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '3.5rem', color: tone, lineHeight: 1 }}>
        {value.toLocaleString()}
      </Typography>
      <Typography sx={{ mt: 1, color: tokens.MUTED, fontSize: '0.85rem' }}>{caption}</Typography>
    </Box>
  );
}

function RenewalsChart({ data }: { data: { day: string; permit: number; suspension: number; dispensation: number }[] }) {
  const width = 720, height = 240, padL = 32, padR = 12, padT = 16, padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const maxY = Math.max(...data.flatMap((d) => [d.permit, d.suspension, d.dispensation]), 10);
  const stepX = plotW / Math.max(data.length - 1, 1);
  const y = (v: number) => padT + plotH - (v / maxY) * plotH;
  const path = (key: 'permit' | 'suspension' | 'dispensation') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${padL + i * stepX} ${y(d[key])}`).join(' ');
  const series: [string, string, 'permit' | 'suspension' | 'dispensation'][] = [
    ['Permit', '#266798', 'permit'],
    ['Suspension', '#E91E63', 'suspension'],
    ['Dispensation', '#ED6C02', 'dispensation'],
  ];
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 1 }}>
      <Box sx={{ width: '100%', overflow: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="xMidYMid meet">
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line key={t} x1={padL} x2={padL + plotW} y1={padT + plotH * t} y2={padT + plotH * t}
              stroke={tokens.LINE} strokeDasharray="3 3" />
          ))}
          {series.map(([, color, k]) => (
            <path key={k} d={path(k)} fill="none" stroke={color} strokeWidth={2.5} />
          ))}
          {data.map((d, i) =>
            series.map(([, color, k]) => (
              <circle key={`${i}-${k}`} cx={padL + i * stepX} cy={y(d[k])} r={3} fill={color} />
            ))
          )}
          {data.map((d, i) => (
            <text key={i} x={padL + i * stepX} y={height - 8} textAnchor="middle"
              fontSize="10" fill={tokens.MUTED}>{d.day}</text>
          ))}
        </svg>
      </Box>
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 1 }}>
        {series.map(([label, color]) => (
          <Stack key={label} direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
            <Typography sx={{ fontSize: '0.8rem', color: tokens.INK }}>{label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

function StatusBars({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <Stack spacing={2} sx={{ flex: 1, justifyContent: 'center', py: 2, width: '100%' }}>
      {data.map((d) => (
        <Box key={d.label}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography sx={{ fontSize: '0.85rem', color: tokens.INK, fontWeight: 500 }}>{d.label}</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: tokens.INK, fontWeight: 700 }}>{d.value}</Typography>
          </Stack>
          <Box sx={{ height: 10, bgcolor: '#F0F2F5', borderRadius: 5, overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: `${(d.value / max) * 100}%`, bgcolor: d.color, transition: 'width .3s' }} />
          </Box>
        </Box>
      ))}
    </Stack>
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
