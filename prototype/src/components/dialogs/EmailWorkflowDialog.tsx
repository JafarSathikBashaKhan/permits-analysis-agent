import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, MenuItem, Stack, TextField, Typography, Chip,
} from '@mui/material';
import { AttachFileOutlined, CloseOutlined, DeleteOutlineOutlined, EmailOutlined } from '@mui/icons-material';
import { useEffect, useMemo, useState, ChangeEvent } from 'react';
import { getEmailTemplates } from '../../modules/applications/helpers/settings';

/**
 * Universal workflow email dialog used by Approve, Reject, Cancel, Suspend, Hold,
 * Request Evidence, Request Customer Info, Internal Referral, Activate Suspend,
 * Change Zone (email), Change Address (email), Renewal, Reactivate, Reinstate.
 *
 * Implements: US-160629/174167 (Approve), US-160796/172028 (Reject),
 * US-160872/172046 (Cancel), US-160894/172045 (Hold), US-160915/172029 (Evidence),
 * US-175711 (Customer Info), US-195616 (Internal Referral), US-165894 (Preview),
 * US-165045 (Send), US-165891 (Save draft), US-199506 (Change Address),
 * US-180625 (Activate Suspend), US-193350 (Renew), US-181869 (Temp permit).
 *
 * Flow: compose → preview → send. Reason/documents/merge fields expanded into body.
 */

export type EmailWorkflowResult = {
  emailId: string;
  to: string;
  cc?: string;
  subject: string;
  body: string;
  templateKey: string;
  attachments: Array<{ name: string; size: string }>;
  reason?: string;
  documents?: string[];
  sentAt: string;
  draft?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSend: (result: EmailWorkflowResult) => void;
  onSaveDraft?: (result: EmailWorkflowResult) => void;

  /** Which template to pre-populate (looked up in getEmailTemplates()). */
  templateKey: string;
  /** Dialog title (e.g. "Approve Application"). */
  title: string;
  /** Label shown on the preview → send button (e.g. "Approve & Send Email"). */
  sendLabel?: string;
  /** Application reference number (shown in preview header). */
  appRef: string;
  /** Recipient email. */
  defaultTo: string;

  /**
   * Optional reason picker. When provided, dialog shows a required dropdown of reasons
   * (with "Others" support). Selected reason is available as merge field
   * {{Reason}} in the body.
   */
  reasonOptions?: string[];
  reasonLabel?: string;

  /**
   * Optional documents multi-select (used by Request Evidence US-160915).
   */
  documentOptions?: string[];
  documentLabel?: string;

  /**
   * Extra key/value merges applied to the body ({{Key}} → value).
   */
  extraMerges?: Record<string, string>;

  /**
   * Optional durations list (used by Hold + Extend Hold).
   */
  durationOptions?: string[];
  durationLabel?: string;
};

type Step = 'compose' | 'preview';

const MERGE_FIELDS = [
  '{{ApplicantName}}', '{{PermitReference}}', '{{StartDate}}', '{{EndDate}}',
  '{{Zone}}', '{{Amount}}', '{{VehicleReg}}', '{{Reason}}', '{{DocumentList}}',
  '{{HoldUntil}}', '{{NewZone}}', '{{OldZone}}',
];

export function EmailWorkflowDialog(props: Props) {
  const {
    open, onClose, onSend, onSaveDraft,
    templateKey, title, sendLabel = 'Send Email',
    appRef, defaultTo,
    reasonOptions, reasonLabel = 'Reason',
    documentOptions, documentLabel = 'Document Types',
    extraMerges = {},
    durationOptions, durationLabel = 'Duration',
  } = props;

  const templates = useMemo(() => getEmailTemplates(), []);
  const tpl = templates[templateKey] ?? { subject: '', body: '' };

  const [step, setStep] = useState<Step>('compose');
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState(tpl.subject);
  const [body, setBody] = useState(tpl.body);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [documents, setDocuments] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [attachments, setAttachments] = useState<Array<{ name: string; size: string }>>([]);

  useEffect(() => {
    if (open) {
      setStep('compose');
      setTo(defaultTo);
      setCc('');
      setSubject(tpl.subject);
      setBody(tpl.body);
      setReason('');
      setCustomReason('');
      setDocuments([]);
      setDuration('');
      setAttachments([]);
    }
  }, [open, templateKey, defaultTo, tpl.subject, tpl.body]);

  const effectiveReason = reason === 'Others' || reason === 'Other Reason' || reason === 'Other'
    ? customReason.trim()
    : reason;

  /** Apply merge fields to body before preview / send. */
  const mergedBody = useMemo(() => {
    let out = body;
    const merges: Record<string, string> = {
      Reason: effectiveReason,
      RejectionReason: effectiveReason,
      CancelReason: effectiveReason,
      SuspendReason: effectiveReason,
      HoldReason: effectiveReason,
      DocumentList: documents.join(', '),
      InfoRequested: effectiveReason || documents.join(', '),
      Duration: duration,
      PermitReference: appRef,
      ...extraMerges,
    };
    Object.entries(merges).forEach(([k, v]) => {
      out = out.split(`{{${k}}}`).join(v ?? '');
    });
    return out;
  }, [body, effectiveReason, documents, duration, appRef, extraMerges]);

  const canPreview =
    to.trim().length > 0 && subject.trim().length > 0 && mergedBody.trim().length > 0
    && (!reasonOptions || effectiveReason.length > 0)
    && (!durationOptions || duration.length > 0);

  const handleAttach = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((f) => {
      const size = f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`;
      setAttachments((prev) => [...prev, { name: f.name, size }]);
    });
    // reset input so same file can be added again
    e.target.value = '';
  };

  const removeAttachment = (i: number) => setAttachments((prev) => prev.filter((_, idx) => idx !== i));

  const buildResult = (draft: boolean): EmailWorkflowResult => ({
    emailId: `EMAIL-${Date.now()}`,
    to, cc: cc || undefined,
    subject, body: mergedBody,
    templateKey,
    attachments,
    reason: effectiveReason || undefined,
    documents: documents.length ? documents : undefined,
    sentAt: new Date().toISOString(),
    draft,
  });

  const handleSend = () => {
    onSend(buildResult(false));
    onClose();
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(buildResult(true));
    onClose();
  };

  const insertMergeField = (field: string) => setBody((b) => b + ' ' + field);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          {step === 'preview' ? 'Preview — ' : ''}{title} — <Typography component="span" sx={{ color: 'text.secondary' }}>{appRef}</Typography>
        </span>
        <IconButton onClick={onClose} size="small"><CloseOutlined /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {step === 'compose' ? (
          <Stack spacing={2} sx={{ mt: 0.5 }} data-testid="email-workflow-compose">
            <TextField label="To" required fullWidth value={to} onChange={(e) => setTo(e.target.value)} type="email" />
            <TextField label="CC (optional)" fullWidth value={cc} onChange={(e) => setCc(e.target.value)} />
            <TextField label="Subject" required fullWidth value={subject} onChange={(e) => setSubject(e.target.value)} />

            {reasonOptions && (
              <Stack spacing={1}>
                <TextField
                  select label={reasonLabel} required fullWidth
                  value={reason} onChange={(e) => setReason(e.target.value)}
                  data-testid="reason-select"
                >
                  {reasonOptions.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
                {(reason === 'Others' || reason === 'Other Reason' || reason === 'Other') && (
                  <TextField
                    label="Please specify" required fullWidth
                    value={customReason} onChange={(e) => setCustomReason(e.target.value)}
                    data-testid="reason-other-text"
                  />
                )}
              </Stack>
            )}

            {documentOptions && (
              <TextField
                select label={documentLabel} SelectProps={{ multiple: true }}
                fullWidth value={documents}
                onChange={(e) => setDocuments(
                  typeof e.target.value === 'string'
                    ? e.target.value.split(',')
                    : (e.target.value as unknown as string[])
                )}
                data-testid="document-multiselect"
              >
                {documentOptions.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
            )}

            {durationOptions && (
              <TextField
                select label={durationLabel} required fullWidth
                value={duration} onChange={(e) => setDuration(e.target.value)}
                data-testid="duration-select"
              >
                {durationOptions.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
            )}

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body2" fontWeight={600}>Body (editable)</Typography>
                <Box>
                  {MERGE_FIELDS.slice(0, 6).map((f) => (
                    <Button key={f} size="small" onClick={() => insertMergeField(f)}>{f}</Button>
                  ))}
                </Box>
              </Stack>
              <TextField
                fullWidth multiline minRows={10} value={body}
                onChange={(e) => setBody(e.target.value)}
                data-testid="email-body"
              />
            </Box>

            <Divider />

            <Stack direction="row" spacing={1} alignItems="center">
              <Button component="label" size="small" startIcon={<AttachFileOutlined />}>
                Attach file
                <input hidden type="file" multiple onChange={handleAttach} />
              </Button>
              {attachments.map((a, i) => (
                <Chip
                  key={i}
                  label={`${a.name} (${a.size})`}
                  size="small"
                  onDelete={() => removeAttachment(i)}
                  deleteIcon={<DeleteOutlineOutlined />}
                />
              ))}
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1.5} sx={{ mt: 0.5 }} data-testid="email-workflow-preview">
            <Typography variant="caption" color="text.secondary">Sent to</Typography>
            <Typography>{to}{cc && ` · cc ${cc}`}</Typography>
            <Divider />
            <Typography variant="caption" color="text.secondary">Subject</Typography>
            <Typography fontWeight={600}>{subject}</Typography>
            <Divider />
            <Typography variant="caption" color="text.secondary">Body</Typography>
            <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
              {mergedBody}
            </Box>
            {attachments.length > 0 && (
              <>
                <Divider />
                <Typography variant="caption" color="text.secondary">Attachments</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {attachments.map((a, i) => (
                    <Chip key={i} icon={<AttachFileOutlined />} label={`${a.name} (${a.size})`} size="small" />
                  ))}
                </Stack>
              </>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {step === 'compose' ? (
          <>
            <Button onClick={onClose}>Cancel</Button>
            {onSaveDraft && <Button onClick={handleSaveDraft}>Save and Close (Draft)</Button>}
            <Button
              variant="contained" disabled={!canPreview}
              onClick={() => setStep('preview')}
              startIcon={<EmailOutlined />}
              data-testid="preview-btn"
            >
              Preview
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setStep('compose')}>Cancel</Button>
            <Button variant="contained" onClick={handleSend} data-testid="send-btn">{sendLabel}</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
