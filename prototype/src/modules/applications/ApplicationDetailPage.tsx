import {
  Box, Button, Divider, Grid, Paper, Stack, Tab, Tabs, Typography,
} from '@mui/material';
import {
  ArrowBack, DescriptionOutlined, EmailOutlined, ReceiptLongOutlined, HistoryOutlined,
  StickyNote2Outlined, DirectionsCarOutlined, PersonOutlineOutlined,
  EventRepeatOutlined, HomeWorkOutlined, ListAltOutlined,
} from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Application, ApplicationStatus } from '../../data/mock';
import { tokens } from '../../theme';
import { useToast } from '../../components/Toast';
import { usePersistentState } from '../../hooks/usePersistentState';

import { OverviewTab } from './tabs/OverviewTab';
import { ApplicantTab } from './tabs/ApplicantTab';
import { VehiclesTab } from './tabs/VehiclesTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { EmailsTab } from './tabs/EmailsTab';
import { PaymentHistoryTab } from './tabs/PaymentHistoryTab';
import { AuditLogTab } from './tabs/AuditLogTab';
import { NotesTab } from './tabs/NotesTab';
import { RenewalSummaryTab } from './tabs/RenewalSummaryTab';
import { WaitingListTab } from './tabs/WaitingListTab';

import { WorkflowActions } from './actions/WorkflowActions';
import { UserRole } from './helpers/buttonVisibility';
import { pushAudit } from './helpers/auditLog';

type TabKey =
  | 'overview' | 'applicant' | 'vehicle' | 'document' | 'email'
  | 'payment' | 'audit' | 'notes' | 'address' | 'renewal-summary' | 'waiting-list';

type TabDef = { key: TabKey; label: string; icon: React.ReactNode };

const ALL_TABS: TabDef[] = [
  { key: 'overview',        label: 'Overview',           icon: <DescriptionOutlined fontSize="small" /> },
  { key: 'applicant',       label: 'Applicant',          icon: <PersonOutlineOutlined fontSize="small" /> },
  { key: 'vehicle',         label: 'Vehicles',           icon: <DirectionsCarOutlined fontSize="small" /> },
  { key: 'document',        label: 'Documents',          icon: <DescriptionOutlined fontSize="small" /> },
  { key: 'email',           label: 'Emails',             icon: <EmailOutlined fontSize="small" /> },
  { key: 'payment',         label: 'Payment History',    icon: <ReceiptLongOutlined fontSize="small" /> },
  { key: 'audit',           label: 'Audit Log',          icon: <HistoryOutlined fontSize="small" /> },
  { key: 'notes',           label: 'Notes',              icon: <StickyNote2Outlined fontSize="small" /> },
  { key: 'address',         label: 'Address Assign',     icon: <HomeWorkOutlined fontSize="small" /> },
  { key: 'renewal-summary', label: 'Renewal Summary',    icon: <EventRepeatOutlined fontSize="small" /> },
  { key: 'waiting-list',    label: 'Waiting List',       icon: <ListAltOutlined fontSize="small" /> },
];

/**
 * Applications Detail — orchestrator only. All tab bodies live in ./tabs/,
 * workflow actions in ./actions/WorkflowActions.
 *
 * Role is stored in localStorage under `prototype:app:current-role` for US-195876 role-guarded
 * visibility (BO Manager delete on notes etc.). Defaults to "BO User".
 */
export function ApplicationDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const showToast = useToast();

  const [allRows, setAllRows] = usePersistentState<Application[]>('prototype:applications:rows', []);
  const app = allRows.find((a) => a.id === id) ?? allRows[0];

  const [role] = usePersistentState<UserRole>('prototype:app:current-role', 'BO User');
  const [currentUser] = usePersistentState<string>('prototype:app:current-user', 'Jafar Basha');

  const [tab, setTab] = useState<TabKey>('overview');

  const isRenewalMode = app?.status === 'Pending Renew' || app?.status === 'Expired';

  const visibleTabs = useMemo(() => ALL_TABS.filter((t) => {
    if (!app) return false;
    if (t.key === 'address' && !(app.status === 'Active' || app.type === 'Suspension')) return false;
    if (t.key === 'renewal-summary' && !(app.status === 'Active' || app.status === 'Expired' || app.status === 'Pending Renew')) return false;
    if (t.key === 'waiting-list' && app.status !== 'Waiting List') return false;
    return true;
  }), [app]);

  const updateStatus = (newStatus: ApplicationStatus, toastMessage?: string) => {
    if (!app) return;
    setAllRows((prev) => prev.map((r) => r.id === app.id ? { ...r, status: newStatus } : r));
    showToast(toastMessage ?? `Status updated to ${newStatus}`, 'success');
  };

  const updateZone = (zone: string) => {
    if (!app) return;
    setAllRows((prev) => prev.map((r) => r.id === app.id ? { ...r, zone } : r));
  };

  if (!app) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Application not found</Typography>
        <Button onClick={() => nav('/applications')} sx={{ mt: 2 }}>Back to applications</Button>
      </Box>
    );
  }

  return (
    <>
      <Button startIcon={<ArrowBack />} onClick={() => nav('/applications')} sx={{ mb: 1 }} data-testid="back-to-list">All applications</Button>

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
          <WorkflowActions
            app={app} role={role} currentUser={currentUser}
            onStatusChange={updateStatus}
            onZoneChange={updateZone}
            onOpenTab={(t) => setTab(t as TabKey)}
          />
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Fact label="Type"        value={app.type} />
          <Fact label="Zone"        value={app.zone} />
          <Fact label="Submitted"   value={app.submitted} />
          <Fact label="Amount"      value={`£${app.amount.toFixed(2)}`} />
          <Fact label="Assigned to" value={app.assignedTo} />
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          {visibleTabs.map((t) => (
            <Tab key={t.key} value={t.key} label={t.label}
              icon={t.icon as any} iconPosition="start"
              sx={{ minHeight: 56, textTransform: 'none', fontWeight: 600 }}
              data-testid={`tab-${t.key}`}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab bodies */}
      {tab === 'overview' && <OverviewTab app={app} />}
      {tab === 'applicant' && <ApplicantTab app={app} />}
      {tab === 'vehicle' && <VehiclesTab appId={app.id} />}
      {tab === 'document' && <DocumentsTab appId={app.id} renewalMode={isRenewalMode} />}
      {tab === 'email' && <EmailsTab appId={app.id} />}
      {tab === 'payment' && <PaymentHistoryTab app={app} onOfflinePaid={() => {
        // US-194825 — post-record: transition Awaiting/Approved → Active
        if (app.status === 'Awaiting Payment' || app.status === 'Waiting for Payment' || app.status === 'Approved' || app.status === 'Change Zone' || app.status === 'Change Address') {
          updateStatus('Active', 'Offline payment recorded — permit activated');
          pushAudit(app.id, {
            actor: currentUser, actorRole: role,
            eventName: 'Application Activated (Offline Payment)',
            eventDescription: 'Application moved to Active after offline payment was recorded.',
            eventCategory: 'Workflow Action / Status Change',
            from: app.status, to: 'Active',
          });
        }
      }} />}
      {tab === 'audit' && <AuditLogTab app={app} />}
      {tab === 'notes' && <NotesTab appId={app.id} currentUser={currentUser} currentRole={role} />}
      {tab === 'address' && <AddressAssignInlinePanel />}
      {tab === 'renewal-summary' && <RenewalSummaryTab app={app} onStatusChange={updateStatus} />}
      {tab === 'waiting-list' && <WaitingListTab />}
    </>
  );
}

function AddressAssignInlinePanel() {
  return (
    <Paper sx={{ p: 2.5, mb: 2 }}>
      <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.1rem', color: tokens.INK, mb: 2 }}>Address assignment</Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography color="text.secondary">
        Use the <b>Change Address</b> action in the header to update the applicant's address and zone
        (US-199490 / US-199506). Address assignment for temporary permits uses the
        <b> Approve Address Challenge</b> action (US-181869).
      </Typography>
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
