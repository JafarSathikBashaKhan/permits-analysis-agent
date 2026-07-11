import {
  Box, Button, Chip, IconButton, InputAdornment, Menu, MenuItem, Paper,
  Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  TextField, Typography, Checkbox, Tooltip, Link,
} from '@mui/material';
import {
  Add, Search, FilterListOutlined, ViewColumnOutlined, MoreVertOutlined,
  VisibilityOutlined, ContentCopyOutlined, PublishedWithChangesOutlined, DeleteOutline,
} from '@mui/icons-material';
import { useMemo, useState, MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { permissions, Permission } from '../../data/mock';
import { tokens } from '../../theme';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';

export const BUILDER_ROWS_KEY = 'prototype:builder:list:rows';

export function BuilderListPage() {
  const showToast = useToast();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [allRows, setAllRows] = usePersistentState<Permission[]>(BUILDER_ROWS_KEY, () => [...permissions]);

  const rows = useMemo(() => allRows.filter((p) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return p.name.toLowerCase().includes(s) || p.type.toLowerCase().includes(s) || p.group.toLowerCase().includes(s);
  }), [allRows, q]);

  const visible = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const allSelected = visible.length > 0 && visible.every((r) => selected.has(r.id));
  const someSelected = visible.some((r) => selected.has(r.id)) && !allSelected;

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
    showToast(`${selected.size} permission(s) deleted`, 'success');
    setSelected(new Set());
  };

  return (
    <>
      {/* Header row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.75rem', color: tokens.INK }}>
          Builder
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={RouterLink}
          to="/builder/new"
          sx={{ px: 2.5, py: 1, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
        >
          New Permission
        </Button>
      </Stack>

      <Paper sx={{ overflow: 'hidden' }}>
        {/* Search + column/filter icons */}
        <Stack direction="row" alignItems="center" sx={{ px: 3, py: 2, borderBottom: `1px solid ${tokens.LINE}` }}>
          <TextField
            placeholder="Search by Permission Name, Ty..."
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
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {selected.size} Selected
              </Typography>
              <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={bulkPublish}>Publish</Button>
              <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={bulkUnpublish}>Unpublish</Button>
              <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={bulkClone}>Clone</Button>
              <Button size="small" variant="outlined" color="error" onClick={bulkDelete}>Delete</Button>
            </>
          )}
          <Tooltip title="Columns"><IconButton sx={{ color: tokens.NAVY }}><ViewColumnOutlined /></IconButton></Tooltip>
          <Tooltip title="Filter"><IconButton sx={{ color: tokens.NAVY }}><FilterListOutlined /></IconButton></Tooltip>
        </Stack>

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
                <HeadCell>Permission Name</HeadCell>
                <HeadCell>Permission Type</HeadCell>
                <HeadCell>Group</HeadCell>
                <HeadCell>Scope</HeadCell>
                <HeadCell>Status</HeadCell>
                <HeadCell>Created On</HeadCell>
                <HeadCell>Created By</HeadCell>
                <HeadCell align="right">Actions</HeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map((p) => (
                <PermissionRow
                  key={p.id}
                  row={p}
                  checked={selected.has(p.id)}
                  onToggle={() => toggleOne(p.id)}
                  onDelete={() => setAllRows((prev) => prev.filter((r) => r.id !== p.id))}
                  onTogglePublish={() => setAllRows((prev) => prev.map((r) => r.id === p.id ? { ...r, status: r.status === 'Draft' ? 'Published' : 'Draft' } : r))}
                />
              ))}
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8, color: tokens.MUTED }}>
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
    </>
  );
}

function HeadCell({ children, align }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <TableCell align={align} sx={{
      bgcolor: '#FFF', color: tokens.INK, fontWeight: 700, fontSize: '0.85rem',
      textTransform: 'none', letterSpacing: 0, py: 1.5,
    }}>
      {children}
    </TableCell>
  );
}

function PermissionRow({ row, checked, onToggle, onDelete, onTogglePublish }: {
  row: Permission; checked: boolean; onToggle: () => void;
  onDelete: () => void; onTogglePublish: () => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const scope = row.category === 'Visitor' || row.category === 'Scratch card' ? 'Non-Zonal' : 'Zonal';
  const createdOn = row.lastUpdated ?? '2025-09-14';
  const createdBy = row.createdBy ?? 'admin.user';

  const openMenu = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const closeMenu = () => setAnchor(null);

  return (
    <TableRow hover selected={checked} sx={{ '& .MuiTableCell-root': { py: 1.5 } }}>
      <TableCell padding="checkbox"><Checkbox checked={checked} onChange={onToggle} /></TableCell>
      <TableCell>
        <Link
          component={RouterLink}
          to={`/builder/${row.id}`}
          underline="hover"
          sx={{ color: tokens.NAVY, fontWeight: 500 }}
        >
          {row.name}
        </Link>
      </TableCell>
      <TableCell sx={{ color: tokens.INK }}>{row.type}</TableCell>
      <TableCell sx={{ color: tokens.INK }}>{row.group}</TableCell>
      <TableCell sx={{ color: tokens.INK }}>{scope}</TableCell>
      <TableCell>
        <Chip
          label={row.status}
          size="small"
          variant="outlined"
          sx={{
            borderColor: row.status === 'Draft' ? tokens.LINE : '#C8E6C9',
            color: row.status === 'Draft' ? tokens.INK : '#2E7D32',
            bgcolor: '#FFF', fontWeight: 500, borderRadius: '999px',
          }}
        />
      </TableCell>
      <TableCell sx={{ color: tokens.INK }}>{createdOn}</TableCell>
      <TableCell sx={{ color: tokens.INK }}>{createdBy}</TableCell>
      <TableCell align="right">
        <IconButton size="small" onClick={openMenu}><MoreVertOutlined /></IconButton>
        <Menu anchorEl={anchor} open={!!anchor} onClose={closeMenu}>
          <MenuItem component={RouterLink} to={`/builder/${row.id}`} onClick={closeMenu}><VisibilityOutlined fontSize="small" style={{ marginRight: 8 }} />Open</MenuItem>
          <MenuItem onClick={closeMenu}><ContentCopyOutlined fontSize="small" style={{ marginRight: 8 }} />Clone</MenuItem>
          <MenuItem onClick={() => { onTogglePublish(); closeMenu(); }}><PublishedWithChangesOutlined fontSize="small" style={{ marginRight: 8 }} />{row.status === 'Draft' ? 'Publish' : 'Unpublish'}</MenuItem>
          <MenuItem onClick={() => { onDelete(); closeMenu(); }} sx={{ color: '#C62828' }}><DeleteOutline fontSize="small" style={{ marginRight: 8 }} />Delete</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}
