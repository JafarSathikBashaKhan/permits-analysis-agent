import { Box, Button, Chip, InputAdornment, MenuItem, Paper, Stack, TextField, Typography, IconButton, Tooltip } from '@mui/material';
import { Add, Search, FilterListOutlined, MoreVertOutlined, VisibilityOutlined, ContentCopyOutlined, PublishedWithChangesOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../shared/PageHeader';
import { StatusChip } from '../../shared/StatusChip';
import { permissions, permissionTypes } from '../../data/mock';

export function BuilderListPage() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [type, setType] = useState<string>('All');

  const rows = useMemo(() => permissions.filter((p) => {
    const okQ = q === '' || p.name.toLowerCase().includes(q.toLowerCase()) || (p.prefix ?? '').toLowerCase().includes(q.toLowerCase());
    const okT = type === 'All' || p.type === type;
    return okQ && okT;
  }), [q, type]);

  const cols: GridColDef[] = [
    {
      field: 'name', headerName: 'Permission', flex: 1.4, minWidth: 220,
      renderCell: (p) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.value}</Typography>
          <Typography variant="caption" color="text.secondary">{p.row.prefix} · v{p.row.version}</Typography>
        </Box>
      ),
    },
    { field: 'type', headerName: 'Type', width: 110 },
    { field: 'group', headerName: 'Group', width: 130 },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'price', headerName: 'Price', width: 90, align: 'right', headerAlign: 'right',
      valueFormatter: (v) => `£${v}`,
    },
    { field: 'zones', headerName: 'Zones', width: 80, align: 'right', headerAlign: 'right' },
    {
      field: 'status', headerName: 'Status', width: 130,
      renderCell: (p) => <StatusChip status={p.value} />,
    },
    { field: 'lastUpdated', headerName: 'Updated', width: 120 },
    {
      field: 'actions', headerName: '', width: 130, sortable: false, filterable: false, align: 'right', headerAlign: 'right',
      renderCell: (p) => (
        <Stack direction="row">
          <Tooltip title="Open"><IconButton size="small" onClick={() => nav(`/builder/${p.id}`)}><VisibilityOutlined fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Clone"><IconButton size="small"><ContentCopyOutlined fontSize="small" /></IconButton></Tooltip>
          <Tooltip title={p.row.status === 'Draft' ? 'Publish' : 'Unpublish'}>
            <IconButton size="small"><PublishedWithChangesOutlined fontSize="small" /></IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Builder"
        title="Permission templates"
        description="Create and manage the permission types available to applicants and back-office staff."
        actions={
          <>
            <Button variant="outlined" color="primary" startIcon={<FilterListOutlined />}>Filters</Button>
            <Button variant="contained" color="primary" startIcon={<Add />} component={RouterLink} to="/builder/new">Create permission</Button>
          </>
        }
      />

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search by name or prefix…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={{ maxWidth: 320 }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Search fontSize="small" /></InputAdornment>) }}
          />
          <TextField select value={type} onChange={(e) => setType(e.target.value)} sx={{ width: 200 }} label="Type">
            <MenuItem value="All">All types</MenuItem>
            {permissionTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">{rows.length} of {permissions.length}</Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: 0, overflow: 'hidden' }}>
        <DataGrid
          rows={rows}
          columns={cols}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          sx={{ '& .MuiDataGrid-cell': { py: 1.5 } }}
        />
      </Paper>
    </>
  );
}
