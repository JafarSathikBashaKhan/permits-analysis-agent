import { Box, Button, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PageHeader } from '../../shared/PageHeader';
import { groupsByType, permissionTypes } from '../../data/mock';

const rows = permissionTypes.flatMap((t) => (groupsByType[t] ?? []).map((g, i) => ({
  id: `${t}-${g}`,
  name: g,
  type: t,
  permissions: (i + 1) * 2,
  status: i === 0 ? 'Published' : 'Draft',
})));

export function BuilderGroupsPage() {
  const cols: GridColDef[] = [
    { field: 'name', headerName: 'Group', flex: 1, minWidth: 200 },
    { field: 'type', headerName: 'Type', width: 140 },
    { field: 'permissions', headerName: 'Permissions', width: 140, type: 'number' },
    { field: 'status', headerName: 'Status', width: 140 },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Builder"
        title="Groups"
        description="Groups organise permissions within a type — e.g. City Centre, North, South under Resident."
        actions={<Button variant="contained" startIcon={<Add />}>New group</Button>}
      />
      <Paper>
        <Box sx={{ height: 520 }}>
          <DataGrid rows={rows} columns={cols} disableRowSelectionOnClick />
        </Box>
      </Paper>
    </>
  );
}
