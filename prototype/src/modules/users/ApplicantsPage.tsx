import {
  Box, Button, Drawer, IconButton, InputAdornment, MenuItem, Paper, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, Typography, Divider, Grid, Chip, FormControlLabel, Switch, Card, CardContent,
} from '@mui/material';
import {
  Search, AddOutlined, EmailOutlined, LockResetOutlined, EditOutlined, DeleteOutlineOutlined, DownloadOutlined,
  UploadFileOutlined, PreviewOutlined, MoreVertOutlined, DirectionsCarOutlined,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { PageHeader } from '../../shared/PageHeader';
import { StatusChip } from '../../shared/StatusChip';
import { tokens } from '../../theme';
import { useToast } from '../../components/Toast';
import { AddVehicleDialog } from '../../components/dialogs/AddVehicleDialog';
import { UploadDocumentDialog } from '../../components/dialogs/UploadDocumentDialog';
import { ComposeEmailDialog } from '../../components/dialogs/ComposeEmailDialog';
import { AddBlueBadgeDialog } from '../../components/dialogs/AddBlueBadgeDialog';
import { ConfirmDialog } from '../../components/dialogs/ConfirmDialog';
import { FIELD_LIMITS } from '../../constants/enums';

type Applicant = {
  id: string;
  firstName: string;
  lastName: string;
  contact: string;
  email: string;
  dob: string;
  status: 'Active' | 'Inactive' | 'Verification Pending';
  blueBadge: boolean;
};

const FIRST = ['Alice','Ben','Cheryl','Danny','Eesha','Frank','Grace','Harjeet','Isla','James','Kim','Lena','Marcus','Nina','Oliver','Pippa','Quentin','Rohit','Sofia','Tomas'];
const LAST  = ['Whittaker','Turner','Iyer','O\'Neill','Patel','Bell','Adeyemi','Singh','Robertson','Coates','Lorenzo','Kowalski','Reid','Gauthier','Kwan','Bracknell','Ash','Sharma','Marín','Vetter'];

const APPLICANTS: Applicant[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `AP-${1000 + i}`,
  firstName: FIRST[i % FIRST.length],
  lastName: LAST[(i * 3) % LAST.length],
  contact: `+44 7700 900${String(100 + i).slice(-3)}`,
  email: `${FIRST[i % FIRST.length].toLowerCase()}.${LAST[(i * 3) % LAST.length].toLowerCase().replace(/[^a-z]/g, '')}@example.co.uk`,
  dob: `19${70 + (i % 30)}-0${1 + (i % 9)}-${String(1 + (i % 27)).padStart(2, '0')}`,
  status: (i % 13 === 0 ? 'Verification Pending' : i % 7 === 0 ? 'Inactive' : 'Active') as any,
  blueBadge: i % 9 === 0,
}));

export function ApplicantsPage() {
  const showToast = useToast();
  const [allRows, setAllRows] = usePersistentState<Applicant[]>('prototype:users:applicants:rows', () => [...APPLICANTS]);
  const [blueBadgeEnabled] = usePersistentState<boolean>('prototype:contract-settings:blue-badge', true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [tab, setTab] = useState('overview');
  const [broadcastEmailOpen, setBroadcastEmailOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [redactConfirmOpen, setRedactConfirmOpen] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);

  const rows = useMemo(() => allRows.filter((a) =>
    (status === 'All' || a.status === status) &&
    (q === '' || `${a.firstName} ${a.lastName}`.toLowerCase().includes(q.toLowerCase()) || a.email.toLowerCase().includes(q.toLowerCase()) || a.contact.includes(q))
  ), [allRows, q, status]);

  const cols: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', flex: 1, minWidth: 140 },
    { field: 'lastName',  headerName: 'Last Name',  flex: 1, minWidth: 140 },
    { field: 'contact',   headerName: 'Contact Number', width: 170 },
    { field: 'email',     headerName: 'Email Address', flex: 1.4, minWidth: 250 },
    { field: 'dob',       headerName: 'Date of Birth', width: 130 },
    { field: 'status',    headerName: 'Status', width: 130, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'actions',   headerName: 'Actions', width: 160, sortable: false, renderCell: (p) => (
      <Stack direction="row" spacing={0.25} onClick={(e) => e.stopPropagation()}>
        <IconButton size="small" title="Edit" onClick={() => setSelected(p.row)}><EditOutlined fontSize="small" /></IconButton>
        <IconButton size="small" title="Reset Password"><LockResetOutlined fontSize="small" /></IconButton>
        <IconButton size="small" title="Send Email"><EmailOutlined fontSize="small" /></IconButton>
        <IconButton size="small" title="More"><MoreVertOutlined fontSize="small" /></IconButton>
      </Stack>
    ) },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Users"
        title="Applicants"
        description="Customers who apply for permits via the portal or in person."
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<EmailOutlined />} onClick={() => setBroadcastEmailOpen(true)}>Broadcast Email</Button>
            <Button variant="outlined" startIcon={<LockResetOutlined />} onClick={() => setResetPasswordOpen(true)}>Reset Password</Button>
            <Button variant="contained" startIcon={<AddOutlined />} onClick={() => setAddOpen(true)}>New Applicant</Button>
          </Stack>
        }
      />
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField placeholder="Search by name, email or contact" value={q} onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} sx={{ flex: 1 }} />
          <TextField select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 180 }} label="Status">
            {['All','Active','Inactive','Verification Pending'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Stack>
      </Paper>
      
      {selection.length > 0 && (
        <Card sx={{ mb: 2, bgcolor: '#EAF3FB' }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ fontWeight: 600, color: '#0D3E66' }}>
                {selection.length} row(s) selected
              </Typography>
              <Button variant="outlined" size="small" startIcon={<EmailOutlined />} onClick={() => { showToast(`Email sent to ${selection.length} applicant(s)`, 'success'); setSelection([]); }}>Email All</Button>
              <Button variant="outlined" size="small" startIcon={<LockResetOutlined />} onClick={() => { showToast(`Password reset for ${selection.length} applicant(s)`, 'success'); setSelection([]); }}>Reset Password</Button>
              <Button variant="outlined" size="small" color="warning" onClick={() => setRedactConfirmOpen(true)}>Redact</Button>
              <Button variant="outlined" size="small" color="error" startIcon={<DeleteOutlineOutlined />} onClick={() => { setAllRows((prev) => prev.filter((r) => !selection.includes(r.id))); showToast(`${selection.length} applicant(s) deleted`, 'success'); setSelection([]); }}>Delete</Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Paper>
        <Box sx={{ height: 520 }}>
          <DataGrid
            rows={rows} columns={cols}
            onRowClick={(p) => { setSelected(p.row as Applicant); setTab('overview'); }}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            checkboxSelection
            rowSelectionModel={selection}
            onRowSelectionModelChange={(newSel) => { setSelection(newSel); setSelected(null); }}
          />
        </Box>
      </Paper>

      {/* Detail panel — mirrors real app's row-click expansion */}
      {selected && (
        <Paper sx={{ mt: 2 }}>
          <Box sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" sx={{ color: tokens.MUTED, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Applicant · {selected.id}
                </Typography>
                <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.3rem', color: tokens.INK, mt: 0.5 }}>
                  {selected.firstName} {selected.lastName}
                </Typography>
                <Typography sx={{ color: tokens.MUTED }}>{selected.email}</Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <StatusChip status={selected.status} />
                    <ApplicantEmailButton email={selected.email} />
                    <ApplicantResetButton />
                <Button variant="contained" startIcon={<EditOutlined />} onClick={() => showToast(`${selected.firstName} ${selected.lastName} updated successfully`, 'success')}>Edit</Button>
              </Stack>
            </Stack>
          </Box>
          <Divider />
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
            <Tab value="overview" label="Overview" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
            <Tab value="application" label="Applications" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
            {blueBadgeEnabled && <Tab value="bluebadge" label="Blue Badges" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />}
            <Tab value="vehicles" label="Vehicles" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
            <Tab value="documents" label="Documents" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
            <Tab value="emails" label="Email History" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
            <Tab value="audit" label="Audit Log" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
          </Tabs>
          <Box sx={{ p: 2.5 }}>
            {tab === 'overview' && <OverviewPane a={selected} setApplicant={(updates) => setSelected({ ...selected, ...updates })} />}
            {tab === 'application' && <ApplicationsPane />}
            {blueBadgeEnabled && tab === 'bluebadge' && <BlueBadgePane hasBadge={selected.blueBadge} />}
            {tab === 'vehicles' && <VehiclesPane />}
            {tab === 'documents' && <DocumentsPane />}
            {tab === 'emails' && <EmailsPane />}
            {tab === 'audit' && <AuditPane />}
          </Box>
        </Paper>
      )}

      {/* Add Applicant Drawer */}
      <Drawer anchor="right" open={addOpen} onClose={() => setAddOpen(false)} PaperProps={{ sx: { width: { xs:'100%', sm: 560, md: 640 } } }}>
        <AddApplicantDrawer
          onClose={() => setAddOpen(false)}
          onSave={(a) => {
            setAllRows((prev) => [{ ...a, id: `AP-${Date.now()}` }, ...prev]);
            showToast('Applicant created successfully', 'success');
          }}
        />
      </Drawer>

      <ComposeEmailDialog
        open={broadcastEmailOpen}
        onClose={() => setBroadcastEmailOpen(false)}
        isBroadcast={true}
        onSave={() => showToast('Broadcast email sent', 'success')}
      />
      <ConfirmDialog
        open={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        onConfirm={() => showToast('Password reset link sent', 'success')}
        title="Reset password?"
        message="An email with reset instructions will be sent to the applicant."
        confirmLabel="Send reset link"
      />
      <ConfirmDialog
        open={redactConfirmOpen}
        onClose={() => setRedactConfirmOpen(false)}
        onConfirm={() => { showToast(`${selection.length} applicant(s) redacted`, 'success'); setSelection([]); setRedactConfirmOpen(false); }}
        title="Redact applicants?"
        message={`This will permanently redact personal data for ${selection.length} applicant(s). This action cannot be undone.`}
        confirmLabel="Redact"
      />
    </>
  );
}

/* -------- Detail panes -------- */

function ApplicantEmailButton({ email }: { email: string }) {
  const showToast = useToast();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" startIcon={<EmailOutlined />} onClick={() => setOpen(true)}>Send Email</Button>
      <ComposeEmailDialog open={open} onClose={() => setOpen(false)} defaultTo={email} onSave={() => showToast('Email sent', 'success')} />
    </>
  );
}

function ApplicantResetButton() {
  const showToast = useToast();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" startIcon={<LockResetOutlined />} onClick={() => setOpen(true)}>Reset Password</Button>
      <ConfirmDialog open={open} onClose={() => setOpen(false)} onConfirm={() => showToast('Password reset link sent', 'success')}
        title="Reset password?" message="An email with reset instructions will be sent to the applicant." confirmLabel="Send reset link" />
    </>
  );
}

function OverviewPane({ a, setApplicant }: { a: Applicant; setApplicant: (updates: Partial<Applicant>) => void }) {
  const showToast = useToast();
  const [editBlueBadgeOpen, setEditBlueBadgeOpen] = useState(false);
  return (
    <>
      <Grid container spacing={2}>
        <Fact label="Full name" value={`${a.firstName} ${a.lastName}`} />
        <Fact label="User name" value={a.email.split('@')[0]} />
        <Fact label="Email" value={a.email} />
        <Fact label="Contact" value={a.contact} />
        <Fact label="Date of birth" value={a.dob} />
        <Fact label="Applicant type" value="Resident" />
        <Fact label="Correspondence address" value="Flat 12, Riverside Walk, CC1 3AA" />
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="caption" sx={{ color: tokens.MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Blue Badge</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
            <Typography>{a.blueBadge ? 'Yes' : 'No'}</Typography>
            {a.blueBadge && (
              <Button size="small" variant="text" onClick={() => setEditBlueBadgeOpen(true)}>Edit Badge</Button>
            )}
          </Stack>
        </Grid>
        <Fact label="Experian pass" value="Passed" />
        <Fact label="Registered on" value="2025-11-14" />
        <Fact label="Last login" value="2026-06-30 08:12" />
      </Grid>
      {a.blueBadge && (
        <AddBlueBadgeDialog
          open={editBlueBadgeOpen}
          onClose={() => setEditBlueBadgeOpen(false)}
          onSave={(b) => {
            showToast('Blue badge updated', 'success');
            setEditBlueBadgeOpen(false);
          }}
        />
      )}
    </>
  );
}

function ApplicationsPane() {
  const rows = [
    ['AP-2026-1001', 'City Centre Resident 2026', 'Permit', '2026-06-24', <StatusChip status="Active" />, '£120.00'],
    ['AP-2026-0942', 'Visitor Book (25 hrs)',    'Permit', '2026-04-10', <StatusChip status="Expired" />, '£25.00'],
  ];
  return <SimpleTable columns={['Reference','Permission','Type','Submitted','Status','Amount']} rows={rows} />;
}

function BlueBadgePane({ hasBadge }: { hasBadge: boolean }) {
  const showToast = useToast();
  const [open, setOpen] = useState(false);
  const [badges, setBadges] = useState(hasBadge ? [{ no: 'BB-8821', issue: '2024-01-15', expiry: '2027-01-14' }] : [] as { no: string; issue: string; expiry: string }[]);
  return (
    <>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button variant="contained" startIcon={<AddOutlined />} onClick={() => setOpen(true)}>Add Blue Badge</Button>
      </Stack>
      <SimpleTable columns={['Badge No','Issue Date','Expiry Date','Status','Actions']}
        rows={badges.map((b) => [b.no, b.issue, b.expiry, <StatusChip status="Active" />,
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small"><EditOutlined fontSize="small" /></IconButton>
            <IconButton size="small"><DeleteOutlineOutlined fontSize="small" /></IconButton>
          </Stack>
        ])} />
      <AddBlueBadgeDialog open={open} onClose={() => setOpen(false)} onSave={(b) => {
        setBadges((prev) => [...prev, { no: b.badgeNumber, issue: b.issueDate, expiry: b.expiryDate }]);
        showToast('Blue badge added', 'success');
      }} />
    </>
  );
}

function VehiclesPane() {
  const showToast = useToast();
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [addTempOpen, setAddTempOpen] = useState(false);
  const [editVehicleOpen, setEditVehicleOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [vehicles, setVehicles] = useState([
    { vrm: 'AB19 XYZ', type: 'Standard', desc: 'Silver Ford Focus',    nick: 'Focus daily',   date: '2026-06-01 09:22', make: 'Ford', model: 'Focus', colour: 'Silver' },
    { vrm: 'BC22 CDE', type: 'Standard', desc: 'White Tesla Model 3',  nick: 'Tesla',         date: '2026-05-11 12:41', make: 'Tesla', model: 'Model 3', colour: 'White' },
    { vrm: 'TMP LOAN', type: 'Temporary', desc: 'Black BMW 3 Series (loaner)', nick: 'Loaner', date: '2026-06-15 10:04', make: 'BMW', model: '3 Series', colour: 'Black' },
  ]);
  return (
    <>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }} spacing={1}>
        <Button variant="outlined" startIcon={<DirectionsCarOutlined />} onClick={() => setAddTempOpen(true)}>Temporary Vehicle</Button>
        <Button variant="contained" startIcon={<AddOutlined />} onClick={() => setAddVehicleOpen(true)}>Add Vehicle</Button>
      </Stack>
      <SimpleTable columns={['Vehicle number (VRM)','Type','Color, Make, Model','Nick name','Last added date/time','Actions']}
        rows={vehicles.map((v) => [v.vrm, v.type, v.desc, v.nick, v.date,
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={() => { setEditingVehicle(v); setEditVehicleOpen(true); }}><EditOutlined fontSize="small" /></IconButton>
            <IconButton size="small" onClick={() => { setVehicles((prev) => prev.filter((x) => x.vrm !== v.vrm)); showToast('Vehicle deleted', 'success'); }}><DeleteOutlineOutlined fontSize="small" /></IconButton>
          </Stack>])} />
      <AddVehicleDialog open={addVehicleOpen} onClose={() => setAddVehicleOpen(false)} onSave={(v) => {
        setVehicles((prev) => [...prev, { vrm: v.vrm, type: 'Standard', desc: `${v.colour} ${v.make} ${v.model}`, nick: v.vrm, date: new Date().toLocaleString('en-GB'), make: v.make, model: v.model, colour: v.colour }]);
        showToast('Vehicle added', 'success');
      }} />
      <AddVehicleDialog title="Add Temporary Vehicle" defaultTemporary={true} open={addTempOpen} onClose={() => setAddTempOpen(false)} onSave={(v) => {
        setVehicles((prev) => [...prev, { vrm: v.vrm, type: 'Temporary', desc: `${v.colour} ${v.make} ${v.model}`, nick: v.vrm, date: new Date().toLocaleString('en-GB'), make: v.make, model: v.model, colour: v.colour }]);
        showToast('Temporary vehicle added', 'success');
      }} />
      {editingVehicle && (
        <AddVehicleDialog
          title="Edit Vehicle"
          open={editVehicleOpen}
          onClose={() => { setEditVehicleOpen(false); setEditingVehicle(null); }}
          initial={{ vrm: editingVehicle.vrm, make: editingVehicle.make, model: editingVehicle.model, colour: editingVehicle.colour, fuelType: '', vehicleType: '' }}
          onSave={(v) => {
            setVehicles((prev) => prev.map((x) => x.vrm === editingVehicle.vrm ? { ...x, vrm: v.vrm, desc: `${v.colour} ${v.make} ${v.model}`, make: v.make, model: v.model, colour: v.colour } : x));
            showToast('Vehicle updated', 'success');
            setEditingVehicle(null);
          }}
        />
      )}
    </>
  );
}

function DocumentsPane() {
  const showToast = useToast();
  const [open, setOpen] = useState(false);
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [replacingDoc, setReplacingDoc] = useState<any>(null);
  const [docs, setDocs] = useState([
    { name: 'Proof of Address.pdf', type: 'Proof of Address', date: '2026-06-24', size: '212 KB', status: 'Approved' },
    { name: 'Utility Bill.pdf',    type: 'Proof of Address', date: '2026-05-30', size: '198 KB', status: 'Approved' },
  ]);
  return (
    <>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button variant="contained" startIcon={<UploadFileOutlined />} onClick={() => setOpen(true)}>Add Document</Button>
      </Stack>
      <SimpleTable columns={['File Name','Document Type','Uploaded','Size','Status','Actions']}
        rows={docs.map((d) => [d.name, d.type, d.date, d.size, <StatusChip status={d.status} />,
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={() => showToast('Download started', 'success')}><DownloadOutlined fontSize="small" /></IconButton>
            <IconButton size="small"><PreviewOutlined fontSize="small" /></IconButton>
            <IconButton size="small" onClick={() => { setReplacingDoc(d); setReplaceOpen(true); }} title="Replace"><UploadFileOutlined fontSize="small" /></IconButton>
            <IconButton size="small" onClick={() => { setDocs((prev) => prev.filter((x) => x.name !== d.name)); showToast('Document deleted', 'success'); }}><DeleteOutlineOutlined fontSize="small" /></IconButton>
          </Stack>])} />
      <UploadDocumentDialog open={open} onClose={() => setOpen(false)} onSave={(d) => {
        setDocs((prev) => [...prev, { name: d.fileName, type: d.type, date: new Date().toLocaleDateString('en-GB'), size: d.size, status: 'Pending' }]);
        showToast('Document uploaded', 'success');
      }} />
      {replacingDoc && (
        <UploadDocumentDialog
          open={replaceOpen}
          onClose={() => { setReplaceOpen(false); setReplacingDoc(null); }}
          onSave={(d) => {
            setDocs((prev) => prev.map((x) => x.name === replacingDoc.name ? { ...x, name: d.fileName, size: d.size, date: new Date().toLocaleDateString('en-GB'), status: 'Pending' } : x));
            showToast('Document replaced', 'success');
            setReplacingDoc(null);
          }}
        />
      )}
    </>
  );
}

function EmailsPane() {
  const showToast = useToast();
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState([
    { sent: '2026-06-25 14:08', subject: 'Application received',      status: 'Delivered' },
    { sent: '2026-06-14 09:22', subject: 'Password reset link',       status: 'Delivered' },
    { sent: '2026-05-30 10:03', subject: 'Renewal reminder — 30 days', status: 'Opened' },
  ]);
  return (
    <>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button variant="contained" startIcon={<EmailOutlined />} onClick={() => setOpen(true)}>Send Email</Button>
      </Stack>
      <SimpleTable columns={['Sent','Subject','Status','Actions']}
        rows={emails.map((e) => [e.sent, e.subject, e.status, <IconButton size="small"><PreviewOutlined fontSize="small" /></IconButton>])} />
      <ComposeEmailDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={(e) => {
          setEmails((prev) => [...prev, { sent: new Date().toLocaleString('en-GB'), subject: e.subject, status: 'Sent' }]);
          showToast('Email sent', 'success');
        }}
        onSaveDraft={(e) => {
          showToast('Email saved as draft', 'success');
        }}
      />
    </>
  );
}

function AuditPane() {
  return <SimpleTable columns={['When','User','Event','Entity','Details']} rows={[
    ['2026-06-25 14:08', 'System',      'Applicant Updated', 'Contact',  'Phone number changed'],
    ['2026-06-14 09:22', 'System',      'Password Reset',    'Account',  'Reset link sent'],
    ['2025-11-14 08:00', 'Self (portal)','Applicant Created', 'Account',  'New registration'],
  ]} />;
}

/* -------- Add Applicant Drawer -------- */

function AddApplicantDrawer({ onClose, onSave }: { onClose: () => void; onSave: (a: Omit<Applicant, 'id'>) => void }) {
  const showToast = useToast();
  const [experian, setExperian] = useState(false);
  const [paperReminder, setPaperReminder] = useState(false);
  const [dataSharingPolicy, setDataSharingPolicy] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [dob, setDob] = useState('');
  const [blueBadge, setBlueBadge] = useState(false);

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      showToast('First Name, Last Name and Email are required', 'error');
      return;
    }
    if (!dataSharingPolicy) {
      showToast('Please agree to the data sharing policy', 'error');
      return;
    }
    onSave({ firstName, lastName, email, contact, dob, status: 'Verification Pending', blueBadge });
    onClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${tokens.LINE}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.15rem' }}>Add Applicant</Typography>
        <Button onClick={onClose}>Close</Button>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        <Grid container spacing={2}>
          <FormItem label="Applicant type">
            <TextField select fullWidth defaultValue="Resident">
              {['Resident','Visitor','Business','Blue Badge'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </FormItem>
          <FormItem label="Title">
            <TextField select fullWidth defaultValue="">
              <MenuItem value="">Select</MenuItem>
              {['Mr','Mrs','Miss','Ms','Dr'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </FormItem>
          <FormItem label="First Name" required>
            <TextField placeholder="Enter First Name" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} inputProps={{ maxLength: FIELD_LIMITS.FIRST_NAME }} />
          </FormItem>
          <FormItem label="Last Name" required>
            <TextField placeholder="Enter Last Name" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} inputProps={{ maxLength: FIELD_LIMITS.LAST_NAME }} />
          </FormItem>
          <FormItem label="User Name" required><TextField placeholder="Enter User Name" fullWidth /></FormItem>
          <FormItem label="Email" required>
            <TextField type="email" placeholder="Enter Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} inputProps={{ maxLength: FIELD_LIMITS.EMAIL }} />
          </FormItem>
          <FormItem label="Contact Number">
            <TextField type="tel" placeholder="+44 7700 900 000" fullWidth value={contact} onChange={(e) => setContact(e.target.value)} inputProps={{ maxLength: FIELD_LIMITS.MOBILE_NUMBER }} />
          </FormItem>
          <FormItem label="Date of Birth">
            <TextField type="date" InputLabelProps={{ shrink: true }} fullWidth value={dob} onChange={(e) => setDob(e.target.value)} />
          </FormItem>
          <FormItem label="Correspondence address" full><TextField placeholder="Enter address" fullWidth multiline minRows={2} /></FormItem>
          <FormItem label="Blue Badge" full>
            <FormControlLabel control={<Switch checked={blueBadge} onChange={(e) => setBlueBadge(e.target.checked)} />} label="Applicant holds a Blue Badge" />
          </FormItem>
          <FormItem label="Experian check" full>
            <FormControlLabel control={<Switch checked={experian} onChange={(e) => setExperian(e.target.checked)} />} label="Run Experian address & identity check on save" />
          </FormItem>
          <FormItem label="Paper reminder" full>
            <FormControlLabel control={<Switch checked={paperReminder} onChange={(e) => setPaperReminder(e.target.checked)} />} label="Send permit renewal reminders by post" />
          </FormItem>
          <FormItem label="Data sharing policy" full required>
            <FormControlLabel control={<Switch checked={dataSharingPolicy} onChange={(e) => setDataSharingPolicy(e.target.checked)} />} label="I agree to the data sharing policy" />
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: tokens.MUTED }}>
              View <a href="/data-policy" target="_blank" rel="noopener noreferrer">data sharing policy</a>
            </Typography>
          </FormItem>
        </Grid>
      </Box>
      <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${tokens.LINE}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Add Applicant</Button>
      </Box>
    </Box>
  );
}

/* -------- Shared -------- */

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="caption" sx={{ color: tokens.MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ mt: 0.25 }}>{value}</Typography>
    </Grid>
  );
}

function FormItem({ label, children, required, full }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean }) {
  return (
    <Grid item xs={12} sm={full ? 12 : 6}>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: tokens.INK, mb: 0.75 }}>
        {label}{required && <Typography component="span" sx={{ color: '#C62828', ml: 0.5 }}>*</Typography>}
      </Typography>
      {children}
    </Grid>
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
