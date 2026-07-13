import {
  Box, Button, IconButton, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField, Typography, Divider, Menu, Link as MuiLink,
  Radio, RadioGroup, FormControlLabel, Checkbox, InputAdornment, Tooltip, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText, Chip,
} from '@mui/material';
import {
  SaveOutlined, UploadOutlined, MoreVertOutlined, ChevronRight, ErrorOutlineOutlined, AddOutlined,
} from '@mui/icons-material';
import { useEffect, useMemo, useState, MouseEvent } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import { permissions, Permission } from '../../data/mock';
import { tokens } from '../../theme';
import { ApplicationFormTab } from './tabs/ApplicationFormTab';
import { PricingConfigurationTab } from './tabs/PricingConfigurationTab';
import { RulesTab } from './tabs/RulesTab';
import { CustomFieldsTab } from './tabs/CustomFieldsTab';
import {
  PermissionLabelSection, PaymentSettingsSection, DiscountSettingsSection,
  DocumentTypeSettingsSection, MerchantSettingsSection, RenewalsAndRemindersSection,
  EmailTemplatesSection, VisitorPortalSettingsSection,
} from './tabs/PermissionSubSections';
import { SpecialEventSection } from './tabs/SpecialEventSection';
import { SpecialEventPropertiesMappingSection } from './tabs/SpecialEventPropertiesMappingSection';
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

const PERMISSION_SUBS_ALL = [
  'Basic Information',
  'General Settings',
  'Zone Mapping',
  'Special Event Properties Mapping',
  'Permission Label',
  'Payment Settings',
  'Discount Settings',
  'Document Type Settings',
  'Merchant Settings',
  'Renewals and Reminders',
  'Email Templates',
  'Operation Criteria',
  'Special Event',
  'Visitor Portal Settings',
] as const;
type PermissionSub = typeof PERMISSION_SUBS_ALL[number];

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
  const [description, setDescription] = useState(perm?.description ?? '');

  // Form state (General Settings) — persisted per-permission so Start Date Settings
  // and other Overview fields survive reload (US-132390 persistence).
  const gsKey = `prototype:builder:${id ?? 'new'}:gs`;
  const [gs, setGs] = usePersistentState(gsKey, () => ({
    specialEvent: 'disable',
    startDatePolicy: '',
    includeTime: false,
    startDateDelay: '0',
    permitDaysSelection: 'disable',
    retentionDays: '7',
    prefix: '',
    termsAndConditions: '',
    displayDescription: 'Purchase your permission with ease',
    permitMode: 'both',
    backOfficeUse: false,
    vatApplicable: false,
    hoursOfOperation: false,
    enableExperianCheck: false,
    businessName: false,
    businessAddress: false,
    commentBox: false,
    adminFee: '',
  }));
  const gsSet = <K extends keyof typeof gs>(k: K, v: (typeof gs)[K]) => setGs((p) => ({ ...p, [k]: v }));

  // Permission limit (Basic Information)
  const [permissionLimit, setPermissionLimit] = useState('');

  // US-143256 — 'Special Event' sub-section is visible only when the GS toggle is enabled.
  // US-187108 — 'Special Event Properties Mapping' shows only when SE enabled;
  //   'Zone Mapping' shows only when SE disabled (they are mutually exclusive).
  const PERMISSION_SUBS = useMemo<readonly PermissionSub[]>(() =>
    PERMISSION_SUBS_ALL.filter((s) => {
      if (s === 'Special Event') return gs.specialEvent === 'enable';
      if (s === 'Special Event Properties Mapping') return gs.specialEvent === 'enable';
      if (s === 'Zone Mapping') return gs.specialEvent !== 'enable';
      return true;
    }),
    [gs.specialEvent]
  );

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

  // US-143256 — if user is on Special Event sub and toggles it off, snap back to Basic Information.
  // US-187108 — snap Special Event Properties Mapping <-> Zone Mapping when SE toggle flips.
  useEffect(() => {
    if (sub === 'Special Event' && gs.specialEvent !== 'enable') {
      setSub('Basic Information');
    }
    if (sub === 'Special Event Properties Mapping' && gs.specialEvent !== 'enable') {
      setSub('Zone Mapping');
    }
    if (sub === 'Zone Mapping' && gs.specialEvent === 'enable') {
      setSub('Special Event Properties Mapping');
    }
  }, [gs.specialEvent, sub]);

  // US-139062 — inline duplicate-name validation for Basic Information.
  const nameInlineError = useMemo(() => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return '';
    const dup = builderRows.some((r) => r.id !== id && r.name.trim().toLowerCase() === trimmed);
    return dup ? 'The permission name already exists.' : '';
  }, [name, builderRows, id]);

  // US-135721 — live prefix validation.
  //   * Required: empty prefix -> "This field is required".
  //   * Cross-type duplicate within same contract -> exact AC message.
  const prefixInlineError = useMemo(() => {
    const raw = (gs.prefix || '').trim().toUpperCase();
    if (!raw) return 'This field is required';
    const dupCross = builderRows.some((r) =>
      r.id !== id &&
      String(r.prefix || '').trim().toUpperCase() === raw &&
      String(r.type || '').trim().toLowerCase() !== String(type || '').trim().toLowerCase()
    );
    if (dupCross) return 'This prefix is already in use for another permission type';
    return '';
  }, [gs.prefix, builderRows, id, type]);

  // US-135717 — Terms & Conditions dropdown reads live from the templates store,
  // filtered by the currently-selected Permission Type, and displayed alphabetically.
  // Empty list yields no options (empty-state handled below).
  type TnCTemplate = { id: string; templateName: string; permissionType: string; published?: boolean };
  const [tncTemplates] = usePersistentState<TnCTemplate[]>('prototype:templates:tnc:rows', () => []);
  const tncOptions = useMemo(() => {
    const t = (type || '').trim().toLowerCase();
    if (!t) return [];
    return tncTemplates
      .filter((tpl) => String(tpl.permissionType || '').trim().toLowerCase().startsWith(t))
      .slice()
      .sort((a, b) => a.templateName.localeCompare(b.templateName, undefined, { sensitivity: 'base' }));
  }, [tncTemplates, type]);

  // US-139062 — Auto-save on tab / sub-section change.
  // Only persists silently when all Basic Information mandatory fields are filled
  // (so we don't overwrite an unsaved draft with invalid state).
  const [prevNav, setPrevNav] = useState({ topTab, sub });
  useEffect(() => {
    if (prevNav.topTab === topTab && prevNav.sub === sub) return;
    setPrevNav({ topTab, sub });
    if (isNew) return; // don't auto-persist a brand-new entry
    if (currentSnapshot === baseline) return; // nothing dirty
    const canAutoSave = !!name.trim() && !!type.trim() && !!group.trim() && !!description.trim();
    if (!canAutoSave) return;
    persistEntry('Draft');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topTab, sub]);
  const [baseline, setBaseline] = useState(() => JSON.stringify({
    name: perm?.name ?? '', type: perm?.type ?? '', group: perm?.group ?? '',
    category: perm?.category ?? '', description: perm?.description ?? '', permissionLimit: '',
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

    // US-135718 — Save Draft requires Basic Information mandatory fields to be filled.
    if (status === 'Draft') {
      const missing: ValidationError[] = [];
      if (!name.trim())        missing.push({ section: 'Basic Information', field: 'Permission Name', message: 'This field is required' });
      if (!type.trim())        missing.push({ section: 'Basic Information', field: 'Type',            message: 'This field is required' });
      if (!group.trim())       missing.push({ section: 'Basic Information', field: 'Group',           message: 'This field is required' });
      if (!description.trim()) missing.push({ section: 'Basic Information', field: 'Description',     message: 'This field is required' });
      if (missing.length) {
        return { ok: false, error: 'This field is required', errors: missing };
      }
    }

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
      description: description || perm?.description || '',
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
            data-testid="save-draft-button"
            variant="outlined"
            startIcon={<SaveOutlined />}
            onClick={() => {
              const r = persistEntry('Draft');
              if (r.ok) showToast('Draft saved', 'success');
              else {
                // Surface per-field "This field is required" errors on Basic Information.
                if (r.errors?.length) {
                  setShowFieldErrors(true);
                  // Jump to Basic Information so the errors are visible.
                  setTopTab('permissions');
                  setSub('Basic Information');
                }
                showToast(r.error || 'Save failed', 'error');
              }
            }}
            sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
          >
            Save Draft
          </Button>
          <Button
            data-testid="publish-button"
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
            <Paper sx={{ width: 260, p: 1.25, alignSelf: 'flex-start' }} data-testid="permissions-subnav">
              <Stack spacing={0.25}>
                {PERMISSION_SUBS.map((s) => {
                  const active = s === sub;
                  const errCount = showFieldErrors ? (sectionErrorCount[s] ?? 0) : 0;
                  return (
                    <Box
                      key={s}
                      data-testid={`subnav-${s.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      data-active={active ? 'true' : 'false'}
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

                  <FormRow label="Permission Name" required error={fieldError('Basic Information', 'Permission Name') || nameInlineError}>
                    <TextField placeholder="Enter Permission Name" value={name}
                      onChange={(e) => setName(e.target.value.slice(0, 100))}
                      inputProps={{ maxLength: 100, 'data-testid': 'basic-name-input' }}
                      helperText={`${name.length}/100`}
                      error={!!(fieldError('Basic Information', 'Permission Name') || nameInlineError)} fullWidth />
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
                      onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                      inputProps={{ maxLength: 500, 'data-testid': 'basic-description-input' }}
                      helperText={`${description.length}/500`}
                      multiline minRows={4}
                      fullWidth
                      error={!!fieldError('Basic Information', 'Description')}
                    />
                  </FormRow>
                </>
              )}

              {sub !== 'Basic Information' && sub !== 'General Settings' && sub !== 'Zone Mapping' && sub !== 'Special Event Properties Mapping' && (
                <>
                  {sub === 'Permission Label'        && <PermissionLabelSection        permissionId={id || 'default'} showErrors={showFieldErrors} />}
                  {sub === 'Payment Settings'        && <PaymentSettingsSection        permissionId={id || 'default'} showErrors={showFieldErrors} error={fieldError('Payment Settings', 'Payment Methods')} />}
                  {sub === 'Discount Settings'       && <DiscountSettingsSection       permissionId={id || 'default'} showErrors={showFieldErrors} />}
                  {sub === 'Document Type Settings'  && <DocumentTypeSettingsSection   permissionId={id || 'default'} showErrors={showFieldErrors} error={fieldError('Document Type Settings', 'Documents')} />}
                  {sub === 'Merchant Settings'       && <MerchantSettingsSection       permissionId={id || 'default'} showErrors={showFieldErrors} />}
                  {sub === 'Renewals and Reminders'  && <RenewalsAndRemindersSection   permissionId={id || 'default'} showErrors={showFieldErrors} />}
                  {sub === 'Email Templates'         && <EmailTemplatesSection         permissionId={id || 'default'} showErrors={showFieldErrors} />}
                  {sub === 'Operation Criteria'      && (
                    <>
                      <Typography data-testid="section-heading-operation-criteria" sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.15rem', color: tokens.INK }}>
                        Operation Criteria
                      </Typography>
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
                        Operation criteria for this permission are inherited from the contract-level defaults. Contract admins can override them here when configured.
                      </Alert>
                    </>
                  )}
                  {sub === 'Special Event'           && <SpecialEventSection            permissionId={id || 'default'} />}
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

              {sub === 'Special Event Properties Mapping' && (
                <SpecialEventPropertiesMappingSection permissionId={id || 'default'} showErrors={showFieldErrors} />
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

                  <Typography data-testid="start-date-settings-heading" sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1rem', color: tokens.INK, mt: 1 }}>
                    Start Date Settings
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />

                  <FormRow label="Start Date Policy" required info="Start Date Choosing Method — determines when the permission becomes active." error={fieldError('General Settings', 'Start Date Settings')}>
                    <Select displayEmpty value={gs.startDatePolicy} onChange={(e) => gsSet('startDatePolicy', e.target.value)} fullWidth
                      inputProps={{ 'data-testid': 'start-date-policy-select' }}
                      error={!!fieldError('General Settings', 'Start Date Settings')}>
                      <MenuItem value=""><em style={{ color: tokens.MUTED, fontStyle: 'normal' }}>Select</em></MenuItem>
                      <MenuItem value="issue-now" data-testid="start-date-policy-opt-issue-now">Issue Now</MenuItem>
                      <MenuItem value="backdated-month" data-testid="start-date-policy-opt-backdated-month">Backdated to Start of the Month</MenuItem>
                      <MenuItem value="backdated-application" data-testid="start-date-policy-opt-backdated-application">Backdated to Start of the Application</MenuItem>
                      <MenuItem value="forward-set-date" data-testid="start-date-policy-opt-forward-set-date">Forward to Set Date</MenuItem>
                    </Select>
                  </FormRow>

                  <FormRow label="Include Time" info="When checked, applicants can pick a time alongside the calendar date on the customer portal.">
                    <FormControlLabel
                      control={
                        <Checkbox
                          data-testid="include-time-checkbox"
                          checked={gs.includeTime}
                          disabled={gs.startDatePolicy !== 'forward-set-date'}
                          onChange={(e) => gsSet('includeTime', e.target.checked)}
                        />
                      }
                      label={gs.startDatePolicy === 'forward-set-date' ? 'Allow applicants to pick a time' : 'Only available with Forward to Set Date'}
                    />
                  </FormRow>

                  <FormRow label="Start Date Delay" required info="Start Date in Buffers — number of days offset from today. Range 0-100. Default 0.">
                    <Stack spacing={0.5} sx={{ width: 240 }}>
                      <TextField
                        type="number"
                        inputProps={{ min: 0, max: 100, 'data-testid': 'start-date-delay-input' }}
                        value={gs.startDateDelay}
                        disabled={gs.startDatePolicy !== 'forward-set-date'}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === '') { gsSet('startDateDelay', ''); return; }
                          const n = parseInt(raw, 10);
                          if (isNaN(n)) return;
                          const clamped = Math.max(0, Math.min(100, n));
                          gsSet('startDateDelay', String(clamped));
                        }}
                        error={
                          gs.startDatePolicy === 'forward-set-date' &&
                          (gs.startDateDelay === '' || parseInt(gs.startDateDelay, 10) < 0 || parseInt(gs.startDateDelay, 10) > 100)
                        }
                        helperText={
                          gs.startDatePolicy === 'forward-set-date' && gs.startDateDelay === ''
                            ? 'Required. Must be between 0 and 100.'
                            : 'Days from today. 0 = today allowed; n = today + n days onwards.'
                        }
                      />
                    </Stack>
                  </FormRow>

                  <FormRow label="Permit Days Selection">
                    <RadioGroup row value={gs.permitDaysSelection} onChange={(e) => gsSet('permitDaysSelection', e.target.value)}>
                      <FormControlLabel value="enable" control={<Radio />} label="Enable" sx={{ mr: 5 }} />
                      <FormControlLabel value="disable" control={<Radio />} label="Disable" />
                    </RadioGroup>
                  </FormRow>

                  <FormRow label="Retention Period for Expired Permits (Days)" required info='Enter the number of days expired permits should remain visible after their expiry date. For example, if set to 7, expired permits will be displayed for 7 days before being hidden from the system view. Enter 0 to hide them immediately upon expiry.'>
                    <Stack spacing={0.5} sx={{ width: 260 }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <TextField
                          type="number"
                          inputProps={{ min: 0, step: 1, 'data-testid': 'retention-days-input' }}
                          value={gs.retentionDays}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === '') { gsSet('retentionDays', ''); return; }
                            // Only positive whole numbers (including 0). Strip decimals & sign.
                            const cleaned = raw.replace(/[^0-9]/g, '');
                            if (cleaned === '') { gsSet('retentionDays', ''); return; }
                            gsSet('retentionDays', String(parseInt(cleaned, 10)));
                          }}
                          error={gs.retentionDays === '' || parseInt(gs.retentionDays, 10) < 0}
                          sx={{ width: 200 }}
                        />
                        <Typography sx={{ color: tokens.INK }}>Days</Typography>
                      </Stack>
                      {gs.retentionDays === '' && (
                        <Typography data-testid="retention-required-error" sx={{ color: '#B42318', fontSize: '0.75rem' }}>
                          This field is required. Enter 0 or more.
                        </Typography>
                      )}
                    </Stack>
                  </FormRow>

                  <FormRow label="Prefix" required info="Enter a unique alphanumeric prefix up to 10 characters. This prefix will appear at the start of the application number (e.g., 'RP' in RP-8XF93Z2K)." error={prefixInlineError || fieldError('General Settings', 'Prefix')}>
                    <Stack spacing={0.5} sx={{ width: '100%' }}>
                      <TextField
                        placeholder="Enter Prefix"
                        value={gs.prefix}
                        onChange={(e) => gsSet('prefix', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                        disabled={isPublished}
                        error={!!prefixInlineError || !!fieldError('General Settings', 'Prefix')}
                        inputProps={{ maxLength: 10, 'data-testid': 'prefix-input', style: { textTransform: 'uppercase', fontFamily: 'monospace' } }}
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
                    <Stack spacing={0.5} sx={{ width: '100%' }}>
                      <Select displayEmpty value={gs.termsAndConditions} onChange={(e) => gsSet('termsAndConditions', e.target.value)} fullWidth
                        inputProps={{ 'data-testid': 'tnc-select' }}
                        error={!!fieldError('General Settings', 'Terms & Conditions')}>
                        <MenuItem value=""><em style={{ color: tokens.MUTED, fontStyle: 'normal' }}>Select</em></MenuItem>
                        {tncOptions.map((tpl) => (
                          <MenuItem key={tpl.id} value={tpl.id} data-testid={`tnc-opt-${tpl.id}`}>{tpl.templateName}</MenuItem>
                        ))}
                      </Select>
                      {(!type || tncOptions.length === 0) && (
                        <Typography data-testid="tnc-empty" variant="caption" sx={{ color: tokens.MUTED }}>
                          {!type
                            ? 'Select a Permission Type in Basic Information to see available templates.'
                            : 'No Terms & Conditions templates configured for this permission type.'}
                        </Typography>
                      )}
                    </Stack>
                  </FormRow>

                  <FormRow label="Display Description" required error={fieldError('General Settings', 'Display Description')}>
                    <Stack spacing={0.5} sx={{ width: '100%' }}>
                      <TextField
                        placeholder="Enter Display Description"
                        value={gs.displayDescription}
                        onChange={(e) => gsSet('displayDescription', e.target.value.slice(0, 1000))}
                        multiline minRows={3}
                        fullWidth
                        inputProps={{ maxLength: 1000, 'data-testid': 'display-description-input' }}
                        error={!!fieldError('General Settings', 'Display Description')}
                      />
                      <Stack direction="row" justifyContent="flex-end">
                        <Typography data-testid="display-description-counter" variant="caption" sx={{ color: (gs.displayDescription || '').length >= 1000 ? '#B42318' : tokens.MUTED }}>
                          {(gs.displayDescription || '').length}/1000
                        </Typography>
                      </Stack>
                    </Stack>
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
        {topTab === 'pricing' && <PricingConfigurationTab
          permissionId={id || 'default'}
          permissionStatus={perm?.status || 'Draft'}
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
