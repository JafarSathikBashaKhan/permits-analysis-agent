import {
  Chip, Divider, InputAdornment, MenuItem, Paper, Stack, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { tokens } from '../../../theme';
import { Application } from '../../../data/mock';
import { readAudit, seedAuditIfEmpty, AuditEntry } from '../helpers/auditLog';

/**
 * US-164970 (Audit Log tab) + US-182368 (Application ID on every event).
 * Events shown newest → oldest, read-only, filterable by category and free-text search.
 */
export function AuditLogTab({ app }: { app: Application }) {
  const seeded: AuditEntry[] = seedAuditIfEmpty(app.id, app.submitted, app.status, app.assignedTo);
  // Re-read to ensure latest state (since seed only happens once)
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const entries = readAudit(app.id).length > 0 ? readAudit(app.id) : seeded;

  const categories = useMemo(
    () => Array.from(new Set(entries.map((e) => e.eventCategory))).sort(),
    [entries]
  );

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return entries
      .filter((e) => cat === 'All' || e.eventCategory === cat)
      .filter((e) => !qq || `${e.eventName} ${e.eventDescription} ${e.actor} ${e.applicationId}`.toLowerCase().includes(qq))
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [entries, q, cat]);

  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleString('en-GB'); } catch { return iso; }
  };

  return (
    <Paper sx={{ p: 2.5, mb: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.1rem', color: tokens.INK }}>Audit log</Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small" placeholder="Search events…" value={q} onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
            sx={{ width: 240 }}
            data-testid="audit-search"
          />
          <TextField size="small" select label="Category" value={cat} onChange={(e) => setCat(e.target.value)} sx={{ minWidth: 200 }}>
            <MenuItem value="All">All</MenuItem>
            {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date & Time</TableCell>
            <TableCell>Application ID</TableCell>
            <TableCell>Event Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((e) => (
            <TableRow key={e.id}>
              <TableCell><Typography variant="caption">{fmt(e.timestamp)}</Typography></TableCell>
              <TableCell><Typography fontFamily="monospace" variant="caption">{e.applicationId}</Typography></TableCell>
              <TableCell><Typography variant="body2" fontWeight={600}>{e.eventName}</Typography></TableCell>
              <TableCell><Typography variant="body2">{e.eventDescription}</Typography></TableCell>
              <TableCell><Chip size="small" label={e.eventCategory} /></TableCell>
              <TableCell>{e.actor}</TableCell>
              <TableCell><Typography variant="caption">{e.actorRole}</Typography></TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: tokens.MUTED }}>No events</TableCell></TableRow>}
        </TableBody>
      </Table>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Audit records are read-only and cannot be edited or deleted.
      </Typography>
    </Paper>
  );
}
