import { Box, Button, Paper } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PageHeader } from '../../shared/PageHeader';
import { StatusChip } from '../../shared/StatusChip';
import { systemUsers } from '../../data/mock';

export function SystemUsersPage() {
  const cols: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 220 },
    { field: 'role', headerName: 'Role', width: 160 },
    { field: 'status', headerName: 'Status', width: 140, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'lastActive', headerName: 'Last active', width: 160 },
  ];

  return (
    <>
      <PageHeader eyebrow="Users" title="System Users" description="Back Office team members and their access." actions={<Button variant="contained" startIcon={<PersonAdd />}>Invite user</Button>} />
      <Paper>
        <Box sx={{ height: 520 }}>
          <DataGrid rows={systemUsers} columns={cols} disableRowSelectionOnClick />
        </Box>
      </Paper>
    </>
  );
}
