import { Box, Button, Paper, Tab, Tabs } from '@mui/material';
import { Add, Upload } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { PageHeader } from '../../shared/PageHeader';
import { streets } from '../../data/mock';

export function StreetsPage() {
  const [tab, setTab] = useState<'White' | 'Black'>('White');
  const rows = streets.filter((s) => s.status === tab);
  const cols: GridColDef[] = [
    { field: 'usrn', headerName: 'USRN', width: 140 },
    { field: 'name', headerName: 'Street name', flex: 1, minWidth: 220 },
    { field: 'zone', headerName: 'Zone', width: 200 },
    ...(tab === 'Black' ? [{ field: 'expires', headerName: 'Blacklist expiry', width: 160, valueGetter: () => 'Indefinite' }] : []),
  ];

  return (
    <>
      <PageHeader eyebrow="Area" title="Streets" description="White list allows applications; Black list restricts them for a fixed or indefinite period."
        actions={<><Button variant="outlined" startIcon={<Upload />} sx={{ mr: 1 }}>Bulk import CSV</Button><Button variant="contained" startIcon={<Add />}>Add street</Button></>} />
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label={`White list (${streets.filter((s) => s.status === 'White').length})`} value="White" />
          <Tab label={`Black list (${streets.filter((s) => s.status === 'Black').length})`} value="Black" />
        </Tabs>
      </Paper>
      <Paper>
        <Box sx={{ height: 520 }}>
          <DataGrid rows={rows} columns={cols} disableRowSelectionOnClick />
        </Box>
      </Paper>
    </>
  );
}
