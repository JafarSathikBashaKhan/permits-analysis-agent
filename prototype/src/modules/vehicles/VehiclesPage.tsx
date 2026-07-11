import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, IconButton, MenuItem, Stack, TextField, Typography, Drawer,
  Divider, Grid, Card, CardContent,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import DirectionsCarFilledOutlined from '@mui/icons-material/DirectionsCarFilledOutlined';
import ElectricCarOutlined from '@mui/icons-material/ElectricCarOutlined';
import LocalGasStationOutlined from '@mui/icons-material/LocalGasStationOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import { PageHeader } from '../../shared/PageHeader';
import { tokens } from '../../theme';
import { useToast } from '../../components/Toast';
import { usePersistentState } from '../../hooks/usePersistentState';
import { AddVehicleDialog } from '../../components/dialogs/AddVehicleDialog';

type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'LPG';
type Status = 'Active' | 'Pending' | 'Suspended' | 'Expired' | 'Temporary';

type Vehicle = {
  id: string;
  vrm: string;
  make: string;
  model: string;
  colour: string;
  fuel: FuelType;
  co2: number;
  euro: string;
  owner: string;
  applicationId: string;
  permission: string;
  status: Status;
  registeredOn: string;
  autoguruVerified: boolean;
};

const MAKES = ['Ford', 'BMW', 'VW', 'Tesla', 'Toyota', 'Vauxhall', 'Nissan', 'Mercedes', 'Audi', 'Honda', 'Kia', 'Peugeot'];
const MODELS = ['Focus', '3 Series', 'Golf', 'Model 3', 'Yaris', 'Corsa', 'Leaf', 'A-Class', 'A3', 'Civic', 'Sportage', '208'];
const COLOURS = ['Black', 'White', 'Silver', 'Grey', 'Blue', 'Red', 'Green'];
const OWNERS = ['James Wilson', 'Priya Patel', 'David Chen', 'Sarah O\'Brien', 'Michael Ross', 'Amina Suleiman', 'Tom Whitfield', 'Rachel Green'];
const PERMISSIONS = ['Resident Permit', 'Visitor Permit', 'Business Permit', 'Trades Permit', 'Blue Badge Permit'];

const seedVehicles = (): Vehicle[] => {
  const rows: Vehicle[] = [];
  for (let i = 1; i <= 42; i++) {
    const fuel: FuelType = i % 6 === 0 ? 'Electric' : i % 5 === 0 ? 'Diesel' : i % 4 === 0 ? 'Hybrid' : 'Petrol';
    const status: Status = i % 9 === 0 ? 'Suspended' : i % 7 === 0 ? 'Pending' : i % 11 === 0 ? 'Expired' : i % 13 === 0 ? 'Temporary' : 'Active';
    const letters = String.fromCharCode(65 + (i % 26)) + String.fromCharCode(66 + (i % 25));
    const digits = String(10 + (i * 7) % 89);
    const suffix = String.fromCharCode(65 + ((i * 3) % 26)) + String.fromCharCode(65 + ((i * 5) % 26)) + String.fromCharCode(65 + ((i * 11) % 26));
    rows.push({
      id: `V-${1000 + i}`,
      vrm: `${letters}${digits}${suffix}`,
      make: MAKES[i % MAKES.length],
      model: MODELS[i % MODELS.length],
      colour: COLOURS[i % COLOURS.length],
      fuel,
      co2: fuel === 'Electric' ? 0 : 80 + (i * 3) % 130,
      euro: fuel === 'Electric' ? 'N/A' : `Euro ${4 + (i % 3)}`,
      owner: OWNERS[i % OWNERS.length],
      applicationId: `AP-2026-${1000 + i}`,
      permission: PERMISSIONS[i % PERMISSIONS.length],
      status,
      registeredOn: `${1 + (i % 28)} ${['Jan','Feb','Mar','Apr','May','Jun','Jul'][i % 7]} 2026`,
      autoguruVerified: i % 5 !== 0,
    });
  }
  return rows;
};

const STATUS_CHIP: Record<Status, { bg: string; fg: string }> = {
  Active:     { bg: '#E7F5EC', fg: '#1E7E34' },
  Pending:    { bg: '#FFF7E0', fg: '#8A6D00' },
  Suspended:  { bg: '#FDECEA', fg: '#B71C1C' },
  Expired:    { bg: '#EEEEEE', fg: '#616161' },
  Temporary:  { bg: '#EAF3FB', fg: '#0D3E66' },
};

const FUEL_ICON: Record<FuelType, React.ReactNode> = {
  Petrol:   <LocalGasStationOutlined fontSize="small" sx={{ color: '#8B6F00' }} />,
  Diesel:   <LocalGasStationOutlined fontSize="small" sx={{ color: '#B71C1C' }} />,
  Electric: <ElectricCarOutlined fontSize="small" sx={{ color: '#1B7A45' }} />,
  Hybrid:   <ElectricCarOutlined fontSize="small" sx={{ color: '#0D3E66' }} />,
  LPG:      <LocalGasStationOutlined fontSize="small" sx={{ color: '#5D4037' }} />,
};

export function VehiclesPage() {
  const showToast = useToast();
  const [rows, setRows] = usePersistentState<Vehicle[]>('prototype:vehicles', () => seedVehicles());
  const [search, setSearch] = useState('');
  const [fuelFilter, setFuelFilter] = useState<'All' | FuelType>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (fuelFilter !== 'All' && r.fuel !== fuelFilter) return false;
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (q && !`${r.vrm} ${r.make} ${r.model} ${r.owner} ${r.applicationId}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, search, fuelFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'Active').length,
    electric: rows.filter((r) => r.fuel === 'Electric').length,
    diesel: rows.filter((r) => r.fuel === 'Diesel').length,
  }), [rows]);

  const columns: GridColDef<Vehicle>[] = [
    { field: 'vrm', headerName: 'VRM', width: 120,
      renderCell: (p) => <Typography sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{p.value}</Typography> },
    { field: 'make', headerName: 'Make', width: 110 },
    { field: 'model', headerName: 'Model', width: 130 },
    { field: 'colour', headerName: 'Colour', width: 90 },
    { field: 'fuel', headerName: 'Fuel', width: 120,
      renderCell: (p) => <Stack direction="row" spacing={0.75} alignItems="center">{FUEL_ICON[p.value as FuelType]}<span>{p.value}</span></Stack> },
    { field: 'co2', headerName: 'CO2 (g/km)', width: 110, type: 'number' },
    { field: 'euro', headerName: 'Euro', width: 90 },
    { field: 'owner', headerName: 'Owner', width: 170 },
    { field: 'applicationId', headerName: 'Application', width: 130 },
    { field: 'permission', headerName: 'Permission', width: 170 },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (p) => {
        const s = STATUS_CHIP[p.value as Status];
        return <Chip size="small" label={p.value} sx={{ bgcolor: s.bg, color: s.fg, fontWeight: 600 }} />;
      } },
    { field: 'actions', headerName: '', width: 80, sortable: false, filterable: false,
      renderCell: (p) => (
        <IconButton size="small" onClick={() => setSelected(p.row)} title="View details">
          <VisibilityOutlined fontSize="small" />
        </IconButton>
      ) },
  ];

  return (
    <Box>
      <PageHeader
        eyebrow="Vehicles"
        title="Vehicle Register"
        description="All vehicles registered across permit applications. Search, filter by fuel and status, and open any vehicle to view its Autoguru details."
        actions={
          <>
            <Button variant="outlined" startIcon={<DownloadOutlined />} onClick={() => showToast('Exporting…', 'info')}>Export</Button>
            <Button variant="contained" onClick={() => setAddVehicleOpen(true)}>Add Vehicle</Button>
          </>
        }
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: 'Total Vehicles', value: stats.total, hint: 'On register' },
          { label: 'Active', value: stats.active, hint: 'Currently valid' },
          { label: 'Electric / Hybrid', value: stats.electric, hint: 'Zero-emission' },
          { label: 'Diesel', value: stats.diesel, hint: 'Diesel surcharge applies' },
        ].map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Card variant="outlined">
              <CardContent>
                <Typography sx={{ color: tokens.MUTED, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</Typography>
                <Typography sx={{ fontSize: '1.7rem', fontWeight: 700, mt: 0.25 }}>{s.value}</Typography>
                <Typography sx={{ color: tokens.MUTED, fontSize: '0.78rem' }}>{s.hint}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <TextField
              size="small" placeholder="Search VRM, make, model, owner…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <SearchOutlined fontSize="small" sx={{ mr: 1, color: tokens.MUTED }} /> }}
              sx={{ minWidth: 320 }}
            />
            <TextField select size="small" label="Fuel" value={fuelFilter} onChange={(e) => setFuelFilter(e.target.value as any)} sx={{ minWidth: 160 }}>
              {(['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG'] as const).map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} sx={{ minWidth: 160 }}>
              {(['All', 'Active', 'Pending', 'Suspended', 'Expired', 'Temporary'] as const).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <Box sx={{ flex: 1 }} />
            <Typography sx={{ color: tokens.MUTED, alignSelf: 'center' }}>
              Showing <b>{filtered.length}</b> of {rows.length}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ height: 620, width: '100%' }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          density="standard"
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        />
      </Box>

      <Drawer anchor="right" open={!!selected} onClose={() => setSelected(null)}
        PaperProps={{ sx: { width: 460 } }}>
        {selected && (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <DirectionsCarFilledOutlined />
                <Typography variant="h6">{selected.vrm}</Typography>
              </Stack>
              <IconButton onClick={() => setSelected(null)}><CloseIcon /></IconButton>
            </Stack>
            <Chip size="small" label={selected.status} sx={{ bgcolor: STATUS_CHIP[selected.status].bg, color: STATUS_CHIP[selected.status].fg, fontWeight: 600, mb: 2 }} />
            <Divider sx={{ mb: 2 }} />
            {[
              ['Make', selected.make], ['Model', selected.model], ['Colour', selected.colour],
              ['Fuel', selected.fuel], ['CO2', `${selected.co2} g/km`], ['Euro Standard', selected.euro],
              ['Owner', selected.owner], ['Application', selected.applicationId],
              ['Permission', selected.permission], ['Registered', selected.registeredOn],
              ['Autoguru', selected.autoguruVerified ? '✓ Verified' : 'Not verified'],
            ].map(([k, v]) => (
              <Stack key={k as string} direction="row" justifyContent="space-between" sx={{ py: 0.75 }}>
                <Typography sx={{ color: tokens.MUTED }}>{k}</Typography>
                <Typography sx={{ fontWeight: 600 }}>{v}</Typography>
              </Stack>
            ))}
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" fullWidth onClick={() => showToast('Edit form coming soon', 'info')}>Edit</Button>
              <Button variant="contained" fullWidth onClick={() => showToast('Open Application — coming soon', 'info')}>Open Application</Button>
            </Stack>
          </Box>
        )}
      </Drawer>

      <AddVehicleDialog
        open={addVehicleOpen}
        onClose={() => setAddVehicleOpen(false)}
        onSave={(v) => {
          setRows((prev) => [...prev, {
            id: v.id,
            vrm: v.vrm,
            make: v.make,
            model: v.model,
            colour: v.colour,
            fuel: (v.fuelType as FuelType),
            co2: 0,
            euro: 'N/A',
            owner: '—',
            applicationId: '—',
            permission: '—',
            status: v.temporary ? 'Temporary' : 'Pending',
            registeredOn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            autoguruVerified: false,
          }]);
          showToast('Vehicle added', 'success');
        }}
      />
    </Box>
  );
}
