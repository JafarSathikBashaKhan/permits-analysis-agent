import {
  Button, Chip, Divider, IconButton, Paper, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, InputAdornment, Alert,
} from '@mui/material';
import { ArrowUpwardOutlined, ArrowDownwardOutlined, CheckCircleOutline, CancelOutlined, Search } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { tokens } from '../../../theme';
import { usePersistentState } from '../../../hooks/usePersistentState';
import { useToast } from '../../../components/Toast';
import { pushAudit } from '../helpers/auditLog';

/**
 * US-199862 — Waiting List management.
 * BO users can view, search, reorder, approve, or reject a waiting-list application.
 * Only one application at a time can be actioned per constraint in the AC.
 */
export type WaitingListRow = {
  id: string;
  ref: string;
  applicant: string;
  permission: string;
  waitingSince: string;
  position: number;
  reason: string;
};

const KEY = 'prototype:applications:waiting-list';

const DEFAULT_ROWS: WaitingListRow[] = [
  { id: 'WL-001', ref: 'AP-2026-3001', applicant: 'Priya Ravichandran',   permission: 'Resident Permit', waitingSince: '2026-05-10', position: 1, reason: 'Property limit reached' },
  { id: 'WL-002', ref: 'AP-2026-3002', applicant: 'Marcus Reid',          permission: 'Business Permit', waitingSince: '2026-05-12', position: 2, reason: 'No stock available' },
  { id: 'WL-003', ref: 'AP-2026-3003', applicant: 'Isla Robertson',       permission: 'Resident Permit', waitingSince: '2026-05-18', position: 3, reason: 'Property limit reached' },
];

export function WaitingListTab() {
  const showToast = useToast();
  const [rows, setRows] = usePersistentState<WaitingListRow[]>(KEY, () => DEFAULT_ROWS);
  const [q, setQ] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = useMemo(
    () => rows
      .filter((r) => !q || `${r.ref} ${r.applicant}`.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.position - b.position),
    [rows, q]
  );

  const move = (id: string, dir: -1 | 1) => {
    setRows((prev) => {
      const sorted = [...prev].sort((a, b) => a.position - b.position);
      const idx = sorted.findIndex((r) => r.id === id);
      const swap = sorted[idx + dir];
      if (!swap) return prev;
      return prev.map((r) => {
        if (r.id === sorted[idx].id) return { ...r, position: swap.position };
        if (r.id === swap.id) return { ...r, position: sorted[idx].position };
        return r;
      });
    });
    pushAudit(id, {
      actor: 'You', actorRole: 'BO User',
      eventName: 'Waiting List Reordered',
      eventDescription: `Waiting list entry ${id} moved ${dir === -1 ? 'up' : 'down'}.`,
      eventCategory: 'Work Queue / Process Management',
    });
  };

  const approve = (row: WaitingListRow) => {
    if (processing) { showToast('Finish processing the current application first', 'error'); return; }
    setProcessing(row.id);
    pushAudit(row.id, {
      actor: 'You', actorRole: 'BO User',
      eventName: 'Waiting List Application Approved',
      eventDescription: `Approved waiting-list entry ${row.ref} — moving to Pending Approval.`,
      eventCategory: 'Application Processing',
    });
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setTimeout(() => setProcessing(null), 300);
    showToast(`${row.ref} moved to Pending Approval`, 'success');
  };

  const reject = (row: WaitingListRow) => {
    if (processing) { showToast('Finish processing the current application first', 'error'); return; }
    setProcessing(row.id);
    pushAudit(row.id, {
      actor: 'You', actorRole: 'BO User',
      eventName: 'Waiting List Application Rejected',
      eventDescription: `Rejected waiting-list entry ${row.ref}.`,
      eventCategory: 'Application Processing',
    });
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setTimeout(() => setProcessing(null), 300);
    showToast(`${row.ref} removed from waiting list`, 'success');
  };

  return (
    <Paper sx={{ p: 2.5, mb: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.1rem', color: tokens.INK }}>Waiting list</Typography>
        <TextField
          size="small" placeholder="Search applications…" value={q} onChange={(e) => setQ(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          sx={{ width: 260 }}
          data-testid="waiting-list-search"
        />
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Alert severity="info" sx={{ mb: 2 }}>Only one waiting-list application may be processed at a time (US-199862).</Alert>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Position</TableCell>
            <TableCell>Reference</TableCell>
            <TableCell>Applicant</TableCell>
            <TableCell>Permission</TableCell>
            <TableCell>Waiting Since</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((r) => (
            <TableRow key={r.id} hover>
              <TableCell>
                <Chip size="small" label={`#${r.position}`} />
              </TableCell>
              <TableCell><Typography fontFamily="monospace" variant="body2">{r.ref}</Typography></TableCell>
              <TableCell>{r.applicant}</TableCell>
              <TableCell>{r.permission}</TableCell>
              <TableCell>{r.waitingSince}</TableCell>
              <TableCell>{r.reason}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={() => move(r.id, -1)} disabled={r.position <= 1} title="Move up" data-testid={`wl-up-${r.id}`}>
                    <ArrowUpwardOutlined fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => move(r.id, 1)} title="Move down" data-testid={`wl-down-${r.id}`}>
                    <ArrowDownwardOutlined fontSize="small" />
                  </IconButton>
                  <Button size="small" color="success" startIcon={<CheckCircleOutline />} onClick={() => approve(r)} data-testid={`wl-approve-${r.id}`}>Approve</Button>
                  <Button size="small" color="error" startIcon={<CancelOutlined />} onClick={() => reject(r)} data-testid={`wl-reject-${r.id}`}>Reject</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: tokens.MUTED }}>No waiting-list applications</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
