import {
  Button, Chip, Divider, IconButton, Paper, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@mui/material';
import {
  DeleteOutlineOutlined, DownloadOutlined, PreviewOutlined, UploadFileOutlined,
  WarningAmberOutlined, EventBusyOutlined,
} from '@mui/icons-material';
import { tokens } from '../../../theme';
import { usePersistentState } from '../../../hooks/usePersistentState';
import { useToast } from '../../../components/Toast';
import { UploadDocumentDialog } from '../../../components/dialogs/UploadDocumentDialog';
import { useState } from 'react';
import { pushAudit } from '../helpers/auditLog';
import { getDocumentRetentionMonths } from '../helpers/settings';

/**
 * US-164968 (Documents tab), US-160622 (Upload), US-193567 (Renewal expired docs),
 * US-195183 (Skip if valid).
 */
export type ApplicationDoc = {
  id: string;
  name: string;
  type: string;
  uploaded: string;
  size: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Expired';
  expiresAt?: string;
};

export function DocumentsTab({ appId, renewalMode = false }: { appId: string; renewalMode?: boolean }) {
  const showToast = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const retentionMonths = getDocumentRetentionMonths();

  const [docs, setDocs] = usePersistentState<ApplicationDoc[]>(
    `prototype:applications:documents:${appId}`,
    () => {
      const today = new Date();
      const past = new Date(today); past.setMonth(past.getMonth() - retentionMonths - 2);
      return [
        { id: 'd1', name: 'Proof of Address.pdf', type: 'Proof of Address', uploaded: '2026-06-24', size: '212 KB', status: 'Approved', expiresAt: new Date(new Date('2026-06-24').setMonth(new Date('2026-06-24').getMonth() + retentionMonths)).toISOString().slice(0,10) },
        { id: 'd2', name: 'V5C.pdf',              type: 'Vehicle V5C',      uploaded: '2026-06-24', size: '384 KB', status: 'Pending', expiresAt: new Date(new Date('2026-06-24').setMonth(new Date('2026-06-24').getMonth() + retentionMonths)).toISOString().slice(0,10) },
      ];
    }
  );

  const now = new Date();
  const isExpired = (d: ApplicationDoc) => d.expiresAt ? new Date(d.expiresAt) < now : false;
  const anyExpired = docs.some(isExpired);
  const allValid = docs.length > 0 && !anyExpired;

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    showToast('Document deleted', 'success');
    pushAudit(appId, {
      actor: 'You', actorRole: 'BO User',
      eventName: 'Document Deleted', eventDescription: 'A supporting document was removed.',
      eventCategory: 'Application Processing',
    });
  };

  const handleDownload = (name: string) => showToast(`Downloading ${name}…`, 'info');

  return (
    <>
      <Paper sx={{ p: 2.5, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack>
            <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.1rem', color: tokens.INK }}>
              {renewalMode ? 'Renewal documents' : 'Documents'}
            </Typography>
            {renewalMode && (
              allValid
                ? <Typography variant="caption" color="success.main">All documents are still valid — you may skip upload and continue to payment (US-195183).</Typography>
                : <Typography variant="caption" color="warning.main">One or more documents are expired — new uploads required (US-193567).</Typography>
            )}
          </Stack>
          <Button size="small" variant="contained" startIcon={<UploadFileOutlined />} onClick={() => setUploadOpen(true)}>Upload Document</Button>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docs.map((d) => {
              const expired = isExpired(d);
              return (
                <TableRow key={d.id} hover>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.type}</TableCell>
                  <TableCell>{d.uploaded}</TableCell>
                  <TableCell>
                    {d.expiresAt ? (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        {expired && <EventBusyOutlined fontSize="small" color="error" />}
                        <Typography variant="body2">{d.expiresAt}</Typography>
                      </Stack>
                    ) : '—'}
                  </TableCell>
                  <TableCell>{d.size}</TableCell>
                  <TableCell>
                    <Chip size="small" label={expired ? 'Expired' : d.status}
                      color={expired ? 'error' : d.status === 'Approved' ? 'success' : d.status === 'Rejected' ? 'error' : 'default'} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small" onClick={() => handleDownload(d.name)}><DownloadOutlined fontSize="small" /></IconButton>
                      <IconButton size="small"><PreviewOutlined fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(d.id)}><DeleteOutlineOutlined fontSize="small" /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
            {docs.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: tokens.MUTED }}>No documents uploaded</TableCell></TableRow>}
          </TableBody>
        </Table>

        {renewalMode && anyExpired && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, p: 1.5, bgcolor: '#FFF8E1', borderRadius: 1 }}>
            <WarningAmberOutlined fontSize="small" color="warning" />
            <Typography variant="body2">Expired documents must be re-uploaded before renewal payment can be processed.</Typography>
          </Stack>
        )}
      </Paper>

      <UploadDocumentDialog
        open={uploadOpen} onClose={() => setUploadOpen(false)}
        onSave={(d) => {
          const uploaded = new Date();
          const expiresAt = new Date(uploaded); expiresAt.setMonth(expiresAt.getMonth() + retentionMonths);
          setDocs((prev) => [...prev, {
            id: `d${Date.now()}`, name: d.fileName, type: d.type,
            uploaded: uploaded.toISOString().slice(0,10), size: d.size,
            status: 'Pending', expiresAt: expiresAt.toISOString().slice(0,10),
          }]);
          showToast('Document uploaded', 'success');
          pushAudit(appId, {
            actor: 'You', actorRole: 'BO User',
            eventName: 'Document Uploaded',
            eventDescription: `Uploaded ${d.type}: ${d.fileName}`,
            eventCategory: 'Application Processing',
          });
        }}
      />
    </>
  );
}
