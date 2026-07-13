import {
  Box, Button, Chip, IconButton, InputAdornment, Menu, MenuItem, Paper,
  Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  TextField, Typography, Checkbox, Tooltip, Link, FormControlLabel, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  Add, Search, FilterListOutlined, ViewColumnOutlined, MoreVertOutlined,
  VisibilityOutlined, ContentCopyOutlined, PublishedWithChangesOutlined, DeleteOutline,
  ArrowUpward, ArrowDownward, UnfoldMore, HistoryOutlined,
} from '@mui/icons-material';
import { useMemo, useState, MouseEvent, Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { permissions, Permission } from '../../data/mock';
import { tokens } from '../../theme';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';
import { CreatePermissionSlider } from './CreatePermissionSlider';

export const BUILDER_ROWS_KEY = 'prototype:builder:list:rows';

/**
 * US-132566 — Permission Setup - Builder | List Screen
 *
 * Default columns  : Permission Name, Type, Status, Actions
 * Column picker    : Group, Scope, Created On, Created By, Updated On, Updated By
 * Per-column filter: hamburger icon on each column header opens an input
 * Sort cycle       : header click → asc → desc → cleared
 * Row actions      : Clone, Publish/Unpublish, Version History, Delete
 */

type ColKey = 'name' | 'type' | 'group' | 'scope' | 'status' | 'createdOn' | 'createdBy' | 'updatedOn' | 'updatedBy';

type ColDef = { key: ColKey; label: string; defaultVisible: boolean; filterable: boolean; sortable: boolean };

const COLUMNS: ColDef[] = [
  { key: 'name',      label: 'Permission Name', defaultVisible: true,  filterable: true, sortable: true },
  { key: 'type',      label: 'Type',            defaultVisible: true,  filterable: true, sortable: true },
  { key: 'group',     label: 'Group',           defaultVisible: false, filterable: true, sortable: true },
  { key: 'scope',     label: 'Scope',           defaultVisible: false, filterable: true, sortable: true },
  { key: 'status',    label: 'Status',          defaultVisible: true,  filterable: true, sortable: true },
  { key: 'createdOn', label: 'Created On',      defaultVisible: false, filterable: true, sortable: true },
  { key: 'createdBy', label: 'Created By',      defaultVisible: false, filterable: true, sortable: true },
  { key: 'updatedOn', label: 'Updated On',      defaultVisible: false, filterable: true, sortable: true },
  { key: 'updatedBy', label: 'Updated By',      defaultVisible: false, filterable: true, sortable: true },
];

function scopeOf(p: Permission): 'Zonal' | 'Non-Zonal' {
  return p.category === 'Visitor' || p.category === 'Scratch card' ? 'Non-Zonal' : 'Zonal';
}
function cellValue(p: Permission, key: ColKey): string {
  switch (key) {
    case 'name':      return p.name;
    case 'type':      return p.type;
    case 'group':     return p.group;
    case 'scope':     return scopeOf(p);
    case 'status':    return p.status;
    case 'createdOn': return p.createdOn ?? p.lastUpdated ?? '';
    case 'createdBy': return p.createdBy ?? '';
    case 'updatedOn': return p.updatedOn ?? p.lastUpdated ?? '';
    case 'updatedBy': return p.updatedBy ?? p.createdBy ?? '';
  }
}

export function BuilderListPage() {
  const showToast = useToast();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [allRows, setAllRows] = usePersistentState<Permission[]>(BUILDER_ROWS_KEY, () => [...permissions]);
  const [createOpen, setCreateOpen] = useState(false);
  const [groups] = usePersistentState<any[]>('prototype:builder:groups:rows', () => {
    const names = ['City Centre', 'North Zone', 'South Zone', 'Riverside', 'Business District', 'Suburbs'];
    const types = ['Residents Permit', 'Business Permit', 'Visitor Permit', 'Contractor Permit',
      'Suspension', 'Dispensation', 'Taxi Card'];
    return names.map((n, i) => ({ id: `g-${i + 1}`, name: n, permissionType: types[i % types.length] }));
  });

  // Column visibility
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(
    () => new Set(COLUMNS.filter((c) => c.defaultVisible).map((c) => c.key)),
  );
  const [colPickerAnchor, setColPickerAnchor] = useState<HTMLElement | null>(null);

  // Per-column filter values + active filter anchor
  const [colFilters, setColFilters] = useState<Partial<Record<ColKey, string>>>({});
  const [filterAnchor, setFilterAnchor] = useState<{ el: HTMLElement; col: ColKey } | null>(null);

  // Sort — null means unsorted (clear cycle)
  const [sort, setSort] = useState<{ col: ColKey; dir: 'asc' | 'desc' } | null>(null);
  const cycleSort = (col: ColKey) => {
    setSort((prev) => {
      if (!prev || prev.col !== col) return { col, dir: 'asc' };
      if (prev.dir === 'asc') return { col, dir: 'desc' };
      return null; // cleared
    });
  };

  const rows = useMemo(() => {
    let out = allRows;
    // Global search — name / type / group per AC
    if (q.trim()) {
      const s = q.toLowerCase();
      out = out.filter((p) =>
        p.name.toLowerCase().includes(s) ||
        p.type.toLowerCase().includes(s) ||
        p.group.toLowerCase().includes(s),
      );
    }
    // Per-column filters (AND across columns)
    for (const [k, v] of Object.entries(colFilters)) {
      const needle = String(v ?? '').trim().toLowerCase();
      if (!needle) continue;
      out = out.filter((p) => cellValue(p, k as ColKey).toLowerCase().includes(needle));
    }
    // Sort
    if (sort) {
      const { col, dir } = sort;
      out = [...out].sort((a, b) => {
        const av = cellValue(a, col);
        const bv = cellValue(b, col);
        const cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' });
        return dir === 'asc' ? cmp : -cmp;
      });
    }
    return out;
  }, [allRows, q, colFilters, sort]);

  const visible = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const allSelected = visible.length > 0 && visible.every((r) => selected.has(r.id));
  const someSelected = visible.some((r) => selected.has(r.id)) && !allSelected;
  const activeFilterCount = Object.values(colFilters).filter((v) => String(v ?? '').trim()).length;

  const toggleAll = () => {
    const s = new Set(selected);
    if (allSelected) visible.forEach((r) => s.delete(r.id));
    else visible.forEach((r) => s.add(r.id));
    setSelected(s);
  };
  const toggleOne = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const bulkPublish = () => {
    setAllRows((prev) => prev.map((r) => selected.has(r.id) ? { ...r, status: 'Published' } : r));
    showToast(`${selected.size} permission(s) published`, 'success');
    setSelected(new Set());
  };
  const bulkUnpublish = () => {
    setAllRows((prev) => prev.map((r) => selected.has(r.id) ? { ...r, status: 'Draft' } : r));
    showToast(`${selected.size} permission(s) unpublished`, 'success');
    setSelected(new Set());
  };
  const bulkClone = () => {
    const toClone = allRows.filter((r) => selected.has(r.id));
    const clones = toClone.map((r) => ({
      ...r,
      id: `P-${Date.now()}-${Math.random()}`,
      name: `${r.name} (Copy)`,
      status: 'Draft' as const,
    }));
    setAllRows((prev) => [...clones, ...prev]);
    showToast(`${clones.length} permission(s) cloned`, 'success');
    setSelected(new Set());
  };
  const bulkDelete = () => {
    setAllRows((prev) => prev.filter((r) => !selected.has(r.id)));
    showToast('Permissions Deleted successfully', 'success');
    setSelected(new Set());
  };

  // ─── Delete confirmation state (US-136288) ─────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const askSingleDelete = (row: Permission) => setDeleteTarget(row);
  const confirmSingleDelete = () => {
    if (!deleteTarget) return;
    const name = deleteTarget.name;
    setAllRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setSelected((prev) => { const s = new Set(prev); s.delete(deleteTarget.id); return s; });
    setDeleteTarget(null);
    showToast(`"${name}" Deleted Successfully`, 'success');
  };
  const askBulkDelete = () => { if (selected.size >= 2) setBulkDeleteOpen(true); };
  const confirmBulkDelete = () => { bulkDelete(); setBulkDeleteOpen(false); };

  const shownColumns = COLUMNS.filter((c) => visibleCols.has(c.key));

  return (
    <>
      {/* Header row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.75rem', color: tokens.INK }}>
          Builder
        </Typography>
        <Button
          data-testid="new-permission"
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateOpen(true)}
          sx={{ px: 2.5, py: 1, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
        >
          New Permission
        </Button>
      </Stack>

      <Paper sx={{ overflow: 'hidden' }}>
        {/* Search + column/filter icons */}
        <Stack direction="row" alignItems="center" sx={{ px: 3, py: 2, borderBottom: `1px solid ${tokens.LINE}` }}>
          <TextField
            data-testid="global-search"
            placeholder="Search by Permission Name, Type or Group..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (<InputAdornment position="start"><Search sx={{ color: tokens.MUTED }} /></InputAdornment>),
            }}
            sx={{ flex: 1, maxWidth: 540 }}
          />
          <Box sx={{ flex: 1 }} />
          {selected.size > 0 && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }} data-testid="selection-count">
                {selected.size} Selected
              </Typography>
              <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={bulkPublish}>Publish</Button>
              <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={bulkUnpublish}>Unpublish</Button>
              <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={bulkClone}>Clone</Button>
              {selected.size >= 2 && (
                <Button
                  size="small" variant="outlined" color="error"
                  onClick={askBulkDelete}
                  data-testid="bulk-delete-button"
                >
                  Delete
                </Button>
              )}
            </>
          )}
          <Tooltip title="Columns">
            <IconButton
              data-testid="column-picker-button"
              sx={{ color: tokens.NAVY }}
              onClick={(e) => setColPickerAnchor(e.currentTarget)}
            >
              <ViewColumnOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title={activeFilterCount ? `${activeFilterCount} filter(s) active` : 'Column filters'}>
            <IconButton
              data-testid="clear-filters-button"
              sx={{ color: activeFilterCount ? tokens.NAVY : tokens.MUTED }}
              onClick={() => setColFilters({})}
            >
              <FilterListOutlined />
              {activeFilterCount > 0 && (
                <Box component="span" sx={{
                  ml: 0.5, fontSize: '0.7rem', fontWeight: 700, color: '#C62828',
                }}>
                  {activeFilterCount}
                </Box>
              )}
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Column picker menu */}
        <Menu
          anchorEl={colPickerAnchor}
          open={!!colPickerAnchor}
          onClose={() => setColPickerAnchor(null)}
          slotProps={{ paper: { sx: { minWidth: 220, p: 1 } } }}
        >
          <Typography variant="caption" sx={{ px: 1.5, color: tokens.MUTED, fontWeight: 700 }}>
            SHOW COLUMNS
          </Typography>
          <Divider sx={{ my: 0.5 }} />
          {COLUMNS.map((c) => (
            <MenuItem key={c.key} sx={{ py: 0 }} disableRipple>
              <FormControlLabel
                data-testid={`col-toggle-${c.key}`}
                sx={{ width: '100%', m: 0 }}
                control={
                  <Checkbox
                    size="small"
                    checked={visibleCols.has(c.key)}
                    onChange={() => setVisibleCols((prev) => {
                      const s = new Set(prev);
                      if (s.has(c.key)) s.delete(c.key); else s.add(c.key);
                      return s;
                    })}
                  />
                }
                label={c.label}
              />
            </MenuItem>
          ))}
        </Menu>

        {/* Per-column filter menu */}
        <Menu
          anchorEl={filterAnchor?.el}
          open={!!filterAnchor}
          onClose={() => setFilterAnchor(null)}
          slotProps={{ paper: { sx: { p: 2, minWidth: 240 } } }}
        >
          {filterAnchor && (
            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: tokens.MUTED, fontWeight: 700 }}>
                FILTER {COLUMNS.find((c) => c.key === filterAnchor.col)?.label.toUpperCase()}
              </Typography>
              <TextField
                data-testid={`col-filter-input-${filterAnchor.col}`}
                autoFocus
                size="small"
                fullWidth
                placeholder="Contains..."
                value={colFilters[filterAnchor.col] ?? ''}
                onChange={(e) => {
                  setColFilters((prev) => ({ ...prev, [filterAnchor.col]: e.target.value }));
                  setPage(0);
                }}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  size="small"
                  onClick={() => {
                    setColFilters((prev) => { const c = { ...prev }; delete c[filterAnchor.col]; return c; });
                    setFilterAnchor(null);
                  }}
                >
                  Clear
                </Button>
                <Button size="small" variant="contained" onClick={() => setFilterAnchor(null)}>Apply</Button>
              </Stack>
            </Stack>
          )}
        </Menu>

        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderBottom: `1px solid ${tokens.LINE}` } }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ bgcolor: '#FFF' }}>
                  <Checkbox
                    indeterminate={someSelected}
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </TableCell>
                {shownColumns.map((c) => (
                  <HeadCell
                    key={c.key}
                    col={c}
                    sort={sort}
                    filterActive={!!(colFilters[c.key] && String(colFilters[c.key]).trim())}
                    onSort={() => cycleSort(c.key)}
                    onFilter={(e) => setFilterAnchor({ el: e.currentTarget, col: c.key })}
                  />
                ))}
                <HeadCell col={{ key: 'actions' as any, label: 'Actions', defaultVisible: true, filterable: false, sortable: false }} align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map((p) => (
                <PermissionRow
                  key={p.id}
                  row={p}
                  cols={shownColumns}
                  checked={selected.has(p.id)}
                  onToggle={() => toggleOne(p.id)}
                  onDelete={() => askSingleDelete(p)}
                  onTogglePublish={() => setAllRows((prev) => prev.map((r) => r.id === p.id ? { ...r, status: r.status === 'Draft' ? 'Published' : 'Draft' } : r))}
                  onClone={() => {
                    const src = allRows.find((r) => r.id === p.id);
                    if (!src) return;
                    const clone: Permission = { ...src, id: `P-${Date.now()}`, name: `${src.name} (Copy)`, status: 'Draft' };
                    setAllRows((prev) => [clone, ...prev]);
                    showToast('Permission cloned', 'success');
                  }}
                  onVersionHistory={() => showToast(`Version history for ${p.name} (v${p.version}) — coming soon`, 'info')}
                />
              ))}
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={shownColumns.length + 2} align="center" sx={{ py: 8, color: tokens.MUTED }}>
                    No permissions match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="Rows per page:"
        />
      </Paper>

      <CreatePermissionSlider
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        existingPermissions={allRows}
        groups={groups as any}
        onCreate={(row) => setAllRows((prev) => [row, ...prev])}
      />

      {/* Single-row delete confirmation — US-136288 */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        data-testid="single-delete-dialog"
      >
        <DialogTitle>Delete permission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "<strong>{deleteTarget?.name}</strong>"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} data-testid="single-delete-cancel">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmSingleDelete}
            data-testid="single-delete-confirm"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk delete confirmation — US-136288 */}
      <Dialog
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        data-testid="bulk-delete-dialog"
      >
        <DialogTitle>Delete All Permission?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure want to delete all the selected Permissions ({selected.size})?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteOpen(false)} data-testid="bulk-delete-cancel">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmBulkDelete}
            data-testid="bulk-delete-confirm"
          >
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function HeadCell({
  col, align, sort, filterActive, onSort, onFilter,
}: {
  col: ColDef;
  align?: 'left' | 'right';
  sort?: { col: ColKey; dir: 'asc' | 'desc' } | null;
  filterActive?: boolean;
  onSort?: () => void;
  onFilter?: (e: MouseEvent<HTMLElement>) => void;
}) {
  const isSorted = sort && sort.col === col.key;
  const dirIcon = !isSorted
    ? <UnfoldMore fontSize="inherit" sx={{ color: tokens.MUTED, opacity: 0.6 }} />
    : sort!.dir === 'asc'
      ? <ArrowUpward fontSize="inherit" sx={{ color: tokens.NAVY }} />
      : <ArrowDownward fontSize="inherit" sx={{ color: tokens.NAVY }} />;
  return (
    <TableCell
      data-testid={`col-header-${col.key}`}
      align={align}
      sx={{
        bgcolor: '#FFF', color: tokens.INK, fontWeight: 700, fontSize: '0.85rem',
        textTransform: 'none', letterSpacing: 0, py: 1.5,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.5} justifyContent={align === 'right' ? 'flex-end' : 'flex-start'}>
        {col.sortable ? (
          <Box
            data-testid={`col-sort-${col.key}`}
            onClick={onSort}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', userSelect: 'none' }}
          >
            <span>{col.label}</span>
            {dirIcon}
          </Box>
        ) : <span>{col.label}</span>}
        {col.filterable && onFilter && (
          <Tooltip title="Filter">
            <IconButton
              data-testid={`col-filter-${col.key}`}
              size="small"
              onClick={onFilter}
              sx={{ color: filterActive ? '#C62828' : tokens.MUTED, p: 0.25 }}
            >
              <FilterListOutlined fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </TableCell>
  );
}

function PermissionRow({
  row, cols, checked, onToggle, onDelete, onTogglePublish, onClone, onVersionHistory,
}: {
  row: Permission;
  cols: ColDef[];
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  onClone: () => void;
  onVersionHistory: () => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const openMenu = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const closeMenu = () => setAnchor(null);

  const renderCell = (c: ColDef) => {
    const val = cellValue(row, c.key);
    if (c.key === 'name') {
      return (
        <TableCell key={c.key}>
          <Link
            data-testid={`row-name-${row.id}`}
            component={RouterLink}
            to={`/builder/${row.id}`}
            underline="hover"
            sx={{ color: tokens.NAVY, fontWeight: 500 }}
          >
            {val}
          </Link>
        </TableCell>
      );
    }
    if (c.key === 'status') {
      return (
        <TableCell key={c.key}>
          <Chip
            data-testid={`row-status-${row.id}`}
            label={val}
            size="small"
            variant="outlined"
            sx={{
              borderColor: val === 'Draft' ? tokens.LINE : '#C8E6C9',
              color: val === 'Draft' ? tokens.INK : '#2E7D32',
              bgcolor: '#FFF', fontWeight: 500, borderRadius: '999px',
            }}
          />
        </TableCell>
      );
    }
    return <TableCell key={c.key} sx={{ color: tokens.INK }}>{val}</TableCell>;
  };

  return (
    <TableRow hover selected={checked} sx={{ '& .MuiTableCell-root': { py: 1.5 } }} data-testid={`row-${row.id}`}>
      <TableCell padding="checkbox"><Checkbox checked={checked} onChange={onToggle} /></TableCell>
      {cols.map((c) => (<Fragment key={c.key}>{renderCell(c)}</Fragment>))}
      <TableCell align="right">
        <IconButton
          data-testid={`row-actions-${row.id}`}
          size="small"
          onClick={openMenu}
        >
          <MoreVertOutlined />
        </IconButton>
        <Menu anchorEl={anchor} open={!!anchor} onClose={closeMenu}>
          <MenuItem
            data-testid={`action-open-${row.id}`}
            component={RouterLink}
            to={`/builder/${row.id}`}
            onClick={closeMenu}
          >
            <VisibilityOutlined fontSize="small" style={{ marginRight: 8 }} />Open
          </MenuItem>
          <MenuItem
            data-testid={`action-clone-${row.id}`}
            onClick={() => { onClone(); closeMenu(); }}
          >
            <ContentCopyOutlined fontSize="small" style={{ marginRight: 8 }} />Clone
          </MenuItem>
          <MenuItem
            data-testid={`action-publish-${row.id}`}
            onClick={() => { onTogglePublish(); closeMenu(); }}
          >
            <PublishedWithChangesOutlined fontSize="small" style={{ marginRight: 8 }} />
            {row.status === 'Draft' ? 'Publish' : 'Unpublish'}
          </MenuItem>
          <MenuItem
            data-testid={`action-history-${row.id}`}
            onClick={() => { onVersionHistory(); closeMenu(); }}
          >
            <HistoryOutlined fontSize="small" style={{ marginRight: 8 }} />Version History
          </MenuItem>
          <MenuItem
            data-testid={`action-delete-${row.id}`}
            onClick={() => { onDelete(); closeMenu(); }}
            sx={{ color: '#C62828' }}
          >
            <DeleteOutline fontSize="small" style={{ marginRight: 8 }} />Delete
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}
