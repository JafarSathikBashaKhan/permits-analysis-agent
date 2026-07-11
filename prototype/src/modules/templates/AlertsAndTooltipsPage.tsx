import { useState } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Stack, Tab, Tabs, TextField, Typography, FormControlLabel, Switch, Alert, MenuItem,
} from '@mui/material';
import { PageHeader } from '../../shared/PageHeader';
import { useToast } from '../../components/Toast';

type AlertConfig = {
  cookieDescription: string;
  cookieAssignedPages: string[];
  experianMessage: string;
  experianDescription: string;
  experianAssignedPages: string[];
  correspondenceAddress: string;
  correspondenceAssignedPages: string[];
  customerNotificationEnabled: boolean;
  customerNotificationDescription: string;
  customerNotificationAssignedPages: string[];
  toasterSuccessMessage: string;
  toasterErrorMessage: string;
  toasterWarningMessage: string;
};

const APP_PAGES = [
  'Buy Now', 'Applications', 'Application Details', 'Users',
  'Applicants', 'Permission Setup', 'Templates', 'Print', 'Area', 'Dashboard',
];

const initial: AlertConfig = {
  cookieDescription: '<p>This site uses cookies to enhance your browsing experience...</p>',
  cookieAssignedPages: ['Buy Now', 'Applications'],
  experianMessage: 'Your details will be verified with Experian.',
  experianDescription: '<p>Experian is used to verify your identity and address...</p>',
  experianAssignedPages: ['Buy Now'],
  correspondenceAddress: 'Marston Holdings\nCity House\nSutton Park Road\nStockport SK1 3AZ',
  correspondenceAssignedPages: ['Print'],
  customerNotificationEnabled: true,
  customerNotificationDescription: '<p>Notify customers about updates to their permit.</p>',
  customerNotificationAssignedPages: ['Applications', 'Applicants'],
  toasterSuccessMessage: 'Operation completed successfully',
  toasterErrorMessage: 'An error occurred. Please try again.',
  toasterWarningMessage: 'Please review the information provided.',
};

const EDITOR_TOOLBAR = ['B', 'I', 'U', '• List', '1. List', '🔗 Link', 'Align', 'Font'];

function RichEditor({
  label, value, max, onChange, disabled,
}: { label: string; value: string; max: number; onChange: (v: string) => void; disabled?: boolean }) {
  const strippedLen = value.replace(/<p>|<\/p>|<br\s*\/?>|&nbsp;/gi, '').trim().length;
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden', opacity: disabled ? 0.6 : 1 }}>
        <Stack direction="row" spacing={0.5} sx={{ px: 1, py: 0.5, bgcolor: 'grey.100', borderBottom: 1, borderColor: 'divider' }}>
          {EDITOR_TOOLBAR.map((t) => <Chip key={t} label={t} size="small" />)}
        </Stack>
        <TextField multiline fullWidth minRows={6} value={value} disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          InputProps={{ sx: { borderRadius: 0, '& fieldset': { border: 'none' } } }} />
      </Box>
      <Typography variant="caption" color={strippedLen > max ? 'error' : 'text.secondary'}>
        {strippedLen}/{max} characters
      </Typography>
    </Box>
  );
}

export function AlertsAndTooltipsPage() {
  const showToast = useToast();
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = usePersistentState<AlertConfig>('prototype:templates:alerts:rows', initial);
  const [draft, setDraft] = useState<AlertConfig>(saved);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);

  const set = <K extends keyof AlertConfig>(k: K, v: AlertConfig[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const save = () => {
    setSaved(draft);
    showToast('Alerts and tooltips saved successfully', 'success');
  };

  const cancel = () => {
    if (dirty) { setConfirmDiscard(true); return; }
    setDraft(saved);
  };

  const discard = () => { setDraft(saved); setConfirmDiscard(false); };

  return (
    <Box>
      <PageHeader eyebrow="Templates" title="Alerts and Tooltips"
        description="Cookie / Experian / Correspondence / Customer notification content." />

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Cookie" />
          <Tab label="Experian" />
          <Tab label="Property" />
          <Tab label="Customer Notification" />
          <Tab label="Toaster Messages" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <Stack spacing={2.5}>
              <RichEditor label="Description" max={1000}
                value={draft.cookieDescription} onChange={(v) => set('cookieDescription', v)} />
              <TextField
                select label="Assigned Pages" fullWidth
                SelectProps={{ multiple: true, renderValue: (sel) => (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(sel as string[]).map((p) => <Chip key={p} label={p} size="small" />)}
                  </Stack>
                )}}
                value={draft.cookieAssignedPages}
                onChange={(e) => set('cookieAssignedPages', e.target.value as string[])}
              >
                {APP_PAGES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Stack>
          )}

          {tab === 1 && (
            <Stack spacing={2.5}>
              <TextField label="Experian Message" fullWidth size="small"
                value={draft.experianMessage}
                onChange={(e) => set('experianMessage', e.target.value.slice(0, 500))}
                helperText={`${draft.experianMessage.length}/500`} />
              <RichEditor label="Description" max={1000}
                value={draft.experianDescription} onChange={(v) => set('experianDescription', v)} />
              <TextField
                select label="Assigned Pages" fullWidth
                SelectProps={{ multiple: true, renderValue: (sel) => (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(sel as string[]).map((p) => <Chip key={p} label={p} size="small" />)}
                  </Stack>
                )}}
                value={draft.experianAssignedPages}
                onChange={(e) => set('experianAssignedPages', e.target.value as string[])}
              >
                {APP_PAGES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Stack>
          )}

          {tab === 2 && (
            <Stack spacing={2.5}>
              <TextField label="Correspondence Address" fullWidth multiline rows={6}
                value={draft.correspondenceAddress}
                onChange={(e) => set('correspondenceAddress', e.target.value.slice(0, 500))}
                helperText={`${draft.correspondenceAddress.length}/500`} />
              <TextField
                select label="Assigned Pages" fullWidth
                SelectProps={{ multiple: true, renderValue: (sel) => (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(sel as string[]).map((p) => <Chip key={p} label={p} size="small" />)}
                  </Stack>
                )}}
                value={draft.correspondenceAssignedPages}
                onChange={(e) => set('correspondenceAssignedPages', e.target.value as string[])}
              >
                {APP_PAGES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Stack>
          )}

          {tab === 3 && (
            <Stack spacing={2.5}>
              <FormControlLabel
                control={
                  <Switch
                    checked={draft.customerNotificationEnabled}
                    onChange={(e) => set('customerNotificationEnabled', e.target.checked)}
                  />
                }
                label="Customer Notification"
              />
              <RichEditor label="Description" max={200}
                value={draft.customerNotificationDescription}
                disabled={!draft.customerNotificationEnabled}
                onChange={(v) => {
                  set('customerNotificationDescription', v);
                  const stripped = v.replace(/<p>|<\/p>|<br\s*\/?>|&nbsp;/gi, '').trim();
                  if (!stripped && draft.customerNotificationEnabled) {
                    set('customerNotificationEnabled', false);
                  }
                }}
              />
              <TextField
                select label="Assigned Pages" fullWidth
                SelectProps={{ multiple: true, renderValue: (sel) => (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(sel as string[]).map((p) => <Chip key={p} label={p} size="small" />)}
                  </Stack>
                )}}
                value={draft.customerNotificationAssignedPages}
                onChange={(e) => set('customerNotificationAssignedPages', e.target.value as string[])}
              >
                {APP_PAGES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
              {!draft.customerNotificationEnabled && (
                <Alert severity="info">Switch on to enable customer notifications.</Alert>
              )}
            </Stack>
          )}

          {tab === 4 && (
            <Stack spacing={2.5}>
              <TextField label="Success Message" fullWidth size="small"
                value={draft.toasterSuccessMessage}
                onChange={(e) => set('toasterSuccessMessage', e.target.value.slice(0, 200))}
                helperText={`${draft.toasterSuccessMessage.length}/200`} />
              <TextField label="Error Message" fullWidth size="small"
                value={draft.toasterErrorMessage}
                onChange={(e) => set('toasterErrorMessage', e.target.value.slice(0, 200))}
                helperText={`${draft.toasterErrorMessage.length}/200`} />
              <TextField label="Warning Message" fullWidth size="small"
                value={draft.toasterWarningMessage}
                onChange={(e) => set('toasterWarningMessage', e.target.value.slice(0, 200))}
                helperText={`${draft.toasterWarningMessage.length}/200`} />
            </Stack>
          )}
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={1}
          sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={cancel} disabled={!dirty}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={!dirty}>Save</Button>
        </Stack>
      </Box>

      <Dialog open={confirmDiscard} onClose={() => setConfirmDiscard(false)}>
        <DialogTitle>Discard unsaved changes?</DialogTitle>
        <DialogContent>
          <Typography>You have unsaved changes on this page. Discard them?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDiscard(false)}>Keep editing</Button>
          <Button color="error" variant="contained" onClick={discard}>Discard</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
