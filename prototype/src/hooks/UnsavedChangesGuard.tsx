/**
 * US-164796 + feedback in US-198805 — Unsaved Changes Warning on Navigation.
 *
 * Blocks in-app router transitions and browser unload while `dirty` is true.
 * Renders a confirmation modal with three actions:
 *   - Stay On Page
 *   - Don't Save
 *   - Save and Exit  (per US-198805 rename from "Save and Leave")
 */
import { useEffect, useState } from 'react';
import { useBlocker } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

export interface UnsavedChangesGuardProps {
  dirty: boolean;
  onSave: () => void | Promise<void>;
  message?: string;
}

export function UnsavedChangesGuard({ dirty, onSave, message }: UnsavedChangesGuardProps) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }: { currentLocation: { pathname: string }; nextLocation: { pathname: string } }) => {
      return dirty && currentLocation.pathname !== nextLocation.pathname;
    }
  );
  const [saving, setSaving] = useState(false);

  // Browser close / reload / external navigation guard
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const open = blocker.state === 'blocked';

  const handleStay = () => {
    if (blocker.state === 'blocked') blocker.reset();
  };
  const handleDontSave = () => {
    if (blocker.state === 'blocked') blocker.proceed();
  };
  const handleSaveAndExit = async () => {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
      if (blocker.state === 'blocked') blocker.proceed();
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth disableEscapeKeyDown>
      <DialogTitle sx={{ fontWeight: 700 }}>Unsaved changes</DialogTitle>
      <DialogContent>
        <Typography>
          {message || 'You have unsaved changes. Would you like to save your work as a draft before leaving?'}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleStay}>Stay On Page</Button>
        <Button onClick={handleDontSave} color="warning">Don&apos;t Save</Button>
        <Button variant="contained" onClick={handleSaveAndExit} disabled={saving}>
          {saving ? 'Saving…' : 'Save and Exit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
