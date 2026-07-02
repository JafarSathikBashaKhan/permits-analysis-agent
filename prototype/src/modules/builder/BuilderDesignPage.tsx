import {
  Box, Button, IconButton, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField, Typography, Divider, Menu, Link as MuiLink,
} from '@mui/material';
import {
  SaveOutlined, UploadOutlined, MoreVertOutlined, ChevronRight,
} from '@mui/icons-material';
import { useMemo, useState, MouseEvent } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { permissions, permissionTypes, groupsByType, categories } from '../../data/mock';
import { tokens } from '../../theme';

type TopTab = 'permissions' | 'rules' | 'pricing' | 'application-form';

const PERMISSION_SUBS = [
  'Basic Information',
  'General Settings',
  'Permission Label',
  'Payment Settings',
  'Discount Settings',
  'Document Type Settings',
  'Merchant Settings',
  'Renewals and Reminders',
  'Email Templates',
] as const;
type PermissionSub = typeof PERMISSION_SUBS[number];

export function BuilderDesignPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = id === 'new';
  const perm = useMemo(() => permissions.find((p) => p.id === id), [id]);
  const displayName = isNew ? 'New permission' : (perm?.name ?? 'Permission');

  const [topTab, setTopTab] = useState<TopTab>('permissions');
  const [sub, setSub] = useState<PermissionSub>('Basic Information');
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const openMenu = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const closeMenu = () => setAnchor(null);

  // Form state (Basic Information)
  const [name, setName] = useState(perm?.name ?? '');
  const [type, setType] = useState<string>(perm?.type ?? '');
  const [group, setGroup] = useState<string>(perm?.group ?? '');
  const [category, setCategory] = useState<string>(perm?.category ?? '');
  const [description, setDescription] = useState('');

  const availableGroups = type ? (groupsByType[type] ?? []) : Object.values(groupsByType).flat();

  return (
    <Box sx={{ mx: -3, my: -3 }}>
      {/* Top action bar */}
      <Box sx={{
        px: 3, py: 1.75,
        bgcolor: tokens.PAPER, borderBottom: `1px solid ${tokens.LINE}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <MuiLink component={RouterLink} to="/builder" underline="hover" sx={{ color: tokens.INK, fontWeight: 500, fontFamily: tokens.HEADING, fontSize: '1rem' }}>
            Builder
          </MuiLink>
          <ChevronRight sx={{ color: tokens.MUTED, fontSize: 18 }} />
          {!isNew && (
            <Typography sx={{ color: tokens.INK, fontWeight: 500, fontFamily: tokens.HEADING, fontSize: '1rem' }}>
              {displayName}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Button
            onClick={() => nav('/builder')}
            sx={{ color: tokens.NAVY, fontWeight: 600, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveOutlined />}
            sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadOutlined />}
            sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
          >
            Publish
          </Button>
          <IconButton onClick={openMenu}><MoreVertOutlined /></IconButton>
          <Menu anchorEl={anchor} open={!!anchor} onClose={closeMenu}>
            <MenuItem onClick={closeMenu}>Clone permission</MenuItem>
            <MenuItem onClick={closeMenu}>View history</MenuItem>
            <MenuItem onClick={closeMenu} sx={{ color: '#C62828' }}>Delete</MenuItem>
          </Menu>
        </Stack>
      </Box>

      {/* Top-level tabs */}
      <Box sx={{ px: 3, pt: 2, bgcolor: tokens.PAPER, borderBottom: `1px solid ${tokens.LINE}` }}>
        <Tabs value={topTab} onChange={(_, v) => setTopTab(v)}>
          <Tab label="Permissions" value="permissions" sx={topTabSx} />
          <Tab label="Rules" value="rules" sx={topTabSx} />
          <Tab label="Pricing" value="pricing" sx={topTabSx} />
          <Tab label="Application Form" value="application-form" sx={topTabSx} />
        </Tabs>
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, py: 3, minHeight: 'calc(100vh - 210px)' }}>
        {topTab === 'permissions' && (
          <Stack direction="row" spacing={2.5} alignItems="stretch">
            {/* Left sub-nav */}
            <Paper sx={{ width: 260, p: 1.25, alignSelf: 'flex-start' }}>
              <Stack spacing={0.25}>
                {PERMISSION_SUBS.map((s) => {
                  const active = s === sub;
                  return (
                    <Box
                      key={s}
                      onClick={() => setSub(s)}
                      sx={{
                        cursor: 'pointer',
                        px: 2, py: 1.25, borderRadius: 1,
                        bgcolor: active ? '#E3ECF7' : 'transparent',
                        color: active ? tokens.NAVY : tokens.INK,
                        fontWeight: active ? 700 : 500,
                        fontSize: '0.9rem',
                        '&:hover': { bgcolor: active ? '#E3ECF7' : '#F4F6F9' },
                      }}
                    >
                      {s}
                    </Box>
                  );
                })}
              </Stack>
            </Paper>

            {/* Right content */}
            <Paper sx={{ flex: 1, p: 3 }}>
              {sub === 'Basic Information' && (
                <>
                  <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.15rem', color: tokens.INK }}>
                    Basic Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <FormRow label="Permission Name">
                    <TextField placeholder="Enter Permission Name" value={name} onChange={(e) => setName(e.target.value)} />
                  </FormRow>
                  <FormRow label="Type">
                    <Select displayEmpty value={type} onChange={(e) => { setType(e.target.value); setGroup(''); }} fullWidth>
                      <MenuItem value=""><em style={{ color: tokens.MUTED, fontStyle: 'normal' }}>Select</em></MenuItem>
                      {permissionTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </Select>
                  </FormRow>
                  <FormRow label="Group">
                    <Select displayEmpty value={group} onChange={(e) => setGroup(e.target.value)} fullWidth>
                      <MenuItem value=""><em style={{ color: tokens.MUTED, fontStyle: 'normal' }}>Select</em></MenuItem>
                      {availableGroups.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                    </Select>
                  </FormRow>
                  <FormRow label="Category">
                    <Select displayEmpty value={category} onChange={(e) => setCategory(e.target.value)} fullWidth>
                      <MenuItem value=""><em style={{ color: tokens.MUTED, fontStyle: 'normal' }}>Select</em></MenuItem>
                      {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                  </FormRow>
                  <FormRow label="Description" optional>
                    <TextField
                      placeholder="Enter Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      multiline minRows={4}
                    />
                  </FormRow>
                </>
              )}

              {sub !== 'Basic Information' && (
                <PlaceholderSection title={sub} />
              )}
            </Paper>
          </Stack>
        )}

        {topTab === 'rules' && <TopLevelPlaceholder title="Rules" />}
        {topTab === 'pricing' && <TopLevelPlaceholder title="Pricing" />}
        {topTab === 'application-form' && <TopLevelPlaceholder title="Application Form" />}
      </Box>
    </Box>
  );
}

const topTabSx = {
  textTransform: 'uppercase' as const,
  fontWeight: 700,
  letterSpacing: '0.06em',
  fontSize: '0.8rem',
  minHeight: 48,
};

function FormRow({ label, children, optional }: { label: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-start' }} sx={{ mb: 2.5 }}>
      <Box sx={{ width: { md: 180 }, pt: { md: 1 } }}>
        <Typography sx={{ fontSize: '0.95rem', color: tokens.INK, fontWeight: 500 }}>
          {label}
          {optional && <Typography component="span" sx={{ color: tokens.MUTED, fontSize: '0.8rem', ml: 0.75 }}>(optional)</Typography>}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Stack>
  );
}

function PlaceholderSection({ title }: { title: string }) {
  return (
    <>
      <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.15rem', color: tokens.INK }}>
        {title}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
        <Typography sx={{ color: tokens.MUTED }}>{title} section — coming soon.</Typography>
      </Box>
    </>
  );
}

function TopLevelPlaceholder({ title }: { title: string }) {
  return (
    <Paper sx={{ p: 6 }}>
      <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
        <Typography sx={{ color: tokens.MUTED }}>{title} — coming soon.</Typography>
      </Box>
    </Paper>
  );
}
