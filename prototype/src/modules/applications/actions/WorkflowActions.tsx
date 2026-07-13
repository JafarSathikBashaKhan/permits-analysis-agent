import { Button, IconButton, Menu, MenuItem, Stack, Typography, Chip } from '@mui/material';
import { MoreVertOutlined } from '@mui/icons-material';
import { useMemo, useState, MouseEvent } from 'react';
import { Application, ApplicationStatus } from '../../../data/mock';
import { StatusChip } from '../../../shared/StatusChip';
import { useToast } from '../../../components/Toast';
import { ConfirmDialog } from '../../../components/dialogs/ConfirmDialog';
import { EmailWorkflowDialog, EmailWorkflowResult } from '../../../components/dialogs/EmailWorkflowDialog';
import { ChangeZoneDialog } from '../../../components/dialogs/ChangeZoneDialog';
import { ChangeAddressDialog } from '../../../components/dialogs/ChangeAddressDialog';
import { RenewalConfirmDialog } from '../../../components/dialogs/RenewalConfirmDialog';
import { TemporaryAddressDialog } from '../../../components/dialogs/TemporaryAddressDialog';
import {
  ActionButton, ActionKey, getVisibleActions, splitPrimaryAndOverflow, UserRole,
} from '../helpers/buttonVisibility';
import {
  getCancelReasons, getHoldExtensionOptions, getHoldReasons, getHoldTtlDays,
  getRejectReasons, getRenewalGraceDays, getReinstateWindowHours, getSuspendReasons,
} from '../helpers/settings';
import { pushAudit } from '../helpers/auditLog';
import { usePersistentState } from '../../../hooks/usePersistentState';
import { BUSINESS_RULES, PAYMENT_METHOD_LABELS } from '../../../constants/enums';

type Props = {
  app: Application;
  role: UserRole;
  currentUser: string;
  onStatusChange: (newStatus: ApplicationStatus, message?: string) => void;
  onZoneChange: (zone: string) => void;
  onOpenTab: (tab: string) => void;
};

/**
 * Central workflow-actions component: renders the header action buttons + overflow menu
 * driven by the current status via getVisibleActions (US-195876), and orchestrates all
 * workflow dialogs — every state transition triggers an email workflow dialog + audit log.
 */
export function WorkflowActions({ app, role, currentUser, onStatusChange, onZoneChange, onOpenTab }: Props) {
  const showToast = useToast();
  const [overflowAnchor, setOverflowAnchor] = useState<HTMLElement | null>(null);

  // Dialog state per action
  const [activeDialog, setActiveDialog] = useState<ActionKey | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; action: () => void } | null>(null);

  // On-hold tracking
  const [holdExtensions, setHoldExtensions] = usePersistentState<number>(`prototype:applications:hold-extensions:${app.id}`, 0);
  const [holdStartedAt, setHoldStartedAt] = usePersistentState<string | null>(`prototype:applications:hold-started:${app.id}`, null);
  const [holdPreviousStatus, setHoldPreviousStatus] = usePersistentState<ApplicationStatus | null>(`prototype:applications:hold-prev:${app.id}`, null);
  const [suspendedFrom, setSuspendedFrom] = usePersistentState<ApplicationStatus | null>(`prototype:applications:suspended-from:${app.id}`, null);

  // Rejected / Cancelled timestamps for US-195186 (3-day reinstate window)
  const [cancelledAt, setCancelledAt] = usePersistentState<string | null>(`prototype:applications:cancelled-at:${app.id}`, null);
  const [rejectedAt, setRejectedAt] = usePersistentState<string | null>(`prototype:applications:rejected-at:${app.id}`, null);
  const [expiredAt, setExpiredAt] = usePersistentState<string | null>(`prototype:applications:expired-at:${app.id}`, null);

  const actions = useMemo(() => {
    const raw = getVisibleActions(app, role);

    // US-195186 — limit reinstate to 72h window
    const reinstateWindowMs = getReinstateWindowHours() * 3600 * 1000;
    const filtered = raw.filter((a) => {
      if (a.key === 'reinstate-cancelled' && cancelledAt && (Date.now() - new Date(cancelledAt).getTime() > reinstateWindowMs)) return false;
      if (a.key === 'reinstate-rejected' && rejectedAt && (Date.now() - new Date(rejectedAt).getTime() > reinstateWindowMs)) return false;

      // US-167275 — hide extend-hold after max extensions
      if (a.key === 'extend-hold' && holdExtensions >= BUSINESS_RULES.ON_HOLD_MAX_EXTENSIONS) return false;

      // US-177255 — Reactivate only within grace period after expiry
      const graceMs = getRenewalGraceDays() * 86400 * 1000;
      if (a.key === 'reactivate' && expiredAt && (Date.now() - new Date(expiredAt).getTime() > graceMs)) return false;

      return true;
    });
    return filtered;
  }, [app, role, cancelledAt, rejectedAt, holdExtensions, expiredAt]);

  const { primary, overflow } = splitPrimaryAndOverflow(actions);

  const applicantEmail = app.applicant.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.co.uk';

  // Generic helpers
  const audit = (name: string, description: string, category: any, extra?: Record<string, string>) => {
    pushAudit(app.id, {
      actor: currentUser, actorRole: role,
      eventName: name, eventDescription: description,
      eventCategory: category, ...extra,
    });
  };

  const handleEmailResult = (fn: (result: EmailWorkflowResult) => void) => (result: EmailWorkflowResult) => {
    // Append to email history
    try {
      const key = `prototype:applications:emails:${app.id}`;
      const list = JSON.parse(localStorage.getItem(key) ?? '[]');
      list.unshift({
        id: result.emailId, date: new Date().toLocaleString('en-GB'),
        to: result.to, cc: result.cc, subject: result.subject, body: result.body,
        attachments: result.attachments, direction: 'sent', status: result.draft ? 'Draft' : 'Sent',
      });
      localStorage.setItem(key, JSON.stringify(list));
    } catch { /* ignore */ }
    fn(result);
    setActiveDialog(null);
  };

  const handleActionClick = (key: ActionKey) => {
    setOverflowAnchor(null);
    switch (key) {
      case 'begin-review':
        onStatusChange('In Progress', 'Application moved to In Progress');
        audit('Application Under Review', 'Application moved to In Progress by BO user.', 'Application Processing');
        break;

      case 'evidence-provided':
        onStatusChange('Evidence Provided', 'Evidence marked as provided');
        audit('Evidence Provided', 'BO user marked evidence as provided.', 'Application Processing');
        break;

      case 'reactivate':
        setConfirmDialog({
          title: 'Reactivate Permit',
          message: 'Are you sure you want to reactivate this expired permit? It will move back to Active state.',
          action: () => {
            onStatusChange('Active', 'Permit reactivated');
            audit('Reactivate Permit', 'Expired permit reactivated within grace period.', 'Permit Management');
            setExpiredAt(null);
          },
        });
        break;

      case 'reinstate-cancelled':
      case 'reinstate-rejected':
        setConfirmDialog({
          title: 'Reinstate Application',
          message: 'Reinstate this application? It will return to Pending Approval.',
          action: () => {
            onStatusChange('Pending Approval', 'Application reinstated');
            audit('Application Reinstated', 'Cancelled/Rejected application reinstated (within 72h window).', 'Application Processing');
            setCancelledAt(null); setRejectedAt(null);
          },
        });
        break;

      case 'submit-to-process':
        setConfirmDialog({
          title: 'Submit Waiting-List Application',
          message: 'Are you sure you want to process this application? It will move to Pending Approval.',
          action: () => {
            onStatusChange('Pending Approval', 'Waiting-list application moved to Pending Approval');
            audit('Processing Waiting List Application', 'BO user submitted a waiting list application for processing.', 'Workflow Action / Status Change');
          },
        });
        break;

      case 'cancel-permit':
      case 'cancel':
      case 'reject':
      case 'suspend':
      case 'on-hold':
      case 'approve':
      case 'approve-post-payment':
      case 'activate-suspend':
      case 'resume':
      case 'extend-hold':
      case 'request-evidence':
      case 'request-customer-info':
      case 'internal-referral':
      case 'change-zone':
      case 'change-address':
      case 'renew':
      case 'record-payment':  // handled in Payment tab
      case 'temporary-approve':
        setActiveDialog(key);
        break;
    }
  };

  // Renewal state — read from mock builder data or use zones list
  const [renewOpen, setRenewOpen] = useState(false);

  // Show hold-extension counter next to status if on hold
  const holdCounter = app.status === 'On Hold' && (
    <Typography variant="caption" color="text.secondary">Extended {holdExtensions}/{BUSINESS_RULES.ON_HOLD_MAX_EXTENSIONS}</Typography>
  );

  const zones = ['Z01 City Centre', 'Z02 Northgate', 'Z03 Southbank', 'Z04 Riverside', 'Z05 Kingsway'];
  const zonePrices: Record<string, number> = {
    'Z01 City Centre': 180, 'Z02 Northgate': 100, 'Z03 Southbank': 140, 'Z04 Riverside': 120, 'Z05 Kingsway': 160,
  };

  const holdTtlDays = getHoldTtlDays();

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <StatusChip status={app.status} />
        {holdCounter}
        {expiredAt && app.status === 'Expired' && (
          <Chip size="small" label={`Grace period ends in ${Math.max(0, getRenewalGraceDays() - Math.floor((Date.now() - new Date(expiredAt).getTime()) / 86400000))}d`} />
        )}
        {primary.map((a) => (
          <Button
            key={a.key}
            variant={a.variant ?? 'outlined'}
            color={a.color as any}
            onClick={() => handleActionClick(a.key)}
            data-testid={`action-${a.key}`}
          >
            {a.label}
          </Button>
        ))}
        {overflow.length > 0 && (
          <>
            <IconButton onClick={(e: MouseEvent<HTMLElement>) => setOverflowAnchor(e.currentTarget)} data-testid="more-actions">
              <MoreVertOutlined />
            </IconButton>
            <Menu anchorEl={overflowAnchor} open={!!overflowAnchor} onClose={() => setOverflowAnchor(null)}>
              {overflow.map((a) => (
                <MenuItem key={a.key} onClick={() => handleActionClick(a.key)} data-testid={`overflow-${a.key}`}>
                  {a.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Stack>

      {/* Confirmation dialog (used for begin-review, reactivate, reinstate, submit-to-process) */}
      {confirmDialog && (
        <ConfirmDialog
          open onClose={() => setConfirmDialog(null)}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.action}
        />
      )}

      {/* Approve (Pre-Payment) — US-160629 / US-174167 */}
      <EmailWorkflowDialog
        open={activeDialog === 'approve'}
        onClose={() => setActiveDialog(null)}
        templateKey="Approve"
        title="Approve Application"
        sendLabel="Approve & Send Email"
        appRef={app.ref}
        defaultTo={applicantEmail}
        extraMerges={{ ApplicantName: app.applicant, Zone: app.zone, Amount: app.amount.toFixed(2) }}
        onSend={handleEmailResult(() => {
          // Pre-payment goes straight to Active per US-174167
          onStatusChange('Active', 'Application approved');
          audit('Application Approved', 'The application was approved by the BO user and moved forward in the process.', 'Application Processing', { from: app.status, to: 'Active' });
        })}
        onSaveDraft={handleEmailResult(() => showToast('Approval email saved as draft', 'info'))}
      />

      {/* Approve (Post-Payment) — US-162113 */}
      <EmailWorkflowDialog
        open={activeDialog === 'approve-post-payment'}
        onClose={() => setActiveDialog(null)}
        templateKey="ApprovePostPayment"
        title="Approve Application (Post-Payment)"
        sendLabel="Approve & Send Payment Request"
        appRef={app.ref}
        defaultTo={applicantEmail}
        extraMerges={{ ApplicantName: app.applicant, Amount: app.amount.toFixed(2) }}
        onSend={handleEmailResult(() => {
          onStatusChange('Awaiting Payment', 'Awaiting payment from applicant');
          audit('Application Approved Awaiting for Payment', 'Approved the application and is awaiting payment completion from customer.', 'System Action', { from: app.status, to: 'Awaiting Payment' });
        })}
      />

      {/* Reject — US-160796 / US-172028 */}
      <EmailWorkflowDialog
        open={activeDialog === 'reject'}
        onClose={() => setActiveDialog(null)}
        templateKey="Reject"
        title="Reject Application"
        sendLabel="Send Reject Email"
        appRef={app.ref}
        defaultTo={applicantEmail}
        reasonOptions={getRejectReasons()}
        reasonLabel="Rejection Reason"
        extraMerges={{ ApplicantName: app.applicant }}
        onSend={handleEmailResult((result) => {
          onStatusChange('Rejected', `Application rejected: ${result.reason}`);
          setRejectedAt(new Date().toISOString());
          audit('Application Rejected', `Application rejected by BO user. Reason: ${result.reason}`, 'Application Processing', { from: app.status, to: 'Rejected' });
        })}
      />

      {/* Cancel / Cancel Permit — US-160872 / US-172046 */}
      <EmailWorkflowDialog
        open={activeDialog === 'cancel' || activeDialog === 'cancel-permit'}
        onClose={() => setActiveDialog(null)}
        templateKey="Cancel"
        title="Cancel Application"
        sendLabel="Send Cancellation Email"
        appRef={app.ref}
        defaultTo={applicantEmail}
        reasonOptions={getCancelReasons()}
        reasonLabel="Cancellation Reason"
        extraMerges={{ ApplicantName: app.applicant }}
        onSend={handleEmailResult((result) => {
          onStatusChange('Cancelled', `Application cancelled: ${result.reason}`);
          setCancelledAt(new Date().toISOString());
          audit('Application Cancelled', `Application cancelled by BO user. Reason: ${result.reason}`, 'Application Processing', { from: app.status, to: 'Cancelled' });
        })}
      />

      {/* Suspend — US-164018 / US-179426 */}
      <EmailWorkflowDialog
        open={activeDialog === 'suspend'}
        onClose={() => setActiveDialog(null)}
        templateKey="Suspend"
        title="Suspend Application"
        sendLabel="Send Suspend Application via Email"
        appRef={app.ref}
        defaultTo={applicantEmail}
        reasonOptions={getSuspendReasons()}
        reasonLabel="Suspension Reason"
        extraMerges={{ ApplicantName: app.applicant }}
        onSend={handleEmailResult((result) => {
          setSuspendedFrom(app.status);
          onStatusChange('Suspended', `Application suspended: ${result.reason}`);
          audit('Application Suspended', `BO User initiated the suspension of an active application, due to ${result.reason}.`, 'Application Processing', { from: app.status, to: 'Suspended' });
        })}
      />

      {/* Activate Suspend — US-180625 */}
      <EmailWorkflowDialog
        open={activeDialog === 'activate-suspend'}
        onClose={() => setActiveDialog(null)}
        templateKey="Activate"
        title="Activate Suspended Application"
        sendLabel="Send Activation Email"
        appRef={app.ref}
        defaultTo={applicantEmail}
        extraMerges={{ ApplicantName: app.applicant }}
        onSend={handleEmailResult(() => {
          const target = suspendedFrom ?? 'Active';
          onStatusChange('Active', `Suspension lifted, application returned to ${target}`);
          audit('Activate Suspended Application', `Captures the BO user's action of reactivating an application that was previously in a Suspended state.`, 'User Action', { from: 'Suspended', to: 'Active' });
          setSuspendedFrom(null);
        })}
      />

      {/* On-Hold — US-160894 / US-172045 / US-193198 */}
      <EmailWorkflowDialog
        open={activeDialog === 'on-hold'}
        onClose={() => setActiveDialog(null)}
        templateKey="Hold"
        title="On-Hold Application"
        sendLabel="Send Hold Email"
        appRef={app.ref}
        defaultTo={applicantEmail}
        reasonOptions={getHoldReasons()}
        reasonLabel="On-Hold Reason"
        durationOptions={getHoldExtensionOptions()}
        durationLabel="On-Hold Duration"
        extraMerges={{ ApplicantName: app.applicant, HoldUntil: `${holdTtlDays} days from today` }}
        onSend={handleEmailResult(() => {
          setHoldPreviousStatus(app.status);
          setHoldStartedAt(new Date().toISOString());
          onStatusChange('On Hold', 'Application placed on hold');
          audit('Application On-Hold', 'BO User placed the application on hold; will auto-revert if not resumed within TTL.', 'Workflow Action / Status Change', { from: app.status, to: 'On Hold' });
        })}
      />

      {/* Extend Hold Duration — US-167275 */}
      <EmailWorkflowDialog
        open={activeDialog === 'extend-hold'}
        onClose={() => setActiveDialog(null)}
        templateKey="HoldExtend"
        title="Extend On-Hold Duration"
        sendLabel="Send Extension Notice"
        appRef={app.ref}
        defaultTo={applicantEmail}
        durationOptions={getHoldExtensionOptions()}
        durationLabel="New Duration"
        extraMerges={{ ApplicantName: app.applicant, HoldUntil: 'the extended date' }}
        onSend={handleEmailResult(() => {
          if (holdExtensions >= BUSINESS_RULES.ON_HOLD_MAX_EXTENSIONS) {
            showToast('Maximum hold extensions reached', 'error');
            return;
          }
          const next = holdExtensions + 1;
          setHoldExtensions(next);
          audit('On Hold Duration Extended', `The On Hold duration for the application was extended (${next}/${BUSINESS_RULES.ON_HOLD_MAX_EXTENSIONS}).`, 'Work Queue / Process Management');
          showToast(`Hold extended (${next}/${BUSINESS_RULES.ON_HOLD_MAX_EXTENSIONS})`, 'success');
        })}
      />

      {/* Resume from On-Hold */}
      <EmailWorkflowDialog
        open={activeDialog === 'resume'}
        onClose={() => setActiveDialog(null)}
        templateKey="Activate"
        title="Resume Application"
        sendLabel="Send Resume Email"
        appRef={app.ref}
        defaultTo={applicantEmail}
        extraMerges={{ ApplicantName: app.applicant }}
        onSend={handleEmailResult(() => {
          const target = holdPreviousStatus ?? 'In Progress';
          onStatusChange(target, `Application resumed to ${target}`);
          audit('Application Resumed', 'BO user resumed the application from On-Hold.', 'Workflow Action / Status Change', { from: 'On Hold', to: target });
          setHoldStartedAt(null); setHoldPreviousStatus(null); setHoldExtensions(0);
        })}
      />

      {/* Request Evidence — US-160915 / US-172029 */}
      <EmailWorkflowDialog
        open={activeDialog === 'request-evidence'}
        onClose={() => setActiveDialog(null)}
        templateKey="RequestEvidence"
        title="Request Support Evidence"
        sendLabel="Send Support Evidence Via Email"
        appRef={app.ref}
        defaultTo={applicantEmail}
        documentOptions={['Proof of Address', 'Proof of Vehicle Ownership', 'V5C', 'Business Certificate', 'Blue Badge', 'Disabled Bay Approval']}
        documentLabel="Document Types Requested"
        extraMerges={{ ApplicantName: app.applicant }}
        onSend={handleEmailResult((result) => {
          onStatusChange('Request Support Evidence', 'Awaiting supporting evidence from applicant');
          audit('Request Supporting Evidence', `BO user requested additional supporting documents: ${result.documents?.join(', ')}`, 'Application Processing', { from: app.status, to: 'Request Support Evidence' });
        })}
      />

      {/* Request Customer Info — US-175711 */}
      <EmailWorkflowDialog
        open={activeDialog === 'request-customer-info'}
        onClose={() => setActiveDialog(null)}
        templateKey="RequestCustomerInfo"
        title="Request Customer Information"
        sendLabel="Send Request Customer Information Email"
        appRef={app.ref}
        defaultTo={applicantEmail}
        extraMerges={{ ApplicantName: app.applicant }}
        onSend={handleEmailResult(() => {
          onStatusChange('Waiting for Customer Info', 'Awaiting customer information');
          audit('Request Customer Information', 'BO user requested additional customer information.', 'Application Processing', { from: app.status, to: 'Waiting for Customer Info' });
        })}
      />

      {/* Internal Referral — US-160900 / US-195616 */}
      <EmailWorkflowDialog
        open={activeDialog === 'internal-referral'}
        onClose={() => setActiveDialog(null)}
        templateKey="InternalReferral"
        title="Internal Referral"
        sendLabel="Refer & Send Email"
        appRef={app.ref}
        defaultTo="bo.user.b@marston.co.uk"
        reasonOptions={['Requires senior review', 'Legal check needed', 'Address discrepancy', 'Documentation query', 'Other']}
        reasonLabel="Referral Reason"
        extraMerges={{ ReferredBy: currentUser, ReferredTo: 'BO User B', ReferralNotes: 'Application referred for review' }}
        onSend={handleEmailResult((result) => {
          onStatusChange('Internal Referral', `Referred internally: ${result.reason}`);
          audit('Internal Referral', `Application referred internally to BO User B. Reason: ${result.reason}`, 'Communication', { from: app.status, to: 'Internal Referral' });
        })}
      />

      {/* Change Zone — US-170243 (no cost) — decided by rule: same-zone rules or explicit config */}
      <ChangeZoneDialog
        open={activeDialog === 'change-zone'}
        onClose={() => setActiveDialog(null)}
        currentZone={app.zone} currentPrice={app.amount}
        zones={zones} zonePrices={zonePrices}
        chargesApply={false /* toggle here for cost mode */}
        onConfirm={(p) => {
          onZoneChange(p.newZone);
          onStatusChange('Active', `Zone changed to ${p.newZone}`);
          audit('Zone Changed', `Zone changed from ${app.zone} to ${p.newZone}. No charges applied.`, 'Permit Management', { from: app.zone, to: p.newZone });
        }}
      />

      {/* Change Address — US-199490 / US-199506 (email follow-up) */}
      <ChangeAddressDialog
        open={activeDialog === 'change-address'}
        onClose={() => setActiveDialog(null)}
        currentZone={app.zone} currentPrice={app.amount}
        onProceed={(p) => {
          if (p.costSummary && p.costSummary.total > 0) {
            onStatusChange('Change Address', 'Address change awaiting payment');
          } else {
            onZoneChange(p.newZone);
            onStatusChange('Active', 'Address updated');
          }
          audit('Address Change Initiated (BO)', `BO user started the address change flow. New zone: ${p.newZone}.`, 'Address Change / Initiated');
          // Kick off email confirmation immediately (US-199506)
          setActiveDialog('address-email' as ActionKey);
          (window as any).__pendingAddressChange = p;
        }}
      />

      <EmailWorkflowDialog
        open={activeDialog === ('address-email' as ActionKey)}
        onClose={() => setActiveDialog(null)}
        templateKey="ChangeAddress"
        title="Address Change Notification"
        sendLabel="Send Address Change Email"
        appRef={app.ref}
        defaultTo={applicantEmail}
        extraMerges={{
          ApplicantName: app.applicant,
          NewAddress: `${(window as any).__pendingAddressChange?.property ?? ''} ${(window as any).__pendingAddressChange?.street ?? ''} ${(window as any).__pendingAddressChange?.town ?? ''} ${(window as any).__pendingAddressChange?.postcode ?? ''}`.trim(),
          NewZone: (window as any).__pendingAddressChange?.newZone ?? '',
        }}
        onSend={handleEmailResult(() => {
          audit('Change Address — Email Notification', 'Confirmation email sent to applicant for address change.', 'Communication');
          delete (window as any).__pendingAddressChange;
        })}
      />

      {/* Renew — US-169022 / US-193350 / US-195183 */}
      <RenewalConfirmDialog
        open={activeDialog === 'renew'}
        onClose={() => setActiveDialog(null)}
        defaultCardLast4="4242"
        paymentMethods={Object.values(PAYMENT_METHOD_LABELS).slice(0, 8)}
        onProceed={(method) => {
          onStatusChange('Pending Renew', `Renewal initiated (payment via ${method})`);
          audit('Renewal Initiated by BO', `BO user initiated renewal for the application. Payment method: ${method}`, 'Permit Management', { from: app.status, to: 'Pending Renew' });
          onOpenTab('renewal-summary');
        }}
      />

      {/* Temporary Approve — US-181869 */}
      <TemporaryAddressDialog
        open={activeDialog === 'temporary-approve'}
        onClose={() => setActiveDialog(null)}
        zones={zones}
        currentTempAddress="Flat X, Elsewhere Street, CC9 9ZZ (temporary)"
        onApprove={(p) => {
          onZoneChange(p.zone);
          onStatusChange('Active', 'Address challenge approved, permit activated');
          audit('Address Challenge Approved', `BO user verified and approved temporary address; mapped to zone ${p.zone}.`, 'Address Change / Initiated', { to: p.zone });
        }}
      />
    </>
  );
}
