import { Box, InputAdornment, Paper, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { PageHeader } from '../../shared/PageHeader';

const APPLICANTS = Array.from({ length: 40 }).map((_, i) => ({
  id: `AP-${1000 + i}`,
  name: ['Alice Whittaker','Ben Turner','Cheryl Iyer','Danny O\'Neill','Eesha Patel','Frank Bell','Grace Adeyemi','Harjeet Singh','Isla Robertson','James Coates'][i % 10] + (i > 9 ? ` ${Math.floor(i / 10)}` : ''),
  email: `applicant${i}@example.co.uk`,
  activePermits: (i * 7) % 5,
  vehicles: ((i * 3) % 4) + 1,
  lastActive: `2026-0${1 + (i % 6)}-${String(1 + (i % 27)).padStart(2, '0')}`,
  blueBadge: i % 9 === 0 ? 'Yes' : 'No',
}));

export function ApplicantsPage() {
  const [q, setQ] = useState('');
  const rows = useMemo(() => APPLICANTS.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()) || a.email.toLowerCase().includes(q.toLowerCase())), [q]);

  const cols: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 110 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 180 },
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 240 },
    { field: 'activePermits', headerName: 'Active permits', width: 130, type: 'number' },
    { field: 'vehicles', headerName: 'Vehicles', width: 100, type: 'number' },
    { field: 'blueBadge', headerName: 'Blue Badge', width: 120 },
    { field: 'lastActive', headerName: 'Last active', width: 130 },
  ];

  return (
    <>
      <PageHeader eyebrow="Users" title="Applicants" description="Customers who apply for permits via the portal or in person." />
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField placeholder="Search applicants" value={q} onChange={(e) => setQ(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} sx={{ maxWidth: 420 }} fullWidth />
      </Paper>
      <Paper>
        <Box sx={{ height: 560 }}>
          <DataGrid rows={rows} columns={cols} disableRowSelectionOnClick pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
        </Box>
      </Paper>
    </>
  );
}
