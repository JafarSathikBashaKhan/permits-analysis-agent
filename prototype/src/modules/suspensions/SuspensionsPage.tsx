import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, IconButton, Stack, TextField, Typography, MenuItem, Divider, Drawer,
  Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';
import { ConfirmDialog } from '../../components/dialogs/ConfirmDialog';

type TaskStatus = 'Assigned' | 'Completed' | 'Cancelled' | 'Unassigned';
type Attachment = { name: string; kind: 'image' | 'pdf' };
type Note = { id: string; author: string; text: string; at: string; deletable: boolean };

type CeoTask = {
  id: string; title: string; category: string; location: string;
  taskStatus: TaskStatus; applicationId?: string; comment: string; assignmentType: string;
  createdDate: string; closedDate?: string; assignedTo?: string;
  showEvidence: boolean; attachments: Attachment[]; notes: Note[];
};

type SystemUser = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
  mobileNumber: string;
  status: 'Active' | 'Deactive';
  allowPermitDateChange: boolean;
  agentAssistEnabled: boolean;
  ddi?: string;
  pin?: string;
};

const CATEGORIES = ['Bay Suspension', 'Skip Hire', 'Scaffolding', 'Event Closure', 'Dispensation', 'Inspection'];
const LOCATIONS = ['Kingsway', 'Church Lane', 'Market Street', 'Mill Road', 'Riverside Ave', 'Oak Hill'];

const seedSystemUsers = (): SystemUser[] => [];

const seed = (): CeoTask[] => [
  { id: 'CEO-001', title: 'Inspect scaffolding at 48 Kingsway', category: 'Scaffolding', location: 'Kingsway',
    taskStatus: 'Completed', applicationId: 'AP-2026-1004', comment: 'Contractor confirmed compliance',
    assignmentType: 'Auto-assign', createdDate: '10 Mar 2026, 09:15', closedDate: '11 Mar 2026, 14:20',
    assignedTo: 'Priya R.', showEvidence: true,
    attachments: [{ name: 'photo-front.jpg', kind: 'image' }, { name: 'inspection-report.pdf', kind: 'pdf' }],
    notes: [{ id: 'n1', author: 'Priya R.', text: 'All safety checks passed', at: '11 Mar 2026, 14:15', deletable: false }] },
  { id: 'CEO-002', title: 'Verify bay suspension at Market Street', category: 'Bay Suspension', location: 'Market Street',
    taskStatus: 'Assigned', applicationId: 'AP-2026-1010', comment: 'Await site visit',
    assignmentType: 'Manual', createdDate: '18 Mar 2026, 11:00', assignedTo: 'Jo Smith', showEvidence: false, attachments: [], notes: [] },
  { id: 'CEO-003', title: 'Skip removal follow-up on Mill Road', category: 'Skip Hire', location: 'Mill Road',
    taskStatus: 'Unassigned', comment: 'Reported by resident', assignmentType: 'Auto-assign',
    createdDate: '20 Mar 2026, 08:30', showEvidence: false, attachments: [], notes: [] },
  { id: 'CEO-004', title: 'Event closure verification — Riverside', category: 'Event Closure', location: 'Riverside Ave',
    taskStatus: 'Cancelled', applicationId: 'AP-2026-1017', comment: 'Event cancelled by organiser',
    assignmentType: 'Manual', createdDate: '22 Mar 2026, 16:45', closedDate: '23 Mar 2026, 09:00',
    assignedTo: 'Dan Iyer', showEvidence: false, attachments: [], notes: [] },
  { id: 'CEO-005', title: 'Dispensation inspection — Oak Hill', category: 'Dispensation', location: 'Oak Hill',
    taskStatus: 'Completed', applicationId: 'AP-2026-1023', comment: 'Compliant', assignmentType: 'Auto-assign',
    createdDate: '01 Apr 2026, 10:00', closedDate: '01 Apr 2026, 15:20', assignedTo: 'Jafar Basha', showEvidence: true,
    attachments: [{ name: 'site.jpg', kind: 'image' }],
    notes: [{ id: 'n2', author: 'Jafar Basha', text: 'Photo evidence attached', at: '01 Apr 2026, 15:10', deletable: true }] },
];

const STATUS_COLOR: Record<TaskStatus, 'success' | 'primary' | 'warning' | 'error'> = {
  Completed: 'success', Assigned: 'primary', Unassigned: 'warning', Cancelled: 'error',
};

const DURATIONS = ['30 minutes', '1 hour', '2 hours', '4 hours', '1 day', '2 days', 'Custom'];

export function SuspensionsPage() {
  const showToast = useToast();
  const [tasks, setTasks] = usePersistentState<CeoTask[]>('prototype:suspensions:rows', seed);
  const [persistedUsers] = usePersistentState<SystemUser[]>('prototype:users:system-users:rows', seedSystemUsers);
  const boUsers = useMemo(() => {
    const users = persistedUsers && persistedUsers.length > 0 ? persistedUsers : [];
    return users.filter(u => u.status === 'Active').map(u => `${u.firstName} ${u.lastName}`);
  }, [persistedUsers]);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);
  const [evidenceTarget, setEvidenceTarget] = useState<CeoTask | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Bay Suspension');
  const [newLocation, setNewLocation] = useState('Kingsway');
  const [newDuration, setNewDuration] = useState('1 day');
  const [newAssignee, setNewAssignee] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) =>
      (statusFilter === 'All' || t.taskStatus === statusFilter) &&
      (!q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) ||
        (t.applicationId?.toLowerCase().includes(q) ?? false)),
    );
  }, [tasks, search, statusFilter]);

  const resetForm = () => {
    setNewTitle(''); setNewCategory('Bay Suspension'); setNewLocation('Kingsway');
    setNewDuration('1 day'); setNewAssignee(null); setNewComment('');
  };

  const createTask = () => {
    if (!newTitle.trim()) return;
    const id = `CEO-${String(tasks.length + 1).padStart(3, '0')}`;
    setTasks([{
      id, title: newTitle.trim(), category: newCategory, location: newLocation,
      taskStatus: newAssignee ? 'Assigned' : 'Unassigned',
      comment: newComment || `Duration: ${newDuration}`,
      assignmentType: newAssignee ? 'Manual' : 'Auto-assign',
      createdDate: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      assignedTo: newAssignee || undefined, showEvidence: false, attachments: [], notes: [],
    }, ...tasks]);
    resetForm(); setAddOpen(false);
    showToast('Task created successfully', 'success');
  };

  const bulkCancel = () => {
    const ids = new Set(selection.map(String));
    setTasks(tasks.map(t => ids.has(String(t.id)) ? { ...t, taskStatus: 'Cancelled' } : t));
    setSelection([]);
    showToast(`${ids.size} cancelled`, 'success');
    setConfirmCancel(false);
  };

  const bulkDelete = () => {
    const ids = new Set(selection.map(String));
    setTasks(tasks.filter(t => !ids.has(String(t.id))));
    setSelection([]);
    showToast(`${ids.size} deleted`, 'success');
    setConfirmDelete(false);
  };

  const cols: GridColDef[] = [
    { field: 'id', headerName: 'Task ID', width: 100 },
    { field: 'title', headerName: 'Title', flex: 1.4, minWidth: 220 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'taskStatus', headerName: 'Status', width: 130,
      renderCell: (p) => (
        <Chip size="small" label={p.value} color={STATUS_COLOR[p.value as TaskStatus]} variant="outlined" />
      ) },
    { field: 'applicationId', headerName: 'Linked App', width: 140,
      renderCell: (p) => p.value
        ? <Chip size="small" label={p.value} variant="outlined" color="info" />
        : <Typography variant="caption" color="text.secondary">—</Typography> },
    { field: 'assignedTo', headerName: 'Assigned To', width: 140,
      renderCell: (p) => p.value || <Typography variant="caption" color="text.secondary">Unassigned</Typography> },
    { field: 'assignmentType', headerName: 'Assignment', width: 120 },
    { field: 'createdDate', headerName: 'Created', width: 180 },
    { field: 'closedDate', headerName: 'Closed', width: 180 },
    { field: 'actions', headerName: 'Action', width: 100, sortable: false, filterable: false,
      renderCell: (p) => (p.row as CeoTask).showEvidence
        ? <IconButton size="small" onClick={() => setEvidenceTarget(p.row as CeoTask)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        : <Typography variant="caption" color="text.secondary">—</Typography> },
  ];

  return (
    <Box>
      <PageHeader eyebrow="Applications" title="Suspensions"
        description="CEO task history — bay suspensions, dispensations, and field inspections."
        actions={<Button variant="contained" startIcon={<AddIcon />} onClick={() => { resetForm(); setAddOpen(true); }}>New Task</Button>} />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
        <TextField size="small" placeholder="Search by title, task ID or application"
          value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 320 }} />
        <TextField size="small" select label="Status" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)} sx={{ minWidth: 160 }}>
          {['All', 'Assigned', 'Completed', 'Unassigned', 'Cancelled'].map((s) =>
            <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <Box sx={{ flex: 1 }} />
        {selection.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {selection.length} Row Selected
            </Typography>
            <Button variant="outlined" startIcon={<CancelOutlinedIcon />}
              onClick={() => setConfirmCancel(true)}>Cancel</Button>
            <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />}
              onClick={() => setConfirmDelete(true)}>Delete</Button>
          </>
        )}
      </Stack>

      <Box sx={{ height: 580, bgcolor: 'background.paper', borderRadius: 1 }}>
        <DataGrid rows={filtered} columns={cols} getRowId={(r) => r.id} density="compact"
          checkboxSelection
          rowSelectionModel={selection}
          onRowSelectionModelChange={setSelection}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick />
      </Box>

      <Drawer anchor="right" open={addOpen} onClose={() => setAddOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 560 } } }}>
        <Stack sx={{ height: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between"
            sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
            <Typography variant="h6">New CEO Task</Typography>
            <IconButton onClick={() => setAddOpen(false)}><CloseIcon /></IconButton>
          </Stack>
          <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
            <Stack spacing={2.5}>
              <TextField label="Task Title *" size="small" fullWidth
                value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <TextField label="Category *" size="small" fullWidth select
                value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField label="Location *" size="small" fullWidth select
                value={newLocation} onChange={(e) => setNewLocation(e.target.value)}>
                {LOCATIONS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </TextField>
              <TextField label="Suspension Duration" size="small" fullWidth select
                value={newDuration} onChange={(e) => setNewDuration(e.target.value)}
                helperText="Applies to bay-suspension tasks; ignored otherwise.">
                {DURATIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
              <Autocomplete options={boUsers} value={newAssignee}
                onChange={(_, v) => setNewAssignee(v)}
                renderInput={(p) => <TextField {...p} size="small" label="Assign To (optional)"
                  helperText="Leave empty to keep in Unassigned queue." />} />
              <TextField label="Comment" size="small" fullWidth multiline rows={3}
                value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            </Stack>
          </Box>
          <Stack direction="row" spacing={1} justifyContent="flex-end"
            sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="contained" disabled={!newTitle.trim()} onClick={createTask}>Create Task</Button>
          </Stack>
        </Stack>
      </Drawer>

      <Dialog open={!!evidenceTarget} onClose={() => setEvidenceTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Evidence — {evidenceTarget?.id}
          <IconButton onClick={() => setEvidenceTarget(null)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {evidenceTarget && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">Task</Typography>
                <Typography variant="body1" fontWeight={600}>{evidenceTarget.title}</Typography>
              </Box>
              <Stack direction="row" spacing={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Completed</Typography>
                  <Typography variant="body2">{evidenceTarget.closedDate || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Assignee</Typography>
                  <Typography variant="body2">{evidenceTarget.assignedTo || '—'}</Typography>
                </Box>
              </Stack>
              <Divider>Attachments ({evidenceTarget.attachments.length})</Divider>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {evidenceTarget.attachments.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No attachments.</Typography>
                )}
                {evidenceTarget.attachments.map((a) => (
                  <Chip key={a.name}
                    icon={a.kind === 'pdf' ? <PictureAsPdfIcon /> : (a.name.startsWith('photo') ? <PhotoCameraIcon /> : <PhotoLibraryIcon />)}
                    label={a.name} variant="outlined" clickable />
                ))}
              </Stack>
              <Divider>Notes ({evidenceTarget.notes.length})</Divider>
              {evidenceTarget.notes.length === 0
                ? <Typography variant="body2" color="text.secondary">No notes.</Typography>
                : evidenceTarget.notes.map((n) => (
                  <Box key={n.id} sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={600}>{n.author}</Typography>
                      <Typography variant="caption" color="text.secondary">{n.at}</Typography>
                    </Stack>
                    <Typography variant="body2">{n.text}</Typography>
                  </Box>
                ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEvidenceTarget(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={bulkCancel}
        title="Cancel Tasks?"
        message={`Are you sure you want to cancel ${selection.length} selected task${selection.length === 1 ? '' : 's'}?`}
        confirmLabel="Cancel Tasks"
        confirmColor="warning"
      />

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={bulkDelete}
        title="Delete Tasks?"
        message={`Are you sure you want to delete ${selection.length} selected task${selection.length === 1 ? '' : 's'}?`}
        confirmLabel="Delete"
        confirmColor="error"
      />
    </Box>
  );
}
