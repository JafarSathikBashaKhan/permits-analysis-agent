import { Button, Grid, Paper, Stack, Typography, Alert, Divider } from '@mui/material';
import { useState } from 'react';
import { tokens } from '../../../theme';
import { Application, ApplicationStatus } from '../../../data/mock';
import { useToast } from '../../../components/Toast';
import { RenewalConfirmDialog } from '../../../components/dialogs/RenewalConfirmDialog';
import { EmailWorkflowDialog, EmailWorkflowResult } from '../../../components/dialogs/EmailWorkflowDialog';
import { pushAudit } from '../helpers/auditLog';
import { PAYMENT_METHOD_LABELS } from '../../../constants/enums';
import { readStartEnd, computeStartEnd } from '../helpers/startDate';
import { getRenewalGraceDays, getRenewalWindowDaysBefore } from '../helpers/settings';

/**
 * US-169022 (Renew before expiry), US-177255 (Grace period), US-193350 (BO renewal).
 * Shows current vs new dates and lets BO trigger renewal.
 */
type Props = {
  app: Application;
  onStatusChange: (s: ApplicationStatus, msg?: string) => void;
};

export function RenewalSummaryTab({ app, onStatusChange }: Props) {
  const showToast = useToast();
  const [renewOpen, setRenewOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('Card · **** 4242');

  const dyn = readStartEnd(app.id) ?? computeStartEnd(app.id, app.submitted);
  const newStart = dyn.endDate;
  const newEnd = (() => {
    const d = new Date(newStart + 'T00:00:00Z');
    d.setUTCFullYear(d.getUTCFullYear() + 1);
    return d.toISOString().slice(0, 10);
  })();

  const applicantEmail = app.applicant.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.co.uk';

  const inGrace = app.status === 'Expired';
  const beforeExpiry = app.status === 'Active';
  const graceDays = getRenewalGraceDays();
  const windowDays = getRenewalWindowDaysBefore();

  return (
    <>
      <Paper sx={{ p: 2.5, mb: 2 }}>
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.1rem', color: tokens.INK, mb: 2 }}>Renewal summary</Typography>
        <Divider sx={{ mb: 2 }} />

        {beforeExpiry && (
          <Alert severity="info" sx={{ mb: 2 }}>Renewal window: from {windowDays} days before expiry.</Alert>
        )}
        {inGrace && (
          <Alert severity="warning" sx={{ mb: 2 }}>Permit is within grace period ({graceDays} days). Reactivate or renew to keep it live.</Alert>
        )}

        <Grid container spacing={2}>
          <Fact label="Current permit" value={app.ref} />
          <Fact label="Current end date" value={dyn.endDate} />
          <Fact label="Proposed new start" value={newStart} />
          <Fact label="Proposed new end" value={newEnd} />
          <Fact label="Renewal price" value={`£${app.amount.toFixed(2)}`} />
          <Fact label="Documents" value="Skip if valid (US-195183)" />
        </Grid>

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="outlined" color="error" onClick={() => {
            onStatusChange('Active', 'Renewal cancelled');
            pushAudit(app.id, {
              actor: 'You', actorRole: 'BO User',
              eventName: 'Renewal Cancelled',
              eventDescription: 'BO user cancelled the renewal; permit reverted to Active.',
              eventCategory: 'Permit Management',
            });
          }} data-testid="cancel-renewal">Cancel Renewal</Button>
          <Button variant="contained" onClick={() => setRenewOpen(true)} data-testid="confirm-renewal">Trigger Renewal Payment</Button>
        </Stack>
      </Paper>

      <RenewalConfirmDialog
        open={renewOpen} onClose={() => setRenewOpen(false)}
        defaultCardLast4="4242"
        paymentMethods={Object.values(PAYMENT_METHOD_LABELS).slice(0, 8)}
        onProceed={(method) => {
          setSelectedMethod(method);
          setEmailOpen(true);
        }}
      />

      <EmailWorkflowDialog
        open={emailOpen} onClose={() => setEmailOpen(false)}
        templateKey="Renewal"
        title="Send Renewal Confirmation"
        sendLabel="Send Renewal Email"
        appRef={app.ref}
        defaultTo={applicantEmail}
        extraMerges={{ ApplicantName: app.applicant, StartDate: newStart, EndDate: newEnd, Amount: app.amount.toFixed(2) }}
        onSend={(result: EmailWorkflowResult) => {
          onStatusChange('Pending Renew', `Renewal initiated (payment via ${selectedMethod})`);
          pushAudit(app.id, {
            actor: 'You', actorRole: 'BO User',
            eventName: 'Renewal Initiated by BO',
            eventDescription: `BO user initiated renewal via ${selectedMethod}. Email ${result.emailId} sent.`,
            eventCategory: 'Permit Management',
          });
          showToast('Renewal initiated', 'success');
          setEmailOpen(false);
        }}
      />
    </>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="caption" sx={{ color: tokens.MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ mt: 0.25 }}>{value}</Typography>
    </Grid>
  );
}
