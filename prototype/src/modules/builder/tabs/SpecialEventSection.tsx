import { useMemo } from 'react';
import {
  Alert, Box, Button, Chip, Divider, FormControl, IconButton, InputLabel, MenuItem,
  OutlinedInput, Select, Stack, TextField, Typography,
} from '@mui/material';
import { AddOutlined, ContentCopyOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { usePersistentState } from '../../../hooks/usePersistentState';
import { tokens } from '../../../theme';

// -----------------------------------------------------------------------------
// US-143256 — Special Event section (rendered inside Permissions > Special Event
// sub-nav, only when General Settings > Special Event radio is Enabled).
// -----------------------------------------------------------------------------

export type SpecialEventBlock = {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  days: string[];    // ['Mon','Tue',...]
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
};

export const MAX_SPECIAL_EVENTS = 15;
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const newBlock = (): SpecialEventBlock => ({
  id: `SE-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  startDate: '', endDate: '', days: [], startTime: '', endTime: '',
});

/** Return the distinct week-day labels that fall inside the [start, end] range. */
export function daysInDateRange(startDate: string, endDate: string): string[] {
  if (!startDate || !endDate) return [];
  const s = new Date(startDate + 'T00:00:00');
  const e = new Date(endDate + 'T00:00:00');
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return [];
  if (s > e) return [];
  const days = new Set<string>();
  const cursor = new Date(s);
  let guard = 0;
  while (cursor <= e && guard++ < 400) {
    days.add(WEEK_DAYS[cursor.getDay()]);
    cursor.setDate(cursor.getDate() + 1);
  }
  return WEEK_DAYS.filter((d) => days.has(d));
}

/** Compare HH:MM strings. */
const toMin = (t: string): number => {
  const [h, m] = (t || '').split(':').map((n) => parseInt(n, 10));
  if (Number.isNaN(h)) return -1;
  return h * 60 + (m || 0);
};

export type BlockErrors = {
  startAfterEnd?: string;
  startTimeAfterEnd?: string;
  noDaySelected?: string;
  timeOverlap?: string;
  dateOverlap?: string;
};

export function validateBlocks(blocks: SpecialEventBlock[]): Record<string, BlockErrors> {
  const errors: Record<string, BlockErrors> = {};
  blocks.forEach((b, i) => {
    const e: BlockErrors = {};
    if (b.startDate && b.endDate && b.startDate > b.endDate) {
      e.startAfterEnd = 'Start date cannot be larger than end date';
    }
    if (b.startTime && b.endTime && toMin(b.startTime) >= toMin(b.endTime)) {
      e.startTimeAfterEnd = 'Start time must be before end time';
    }
    if ((b.startDate || b.endDate || b.startTime || b.endTime) && b.days.length === 0) {
      e.noDaySelected = 'At least one day must be selected';
    }
    // Overlap detection against earlier blocks
    for (let j = 0; j < i; j++) {
      const o = blocks[j];
      // Date-range overlap
      if (b.startDate && b.endDate && o.startDate && o.endDate) {
        const overlap = !(b.endDate < o.startDate || b.startDate > o.endDate);
        if (overlap) {
          e.dateOverlap = 'Date range overlaps with an existing entry';
        }
      }
      // Same-day time overlap
      const commonDays = b.days.filter((d) => o.days.includes(d));
      if (commonDays.length && b.startTime && b.endTime && o.startTime && o.endTime) {
        const aStart = toMin(b.startTime), aEnd = toMin(b.endTime);
        const bStart = toMin(o.startTime), bEnd = toMin(o.endTime);
        // Back-to-back allowed (aEnd === bStart or bEnd === aStart).
        const overlaps = aStart < bEnd && bStart < aEnd;
        if (overlaps) {
          e.timeOverlap = 'Time range overlaps with an existing entry for the same day.';
        }
      }
    }
    if (Object.keys(e).length) errors[b.id] = e;
  });
  return errors;
}

export function SpecialEventSection({ permissionId }: { permissionId: string }) {
  const key = `prototype:builder:${permissionId}:specialEventBlocks`;
  const [blocks, setBlocks] = usePersistentState<SpecialEventBlock[]>(key, () => [newBlock()]);

  const errors = useMemo(() => validateBlocks(blocks), [blocks]);
  const atLimit = blocks.length >= MAX_SPECIAL_EVENTS;

  const updateBlock = (id: string, patch: Partial<SpecialEventBlock>) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const addBlock = () => {
    if (atLimit) return;
    setBlocks((prev) => [...prev, newBlock()]);
  };

  const duplicateBlock = (id: string) => {
    if (atLimit) return;
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const src = prev[idx];
      const clone: SpecialEventBlock = { ...src, id: newBlock().id };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => (prev.length > 1 ? prev.filter((b) => b.id !== id) : prev));
  };

  return (
    <Box data-testid="special-event-section">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.15rem', color: tokens.INK }}>
          Special Event
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip data-testid="se-count" label={`${blocks.length}/${MAX_SPECIAL_EVENTS}`} size="small" />
          <Button
            data-testid="se-add-timing"
            variant="outlined"
            size="small"
            startIcon={<AddOutlined />}
            disabled={atLimit}
            onClick={addBlock}
          >
            Add Timing
          </Button>
        </Stack>
      </Stack>
      <Divider sx={{ my: 2 }} />

      <Alert severity="info" sx={{ mb: 2 }}>
        Configure the operational criteria for the special event. At least one configuration is required to publish this permission.
      </Alert>

      <Stack spacing={2}>
        {blocks.map((b, i) => {
          const err = errors[b.id] || {};
          const validDays = daysInDateRange(b.startDate, b.endDate);
          return (
            <Box
              key={b.id}
              data-testid={`se-block-${i}`}
              data-block-id={b.id}
              sx={{ border: `1px solid ${tokens.LINE}`, borderRadius: 1, p: 2 }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography sx={{ fontWeight: 600, color: tokens.INK }}>Timing #{i + 1}</Typography>
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    data-testid={`se-duplicate-${i}`}
                    size="small"
                    disabled={atLimit}
                    onClick={() => duplicateBlock(b.id)}
                    aria-label="Duplicate timing block"
                  >
                    <ContentCopyOutlined fontSize="small" />
                  </IconButton>
                  {blocks.length > 1 && (
                    <IconButton
                      data-testid={`se-delete-${i}`}
                      size="small"
                      color="error"
                      onClick={() => deleteBlock(b.id)}
                      aria-label="Delete timing block"
                    >
                      <DeleteOutlineOutlined fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={b.startDate}
                  onChange={(e) => updateBlock(b.id, { startDate: e.target.value })}
                  inputProps={{ 'data-testid': `se-start-date-${i}` }}
                  error={!!err.startAfterEnd || !!err.dateOverlap}
                  fullWidth
                />
                <TextField
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={b.endDate}
                  onChange={(e) => updateBlock(b.id, { endDate: e.target.value })}
                  inputProps={{ 'data-testid': `se-end-date-${i}` }}
                  error={!!err.startAfterEnd || !!err.dateOverlap}
                  fullWidth
                />
              </Stack>
              {err.startAfterEnd && (
                <Typography data-testid={`se-error-date-${i}`} sx={{ color: '#C62828', fontSize: '0.75rem', mt: 0.5 }}>
                  {err.startAfterEnd}
                </Typography>
              )}
              {err.dateOverlap && (
                <Typography data-testid={`se-error-date-overlap-${i}`} sx={{ color: '#C62828', fontSize: '0.75rem', mt: 0.5 }}>
                  {err.dateOverlap}
                </Typography>
              )}

              <FormControl sx={{ mt: 2 }} fullWidth error={!!err.noDaySelected}>
                <InputLabel shrink>Days</InputLabel>
                <Select
                  multiple
                  displayEmpty
                  value={b.days}
                  input={<OutlinedInput label="Days" notched />}
                  onChange={(e) => {
                    const raw = e.target.value;
                    let sel = Array.isArray(raw) ? raw : (raw as string).split(',');
                    if (sel.includes('__ALL__')) {
                      sel = validDays.length ? validDays : WEEK_DAYS.slice();
                    }
                    updateBlock(b.id, { days: sel.filter((d) => d !== '__ALL__') });
                  }}
                  renderValue={(sel) => (sel as string[]).join(', ') || 'Select days'}
                  data-testid={`se-days-${i}`}
                >
                  <MenuItem value="__ALL__" data-testid={`se-days-all-${i}`}>All Week days</MenuItem>
                  {(validDays.length ? validDays : WEEK_DAYS).map((d) => (
                    <MenuItem key={d} value={d} data-testid={`se-day-${d}-${i}`}>{d}</MenuItem>
                  ))}
                </Select>
                {err.noDaySelected && (
                  <Typography data-testid={`se-error-day-${i}`} sx={{ color: '#C62828', fontSize: '0.75rem', mt: 0.5 }}>
                    {err.noDaySelected}
                  </Typography>
                )}
              </FormControl>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="From"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={b.startTime}
                  onChange={(e) => updateBlock(b.id, { startTime: e.target.value })}
                  inputProps={{ 'data-testid': `se-start-time-${i}` }}
                  error={!!err.startTimeAfterEnd || !!err.timeOverlap}
                  fullWidth
                />
                <TextField
                  label="Until"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={b.endTime}
                  onChange={(e) => updateBlock(b.id, { endTime: e.target.value })}
                  inputProps={{ 'data-testid': `se-end-time-${i}` }}
                  error={!!err.startTimeAfterEnd || !!err.timeOverlap}
                  fullWidth
                />
              </Stack>
              {err.startTimeAfterEnd && (
                <Typography data-testid={`se-error-time-${i}`} sx={{ color: '#C62828', fontSize: '0.75rem', mt: 0.5 }}>
                  {err.startTimeAfterEnd}
                </Typography>
              )}
              {err.timeOverlap && (
                <Typography data-testid={`se-error-time-overlap-${i}`} sx={{ color: '#C62828', fontSize: '0.75rem', mt: 0.5 }}>
                  {err.timeOverlap}
                </Typography>
              )}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
