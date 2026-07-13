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
  // Sticky field-level errors: once the user attempts Publish, keep them visible
  // per-section (they auto-clear when the field is filled).
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  // A tick that bumps whenever the user navigates tabs / sub-sections, forcing
  // liveValidation to re-read persisted sub-section state from localStorage so
  // the sub-nav + top-tab badges stay in sync.
  const validationTick = `${topTab}|${sub}|${showFieldErrors}`;

  // Read persisted sub-section state so the validator sees the true form state
  // (sub-sections write to per-permission localStorage keys).
  const readComposedFromStorage = () => {
    const pid = id || 'default';
    const readJson = <T,>(key: string): T | null => {
      try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
      } catch { return null; }
    };
    const payment = readJson<{ creditCard: boolean; debitCard: boolean; costCentre: boolean; scratchVoucher: boolean; freeOfCharge: boolean }>(`prototype:paymentSettings:${pid}`);
    const methods: string[] = [];
    if (payment) {
      if (payment.creditCard)     methods.push('creditCard');
      if (payment.debitCard)      methods.push('debitCard');
      if (payment.costCentre)     methods.push('costCentre');
      if (payment.scratchVoucher) methods.push('scratchVoucher');
      if (payment.freeOfCharge)   methods.push('freeOfCharge');
    } else {
      // First-visit default in PaymentSettingsSection has credit + debit enabled.
      methods.push('creditCard', 'debitCard');
    }

    const docs = readJson<{ rows: Array<{ name?: string }> }>(`prototype:documentTypes:${pid}`);
    const documentTypes = (docs?.rows ?? []).filter((r) => (r.name || '').trim().length > 0);
    const documentTypesDefault = docs === null
      ? [{ name: 'Proof of Residency' }, { name: 'Vehicle Ownership (V5C)' }, { name: 'Utility Bill' }]
      : documentTypes;

    const rules = readJson<{
      refund: { applicable: 'yes' | 'no'; policy: string; cancellationCharge: string };
      vehicle: { plateChangeLimit: string };
      template: { activeTab: string; permitMode: string };
    }>(`prototype:rules:${pid}`);
    // The rules tab persists `template.permitMode` for the tab widget but the
    // validator uses General Settings' permitMode; we merge the template
    // fields the validator expects (defaulting to empty so it flags when
    // physical mode is chosen and no template configured).
    const composedRules = {
      refund:   rules?.refund   ?? { applicable: 'no', policy: '', cancellationCharge: '' },
      vehicle:  rules?.vehicle  ?? { plateChangeLimit: '3' },
      template: {
        physicalPermit:    '', // TemplateEditor uses defaultValue only — never persists
        whiteMailReminder: '',
      },
    };

    const pricing = readJson<Record<string, unknown>>(`prototype:pricing:${pid}`);

    const form = readJson<{ pages?: unknown[]; selectedTemplate?: unknown }>(`prototype:applicationForm:${pid}`);
    const applicationForms = form && (form.selectedTemplate || (Array.isArray(form.pages) && form.pages.length > 0))
      ? [{ id: 'form-1' }]
      : [];

    return { methods, documentTypes: documentTypesDefault, rules: composedRules, pricing, applicationForms };
  };

  // Live validation preview — recomputed whenever any tracked state changes.
  // Sub-section persisted state is re-read on every tab/sub navigation via
  // `validationTick` so the badges stay accurate.
  const liveValidation = useMemo(() => {
    const store = readComposedFromStorage();
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
      paymentSettings: { methods: store.methods },
      documentTypes: store.documentTypes,
      pricing: store.pricing ?? (perm as any)?.pricing,
      applicationForms: store.applicationForms,
      rules: store.rules,
      specialEvents: (perm as any)?.specialEvents,
    };
    return validatePermissionForPublish(composed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, type, group, category, description, gs, perm, validationTick]);

  // Section → error count (for sub-nav badges)
  const sectionErrorCount = useMemo(
    () => getErrorCountBySection(liveValidation.errors),
    [liveValidation]
  );

  // Helper: has this field been flagged and should we render red text?
  const fieldError = (section: string, field: string): string | null => {
    if (!showFieldErrors) return null;
    const e = liveValidation.errors.find((x) => x.section === section && x.field === field);
    return e ? e.message : null;
  };

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
      retentionDays: '90', prefix: '', termsAndConditions: '',
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
      const store = readComposedFromStorage();
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
        paymentSettings: { methods: store.methods },
        documentTypes: store.documentTypes,
        pricing: store.pricing ?? (perm as any)?.pricing,
        applicationForms: store.applicationForms,
        rules: store.rules,
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
          <MuiLink data-testid="crumb-builder" component={RouterLink} to="/builder" underline="hover" sx={{ color: tokens.INK, fontWeight: 500, fontFamily: tokens.HEADING, fontSize: '1rem' }}>
            Builder
          </MuiLink>
          <ChevronRight sx={{ color: tokens.MUTED, fontSize: 18 }} />
          {!isNew && (
            <Typography data-testid="crumb-name" sx={{ color: tokens.INK, fontWeight: 500, fontFamily: tokens.HEADING, fontSize: '1rem' }}>
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
              if (r.ok) {
                showToast('Permission published', 'success');
                setShowFieldErrors(false);
              } else if (r.errors && r.errors.length > 0) {
                setShowFieldErrors(true);
                setPublishErrors(r.errors);
                // Jump to first failing Permissions sub-section
                const firstPermSub = r.errors.find((e) =>
                  (PERMISSION_SUBS as readonly string[]).includes(e.section)
                );
                if (firstPermSub) {
                  setTopTab('permissions');
                  setSub(firstPermSub.section as PermissionSub);
                } else if (r.errors[0].section.startsWith('Rules')) {
                  setTopTab('rules');
                } else if (r.errors[0].section === 'Pricing') {
                  setTopTab('pricing');
                } else if (r.errors[0].section === 'Application Form') {
                  setTopTab('application-form');
                }
              } else {
                showToast(r.error || 'Publish blocked', 'error');
              }
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
        <Tabs value={topTab} onChange={(_, v) => setTopTab(v)} data-testid="builder-top-tabs">
          <Tab
            data-testid="tab-permissions"
            label={<TabLabelWithBadge label="Permissions" count={showFieldErrors ? (
              Object.entries(sectionErrorCount).filter(([s]) => (PERMISSION_SUBS as readonly string[]).includes(s)).reduce((n, [, c]) => n + c, 0)
            ) : 0} />}
            value="permissions"
            sx={topTabSx}
          />
          <Tab
            data-testid="tab-rules"
            label={<TabLabelWithBadge label="Rules" count={showFieldErrors ? (
              Object.entries(sectionErrorCount).filter(([s]) => s.startsWith('Rules')).reduce((n, [, c]) => n + c, 0)
            ) : 0} />}
            value="rules"
            sx={topTabSx}
          />
          <Tab
            data-testid="tab-pricing"
            label={<TabLabelWithBadge label="Pricing" count={showFieldErrors ? (sectionErrorCount['Pricing'] ?? 0) : 0} />}
            value="pricing"
            sx={topTabSx}
          />
          <Tab
            data-testid="tab-application-form"
            label={<TabLabelWithBadge label="Application Form" count={showFieldErrors ? (sectionErrorCount['Application Form'] ?? 0) : 0} />}
            value="application-form"
            sx={topTabSx}
          />
          <Tab data-testid="tab-custom-fields" label="Custom Fields" value="custom-fields" sx={topTabSx} />
        </Tabs>
      </Box>

      {/* Global publish-error banner */}
      {showFieldErrors && liveValidation.errors.length > 0 && (
        <Alert
          severity="error"
          icon={<ErrorOutlineOutlined />}
          action={
            <Button color="inherit" size="small" onClick={() => setPublishErrors(liveValidation.errors)}>
              View all ({liveValidation.errors.length})
            </Button>
          }
          sx={{ mx: 3, mt: 2 }}
        >
          {liveValidation.errors.length} field(s) still need to be filled before you can publish.
        </Alert>
      )}

      {/* Body */}
      <Box sx={{ px: 3, py: 3, minHeight: 'calc(100vh - 210px)' }}>
        {topTab === 'permissions' && (
          <Stack direction="row" spacing={2.5} alignItems="stretch">
            {/* Left sub-nav */}
            <Paper sx={{ width: 260, p: 1.25, alignSelf: 'flex-start' }}>
              <Stack spacing={0.25}>
                {PERMISSION_SUBS.map((s) => {
                  const active = s === sub;
                  const errCount = showFieldErrors ? (sectionErrorCount[s] ?? 0) : 0;
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
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        '&:hover': { bgcolor: active ? '#E3ECF7' : '#F4F6F9' },
                      }}
                    >
                      <span>{s}</span>
                      {errCount > 0 && (
                        <Chip
                          label={errCount}
                          size="small"
                          color="error"
                          sx={{ height: 20, minWidth: 20, '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem', fontWeight: 700 } }}
                        />
                      )}
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

                  <FormRow label="Permission Name" required error={fieldError('Basic Information', 'Permission Name')}>
                    <TextField placeholder="Enter Permission Name" value={name} onChange={(e) => setName(e.target.value)}
                      error={!!fieldError('Basic Information', 'Permission Name')} fullWidth />
                  </FormRow>
                  <FormRow label="Type" required error={fieldError('Basic Information', 'Type')}>
                    <Select displayEmpty value={type} onChange={(e) => { setType(e.target.value); setGroup(''); }} fullWidth
                      error={!!fieldError('Basic Information', 'Type')}
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
                  <FormRow label="Group" required error={fieldError('Basic Information', 'Group')}>
                    <Select displayEmpty value={group} onChange={(e) => setGroup(e.target.value)} fullWidth
                      error={!!fieldError('Basic Information', 'Group')}>
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
                  <FormRow label="Description" required error={fieldError('Basic Information', 'Description')}>
                    <TextField
                      placeholder="Enter Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      multiline minRows={4}
                      fullWidth
                      error={!!fieldError('Basic Information', 'Description')}
                    />
                  </FormRow>
                </>
              )}

              {sub !== 'Basic Information' && sub !== 'General Settings' && sub !== 'Zone Mapping' && (
                <>
                  {sub === 'Permission Label'        && <PermissionLabelSection        permissionId={id || 'default'} showErrors={showFieldErrors} />}
                  {sub === 'Payment Settings'        && <PaymentSettingsSection        permissionId={id || 'default'} showErrors={showFieldErrors} error={fieldError('Payment Settings', 'Payment Methods')} />}
                  {sub === 'Discount Settings'       && <DiscountSettingsSection       permissionId={id || 'default'} showErrors={showFieldErrors} />}
                  {sub === 'Document Type Settings'  && <DocumentTypeSettingsSection   permissionId={id || 'default'} showErrors={showFieldErrors} error={fieldError('Document Type Settings', 'Documents')} />}
                  {sub === 'Merchant Settings'       && <MerchantSettingsSection       permissionId={id || 'default'} showErrors={showFieldErrors} />}
                  {sub === 'Renewals and Reminders'  && <RenewalsAndRemindersSection   permissionId={id || 'default'} showErrors={showFieldErrors} />}
                  {sub === 'Email Templates'         && <EmailTemplatesSection         permissionId={id || 'default'} showErrors={showFieldErrors} />}
                  {sub === 'Visitor Portal Settings' && <VisitorPortalSettingsSection  permissionId={id || 'default'} showErrors={showFieldErrors} />}
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

                  <FormRow label="Start Date Policy" required error={fieldError('General Settings', 'Start Date Settings')}>
                    <Select displayEmpty value={gs.startDatePolicy} onChange={(e) => gsSet('startDatePolicy', e.target.value)} fullWidth
                      error={!!fieldError('General Settings', 'Start Date Settings')}>
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

                  <FormRow label="Prefix" required info="Prefix will be prepended to every permit number (US-137749). Max 10 alphanumeric characters." error={fieldError('General Settings', 'Prefix')}>
                    <Stack spacing={0.5} sx={{ width: '100%' }}>
                      <TextField
                        placeholder="Enter Prefix"
                        value={gs.prefix}
                        onChange={(e) => gsSet('prefix', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                        disabled={isPublished}
                        error={!!fieldError('General Settings', 'Prefix')}
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

                  <FormRow label="Terms and Conditions" required error={fieldError('General Settings', 'Terms & Conditions')}>
                    <Select displayEmpty value={gs.termsAndConditions} onChange={(e) => gsSet('termsAndConditions', e.target.value)} fullWidth
                      error={!!fieldError('General Settings', 'Terms & Conditions')}>
                      <MenuItem value=""><em style={{ color: tokens.MUTED, fontStyle: 'normal' }}>Select</em></MenuItem>
                      <MenuItem value="standard">Standard T&C v1</MenuItem>
                      <MenuItem value="visitor">Visitor T&C v2</MenuItem>
                      <MenuItem value="business">Business T&C v1</MenuItem>
                    </Select>
                  </FormRow>

                  <FormRow label="Display Description" required error={fieldError('General Settings', 'Display Description')}>
                    <TextField
                      placeholder="Enter Display Description"
                      value={gs.displayDescription}
                      onChange={(e) => gsSet('displayDescription', e.target.value)}
                      multiline minRows={3}
                      fullWidth
                      error={!!fieldError('General Settings', 'Display Description')}
                    />
                  </FormRow>

                  <FormRow label="Permit Mode" required error={fieldError('General Settings', 'Permit Mode')}>
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

        {topTab === 'rules' && <RulesTab
          permissionId={id || 'default'}
          showErrors={showFieldErrors}
          validationErrors={liveValidation.errors}
          permitMode={gs.permitMode}
        />}
        {topTab === 'pricing' && <PricingTab
          permissionId={id || 'default'}
          showErrors={showFieldErrors}
          error={fieldError('Pricing', 'Pricing Configuration')}
        />}
        {topTab === 'application-form' && <ApplicationFormTab
          permissionId={id || 'default'}
          showErrors={showFieldErrors}
          error={fieldError('Application Form', 'Forms')}
        />}
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
      <Dialog open={!!publishErrors} onClose={() => setPublishErrors(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorOutlineOutlined color="error" />
          Please fix the following before publishing ({publishErrors?.length ?? 0})
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '60vh' }}>
          {publishErrors && Object.entries(getErrorCountBySection(publishErrors)).map(([section, count]) => {
            const jumpTo = () => {
              setPublishErrors(null);
              if ((PERMISSION_SUBS as readonly string[]).includes(section)) {
                setTopTab('permissions');
                setSub(section as PermissionSub);
              } else if (section.startsWith('Rules')) {
                setTopTab('rules');
              } else if (section === 'Pricing') {
                setTopTab('pricing');
              } else if (section === 'Application Form') {
                setTopTab('application-form');
              }
            };
            return (
              <Box key={section} sx={{ mb: 2, p: 1.5, borderRadius: 1, border: '1px solid #F5C6C6', bgcolor: '#FFF5F5', cursor: 'pointer', '&:hover': { bgcolor: '#FFEEEE' } }} onClick={jumpTo}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#C62828' }}>{section}</Typography>
                    <Chip label={count} size="small" color="error" />
                  </Stack>
                  <Typography variant="caption" sx={{ color: tokens.NAVY, fontWeight: 600 }}>Go to section →</Typography>
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
            );
          })}
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

function TabLabelWithBadge({ label, count }: { label: string; count: number }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <span>{label}</span>
      {count > 0 && (
        <Chip label={count} size="small" color="error" sx={{ height: 18, minWidth: 18, '& .MuiChip-label': { px: 0.6, fontSize: '0.68rem', fontWeight: 700 } }} />
      )}
    </Stack>
  );
}

function FormRow({ label, children, optional, info, required, error }: { label: string; children: React.ReactNode; optional?: boolean; info?: string; required?: boolean; error?: string | null }) {
  return (
    <Stack data-field={label} direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-start' }} sx={{ mb: 2.5 }}>
      <Box sx={{ width: { md: 220 }, pt: { md: 1 } }}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography sx={{ fontSize: '0.95rem', color: tokens.INK, fontWeight: 500 }}>
            {label}
            {required && <Typography component="span" sx={{ color: '#C62828', ml: 0.4 }}>*</Typography>}
            {optional && <Typography component="span" sx={{ color: tokens.MUTED, fontSize: '0.8rem', ml: 0.75 }}>(optional)</Typography>}
          </Typography>
          {info && (
            <Tooltip title={info} arrow>
              <ErrorOutlineOutlined sx={{ fontSize: 16, color: '#E9A400' }} />
            </Tooltip>
          )}
        </Stack>
      </Box>
      <Box sx={{ flex: 1 }}>
        {children}
        {error && (
          <Typography sx={{ color: '#C62828', fontSize: '0.75rem', mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ErrorOutlineOutlined sx={{ fontSize: 14 }} />
            {error}
          </Typography>
        )}
      </Box>
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
