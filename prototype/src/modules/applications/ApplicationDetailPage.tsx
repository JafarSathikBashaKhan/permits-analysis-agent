import {
  Box, Button, Chip, Divider, Grid, IconButton, Menu, MenuItem, Paper, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, Typography,
} from '@mui/material';
import {
  ArrowBack, CheckCircleOutline, CancelOutlined, PauseCircleOutline, MoreVertOutlined, EmailOutlined,
  DescriptionOutlined, ReceiptLongOutlined, HistoryOutlined, StickyNote2Outlined, DirectionsCarOutlined,
  PersonOutlineOutlined, HomeWorkOutlined, AssignmentIndOutlined, EventRepeatOutlined, LocalActivityOutlined,
  PreviewOutlined, UploadFileOutlined, DownloadOutlined, AddOutlined, EditOutlined, DeleteOutlineOutlined,
} from '@mui/icons-material';
import { useMemo, useState, MouseEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatusChip } from '../../shared/StatusChip';
import { applications } from '../../data/mock';
import { tokens } from '../../theme';
import { useToast } from '../../components/Toast';
import { AddVehicleDialog } from '../../components/dialogs/AddVehicleDialog';
import { UploadDocumentDialog } from '../../components/dialogs/UploadDocumentDialog';
import { ComposeEmailDialog } from '../../components/dialogs/ComposeEmailDialog';
import { usePersistentState } from '../../hooks/usePersistentState';
import { FIELD_LIMITS, BUSINESS_RULES } from '../../constants/enums';

type TabKey =
  | 'overview' | 'applicant' | 'vehicle' | 'document' | 'email'
  | 'payment' | 'audit' | 'notes' | 'address' | 'ceo'
  | 'renewal-summary' | 'renewal-docs' | 'voucher' | 'preview';

type TabDef = { key: TabKey; label: string; icon: React.ReactNode };

const ALL_TABS: TabDef[] = [
  { key: 'overview',        label: 'Overview',           icon: <DescriptionOutlined fontSize="small" /> },
  { key: 'applicant',       label: 'Applicant',          icon: <PersonOutlineOutlined fontSize="small" /> },
  { key: 'vehicle',         label: 'Vehicle',            icon: <DirectionsCarOutlined fontSize="small" /> },
  { key: 'document',        label: 'Documents',          icon: <DescriptionOutlined fontSize="small" /> },
  { key: 'email',           label: 'Emails',             icon: <EmailOutlined fontSize="small" /> },
  { key: 'payment',         label: 'Payment History',    icon: <ReceiptLongOutlined fontSize="small" /> },
  { key: 'audit',           label: 'Audit Log',          icon: <HistoryOutlined fontSize="small" /> },
  { key: 'notes',           label: 'Notes',              icon: <StickyNote2Outlined fontSize="small" /> },
  { key: 'address',         label: 'Address Assign',     icon: <HomeWorkOutlined fontSize="small" /> },
  { key: 'ceo',             label: 'CEO Task',           icon: <AssignmentIndOutlined fontSize="small" /> },
  { key: 'renewal-summary', label: 'Renewal Summary',    icon: <EventRepeatOutlined fontSize="small" /> },
  { key: 'renewal-docs',    label: 'Renewal Documents',  icon: <DescriptionOutlined fontSize="small" /> },
  { key: 'voucher',         label: 'Voucher / Permit',   icon: <LocalActivityOutlined fontSize="small" /> },
  { key: 'preview',         label: 'Preview',            icon: <PreviewOutlined fontSize="small" /> },
];

/** Status → header action buttons (mirrors real Applications module). */
function headerActionsFor(status: string, isSuspension: boolean): { label: string; variant?: 'contained'|'outlined'|'text'; color?: 'primary'|'error'|'warning'|'success' }[] {
  switch (status) {
    case 'In Progress':      return [{ label: 'Approve', variant: 'contained', color: 'success' }, { label: 'Reject', variant: 'outlined', color: 'error' }];
    case 'Under Review':     return [{ label: 'Approve', variant: 'contained', color: 'success' }, { label: 'Reject', variant: 'outlined', color: 'error' }];
    case 'Pending Approval': return [{ label: 'Begin Review', variant: 'contained' }];
    case 'Active':           return isSuspension
      ? [{ label: 'Cancel Suspension', variant: 'outlined', color: 'error' }]
      : [{ label: 'Cancel Application', variant: 'outlined', color: 'error' }, { label: 'Suspend Application', variant: 'outlined', color: 'warning' }];
    case 'On Hold':          return [{ label: 'Extend Postpone', variant: 'outlined' }, { label: 'Resume', variant: 'contained' }];
    case 'Rejected':         return [{ label: 'Reinstate', variant: 'outlined' }];
    case 'Cancelled':        return [{ label: 'Reinstate', variant: 'outlined' }];
    case 'Expired':          return [{ label: 'Reactivate', variant: 'contained' }, { label: 'Renew', variant: 'outlined' }];
    case 'Suspended':        return [{ label: 'Activate', variant: 'contained' }];
    case 'Awaiting Payment': return [{ label: 'Reject', variant: 'outlined', color: 'error' }];
    case 'NFI':              return [{ label: 'Reject', variant: 'outlined', color: 'error' }, { label: 'Begin Review', variant: 'contained' }];
    default:                 return [];
  }
}

export function ApplicationDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const showToast = useToast();
  const app = applications.find((a) => a.id === id) ?? applications[0];
  const [tab, setTab] = useState<TabKey>('overview');
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);

  const isSuspension = app.type === 'Suspension';
  const isDispensation = app.type === 'Dispensation';
  const isVisitor = /visitor/i.test(app.permission);

  // On-Hold extension counter — persisted per application
  const [holdExtensions, setHoldExtensions] = usePersistentState<number>(
    `prototype:applications:hold-extensions:${app.id}`, 0
  );

  // Filter tabs by application type / category (mirrors real conditional rendering)
  const visibleTabs = useMemo(() => ALL_TABS.filter((t) => {
    if (t.key === 'ceo' && !isSuspension) return false;
    if (t.key === 'voucher' && !isVisitor) return false;
    if (t.key === 'address' && !(isSuspension || app.status === 'Active')) return false;
    if (t.key === 'renewal-summary' && app.status !== 'Expired') return false;
    if (t.key === 'renewal-docs' && app.status !== 'Expired') return false;
    if (isDispensation && t.key === 'ceo') return false;
    return true;
  }), [isSuspension, isVisitor, isDispensation, app.status]);

  const actions = headerActionsFor(app.status, isSuspension);

  const handleActionClick = (label: string) => {
    if (label === 'Extend Postpone') {
      if (holdExtensions >= BUSINESS_RULES.ON_HOLD_MAX_EXTENSIONS) {
        showToast('Maximum hold extensions reached', 'error');
        return;
      }
      const next = holdExtensions + 1;
      setHoldExtensions(next);
      showToast(`Hold duration extended (${next} of ${BUSINESS_RULES.ON_HOLD_MAX_EXTENSIONS})`, 'success');
    } else {
      showToast(`${label} — action recorded`, 'success');
    }
  };

  return (
    <>
      <Button startIcon={<ArrowBack />} onClick={() => nav('/applications')} sx={{ mb: 1 }}>All applications</Button>

      {/* Header */}
      <Paper sx={{ p: 2.5, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-start' }} spacing={2}>
          <Box>
            <Typography variant="caption" sx={{ color: tokens.MUTED, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              Application · {app.ref}
            </Typography>
            <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.5rem', color: tokens.INK, mt: 0.5 }}>
              {app.applicant}
            </Typography>
            <Typography sx={{ color: tokens.MUTED, mt: 0.25 }}>{app.permission}</Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <StatusChip status={app.status} />
            {app.status === 'On Hold' && (
              <Typography variant="caption" sx={{ color: tokens.MUTED }}>
                Extended {holdExtensions} of {BUSINESS_RULES.ON_HOLD_MAX_EXTENSIONS} times
              </Typography>
            )}
            {actions.map((a) => (
              <Button
                key={a.label}
                variant={a.variant ?? 'outlined'}
                color={a.color as any}
                disabled={a.label === 'Extend Postpone' && holdExtensions >= BUSINESS_RULES.ON_HOLD_MAX_EXTENSIONS}
                onClick={() => handleActionClick(a.label)}
              >
                {a.label}
              </Button>
            ))}
            <IconButton onClick={(e: MouseEvent<HTMLElement>) => setMoreAnchor(e.currentTarget)}><MoreVertOutlined /></IconButton>
            <Menu anchorEl={moreAnchor} open={!!moreAnchor} onClose={() => setMoreAnchor(null)}>
              <MenuItem onClick={() => setMoreAnchor(null)}>Request Evidence</MenuItem>
              <MenuItem onClick={() => setMoreAnchor(null)}>Internal Referral</MenuItem>
              <MenuItem onClick={() => setMoreAnchor(null)}>On-Hold</MenuItem>
              <MenuItem onClick={() => setMoreAnchor(null)}>Request Customer Information</MenuItem>
              <MenuItem onClick={() => setMoreAnchor(null)}>Change Zone</MenuItem>
              <MenuItem onClick={() => setMoreAnchor(null)}>Change Address</MenuItem>
              <MenuItem onClick={() => setMoreAnchor(null)}>Renew</MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Fact label="Type" value={app.type} />
          <Fact label="Zone" value={app.zone} />
          <Fact label="Submitted" value={app.submitted} />
          <Fact label="Amount" value={`£${app.amount.toFixed(2)}`} />
          <Fact label="Assigned to" value={app.assignedTo} />
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          {visibleTabs.map((t) => <Tab key={t.key} value={t.key} label={t.label} sx={{ minHeight: 56, textTransform: 'none', fontWeight: 600 }} />)}
        </Tabs>
      </Paper>

      {/* Tab panels */}
      {tab === 'overview' && <OverviewPanel app={app} />}
      {tab === 'applicant' && <ApplicantPanel app={app} />}
      {tab === 'vehicle' && <VehiclePanel />}
      {tab === 'document' && <DocumentPanel />}
      {tab === 'email' && <EmailPanel />}
      {tab === 'payment' && <PaymentPanel amount={app.amount} />}
      {tab === 'audit' && <AuditPanel app={app} />}
      {tab === 'notes' && <NotesPanel />}
      {tab === 'address' && <AddressAssignPanel />}
      {tab === 'ceo' && <CEOTaskPanel />}
      {tab === 'renewal-summary' && <RenewalSummaryPanel app={app} />}
      {tab === 'renewal-docs' && <RenewalDocsPanel />}
      {tab === 'voucher' && <VoucherPanel />}
      {tab === 'preview' && <PreviewPanel app={app} />}
    </>
  );
}

/* ---------- Panels ---------- */

function OverviewPanel({ app }: { app: any }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <PanelPaper title="Application overview">
          <Grid container spacing={2}>
            <Fact label="Reference" value={app.ref} />
            <Fact label="Permission" value={app.permission} />
            <Fact label="Category" value="Resident" />
            <Fact label="Start date" value="2026-07-01" />
            <Fact label="End date" value="2027-06-30" />
            <Fact label="Duration" value="12 months" />
            <Fact label="Payment status" value="Paid" />
            <Fact label="Payment method" value="Card · **** 4242" />
            <Fact label="Channel" value="Customer Portal" />
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
            {['Submitted','Under Review','Approved','Payment','Active'].map((step, i) => (
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

function ApplicantPanel({ app }: { app: any }) {
  const showToast = useToast();
  const email = app.applicant.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.co.uk';
  return (
    <PanelPaper title="Applicant details" actions={<Button size="small" variant="outlined" startIcon={<EditOutlined />} onClick={() => showToast('Edit form coming soon', 'info')}>Edit</Button>}>
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
    </PanelPaper>
  );
}

function VehiclePanel() {
  const showToast = useToast();
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [vehicles, setVehicles] = useState([
    { vrm: 'AB19 XYZ', make: 'Ford', model: 'Focus', colour: 'Silver', fuel: 'Petrol', co2: 118, source: 'AutoGuru' },
    { vrm: 'BC22 CDE', make: 'Tesla', model: 'Model 3', colour: 'White', fuel: 'Electric', co2: 0, source: 'AutoGuru' },
  ]);
  return (
    <>
      <PanelPaper title="Vehicles" actions={<Button size="small" variant="contained" startIcon={<AddOutlined />} onClick={() => setAddVehicleOpen(true)}>Add Vehicle</Button>}>
        <SimpleTable
          columns={['VRM','Make','Model','Colour','Fuel','CO₂','Source','Actions']}
          rows={vehicles.map((r) => [r.vrm, r.make, r.model, r.colour, r.fuel, `${r.co2} g/km`, r.source,
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small"><EditOutlined fontSize="small" /></IconButton>
              <IconButton size="small"><DeleteOutlineOutlined fontSize="small" /></IconButton>
            </Stack>])}
        />
      </PanelPaper>
      <AddVehicleDialog
        open={addVehicleOpen}
        onClose={() => setAddVehicleOpen(false)}
        onSave={(v) => {
          setVehicles((prev) => [...prev, { vrm: v.vrm, make: v.make, model: v.model, colour: v.colour, fuel: v.fuelType, co2: 0, source: 'Manual' }]);
          showToast('Vehicle added', 'success');
        }}
      />
    </>
  );
}

function DocumentPanel() {
  const showToast = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [docs, setDocs] = useState([
    { name: 'Proof of Address.pdf', type: 'Proof of Address', uploaded: '2026-06-24', size: '212 KB', status: 'Approved' },
    { name: 'V5C.pdf',              type: 'Vehicle V5C',      uploaded: '2026-06-24', size: '384 KB', status: 'Pending' },
  ]);
  return (
    <>
      <PanelPaper title="Documents" actions={<Button size="small" variant="contained" startIcon={<UploadFileOutlined />} onClick={() => setUploadOpen(true)}>Upload Document</Button>}>
        <SimpleTable
          columns={['File Name','Document Type','Uploaded','Size','Status','Actions']}
          rows={docs.map((r) => [r.name, r.type, r.uploaded, r.size, <StatusChip status={r.status} />,
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small"><DownloadOutlined fontSize="small" /></IconButton>
              <IconButton size="small"><PreviewOutlined fontSize="small" /></IconButton>
              <IconButton size="small"><DeleteOutlineOutlined fontSize="small" /></IconButton>
            </Stack>])}
        />
      </PanelPaper>
      <UploadDocumentDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={(d) => {
          setDocs((prev) => [...prev, { name: d.fileName, type: d.type, uploaded: new Date().toLocaleDateString('en-GB'), size: d.size, status: 'Pending' }]);
          showToast('Document uploaded', 'success');
        }}
      />
    </>
  );
}

function EmailPanel() {
  const showToast = useToast();
  const [composeOpen, setComposeOpen] = useState(false);
  const [emails, setEmails] = useState([
    { date: '2026-06-24 09:22', to: 'applicant@example.com', subject: 'Application received', status: 'Delivered' },
    { date: '2026-06-25 14:08', to: 'applicant@example.com', subject: 'Payment required',     status: 'Delivered' },
  ]);
  return (
    <>
      <PanelPaper title="Email history" actions={<Button size="small" variant="contained" startIcon={<EmailOutlined />} onClick={() => setComposeOpen(true)}>Compose Email</Button>}>
        <SimpleTable columns={['Sent','To','Subject','Status','Actions']}
          rows={emails.map((r) => [r.date, r.to, r.subject, <StatusChip status={r.status} />,
            <IconButton size="small"><PreviewOutlined fontSize="small" /></IconButton>])} />
      </PanelPaper>
      <ComposeEmailDialog
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSave={(e) => {
          setEmails((prev) => [...prev, { date: new Date().toLocaleString('en-GB'), to: e.to, subject: e.subject, status: 'Sent' }]);
          showToast('Email sent', 'success');
        }}
      />
    </>
  );
}

function PaymentPanel({ amount }: { amount: number }) {
  const rows = [
    { date: '2026-06-25', method: 'Card', ref: 'ch_1Nq8p2', amount: amount, status: 'Succeeded' },
  ];
  return (
    <PanelPaper title="Payment history">
      <SimpleTable columns={['Date','Method','Reference','Amount','Status']}
        rows={rows.map((r) => [r.date, r.method, r.ref, `£${r.amount.toFixed(2)}`, <StatusChip status={r.status} />])} />
    </PanelPaper>
  );
}

function AuditPanel({ app }: { app: any }) {
  const rows = [
    { when: '2026-06-24 09:22', who: 'System', event: 'Application Created', from: '—', to: 'Pending Approval' },
    { when: '2026-06-24 09:35', who: app.assignedTo, event: 'Assigned', from: '—', to: app.assignedTo },
    { when: '2026-06-25 10:04', who: app.assignedTo, event: 'Status Change', from: 'Pending Approval', to: app.status },
  ];
  return (
    <PanelPaper title="Audit log">
      <SimpleTable columns={['When','User','Event','From','To']} rows={rows.map((r) => [r.when, r.who, r.event, r.from, r.to])} />
    </PanelPaper>
  );
}

function NotesPanel() {
  const [notes, setNotes] = useState([
    { id: 1, author: 'Jafar Basha', when: '2026-06-25', text: 'Called applicant to confirm address change.', visibleToApplicant: false },
  ]);
  const [text, setText] = useState('');
  const add = () => { if (!text) return; setNotes((n) => [{ id: Date.now(), author: 'You', when: '2026-07-03', text, visibleToApplicant: false }, ...n]); setText(''); };
  return (
    <PanelPaper title="Notes">
      <Stack spacing={2}>
        <TextField placeholder="Add a note…" multiline minRows={2} value={text} onChange={(e) => setText(e.target.value)} fullWidth />
        <Stack direction="row" justifyContent="flex-end"><Button variant="contained" onClick={add}>Add Note</Button></Stack>
        <Divider />
        <Stack spacing={1.5}>
          {notes.map((n) => (
            <Box key={n.id} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1, border: `1px solid ${tokens.LINE}` }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={600}>{n.author}</Typography>
                <Typography variant="caption" color="text.secondary">{n.when}</Typography>
              </Stack>
              <Typography sx={{ mt: 0.75 }}>{n.text}</Typography>
              {n.visibleToApplicant && <Chip size="small" label="Visible to applicant" sx={{ mt: 1 }} />}
            </Box>
          ))}
        </Stack>
      </Stack>
    </PanelPaper>
  );
}

function AddressAssignPanel() {
  const showToast = useToast();
  return (
    <PanelPaper title="Add address and assign">
      <Grid container spacing={2}>
        <FormItem label="Postcode search">
          <TextField placeholder="Enter postcode" fullWidth inputProps={{ maxLength: FIELD_LIMITS.POSTCODE }} />
        </FormItem>
        <FormItem label="Select address"><TextField select fullWidth defaultValue=""><MenuItem value="">Select an address</MenuItem></TextField></FormItem>
        <FormItem label="USRN">
          <TextField placeholder="Auto-populated" fullWidth inputProps={{ maxLength: FIELD_LIMITS.USRN }} />
        </FormItem>
        <FormItem label="UPRN">
          <TextField placeholder="Auto-populated" fullWidth inputProps={{ maxLength: FIELD_LIMITS.UPRN }} />
        </FormItem>
        <FormItem label="Zone"><TextField placeholder="Auto-detected from address" fullWidth /></FormItem>
      </Grid>
      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button variant="text" onClick={() => showToast('Cancelled', 'info')}>Cancel</Button>
        <Button variant="contained" onClick={() => showToast('Address assigned', 'success')}>Add Address & Assign</Button>
      </Stack>
    </PanelPaper>
  );
}

function CEOTaskPanel() {
  const showToast = useToast();
  const rows = [
    { taskId: 'CEO-2201', assignedTo: 'Team A', created: '2026-06-25', due: '2026-07-01', status: 'Task Assigned' },
  ];
  return (
    <PanelPaper title="CEO Task assignment" actions={<Button size="small" variant="contained" startIcon={<AddOutlined />} onClick={() => showToast('Task assigned', 'success')}>Assign Task to CEO</Button>}>
      <SimpleTable columns={['Task ID','Assigned To','Created','Due','Status','Actions']}
        rows={rows.map((r) => [r.taskId, r.assignedTo, r.created, r.due, <StatusChip status={r.status} />,
          <Button size="small" color="error" onClick={() => showToast('Task cancelled', 'success')}>Cancel Task</Button>])} />
    </PanelPaper>
  );
}

function RenewalSummaryPanel({ app }: { app: any }) {
  const showToast = useToast();
  return (
    <PanelPaper title="Renewal summary">
      <Grid container spacing={2}>
        <Fact label="Current permit" value={app.ref} />
        <Fact label="Current end date" value="2026-06-30" />
        <Fact label="New start date" value="2026-07-01" />
        <Fact label="New end date" value="2027-06-30" />
        <Fact label="Renewal price" value={`£${app.amount.toFixed(2)}`} />
        <Fact label="Documents required" value="Proof of Address, V5C" />
      </Grid>
      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button variant="text" onClick={() => showToast('Cancelled', 'info')}>Cancel</Button>
        <Button variant="contained" onClick={() => showToast('Renewal confirmed', 'success')}>Confirm Renewal</Button>
      </Stack>
    </PanelPaper>
  );
}

function RenewalDocsPanel() {
  const showToast = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [docs, setDocs] = useState([
    { type: 'Proof of Address', required: 'Yes', uploaded: '2026-06-24', status: 'Approved' },
    { type: 'Vehicle V5C',      required: 'Yes', uploaded: '—',           status: 'Pending' },
  ]);
  return (
    <>
      <PanelPaper title="Renewal documents" actions={<Button size="small" variant="contained" startIcon={<UploadFileOutlined />} onClick={() => setUploadOpen(true)}>Upload Document</Button>}>
        <SimpleTable columns={['Document Type','Required','Uploaded','Status']}
          rows={docs.map((r) => [r.type, r.required, r.uploaded, <StatusChip status={r.status} />])} />
      </PanelPaper>
      <UploadDocumentDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={(d) => {
          setDocs((prev) => [...prev, { type: d.type, required: 'No', uploaded: new Date().toLocaleDateString('en-GB'), status: 'Pending' }]);
          showToast('Document uploaded', 'success');
        }}
      />
    </>
  );
}

function VoucherPanel() {
  const showToast = useToast();
  return (
    <PanelPaper title="Visitor voucher / permit" actions={<Button size="small" variant="contained" startIcon={<AddOutlined />} onClick={() => showToast('Voucher issued', 'success')}>Issue Voucher</Button>}>
      <SimpleTable columns={['Voucher ID','Type','Hours','Issued','Used','Status']}
        rows={[
          ['V-30021', 'Hourly', '4h', '2026-06-24 09:22', '2026-06-24 12:12', <StatusChip status="Used" />],
          ['V-30022', 'Hourly', '2h', '2026-06-25 08:11', '—',                  <StatusChip status="Active" />],
        ]} />
    </PanelPaper>
  );
}

function PreviewPanel({ app }: { app: any }) {
  const showToast = useToast();
  return (
    <PanelPaper title="Application preview">
      <Box sx={{ p: 4, textAlign: 'center', border: `1px dashed ${tokens.LINE}`, borderRadius: 1, bgcolor: '#FAFBFC' }}>
        <PreviewOutlined sx={{ fontSize: 48, color: tokens.MUTED }} />
        <Typography sx={{ mt: 1 }}>Print-ready preview for <b>{app.ref}</b></Typography>
        <Typography variant="body2" color="text.secondary">PDF renderer stub — real app embeds react-pdf.</Typography>
        <Button variant="contained" startIcon={<DownloadOutlined />} sx={{ mt: 2 }} onClick={() => showToast('PDF downloading…', 'info')}>Download PDF</Button>
      </Box>
    </PanelPaper>
  );
}

/* ---------- Shared bits ---------- */

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

function SimpleTable({ columns, rows }: { columns: string[]; rows: any[][] }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns.map((c) => <TableCell key={c} sx={{ fontWeight: 700, color: tokens.INK, bgcolor: '#F4F6F9' }}>{c}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={i} hover>
            {r.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}
          </TableRow>
        ))}
        {rows.length === 0 && <TableRow><TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: tokens.MUTED }}>No records</TableCell></TableRow>}
      </TableBody>
    </Table>
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

function FormItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Grid item xs={12} sm={6}>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: tokens.INK, mb: 0.75 }}>{label}</Typography>
      {children}
    </Grid>
  );
}
