/*
 * Dashboard — mirrors the real Marston MNPS-Permission-UI Dashboard.
 *
 * Tabs: APPLICATIONS (active), FINANCIAL (marked "coming soon" — like the real
 * app, where the tab is commented out but the tab strip is visible).
 *
 * APPLICATIONS tab widgets:
 *   1. Active Applications — clickable KPI cards per Permission Type showing:
 *        - Permission Type name
 *        - Active count (large)
 *        - % change vs last month
 *        - Trend arrow (up / down / flat)
 *      Click → navigates to /applications filtered by permission type.
 *   2. Upcoming Renewals — LineChart (multi-line, one line per Permission Type)
 *      with an "Next 7 Days / Next 30 Days" dropdown selector in the header.
 *      Total renewals shown at the bottom. Click a dot → /applications filtered
 *      by permission type + renewal date.
 */
import { useMemo, useState } from 'react';
import {
  Box, Card, CardActionArea, CardContent, FormControl, MenuItem, Select,
  Stack, Tab, Tabs, Typography, Chip,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip as RTooltip,
  XAxis, YAxis,
} from 'recharts';
import { PageHeader } from '../../shared/PageHeader';
import { tokens } from '../../theme';

// ─── Data model (mirrors API shape) ─────────────────────────────────────
type PermissionTypeCount = {
  permissionTypeId: string;
  permissionTypeName: string;
  activeCount: number;
  previousMonthCount: number;
  percentageChange: number;
  arrowIcon: 'up' | 'down' | 'flat';
};

const PERMISSION_TYPE_COUNTS: PermissionTypeCount[] = [
  { permissionTypeId: 'RES', permissionTypeName: 'Residents Permit',   activeCount: 1287, previousMonthCount: 1148, percentageChange: 12.1, arrowIcon: 'up' },
  { permissionTypeId: 'BUS', permissionTypeName: 'Business Permit',    activeCount:  412, previousMonthCount:  428, percentageChange: -3.7, arrowIcon: 'down' },
  { permissionTypeId: 'VIS', permissionTypeName: 'Visitor Permit',     activeCount:  946, previousMonthCount:  902, percentageChange:  4.9, arrowIcon: 'up' },
  { permissionTypeId: 'TRD', permissionTypeName: 'Trades Permit',      activeCount:  238, previousMonthCount:  240, percentageChange: -0.8, arrowIcon: 'flat' },
  { permissionTypeId: 'BLU', permissionTypeName: 'Blue Badge Permit',  activeCount:  184, previousMonthCount:  171, percentageChange:  7.6, arrowIcon: 'up' },
  { permissionTypeId: 'SUS', permissionTypeName: 'Suspension',         activeCount:   46, previousMonthCount:   49, percentageChange: -6.1, arrowIcon: 'down' },
  { permissionTypeId: 'DIS', permissionTypeName: 'Dispensation',       activeCount:   92, previousMonthCount:   88, percentageChange:  4.5, arrowIcon: 'up' },
  { permissionTypeId: 'TAX', permissionTypeName: 'Taxi Card',          activeCount:  118, previousMonthCount:  116, percentageChange:  1.7, arrowIcon: 'up' },
];

const PALETTE = ['#1976D2', '#F57C00', '#43A047', '#8E24AA', '#00838F', '#E53935', '#3949AB', '#6D4C41'];

// Deterministic-ish per-day mock: seed by permission type + day offset
function seedRenewals(days: number): { day: string; date: string; [k: string]: any }[] {
  const out: { day: string; date: string; [k: string]: any }[] = [];
  const today = new Date();
  for (let d = 1; d <= days; d++) {
    const dt = new Date(today);
    dt.setDate(today.getDate() + d);
    const dayLabel = dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const row: any = { day: dayLabel, date: dt.toISOString() };
    PERMISSION_TYPE_COUNTS.forEach((p, idx) => {
      // Fake but stable-ish curve per permission type
      const base = Math.max(0, Math.round((p.activeCount / (days * 8)) * (1 + 0.5 * Math.sin((d + idx) * 0.6))));
      row[p.permissionTypeName] = base;
    });
    out.push(row);
  }
  return out;
}

const RENEWALS: Record<'7' | '30', { day: string; date: string; [k: string]: any }[]> = {
  '7': seedRenewals(7),
  '30': seedRenewals(30),
};

export function DashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'applications' | 'financial'>('applications');
  const [timeFilter, setTimeFilter] = useState<'7' | '30'>('7');

  const renewalData = RENEWALS[timeFilter];
  const totalRenewals = useMemo(() => {
    return renewalData.reduce((sum, row) => {
      return sum + PERMISSION_TYPE_COUNTS.reduce((s, p) => s + (row[p.permissionTypeName] || 0), 0);
    }, 0);
  }, [renewalData]);

  const onCardClick = (p: PermissionTypeCount) => {
    // In real app: menuStore push + navigate. Prototype: pass query.
    navigate(`/applications?permissionType=${encodeURIComponent(p.permissionTypeName)}&fromDashboard=1`);
  };

  const onDotClick = (permType: string, date: string) => {
    navigate(`/applications?permissionType=${encodeURIComponent(permType)}&renewalDate=${encodeURIComponent(date)}&fromDashboard=1`);
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Real-time snapshot of active permissions and upcoming renewals across every permission type."
      />

      {/* Tab strip — Applications active, Financial coming soon */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab value="applications" label="APPLICATIONS" />
          <Tab
            value="financial"
            label={<Stack direction="row" spacing={0.5} alignItems="center">
              <span>FINANCIAL</span>
              <Chip size="small" label="Coming soon" sx={{ ml: 0.5, height: 18, fontSize: '0.65rem' }} />
            </Stack>}
          />
        </Tabs>
      </Box>

      {tab === 'applications' && (
        <Stack spacing={3}>
          {/* Widget 1: Active Applications */}
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1.5, color: tokens.INK }}>Active Applications</Typography>
            <Box sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
            }}>
              {PERMISSION_TYPE_COUNTS.map((p) => (
                <PermissionCard key={p.permissionTypeId} data={p} onClick={() => onCardClick(p)} />
              ))}
            </Box>
          </Box>

          {/* Widget 2: Upcoming Renewals line chart */}
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 700, color: tokens.INK }}>Upcoming Renewals</Typography>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value as '7' | '30')}>
                    <MenuItem value="7">Next 7 Days</MenuItem>
                    <MenuItem value="30">Next 30 Days</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Box sx={{ height: 340 }}>
                {totalRenewals === 0 ? (
                  <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                    <Typography color="text.secondary">No upcoming renewals found for the selected period.</Typography>
                  </Stack>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={renewalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <RTooltip />
                      <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                      {PERMISSION_TYPE_COUNTS.map((p, idx) => (
                        <Line
                          key={p.permissionTypeId}
                          type="monotone"
                          dataKey={p.permissionTypeName}
                          stroke={PALETTE[idx % PALETTE.length]}
                          strokeWidth={2}
                          dot={{ r: 3, cursor: 'pointer' }}
                          activeDot={{
                            r: 6,
                            cursor: 'pointer',
                            onClick: (_, payload: any) => {
                              const row = payload?.payload;
                              if (row) onDotClick(p.permissionTypeName, row.date);
                            },
                          }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Box>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Upcoming Renewals: <b style={{ color: tokens.INK }}>{totalRenewals}</b>
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {tab === 'financial' && (
        <Card variant="outlined">
          <CardContent>
            <Stack alignItems="center" spacing={1.5} sx={{ py: 8 }}>
              <LockOutlinedIcon sx={{ fontSize: 48, color: tokens.MUTED }} />
              <Typography sx={{ fontWeight: 700, color: tokens.INK }}>Financial dashboard coming soon</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, textAlign: 'center' }}>
                In the real Marston app this tab is currently commented out. The prototype leaves it
                visible in the tab strip so the layout matches, but the widgets will be added when the
                back-end financial API endpoints are enabled.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

// ─── Clickable Permission Type KPI card ────────────────────────────────
function PermissionCard({ data, onClick }: { data: PermissionTypeCount; onClick: () => void }) {
  const arrowColor = data.arrowIcon === 'up' ? '#2E7D32' : data.arrowIcon === 'down' ? '#C62828' : '#757575';
  const ArrowIcon = data.arrowIcon === 'up' ? ArrowUpwardIcon : data.arrowIcon === 'down' ? ArrowDownwardIcon : TrendingFlatIcon;
  const sign = data.percentageChange > 0 ? '+' : '';

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, '&:hover': { borderColor: '#1976D2', boxShadow: '0 2px 8px rgba(25,118,210,0.15)' } }}>
      <CardActionArea onClick={onClick} sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: tokens.MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          {data.permissionTypeName}
        </Typography>
        <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: tokens.INK, lineHeight: 1.2, mt: 0.5 }}>
          {data.activeCount.toLocaleString()}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
          <ArrowIcon sx={{ fontSize: 16, color: arrowColor }} />
          <Typography variant="caption" sx={{ color: arrowColor, fontWeight: 600 }}>
            {sign}{data.percentageChange.toFixed(1)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">vs last month</Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
