import { AppBar, Avatar, Box, Breadcrumbs, IconButton, Link, TextField, Toolbar, Typography, InputAdornment, Tooltip } from '@mui/material';
import { NotificationsNoneOutlined, HelpOutlineOutlined, Search } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { SIDEBAR_WIDTH } from './Sidebar';
import { tokens } from '../theme';

export const TOPBAR_HEIGHT = 60;

const LABELS: Record<string, string> = {
  '': 'Home',
  builder: 'Builder',
  applications: 'Applications',
  users: 'Users',
  roles: 'Roles & Permissions',
  system: 'System Users',
  applicants: 'Applicants',
  area: 'Area',
  streets: 'Streets',
  zones: 'Zones',
  locations: 'Locations',
  'contract-settings': 'Contract Settings',
  print: 'Print',
  reports: 'Reports',
};

function useCrumbs() {
  const { pathname } = useLocation();
  const segs = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; to: string }[] = [{ label: 'Home', to: '/' }];
  let path = '';
  for (const s of segs) {
    path += `/${s}`;
    const label = LABELS[s] ?? s;
    crumbs.push({ label, to: path });
  }
  return crumbs;
}

export function Topbar() {
  const crumbs = useCrumbs();
  return (
    <AppBar position="fixed" sx={{ ml: `${SIDEBAR_WIDTH}px`, width: `calc(100% - ${SIDEBAR_WIDTH}px)`, height: TOPBAR_HEIGHT, justifyContent: 'center' }} elevation={0}>
      <Toolbar variant="dense" sx={{ minHeight: TOPBAR_HEIGHT, gap: 2 }}>
        <Breadcrumbs
          separator="›"
          sx={{ flex: 1, '& .MuiBreadcrumbs-separator': { color: tokens.MUTED } }}
        >
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return last ? (
              <Typography key={c.to} sx={{ fontSize: '0.9rem', fontWeight: 600, color: tokens.INK }}>{c.label}</Typography>
            ) : (
              <Link key={c.to} component={RouterLink} to={c.to} underline="hover" sx={{ fontSize: '0.9rem', color: tokens.MUTED }}>
                {c.label}
              </Link>
            );
          })}
        </Breadcrumbs>

        <TextField
          placeholder="Search applications, permits, users…"
          sx={{ width: 340 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ color: tokens.MUTED }} />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Help">
          <IconButton size="small"><HelpOutlineOutlined fontSize="small" /></IconButton>
        </Tooltip>
        <Tooltip title="Notifications">
          <IconButton size="small"><NotificationsNoneOutlined fontSize="small" /></IconButton>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1, borderLeft: `1px solid ${tokens.LINE}` }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: tokens.NAVY, fontSize: '0.85rem' }}>JB</Avatar>
          <Box sx={{ lineHeight: 1.15 }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>Jafar Basha</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: tokens.MUTED }}>Super Admin</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
