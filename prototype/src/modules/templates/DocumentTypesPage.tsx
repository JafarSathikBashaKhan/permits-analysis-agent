import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
  IconButton, MenuItem, Stack, TextField, Typography, Alert, Divider,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';

const EXPIRATION_PERIODS = ['Days', 'Weeks', 'Months', 'Years'];

type DocumentType = {
  id: string;
  documentType: string;
  subTypes: string[];
  expirationFrequency?: number;
  expirationPeriod?: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
};

const seed = (): DocumentType[] => [
  {
    id: 'DT-001', documentType: 'Proof of Residency',
    subTypes: ['Utility Bill', 'Council Tax', 'Bank Statement'],
    expirationFrequency: 3, expirationPeriod: 'Months',
    createdOn: '12/03/2024', createdBy: 'System Admin',
    updatedOn: '15/06/2024', updatedBy: 'Sarah Johnson',
  },
  {
    id: 'DT-002', documentType: 'Vehicle Ownership',
    subTypes: ['V5C Document', 'Lease Agreement', 'Company Letter'],
    expirationFrequency: 1, expirationPeriod: 'Years',
    createdOn: '18/03/2024', createdBy: 'System Admin',
    updatedOn: '02/05/2024', updatedBy: 'Mark Peters',
  },
  {
    id: 'DT-003', documentType: 'Blue Badge',
    subTypes: ['Front of Badge', 'Back of Badge'],
    createdOn: '05/04/2024', createdBy: 'Sarah Johnson',
    updatedOn: '05/04/2024', updatedBy: 'Sarah Johnson',
  },
  {
    id: 'DT-004', documentType: 'Business Rates Bill',
    subTypes: ['Business Rates Bill'],
    expirationFrequency: 6, expirationPeriod: 'Months',
    createdOn: '22/04/2024', createdBy: 'Mark Peters',
    updatedOn: '10/06/2024', updatedBy: 'Mark Peters',
  },
];

type PanelMode = 'closed' | 'preview' | 'edit' | 'add';

export function DocumentTypesPage() {
  const showToast = useToast();
  const [rows, setRows] = usePersistentState<DocumentType[]>('prototype:templates:document-types:rows', seed);
  const [search, setSearch] = useState('');
  const [panel, setPanel] = useState<PanelMode>('closed');
  const [target, setTarget] = useState<DocumentType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DocumentType | null>(null);

  const [docTypeName, setDocTypeName] = useState('');
  const [subTypes, setSubTypes] = useState<string[]>([]);
  const [subTypeInput, setSubTypeInput] = useState('');
  const [freq, setFreq] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useMemo(() => {
    if (panel === 'add') {
      setDocTypeName(''); setSubTypes([]); setSubTypeInput(''); setFreq(''); setPeriod(''); setError(null);
    } else if (panel === 'edit' && target) {
      setDocTypeName(target.documentType);
      setSubTypes([...target.subTypes]);
      setSubTypeInput('');
      setFreq(target.expirationFrequency ? String(target.expirationFrequency) : '');
      setPeriod(target.expirationPeriod || '');
      setError(null);
    }
  }, [panel, target]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.documentType.toLowerCase().includes(q));
  }, [rows, search]);

  const addSubType = () => {
    const v = subTypeInput.trim();
    if (!v) return;
    if (subTypes.some((s) => s.toLowerCase() === v.toLowerCase())) {
      setError('Sub type already exists.');
      return;
    }
    setSubTypes([...subTypes, v]);
    setSubTypeInput('');
    setError(null);
  };

  const removeSubType = (idx: number) => setSubTypes(subTypes.filter((_, i) => i !== idx));

  const pairedInvalid = (!!freq) !== (!!period);

  const saveable =
    docTypeName.trim().length > 0 && subTypes.length > 0 && !pairedInvalid;

  const save = () => {
    if (!saveable) return;
    const now = new Date().toLocaleDateString('en-GB');
    if (panel === 'add') {
      const id = `DT-${String(rows.length + 1).padStart(3, '0')}`;
      setRows([
        ...rows,
        {
          id, documentType: docTypeName.trim(), subTypes: [...subTypes],
          expirationFrequency: freq ? Number(freq) : undefined,
          expirationPeriod: period || undefined,
          createdOn: now, createdBy: 'Current User', updatedOn: now, updatedBy: 'Current User',
        },
      ]);
      showToast('Document Type created successfully', 'success');
    } else if (panel === 'edit' && target) {
      setRows(rows.map((r) => r.id === target.id ? {
        ...r,
        documentType: docTypeName.trim(),
        subTypes: [...subTypes],
        expirationFrequency: freq ? Number(freq) : undefined,
        expirationPeriod: period || undefined,
        updatedOn: now, updatedBy: 'Current User',
      } : r));
      showToast('Document Type updated successfully', 'success');
    }
    setPanel('closed'); setTarget(null);
  };

  const doDelete = () => {
    if (!deleteTarget) return;
    setRows(rows.filter((r) => r.id !== deleteTarget.id));
    showToast('Document Type deleted successfully', 'success');
    setDeleteTarget(null);
  };

  const cols: GridColDef[] = [
    {
      field: 'documentType', headerName: 'Document Type', flex: 1.4, minWidth: 200,
      renderCell: (p) => (
        <Button
          size="small" variant="text" sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={() => { setTarget(p.row as DocumentType); setPanel('preview'); }}
        >{p.value}</Button>
      ),
    },
    { field: 'subCount', headerName: 'No of Sub Type', width: 140,
      valueGetter: (_v, r) => (r as DocumentType).subTypes.length },
    { field: 'createdOn', headerName: 'Created On', width: 130 },
    { field: 'createdBy', headerName: 'Created By', width: 160 },
    { field: 'updatedOn', headerName: 'Updated On', width: 130 },
    { field: 'updatedBy', headerName: 'Updated By', width: 160 },
    {
      field: 'actions', headerName: 'Actions', width: 90, sortable: false, filterable: false,
      renderCell: (p) => (
        <IconButton size="small" color="error" onClick={() => setDeleteTarget(p.row as DocumentType)}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader eyebrow="Templates" title="Document Types" description="Document type catalogue with sub-types and optional expiration." />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
        <TextField
          size="small" placeholder="Search by Document Type"
          value={search} onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
        />
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setTarget(null); setPanel('add'); }}>
          Add Document Type
        </Button>
      </Stack>

      <Box sx={{ height: 560, bgcolor: 'background.paper', borderRadius: 1 }}>
        <DataGrid rows={filtered} columns={cols} getRowId={(r) => r.id} density="compact"
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection disableRowSelectionOnClick />
      </Box>

      <Drawer anchor="right" open={panel !== 'closed'} onClose={() => { setPanel('closed'); setTarget(null); }}
        PaperProps={{ sx: { width: { xs: '100%', sm: 640 } } }}>
        <Stack sx={{ height: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between"
            sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
            <Typography variant="h6">
              {panel === 'preview' ? 'Document Type' : panel === 'edit' ? 'Edit Document Type' : 'Add Document Type'}
            </Typography>
            <Stack direction="row" spacing={1}>
              {panel === 'preview' && target && (
                <Button size="small" startIcon={<EditIcon />} onClick={() => setPanel('edit')}>Edit</Button>
              )}
              <IconButton onClick={() => { setPanel('closed'); setTarget(null); }}><CloseIcon /></IconButton>
            </Stack>
          </Stack>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
            {panel === 'preview' && target ? (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Document Type</Typography>
                  <Typography variant="body1" fontWeight={600}>{target.documentType}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">Sub Types ({target.subTypes.length})</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                    {target.subTypes.map((s) => <Chip key={s} label={s} size="small" />)}
                  </Stack>
                </Box>
                {target.expirationFrequency && target.expirationPeriod && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Expiration</Typography>
                    <Typography variant="body2">{target.expirationFrequency} {target.expirationPeriod}</Typography>
                  </Box>
                )}
                <Divider />
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography variant="body2">{target.createdOn} · {target.createdBy}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Updated</Typography>
                    <Typography variant="body2">{target.updatedOn} · {target.updatedBy}</Typography>
                  </Box>
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={2.5}>
                {error && <Alert severity="warning">{error}</Alert>}
                <TextField
                  label="Document Type *" fullWidth size="small" value={docTypeName}
                  onChange={(e) => setDocTypeName(e.target.value.slice(0, 100))}
                  helperText="Alpha only, max 100 characters."
                />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Sub Types *</Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField size="small" fullWidth placeholder="Enter sub type" value={subTypeInput}
                      onChange={(e) => setSubTypeInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubType(); } }}
                    />
                    <Button variant="outlined" onClick={addSubType}>Add</Button>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
                    {subTypes.map((s, i) => (
                      <Chip key={`${s}-${i}`} label={s} size="small" onDelete={() => removeSubType(i)} />
                    ))}
                    {subTypes.length === 0 && (
                      <Typography variant="caption" color="text.secondary">At least one sub type is required.</Typography>
                    )}
                  </Stack>
                </Box>

                <Divider>Expiration (optional)</Divider>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Frequency" size="small" fullWidth type="number"
                    inputProps={{ min: 1, max: 999 }}
                    value={freq} onChange={(e) => setFreq(e.target.value)}
                  />
                  <TextField
                    label="Period" size="small" fullWidth select
                    value={period} onChange={(e) => setPeriod(e.target.value)}
                  >
                    <MenuItem value="">—</MenuItem>
                    {EXPIRATION_PERIODS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </TextField>
                </Stack>
                {pairedInvalid && (
                  <Alert severity="warning">Both Frequency and Period must be filled, or both left empty.</Alert>
                )}
              </Stack>
            )}
          </Box>

          {panel !== 'preview' && (
            <Stack direction="row" spacing={1} justifyContent="flex-end"
              sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button onClick={() => { setPanel('closed'); setTarget(null); }}>Cancel</Button>
              <Button variant="contained" disabled={!saveable} onClick={save}>Save</Button>
            </Stack>
          )}
        </Stack>
      </Drawer>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete document type?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteTarget?.documentType}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={doDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
