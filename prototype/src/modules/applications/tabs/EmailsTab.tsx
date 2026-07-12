import {
  Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Paper, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, Typography, Box,
} from '@mui/material';
import { EmailOutlined, PreviewOutlined, AttachFileOutlined, DownloadOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { tokens } from '../../../theme';
import { usePersistentState } from '../../../hooks/usePersistentState';
import { useToast } from '../../../components/Toast';
import { ComposeEmailDialog } from '../../../components/dialogs/ComposeEmailDialog';
import { pushAudit } from '../helpers/auditLog';

/**
 * US-164969 (Emails tab), US-165045 (Send), US-165891 (Save draft), US-165894 (Preview).
 */

type EmailRow = {
  id: string;
  date: string;
  to: string;
  cc?: string;
  subject: string;
  body?: string;
  attachments?: Array<{ name: string; size: string }>;
  direction: 'sent' | 'received';
  status: string;
};

export function EmailsTab({ appId }: { appId: string }) {
  const showToast = useToast();
  const [composeOpen, setComposeOpen] = useState(false);
  const [preview, setPreview] = useState<EmailRow | null>(null);

  const [emails, setEmails] = usePersistentState<EmailRow[]>(
    `prototype:applications:emails:${appId}`,
    () => [
      {
        id: 'e1', date: '2026-06-24 09:22',
        to: 'applicant@example.com',
        subject: 'Application received',
        body: 'Dear Applicant,\n\nThank you for submitting your permit application. It is currently being reviewed by our team.\n\nRegards,\nBack Office',
        direction: 'sent', status: 'Delivered',
        attachments: [{ name: 'Application-Receipt.pdf', size: '54 KB' }],
      },
      {
        id: 'e2', date: '2026-06-25 14:08',
        to: 'applicant@example.com',
        subject: 'Payment required',
        body: 'Please complete payment of £120 to activate your permit.',
        direction: 'sent', status: 'Delivered',
      },
    ]
  );

  return (
    <>
      <Paper sx={{ p: 2.5, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.1rem', color: tokens.INK }}>Email history</Typography>
          <Button size="small" variant="contained" startIcon={<EmailOutlined />} onClick={() => setComposeOpen(true)} data-testid="compose-email">
            Compose Email
          </Button>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sent</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>To/From</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Attachments</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emails.map((r) => (
              <TableRow key={r.id} hover onClick={() => setPreview(r)} sx={{ cursor: 'pointer' }} data-testid={`email-row-${r.id}`}>
                <TableCell>{r.date}</TableCell>
                <TableCell><Chip size="small" label={r.direction === 'sent' ? 'Sent' : 'Received'} color={r.direction === 'sent' ? 'primary' : 'default'} /></TableCell>
                <TableCell>{r.to}</TableCell>
                <TableCell>{r.subject}</TableCell>
                <TableCell>{r.attachments?.length ? <AttachFileOutlined fontSize="small" /> : ''}</TableCell>
                <TableCell><Chip size="small" label={r.status} /></TableCell>
                <TableCell>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); setPreview(r); }} data-testid={`preview-${r.id}`}><PreviewOutlined fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emails.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: tokens.MUTED }}>No emails</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>

      <ComposeEmailDialog
        open={composeOpen} onClose={() => setComposeOpen(false)}
        onSave={(e) => {
          setEmails((prev) => [{
            id: e.id, date: new Date().toLocaleString('en-GB'),
            to: e.to, subject: e.subject, body: e.body,
            direction: 'sent', status: 'Sent',
          }, ...prev]);
          showToast('Email sent', 'success');
          pushAudit(appId, {
            actor: 'You', actorRole: 'BO User',
            eventName: 'Email Sent',
            eventDescription: `Sent email to ${e.to}: "${e.subject}"`,
            eventCategory: 'Communication',
          });
        }}
      />

      {/* US-165894 — full-content preview with subject/from/cc/attachments */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="md" fullWidth>
        <DialogTitle>{preview?.subject}</DialogTitle>
        <DialogContent dividers>
          {preview && (
            <Stack spacing={1.5}>
              <Typography variant="caption" color="text.secondary">To</Typography>
              <Typography>{preview.to}{preview.cc && ` · cc ${preview.cc}`}</Typography>
              <Divider />
              <Typography variant="caption" color="text.secondary">Sent on</Typography>
              <Typography>{preview.date}</Typography>
              <Divider />
              <Typography variant="caption" color="text.secondary">Body</Typography>
              <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, whiteSpace: 'pre-wrap' }}>
                {preview.body ?? '(no body)'}
              </Box>
              {preview.attachments?.length ? (
                <>
                  <Divider />
                  <Typography variant="caption" color="text.secondary">Attachments</Typography>
                  <Stack spacing={0.5}>
                    {preview.attachments.map((a, i) => (
                      <Stack key={i} direction="row" spacing={1} alignItems="center">
                        <AttachFileOutlined fontSize="small" />
                        <Typography variant="body2">{a.name} ({a.size})</Typography>
                        <Button size="small" startIcon={<DownloadOutlined />} onClick={() => showToast(`Downloading ${a.name}…`, 'info')}>Download</Button>
                      </Stack>
                    ))}
                  </Stack>
                </>
              ) : null}
            </Stack>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setPreview(null)}>Close</Button></DialogActions>
      </Dialog>
    </>
  );
}
