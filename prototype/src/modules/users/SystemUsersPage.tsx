import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  Checkbox,
  Collapse,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';
import { FIELD_LIMITS } from '../../constants/enums';

// ─────────────────────────────────────────────────────────────
// Fixtures (mirror real API shape: role, permission groups, users)
// ─────────────────────────────────────────────────────────────
// Role options come from Roles page persistent storage (excluding Super Admin per US-111158)
function getRoleOptions(rolesData: { id: string; name: string }[]): string[] {
  return rolesData
    .filter((r) => r.name.toLowerCase().replace(/\s/g, '') !== 'superadmin')
    .map((r) => r.name);
}

type PermissionItem = { id: string; name: string; enabled: boolean };
type PermissionGroup = { group: string; items: PermissionItem[] };

const DEFAULT_PERMISSIONS: PermissionGroup[] = [
  {
    group: 'Permit Management',
    items: [
      { id: 'p1', name: 'View Applications', enabled: true },
      { id: 'p2', name: 'Approve / Reject Applications', enabled: true },
      { id: 'p3', name: 'Cancel / Suspend Permits', enabled: false },
      { id: 'p4', name: 'Manage Renewals', enabled: false },
      { id: 'p5', name: 'Refund Payments', enabled: false },
    ],
  },
  {
    group: 'User Management',
    items: [
      { id: 'u1', name: 'View System Users', enabled: true },
      { id: 'u2', name: 'Create / Edit System Users', enabled: false },
      { id: 'u3', name: 'Manage Roles', enabled: false },
      { id: 'u4', name: 'Manage Applicants', enabled: true },
    ],
  },
  {
    group: 'Permission Setup',
    items: [
      { id: 's1', name: 'View Permissions', enabled: true },
      { id: 's2', name: 'Create / Publish Permissions', enabled: false },
      { id: 's3', name: 'Manage Groups', enabled: false },
      { id: 's4', name: 'Manage Pricing', enabled: false },
    ],
  },
  {
    group: 'Area & Zones',
    items: [
      { id: 'a1', name: 'View Streets / Zones / Locations', enabled: true },
      { id: 'a2', name: 'Create / Edit Streets', enabled: false },
      { id: 'a3', name: 'Manage Zones', enabled: false },
      { id: 'a4', name: 'Manage Special Events', enabled: false },
    ],
  },
  {
    group: 'Reports & Governance',
    items: [
      { id: 'r1', name: 'View Reports', enabled: true },
      { id: 'r2', name: 'Export Reports', enabled: false },
      { id: 'r3', name: 'View System Audits', enabled: false },
      { id: 'r4', name: 'Manage Contract Settings', enabled: false },
    ],
  },
];

type SystemUser = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
  mobileNumber: string;
  status: 'Active' | 'Inactive' | 'Invited';
  allowPermitDateChange: boolean;
  agentAssistEnabled: boolean;
  ddi?: string;
  pin?: string;
};

const FIRST = ['Alice', 'Ben', 'Cheryl', 'Danny', 'Eesha', 'Frank', 'Grace', 'Harjeet', 'Ian', 'Jasmine', 'Karan', 'Leila'];
const LAST = ['Whittaker', "O'Neill", 'Adeyemi', 'Coates', 'Reid', 'Bracknell', 'Marín', 'Turner', 'Patel', 'Chen', 'Rossi', 'Nakamura'];
const DEFAULT_ROLES = ['Contract Admin', 'BO Manager', 'BO User', 'CEO', 'Market Inspector', 'Read Only'];
const seedUsers = (): SystemUser[] =>
  Array.from({ length: 24 }, (_, i) => {
    const f = FIRST[i % FIRST.length];
    const l = LAST[i % LAST.length];
    return {
      id: `su-${1000 + i}`,
      firstName: f,
      lastName: l,
      emailAddress: `${f.toLowerCase()}.${l.toLowerCase().replace(/[^a-z]/g, '')}@marston.co.uk`,
      role: DEFAULT_ROLES[i % DEFAULT_ROLES.length],
      mobileNumber: `+44 7700 90${(1000 + i).toString().padStart(4, '0')}`,
      status: i % 7 === 0 ? 'Invited' : i % 5 === 0 ? 'Inactive' : 'Active',
      allowPermitDateChange: i % 3 === 0,
      agentAssistEnabled: i % 4 === 0,
      ddi: i % 4 === 0 ? `020701${(1000 + i).toString().padStart(4, '0')}` : undefined,
      pin: i % 4 === 0 ? `PIN-${i}23` : undefined,
    };
  });

// ─────────────────────────────────────────────────────────────
// Configuration panel (permission tree, matches real ConfigurationPanel)
// ─────────────────────────────────────────────────────────────
function ConfigurationPanel({
  value,
  onChange,
  showCheckboxes,
}: {
  value: PermissionGroup[];
  onChange?: (v: PermissionGroup[]) => void;
  showCheckboxes: boolean;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(value.map((g) => [g.group, true]))
  );

  const toggleGroup = (g: string) => setOpenGroups((s) => ({ ...s, [g]: !s[g] }));

  const setGroupAll = (groupName: string, checked: boolean) => {
    if (!onChange) return;
    onChange(
      value.map((g) =>
        g.group === groupName
          ? { ...g, items: g.items.map((it) => ({ ...it, enabled: checked })) }
          : g
      )
    );
  };

  const setItem = (groupName: string, itemId: string, checked: boolean) => {
    if (!onChange) return;
    onChange(
      value.map((g) =>
        g.group === groupName
          ? { ...g, items: g.items.map((it) => (it.id === itemId ? { ...it, enabled: checked } : it)) }
          : g
      )
    );
  };

  return (
    <Stack spacing={1.25}>
      {value.map((g) => {
        const selected = g.items.filter((i) => i.enabled).length;
        const all = g.items.length;
        const open = openGroups[g.group];
        return (
          <Box key={g.group} sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ px: 1, py: 1, bgcolor: 'grey.50', cursor: 'pointer' }}
              onClick={() => toggleGroup(g.group)}
            >
              <IconButton size="small" sx={{ mr: 0.5 }}>
                {open ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
              </IconButton>
              {showCheckboxes && (
                <Checkbox
                  size="small"
                  checked={selected === all}
                  indeterminate={selected > 0 && selected < all}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setGroupAll(g.group, e.target.checked)}
                />
              )}
              <Typography fontWeight={600} sx={{ flex: 1 }}>{g.group}</Typography>
              <Typography variant="caption" color="text.secondary">
                {selected} of {all} selected
              </Typography>
            </Stack>
            <Collapse in={open} timeout="auto">
              <Stack sx={{ p: 1.25, pl: showCheckboxes ? 5 : 4.5 }} spacing={0.25}>
                {g.items.map((it) => (
                  <Stack key={it.id} direction="row" alignItems="center" spacing={1}>
                    {showCheckboxes ? (
                      <Checkbox
                        size="small"
                        checked={it.enabled}
                        onChange={(e) => setItem(g.group, it.id, e.target.checked)}
                      />
                    ) : (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: it.enabled ? 'success.main' : 'grey.400' }} />
                    )}
                    <Typography variant="body2" sx={{ color: it.enabled ? 'text.primary' : 'text.disabled' }}>
                      {it.name}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Collapse>
          </Box>
        );
      })}
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────
// Sliding panel for Add / Edit / View / Audit
// ─────────────────────────────────────────────────────────────
type PanelMode = 'add' | 'view' | 'edit' | 'audit';

function UserSlidingPanel({
  open,
  onClose,
  mode: initialMode,
  user,
  onSave,
  onToggleStatus,
  allUsers,
  rolesData,
}: {
  open: boolean;
  onClose: () => void;
  mode: PanelMode;
  user: SystemUser | null;
  onSave: (u: SystemUser) => void;
  onToggleStatus: (id: string) => void;
  allUsers: SystemUser[];
  rolesData: { id: string; name: string }[];
}) {
  const [mode, setMode] = useState<PanelMode>(initialMode);
  const [tab, setTab] = useState(0);
  const [permissions, setPermissions] = useState<PermissionGroup[]>(DEFAULT_PERMISSIONS);
  const [form, setForm] = useState<SystemUser>({
    id: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    role: '',
    mobileNumber: '',
    status: 'Invited',
    allowPermitDateChange: false,
    agentAssistEnabled: false,
  });
  
  const roleOptions = getRoleOptions(rolesData);

  // Sync when panel opens
  useMemo(() => {
    setMode(initialMode);
    setTab(initialMode === 'audit' ? 2 : 0);
    if (user) {
      setForm(user);
    } else {
      setForm({
        id: `su-${Date.now()}`,
        firstName: '',
        lastName: '',
        emailAddress: '',
        role: '',
        mobileNumber: '',
        status: 'Invited',
        allowPermitDateChange: false,
        agentAssistEnabled: false,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialMode, user?.id]);

  const readonly = mode === 'view' || mode === 'audit';
  const isEditFlow = mode !== 'add';

  const validate = () => {
    if (!form.firstName.trim()) return 'First Name is required';
    if (!form.lastName.trim()) return 'Last Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.emailAddress)) return 'Valid email required';
    // Check email duplication
    const emailExists = allUsers.some((u) => u.id !== form.id && u.emailAddress.toLowerCase() === form.emailAddress.toLowerCase());
    if (emailExists) return 'This email already exists';
    if (!/^[+\d\s]{7,20}$/.test(form.mobileNumber)) return 'Valid contact number required';
    // Check mobile duplication
    const mobileExists = allUsers.some((u) => u.id !== form.id && u.mobileNumber === form.mobileNumber);
    if (mobileExists) return 'This number already exists';
    if (!form.role) return 'Role is required';
    if (form.agentAssistEnabled) {
      if (!form.ddi || !/^\d+$/.test(form.ddi)) return 'DDI is required (numeric)';
      if (!form.pin || form.pin.length < 4 || form.pin.length > 10) return 'PIN is required (4-10 chars)';
    }
    return null;
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onSave(form);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 720 } }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
            System User
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {mode === 'add'
              ? 'New System User'
              : form.firstName || form.lastName
              ? `${form.firstName} ${form.lastName}`
              : 'System User'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          {mode === 'view' && tab !== 2 && (
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => setMode('edit')}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Basic Information" />
        <Tab label="Configuration" />
        {isEditFlow && <Tab label="Audit Log" />}
      </Tabs>

      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tab 0 - Basic Information */}
        {tab === 0 && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                required
                fullWidth
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                disabled={readonly}
                inputProps={{ maxLength: FIELD_LIMITS.FIRST_NAME }}
              />
              <TextField
                label="Last Name"
                required
                fullWidth
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                disabled={readonly}
                inputProps={{ maxLength: FIELD_LIMITS.LAST_NAME }}
              />
            </Stack>
            <TextField
              label="Email Address"
              type="email"
              required
              fullWidth
              value={form.emailAddress}
              onChange={(e) => setForm({ ...form, emailAddress: e.target.value })}
              disabled={readonly}
              inputProps={{ maxLength: FIELD_LIMITS.EMAIL }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Contact Number"
                type="tel"
                required
                fullWidth
                value={form.mobileNumber}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                disabled={readonly}
                inputProps={{ maxLength: FIELD_LIMITS.MOBILE_NUMBER }}
              />
              <TextField
                select
                label="Role"
                required
                fullWidth
                value={form.role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  const isSuperOrContractAdmin = newRole === 'Super Admin' || newRole === 'Contract Admin';
                  setForm({ ...form, role: newRole, allowPermitDateChange: isSuperOrContractAdmin || form.allowPermitDateChange });
                }}
                disabled={readonly}
              >
                {roleOptions.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Divider sx={{ mt: 1 }} />
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
              Others
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={form.allowPermitDateChange}
                  onChange={(e) => setForm({ ...form, allowPermitDateChange: e.target.checked })}
                  disabled={readonly || form.role === 'Super Admin' || form.role === 'Contract Admin'}
                />
              }
              label="Change permit start and end date"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.agentAssistEnabled}
                  onChange={(e) => setForm({ ...form, agentAssistEnabled: e.target.checked })}
                  disabled={readonly}
                />
              }
              label="Agent Assist"
            />
            {form.agentAssistEnabled && (
              <Stack direction="row" spacing={2}>
                <TextField
                  label="DDI"
                  required
                  fullWidth
                  value={form.ddi || ''}
                  onChange={(e) => setForm({ ...form, ddi: e.target.value.replace(/\D/g, '') })}
                  disabled={readonly}
                  helperText="Numeric only"
                />
                <TextField
                  label="PIN"
                  required
                  fullWidth
                  value={form.pin || ''}
                  onChange={(e) => setForm({ ...form, pin: e.target.value })}
                  disabled={readonly}
                  helperText="4-10 chars, alphanumeric"
                />
              </Stack>
            )}
          </Stack>
        )}

        {/* Tab 1 - Configuration */}
        {tab === 1 && (
          <ConfigurationPanel
            value={permissions}
            onChange={setPermissions}
            showCheckboxes={!readonly}
          />
        )}

        {/* Tab 2 - Audit Log */}
        {tab === 2 && (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Activity trail for {form.firstName} {form.lastName}
            </Typography>
            <Stack spacing={1}>
              {[
                { evt: 'User Created', desc: 'Account provisioned', when: '2025-11-14 09:12:00', role: 'Super Admin', by: 'system.bot' },
                { evt: 'Role Changed', desc: `Role assigned to ${form.role}`, when: '2025-12-02 10:34:12', role: 'Contract Admin', by: 'admin.user' },
                { evt: 'Permission Updated', desc: 'View Reports enabled', when: '2026-01-15 14:22:08', role: 'Contract Admin', by: 'admin.user' },
                { evt: 'Status Changed', desc: 'Set to Active', when: '2026-02-01 08:45:00', role: 'BO Manager', by: 'ops.team' },
              ].map((row, i) => (
                <Box key={i} sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" fontWeight={600}>{row.evt}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.when}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{row.desc}</Typography>
                  <Typography variant="caption" color="text.secondary">by {row.by} ({row.role})</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', position: 'sticky', bottom: 0, bgcolor: 'background.paper' }}
      >
        <Box>
          {isEditFlow && tab !== 2 && (
            <Button
              color="inherit"
              onClick={() => onToggleStatus(form.id)}
            >
              {form.status === 'Active' ? 'Deactivate' : 'Activate'}
            </Button>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <Button onClick={onClose}>Cancel</Button>
          {!readonly && (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleSubmit}
            >
              {mode === 'add' ? 'Create' : 'Save Changes'}
            </Button>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
}

// ─────────────────────────────────────────────────────────────
// List page
// ─────────────────────────────────────────────────────────────
export function SystemUsersPage() {
  const showToast = useToast();
  const [rows, setRows] = usePersistentState<SystemUser[]>('prototype:users:system-users:rows', seedUsers);
  const [rolesData, ] = usePersistentState<{ id: string; name: string }[]>('prototype:users:roles:rows', []);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Invited'>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  
  const roleOptions = getRoleOptions(rolesData);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>('add');
  const [selected, setSelected] = useState<SystemUser | null>(null);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (roleFilter !== 'All' && r.role !== roleFilter) return false;
      if (!ql) return true;
      return (
        r.firstName.toLowerCase().includes(ql) ||
        r.lastName.toLowerCase().includes(ql) ||
        r.emailAddress.toLowerCase().includes(ql)
      );
    });
  }, [rows, q, statusFilter, roleFilter]);

  const openAdd = () => {
    setSelected(null);
    setPanelMode('add');
    setPanelOpen(true);
  };
  const openView = (u: SystemUser) => {
    setSelected(u);
    setPanelMode('view');
    setPanelOpen(true);
  };
  const openAudit = (u: SystemUser) => {
    setSelected(u);
    setPanelMode('audit');
    setPanelOpen(true);
  };

  const save = (u: SystemUser) => {
    const isEdit = rows.some((r) => r.id === u.id);
    setRows((prev) => {
      const exists = prev.some((r) => r.id === u.id);
      return exists ? prev.map((r) => (r.id === u.id ? u : r)) : [u, ...prev];
    });
    showToast(isEdit ? 'System User updated successfully' : 'System User created successfully', 'success');
  };
  const toggleStatus = (id: string) => {
    const user = rows.find((r) => r.id === id);
    const nextStatus = user?.status === 'Active' ? 'Inactive' : 'Active';
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === 'Active' ? ('Inactive' as const) : ('Active' as const) } : r
      )
    );
    showToast(`User ${nextStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
    setPanelOpen(false);
  };

  const handleBulkDeactivate = () => {
    setRows((prev) => prev.map((r) => (selection.includes(r.id) ? { ...r, status: 'Inactive' as const } : r)));
    showToast(`${selection.length} user(s) deactivated`, 'success');
    setSelection([]);
  };

  const handleBulkDelete = () => {
    setRows((prev) => prev.filter((r) => !selection.includes(r.id)));
    showToast(`${selection.length} user(s) deleted`, 'success');
    setSelection([]);
  };

  const handleBulkInvite = () => {
    showToast(`Invitation sent to ${selection.length} user(s)`, 'success');
    setSelection([]);
  };

  const columns: GridColDef<SystemUser>[] = [
    { field: 'firstName', headerName: 'First Name', flex: 1, minWidth: 130 },
    { field: 'lastName', headerName: 'Last Name', flex: 1, minWidth: 130 },
    { field: 'emailAddress', headerName: 'Email Address', flex: 1.4, minWidth: 220 },
    { field: 'role', headerName: 'Role', flex: 1, minWidth: 140 },
    { field: 'mobileNumber', headerName: 'Contact Number', flex: 1, minWidth: 160 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (p: GridRenderCellParams<SystemUser, string>) => (
        <Chip
          size="small"
          variant="outlined"
          label={p.value}
          color={p.value === 'Active' ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => openView(p.row)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Audit Log">
            <IconButton size="small" onClick={() => openAudit(p.row)}>
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Users"
        title="System Users"
        description="Back Office team members with role-based access to the platform."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
            New System User
          </Button>
        }
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField
          label="Search by First Name, Last Name, Email"
          size="small"
          fullWidth
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <TextField
          select
          label="Status"
          size="small"
          sx={{ minWidth: 160 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
          <MenuItem value="Invited">Invited</MenuItem>
        </TextField>
        <TextField
          select
          label="Role"
          size="small"
          sx={{ minWidth: 180 }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          {roleOptions.map((r) => (
            <MenuItem key={r} value={r}>{r}</MenuItem>
          ))}
        </TextField>
      </Stack>

      {selection.length > 0 && (
        <Card sx={{ mb: 2, bgcolor: '#EAF3FB' }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ fontWeight: 600, color: '#0D3E66' }}>
                {selection.length} row(s) selected
              </Typography>
              <Button variant="outlined" size="small" onClick={handleBulkInvite}>Send Invitation</Button>
              <Button variant="outlined" size="small" onClick={handleBulkDeactivate}>Deactivate</Button>
              <Button variant="outlined" size="small" color="error" onClick={handleBulkDelete}>Delete</Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DataGrid<SystemUser>
          rows={filtered}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          onRowClick={(p) => openView(p.row as SystemUser)}
          checkboxSelection
          rowSelectionModel={selection}
          onRowSelectionModelChange={setSelection}
          sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
        />
      </Box>

      <UserSlidingPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        mode={panelMode}
        user={selected}
        onSave={save}
        onToggleStatus={toggleStatus}
        allUsers={rows}
        rolesData={rolesData}
      />
    </>
  );
}
