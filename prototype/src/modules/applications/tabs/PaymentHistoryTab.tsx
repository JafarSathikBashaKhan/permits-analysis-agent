import {
  Button, Chip, Divider, IconButton, Paper, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@mui/material';
import { DownloadOutlined, AddOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { tokens } from '../../../theme';
import { usePersistentState } from '../../../hooks/usePersistentState';
import { useToast } from '../../../components/Toast';
import { RecordOfflinePaymentDialog } from '../../../components/dialogs/RecordOfflinePaymentDialog';
import { Application } from '../../../data/mock';
import { pushAudit } from '../helpers/auditLog';
import { isOfflinePaymentEnabled } from '../helpers/settings';

/**
 * US-164971 (Payment History tab), US-194825 / US-205926 (Record offline payment).
 * Payment record columns include: Payment Method, Amount, Transaction Id (offline only),
 * Date & Time, Status, Receipt (offline only), Actions.
 */
export type PaymentRow = {
  id: string;
  method: string;
  amount: number;
  transactionId?: string;
  paidAt?: string;
  status: 'Paid' | 'Pending' | 'Failed';
  receipt?: { name: string; size: string };
  notes?: string;
};

type Props = {
  app: Application;
  /** Called when an offline payment is recorded — parent may transition status → Active. */
  onOfflinePaid?: () => void;
};

export function PaymentHistoryTab({ app, onOfflinePaid }: Props) {
  const showToast = useToast();
  const offlineEnabled = isOfflinePaymentEnabled();
  const [recordOpen, setRecordOpen] = useState(false);

  const [payments, setPayments] = usePersistentState<PaymentRow[]>(
    `prototype:applications:payments:${app.id}`,
    () => [{
      id: 'p1',
      method: 'Card',
      amount: app.amount,
      transactionId: 'ch_1Nq8p2',
      paidAt: app.submitted,
      status: 'Paid',
    }]
  );

  // "Record" button visible only for Approved OR Waiting for Payment + Offline method
  // TODO(real-backend): US-194825 — read applied payment method from application record
  const showRecordButton = offlineEnabled &&
    (app.status === 'Approved' || app.status === 'Awaiting Payment' || app.status === 'Waiting for Payment' as any || app.status === 'Change Zone' || app.status === 'Change Address');

  // Sort newest → oldest (US-164971 chronological order)
  const sorted = [...payments].sort((a, b) => (b.paidAt ?? '').localeCompare(a.paidAt ?? ''));

  const handleRecord = (p: { paidAt: string; amount: number; method: string; reference: string; notes: string; attachment: { name: string; size: string } }) => {
    const row: PaymentRow = {
      id: `p${Date.now()}`,
      method: p.method,
      amount: p.amount,
      transactionId: p.reference,
      paidAt: p.paidAt.slice(0, 10),
      status: 'Paid',
      receipt: p.attachment,
      notes: p.notes,
    };
    setPayments((prev) => [row, ...prev]);
    // Also append note to notes section (US-194825)
    if (p.notes) {
      try {
        const key = `prototype:applications:notes:${app.id}`;
        const existing = JSON.parse(localStorage.getItem(key) ?? '[]');
        const newNote = {
          id: Date.now(), author: 'You', authorRole: 'BO User',
          when: new Date().toLocaleDateString('en-GB'),
          createdAt: new Date().toISOString(),
          text: `[Record Payment ${row.transactionId}] ${p.notes}`,
          visibleToApplicant: false,
        };
        localStorage.setItem(key, JSON.stringify([newNote, ...existing]));
      } catch { /* ignore */ }
    }
    pushAudit(app.id, {
      actor: 'You', actorRole: 'BO User',
      eventName: 'Record Offline Payment',
      eventDescription: `Offline payment of £${p.amount.toFixed(2)} recorded via ${p.method} (ref: ${p.reference}).`,
      eventCategory: 'Payment / Offline',
    });
    showToast('Offline payment recorded', 'success');
    onOfflinePaid?.();
  };

  return (
    <>
      <Paper sx={{ p: 2.5, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.1rem', color: tokens.INK }}>Payment history</Typography>
          {showRecordButton && (
            <Button size="small" variant="contained" startIcon={<AddOutlined />}
              onClick={() => setRecordOpen(true)} data-testid="record-payment">
              Record Payment
            </Button>
          )}
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Payment Method</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Transaction Id</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Receipt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.method}</TableCell>
                <TableCell>£{r.amount.toFixed(2)}</TableCell>
                <TableCell><Typography fontFamily="monospace">{r.transactionId ?? '—'}</Typography></TableCell>
                <TableCell>{r.paidAt ?? '—'}</TableCell>
                <TableCell>
                  <Chip size="small" label={r.status}
                    color={r.status === 'Paid' ? 'success' : r.status === 'Failed' ? 'error' : 'warning'} />
                </TableCell>
                <TableCell>
                  {r.receipt ? (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="caption">{r.receipt.name}</Typography>
                      <IconButton size="small" onClick={() => showToast(`Downloading ${r.receipt!.name}…`, 'info')}>
                        <DownloadOutlined fontSize="small" />
                      </IconButton>
                    </Stack>
                  ) : '—'}
                </TableCell>
              </TableRow>
            ))}
            {sorted.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: tokens.MUTED }}>No payments</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>

      <RecordOfflinePaymentDialog
        open={recordOpen} onClose={() => setRecordOpen(false)}
        onSave={handleRecord}
        expectedAmount={app.amount}
        appRef={app.ref}
      />
    </>
  );
}
