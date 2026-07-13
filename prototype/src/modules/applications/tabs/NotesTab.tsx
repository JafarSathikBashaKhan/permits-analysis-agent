import {
  Box, Button, Checkbox, Chip, Divider, FormControlLabel, IconButton, Paper, Stack,
  TextField, Typography,
} from '@mui/material';
import { DeleteOutlineOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { tokens } from '../../../theme';
import { usePersistentState } from '../../../hooks/usePersistentState';
import { useToast } from '../../../components/Toast';
import { pushAudit } from '../helpers/auditLog';
import type { UserRole } from '../helpers/buttonVisibility';

/**
 * US-162155 (Add Note by BO user), US-164436 (Edit note by BO user),
 * US-164507 (Delete note — BO Manager only), US-164605 (Notes section).
 */
export type Note = {
  id: number;
  author: string;
  authorRole: string;
  when: string;
  createdAt: string;
  updatedAt?: string;
  text: string;
  visibleToApplicant: boolean;
};

type Props = {
  appId: string;
  currentUser: string;
  currentRole: UserRole;
};

export function NotesTab({ appId, currentUser, currentRole }: Props) {
  const showToast = useToast();
  const [notes, setNotes] = usePersistentState<Note[]>(
    `prototype:applications:notes:${appId}`,
    () => [
      { id: 1, author: 'Jafar Basha', authorRole: 'BO User', when: '2026-06-25', createdAt: '2026-06-25T09:00:00Z', text: 'Called applicant to confirm address change.', visibleToApplicant: false },
    ]
  );
  const [text, setText] = useState('');
  const [visibleToApplicant, setVisibleToApplicant] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const canDelete = currentRole === 'BO Manager' || currentRole === 'Super Admin' || currentRole === 'Contract Admin';

  const add = () => {
    if (!text.trim()) { showToast('Note cannot be empty', 'error'); return; }
    const n: Note = {
      id: Date.now(),
      author: currentUser, authorRole: currentRole,
      when: new Date().toLocaleDateString('en-GB'),
      createdAt: new Date().toISOString(),
      text: text.trim(),
      visibleToApplicant,
    };
    setNotes((prev) => [n, ...prev]);
    pushAudit(appId, {
      actor: currentUser, actorRole: currentRole,
      eventName: 'Note Added',
      eventDescription: `Note added: "${n.text.slice(0, 80)}${n.text.length > 80 ? '…' : ''}"${n.visibleToApplicant ? ' (visible to applicant)' : ''}`,
      eventCategory: 'Application Processing',
    });
    setText(''); setVisibleToApplicant(false);
    showToast('Note added', 'success');
  };

  const startEdit = (n: Note) => { setEditingId(n.id); setEditingText(n.text); };
  const cancelEdit = () => { setEditingId(null); setEditingText(''); };
  const saveEdit = () => {
    if (!editingText.trim()) { showToast('Note cannot be empty', 'error'); return; }
    setNotes((prev) => prev.map((n) => n.id === editingId ? { ...n, text: editingText.trim(), updatedAt: new Date().toISOString() } : n));
    pushAudit(appId, {
      actor: currentUser, actorRole: currentRole,
      eventName: 'Note Edited',
      eventDescription: `Note ${editingId} edited.`,
      eventCategory: 'Application Processing',
    });
    cancelEdit();
    showToast('Note updated', 'success');
  };

  const deleteNote = (n: Note) => {
    if (!canDelete) { showToast('Only BO Managers can delete notes', 'error'); return; }
    setNotes((prev) => prev.filter((x) => x.id !== n.id));
    pushAudit(appId, {
      actor: currentUser, actorRole: currentRole,
      eventName: 'Note Deleted',
      eventDescription: `Note "${n.text.slice(0, 80)}" deleted.`,
      eventCategory: 'Application Processing',
    });
    showToast('Note deleted', 'success');
  };

  return (
    <Paper sx={{ p: 2.5, mb: 2 }}>
      <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.1rem', color: tokens.INK, mb: 2 }}>Notes</Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        <TextField
          placeholder="Add a note…" multiline minRows={2} value={text}
          onChange={(e) => setText(e.target.value)} fullWidth
          data-testid="note-text"
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <FormControlLabel
            control={<Checkbox checked={visibleToApplicant} onChange={(e) => setVisibleToApplicant(e.target.checked)} />}
            label="Visible to applicant"
          />
          <Button variant="contained" onClick={add} data-testid="add-note">Add Note</Button>
        </Stack>
        <Divider />
        <Stack spacing={1.5}>
          {notes.map((n) => {
            const isEditing = editingId === n.id;
            return (
              <Box key={n.id} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1, border: `1px solid ${tokens.LINE}` }} data-testid={`note-${n.id}`}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Stack>
                    <Typography fontWeight={600}>{n.author} <Typography component="span" variant="caption" color="text.secondary">({n.authorRole})</Typography></Typography>
                    <Typography variant="caption" color="text.secondary">
                      {n.when}{n.updatedAt && ` · edited`}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    {!isEditing && (
                      <IconButton size="small" onClick={() => startEdit(n)} title="Edit"><EditOutlined fontSize="small" /></IconButton>
                    )}
                    {isEditing && (
                      <>
                        <IconButton size="small" onClick={saveEdit} color="primary" title="Save"><SaveOutlined fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={cancelEdit} title="Cancel"><CloseOutlined fontSize="small" /></IconButton>
                      </>
                    )}
                    <IconButton
                      size="small" onClick={() => deleteNote(n)} disabled={!canDelete}
                      title={canDelete ? 'Delete' : 'Only BO Manager can delete'}
                    >
                      <DeleteOutlineOutlined fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
                {isEditing ? (
                  <TextField
                    fullWidth multiline minRows={2} value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    sx={{ mt: 1 }} data-testid={`note-edit-${n.id}`}
                  />
                ) : (
                  <Typography sx={{ mt: 0.75 }}>{n.text}</Typography>
                )}
                {n.visibleToApplicant && <Chip size="small" label="Visible to applicant" sx={{ mt: 1 }} />}
              </Box>
            );
          })}
          {notes.length === 0 && <Typography color="text.secondary">No notes yet.</Typography>}
        </Stack>
      </Stack>
    </Paper>
  );
}
