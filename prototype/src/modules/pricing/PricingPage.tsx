import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Stack, Tab, Tabs, TextField, Typography, Alert, Menu, MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';

const PERM_TYPES = ['Residents Permit', 'Business Permit', 'Visitor Permit', 'Suspension', 'Dispensation'];
const SUB_TYPES = ['Standard', 'Concession', 'Trade', 'Event', 'Other'];

type Pricing = {
  id: string;
  name: string;
  permissionType: string;
  subType: string;
  noOfZones?: number;
  duration: string;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Published' | 'Unpublished';
  createdOn: string;
  createdByUser: string;
  updatedOn: string;
  updatedByUser: string;
};

const seedPricing = (kind: 'zonal' | 'nonzonal' | 'rule'): Pricing[] =>
  Array.from({ length: 8 }, (_, i) => ({
    id: `${kind}-p-${i + 1}`,
    name: `${kind === 'zonal' ? 'Zonal' : kind === 'nonzonal' ? 'Non-Zonal' : 'Rule-Based'} Pricing ${i + 1}`,
    permissionType: PERM_TYPES[i % PERM_TYPES.length],
    subType: SUB_TYPES[i % SUB_TYPES.length],
    noOfZones: kind === 'zonal' ? (i % 5) + 1 : undefined,
    duration: `${(i % 6) + 1} months`,
    startDate: `2026-${String((i % 12) + 1).padStart(2, '0')}-01`,
    endDate: `2026-${String((i % 12) + 1).padStart(2, '0')}-28`,
    status: (['Draft', 'Published', 'Unpublished'] as const)[i % 3],
    createdOn: `2025-${String((i % 12) + 1).padStart(2, '0')}-14 09:12`,
    createdByUser: 'admin.user',
    updatedOn: `2026-${String((i % 6) + 1).padStart(2, '0')}-02 14:22`,
    updatedByUser: 'ops.team',
  }));

function StatusChip({ v }: { v: Pricing['status'] }) {
  const color = v === 'Published' ? 'success' : v === 'Draft' ? 'default' : 'warning';
  return <Chip size="small" variant="outlined" label={v} color={color as any} />;
}

export function PricingPage() {
  const showToast = useToast();
  const [tab, setTab] = useState(0);
  const [zonal, setZonal] = usePersistentState<Pricing[]>('prototype:pricing:zonal', () => seedPricing('zonal'));
  const [nonzonal, setNonzonal] = usePersistentState<Pricing[]>('prototype:pricing:nonzonal', () => seedPricing('nonzonal'));
  const [rule, setRule] = usePersistentState<Pricing[]>('prototype:pricing:rule', () => seedPricing('rule'));
  const [q, setQ] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; row: Pricing } | null>(null);
  const [deleting, setDeleting] = useState<Pricing | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const currentRows = tab === 0 ? zonal : tab === 1 ? nonzonal : rule;
  const setCurrentRows = tab === 0 ? setZonal : tab === 1 ? setNonzonal : setRule;

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return currentRows;
    return currentRows.filter((r) => r.name.toLowerCase().includes(ql) || r.permissionType.toLowerCase().includes(ql));
  }, [currentRows, q]);

  const columnsBase: GridColDef<Pricing>[] = [
    { field: 'name', headerName: 'Pricing Name', flex: 1.4, minWidth: 200 },
    { field: 'permissionType', headerName: 'Permission Type', width: 170 },
    { field: 'subType', headerName: 'Sub Type', width: 130 },
  ];
  const columnsZonal: GridColDef<Pricing>[] = [
    ...columnsBase,
    { field: 'noOfZones', headerName: 'No of Zones', width: 120, type: 'number' },
    { field: 'duration', headerName: 'Duration', width: 130 },
    { field: 'startDate', headerName: 'Start Date', width: 120 },
    { field: 'endDate', headerName: 'End Date', width: 120 },
    { field: 'status', headerName: 'Status', width: 130, renderCell: (p) => <StatusChip v={p.value as any} /> },
    { field: 'createdOn', headerName: 'Created On', width: 140 },
    { field: 'createdByUser', headerName: 'Created By', width: 120 },
    { field: 'updatedOn', headerName: 'Updated On', width: 140 },
    { field: 'updatedByUser', headerName: 'Updated By', width: 120 },
    {
      field: 'actions', headerName: 'Action', width: 80, sortable: false,
      renderCell: (p) => (
        <IconButton size="small" onClick={(e) => setMenuAnchor({ el: e.currentTarget, row: p.row })}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];
  const columnsNonZonal: GridColDef<Pricing>[] = columnsZonal.filter((c) => c.field !== 'noOfZones');

  const columns = tab === 0 ? columnsZonal : columnsNonZonal;

  return (
    <>
      <PageHeader eyebrow="Permission Setup" title="Pricing"
        description="Manage general and rule-based prices for zonal and non-zonal permit types." />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tab label={<Stack direction="row" spacing={1} alignItems="center"><span>General Pricing Zonal</span><Chip label={zonal.length} size="small" /></Stack>} />
        <Tab label={<Stack direction="row" spacing={1} alignItems="center"><span>General Pricing Non-Zonal</span><Chip label={nonzonal.length} size="small" /></Stack>} />
        <Tab label={<Stack direction="row" spacing={1} alignItems="center"><span>Rule Based Pricing Non-Zonal</span><Chip label={rule.length} size="small" /></Stack>} />
      </Tabs>

      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <TextField size="small" placeholder="Search Pricing" value={q}
          onChange={(e) => setQ(e.target.value)} sx={{ flex: 1, maxWidth: 420 }} />
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setImportOpen(true)}>Import</Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => showToast('Add pricing dialog coming soon', 'info')}>Add Pricing</Button>
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DataGrid<Pricing> rows={filtered} columns={columns} autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} />
      </Box>

      <Menu anchorEl={menuAnchor?.el} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> View / Edit
        </MenuItem>
        {menuAnchor?.row.status !== 'Published' && (
          <MenuItem onClick={() => { if (menuAnchor) { setDeleting(menuAnchor.row); setMenuAnchor(null); } }}>
            <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        )}
      </Menu>

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Pricing?</DialogTitle>
        <DialogContent>
          {deleting?.status === 'Published' ? (
            <Alert severity="warning">Published prices cannot be deleted.</Alert>
          ) : (
            <Typography>Are you sure you want to delete <b>{deleting?.name}</b>?</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          {deleting?.status !== 'Published' && (
            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => {
              if (deleting) setCurrentRows((prev) => prev.filter((r) => r.id !== deleting.id));
              setDeleting(null);
            }}>Delete</Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={importOpen} onClose={() => setImportOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Pricing</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info">
              Expected columns: Zone Set Name, Zone Name, Duration, Tier, Price, Diesel Surcharge.
            </Alert>
            <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => showToast('File chooser coming soon', 'info')}>Choose file</Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setImportOpen(false)}>Import</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
