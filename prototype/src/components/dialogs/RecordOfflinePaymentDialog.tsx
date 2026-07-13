import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Stack, TextField, Typography, Box, Chip,
} from '@mui/material';
import { AttachFileOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { useEffect, useState, ChangeEvent } from 'react';
import { PAYMENT_METHOD_OPTIONS } from '../../constants/enums';

/**
 * US-194825 & US-205926 — Record Offline Payment.
 *
 * Fields: Date & Time (past only), Amount, Payment Method, Reference no, Notes,
 * mandatory single attachment (transaction receipt).
 */

export type OfflinePaymentPayload = {
  paidAt: string;         // ISO
  amount: number;
  method: string;
  reference: string;
  notes: string;
  attachment: { name: string; size: string };
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (p: OfflinePaymentPayload) => void;
  expectedAmount?: number;
  appRef: string;
};

const OFFLINE_METHODS = PAYMENT_METHOD_OPTIONS
  .filter((m) => ['Offline', 'Postal Payment', 'Cost Center & Budget Code'].includes(m.label))
  .map((m) => m.label)
  .concat(['Bank Transfer', 'Cheque', 'Cash', 'POS']);

export function RecordOfflinePaymentDialog({ open, onClose, onSave, expectedAmount, appRef }: Props) {
  const [paidAt, setPaidAt] = useState('');
  const [amount, setAmount] = useState<string>(expectedAmount ? String(expectedAmount) : '');
  const [method, setMethod] = useState('Bank Transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState<{ name: string; size: string } | null>(null);
  const [attachError, setAttachError] = useState('');

  const nowLocalIso = new Date().toISOString().slice(0, 16);

  useEffect(() => {
    if (open) {
      setPaidAt(nowLocalIso);
      setAmount(expectedAmount ? String(expectedAmount) : '');
      setMethod('Bank Transfer');
      setReference('');
      setNotes('');
      setAttachment(null);
      setAttachError('');
    }
  }, [open, expectedAmount, nowLocalIso]);

  const handleAttach = (e: ChangeEvent<HTMLInputElement>) => {
    setAttachError('');
    const f = e.target.files?.[0];
    if (!f) return;
    if (attachment) {
      setAttachError('Only one attachment is allowed. Remove the current one to replace.');
      e.target.value = '';
      return;
    }
    const size = f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`;
    setAttachment({ name: f.name, size });
    e.target.value = '';
  };

  const isFutureDate = paidAt && new Date(paidAt) > new Date();
  const amountNum = Number(amount);
  const canSave =
    !!paidAt && !isFutureDate && !!amount && !isNaN(amountNum) && amountNum > 0
    && !!reference.trim() && !!attachment;

  const handleSave = () => {
    if (!attachment) {
      setAttachError('Required attachments are missing');
      return;
    }
    onSave({
      paidAt: new Date(paidAt).toISOString(),
      amount: amountNum,
      method,
      reference: reference.trim(),
      notes: notes.trim(),
      attachment,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Record Offline Payment — {appRef}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <TextField
            label="Payment Date & Time" type="datetime-local" required fullWidth
            value={paidAt} onChange={(e) => setPaidAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: nowLocalIso }}
            error={!!isFutureDate}
            helperText={isFutureDate ? 'Future dates are not allowed' : 'Past date/time only'}
            data-testid="paid-at"
          />
          <TextField
            label="Amount Paid (£)" type="number" required fullWidth
            value={amount} onChange={(e) => setAmount(e.target.value)}
            inputProps={{ min: 0, step: '0.01' }}
            data-testid="amount"
          />
          <TextField
            select label="Payment Method" required fullWidth
            SelectProps={{ native: true }}
            value={method} onChange={(e) => setMethod(e.target.value)}
          >
            {OFFLINE_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </TextField>
          <TextField
            label="Payment Reference No" required fullWidth
            value={reference} onChange={(e) => setReference(e.target.value)}
            data-testid="reference"
          />
          <TextField
            label="Notes" fullWidth multiline rows={3}
            value={notes} onChange={(e) => setNotes(e.target.value)}
          />

          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
              Transaction Receipt (required) *
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button component="label" size="small" variant="outlined" startIcon={<AttachFileOutlined />}
                data-testid="attach-btn">
                Choose file
                <input hidden type="file" onChange={handleAttach} />
              </Button>
              {attachment && (
                <Chip
                  label={`${attachment.name} (${attachment.size})`}
                  size="small"
                  onDelete={() => setAttachment(null)}
                  deleteIcon={<DeleteOutlineOutlined />}
                />
              )}
            </Stack>
            {attachError && <Alert severity="error" sx={{ mt: 1 }}>{attachError}</Alert>}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={handleSave} data-testid="mark-paid">
          Mark as Paid
        </Button>
      </DialogActions>
    </Dialog>
  );
}
