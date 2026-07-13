import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Stack, TextField, Typography, Box,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FIELD_LIMITS } from '../../constants/enums';
import { usePersistentState } from '../../hooks/usePersistentState';

export type EmailPayload = {
  id: string;
  to: string;
  template: string;
  subject: string;
  body: string;
  sentAt: string;
};

export type EmailDraft = {
  to: string;
  template: string;
  subject: string;
  body: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (email: EmailPayload) => void;
  defaultTo?: string;
  isBroadcast?: boolean;
};

const TEMPLATES = ['Approval', 'Rejection', 'Reminder', 'Renewal', 'Custom'];

const MERGE_FIELDS = [
  '{{ApplicantName}}', '{{PermitReference}}', '{{ExpiryDate}}', '{{StartDate}}',
  '{{Zone}}', '{{Amount}}', '{{VehicleReg}}', '{{RejectionReason}}', '{{EndDate}}',
];

export function ComposeEmailDialog({ open, onClose, onSave, defaultTo = '', isBroadcast = false }: Props) {
  const [to, setTo] = useState(defaultTo);
  const [template, setTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [mergeAnchor, setMergeAnchor] = useState<HTMLElement | null>(null);

  const [draft, setDraft] = usePersistentState<EmailDraft | null>('prototype:email:drafts', null);

  useEffect(() => {
    if (open) {
      setTo(defaultTo);
      // Load draft if exists
      if (draft) {
        setTo(draft.to || defaultTo);
        setTemplate(draft.template);
        setSubject(draft.subject);
        setBody(draft.body);
      }
    }
  }, [open, defaultTo, draft]);

  const reset = () => { setTo(defaultTo); setTemplate(''); setSubject(''); setBody(''); };

  const canSave = (isBroadcast || to) && template && subject && body;

  const handleSave = () => {
    onSave({
      id: `EMAIL-${Date.now()}`,
      to: isBroadcast ? 'All applicants' : to,
      template, subject, body,
      sentAt: new Date().toISOString(),
    });
    reset();
    setDraft(null); // Clear draft on send
    onClose();
  };

  const handleSaveAndClose = () => {
    setDraft({ to, template, subject, body });
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  const handleClearDraft = () => {
    setDraft(null);
    reset();
  };

  const insertMergeField = (field: string) => {
    setBody(body + field);
    setMergeAnchor(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Compose Email</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {isBroadcast ? (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              To: <strong>All applicants</strong>
            </Typography>
          ) : (
            <TextField
              label="To" required fullWidth
              value={to} onChange={(e) => setTo(e.target.value)}
              type="email"
              inputProps={{ maxLength: FIELD_LIMITS.EMAIL }}
            />
          )}
          <TextField
            select label="Template" required fullWidth
            value={template} onChange={(e) => setTemplate(e.target.value)}
          >
            {TEMPLATES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField
            label="Subject" required fullWidth
            value={subject} onChange={(e) => setSubject(e.target.value)}
          />
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight={500}>Body *</Typography>
              <Button size="small" onClick={(e) => setMergeAnchor(e.currentTarget)}>
                Insert Merge Field
              </Button>
            </Stack>
            <TextField
              required fullWidth multiline rows={8}
              value={body} onChange={(e) => setBody(e.target.value)}
            />
          </Box>
          {draft && (
            <Stack direction="row" justifyContent="space-between" alignItems="center"
              sx={{ px: 2, py: 1, bgcolor: 'info.lighter', borderRadius: 1, border: 1, borderColor: 'info.light' }}>
              <Typography variant="caption" color="info.dark">Draft loaded</Typography>
              <Button size="small" onClick={handleClearDraft}>Clear Draft</Button>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSaveAndClose}>Save and Close</Button>
        <Button variant="contained" disabled={!canSave} onClick={handleSave}>Send</Button>
      </DialogActions>

      {/* Merge Fields Dialog */}
      <Dialog open={!!mergeAnchor} onClose={() => setMergeAnchor(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Insert Merge Field</DialogTitle>
        <DialogContent>
          <Stack spacing={0.5}>
            {MERGE_FIELDS.map((field) => (
              <Button key={field} fullWidth sx={{ justifyContent: 'flex-start' }}
                onClick={() => insertMergeField(field)}>
                {field}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMergeAnchor(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
