import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Stack, Tab, Tabs, TextField, Typography,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CommuteOutlinedIcon from '@mui/icons-material/CommuteOutlined';
import NoCrashOutlinedIcon from '@mui/icons-material/NoCrashOutlined';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';

type PermTile = {
  id: string;
  permissionName: string;
  description: string;
  permissionGroup: string;
  permissionType: 'Permit' | 'Licence' | 'Suspension' | 'Exemption';
};

const seed = (): PermTile[] => [
  { id: 'PT-01', permissionName: 'Resident Permit — Zone A', description: 'Annual permit for residents of Zone A postcodes.', permissionGroup: 'Resident', permissionType: 'Permit' },
  { id: 'PT-02', permissionName: 'Resident Permit — Zone B', description: 'Annual permit for residents of Zone B postcodes.', permissionGroup: 'Resident', permissionType: 'Permit' },
  { id: 'PT-03', permissionName: 'Visitor Scratchcard (10 hr)',  description: '10-hour scratchcard for visitor parking.', permissionGroup: 'Visitor', permissionType: 'Permit' },
  { id: 'PT-04', permissionName: 'Visitor Digital Session', description: 'Session-based visitor parking (digital).', permissionGroup: 'Visitor', permissionType: 'Permit' },
  { id: 'PT-05', permissionName: 'Business Permit — Central', description: 'Business permit for central district vehicles.', permissionGroup: 'Business', permissionType: 'Permit' },
  { id: 'PT-06', permissionName: 'Blue Badge Permit', description: 'Disabled parking Blue Badge permit.', permissionGroup: 'Concessionary', permissionType: 'Permit' },

  { id: 'LI-01', permissionName: 'Skip Hire Licence', description: 'Temporary skip placement licence on the highway.', permissionGroup: 'Highways', permissionType: 'Licence' },
  { id: 'LI-02', permissionName: 'Scaffolding Licence', description: 'Scaffolding licence for construction works.', permissionGroup: 'Highways', permissionType: 'Licence' },
  { id: 'LI-03', permissionName: 'Street Vending Licence', description: 'Licence to operate a street vending unit.', permissionGroup: 'Commercial', permissionType: 'Licence' },

  { id: 'SU-01', permissionName: 'Bay Suspension — Works', description: 'Suspend parking bay for planned works.', permissionGroup: 'Works', permissionType: 'Suspension' },
  { id: 'SU-02', permissionName: 'Bay Suspension — Event', description: 'Suspend parking bay for special event.', permissionGroup: 'Events', permissionType: 'Suspension' },

  { id: 'EX-01', permissionName: 'Trade Vehicle Exemption', description: 'Exemption for registered trade vehicles.', permissionGroup: 'Trade', permissionType: 'Exemption' },
  { id: 'EX-02', permissionName: 'Emergency Services Exemption', description: 'Blue-light and emergency service exemption.', permissionGroup: 'Emergency', permissionType: 'Exemption' },
];

const TYPES: PermTile['permissionType'][] = ['Permit', 'Licence', 'Suspension', 'Exemption'];

const iconFor = (t: PermTile['permissionType']) => {
  switch (t) {
    case 'Licence': return <ReceiptLongOutlinedIcon fontSize="small" />;
    case 'Suspension': return <DoDisturbOutlinedIcon fontSize="small" />;
    case 'Exemption': return <TaskAltIcon fontSize="small" />;
    case 'Permit': return <AirportShuttleOutlinedIcon fontSize="small" />;
    default: return <CommuteOutlinedIcon fontSize="small" />;
  }
};

const MAX_LIMIT = 5;

export function ExploreApplicationsPage() {
  const nav = useNavigate();
  const [tiles] = useState<PermTile[]>(seed());
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('All');
  const [favoritesArr, setFavoritesArr] = usePersistentState<string[]>('prototype:workqueue:explore:favorites', () => ['PT-01', 'PT-03']);
  const favorites = useMemo(() => new Set(favoritesArr), [favoritesArr]);
  const [usedCount] = useState(2);
  const [limitOpen, setLimitOpen] = useState(false);

  const activeType = TYPES[tab];
  const forType = tiles.filter((t) => t.permissionType === activeType);
  const groups = useMemo(() => ['All', ...Array.from(new Set(forType.map((t) => t.permissionGroup)))], [forType]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return forType.filter((t) =>
      (group === 'All' || t.permissionGroup === group) &&
      (!q || t.permissionName.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)),
    );
  }, [forType, group, search]);

  const favs = filtered.filter((t) => favorites.has(t.id));
  const others = filtered.filter((t) => !favorites.has(t.id));

  const toggleFav = (id: string) => {
    setFavoritesArr((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const openTile = (tile: PermTile) => {
    if (usedCount >= MAX_LIMIT) { setLimitOpen(true); return; }
    nav('/builder/new');
    void tile;
  };

  const tabCount = (t: PermTile['permissionType']) => tiles.filter((x) => x.permissionType === t).length;

  const renderTile = (t: PermTile) => (
    <Box key={t.id} onClick={() => openTile(t)}
      sx={{
        p: 2, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper',
        cursor: 'pointer', transition: 'box-shadow 0.15s',
        '&:hover': { boxShadow: 2, borderColor: 'primary.light' },
      }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{
            width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.50',
            color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <NoCrashOutlinedIcon fontSize="small" />
          </Box>
          <Chip label={t.permissionGroup} size="small" variant="outlined" />
        </Stack>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleFav(t.id); }}>
          {favorites.has(t.id)
            ? <StarIcon fontSize="small" sx={{ color: '#f5a623' }} />
            : <StarBorderIcon fontSize="small" />}
        </IconButton>
      </Stack>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>{t.permissionName}</Typography>
      <Typography variant="body2" color="text.secondary">{t.description}</Typography>
    </Box>
  );

  const grid = (items: PermTile[]) => (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
      gap: 2,
    }}>
      {items.map(renderTile)}
    </Box>
  );

  return (
    <Box>
      <PageHeader eyebrow="Applications" title="Explore Applications"
        description="Browse available permissions by type — search, favourite, and start a new application." />

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setGroup('All'); }}
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }} variant="scrollable">
          {TYPES.map((t) => (
            <Tab key={t} icon={iconFor(t)} iconPosition="start"
              label={`${t}s (${tabCount(t)})`} />
          ))}
        </Tabs>

        <Box sx={{ p: 2 }}>
          {forType.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
              No {activeType.toLowerCase()}s available.
            </Typography>
          ) : (
            <>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
                <TextField size="small" placeholder="Search" sx={{ minWidth: 280 }}
                  value={search} onChange={(e) => setSearch(e.target.value)} />
                <TextField size="small" select label="Permission Group" sx={{ minWidth: 200 }}
                  value={group} onChange={(e) => setGroup(e.target.value)}>
                  {groups.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </TextField>
              </Stack>

              {favs.length > 0 && (
                <Accordion defaultExpanded elevation={0} sx={{ border: 1, borderColor: 'divider', mb: 2, '&::before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Favorites ({favs.length})</Typography>
                  </AccordionSummary>
                  <AccordionDetails>{grid(favs)}</AccordionDetails>
                </Accordion>
              )}

              <Accordion defaultExpanded elevation={0} sx={{ border: 1, borderColor: 'divider', '&::before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Permissions ({others.length})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {others.length === 0
                    ? <Typography variant="body2" color="text.secondary">No matching permissions.</Typography>
                    : grid(others)}
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </Box>
      </Box>

      <Dialog open={limitOpen} onClose={() => setLimitOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Purchase Limit Reached
          <IconButton size="small" onClick={() => setLimitOpen(false)}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            You have exceeded the purchase limit ({MAX_LIMIT}) for this application. You can purchase other available applications.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setLimitOpen(false)}>Okay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
