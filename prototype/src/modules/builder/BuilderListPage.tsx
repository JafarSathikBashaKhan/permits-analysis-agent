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
import { permissions } from '../../data/mock';
import { tokens } from '../../theme';

export function BuilderListPage() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => permissions.filter((p) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return p.name.toLowerCase().includes(s) || p.type.toLowerCase().includes(s) || p.group.toLowerCase().includes(s);
  }), [q]);

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
                <HeadCell>Description</HeadCell>
                <HeadCell>Type</HeadCell>
                <HeadCell>Group</HeadCell>
                <HeadCell>Status</HeadCell>
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
                />
              ))}
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8, color: tokens.MUTED }}>
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

function PermissionRow({ row, checked, onToggle }: {
  row: typeof permissions[number]; checked: boolean; onToggle: () => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const description = row.category === 'Resident' ? 'Resident Permission'
    : row.category === 'Visitor' ? 'Visitor Permission'
    : row.category === 'Disabled Bay' ? 'Disabled Bay Permission'
    : row.category === 'Scratch card' ? 'Scratch card Permission'
    : row.name;

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
      <TableCell sx={{ color: tokens.INK }}>{description}</TableCell>
      <TableCell sx={{ color: tokens.INK }}>{row.type}</TableCell>
      <TableCell sx={{ color: tokens.INK }}>{row.group}</TableCell>
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
      <TableCell align="right">
        <IconButton size="small" onClick={openMenu}><MoreVertOutlined /></IconButton>
        <Menu anchorEl={anchor} open={!!anchor} onClose={closeMenu}>
          <MenuItem onClick={closeMenu}><VisibilityOutlined fontSize="small" style={{ marginRight: 8 }} />Open</MenuItem>
          <MenuItem onClick={closeMenu}><ContentCopyOutlined fontSize="small" style={{ marginRight: 8 }} />Clone</MenuItem>
          <MenuItem onClick={closeMenu}><PublishedWithChangesOutlined fontSize="small" style={{ marginRight: 8 }} />{row.status === 'Draft' ? 'Publish' : 'Unpublish'}</MenuItem>
          <MenuItem onClick={closeMenu} sx={{ color: '#C62828' }}><DeleteOutline fontSize="small" style={{ marginRight: 8 }} />Delete</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}
