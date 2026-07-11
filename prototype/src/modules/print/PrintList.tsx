import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Menu, MenuItem, Stack, TextField, Typography, Alert,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { PageHeader } from '../../shared/PageHeader';
import { applications } from '../../data/mock';
import { ConfirmDialog } from '../../components/dialogs/ConfirmDialog';

export type PrintRow = {
  id: string;
  ref: string;
  permissionGroup: string;
  permissionName: string;
  vrm: string;
  workQueueStatus: string;
  applicant: string;
  address: string;
  postcode: string;
  appliedOn: string;
  startDate: string;
  expiryDate: string;
  physicalStatus: 'active' | 'deactive';
};

const VRMS = ['AB12 CDE', 'LK21 MNP', 'BX70 XYZ', 'JS08 KLM', 'TR19 QWE', 'MN22 RTY'];
const POSTCODES = ['SK1 3AZ', 'M4 1LE', 'M1 2AB', 'SK7 5PP', 'M2 3JB'];
const ADDR = ['12 Church Lane', '48 Kingsway', '3 Market Street', '210 Mill Road', '77 Riverside Ave'];

export const buildPrintRows = (activeLabel: 'print' | 'active'): PrintRow[] =>
  applications.slice(0, 24).map((a, i) => ({
    id: a.id,
    ref: a.ref,
    permissionGroup: `${a.type} — ${a.zone.split(' ')[0]}`,
    permissionName: a.permission,
    vrm: VRMS[i % VRMS.length],
    workQueueStatus: a.status,
    applicant: a.applicant,
    address: ADDR[i % ADDR.length],
    postcode: POSTCODES[i % POSTCODES.length],
    appliedOn: '02/03/2026',
    startDate: '15/03/2026',
    expiryDate: '14/03/2027',
    physicalStatus: i % 3 === 0 ? 'deactive' : (activeLabel === 'print' ? 'active' : 'active'),
  }));

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  searchPlaceholder?: string;
  activeLabel: 'Print' | 'Active';
  rows: PrintRow[];
  printPartnerEnabled?: boolean;
};

export function PrintList({
  eyebrow, title, description,
  searchPlaceholder = 'Search by Reference Number, Applicant Name',
  activeLabel, rows: initialRows, printPartnerEnabled = true,
}: Props) {
  const [rows, setRows] = useState<PrintRow[]>(initialRows);
  const [search, setSearch] = useState('');
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; row: PrintRow } | null>(null);
  const [previewRow, setPreviewRow] = useState<PrintRow | null>(null);
  const [confirmPrint, setConfirmPrint] = useState<{ ids: string[]; kind: 'row' | 'bulk' } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      r.ref.toLowerCase().includes(q) || r.applicant.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const doDownload = (ids: string[]) => {
    setToast(`Downloaded ${ids.length} document${ids.length === 1 ? '' : 's'}.`);
    setSelection([]);
  };

  const doSendToPrint = (ids: string[]) => {
    setRows(rows.map((r) => ids.includes(r.id) ? { ...r, physicalStatus: 'active' } : r));
    setToast(`Sent to print partner — Success: ${ids.length}, Failed: 0`);
    setSelection([]); setConfirmPrint(null);
  };

  const bulkDelete = () => {
    const ids = new Set(selection.map(String));
    setRows(rows.filter((r) => !ids.has(String(r.id))));
    setSelection([]);
    setToast(`${ids.size} deleted`);
    setConfirmDelete(false);
  };

  const cols: GridColDef[] = [
    { field: 'ref', headerName: 'Reference Number', width: 170,
      renderCell: (p) => (
        <Button size="small" variant="text" sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={() => setPreviewRow(p.row as PrintRow)}>{p.value}</Button>
      ) },
    { field: 'permissionGroup', headerName: 'Permission Group', width: 170 },
    { field: 'permissionName', headerName: 'Permission Name', flex: 1, minWidth: 200 },
    { field: 'vrm', headerName: 'VRM', width: 110,
      renderCell: (p) => <Chip size="small" label={p.value} variant="outlined" /> },
    { field: 'workQueueStatus', headerName: 'Work Queue Status', width: 160,
      renderCell: (p) => (
        <Chip size="small" label={p.value}
          color={p.value === 'Active' ? 'success' : p.value === 'Rejected' || p.value === 'Payment Failed' ? 'error' : 'warning'}
          variant="outlined" />
      ) },
    { field: 'applicant', headerName: 'Applicant Name', flex: 1, minWidth: 160 },
    { field: 'address', headerName: 'Address', flex: 1, minWidth: 170 },
    { field: 'postcode', headerName: 'Postcode', width: 110 },
    { field: 'appliedOn', headerName: 'Applied On', width: 120 },
    { field: 'startDate', headerName: 'Start Date', width: 120 },
    { field: 'expiryDate', headerName: 'Expiry Date', width: 120 },
    { field: 'physicalStatus', headerName: 'Physical Status', width: 140,
      renderCell: (p) => (
        <Chip size="small"
          label={p.value === 'active' ? activeLabel : 'Pending'}
          color={p.value === 'active' ? 'success' : 'warning'}
          variant={p.value === 'active' ? 'filled' : 'outlined'} />
      ) },
    { field: 'actions', headerName: 'Action', width: 70, sortable: false, filterable: false,
      renderCell: (p) => (
        <IconButton size="small" onClick={(e) => setMenuAnchor({ el: e.currentTarget, row: p.row as PrintRow })}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ) },
  ];

  return (
    <Box>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2 }}>
          <TextField size="small" placeholder={searchPlaceholder} sx={{ minWidth: 340 }}
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <Box sx={{ flex: 1 }} />
          {selection.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary">{selection.length} Row Selected</Typography>
              {printPartnerEnabled && (
                <Button variant="outlined" startIcon={<PrintIcon />}
                  onClick={() => setConfirmPrint({ ids: selection as string[], kind: 'bulk' })}>
                  Send to Print
                </Button>
              )}
              <Button variant="outlined" startIcon={<DownloadIcon />}
                onClick={() => doDownload(selection as string[])}>Download</Button>
              <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />}
                onClick={() => setConfirmDelete(true)}>Delete</Button>
            </>
          )}
        </Stack>

        <Box sx={{ height: 580, px: 2, pb: 2 }}>
          <DataGrid rows={filtered} columns={cols} getRowId={(r) => r.id} density="compact"
            checkboxSelection disableRowSelectionOnClick
            rowSelectionModel={selection} onRowSelectionModelChange={setSelection}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
        </Box>
      </Box>

      <Menu open={!!menuAnchor} anchorEl={menuAnchor?.el} onClose={() => setMenuAnchor(null)}>
        {printPartnerEnabled && (
          <MenuItem onClick={() => { if (menuAnchor) { setConfirmPrint({ ids: [menuAnchor.row.id], kind: 'row' }); setMenuAnchor(null); } }}>
            <PrintIcon fontSize="small" sx={{ mr: 1 }} /> Send to Print
          </MenuItem>
        )}
        <MenuItem onClick={() => { if (menuAnchor) { doDownload([menuAnchor.row.id]); setMenuAnchor(null); } }}>
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} /> Download
        </MenuItem>
        <MenuItem onClick={() => { if (menuAnchor) { setPreviewRow(menuAnchor.row); setMenuAnchor(null); } }}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> Preview
        </MenuItem>
      </Menu>

      {/* Preview modal */}
      <Dialog open={!!previewRow} onClose={() => setPreviewRow(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PictureAsPdfIcon color="error" />
            <Typography variant="h6">Preview — {previewRow?.ref}</Typography>
          </Stack>
          <IconButton onClick={() => setPreviewRow(null)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{
            minHeight: 480, bgcolor: 'grey.100', border: '1px dashed', borderColor: 'divider',
            borderRadius: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <PictureAsPdfIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              PDF preview for <strong>{previewRow?.ref}</strong> — {previewRow?.permissionName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              (Renders via pdfjs in production)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<DownloadIcon />} onClick={() => previewRow && doDownload([previewRow.id])}>Download</Button>
          {printPartnerEnabled && previewRow && (
            <Button variant="contained" startIcon={<PrintIcon />}
              onClick={() => setConfirmPrint({ ids: [previewRow.id], kind: 'row' })}>
              Send to Print
            </Button>
          )}
          <Button onClick={() => setPreviewRow(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Send to Print confirmation */}
      <Dialog open={!!confirmPrint} onClose={() => setConfirmPrint(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Send to Print Partner?</DialogTitle>
        <DialogContent>
          <Typography>
            Send {confirmPrint?.ids.length} document{confirmPrint?.ids.length === 1 ? '' : 's'} to the print partner? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmPrint(null)}>Cancel</Button>
          <Button variant="contained" onClick={() => confirmPrint && doSendToPrint(confirmPrint.ids)}>
            Send to Print
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      {toast && (
        <Alert severity="success" onClose={() => setToast(null)}
          sx={{ position: 'fixed', bottom: 24, right: 24, boxShadow: 3, zIndex: 2000 }}>
          {toast}
        </Alert>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={bulkDelete}
        title="Delete Documents?"
        message={`Are you sure you want to delete ${selection.length} selected document${selection.length === 1 ? '' : 's'}?`}
        confirmText="Delete"
        severity="error"
      />
    </Box>
  );
}
