import { useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { LocalPrintshop, Send, DeleteOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { PageHeader } from '../../shared/PageHeader';
import { StatusChip } from '../../shared/StatusChip';
import { printQueue } from '../../data/mock';
import { useToast } from '../../components/Toast';
import { usePersistentState } from '../../hooks/usePersistentState';
import { ConfirmDialog } from '../../components/dialogs/ConfirmDialog';

export function PrintQueuePage() {
  const showToast = useToast();
  const [rows, setRows] = usePersistentState('prototype:print-queue:rows', () => printQueue);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const markPrinted = () => {
    const ids = new Set(selection.map(String));
    setRows(rows.map(r => ids.has(String(r.id)) ? { ...r, status: 'Printed' } : r));
    setSelection([]);
    showToast(`${ids.size} marked as printed`, 'success');
  };

  const bulkDelete = () => {
    const ids = new Set(selection.map(String));
    setRows(rows.filter(r => !ids.has(String(r.id))));
    setSelection([]);
    showToast(`${ids.size} deleted`, 'success');
    setConfirmDelete(false);
  };

  const cols: GridColDef[] = [
    { field: 'id', headerName: 'Print ID', width: 120 },
    { field: 'ref', headerName: 'Application', width: 160 },
    { field: 'applicant', headerName: 'Applicant', flex: 1, minWidth: 180 },
    { field: 'permission', headerName: 'Permission', flex: 1.2, minWidth: 220 },
    { field: 'requested', headerName: 'Requested', width: 130 },
    { field: 'status', headerName: 'Status', width: 170, renderCell: (p) => <StatusChip status={p.value} /> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Fulfilment"
        title="Print Queue"
        description="Physical permissions ready to be sent to the print partner or downloaded for white-mail dispatch."
      />
      <Paper>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2 }}>
          <Box sx={{ flex: 1 }} />
          {selection.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                {selection.length} Row Selected
              </Typography>
              <Button variant="outlined" onClick={markPrinted}>Mark Printed</Button>
              <Button variant="outlined" color="error" startIcon={<DeleteOutline />} onClick={() => setConfirmDelete(true)}>Delete</Button>
            </>
          )}
        </Stack>
        <Box sx={{ height: 540 }}>
          <DataGrid rows={rows} columns={cols} checkboxSelection disableRowSelectionOnClick
            rowSelectionModel={selection}
            onRowSelectionModelChange={setSelection} />
        </Box>
      </Paper>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={bulkDelete}
        title="Delete Queue Items?"
        message={`Are you sure you want to delete ${selection.length} selected item${selection.length === 1 ? '' : 's'}?`}
        confirmText="Delete"
        severity="error"
      />
    </>
  );
}
