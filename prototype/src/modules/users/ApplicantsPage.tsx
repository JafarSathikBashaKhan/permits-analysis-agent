import {
  Box, Button, Drawer, IconButton, InputAdornment, MenuItem, Paper, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, Typography, Divider, Grid, Chip, FormControlLabel, Switch,
} from '@mui/material';
import {
  Search, AddOutlined, EmailOutlined, LockResetOutlined, EditOutlined, DeleteOutlineOutlined, DownloadOutlined,
  UploadFileOutlined, PreviewOutlined, MoreVertOutlined, DirectionsCarOutlined,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { PageHeader } from '../../shared/PageHeader';
import { StatusChip } from '../../shared/StatusChip';
import { tokens } from '../../theme';
import { useToast } from '../../components/Toast';

type Applicant = {
  id: string;
  firstName: string;
  lastName: string;
  contact: string;
  email: string;
  dob: string;
  status: 'Active' | 'Inactive' | 'Blocked';
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
  status: (i % 11 === 0 ? 'Blocked' : i % 7 === 0 ? 'Inactive' : 'Active') as any,
  blueBadge: i % 9 === 0,
}));

export function ApplicantsPage() {
  const showToast = useToast();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [tab, setTab] = useState('overview');

  const rows = useMemo(() => APPLICANTS.filter((a) =>
    (status === 'All' || a.status === status) &&
    (q === '' || `${a.firstName} ${a.lastName}`.toLowerCase().includes(q.toLowerCase()) || a.email.toLowerCase().includes(q.toLowerCase()) || a.contact.includes(q))
  ), [q, status]);

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
            <Button variant="outlined" startIcon={<EmailOutlined />} onClick={() => showToast('Broadcast email coming soon', 'info')}>Broadcast Email</Button>
            <Button variant="outlined" startIcon={<LockResetOutlined />} onClick={() => showToast('Password reset — coming soon', 'info')}>Reset Password</Button>
            <Button variant="contained" startIcon={<AddOutlined />} onClick={() => setAddOpen(true)}>New Applicant</Button>
          </Stack>
        }
      />
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField placeholder="Search by name, email or contact" value={q} onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} sx={{ flex: 1 }} />
          <TextField select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 180 }} label="Status">
            {['All','Active','Inactive','Blocked'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Stack>
      </Paper>
      <Paper>
        <Box sx={{ height: 520 }}>
          <DataGrid
            rows={rows} columns={cols}
            onRowClick={(p) => { setSelected(p.row as Applicant); setTab('overview'); }}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            checkboxSelection
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
                <Button variant="outlined" startIcon={<EmailOutlined />} onClick={() => showToast('Compose email dialog coming soon', 'info')}>Send Email</Button>
                <Button variant="outlined" startIcon={<LockResetOutlined />} onClick={() => showToast('Password reset — coming soon', 'info')}>Reset Password</Button>
                <Button variant="contained" startIcon={<EditOutlined />} onClick={() => showToast('Edit form coming soon', 'info')}>Edit</Button>
              </Stack>
            </Stack>
          </Box>
          <Divider />
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
            <Tab value="overview" label="Overview" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
            <Tab value="application" label="Applications" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
            <Tab value="bluebadge" label="Blue Badges" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
            <Tab value="vehicles" label="Vehicles" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
            <Tab value="documents" label="Documents" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
            <Tab value="emails" label="Email History" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
            <Tab value="audit" label="Audit Log" sx={{ minHeight: 52, textTransform: 'none', fontWeight: 600 }} />
          </Tabs>
          <Box sx={{ p: 2.5 }}>
            {tab === 'overview' && <OverviewPane a={selected} />}
            {tab === 'application' && <ApplicationsPane />}
            {tab === 'bluebadge' && <BlueBadgePane hasBadge={selected.blueBadge} />}
            {tab === 'vehicles' && <VehiclesPane />}
            {tab === 'documents' && <DocumentsPane />}
            {tab === 'emails' && <EmailsPane />}
            {tab === 'audit' && <AuditPane />}
          </Box>
        </Paper>
      )}

      {/* Add Applicant Drawer */}
      <Drawer anchor="right" open={addOpen} onClose={() => setAddOpen(false)} PaperProps={{ sx: { width: { xs:'100%', sm: 560, md: 640 } } }}>
        <AddApplicantDrawer onClose={() => setAddOpen(false)} />
      </Drawer>
    </>
  );
}

/* -------- Detail panes -------- */

function OverviewPane({ a }: { a: Applicant }) {
  return (
    <Grid container spacing={2}>
      <Fact label="Full name" value={`${a.firstName} ${a.lastName}`} />
      <Fact label="User name" value={a.email.split('@')[0]} />
      <Fact label="Email" value={a.email} />
      <Fact label="Contact" value={a.contact} />
      <Fact label="Date of birth" value={a.dob} />
      <Fact label="Applicant type" value="Resident" />
      <Fact label="Correspondence address" value="Flat 12, Riverside Walk, CC1 3AA" />
      <Fact label="Blue Badge" value={a.blueBadge ? 'Yes' : 'No'} />
      <Fact label="Experian pass" value="Passed" />
      <Fact label="Registered on" value="2025-11-14" />
      <Fact label="Last login" value="2026-06-30 08:12" />
    </Grid>
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
  return (
    <>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button variant="contained" startIcon={<AddOutlined />} onClick={() => showToast('Add blue badge dialog coming soon', 'info')}>Add Blue Badge</Button>
      </Stack>
      <SimpleTable columns={['Badge No','Issue Date','Expiry Date','Status','Actions']}
        rows={hasBadge ? [['BB-8821','2024-01-15','2027-01-14', <StatusChip status="Active" />,
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small"><EditOutlined fontSize="small" /></IconButton>
            <IconButton size="small"><DeleteOutlineOutlined fontSize="small" /></IconButton>
          </Stack>
        ]] : []} />
    </>
  );
}

function VehiclesPane() {
  const showToast = useToast();
  const rows = [
    ['AB19 XYZ', 'Standard', 'Silver Ford Focus',    'Focus daily',   '2026-06-01 09:22',
      <Stack direction="row" spacing={0.5}><IconButton size="small"><EditOutlined fontSize="small" /></IconButton><IconButton size="small"><DeleteOutlineOutlined fontSize="small" /></IconButton></Stack>],
    ['BC22 CDE', 'Standard', 'White Tesla Model 3',  'Tesla',         '2026-05-11 12:41',
      <Stack direction="row" spacing={0.5}><IconButton size="small"><EditOutlined fontSize="small" /></IconButton><IconButton size="small"><DeleteOutlineOutlined fontSize="small" /></IconButton></Stack>],
    ['TMP LOAN', 'Temporary', 'Black BMW 3 Series (loaner)', 'Loaner', '2026-06-15 10:04',
      <Stack direction="row" spacing={0.5}><IconButton size="small"><EditOutlined fontSize="small" /></IconButton><IconButton size="small"><DeleteOutlineOutlined fontSize="small" /></IconButton></Stack>],
  ];
  return (
    <>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }} spacing={1}>
        <Button variant="outlined" startIcon={<DirectionsCarOutlined />} onClick={() => showToast('Temporary vehicle dialog coming soon', 'info')}>Temporary Vehicle</Button>
        <Button variant="contained" startIcon={<AddOutlined />} onClick={() => showToast('Add vehicle dialog coming soon', 'info')}>Add Vehicle</Button>
      </Stack>
      <SimpleTable columns={['Vehicle number (VRM)','Type','Color, Make, Model','Nick name','Last added date/time','Actions']} rows={rows} />
    </>
  );
}

function DocumentsPane() {
  const showToast = useToast();
  const rows = [
    ['Proof of Address.pdf', 'Proof of Address', '2026-06-24', '212 KB', <StatusChip status="Approved" />,
      <Stack direction="row" spacing={0.5}><IconButton size="small"><DownloadOutlined fontSize="small" /></IconButton><IconButton size="small"><PreviewOutlined fontSize="small" /></IconButton><IconButton size="small"><DeleteOutlineOutlined fontSize="small" /></IconButton></Stack>],
    ['Utility Bill.pdf',    'Proof of Address', '2026-05-30', '198 KB', <StatusChip status="Approved" />,
      <Stack direction="row" spacing={0.5}><IconButton size="small"><DownloadOutlined fontSize="small" /></IconButton><IconButton size="small"><PreviewOutlined fontSize="small" /></IconButton><IconButton size="small"><DeleteOutlineOutlined fontSize="small" /></IconButton></Stack>],
  ];
  return (
    <>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button variant="contained" startIcon={<UploadFileOutlined />} onClick={() => showToast('Upload document dialog coming soon', 'info')}>Add Document</Button>
      </Stack>
      <SimpleTable columns={['File Name','Document Type','Uploaded','Size','Status','Actions']} rows={rows} />
    </>
  );
}

function EmailsPane() {
  const showToast = useToast();
  const rows = [
    ['2026-06-25 14:08', 'Application received',      'Delivered', <IconButton size="small"><PreviewOutlined fontSize="small" /></IconButton>],
    ['2026-06-14 09:22', 'Password reset link',       'Delivered', <IconButton size="small"><PreviewOutlined fontSize="small" /></IconButton>],
    ['2026-05-30 10:03', 'Renewal reminder — 30 days', 'Opened',    <IconButton size="small"><PreviewOutlined fontSize="small" /></IconButton>],
  ];
  return (
    <>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button variant="contained" startIcon={<EmailOutlined />} onClick={() => showToast('Compose email dialog coming soon', 'info')}>Send Email</Button>
      </Stack>
      <SimpleTable columns={['Sent','Subject','Status','Actions']} rows={rows} />
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

function AddApplicantDrawer({ onClose }: { onClose: () => void }) {
  const [experian, setExperian] = useState(false);
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
          <FormItem label="First Name" required><TextField placeholder="Enter First Name" fullWidth /></FormItem>
          <FormItem label="Last Name" required><TextField placeholder="Enter Last Name" fullWidth /></FormItem>
          <FormItem label="User Name" required><TextField placeholder="Enter User Name" fullWidth /></FormItem>
          <FormItem label="Email" required><TextField type="email" placeholder="Enter Email" fullWidth /></FormItem>
          <FormItem label="Contact Number"><TextField placeholder="+44 7700 900 000" fullWidth /></FormItem>
          <FormItem label="Date of Birth"><TextField type="date" InputLabelProps={{ shrink: true }} fullWidth /></FormItem>
          <FormItem label="Correspondence address" full><TextField placeholder="Enter address" fullWidth multiline minRows={2} /></FormItem>
          <FormItem label="Blue Badge" full>
            <FormControlLabel control={<Switch />} label="Applicant holds a Blue Badge" />
          </FormItem>
          <FormItem label="Experian check" full>
            <FormControlLabel control={<Switch checked={experian} onChange={(e) => setExperian(e.target.checked)} />} label="Run Experian address & identity check on save" />
          </FormItem>
        </Grid>
      </Box>
      <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${tokens.LINE}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onClose}>Add Applicant</Button>
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
