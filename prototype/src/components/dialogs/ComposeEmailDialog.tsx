import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

export type EmailPayload = {
  id: string;
  to: string;
  template: string;
  subject: string;
  body: string;
  sentAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (email: EmailPayload) => void;
  defaultTo?: string;
  isBroadcast?: boolean;
};

const TEMPLATES = ['Approval', 'Rejection', 'Reminder', 'Renewal', 'Custom'];

export function ComposeEmailDialog({ open, onClose, onSave, defaultTo = '', isBroadcast = false }: Props) {
  const [to, setTo] = useState(defaultTo);
  const [template, setTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => { if (open) setTo(defaultTo); }, [open, defaultTo]);

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
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
          <TextField
            label="Body" required fullWidth multiline rows={8}
            value={body} onChange={(e) => setBody(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={handleSave}>Send</Button>
      </DialogActions>
    </Dialog>
  );
}
