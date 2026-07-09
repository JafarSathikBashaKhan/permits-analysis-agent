import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Checkbox,
  Chip,
  Autocomplete,
  Alert,
  Divider,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────
const PERMISSION_TYPES = [
  'Residents Permit',
  'Business Permit',
  'Visitor Permit',
  'Contractor Permit',
  'Suspension',
  'Dispensation',
  'Taxi Card',
  'Licence',
];

type PermissionCell = { view: boolean; manage: boolean };
type ModuleRow = { id: string; menu: string; module: string; perms: PermissionCell };

// Menu grouping mirrors the real "Menus" from RoleAndPermission tables.
const BASE_MODULES: ModuleRow[] = [
  // Applications
  { id: 'app.apps', menu: 'Applications', module: 'Applications', perms: { view: true, manage: false } },
  { id: 'app.myw', menu: 'Applications', module: 'My Work Items', perms: { view: true, manage: false } },
  { id: 'app.exp', menu: 'Applications', module: 'Explore Applications', perms: { view: true, manage: false } },
  { id: 'app.sus', menu: 'Applications', module: 'Suspensions', perms: { view: false, manage: false } },
  // Users
  { id: 'usr.app', menu: 'Users', module: 'Applicants', perms: { view: true, manage: false } },
  { id: 'usr.sys', menu: 'Users', module: 'System Users', perms: { view: false, manage: false } },
  { id: 'usr.rol', menu: 'Users', module: 'Roles & Permissions', perms: { view: false, manage: false } },
  // Permission Setup
  { id: 'per.bld', menu: 'Permission Setup', module: 'Builder', perms: { view: true, manage: false } },
  { id: 'per.grp', menu: 'Permission Setup', module: 'Groups', perms: { view: true, manage: false } },
  { id: 'per.pri', menu: 'Permission Setup', module: 'Pricing', perms: { view: false, manage: false } },
  { id: 'per.pur', menu: 'Permission Setup', module: 'Purchase Reason', perms: { view: false, manage: false } },
  // Templates
  { id: 'tpl.doc', menu: 'Templates', module: 'Document Types', perms: { view: false, manage: false } },
  { id: 'tpl.tnc', menu: 'Templates', module: 'Terms and Condition', perms: { view: false, manage: false } },
  { id: 'tpl.aln', menu: 'Templates', module: 'Alerts and Tooltips', perms: { view: false, manage: false } },
  { id: 'tpl.eml', menu: 'Templates', module: 'Emails', perms: { view: false, manage: false } },
  // Area
  { id: 'ara.str', menu: 'Area', module: 'Streets', perms: { view: true, manage: false } },
  { id: 'ara.zon', menu: 'Area', module: 'Zones', perms: { view: true, manage: false } },
  { id: 'ara.loc', menu: 'Area', module: 'Locations', perms: { view: false, manage: false } },
  { id: 'ara.bay', menu: 'Area', module: 'Bay List', perms: { view: false, manage: false } },
  { id: 'ara.evt', menu: 'Area', module: 'Special Events', perms: { view: false, manage: false } },
  // Reports & Governance
  { id: 'rep.app', menu: 'Reports', module: 'Application Report', perms: { view: true, manage: false } },
  { id: 'rep.fin', menu: 'Reports', module: 'Financial Report', perms: { view: false, manage: false } },
  { id: 'gov.aud', menu: 'Governance', module: 'System Audits', perms: { view: false, manage: false } },
  { id: 'gov.set', menu: 'Governance', module: 'Contract Settings', perms: { view: false, manage: false } },
];

type Role = {
  id: string;
  name: string;
  description: string;
  permissionType: string[];
  noOfUsers: number;
  isDefaultRole: boolean;
  modules: ModuleRow[];
};

const seedRoles = (): Role[] => [
  {
    id: 'r1',
    name: 'Super Admin',
    description: 'Full CRUD on all modules across MNPS and Apply',
    permissionType: PERMISSION_TYPES,
    noOfUsers: 3,
    isDefaultRole: true,
    modules: BASE_MODULES.map((m) => ({ ...m, perms: { view: true, manage: true } })),
  },
  {
    id: 'r2',
    name: 'Contract Admin',
    description: 'Full CRUD on contract-level settings and Apply modules',
    permissionType: PERMISSION_TYPES,
    noOfUsers: 5,
    isDefaultRole: true,
    modules: BASE_MODULES.map((m) => ({ ...m, perms: { view: true, manage: true } })),
  },
  {
    id: 'r3',
    name: 'BO Manager',
    description: 'Back Office team leader — manage operations and users',
    permissionType: ['Residents Permit', 'Business Permit', 'Visitor Permit'],
    noOfUsers: 8,
    isDefaultRole: false,
    modules: BASE_MODULES.map((m) => ({ ...m })),
  },
  {
    id: 'r4',
    name: 'BO User',
    description: 'Limited Back Office access based on role permissions',
    permissionType: ['Residents Permit', 'Visitor Permit'],
    noOfUsers: 22,
    isDefaultRole: false,
    modules: BASE_MODULES.map((m) => ({ ...m })),
  },
  {
    id: 'r5',
    name: 'Read Only',
    description: 'View-only across designated modules',
    permissionType: PERMISSION_TYPES,
    noOfUsers: 4,
    isDefaultRole: false,
    modules: BASE_MODULES.map((m) => ({ ...m, perms: { view: true, manage: false } })),
  },
];

// ─────────────────────────────────────────────────────────────
// Role sliding panel
// ─────────────────────────────────────────────────────────────
function RolePanel({
  open,
  onClose,
  role,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  onSave: (r: Role) => void;
}) {
  const isEdit = !!role;
  const [form, setForm] = useState<Role>({
    id: '',
    name: '',
    description: '',
    permissionType: [],
    noOfUsers: 0,
    isDefaultRole: false,
    modules: BASE_MODULES.map((m) => ({ ...m, perms: { view: false, manage: false } })),
  });
  const [error, setError] = useState<string | null>(null);

  useMemo(() => {
    if (role) setForm(role);
    else
      setForm({
        id: `r-${Date.now()}`,
        name: '',
        description: '',
        permissionType: [],
        noOfUsers: 0,
        isDefaultRole: false,
        modules: BASE_MODULES.map((m) => ({ ...m, perms: { view: false, manage: false } })),
      });
    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, role?.id]);

  // Group modules by menu name for the matrix
  const grouped = useMemo(() => {
    const map = new Map<string, ModuleRow[]>();
    form.modules.forEach((m) => {
      if (!map.has(m.menu)) map.set(m.menu, []);
      map.get(m.menu)!.push(m);
    });
    return Array.from(map.entries());
  }, [form.modules]);

  const setCell = (id: string, key: 'view' | 'manage', v: boolean) => {
    setForm((f) => ({
      ...f,
      modules: f.modules.map((m) => {
        if (m.id !== id) return m;
        const next = { ...m.perms, [key]: v };
        // Manage ✓ ⇒ View ✓ ; View ✗ ⇒ Manage ✗
        if (key === 'manage' && v) next.view = true;
        if (key === 'view' && !v) next.manage = false;
        return { ...m, perms: next };
      }),
    }));
  };

  const setMenuAll = (menu: string, key: 'view' | 'manage', v: boolean) => {
    setForm((f) => ({
      ...f,
      modules: f.modules.map((m) => {
        if (m.menu !== menu) return m;
        const next = { ...m.perms, [key]: v };
        if (key === 'manage' && v) next.view = true;
        if (key === 'view' && !v) next.manage = false;
        return { ...m, perms: next };
      }),
    }));
  };

  const menuStats = (menu: string, key: 'view' | 'manage') => {
    const items = form.modules.filter((m) => m.menu === menu);
    const on = items.filter((m) => m.perms[key]).length;
    return { on, total: items.length };
  };

  const submit = () => {
    if (!form.name.trim()) return setError('Role is required');
    if (!form.description.trim()) return setError('Descriptions is required');
    if (form.permissionType.length === 0) return setError('At least one permission type is required');
    onSave(form);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 820 } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
            User Role
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {isEdit ? form.name : 'New Role'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2}>
          <TextField
            label="Role"
            required
            fullWidth
            placeholder="Enter Role"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            label="Descriptions"
            required
            fullWidth
            placeholder="Enter Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            inputProps={{ maxLength: 160 }}
          />
          <Autocomplete
            multiple
            options={PERMISSION_TYPES}
            value={form.permissionType}
            onChange={(_, v) => setForm({ ...form, permissionType: v })}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const props = getTagProps({ index });
                return <Chip label={option} size="small" {...props} key={option} />;
              })
            }
            renderInput={(params) => <TextField {...params} label="Type" placeholder="Select permission types" required />}
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          Permissions
        </Typography>
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
          <Stack
            direction="row"
            sx={{ bgcolor: 'grey.100', px: 2, py: 1.25, borderBottom: 1, borderColor: 'divider' }}
          >
            <Typography sx={{ flex: 1 }} variant="body2" fontWeight={700}>
              Modules
            </Typography>
            <Typography sx={{ width: 100, textAlign: 'center' }} variant="body2" fontWeight={700}>
              View
            </Typography>
            <Typography sx={{ width: 100, textAlign: 'center' }} variant="body2" fontWeight={700}>
              Manage
            </Typography>
          </Stack>

          {grouped.map(([menu, items]) => {
            const vs = menuStats(menu, 'view');
            const ms = menuStats(menu, 'manage');
            return (
              <Box key={menu}>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ px: 2, py: 1, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}
                >
                  <Typography sx={{ flex: 1 }} fontWeight={600}>{menu}</Typography>
                  <Box sx={{ width: 100, textAlign: 'center' }}>
                    <Checkbox
                      size="small"
                      checked={vs.on === vs.total}
                      indeterminate={vs.on > 0 && vs.on < vs.total}
                      onChange={(e) => setMenuAll(menu, 'view', e.target.checked)}
                    />
                  </Box>
                  <Box sx={{ width: 100, textAlign: 'center' }}>
                    <Checkbox
                      size="small"
                      checked={ms.on === ms.total}
                      indeterminate={ms.on > 0 && ms.on < ms.total}
                      onChange={(e) => setMenuAll(menu, 'manage', e.target.checked)}
                    />
                  </Box>
                </Stack>
                {items.map((m) => (
                  <Stack
                    key={m.id}
                    direction="row"
                    alignItems="center"
                    sx={{ px: 2, py: 0.5, borderBottom: 1, borderColor: 'divider' }}
                  >
                    <Typography sx={{ flex: 1, pl: 3 }} variant="body2">
                      {m.module}
                    </Typography>
                    <Box sx={{ width: 100, textAlign: 'center' }}>
                      <Checkbox
                        size="small"
                        checked={m.perms.view}
                        onChange={(e) => setCell(m.id, 'view', e.target.checked)}
                      />
                    </Box>
                    <Box sx={{ width: 100, textAlign: 'center' }}>
                      <Checkbox
                        size="small"
                        checked={m.perms.manage}
                        onChange={(e) => setCell(m.id, 'manage', e.target.checked)}
                      />
                    </Box>
                  </Stack>
                ))}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={1}
        sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', position: 'sticky', bottom: 0, bgcolor: 'background.paper' }}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={submit}>
          {isEdit ? 'Save Changes' : 'Create'}
        </Button>
      </Stack>
    </Drawer>
  );
}

// ─────────────────────────────────────────────────────────────
// List page
// ─────────────────────────────────────────────────────────────
export function RolesPage() {
  const [rows, setRows] = usePersistentState<Role[]>('prototype:users:roles:rows', seedRoles);
  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState<Role | null>(null);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (typeFilter !== 'All' && !r.permissionType.includes(typeFilter)) return false;
      if (!ql) return true;
      return r.name.toLowerCase().includes(ql) || r.description.toLowerCase().includes(ql);
    });
  }, [rows, q, typeFilter]);

  const isProtected = (name: string) => {
    const n = name.toLowerCase().replace(/\s/g, '');
    return n === 'superadmin' || n === 'contractadmin';
  };

  const openAdd = () => {
    setSelected(null);
    setPanelOpen(true);
  };
  const openEdit = (r: Role) => {
    setSelected(r);
    setPanelOpen(true);
  };
  const save = (r: Role) => {
    setRows((prev) => {
      const exists = prev.some((x) => x.id === r.id);
      return exists ? prev.map((x) => (x.id === r.id ? r : x)) : [r, ...prev];
    });
  };
  const confirmDelete = () => {
    if (!deleting) return;
    setRows((prev) => prev.filter((r) => r.id !== deleting.id));
    setDeleting(null);
  };

  const columns: GridColDef<Role>[] = [
    { field: 'name', headerName: 'Role', flex: 1, minWidth: 160 },
    { field: 'description', headerName: 'Descriptions', flex: 1.6, minWidth: 240 },
    {
      field: 'permissionType',
      headerName: 'Permission Type',
      flex: 1.4,
      minWidth: 220,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {(p.value as string[]).slice(0, 2).map((t) => (
            <Chip key={t} label={t} size="small" variant="outlined" />
          ))}
          {(p.value as string[]).length > 2 && (
            <Chip label={`+${(p.value as string[]).length - 2}`} size="small" />
          )}
        </Stack>
      ),
    },
    { field: 'noOfUsers', headerName: 'No Of Users', width: 120, type: 'number' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title={isProtected(p.row.name) ? 'System role cannot be edited' : 'Edit'}>
            <span>
              <IconButton
                size="small"
                onClick={() => openEdit(p.row)}
                disabled={isProtected(p.row.name)}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          {!p.row.isDefaultRole && (
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => setDeleting(p.row)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Users"
        title="Role and Permission"
        description="Define which modules each role can view and manage across the platform."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
            New Role
          </Button>
        }
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField
          label="Search by Role"
          size="small"
          fullWidth
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <TextField
          select
          label="Permission Type"
          size="small"
          sx={{ minWidth: 220 }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          {PERMISSION_TYPES.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </TextField>
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DataGrid<Role>
          rows={filtered}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        />
      </Box>

      <RolePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        role={selected}
        onSave={save}
      />

      <Dialog open={!!deleting} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete Role?</DialogTitle>
        <DialogContent>
          {deleting && deleting.noOfUsers > 0 ? (
            <Typography>
              This user role is currently associated with one or more user accounts. Please unassign the role from all users before deleting.
            </Typography>
          ) : (
            <Typography>
              Are you sure you want to permanently delete <b>{deleting?.name}</b> role?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          {deleting && deleting.noOfUsers === 0 && (
            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={confirmDelete}>
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
