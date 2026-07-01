import { Box, Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import {
  HomeOutlined,
  DashboardOutlined,
  DescriptionOutlined,
  ArticleOutlined,
  BlockOutlined,
  EventBusyOutlined,
  VerifiedUserOutlined,
  ConstructionOutlined,
  CategoryOutlined,
  GroupWorkOutlined,
  PeopleOutlineOutlined,
  AdminPanelSettingsOutlined,
  BadgeOutlined,
  PersonOutlineOutlined,
  MapOutlined,
  RouteOutlined,
  PlaceOutlined,
  LocationCityOutlined,
  EventOutlined,
  SettingsOutlined,
  PrintOutlined,
  AssessmentOutlined,
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

type NavSection = {
  section: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    section: 'Overview',
    items: [
      { label: 'Home', to: '/', icon: <HomeOutlined fontSize="small" /> },
      { label: 'Dashboard', to: '/dashboard', icon: <DashboardOutlined fontSize="small" /> },
    ],
  },
  {
    section: 'Operations',
    items: [
      {
        label: 'Applications', to: '/applications', icon: <DescriptionOutlined fontSize="small" />,
        children: [
          { label: 'All applications', to: '/applications', icon: <ArticleOutlined fontSize="small" /> },
          { label: 'Permit', to: '/applications?type=permit', icon: <ArticleOutlined fontSize="small" /> },
          { label: 'Suspension', to: '/applications?type=suspension', icon: <BlockOutlined fontSize="small" /> },
          { label: 'Dispensation', to: '/applications?type=dispensation', icon: <EventBusyOutlined fontSize="small" /> },
          { label: 'Exemption', to: '/applications?type=exemption', icon: <VerifiedUserOutlined fontSize="small" /> },
        ],
      },
      { label: 'Print', to: '/print', icon: <PrintOutlined fontSize="small" /> },
      { label: 'Reports', to: '/reports', icon: <AssessmentOutlined fontSize="small" /> },
    ],
  },
  {
    section: 'Configuration',
    items: [
      {
        label: 'Permission Builder', to: '/builder', icon: <ConstructionOutlined fontSize="small" />,
        children: [
          { label: 'Permissions', to: '/builder', icon: <CategoryOutlined fontSize="small" /> },
          { label: 'Groups', to: '/builder/groups', icon: <GroupWorkOutlined fontSize="small" /> },
        ],
      },
      {
        label: 'Area', icon: <MapOutlined fontSize="small" />,
        children: [
          { label: 'Streets', to: '/area/streets', icon: <RouteOutlined fontSize="small" /> },
          { label: 'Zones', to: '/area/zones', icon: <PlaceOutlined fontSize="small" /> },
          { label: 'Locations', to: '/area/locations', icon: <LocationCityOutlined fontSize="small" /> },
          { label: 'Special Events', to: '/area/special-events', icon: <EventOutlined fontSize="small" /> },
        ],
      },
      {
        label: 'Users', icon: <PeopleOutlineOutlined fontSize="small" />,
        children: [
          { label: 'Roles & Permissions', to: '/users/roles', icon: <AdminPanelSettingsOutlined fontSize="small" /> },
          { label: 'System Users', to: '/users/system', icon: <BadgeOutlined fontSize="small" /> },
          { label: 'Applicants', to: '/users/applicants', icon: <PersonOutlineOutlined fontSize="small" /> },
        ],
      },
      { label: 'Contract Settings', to: '/contract-settings', icon: <SettingsOutlined fontSize="small" /> },
    ],
  },
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

// Text and interaction colours over the dark sidebar chrome (#0B162B).
// #DCE3EC gives 11.9:1 contrast (AAA). Active accent uses the NoticeIQ blue #266798.
const IDLE_TEXT   = '#DCE3EC';
const MUTED_TEXT  = 'rgba(255,255,255,0.55)';
const SECTION_TXT = 'rgba(255,255,255,0.42)';
const HOVER_BG    = 'rgba(255,255,255,0.06)';
const ACTIVE_BG   = tokens.NAVY;          // #266798 solid — matches primary
const ACTIVE_TEXT = '#FFFFFF';

export function Sidebar() {
  const isActive = useIsActive();
  const loc = useLocation();

  // Auto-open a group when any child route is active.
  const initiallyOpen: Record<string, boolean> = {};
  sections.forEach((s) => s.items.forEach((it) => {
    if (it.children && (isActive(it.to) || it.children.some((c) => isActive(c.to)))) {
      initiallyOpen[it.label] = true;
    }
  }));
  const [openGroup, setOpenGroup] = useState<Record<string, boolean>>({
    Applications: true, Area: true, 'Permission Builder': true, Users: true, ...initiallyOpen,
  });

  const toggle = (label: string) =>
    setOpenGroup((g) => ({ ...g, [label]: !g[label] }));

  const isChildActive = (parent: NavItem) => {
    if (!parent.children) return false;
    // for query-string children like ?type=permit, only match exact URL
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
        {sections.map((sec) => (
          <Box key={sec.section} sx={{ mb: 1.25 }}>
            <Typography sx={{
              px: 2.5, mt: 1.25, mb: 0.5,
              color: SECTION_TXT, fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              {sec.section}
            </Typography>
            <List disablePadding dense>
              {sec.items.map((it) => {
                if (it.children) {
                  const open = !!openGroup[it.label];
                  const childActive = isChildActive(it);
                  return (
                    <Box key={it.label}>
                      <ListItemButton
                        onClick={() => toggle(it.label)}
                        sx={{
                          mx: 1, borderRadius: 1, color: childActive ? ACTIVE_TEXT : IDLE_TEXT,
                          py: 0.85, px: 1.25,
                          '&:hover': { bgcolor: HOVER_BG },
                          ...(childActive && !it.children?.some((c) => c.to === it.to && isActive(c.to)) ? {
                            // parent group has an active descendant — subtle indicator
                            color: '#FFFFFF',
                          } : {}),
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
        ))}
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
