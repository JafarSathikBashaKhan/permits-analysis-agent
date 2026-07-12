import { Button, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { EditOutlined, EmailOutlined, GavelOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { tokens } from '../../../theme';
import { Application } from '../../../data/mock';
import { useToast } from '../../../components/Toast';
import { FpnLookupDialog, FpnRecord } from '../../../components/dialogs/FpnLookupDialog';
import { EmailWorkflowDialog, EmailWorkflowResult } from '../../../components/dialogs/EmailWorkflowDialog';
import { isFpnLookupEnabled } from '../helpers/settings';
import { pushAudit } from '../helpers/auditLog';
import { usePersistentState } from '../../../hooks/usePersistentState';

/**
 * US-164966 (Applicant tab), US-186077 (FPN lookup), US-175711 (Request Customer Info).
 */
export function ApplicantTab({ app }: { app: Application }) {
  const showToast = useToast();
  const [fpnOpen, setFpnOpen] = useState(false);
  const [rciOpen, setRciOpen] = useState(false);
  const [, setEmails] = usePersistentState<any[]>(`prototype:applications:emails:${app.id}`, []);

  const email = app.applicant.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.co.uk';
  const showFpn = isFpnLookupEnabled();

  // Mock FPN records — TODO(real-backend): US-186077
  const fpnRecords: FpnRecord[] = [
    { caseNumber: 'FPN-2025-00918', contraventionAt: '2025-11-14 09:22', balance: 60.00, status: 'Active' },
    { caseNumber: 'FPN-2025-01102', contraventionAt: '2025-12-02 15:41', balance: 120.00, status: 'Paid' },
  ];

  const handleRciSend = (result: EmailWorkflowResult) => {
    setEmails((prev) => [
      { id: result.emailId, date: new Date().toLocaleString('en-GB'), to: result.to, subject: result.subject, body: result.body, attachments: result.attachments, direction: 'sent', status: 'Sent' },
      ...prev,
    ]);
    pushAudit(app.id, {
      actor: 'You', actorRole: 'BO User',
      eventName: 'Request Customer Information',
      eventDescription: `Requested additional customer information via email. Notes: ${result.reason || result.subject}`,
      eventCategory: 'Application Processing',
    });
    // Move status
    try {
      const raw = localStorage.getItem('prototype:applications:rows');
      if (raw) {
        const rows = JSON.parse(raw);
        const updated = rows.map((r: Application) => r.id === app.id ? { ...r, status: 'Waiting for Customer Info' } : r);
        localStorage.setItem('prototype:applications:rows', JSON.stringify(updated));
      }
    } catch { /* ignore */ }
    showToast('Customer information request sent', 'success');
    setRciOpen(false);
  };

  return (
    <>
      <Paper sx={{ p: 2.5, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.1rem', color: tokens.INK }}>Applicant details</Typography>
          <Stack direction="row" spacing={1}>
            {showFpn && (
              <Button size="small" variant="outlined" startIcon={<GavelOutlined />} onClick={() => setFpnOpen(true)} data-testid="fpn-lookup">
                Show active FPN
              </Button>
            )}
            <Button size="small" variant="outlined" startIcon={<EmailOutlined />} onClick={() => setRciOpen(true)} data-testid="request-customer-info">
              Request Customer Information
            </Button>
            <Button size="small" variant="outlined" startIcon={<EditOutlined />} onClick={() => showToast('Applicant details updated', 'success')}>Edit</Button>
          </Stack>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Fact label="Full name" value={app.applicant} />
          <Fact label="Title" value="Mr" />
          <Fact label="Date of birth" value="1985-04-12" />
          <Fact label="Email" value={email} />
          <Fact label="Phone" value="+44 7700 900 123" />
          <Fact label="Correspondence address" value="Flat 12, Riverside Walk, CC1 3AA" />
          <Fact label="Applicant type" value="Resident" />
          <Fact label="Blue Badge" value="—" />
          <Fact label="Experian pass" value="Passed" />
        </Grid>
      </Paper>

      <FpnLookupDialog
        open={fpnOpen} onClose={() => setFpnOpen(false)}
        applicantName={app.applicant}
        postcode="CC1 3AA" property="Flat 12"
        records={fpnRecords}
      />

      <EmailWorkflowDialog
        open={rciOpen} onClose={() => setRciOpen(false)}
        onSend={handleRciSend}
        templateKey="RequestCustomerInfo"
        title="Request Customer Information"
        sendLabel="Send Request Customer Information Email"
        appRef={app.ref}
        defaultTo={email}
        extraMerges={{ ApplicantName: app.applicant }}
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
