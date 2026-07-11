import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Drawer, IconButton, MenuItem, Stack, TextField, Typography, Divider, FormControlLabel, Checkbox,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';

type EmailTemplate = {
  id: string;
  templateName: string;
  permissionType: string;
  linkedEvents: string[];
  emailSubject: string;
  fromEmail: string;
  bodyHtml: string;
  isDefault: boolean;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
};

const MERGE_FIELDS = [
  '{{ApplicantName}}', '{{PermitReference}}', '{{ExpiryDate}}', '{{StartDate}}',
  '{{Zone}}', '{{Amount}}', '{{VehicleReg}}', '{{RejectionReason}}', '{{EndDate}}',
];

const LINKED_EVENTS = [
  'Reject The Application', 'Submit Application', 'Request Support Evidence',
  'Cancel', 'Suspend', 'Activate', 'Approve', 'Expiration Reminder',
  'Waiting for pay online by card', 'Insufficient funds for a pay',
  'Automatic Card Payment Failed', 'Waiting for pay cash', 'Reject Permit Changes',
  'VisitorDetails', 'Successful refund', 'Refund fail', 'Permit expired',
  'Approve Address Changes', 'Approve VRN Changes', 'Due To Be Closed - Non payment',
  'Due to be closed  - No documents received', 'Confirmation Link', 'Reset Link',
  'Reset Password', 'Visitor voucher activation (Applicant)',
  'Visitor voucher activation (Visitor)', 'Visitor voucher expire (Visitor)',
  'Payment card expiration', 'Submit Renewal', 'Forgotten UserName',
  'Submit Change of Vehicle', 'Visitor Permit Activation Email',
  'Application Form Email', 'Address Challenge Approved', 'Change Zone',
  'Change Address Challenge Approved', 'Pre-Approval Link',
  'Pre-Approval Submission', 'Temporary Vehicle Added', 'Temporary Vehicle removed',
  'White Mail Reminder',
];

const SENDER_EMAILS = [
  'noreply@mnps.gov.uk',
  'support@mnps.gov.uk',
  'permits@mnps.gov.uk',
  'admin@mnps.gov.uk',
];

const seed = (): EmailTemplate[] => [
  {
    id: 'EM-001', templateName: 'Application Received', permissionType: 'Resident Permit',
    linkedEvents: ['Submit Application'],
    emailSubject: 'Your resident permit application has been received',
    fromEmail: 'noreply@mnps.gov.uk',
    bodyHtml: '<p>Dear {{ApplicantName}},</p><p>We have received your application for a Resident Permit ({{PermitReference}})...</p>',
    isDefault: true,
    createdOn: '02/01/2024', createdBy: 'System Admin',
    updatedOn: '02/01/2024', updatedBy: 'System Admin',
  },
  {
    id: 'EM-002', templateName: 'Application Approved', permissionType: 'Resident Permit',
    linkedEvents: ['Approve'],
    emailSubject: 'Your permit has been approved',
    fromEmail: 'noreply@mnps.gov.uk',
    bodyHtml: '<p>Dear {{ApplicantName}},</p><p>Good news — your permit is now active from {{StartDate}} to {{EndDate}}.</p>',
    isDefault: true,
    createdOn: '02/01/2024', createdBy: 'System Admin',
    updatedOn: '10/03/2024', updatedBy: 'Sarah Johnson',
  },
  {
    id: 'EM-003', templateName: 'Application Rejected', permissionType: 'Business Permit',
    linkedEvents: ['Reject The Application'],
    emailSubject: 'Update on your permit application',
    fromEmail: 'noreply@mnps.gov.uk',
    bodyHtml: '<p>Dear {{ApplicantName}},</p><p>Unfortunately your application has not been approved. Reason: {{RejectionReason}}.</p>',
    isDefault: true,
    createdOn: '15/01/2024', createdBy: 'System Admin',
    updatedOn: '15/01/2024', updatedBy: 'System Admin',
  },
  {
    id: 'EM-004', templateName: 'Payment Failed', permissionType: 'Visitor Permit',
    linkedEvents: ['Automatic Card Payment Failed'],
    emailSubject: 'Payment for your permit could not be processed',
    fromEmail: 'noreply@mnps.gov.uk',
    bodyHtml: '<p>Dear {{ApplicantName}},</p><p>We were unable to process your payment. Please try again from your account.</p>',
    isDefault: false,
    createdOn: '20/02/2024', createdBy: 'Mark Peters',
    updatedOn: '20/02/2024', updatedBy: 'Mark Peters',
  },
  {
    id: 'EM-005', templateName: 'Renewal Reminder', permissionType: 'Resident Permit',
    linkedEvents: ['Expiration Reminder'],
    emailSubject: 'Your permit is due to expire soon',
    fromEmail: 'noreply@mnps.gov.uk',
    bodyHtml: '<p>Dear {{ApplicantName}},</p><p>Your permit expires on {{ExpiryDate}}. Renew now to avoid a lapse.</p>',
    isDefault: true,
    createdOn: '05/03/2024', createdBy: 'System Admin',
    updatedOn: '05/03/2024', updatedBy: 'System Admin',
  },
  {
    id: 'EM-006', templateName: 'White Mail Reminder', permissionType: 'All',
    linkedEvents: ['White Mail Reminder'],
    emailSubject: 'Physical permit ready for collection',
    fromEmail: 'permits@mnps.gov.uk',
    bodyHtml: '<p>Dear {{ApplicantName}},</p><p>Your physical permit is ready. Please collect from the office or wait for delivery.</p>',
    isDefault: true,
    createdOn: '10/04/2024', createdBy: 'System Admin',
    updatedOn: '10/04/2024', updatedBy: 'System Admin',
  },
];

export function EmailsPage() {
  const showToast = useToast();
  const [rows, setRows] = usePersistentState<EmailTemplate[]>('prototype:templates:emails:rows', seed);
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState<EmailTemplate | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);

  // Add template form state
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [newPermType, setNewPermType] = useState('Resident Permit');
  const [newSender, setNewSender] = useState('noreply@mnps.gov.uk');
  const [newDefault, setNewDefault] = useState(false);
  const [mergeFieldAnchor, setMergeFieldAnchor] = useState<HTMLElement | null>(null);

  const handleAddSave = () => {
    if (!newName.trim() || !newSubject.trim() || !newEvent) {
      showToast('Name, Subject and Linked Event are required', 'error');
      return;
    }
    // Check duplicate
    if (rows.some(r => r.templateName.toLowerCase() === newName.trim().toLowerCase() && r.permissionType === newPermType)) {
      showToast('Template name already exists', 'error');
      return;
    }
    const now = new Date().toLocaleDateString('en-GB');
    const newTemplate: EmailTemplate = {
      id: `EM-${Date.now()}`,
      templateName: newName.trim(),
      permissionType: newPermType,
      linkedEvents: [newEvent],
      emailSubject: newSubject.trim(),
      fromEmail: newSender,
      bodyHtml: newBody || `<p>${newSubject}</p>`,
      isDefault: newDefault,
      createdOn: now,
      createdBy: 'You',
      updatedOn: now,
      updatedBy: 'You',
    };
    // If set as default, unset other defaults for same event
    if (newDefault) {
      setRows((prev) => prev.map(r =>
        r.linkedEvents.includes(newEvent) ? { ...r, isDefault: false } : r
      ));
    }
    setRows((prev) => [newTemplate, ...prev]);
    showToast('Email template created successfully', 'success');
    setAddOpen(false);
    setNewName(''); setNewSubject(''); setNewBody(''); setNewEvent(''); setNewPermType('Resident Permit'); setNewSender('noreply@mnps.gov.uk'); setNewDefault(false);
  };

  const handleEditSave = () => {
    if (!target || !newName.trim() || !newSubject.trim() || !newEvent) {
      showToast('Name, Subject and Linked Event are required', 'error');
      return;
    }
    const now = new Date().toLocaleDateString('en-GB');
    // If set as default, unset other defaults for same event
    if (newDefault) {
      setRows((prev) => prev.map(r =>
        r.linkedEvents.includes(newEvent) && r.id !== target.id ? { ...r, isDefault: false } : r
      ));
    }
    setRows(rows.map((r) => r.id === target.id ? {
      ...r,
      templateName: newName.trim(),
      permissionType: newPermType,
      linkedEvents: [newEvent],
      emailSubject: newSubject.trim(),
      fromEmail: newSender,
      bodyHtml: newBody,
      isDefault: newDefault,
      updatedOn: now,
      updatedBy: 'You',
    } : r));
    showToast('Email template updated successfully', 'success');
    setEditOpen(false);
    setTarget(null);
  };

  const insertMergeField = (field: string) => {
    setNewBody(newBody + field);
    setMergeFieldAnchor(null);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      r.templateName.toLowerCase().includes(q) || r.permissionType.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const bulkSetDefault = () => {
    const ids = new Set(selection.map(String));
    showToast(`${ids.size} template(s) set as default`, 'success');
    setSelection([]);
  };

  const bulkDelete = () => {
    const ids = new Set(selection.map(String));
    setRows(rows.filter((r) => !ids.has(String(r.id))));
    setSelection([]);
    showToast(`${ids.size} template(s) deleted`, 'success');
  };

  const cols: GridColDef[] = [
    {
      field: 'templateName', headerName: 'Template Name', flex: 1.3, minWidth: 210,
      renderCell: (p) => (
        <Button size="small" variant="text" sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={() => setTarget(p.row as EmailTemplate)}>
          {p.value}
        </Button>
      ),
    },
    { field: 'permissionType', headerName: 'Permission Type', width: 170 },
    {
      field: 'linkedEvents', headerName: 'Linked Events', flex: 1, minWidth: 200,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {(p.value as string[]).map((e) => (
            <Chip key={e} label={e} size="small" color="secondary" variant="outlined" />
          ))}
        </Stack>
      ),
    },
    { field: 'emailSubject', headerName: 'Email Subject', flex: 1.4, minWidth: 260 },
    {
      field: 'isDefault', headerName: 'Default', width: 100,
      renderCell: (p) => p.value ? <Chip label="Default" size="small" color="primary" /> : null,
    },
    { field: 'createdOn', headerName: 'Created On', width: 130 },
    { field: 'createdBy', headerName: 'Created By', width: 160 },
    { field: 'updatedOn', headerName: 'Updated On', width: 130 },
    { field: 'updatedBy', headerName: 'Updated By', width: 160 },
  ];

  return (
    <Box>
      <PageHeader eyebrow="Templates" title="Emails"
        description="Email templates linked to permission events."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
            Add Template
          </Button>
        }
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }} alignItems="center">
        <TextField size="small" placeholder="Search by Template Name, Permission Type"
          value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 320 }} />
        <Box sx={{ flex: 1 }} />
        {selection.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {selection.length} Row Selected
            </Typography>
            <Button variant="outlined" onClick={bulkSetDefault}>Set Default</Button>
            <Button variant="outlined" color="error" onClick={bulkDelete}>Delete</Button>
          </>
        )}
      </Stack>

      <Box sx={{ height: 560, bgcolor: 'background.paper', borderRadius: 1 }}>
        <DataGrid rows={filtered} columns={cols} getRowId={(r) => r.id} density="compact"
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection disableRowSelectionOnClick
          rowSelectionModel={selection}
          onRowSelectionModelChange={setSelection} />
      </Box>

      <Drawer anchor="right" open={!!target} onClose={() => setTarget(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 720 } } }}>
        {target && (
          <Stack sx={{ height: '100%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between"
              sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Typography variant="h6">View Email Template</Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined" onClick={() => {
                  setNewName(target.templateName);
                  setNewPermType(target.permissionType);
                  setNewEvent(target.linkedEvents[0]);
                  setNewSubject(target.emailSubject);
                  setNewBody(target.bodyHtml);
                  setNewSender(target.fromEmail);
                  setNewDefault(target.isDefault);
                  setEditOpen(true);
                }}>Edit</Button>
                <IconButton onClick={() => setTarget(null)}><CloseIcon /></IconButton>
              </Stack>
            </Stack>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Template Name</Typography>
                  <Typography variant="body1" fontWeight={600}>{target.templateName}</Typography>
                </Box>
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Permission Type</Typography>
                    <Typography variant="body2">{target.permissionType}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">From</Typography>
                    <Typography variant="body2">{target.fromEmail}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Default</Typography>
                    <Typography variant="body2">{target.isDefault ? 'Yes' : 'No'}</Typography>
                  </Box>
                </Stack>
                <Box>
                  <Typography variant="caption" color="text.secondary">Linked Events</Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                    {target.linkedEvents.map((e) => (
                      <Chip key={e} label={e} size="small" color="secondary" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email Subject</Typography>
                  <Typography variant="body2">{target.emailSubject}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Body</Typography>
                  <Box sx={{ mt: 1, p: 2, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'grey.50' }}
                    dangerouslySetInnerHTML={{ __html: target.bodyHtml }} />
                </Box>
                <Divider />
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography variant="body2">{target.createdOn} · {target.createdBy}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Updated</Typography>
                    <Typography variant="body2">{target.updatedOn} · {target.updatedBy}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        )}
      </Drawer>

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Email Template</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Template Name" required fullWidth value={newName} onChange={(e) => setNewName(e.target.value)} />
            <TextField
              select label="Permission Type" fullWidth
              value={newPermType} onChange={(e) => setNewPermType(e.target.value)}
            >
              {['Resident Permit','Business Permit','Visitor Permit','Blue Badge Permit','All'].map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>
            <TextField
              select label="Sender Email" fullWidth
              value={newSender} onChange={(e) => setNewSender(e.target.value)}
            >
              {SENDER_EMAILS.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField
              select label="Notification Template (Linked Event)" required fullWidth
              value={newEvent} onChange={(e) => {
                setNewEvent(e.target.value);
                // Auto-enable default if it's the first template for this event
                const hasDefault = rows.some(r => r.linkedEvents.includes(e.target.value) && r.isDefault);
                if (!hasDefault) setNewDefault(true);
              }}
            >
              {LINKED_EVENTS.map((ev) => (
                <MenuItem key={ev} value={ev}>{ev}</MenuItem>
              ))}
            </TextField>
            <TextField label="Email Subject" required fullWidth value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2">Body</Typography>
                <Button size="small" onClick={(e) => setMergeFieldAnchor(e.currentTarget)}>
                  Insert Merge Field
                </Button>
              </Stack>
              <TextField
                multiline rows={6} fullWidth
                value={newBody} onChange={(e) => setNewBody(e.target.value)}
                placeholder="<p>Dear {{ApplicantName}},</p>"
              />
              <MenuItem />
              {mergeFieldAnchor && (
                <Dialog open={!!mergeFieldAnchor} onClose={() => setMergeFieldAnchor(null)} maxWidth="xs" fullWidth>
                  <DialogTitle>Insert Merge Field</DialogTitle>
                  <DialogContent>
                    <Stack spacing={0.5}>
                      {MERGE_FIELDS.map((field) => (
                        <Button key={field} fullWidth sx={{ justifyContent: 'flex-start' }}
                          onClick={() => insertMergeField(field)}>
                          {field}
                        </Button>
                      ))}
                    </Stack>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setMergeFieldAnchor(null)}>Close</Button>
                  </DialogActions>
                </Dialog>
              )}
            </Box>
            <FormControlLabel
              control={<Checkbox checked={newDefault} onChange={(e) => setNewDefault(e.target.checked)} />}
              label="Set as default template for this event"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSave}>Create Template</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Email Template</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Template Name" required fullWidth value={newName} onChange={(e) => setNewName(e.target.value)} />
            <TextField
              select label="Permission Type" fullWidth
              value={newPermType} onChange={(e) => setNewPermType(e.target.value)}
            >
              {['Resident Permit','Business Permit','Visitor Permit','Blue Badge Permit','All'].map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>
            <TextField
              select label="Sender Email" fullWidth
              value={newSender} onChange={(e) => setNewSender(e.target.value)}
            >
              {SENDER_EMAILS.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField
              select label="Notification Template (Linked Event)" required fullWidth
              value={newEvent} onChange={(e) => setNewEvent(e.target.value)}
            >
              {LINKED_EVENTS.map((ev) => (
                <MenuItem key={ev} value={ev}>{ev}</MenuItem>
              ))}
            </TextField>
            <TextField label="Email Subject" required fullWidth value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2">Body</Typography>
                <Button size="small" onClick={(e) => setMergeFieldAnchor(e.currentTarget)}>
                  Insert Merge Field
                </Button>
              </Stack>
              <TextField
                multiline rows={6} fullWidth
                value={newBody} onChange={(e) => setNewBody(e.target.value)}
              />
            </Box>
            <FormControlLabel
              control={<Checkbox checked={newDefault} onChange={(e) => setNewDefault(e.target.checked)} />}
              label="Set as default template for this event"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
