import { Box, Button, Paper, Stack } from '@mui/material';
import { LocalPrintshop, Send } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PageHeader } from '../../shared/PageHeader';
import { StatusChip } from '../../shared/StatusChip';
import { printQueue } from '../../data/mock';
import { useToast } from '../../components/Toast';

export function PrintQueuePage() {
  const showToast = useToast();
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
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<LocalPrintshop />} onClick={() => showToast('Downloading batch…', 'info')}>Download batch</Button>
            <Button variant="contained" startIcon={<Send />} onClick={() => showToast('Sent to print partner', 'success')}>Send to print</Button>
          </Stack>
        }
      />
      <Paper>
        <Box sx={{ height: 540 }}>
          <DataGrid rows={printQueue} columns={cols} checkboxSelection disableRowSelectionOnClick />
        </Box>
      </Paper>
    </>
  );
}
