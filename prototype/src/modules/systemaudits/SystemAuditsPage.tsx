import { useMemo, useState } from 'react';
import {
  Box, Chip, MenuItem, Stack, TextField, Typography, Button, Tooltip, IconButton,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { PageHeader } from '../../shared/PageHeader';
import { systemUsers } from '../../data/mock';

type AuditRow = {
  id: string;
  eventDate: string;
  eventType: string;
  eventDescription: string;
  roleName: string;
  userName: string;
  module: string;
};

const EVENT_TYPES = [
  'Login', 'Logout', 'Application Approved', 'Application Rejected', 'Application Cancelled',
  'Application Suspended', 'Application On Hold', 'Application Resumed', 'Vehicle Added',
  'Vehicle Removed', 'Document Uploaded', 'Document Deleted', 'Note Added', 'Email Sent',
  'Role Created', 'Role Updated', 'User Invited', 'User Deactivated', 'Permission Published',
  'Permission Unpublished', 'Zone Created', 'Zone Published', 'Street Blacklisted',
  'Property Blacklisted', 'Contract Setting Changed', 'Bulk Approve', 'Send to Print',
];

const MODULES = [
  'Applications', 'Users', 'Permission Setup', 'Templates', 'Area', 'Contract Settings',
  'Work Queue', 'Print', 'Reports', 'Auth',
];

const descriptions: Record<string, (u: string, m: string) => string> = {
  'Login': (u) => `User ${u} logged in successfully`,
  'Logout': (u) => `User ${u} signed out`,
  'Application Approved': (u) => `Application AP-2026-${1000 + Math.floor(Math.random() * 40)} approved by ${u}`,
  'Application Rejected': (u) => `Application AP-2026-${1000 + Math.floor(Math.random() * 40)} rejected by ${u} — reason: Insufficient evidence`,
  'Application Cancelled': (u) => `Application AP-2026-${1000 + Math.floor(Math.random() * 40)} cancelled by ${u}`,
  'Application Suspended': () => `Application AP-2026-${1000 + Math.floor(Math.random() * 40)} suspended for 24 hours`,
  'Application On Hold': () => `Application put on hold — additional information required`,
  'Application Resumed': () => `Application resumed after applicant response`,
  'Vehicle Added': () => `Vehicle AB${Math.floor(Math.random() * 90) + 10} XYZ added via Autoguru`,
  'Vehicle Removed': () => `Vehicle removed from application`,
  'Document Uploaded': () => `Proof of Residency document uploaded`,
  'Document Deleted': () => `Document 'Vehicle Ownership.pdf' deleted`,
  'Note Added': () => `Internal note added to application`,
  'Email Sent': () => `Email sent to applicant (template: Application Approved)`,
  'Role Created': (u) => `Role 'Custom Approver' created by ${u}`,
  'Role Updated': () => `Role 'BO User' permissions updated`,
  'User Invited': () => `System user invited (email queued)`,
  'User Deactivated': (u) => `System user deactivated by ${u}`,
  'Permission Published': () => `Permission 'Resident 12mo' published to Buy Now`,
  'Permission Unpublished': () => `Permission 'Trades Weekly' unpublished`,
  'Zone Created': () => `Zone 'ZN-14 South Quarter' created`,
  'Zone Published': () => `Zone published — 24 streets mapped`,
  'Street Blacklisted': () => `Street USRN 30012345 blacklisted for 1 month`,
  'Property Blacklisted': () => `Property UPRN 100097654321 blacklisted (indefinite)`,
  'Contract Setting Changed': (u) => `${u} changed toggle 'Diesel Surcharge' → ON`,
  'Bulk Approve': () => `Bulk approve executed on 12 applications`,
  'Send to Print': () => `Batch of 8 physical permissions sent to print partner`,
};

const seedAudit = (): AuditRow[] => {
  const rows: AuditRow[] = [];
  const now = Date.now();
  const activeUsers = systemUsers.filter((u) => u.status === 'Active');
  for (let i = 0; i < 120; i++) {
    const ev = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
    const u = activeUsers[Math.floor(Math.random() * activeUsers.length)];
    const mod = MODULES[Math.floor(Math.random() * MODULES.length)];
    const t = new Date(now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    rows.push({
      id: `AUD-${String(i + 1).padStart(5, '0')}`,
      eventDate: t.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
      }),
      eventType: ev,
      eventDescription: descriptions[ev]?.(u.name, mod) ?? `${ev} performed in ${mod}`,
      roleName: u.role,
      userName: u.name,
      module: mod,
    });
  }
  return rows.sort((a, b) => b.eventDate.localeCompare(a.eventDate));
};

const RANGES: Record<string, number> = {
  'Today': 1, 'Last 24 hours': 1, 'Last 3 days': 3, 'Last 7 days': 7, 'Last 30 days': 30, 'All time': 999,
};

export function SystemAuditsPage() {
  const [rows] = useState<AuditRow[]>(seedAudit());
  const [search, setSearch] = useState('');
  const [range, setRange] = useState('Last 7 days');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) =>
      (moduleFilter === 'All' || r.module === moduleFilter) &&
      (userFilter === 'All' || r.userName === userFilter) &&
      (eventFilter === 'All' || r.eventType === eventFilter) &&
      (!q || r.eventDescription.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.eventType.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q))
    );
  }, [rows, search, moduleFilter, userFilter, eventFilter]);

  const uniqueUsers = Array.from(new Set(rows.map((r) => r.userName))).sort();

  const exportCsv = () => {
    const header = 'Audit ID,Date & Time,Event Type,Description,User Role,User Name,Module\n';
    const body = filtered.map((r) =>
      [r.id, r.eventDate, r.eventType, `"${r.eventDescription.replace(/"/g, '""')}"`, r.roleName, r.userName, r.module].join(',')
    ).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cols: GridColDef[] = [
    { field: 'eventDate', headerName: 'Date & Time', width: 200 },
    { field: 'eventType', headerName: 'Event Type/Name', width: 200,
      renderCell: (p) => <Chip size="small" label={p.value} variant="outlined" color="info" /> },
    { field: 'eventDescription', headerName: 'Event Description', flex: 1.6, minWidth: 320,
      renderCell: (p) => (
        <Tooltip title={p.value}>
          <Typography variant="body2" noWrap>{p.value}</Typography>
        </Tooltip>
      ) },
    { field: 'module', headerName: 'Module', width: 150,
      renderCell: (p) => <Chip size="small" label={p.value} variant="outlined" /> },
    { field: 'roleName', headerName: 'User Role', width: 140 },
    { field: 'userName', headerName: 'User Name', width: 160 },
  ];

  return (
    <Box>
      <PageHeader eyebrow="Governance" title="System Audits"
        description="Immutable audit log of user actions across every module. Filter by date, module, user, or event type."
        actions={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton size="small"><RefreshIcon /></IconButton>
            </Tooltip>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportCsv}>Export CSV</Button>
          </Stack>
        } />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        <TextField size="small" placeholder="Search description, user or event"
          value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 300 }} />
        <TextField size="small" select label="Date Range" value={range}
          onChange={(e) => setRange(e.target.value)} sx={{ minWidth: 170 }}>
          {Object.keys(RANGES).map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </TextField>
        <TextField size="small" select label="Module" value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)} sx={{ minWidth: 170 }}>
          <MenuItem value="All">All Modules</MenuItem>
          {MODULES.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </TextField>
        <TextField size="small" select label="Event Type" value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)} sx={{ minWidth: 200 }}>
          <MenuItem value="All">All Events</MenuItem>
          {EVENT_TYPES.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
        </TextField>
        <TextField size="small" select label="User" value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)} sx={{ minWidth: 180 }}>
          <MenuItem value="All">All Users</MenuItem>
          {uniqueUsers.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
        </TextField>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary">
          Showing <strong>{filtered.length}</strong> of {rows.length} events
        </Typography>
      </Stack>

      <Box sx={{ height: 620, bgcolor: 'background.paper', borderRadius: 1 }}>
        <DataGrid rows={filtered} columns={cols} getRowId={(r) => r.id} density="compact"
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'eventDate', sort: 'desc' }] },
          }}
          disableRowSelectionOnClick />
      </Box>
    </Box>
  );
}
