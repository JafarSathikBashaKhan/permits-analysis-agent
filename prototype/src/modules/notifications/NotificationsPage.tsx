import { useMemo, useState } from 'react';
import {
  Box, Button, Card, CardContent, Chip, IconButton, Stack, Tab, Tabs, TextField,
  Typography, MenuItem, Divider, List, ListItem, ListItemAvatar, ListItemText, Avatar, Badge, Menu,
} from '@mui/material';
import { PageHeader } from '../../shared/PageHeader';
import { tokens } from '../../theme';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import MailOutlineOutlined from '@mui/icons-material/MailOutlineOutlined';
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import PriorityHighOutlined from '@mui/icons-material/PriorityHighOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import DoneAllOutlined from '@mui/icons-material/DoneAllOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

type Severity = 'Info' | 'Success' | 'Warning' | 'Error';
type Category = 'Application' | 'Payment' | 'Renewal' | 'System' | 'User' | 'Print';

type Notif = {
  id: string;
  severity: Severity;
  category: Category;
  title: string;
  body: string;
  when: string;
  read: boolean;
  actor?: string;
  link?: string;
};

const seed = (): Notif[] => [
  { id: 'N-101', severity: 'Warning', category: 'Application', title: 'Application awaiting approval > 48h',
    body: 'AP-2026-1042 (James Wilson · Resident Permit) has been in Pending Approval for 2 days.',
    when: '2 min ago', read: false, actor: 'System', link: '/applications/AP-2026-1042' },
  { id: 'N-100', severity: 'Error', category: 'Payment', title: 'Payment failed',
    body: 'Card payment on AP-2026-1038 declined. Automatic retry scheduled for 09:00 tomorrow.',
    when: '12 min ago', read: false, actor: 'Payment Gateway', link: '/applications/AP-2026-1038' },
  { id: 'N-099', severity: 'Info', category: 'Renewal', title: 'Renewals due in the next 7 days',
    body: '18 active permits are due for renewal between 8 Jul and 15 Jul.',
    when: '1 hour ago', read: false, actor: 'System' },
  { id: 'N-098', severity: 'Success', category: 'Print', title: 'Print batch delivered',
    body: 'Print partner confirmed delivery of batch B-2026-024 (32 permits).',
    when: '3 hours ago', read: true, actor: 'Print Partner' },
  { id: 'N-097', severity: 'Info', category: 'User', title: 'New user invited',
    body: 'Priya R. invited jo.smith@marston.co.uk as BO Manager.',
    when: 'Yesterday · 16:20', read: true, actor: 'Priya R.' },
  { id: 'N-096', severity: 'Warning', category: 'Application', title: 'Documents missing',
    body: 'AP-2026-1029 flagged Additional Info Required — proof of address not uploaded.',
    when: 'Yesterday · 11:04', read: true, actor: 'System', link: '/applications/AP-2026-1029' },
  { id: 'N-095', severity: 'Error', category: 'System', title: 'Autoguru lookup failed',
    body: 'VRM lookup service returned 503 for 4 consecutive requests between 08:12 and 08:15.',
    when: '2 Jul · 08:20', read: true, actor: 'System' },
  { id: 'N-094', severity: 'Info', category: 'Application', title: 'Bulk approval completed',
    body: 'Dan Iyer approved 14 applications in bulk (AP-2026-1015 → 1028).',
    when: '1 Jul · 14:45', read: true, actor: 'Dan Iyer' },
  { id: 'N-093', severity: 'Success', category: 'Renewal', title: 'Auto-renewal succeeded',
    body: '9 Resident Permits auto-renewed for the July cycle. Total collected £405.00.',
    when: '30 Jun · 06:00', read: true, actor: 'System' },
];

const SEV_STYLE: Record<Severity, { bg: string; fg: string; icon: React.ReactNode }> = {
  Info:    { bg: '#EAF3FB', fg: '#0D3E66', icon: <NotificationsOutlined fontSize="small" /> },
  Success: { bg: '#E7F5EC', fg: '#1E7E34', icon: <CheckCircleOutlined fontSize="small" /> },
  Warning: { bg: '#FFF7E0', fg: '#8A6D00', icon: <PriorityHighOutlined fontSize="small" /> },
  Error:   { bg: '#FDECEA', fg: '#B71C1C', icon: <ErrorOutlineOutlined fontSize="small" /> },
};

const CATS: (Category | 'All')[] = ['All', 'Application', 'Payment', 'Renewal', 'System', 'User', 'Print'];

export function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>(() => seed());
  const [tab, setTab] = useState<'inbox' | 'settings' | 'history'>('inbox');
  const [cat, setCat] = useState<Category | 'All'>('All');
  const [q, setQ] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const unread = items.filter((n) => !n.read).length;
  const filtered = useMemo(() => items.filter((n) => {
    if (cat !== 'All' && n.category !== cat) return false;
    if (q && !`${n.title} ${n.body}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [items, cat, q]);

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const remove = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id));
  const toggle = (id: string) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n));

  return (
    <Box>
      <PageHeader
        eyebrow="Notifications"
        title="Notification Centre"
        description="System alerts, user activity and background job outcomes across the contract."
        actions={
          <>
            <Button variant="outlined" startIcon={<DoneAllOutlined />} onClick={markAll} disabled={unread === 0}>
              Mark all read
            </Button>
            <Button variant="outlined" startIcon={<SettingsOutlined />} onClick={() => setTab('settings')}>Preferences</Button>
          </>
        }
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid #E0E0E0', mb: 2 }}>
        <Tab value="inbox" iconPosition="start" icon={<Badge badgeContent={unread} color="error" sx={{ mr: unread ? 1 : 0 }}><NotificationsOutlined fontSize="small" /></Badge>} label="Inbox" />
        <Tab value="history" iconPosition="start" icon={<HistoryOutlined fontSize="small" />} label="History" />
        <Tab value="settings" iconPosition="start" icon={<SettingsOutlined fontSize="small" />} label="Preferences" />
      </Tabs>

      {tab !== 'settings' && (
        <>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                <TextField size="small" placeholder="Search notifications…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ minWidth: 320 }} />
                <TextField select size="small" label="Category" value={cat} onChange={(e) => setCat(e.target.value as any)} sx={{ minWidth: 180 }}
                  InputProps={{ startAdornment: <FilterListOutlined fontSize="small" sx={{ mr: 1, color: tokens.MUTED }} /> }}>
                  {CATS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
                <Box sx={{ flex: 1 }} />
                <Typography sx={{ color: tokens.MUTED, alignSelf: 'center' }}>
                  <b>{filtered.length}</b> {tab === 'inbox' ? 'in inbox' : 'in history'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <List disablePadding>
              {filtered.length === 0 && (
                <ListItem><ListItemText primary={<Typography sx={{ color: tokens.MUTED, textAlign: 'center', py: 4 }}>No notifications.</Typography>} /></ListItem>
              )}
              {filtered.map((n, i) => {
                const s = SEV_STYLE[n.severity];
                return (
                  <Box key={n.id}>
                    <ListItem
                      sx={{ py: 1.5, bgcolor: n.read ? 'transparent' : '#F7FAFD' }}
                      secondaryAction={
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" onClick={() => toggle(n.id)} title={n.read ? 'Mark unread' : 'Mark read'}><MailOutlineOutlined fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => remove(n.id)} title="Dismiss"><DeleteOutline fontSize="small" /></IconButton>
                        </Stack>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: s.bg, color: s.fg, width: 40, height: 40 }}>{s.icon}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography sx={{ fontWeight: n.read ? 500 : 700 }}>{n.title}</Typography>
                            <Chip size="small" label={n.category} variant="outlined" sx={{ height: 20 }} />
                            <Chip size="small" label={n.severity} sx={{ bgcolor: s.bg, color: s.fg, fontWeight: 600, height: 20 }} />
                          </Stack>
                        }
                        secondary={
                          <>
                            <Typography sx={{ color: '#3D4A57', fontSize: '0.85rem', mt: 0.25 }}>{n.body}</Typography>
                            <Typography sx={{ color: tokens.MUTED, fontSize: '0.75rem', mt: 0.25 }}>
                              {n.when}{n.actor ? ` · ${n.actor}` : ''}{n.link ? ` · ${n.link}` : ''}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {i < filtered.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </List>
          </Card>
        </>
      )}

      {tab === 'settings' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Notification Preferences</Typography>
            <Divider sx={{ mb: 2 }} />
            {[
              ['Application submitted', 'Notify me when a new permit application is submitted'],
              ['Application approved', 'Notify me on approvals from other users'],
              ['Payment failure', 'Notify me when a card payment fails'],
              ['Renewal reminder', 'Notify me 7 days before permits are due to renew'],
              ['System errors', 'Notify me of backend errors and third-party outages'],
              ['User activity', 'Notify me of user invite / role changes'],
            ].map(([title, desc]) => (
              <Stack key={title} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.25, borderBottom: '1px solid #EEE' }}>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
                  <Typography sx={{ color: tokens.MUTED, fontSize: '0.85rem' }}>{desc}</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip label="In-app" color="primary" size="small" onClick={() => {}} />
                  <Chip label="Email" variant="outlined" size="small" onClick={() => {}} />
                  <Chip label="SMS" variant="outlined" size="small" onClick={() => {}} />
                </Stack>
              </Stack>
            ))}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="contained">Save Preferences</Button>
              <Button variant="outlined">Reset to Defaults</Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
