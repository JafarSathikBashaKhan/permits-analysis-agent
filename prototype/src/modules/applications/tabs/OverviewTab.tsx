import { Box, Button, Chip, Divider, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { tokens } from '../../../theme';
import { Application } from '../../../data/mock';
import { computeStartEnd, readStartEnd, setStartEnd } from '../helpers/startDate';
import { pushAudit } from '../helpers/auditLog';
import { useToast } from '../../../components/Toast';

/**
 * US-160535 — Application View → Overview tab.
 *
 * Includes:
 * - Permit + location + payment details
 * - BO-editable Start/End dates (audit-logged) — US-160535 + US-200211
 * - Additional details (Work Queue Type, Experian Auth Index)
 */
export function OverviewTab({ app }: { app: Application }) {
  const showToast = useToast();
  const dyn = readStartEnd(app.id) ?? computeStartEnd(app.id, app.submitted, app.status === 'Active' ? app.submitted : undefined);

  const [editing, setEditing] = useState(false);
  const [startDate, setStart] = useState(dyn.startDate);
  const [endDate, setEnd] = useState(dyn.endDate);
  const [savedStart, setSavedStart] = useState(dyn.startDate);
  const [savedEnd, setSavedEnd] = useState(dyn.endDate);

  const handleSaveDates = () => {
    // Audit each change independently per US-160535
    if (startDate !== savedStart) {
      pushAudit(app.id, {
        actor: 'You', actorRole: 'BO User',
        eventName: 'Permit Start Date Updated',
        eventDescription: `Start date changed from ${savedStart} to ${startDate}.`,
        eventCategory: 'Permit Management',
        from: savedStart, to: startDate,
      });
    }
    if (endDate !== savedEnd) {
      pushAudit(app.id, {
        actor: 'You', actorRole: 'BO User',
        eventName: 'Permit End Date Updated',
        eventDescription: `End date changed from ${savedEnd} to ${endDate}.`,
        eventCategory: 'Permit Management',
        from: savedEnd, to: endDate,
      });
    }
    setStartEnd(app.id, startDate, endDate, dyn.time);
    setSavedStart(startDate); setSavedEnd(endDate);
    setEditing(false);
    showToast('Start / End dates updated', 'success');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <PanelPaper title="Application overview" actions={
          !editing
            ? <Button size="small" startIcon={<EditOutlined />} onClick={() => setEditing(true)} data-testid="edit-dates">Edit dates</Button>
            : <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => { setEditing(false); setStart(savedStart); setEnd(savedEnd); }}>Cancel</Button>
                <Button size="small" variant="contained" onClick={handleSaveDates} data-testid="save-dates">Save</Button>
              </Stack>
        }>
          <Grid container spacing={2}>
            <Fact label="Reference" value={app.ref} />
            <Fact label="Permission" value={app.permission} />
            <Fact label="Permit Type" value={app.type} />
            <Fact label="Application Status" value={<Chip size="small" label={app.status} />} />
            <Fact label="Application Date" value={app.submitted} />
            <Fact label="Permit Duration" value="12 months" />
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" sx={{ color: tokens.MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Start Date <em>({dyn.policyLabel})</em>
              </Typography>
              {editing ? (
                <TextField size="small" type="date" fullWidth value={startDate}
                  onChange={(e) => setStart(e.target.value)} sx={{ mt: 0.5 }} inputProps={{ 'data-testid': 'start-date-input' }} />
              ) : (
                <Typography sx={{ mt: 0.25 }} data-testid="start-date">
                  {savedStart}{dyn.time ? ` ${dyn.time}` : ''}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" sx={{ color: tokens.MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>End Date</Typography>
              {editing ? (
                <TextField size="small" type="date" fullWidth value={endDate}
                  onChange={(e) => setEnd(e.target.value)} sx={{ mt: 0.5 }} inputProps={{ 'data-testid': 'end-date-input' }} />
              ) : (
                <Typography sx={{ mt: 0.25 }} data-testid="end-date">{savedEnd}</Typography>
              )}
            </Grid>
            <Fact label="Payment method" value="Card · **** 4242" />
            <Fact label="Paid on" value={app.submitted} />
            <Fact label="Price" value={`£${app.amount.toFixed(2)}`} />
            <Fact label="Channel" value="Customer Portal" />
            <Fact label="Work Queue Type" value={app.status} />
            <Fact label="Experian Authentication Index" value="Passed (score 92)" />
          </Grid>
        </PanelPaper>
        <PanelPaper title="Address">
          <Grid container spacing={2}>
            <Fact label="USRN" value="27401234" />
            <Fact label="UPRN" value="100091234567" />
            <Fact label="Street" value="Riverside Walk" />
            <Fact label="Property" value="Flat 12" />
            <Fact label="Postcode" value="CC1 3AA" />
            <Fact label="Zone" value={app.zone} />
          </Grid>
        </PanelPaper>
      </Grid>
      <Grid item xs={12} md={4}>
        <PanelPaper title="Timeline">
          <Stack spacing={1.5}>
            {['Submitted', 'Under Review', 'Approved', 'Payment', 'Active'].map((step, i) => (
              <Box key={step} sx={{ pl: 1.5, borderLeft: `3px solid ${i === 0 ? tokens.NAVY : tokens.LINE}` }}>
                <Typography variant="body2" fontWeight={600}>{step}</Typography>
                <Typography variant="caption" color="text.secondary">{i === 0 ? app.submitted : '—'}</Typography>
              </Box>
            ))}
          </Stack>
        </PanelPaper>
      </Grid>
    </Grid>
  );
}

function PanelPaper({ title, actions, children }: { title: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Paper sx={{ p: 2.5, mb: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.1rem', color: tokens.INK }}>{title}</Typography>
        {actions}
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Paper>
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
