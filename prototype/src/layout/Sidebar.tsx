import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography, Collapse } from '@mui/material';
import {
  HomeOutlined,
  ConstructionOutlined,
  DescriptionOutlined,
  PeopleOutlineOutlined,
  MapOutlined,
  SettingsOutlined,
  PrintOutlined,
  AssessmentOutlined,
  ExpandLess,
  ExpandMore,
  LocalActivityOutlined,
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { tokens } from '../theme';

export const SIDEBAR_WIDTH = 240;

type NavItem = {
  label: string;
  to?: string;
  icon: React.ReactNode;
  children?: NavItem[];
};

const items: NavItem[] = [
  { label: 'Home', to: '/', icon: <HomeOutlined /> },
  { label: 'Builder', to: '/builder', icon: <ConstructionOutlined /> },
  { label: 'Applications', to: '/applications', icon: <DescriptionOutlined /> },
  {
    label: 'Users', icon: <PeopleOutlineOutlined />,
    children: [
      { label: 'Roles & Permissions', to: '/users/roles', icon: <LocalActivityOutlined /> },
      { label: 'System Users', to: '/users/system', icon: <LocalActivityOutlined /> },
      { label: 'Applicants', to: '/users/applicants', icon: <LocalActivityOutlined /> },
    ],
  },
  {
    label: 'Area', icon: <MapOutlined />,
    children: [
      { label: 'Streets', to: '/area/streets', icon: <LocalActivityOutlined /> },
      { label: 'Zones', to: '/area/zones', icon: <LocalActivityOutlined /> },
      { label: 'Locations', to: '/area/locations', icon: <LocalActivityOutlined /> },
    ],
  },
  { label: 'Contract Settings', to: '/contract-settings', icon: <SettingsOutlined /> },
  { label: 'Print', to: '/print', icon: <PrintOutlined /> },
  { label: 'Reports', to: '/reports', icon: <AssessmentOutlined /> },
];

function useIsActive() {
  const loc = useLocation();
  return (to?: string) => {
    if (!to) return false;
    if (to === '/') return loc.pathname === '/';
    return loc.pathname.startsWith(to);
  };
}

export function Sidebar() {
  const [openGroup, setOpenGroup] = useState<Record<string, boolean>>({ Users: true, Area: true });
  const isActive = useIsActive();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        width: SIDEBAR_WIDTH,
        bgcolor: tokens.NAVY,
        color: '#DFE6EE',
        display: 'flex',
        flexDirection: 'column',
        zIndex: (t) => t.zIndex.drawer + 1,
      }}
    >
      <Box sx={{ px: 3, py: 3 }}>
        <Typography variant="h4" sx={{ color: '#FFFFFF', fontFamily: '"Roboto Slab", Georgia, serif', letterSpacing: '0.02em', fontSize: '1.35rem' }}>
          Marston
        </Typography>
        <Typography variant="caption" sx={{ color: tokens.ORANGE_SOFT, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.65rem' }}>
          Permits · Back Office
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <List sx={{ py: 1.5, flex: 1, overflowY: 'auto' }} dense>
        {items.map((it) => {
          if (it.children) {
            const open = !!openGroup[it.label];
            return (
              <Box key={it.label}>
                <ListItemButton
                  onClick={() => setOpenGroup((g) => ({ ...g, [it.label]: !g[it.label] }))}
                  sx={{ mx: 1.5, borderRadius: 1, color: 'inherit', py: 0.85 }}
                >
                  <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>{it.icon}</ListItemIcon>
                  <ListItemText primary={it.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
                  {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </ListItemButton>
                <Collapse in={open} timeout="auto">
                  <List component="div" disablePadding dense>
                    {it.children.map((c) => (
                      <ListItemButton
                        key={c.to}
                        component={NavLink}
                        to={c.to!}
                        sx={{
                          pl: 6, mx: 1.5, borderRadius: 1, color: 'inherit', py: 0.6,
                          '&.active': { bgcolor: 'rgba(231,126,8,0.15)', color: '#FFFFFF' },
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                        }}
                      >
                        <ListItemText primary={c.label} primaryTypographyProps={{ fontSize: '0.8125rem' }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }
          return (
            <ListItemButton
              key={it.to}
              component={NavLink}
              to={it.to!}
              end={it.to === '/'}
              sx={{
                mx: 1.5, borderRadius: 1, color: 'inherit', py: 0.85,
                '&.active': { bgcolor: 'rgba(231,126,8,0.16)', color: '#FFFFFF', boxShadow: 'inset 3px 0 0 ' + tokens.ORANGE },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: isActive(it.to) ? tokens.ORANGE_SOFT : 'inherit' }}>{it.icon}</ListItemIcon>
              <ListItemText primary={it.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem' }}>
          Contract
        </Typography>
        <Typography sx={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600 }}>
          AutomationApplyIQ
        </Typography>
      </Box>
    </Box>
  );
}
