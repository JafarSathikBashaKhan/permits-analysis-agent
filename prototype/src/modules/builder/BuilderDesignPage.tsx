import {
  Box, Button, IconButton, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField, Typography, Divider, Menu, Link as MuiLink,
  Radio, RadioGroup, FormControlLabel, Checkbox, InputAdornment, Tooltip, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText, Chip,
} from '@mui/material';
import {
  SaveOutlined, UploadOutlined, MoreVertOutlined, ChevronRight, ErrorOutlineOutlined, AddOutlined,
} from '@mui/icons-material';
import { useMemo, useState, MouseEvent } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import { permissions, Permission } from '../../data/mock';
import { tokens } from '../../theme';
import { ApplicationFormTab } from './tabs/ApplicationFormTab';
import { PricingTab } from './tabs/PricingTab';
import { RulesTab } from './tabs/RulesTab';
import { CustomFieldsTab } from './tabs/CustomFieldsTab';
import {
  PermissionLabelSection, PaymentSettingsSection, DiscountSettingsSection,
  DocumentTypeSettingsSection, MerchantSettingsSection, RenewalsAndRemindersSection,
  EmailTemplatesSection, VisitorPortalSettingsSection,
} from './tabs/PermissionSubSections';
import { usePersistentState } from '../../hooks/usePersistentState';
import { BUILDER_ROWS_KEY } from './BuilderListPage';
import { PERMISSION_TYPE_OPTIONS, PERMISSION_CATEGORY_OPTIONS, BUSINESS_RULES } from '../../constants/enums';
import { checkPrefixDuplicate, validatePermissionForPublish, getErrorCountBySection, ValidationError } from './publishValidation';
import { UnsavedChangesGuard } from '../../hooks/UnsavedChangesGuard';

type Group = {
  id: string;
  name: string;
  permissionType: string;
  groupType: 'Zonal' | 'Non-Zonal';
  householdLimit: number;
  maxVouchers: number;
  backOfficeUse: boolean;
  status: 'Active' | 'InActive';
  linkedPermissions: number;
  createdOn: string;
  createdByUser: string;
  updatedOn: string;
  updatedByUser: string;
};

const seedGroups = (): Group[] => [];

type TopTab = 'permissions' | 'rules' | 'pricing' | 'application-form' | 'custom-fields';

const PERMISSION_SUBS = [
  'Basic Information',
  'General Settings',
  'Zone Mapping',
  'Permission Label',
  'Payment Settings',
  'Discount Settings',
  'Document Type Settings',
  'Merchant Settings',
  'Renewals and Reminders',
  'Email Templates',
  'Visitor Portal Settings',
] as const;
type PermissionSub = typeof PERMISSION_SUBS[number];

export function BuilderDesignPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const showToast = useToast();
  const isNew = id === 'new';
  const [builderRows, setBuilderRows] = usePersistentState<Permission[]>(BUILDER_ROWS_KEY, () => [...permissions]);
  const perm = useMemo(() => builderRows.find((p) => p.id === id), [builderRows, id]);
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

  // Form state (General Settings)
  const [gs, setGs] = useState({
    specialEvent: 'disable',
    startDatePolicy: '',
    permitDaysSelection: 'disable',
    retentionDays: '90',
    prefix: '',
    termsAndConditions: '',
    displayDescription: '',
    permitMode: 'both',
    backOfficeUse: false,
    vatApplicable: false,
    hoursOfOperation: false,
    enableExperianCheck: false,
    businessName: false,
    businessAddress: false,
    commentBox: false,
    adminFee: '',
  });
  const gsSet = <K extends keyof typeof gs>(k: K, v: (typeof gs)[K]) => setGs((p) => ({ ...p, [k]: v }));

  // Permission limit (Basic Information)
  const [permissionLimit, setPermissionLimit] = useState('');

  // US-155975 — validation errors dialog state
  const [publishErrors, setPublishErrors] = useState<ValidationError[] | null>(null);

  const [persistedGroups] = usePersistentState<Group[]>('prototype:builder:groups:rows', seedGroups);
  const allGroups = useMemo(
    () => (persistedGroups && persistedGroups.length > 0 ? persistedGroups : []),
    [persistedGroups]
  );
  const availableGroups = type ? allGroups.filter(g => g.permissionType === type && g.status === 'Active').map(g => g.name) : allGroups.filter(g => g.status === 'Active').map(g => g.name);

  // US-188673 — lock Type + Prefix after publish
  const isPublished = perm?.status === 'Published';

  // US-164796 — track dirty state to trigger the unsaved-changes guard
  const [baseline, setBaseline] = useState(() => JSON.stringify({
    name: perm?.name ?? '', type: perm?.type ?? '', group: perm?.group ?? '',
    category: perm?.category ?? '', description: '', permissionLimit: '',
    gs: {
      specialEvent: 'disable', startDatePolicy: '', permitDaysSelection: 'disable',
      retentionDays: '90', prefix: perm?.prefix ?? '', termsAndConditions: '',
      displayDescription: '', permitMode: 'both', backOfficeUse: false,
      vatApplicable: false, hoursOfOperation: false, enableExperianCheck: false,
      businessName: false, businessAddress: false, commentBox: false, adminFee: '',
    },
  }));
  const currentSnapshot = JSON.stringify({ name, type, group, category, description, permissionLimit, gs });
  const dirty = currentSnapshot !== baseline;

  // Shared persist function used by both Save Draft and the Unsaved Changes guard.
  const persistEntry = (status: 'Draft' | 'Published'): { ok: boolean; error?: string; errors?: ValidationError[] } => {
    const newId = isNew ? `P-${Date.now()}` : (id ?? `P-${Date.now()}`);

    // US-155975 — full mandatory-field validation before Publish.
    if (status === 'Published') {
      const composed = {
        name, type, group, category, description,
        generalSettings: {
          startDatePolicy: gs.startDatePolicy,
          prefix: gs.prefix,
          termsAndConditions: gs.termsAndConditions,
          displayDescription: gs.displayDescription,
          permitMode: gs.permitMode,
          specialEvent: gs.specialEvent,
        },
        zones: (perm?.zones ?? 0) > 0 ? new Array(perm?.zones ?? 0).fill(0) : [],
        paymentSettings: (perm as any)?.paymentSettings,
        documentTypes: (perm as any)?.documentTypes,
        pricing: (perm as any)?.pricing,
        applicationForms: (perm as any)?.applicationForms,
        rules: (perm as any)?.rules ?? { vehicle: {}, template: {}, refund: {} },
        specialEvents: (perm as any)?.specialEvents,
      };
      const result = validatePermissionForPublish(composed);
      if (!result.valid) {
        return { ok: false, error: 'Please fix the mandatory fields before publishing.', errors: result.errors };
      }
    }

    // US-188673 — prefix duplicate validation across permission types (per contract).
    if (gs.prefix?.trim()) {
      const dupMsg = checkPrefixDuplicate(gs.prefix, type || 'Permit', newId, builderRows);
      if (dupMsg) return { ok: false, error: dupMsg };
    }

    const entry: Permission = {
      id: newId,
      name: name || 'Untitled',
      type: (type || 'Permit') as Permission['type'],
      group: group || 'General',
      category: (category || 'Resident') as Permission['category'],
      status,
      prefix: gs.prefix?.trim().toUpperCase() || '',
      price: 0,
      version: (perm?.version ?? 0) + 1,
      lastUpdated: new Date().toISOString().slice(0, 10),
      createdBy: perm?.createdBy ?? 'You',
      zones: perm?.zones ?? 0,
      documents: perm?.documents ?? 0,
    };
    setBuilderRows((prev) => {
      const exists = prev.some((r) => r.id === newId);
      return exists
        ? prev.map((r) => r.id === newId ? { ...r, ...entry } : r)
        : [entry, ...prev];
    });
    // Reset baseline so guard clears
    setBaseline(currentSnapshot);
    if (isNew) nav(`/builder/${newId}`, { replace: true });
    return { ok: true };
  };

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
            onClick={() => {
              const r = persistEntry('Draft');
              if (r.ok) showToast('Draft saved', 'success');
              else showToast(r.error || 'Save failed', 'error');
            }}
            sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadOutlined />}
            onClick={() => {
              const r = persistEntry('Published');
              if (r.ok) showToast('Permission published', 'success');
              else if (r.errors && r.errors.length > 0) setPublishErrors(r.errors);
              else showToast(r.error || 'Publish blocked', 'error');
            }}
            sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
          >
            Publish
          </Button>
          <IconButton onClick={openMenu}><MoreVertOutlined /></IconButton>
          <Menu anchorEl={anchor} open={!!anchor} onClose={closeMenu}>
            <MenuItem onClick={() => {
              const newId = `P-${Date.now()}`;
              const entry: Permission = {
                id: newId,
                name: `${name || 'Untitled'} (Copy)`,
                type: (type || 'Resident') as Permission['type'],
                group: group || 'General',
                category: (category || 'Resident') as Permission['category'],
                status: 'Draft',
                prefix: '',
                price: 0,
                version: 1,
                lastUpdated: new Date().toISOString().slice(0, 10),
                createdBy: 'You',
                zones: 0,
                documents: 0,
              };
              setBuilderRows((prev) => [entry, ...prev]);
              showToast('Permission cloned', 'success');
              nav(`/builder/${newId}`);
              closeMenu();
            }}>Clone permission</MenuItem>
            <MenuItem onClick={() => { showToast('View history — coming soon', 'info'); closeMenu(); }}>View history</MenuItem>
            <MenuItem onClick={() => {
              if (id && id !== 'new') {
                setBuilderRows((prev) => prev.filter((r) => r.id !== id));
                showToast('Permission deleted', 'success');
                nav('/builder');
              }
              closeMenu();
            }} sx={{ color: '#C62828' }}>Delete</MenuItem>
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
          <Tab label="Custom Fields" value="custom-fields" sx={topTabSx} />
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
                    <Select displayEmpty value={type} onChange={(e) => { setType(e.target.value); setGroup(''); }} fullWidth
                      disabled={isPublished}>
                      <MenuItem value=""><em style={{ color: tokens.MUTED, fontStyle: 'normal' }}>Select</em></MenuItem>
                      {PERMISSION_TYPE_OPTIONS.map((o) => <MenuItem key={o.id} value={o.label}>{o.label}</MenuItem>)}
                    </Select>
                    {isPublished && (
                      <Typography variant="caption" sx={{ color: tokens.MUTED, mt: 0.5, display: 'block' }}>
                        Type cannot be changed after the permission is published (US-188673).
                      </Typography>
                    )}
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
                      {PERMISSION_CATEGORY_OPTIONS.map((o) => <MenuItem key={o.id} value={o.label}>{o.label}</MenuItem>)}
                    </Select>
                  </FormRow>
                  <FormRow label="Permission Limit" optional>
                    <TextField
                      placeholder={`${BUSINESS_RULES.PERMISSION_LIMIT_MIN}–${BUSINESS_RULES.PERMISSION_LIMIT_MAX}`}
                      type="number"
                      value={permissionLimit}
                      onChange={(e) => setPermissionLimit(e.target.value)}
                      inputProps={{ min: BUSINESS_RULES.PERMISSION_LIMIT_MIN, max: BUSINESS_RULES.PERMISSION_LIMIT_MAX }}
                      helperText={`${BUSINESS_RULES.PERMISSION_LIMIT_MIN}–${BUSINESS_RULES.PERMISSION_LIMIT_MAX} permits per property`}
                      sx={{ maxWidth: 200 }}
                    />
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

              {sub !== 'Basic Information' && sub !== 'General Settings' && sub !== 'Zone Mapping' && (
                <>
                  {sub === 'Permission Label'        && <PermissionLabelSection        permissionId={id || 'default'} />}
                  {sub === 'Payment Settings'        && <PaymentSettingsSection        permissionId={id || 'default'} />}
                  {sub === 'Discount Settings'       && <DiscountSettingsSection       permissionId={id || 'default'} />}
                  {sub === 'Document Type Settings'  && <DocumentTypeSettingsSection   permissionId={id || 'default'} />}
                  {sub === 'Merchant Settings'       && <MerchantSettingsSection       permissionId={id || 'default'} />}
                  {sub === 'Renewals and Reminders'  && <RenewalsAndRemindersSection   permissionId={id || 'default'} />}
                  {sub === 'Email Templates'         && <EmailTemplatesSection         permissionId={id || 'default'} />}
                  {sub === 'Visitor Portal Settings' && <VisitorPortalSettingsSection  permissionId={id || 'default'} />}
                </>
              )}

              {sub === 'Zone Mapping' && (
                <>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.15rem', color: tokens.INK }}>
                      Zone Mapping
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddOutlined />}
                      sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
                    >
                      New Zone Set
                    </Button>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Alert
                    severity="info"
                    icon={<ErrorOutlineOutlined sx={{ color: tokens.NAVY }} />}
                    sx={{
                      bgcolor: '#E3ECF7',
                      color: tokens.INK,
                      border: `1px solid #C7D6EA`,
                      '& .MuiAlert-icon': { color: tokens.NAVY, alignItems: 'center' },
                    }}
                  >
                    Zone limits for this permission are set to <strong>No Limit</strong> by default. If required, they can be configured by saving the permission as Draft.
                  </Alert>
                </>
              )}

              {sub === 'General Settings' && (
                <>
                  <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.15rem', color: tokens.INK }}>
                    General Settings
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <FormRow label="Special Event">
                    <RadioGroup row value={gs.specialEvent} onChange={(e) => gsSet('specialEvent', e.target.value)}>
                      <FormControlLabel value="enable" control={<Radio />} label="Enable" sx={{ mr: 5 }} />
                      <FormControlLabel value="disable" control={<Radio />} label="Disable" />
                    </RadioGroup>
                  </FormRow>

                  <FormRow label="Start Date Policy">
                    <Select displayEmpty value={gs.startDatePolicy} onChange={(e) => gsSet('startDatePolicy', e.target.value)} fullWidth>
                      <MenuItem value=""><em style={{ color: tokens.MUTED, fontStyle: 'normal' }}>Select</em></MenuItem>
                      <MenuItem value="immediate">Immediate</MenuItem>
                      <MenuItem value="next-day">Next Day</MenuItem>
                      <MenuItem value="custom">Custom Date</MenuItem>
                    </Select>
                  </FormRow>

                  <FormRow label="Permit Days Selection">
                    <RadioGroup row value={gs.permitDaysSelection} onChange={(e) => gsSet('permitDaysSelection', e.target.value)}>
                      <FormControlLabel value="enable" control={<Radio />} label="Enable" sx={{ mr: 5 }} />
                      <FormControlLabel value="disable" control={<Radio />} label="Disable" />
                    </RadioGroup>
                  </FormRow>

                  <FormRow label="Retention Period Expired Permits" info="Number of days expired permits are retained before archival.">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <TextField
                        type="number"
                        value={gs.retentionDays}
                        onChange={(e) => gsSet('retentionDays', e.target.value)}
                        sx={{ width: 200 }}
                      />
                      <Typography sx={{ color: tokens.INK }}>Days</Typography>
                    </Stack>
                  </FormRow>

                  <FormRow label="Prefix" info="Prefix will be prepended to every permit number (US-137749). Max 10 alphanumeric characters.">
                    <Stack spacing={0.5} sx={{ width: '100%' }}>
                      <TextField
                        placeholder="Enter Prefix"
                        value={gs.prefix}
                        onChange={(e) => gsSet('prefix', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                        disabled={isPublished}
                        inputProps={{ maxLength: 10, style: { textTransform: 'uppercase', fontFamily: 'monospace' } }}
                        helperText={gs.prefix ? `Applications will be numbered like "${gs.prefix}-XXXXXXXX"` : ''}
                      />
                      {isPublished && (
                        <Typography variant="caption" sx={{ color: tokens.MUTED }}>
                          Prefix cannot be changed after the permission is published (US-188673).
                        </Typography>
                      )}
                    </Stack>
                  </FormRow>

                  <FormRow label="Terms and Conditions">
                    <Select displayEmpty value={gs.termsAndConditions} onChange={(e) => gsSet('termsAndConditions', e.target.value)} fullWidth>
                      <MenuItem value=""><em style={{ color: tokens.MUTED, fontStyle: 'normal' }}>Select</em></MenuItem>
                      <MenuItem value="standard">Standard T&C v1</MenuItem>
                      <MenuItem value="visitor">Visitor T&C v2</MenuItem>
                      <MenuItem value="business">Business T&C v1</MenuItem>
                    </Select>
                  </FormRow>

                  <FormRow label="Display Description" optional>
                    <TextField
                      placeholder="Enter Display Description"
                      value={gs.displayDescription}
                      onChange={(e) => gsSet('displayDescription', e.target.value)}
                      multiline minRows={3}
                    />
                  </FormRow>

                  <FormRow label="Permit Mode">
                    <Stack spacing={1}>
                      <RadioGroup row value={gs.permitMode} onChange={(e) => gsSet('permitMode', e.target.value)}>
                        <FormControlLabel value="virtual" control={<Radio />} label="Virtual Permit" sx={{ mr: 4 }} />
                        <FormControlLabel value="physical" control={<Radio />} label="Physical Permit" sx={{ mr: 4 }} />
                        <FormControlLabel value="both" control={<Radio />} label="Both" />
                      </RadioGroup>
                      <Stack direction="row" spacing={4}>
                        <FormControlLabel
                          control={<Checkbox checked={gs.backOfficeUse} onChange={(e) => gsSet('backOfficeUse', e.target.checked)} />}
                          label="Back Office Use"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={gs.vatApplicable} onChange={(e) => gsSet('vatApplicable', e.target.checked)} />}
                          label="VAT Applicable"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={gs.hoursOfOperation} onChange={(e) => gsSet('hoursOfOperation', e.target.checked)} />}
                          label="Hours of Operation"
                        />
                      </Stack>
                    </Stack>
                  </FormRow>

                  <FormRow label="Other Settings" optional>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={4}>
                        <FormControlLabel
                          control={<Checkbox checked={gs.enableExperianCheck} onChange={(e) => gsSet('enableExperianCheck', e.target.checked)} />}
                          label="Enable Experian Check"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={gs.businessName} onChange={(e) => gsSet('businessName', e.target.checked)} />}
                          label="Business Name"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={gs.businessAddress} onChange={(e) => gsSet('businessAddress', e.target.checked)} />}
                          label="Business Address"
                        />
                      </Stack>
                      <FormControlLabel
                        control={<Checkbox checked={gs.commentBox} onChange={(e) => gsSet('commentBox', e.target.checked)} />}
                        label="Comment Box"
                      />
                    </Stack>
                  </FormRow>

                  <FormRow label="Admin fee for Permission" optional>
                    <TextField
                      placeholder="Enter Admin Fee"
                      type="number"
                      value={gs.adminFee}
                      onChange={(e) => gsSet('adminFee', e.target.value)}
                      InputProps={{ startAdornment: <InputAdornment position="start">£</InputAdornment> }}
                      inputProps={{ min: BUSINESS_RULES.ADMIN_FEE_MIN, max: BUSINESS_RULES.ADMIN_FEE_MAX, step: 0.01 }}
                      helperText={`£${BUSINESS_RULES.ADMIN_FEE_MIN} – £${BUSINESS_RULES.ADMIN_FEE_MAX.toLocaleString()}`}
                    />
                  </FormRow>
                </>
              )}
            </Paper>
          </Stack>
        )}

        {topTab === 'rules' && <RulesTab permissionId={id || 'default'} />}
        {topTab === 'pricing' && <PricingTab permissionId={id || 'default'} />}
        {topTab === 'application-form' && <ApplicationFormTab permissionId={id || 'default'} />}
        {topTab === 'custom-fields' && <CustomFieldsTab permissionId={id || 'default'} />}
      </Box>

      {/* US-164796 — unsaved-changes guard */}
      <UnsavedChangesGuard
        dirty={dirty}
        onSave={() => {
          const r = persistEntry('Draft');
          if (!r.ok) {
            showToast(r.error || 'Save failed', 'error');
            throw new Error(r.error || 'Save failed');
          }
        }}
      />

      {/* US-155975 — Publish validation errors dialog */}
      <Dialog open={!!publishErrors} onClose={() => setPublishErrors(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorOutlineOutlined color="error" />
          Please fix the following before publishing
        </DialogTitle>
        <DialogContent dividers>
          {publishErrors && Object.entries(getErrorCountBySection(publishErrors)).map(([section, count]) => (
            <Box key={section} sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{section}</Typography>
                <Chip label={count} size="small" color="error" />
              </Stack>
              <List dense disablePadding>
                {publishErrors.filter(e => e.section === section).map((e, i) => (
                  <ListItem key={i} sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <ErrorOutlineOutlined fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={e.field}
                      secondary={e.message}
                      primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishErrors(null)} variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
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

function FormRow({ label, children, optional, info }: { label: string; children: React.ReactNode; optional?: boolean; info?: string }) {
  return (
    <Stack data-field={label} direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-start' }} sx={{ mb: 2.5 }}>
      <Box sx={{ width: { md: 220 }, pt: { md: 1 } }}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography sx={{ fontSize: '0.95rem', color: tokens.INK, fontWeight: 500 }}>
            {label}
            {optional && <Typography component="span" sx={{ color: tokens.MUTED, fontSize: '0.8rem', ml: 0.75 }}>(optional)</Typography>}
          </Typography>
          {info && (
            <Tooltip title={info} arrow>
              <ErrorOutlineOutlined sx={{ fontSize: 16, color: '#E9A400' }} />
            </Tooltip>
          )}
        </Stack>
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
