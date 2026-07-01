import { Box, Button, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PageHeader } from '../../shared/PageHeader';
import { StatusChip } from '../../shared/StatusChip';
import { locations } from '../../data/mock';

export function LocationsPage() {
  const cols: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Location', flex: 1, minWidth: 220 },
    { field: 'zone', headerName: 'Zone', width: 120 },
    { field: 'properties', headerName: 'Properties', width: 120, type: 'number' },
    { field: 'status', headerName: 'Status', width: 130, renderCell: (p) => <StatusChip status={p.value} /> },
  ];
  return (
    <>
      <PageHeader eyebrow="Area" title="Locations" description="Named locations map to properties for on-street inspection and enforcement."
        actions={<Button variant="contained" startIcon={<Add />}>New location</Button>} />
      <Paper>
        <Box sx={{ height: 480 }}>
          <DataGrid rows={locations} columns={cols} disableRowSelectionOnClick />
        </Box>
      </Paper>
    </>
  );
}
