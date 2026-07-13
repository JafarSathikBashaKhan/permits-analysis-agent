import { useState, useMemo } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
  MenuItem, Stack, TextField, Typography, Alert,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';
import { ImportCsvDialog } from '../../components/dialogs/ImportCsvDialog';
import { ConfirmDialog } from '../../components/dialogs/ConfirmDialog';

type RejectReason = {
  id: string;
  reason: string;
  organization: string;
  contract: string;
  createdBy: string;
  createdOn: string;
  lastUpdatedBy: string;
  lastUpdatedOn: string;
};

const seedReasons = (): RejectReason[] => [
  {
    id: 'rr-1',
    reason: 'Incomplete documentation',
    organization: 'Wokingham Council',
    contract: 'WOK-APPLY-2024',
    createdBy: 'admin.user',
    createdOn: '2024-11-15 10:22',
    lastUpdatedBy: 'ops.team',
    lastUpdatedOn: '2024-12-01 14:35',
  },
  {
    id: 'rr-2',
    reason: 'Vehicle not registered to applicant',
    organization: 'Wokingham Council',
    contract: 'WOK-APPLY-2024',
    createdBy: 'admin.user',
    createdOn: '2024-11-18 11:03',
    lastUpdatedBy: 'ops.team',
    lastUpdatedOn: '2024-12-02 09:15',
  },
  {
    id: 'rr-3',
    reason: 'Proof of residence missing',
    organization: 'Wokingham Council',
    contract: 'WOK-APPLY-2024',
    createdBy: 'admin.user',
    createdOn: '2024-12-01 08:45',
    lastUpdatedBy: 'ops.team',
    lastUpdatedOn: '2024-12-10 16:22',
  },
];

function ReasonDialog({
  open,
  onClose,
  reason,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  reason: RejectReason | null;
  onSave: (r: RejectReason) => void;
}) {
  const [form, setForm] = useState<RejectReason>({
    id: '',
    reason: '',
    organization: 'Wokingham Council',
    contract: 'WOK-APPLY-2024',
    createdBy: 'you',
    createdOn: new Date().toISOString().slice(0, 16).replace('T', ' '),
    lastUpdatedBy: 'you',
    lastUpdatedOn: new Date().toISOString().slice(0, 16).replace('T', ' '),
  });
  const [error, setError] = useState<string | null>(null);

  useMemo(() => {
    if (reason) setForm(reason);
    else
      setForm({
        id: `rr-${Date.now()}`,
        reason: '',
        organization: 'Wokingham Council',
        contract: 'WOK-APPLY-2024',
        createdBy: 'you',
        createdOn: new Date().toISOString().slice(0, 16).replace('T', ' '),
        lastUpdatedBy: 'you',
        lastUpdatedOn: new Date().toISOString().slice(0, 16).replace('T', ' '),
      });
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reason?.id]);

  const submit = () => {
    if (!form.reason.trim()) return setError('Reject Reason is required');
    if (!form.organization) return setError('Organization is required');
    if (!form.contract) return setError('Contract is required');
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={700}>
            {reason ? 'Edit Reject Reason' : 'Add Reject Reason'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2}>
          <TextField
            label="Organization"
            select
            fullWidth
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            required
          >
            <MenuItem value="Wokingham Council">Wokingham Council</MenuItem>
            <MenuItem value="Southend Council">Southend Council</MenuItem>
            <MenuItem value="Test Council">Test Council</MenuItem>
          </TextField>
          <TextField
            label="Contract"
            select
            fullWidth
            value={form.contract}
            onChange={(e) => setForm({ ...form, contract: e.target.value })}
            required
            helperText="Only contracts of type 'Apply' are shown"
          >
            <MenuItem value="WOK-APPLY-2024">WOK-APPLY-2024</MenuItem>
            <MenuItem value="SOU-APPLY-2024">SOU-APPLY-2024</MenuItem>
            <MenuItem value="TEST-APPLY-2024">TEST-APPLY-2024</MenuItem>
          </TextField>
          <TextField
            label="Reject Reason"
            fullWidth
            multiline
            rows={3}
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            required
            inputProps={{ maxLength: 5000 }}
            helperText={`${form.reason.length}/5000 characters`}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={submit}>
          {reason ? 'Save Changes' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function RejectReasonsPage() {
  const showToast = useToast();
  const [rows, setRows] = usePersistentState<RejectReason[]>('prototype:mnps-contract:rejectReasons', seedReasons);
  const [q, setQ] = useState('');
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<RejectReason | null>(null);
  const [deleting, setDeleting] = useState<RejectReason | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return rows;
    return rows.filter(
      (r) =>
        r.reason.toLowerCase().includes(ql) ||
        r.organization.toLowerCase().includes(ql) ||
        r.contract.toLowerCase().includes(ql)
    );
  }, [rows, q]);

  const save = (r: RejectReason) => {
    const isEdit = rows.some((x) => x.id === r.id);
    setRows((prev) => {
      const exists = prev.some((x) => x.id === r.id);
      return exists ? prev.map((x) => (x.id === r.id ? r : x)) : [r, ...prev];
    });
    showToast(
      isEdit ? 'Rejection reason updated successfully' : 'New rejection reason is added',
      'success'
    );
  };

  const bulkDelete = () => {
    const ids = new Set(selection.map(String));
    setRows(rows.filter((r) => !ids.has(String(r.id))));
    setSelection([]);
    showToast(`${ids.size} rejection reason(s) deleted`, 'success');
    setConfirmBulkDelete(false);
  };

  const columns: GridColDef<RejectReason>[] = [
    {
      field: 'reason',
      headerName: 'Reject Reason',
      flex: 1.4,
      minWidth: 220,
      renderCell: (p) => (
        <Button
          size="small"
          variant="text"
          onClick={() => {
            setSelected(p.row);
            setDialogOpen(true);
          }}
        >
          {p.value}
        </Button>
      ),
    },
    { field: 'organization', headerName: 'Organization', width: 180 },
    { field: 'contract', headerName: 'Contract', width: 160 },
    { field: 'createdBy', headerName: 'Created By', width: 130 },
    { field: 'createdOn', headerName: 'Created On', width: 170 },
    { field: 'lastUpdatedBy', headerName: 'Last Updated By', width: 150 },
    { field: 'lastUpdatedOn', headerName: 'Last Updated On', width: 170 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => {
              setSelected(p.row);
              setDialogOpen(true);
            }}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setDeleting(p.row)}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="MNPS Configuration"
        title="Reject Reasons"
        description="Manage rejection reasons for applications. These appear in the Apply BO → Application → Reject action dropdown for the corresponding contract."
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="text"
              startIcon={<DownloadIcon />}
              onClick={() => showToast('Exporting…', 'info')}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => setImportOpen(true)}
            >
              Import CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelected(null);
                setDialogOpen(true);
              }}
            >
              Add Reject Reason
            </Button>
          </Stack>
        }
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField
          size="small"
          placeholder="Search by Reason, Organization, Contract"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          sx={{ flex: 1, maxWidth: 420 }}
        />
        <Box sx={{ flex: 1 }} />
        {selection.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {selection.length} Row{selection.length > 1 ? 's' : ''} Selected
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setConfirmBulkDelete(true)}
            >
              Delete
            </Button>
          </>
        )}
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <DataGrid<RejectReason>
          rows={filtered}
          columns={columns}
          autoHeight
          checkboxSelection
          rowSelectionModel={selection}
          onRowSelectionModelChange={setSelection}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        />
      </Box>

      <ReasonDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        reason={selected}
        onSave={save}
      />

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Reject Reason?</DialogTitle>
        <DialogContent>
          <Typography>
            Deleting this rejection reason will remove it from the contract. Existing applications
            won't be affected. Are you sure you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              if (deleting) setRows((prev) => prev.filter((r) => r.id !== deleting.id));
              showToast('Rejection reason deleted successfully', 'success');
              setDeleting(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ImportCsvDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        entityName="reject reasons"
        onImport={() => {}}
      />

      <ConfirmDialog
        open={confirmBulkDelete}
        onClose={() => setConfirmBulkDelete(false)}
        onConfirm={bulkDelete}
        title="Delete Reject Reasons?"
        message={`Are you sure you want to delete ${selection.length} selected rejection reason${
          selection.length === 1 ? '' : 's'
        }?`}
        confirmLabel="Delete"
        confirmColor="error"
      />
    </>
  );
}
