import { Box, Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import {
  DashboardOutlined,
  DescriptionOutlined,
  ArticleOutlined,
  BlockOutlined,
  EventBusyOutlined,
  VerifiedUserOutlined,
  PeopleOutlineOutlined,
  AdminPanelSettingsOutlined,
  BadgeOutlined,
  PersonOutlineOutlined,
  ConstructionOutlined,
  CategoryOutlined,
  GroupWorkOutlined,
  DescriptionRounded,
  GavelOutlined,
  NotificationImportantOutlined,
  PrintOutlined,
  MapOutlined,
  RouteOutlined,
  PlaceOutlined,
  LocationCityOutlined,
  EventOutlined,
  AssessmentOutlined,
  FactCheckOutlined,
  SettingsOutlined,
  DirectionsCarFilledOutlined,
  NotificationsNoneOutlined,
  TuneOutlined,
  ToggleOnOutlined,
  ExpandLess,
  ExpandMore,
  FiberManualRecord,
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { tokens } from '../theme';

export const SIDEBAR_WIDTH = 256;

type NavItem = {
  label: string;
  to?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
};

// Sidebar structure mirrors the real MNPS-Permission-UI route folders,
// grouped by business area for navigation clarity.
const items: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardOutlined fontSize="small" /> },
  {
    label: 'Applications', to: '/applications', icon: <DescriptionOutlined fontSize="small" />,
    children: [
      { label: 'All Applications', to: '/applications', icon: <ArticleOutlined fontSize="small" /> },
      { label: 'My Work Items', to: '/myworkitems', icon: <FactCheckOutlined fontSize="small" /> },
      { label: 'Explore Applications', to: '/exploreapplications', icon: <MapOutlined fontSize="small" /> },
      { label: 'Suspensions', to: '/suspensions', icon: <BlockOutlined fontSize="small" /> },
      { label: 'White Mail Reminder', to: '/whitemailremainder', icon: <NotificationImportantOutlined fontSize="small" /> },
      { label: 'Physical Permission', to: '/physicalpermission', icon: <PrintOutlined fontSize="small" /> },
    ],
  },
  { label: 'Applicants', to: '/applicants', icon: <PersonOutlineOutlined fontSize="small" /> },
  {
    label: 'Users', icon: <PeopleOutlineOutlined fontSize="small" />,
    children: [
      { label: 'System Users', to: '/systemusers', icon: <BadgeOutlined fontSize="small" /> },
      { label: 'Roles & Permissions', to: '/roleandpermission', icon: <AdminPanelSettingsOutlined fontSize="small" /> },
    ],
  },
  {
    label: 'Permission Setup', to: '/builder', icon: <ConstructionOutlined fontSize="small" />,
    children: [
      { label: 'Builder', to: '/builder', icon: <ConstructionOutlined fontSize="small" /> },
      { label: 'Groups', to: '/groups', icon: <GroupWorkOutlined fontSize="small" /> },
      { label: 'Pricing', to: '/pricing', icon: <CategoryOutlined fontSize="small" /> },
      { label: 'Purchase Reason', to: '/purchasereason', icon: <ArticleOutlined fontSize="small" /> },
    ],
  },
  {
    label: 'Templates', icon: <DescriptionRounded fontSize="small" />,
    children: [
      { label: 'Document Types', to: '/documenttypes', icon: <ArticleOutlined fontSize="small" /> },
      { label: 'Terms and Condition', to: '/termsandcondition', icon: <GavelOutlined fontSize="small" /> },
      { label: 'Alerts and Tooltips', to: '/alertsandtooltips', icon: <NotificationImportantOutlined fontSize="small" /> },
      { label: 'Emails', to: '/emails', icon: <ArticleOutlined fontSize="small" /> },
    ],
  },
  {
    label: 'Area', icon: <MapOutlined fontSize="small" />,
    children: [
      { label: 'Streets', to: '/streets', icon: <RouteOutlined fontSize="small" /> },
      { label: 'Zones', to: '/zones', icon: <PlaceOutlined fontSize="small" /> },
      { label: 'Locations', to: '/locations', icon: <LocationCityOutlined fontSize="small" /> },
      { label: 'Bay List', to: '/baylist', icon: <DirectionsCarFilledOutlined fontSize="small" /> },
      { label: 'Special Events', to: '/SpecialEvents', icon: <EventOutlined fontSize="small" /> },
    ],
  },
  {
    label: 'Reports', to: '/reports', icon: <AssessmentOutlined fontSize="small" />,
    children: [
      { label: 'Application', to: '/reports/application', icon: <ArticleOutlined fontSize="small" /> },
      { label: 'Address', to: '/reports/address', icon: <LocationCityOutlined fontSize="small" /> },
      { label: 'Financial', to: '/reports/financial', icon: <AssessmentOutlined fontSize="small" /> },
      { label: 'Voucher', to: '/reports/voucher', icon: <ArticleOutlined fontSize="small" /> },
      { label: 'Print', to: '/reports/print', icon: <PrintOutlined fontSize="small" /> },
    ],
  },
  { label: 'System Audits', to: '/systemaudits', icon: <FactCheckOutlined fontSize="small" /> },
  { label: 'Contract Settings', to: '/contractsettings', icon: <SettingsOutlined fontSize="small" /> },
  { label: 'Form Builder', to: '/formbuilder', icon: <TuneOutlined fontSize="small" /> },
];

function useIsActive() {
  const loc = useLocation();
  return (to?: string) => {
    if (!to) return false;
    const [path] = to.split('?');
    if (path === '/') return loc.pathname === '/';
    return loc.pathname === path || loc.pathname.startsWith(path + '/');
  };
}

const IDLE_TEXT   = '#DCE3EC';
const MUTED_TEXT  = 'rgba(255,255,255,0.55)';
const HOVER_BG    = 'rgba(255,255,255,0.06)';
const ACTIVE_BG   = tokens.NAVY;
const ACTIVE_TEXT = '#FFFFFF';

export function Sidebar() {
  const isActive = useIsActive();
  const loc = useLocation();

  const initiallyOpen: Record<string, boolean> = {};
  items.forEach((it) => {
    if (it.children && (isActive(it.to) || it.children.some((c) => isActive(c.to)))) {
      initiallyOpen[it.label] = true;
    }
  });
  const [openGroup, setOpenGroup] = useState<Record<string, boolean>>(initiallyOpen);

  const toggle = (label: string) =>
    setOpenGroup((g) => ({ ...g, [label]: !g[label] }));

  const childActiveFor = (parent: NavItem) => {
    if (!parent.children) return false;
    return parent.children.some((c) => {
      if (!c.to) return false;
      if (c.to.includes('?')) return loc.pathname + loc.search === c.to;
      return isActive(c.to);
    });
  };

  return (
    <Box
      sx={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: SIDEBAR_WIDTH,
        bgcolor: tokens.SIDEBAR,
        color: IDLE_TEXT,
        display: 'flex',
        flexDirection: 'column',
        zIndex: (t) => t.zIndex.drawer + 1,
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Brand header */}
      <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box sx={{
            width: 34, height: 34, borderRadius: 1,
            background: `linear-gradient(135deg, ${tokens.NAVY} 0%, ${tokens.ACCENT} 100%)`,
            display: 'grid', placeItems: 'center',
            color: '#FFFFFF', fontWeight: 800, fontFamily: tokens.HEADING, fontSize: '1rem',
          }}>M</Box>
          <Box>
            <Typography sx={{ color: '#FFFFFF', fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1rem', lineHeight: 1.1 }}>
              Marston
            </Typography>
            <Typography sx={{ color: MUTED_TEXT, fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.2 }}>
              Permits · Back Office
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List disablePadding dense>
          {items.map((it) => {
            if (it.children) {
              const open = !!openGroup[it.label];
              const childActive = childActiveFor(it);
              return (
                <Box key={it.label}>
                  <ListItemButton
                    onClick={() => toggle(it.label)}
                    sx={{
                      mx: 1, borderRadius: 1, color: childActive ? ACTIVE_TEXT : IDLE_TEXT,
                      py: 0.85, px: 1.25,
                      '&:hover': { bgcolor: HOVER_BG },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: childActive ? tokens.ACCENT : IDLE_TEXT }}>
                      {it.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={it.label}
                      primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: tokens.HEADING, color: 'inherit' }}
                    />
                    {open ? <ExpandLess fontSize="small" sx={{ color: MUTED_TEXT }} /> : <ExpandMore fontSize="small" sx={{ color: MUTED_TEXT }} />}
                  </ListItemButton>
                  <Collapse in={open} timeout="auto">
                    <Box sx={{ position: 'relative', ml: 3.25, mr: 1, my: 0.25, pl: 1.5, borderLeft: '1px solid rgba(255,255,255,0.10)' }}>
                      <List component="div" disablePadding dense>
                        {it.children.map((c) => {
                          const active = c.to?.includes('?')
                            ? loc.pathname + loc.search === c.to
                            : isActive(c.to);
                          return (
                            <ListItemButton
                              key={c.to}
                              component={NavLink}
                              to={c.to!}
                              end={c.to === it.to}
                              sx={{
                                borderRadius: 1, my: 0.25, py: 0.45, pl: 1.25, pr: 1,
                                color: IDLE_TEXT,
                                '&:hover': { bgcolor: HOVER_BG },
                                ...(active ? {
                                  bgcolor: ACTIVE_BG, color: ACTIVE_TEXT,
                                  '&:hover': { bgcolor: ACTIVE_BG },
                                } : {}),
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 26, color: active ? '#FFFFFF' : MUTED_TEXT }}>
                                {c.icon ?? <FiberManualRecord sx={{ fontSize: 6 }} />}
                              </ListItemIcon>
                              <ListItemText
                                primary={c.label}
                                primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: active ? 600 : 500, color: 'inherit' }}
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </Box>
                  </Collapse>
                </Box>
              );
            }
            const active = isActive(it.to);
            return (
              <ListItemButton
                key={it.to}
                component={NavLink}
                to={it.to!}
                end={it.to === '/'}
                sx={{
                  mx: 1, borderRadius: 1, py: 0.85, px: 1.25, color: IDLE_TEXT,
                  '&:hover': { bgcolor: HOVER_BG },
                  ...(active ? {
                    bgcolor: ACTIVE_BG, color: ACTIVE_TEXT,
                    '&:hover': { bgcolor: ACTIVE_BG },
                  } : {}),
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: active ? '#FFFFFF' : IDLE_TEXT }}>{it.icon}</ListItemIcon>
                <ListItemText
                  primary={it.label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: tokens.HEADING, color: 'inherit' }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />
      <Box sx={{ px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: '50%',
          bgcolor: tokens.ACCENT, color: tokens.SIDEBAR,
          display: 'grid', placeItems: 'center',
          fontWeight: 700, fontSize: '0.8rem',
        }}>AI</Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            AutomationApplyIQ
          </Typography>
          <Typography sx={{ color: MUTED_TEXT, fontSize: '0.7rem', lineHeight: 1.2 }}>
            Contract · Live
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
