// US-187217 — Special Events Pricing (Permission Builder > Pricing tab).
// A single "Pricing" tab that hosts a list of pricing records and a
// duration/tier/band configuration screen. When Special Event is enabled on
// the permission, this pricing is scoped to that special-event permission.
import { useMemo, useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, InputAdornment, MenuItem, Paper, Select, Stack, Table,
  TableBody, TableCell, TableHead, TablePagination, TableRow, TextField,
  Typography, Tooltip, Collapse,
} from '@mui/material';
import {
  AddOutlined, DeleteOutlineOutlined, EditOutlined, ExpandLessOutlined,
  ExpandMoreOutlined, FilterAltOutlined, SaveOutlined, ArrowBackOutlined,
  ContentCopyOutlined,
} from '@mui/icons-material';
import { tokens } from '../../../theme';
import { usePersistentState } from '../../../hooks/usePersistentState';

// --- Types ---
export type Period = 'Minutes' | 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years';
export const PERIODS: Period[] = ['Minutes', 'Hours', 'Days', 'Weeks', 'Months', 'Years'];

export type Band = { id: string; name: string; price: number | ''; };
export type Tier = { id: string; label: string; bands: Band[]; dieselSurcharge: number | ''; };
export type Duration = {
  id: string;
  frequency: number | '';
  period: Period | '';
  tiers: Tier[];
};
export type PricingRecord = {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  durations: Duration[];
  properties: number;
  createdAt: string;
};

export const MAX_DURATIONS = 10;
export const MAX_TIERS = 20;

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

function makeEmptyBand(letter: string): Band {
  return { id: uid('band'), name: `Band ${letter}`, price: '' };
}
function makeEmptyTier(n: number): Tier {
  return { id: uid('tier'), label: `Tier ${n}`, bands: [makeEmptyBand('A')], dieselSurcharge: '' };
}
function makeEmptyDuration(): Duration {
  return { id: uid('dur'), frequency: '', period: '', tiers: [makeEmptyTier(1)] };
}

export function isLivePricing(rec: PricingRecord, permissionStatus: string): boolean {
  if (permissionStatus !== 'Published') return false;
  const t = new Date(todayISO()).getTime();
  const s = rec.startDate ? new Date(rec.startDate).getTime() : -Infinity;
  const e = rec.endDate ? new Date(rec.endDate).getTime() : Infinity;
  return t >= s && t <= e;
}
export function isPastPricing(rec: PricingRecord): boolean {
  if (!rec.endDate) return false;
  return new Date(rec.endDate).getTime() < new Date(todayISO()).getTime();
}

// -------- Component --------
export function PricingConfigurationTab({
  permissionId,
  permissionStatus = 'Draft',
}: {
  permissionId: string;
  permissionStatus?: string;
}) {
  const listKey = `prototype:builder:${permissionId}:pricingList`;
  const [records, setRecords] = usePersistentState<PricingRecord[]>(listKey, []);
  const [view, setView] = useState<'list' | 'config'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<PricingRecord | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [contractSettings] = usePersistentState<Record<string, boolean>>(
    'prototype:contract-settings:state',
    { tierPricing: true, dieselSurcharge: true },
  );
  const tierPricingEnabled = contractSettings.tierPricing !== false;
  const dieselSurchargeEnabled = contractSettings.dieselSurcharge !== false;

  // Property count comes from the Special Event Properties Mapping saved earlier.
  const [sepm] = usePersistentState<{ streets: Record<string, string[]> }>(
    `prototype:builder:${permissionId}:sepm`, { streets: {} }
  );
  const mappedPropertyCount = Object.values(sepm.streets).reduce((n, a) => n + a.length, 0);

  const totalDurationsFor = (r: PricingRecord) => r.durations.length;

  const openCreate = () => {
    const rec: PricingRecord = {
      id: uid('PR'),
      name: `Pricing ${records.length + 1}`,
      startDate: '',
      endDate: '',
      durations: [],
      properties: mappedPropertyCount,
      createdAt: new Date().toISOString(),
    };
    setRecords([...records, rec]);
    setEditingId(rec.id);
    setView('config');
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setView('config');
  };

  const removeRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const updateRecord = (id: string, patch: Partial<PricingRecord>) => {
    setRecords(records.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const currentRecord = records.find((r) => r.id === editingId) || null;

  // ---- LIST VIEW ----
  if (view === 'list') {
    // "equals" search on Pricing Name.
    const filtered = search
      ? records.filter((r) => r.name.trim().toLowerCase() === search.trim().toLowerCase())
      : records;
    const totalOverThreshold = records.length > 5;
    const paged = totalOverThreshold ? filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filtered;

    return (
      <Box data-testid="pricing-tab">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.15rem', color: tokens.INK }}>
            Pricing
          </Typography>
          <Stack direction="row" spacing={1}>
            {totalOverThreshold && (
              <TextField
                size="small"
                placeholder="Search (equals) — Pricing Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                inputProps={{ 'data-testid': 'pricing-list-search' }}
              />
            )}
            <Button
              data-testid="pricing-create-btn"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={openCreate}
              sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
            >
              Create Pricing
            </Button>
          </Stack>
        </Stack>

        {records.length === 0 && (
          <Alert severity="info" data-testid="pricing-empty">
            No pricing configurations yet. Click <b>Create Pricing</b> to add one.
          </Alert>
        )}

        {records.length > 0 && (
          <Paper variant="outlined">
            <Table size="small" data-testid="pricing-list-table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Pricing Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>No of Properties</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Durations</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((r) => {
                  const live = isLivePricing(r, permissionStatus);
                  const past = isPastPricing(r);
                  const deleteDisabled = live || past;
                  return (
                    <TableRow key={r.id} data-testid={`pricing-row-${r.id}`} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            data-testid={`pricing-name-link-${r.id}`}
                            onClick={() => openEdit(r.id)}
                            sx={{ color: tokens.NAVY, cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                          >
                            {r.name}
                          </Typography>
                          {live && (
                            <Chip data-testid={`pricing-live-badge-${r.id}`} label="Live Pricing" size="small" color="success" />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell data-testid={`pricing-properties-${r.id}`}>{r.properties}</TableCell>
                      <TableCell data-testid={`pricing-durations-count-${r.id}`}>{totalDurationsFor(r)}</TableCell>
                      <TableCell>{r.startDate || '—'}</TableCell>
                      <TableCell>{r.endDate || '—'}</TableCell>
                      <TableCell align="right">
                        {deleteDisabled ? (
                          <Tooltip title="Live/Past pricing cannot be deleted">
                            <span style={{ display: 'inline-block' }}>
                              <IconButton
                                data-testid={`pricing-delete-${r.id}`}
                                disabled
                                size="small"
                              >
                                <DeleteOutlineOutlined />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <IconButton
                            data-testid={`pricing-delete-${r.id}`}
                            onClick={() => setConfirmDelete(r)}
                            size="small"
                          >
                            <DeleteOutlineOutlined />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ color: tokens.MUTED, fontStyle: 'italic' }}
                      data-testid="pricing-list-empty-filter">
                      No pricing records match the current filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {totalOverThreshold && (
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[5, 10, 25]}
                data-testid="pricing-list-pagination"
              />
            )}
          </Paper>
        )}

        <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
          <DialogTitle data-testid="pricing-delete-confirm-title">Confirm Deletion</DialogTitle>
          <DialogContent data-testid="pricing-delete-confirm-body">
            Are you sure you want to delete this pricing configuration?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(null)} data-testid="pricing-delete-cancel">Cancel</Button>
            <Button
              color="error"
              variant="contained"
              data-testid="pricing-delete-confirm"
              onClick={() => {
                if (confirmDelete) removeRecord(confirmDelete.id);
                setConfirmDelete(null);
              }}
            >Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // ---- CONFIG VIEW ----
  if (!currentRecord) return null;
  return (
    <PricingConfigView
      record={currentRecord}
      permissionStatus={permissionStatus}
      tierPricingEnabled={tierPricingEnabled}
      dieselSurchargeEnabled={dieselSurchargeEnabled}
      onBack={() => setView('list')}
      onSave={(patch) => updateRecord(currentRecord.id, patch)}
    />
  );
}

// -------------------------------------------------------------------------------------
function PricingConfigView({
  record, permissionStatus, tierPricingEnabled, dieselSurchargeEnabled, onBack, onSave,
}: {
  record: PricingRecord;
  permissionStatus: string;
  tierPricingEnabled: boolean;
  dieselSurchargeEnabled: boolean;
  onBack: () => void;
  onSave: (patch: Partial<PricingRecord>) => void;
}) {
  const [startDate, setStartDate] = useState(record.startDate ?? '');
  const [endDate, setEndDate] = useState(record.endDate ?? '');
  const [durations, setDurations] = useState<Duration[]>(record.durations);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [durationDialog, setDurationDialog] = useState<null | { mode: 'create' | 'edit'; draft: Duration }>(null);
  const [addError, setAddError] = useState<string>('');
  const [dateErrors, setDateErrors] = useState<{ start?: string; end?: string }>({});
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterTier, setFilterTier] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  const live = isLivePricing({ ...record, startDate, endDate }, permissionStatus);
  const past = isPastPricing({ ...record, startDate, endDate });

  // ----- date validation -----
  const validateDates = (s: string, e: string) => {
    const errs: { start?: string; end?: string } = {};
    if (s && new Date(s).getTime() < new Date(todayISO()).getTime()) {
      errs.start = 'Start date cannot be in the past.';
    }
    if (s && e && new Date(e).getTime() < new Date(s).getTime()) {
      errs.end = 'End date cannot be earlier than Start date.';
    }
    setDateErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const onStartDate = (v: string) => { setStartDate(v); validateDates(v, endDate); };
  const onEndDate = (v: string) => { setEndDate(v); validateDates(startDate, v); };

  const persist = (nextDurations = durations) => {
    onSave({ startDate: startDate || undefined, endDate: endDate || undefined, durations: nextDurations });
  };

  // ----- Add / edit duration -----
  const openAddDialog = () => {
    if (durations.length >= MAX_DURATIONS) {
      setAddError(`A maximum of ${MAX_DURATIONS} duration sets can be configured per permission.`);
      return;
    }
    setDurationDialog({ mode: 'create', draft: makeEmptyDuration() });
    setAddError('');
  };
  const openEditDialog = (id: string) => {
    const dur = durations.find((d) => d.id === id);
    if (!dur) return;
    setDurationDialog({ mode: 'edit', draft: JSON.parse(JSON.stringify(dur)) });
  };

  const saveDurationDialog = () => {
    if (!durationDialog) return;
    const d = durationDialog.draft;
    if (!d.frequency || !d.period) {
      setAddError('Please select both frequency and period.');
      return;
    }
    const dup = durations.some(
      (x) => x.id !== d.id && x.frequency === d.frequency && x.period === d.period,
    );
    if (dup) {
      setAddError('We’ve already got that same duration in the pricing.');
      return;
    }
    // Band-price range check
    for (const t of d.tiers) {
      for (const b of t.bands) {
        if (b.price === '' || Number(b.price) < 0 || Number(b.price) > 1000) {
          setAddError('Band price must be between 0 and 1000.');
          return;
        }
      }
      if (dieselSurchargeEnabled) {
        if (t.dieselSurcharge === '' || Number(t.dieselSurcharge) < 1 || Number(t.dieselSurcharge) > 100) {
          setAddError('Please enter a valid percentage between 1 and 100.');
          return;
        }
      }
    }
    const nextDurations = durationDialog.mode === 'create'
      ? [...durations, d]
      : durations.map((x) => (x.id === d.id ? d : x));
    setDurations(nextDurations);
    setDurationDialog(null);
    setAddError('');
    persist(nextDurations);
  };

  const removeDuration = (id: string) => {
    const next = durations.filter((d) => d.id !== id);
    setDurations(next);
    setConfirmRemove(null);
    persist(next);
  };

  // ----- filter / search -----
  const rowMatchesSearch = (d: Duration) => {
    if (!search.trim()) return true;
    const s = search.trim().toLowerCase();
    // "equals" over Tier labels and Band names.
    return d.tiers.some((t) =>
      t.label.toLowerCase() === s || t.bands.some((b) => b.name.toLowerCase() === s));
  };
  const rowMatchesFilter = (d: Duration) => {
    if (filterTier && !d.tiers.some((t) => t.label === filterTier)) return false;
    if (filterDuration) {
      const label = `${d.frequency} ${d.period}`;
      if (label !== filterDuration) return false;
    }
    return true;
  };
  const visibleDurations = durations.filter((d) => rowMatchesSearch(d) && rowMatchesFilter(d));
  const showListControls = durations.length > 5;

  return (
    <Box data-testid="pricing-config">
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={onBack} data-testid="pricing-config-back" size="small">
          <ArrowBackOutlined />
        </IconButton>
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.15rem', color: tokens.INK }}>
          {record.name}
        </Typography>
        {live && <Chip label="Live Pricing" color="success" size="small" data-testid="pricing-config-live-badge" />}
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          type="date"
          label="Start Date (optional)"
          size="small"
          value={startDate}
          onChange={(e) => onStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ 'data-testid': 'pricing-start-date' }}
          error={!!dateErrors.start}
          helperText={dateErrors.start || ''}
          sx={{ minWidth: 220 }}
        />
        <TextField
          type="date"
          label="End Date (optional)"
          size="small"
          value={endDate}
          onChange={(e) => onEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ 'data-testid': 'pricing-end-date' }}
          error={!!dateErrors.end}
          helperText={dateErrors.end || ''}
          sx={{ minWidth: 220 }}
        />
        <Alert severity="info" sx={{ flex: 1 }}>
          If both dates are left blank, this pricing becomes active when the permission is published.
        </Alert>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontWeight: 700 }}>Durations</Typography>
          <Chip size="small" label={`${durations.length}/${MAX_DURATIONS}`} data-testid="pricing-duration-count" />
        </Stack>
        <Stack direction="row" spacing={1}>
          {showListControls && (
            <TextField
              size="small"
              placeholder="Search (equals) — Tier/Band"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              inputProps={{ 'data-testid': 'pricing-config-search' }}
            />
          )}
          <IconButton
            data-testid="pricing-filter-btn"
            onClick={() => setFilterOpen((v) => !v)}
            size="small"
            color={filterOpen ? 'primary' : 'default'}
          >
            <FilterAltOutlined />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={openAddDialog}
            disabled={durations.length >= MAX_DURATIONS}
            data-testid="pricing-add-duration-btn"
            sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
          >
            Add Duration
          </Button>
        </Stack>
      </Stack>

      {filterOpen && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }} data-testid="pricing-filter-panel">
          <Stack direction="row" spacing={2}>
            <TextField
              label="Filter — Tier"
              size="small"
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              inputProps={{ 'data-testid': 'pricing-filter-tier' }}
            />
            <TextField
              label="Filter — Duration (e.g. 12 Weeks)"
              size="small"
              value={filterDuration}
              onChange={(e) => setFilterDuration(e.target.value)}
              inputProps={{ 'data-testid': 'pricing-filter-duration' }}
            />
            <Button onClick={() => { setFilterTier(''); setFilterDuration(''); }}
              data-testid="pricing-filter-clear">Clear</Button>
          </Stack>
        </Paper>
      )}

      {addError && (
        <Alert severity="error" sx={{ mb: 2 }} data-testid="pricing-add-error">{addError}</Alert>
      )}

      {durations.length === 0 ? (
        <Alert severity="info" data-testid="pricing-durations-empty">
          No durations configured. Click <b>+ Add Duration</b> to start.
        </Alert>
      ) : (
        <Paper variant="outlined">
          <Table size="small" data-testid="pricing-durations-table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 40 }} />
                <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tier / Band / Diesel</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleDurations.map((d) => {
                const isExp = expanded[d.id] === true;
                const summary = d.tiers.map((t) => {
                  const bands = t.bands.map((b) => `${b.name}=£${b.price}`).join(', ');
                  const diesel = dieselSurchargeEnabled ? ` · Diesel ${t.dieselSurcharge}%` : '';
                  return `${t.label}: ${bands}${diesel}`;
                }).join(' | ');
                return (
                  <>
                    <TableRow key={d.id} data-testid={`pricing-duration-row-${d.id}`} hover>
                      <TableCell>
                        <IconButton
                          size="small"
                          data-testid={`pricing-duration-toggle-${d.id}`}
                          onClick={() => setExpanded((e) => ({ ...e, [d.id]: !isExp }))}
                        >
                          {isExp ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                        </IconButton>
                      </TableCell>
                      <TableCell data-testid={`pricing-duration-label-${d.id}`}>
                        {d.frequency} {d.period}
                      </TableCell>
                      <TableCell data-testid={`pricing-duration-summary-${d.id}`}
                        sx={{ maxWidth: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {summary}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          data-testid={`pricing-duration-edit-${d.id}`}
                          onClick={() => openEditDialog(d.id)}
                          size="small"
                        ><EditOutlined /></IconButton>
                        <IconButton
                          data-testid={`pricing-duration-remove-${d.id}`}
                          onClick={() => setConfirmRemove(d.id)}
                          size="small"
                        ><DeleteOutlineOutlined /></IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`${d.id}-details`}>
                      <TableCell colSpan={4} sx={{ p: 0, border: 0 }}>
                        <Collapse in={isExp} data-testid={`pricing-duration-details-${d.id}`}>
                          <Box sx={{ p: 2, bgcolor: '#F9FAFB' }}>
                            {d.tiers.map((t) => (
                              <Box key={t.id} sx={{ mb: 1.5 }}>
                                <Typography sx={{ fontWeight: 600 }}>{t.label}</Typography>
                                {t.bands.map((b) => (
                                  <Typography key={b.id} sx={{ fontSize: '0.85rem', ml: 2 }}>
                                    {b.name}: £{b.price}
                                  </Typography>
                                ))}
                                {dieselSurchargeEnabled && (
                                  <Typography sx={{ fontSize: '0.85rem', ml: 2, color: tokens.MUTED }}>
                                    Diesel Surcharge: {t.dieselSurcharge}%
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
              {visibleDurations.length === 0 && durations.length > 0 && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ color: tokens.MUTED, fontStyle: 'italic' }}
                    data-testid="pricing-durations-no-match">
                    No durations match the current search or filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<SaveOutlined />}
          data-testid="pricing-config-save"
          onClick={() => {
            if (!validateDates(startDate, endDate)) return;
            persist();
            setSavedFlash(true);
            setTimeout(() => setSavedFlash(false), 2500);
          }}
        >Save</Button>
        {savedFlash && <Typography sx={{ color: '#2E7D32', fontSize: '0.85rem' }} data-testid="pricing-saved-flash">Saved.</Typography>}
      </Stack>

      {/* Remove-duration confirmation */}
      <Dialog open={!!confirmRemove} onClose={() => setConfirmRemove(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent data-testid="pricing-remove-duration-body">
          Are you sure you want to delete this duration?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemove(null)} data-testid="pricing-remove-duration-cancel">Cancel</Button>
          <Button color="error" variant="contained"
            data-testid="pricing-remove-duration-confirm"
            onClick={() => confirmRemove && removeDuration(confirmRemove)}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Add / edit duration dialog */}
      <Dialog open={!!durationDialog} onClose={() => setDurationDialog(null)} maxWidth="md" fullWidth>
        <DialogTitle>{durationDialog?.mode === 'create' ? 'Add Duration' : 'Edit Duration'}</DialogTitle>
        <DialogContent>
          {durationDialog && (
            <DurationEditor
              value={durationDialog.draft}
              onChange={(draft) => setDurationDialog({ ...durationDialog, draft })}
              tierPricingEnabled={tierPricingEnabled}
              dieselSurchargeEnabled={dieselSurchargeEnabled}
            />
          )}
          {addError && <Alert severity="error" sx={{ mt: 2 }} data-testid="pricing-dialog-error">{addError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDurationDialog(null); setAddError(''); }} data-testid="pricing-duration-cancel">Cancel</Button>
          <Button variant="contained" onClick={saveDurationDialog} data-testid="pricing-duration-save">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// -------------------------------------------------------------------------------------
function DurationEditor({
  value, onChange, tierPricingEnabled, dieselSurchargeEnabled,
}: {
  value: Duration;
  onChange: (d: Duration) => void;
  tierPricingEnabled: boolean;
  dieselSurchargeEnabled: boolean;
}) {
  const setField = <K extends keyof Duration>(k: K, v: Duration[K]) => onChange({ ...value, [k]: v });

  const addTier = () => {
    if (!tierPricingEnabled) return;
    if (value.tiers.length >= MAX_TIERS) return;
    onChange({ ...value, tiers: [...value.tiers, makeEmptyTier(value.tiers.length + 1)] });
  };
  const duplicateTier = (id: string) => {
    if (!tierPricingEnabled) return;
    if (value.tiers.length >= MAX_TIERS) return;
    const t = value.tiers.find((x) => x.id === id);
    if (!t) return;
    const clone: Tier = {
      ...t, id: uid('tier'), label: `Tier ${value.tiers.length + 1}`,
      bands: t.bands.map((b) => ({ ...b, id: uid('band') })),
    };
    const idx = value.tiers.findIndex((x) => x.id === id);
    const next = [...value.tiers];
    next.splice(idx + 1, 0, clone);
    onChange({ ...value, tiers: next });
  };
  const removeTier = (id: string) => {
    if (value.tiers.length <= 1) return;
    onChange({ ...value, tiers: value.tiers.filter((t) => t.id !== id) });
  };
  const updateTier = (id: string, patch: Partial<Tier>) => {
    onChange({ ...value, tiers: value.tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
  };
  const addBand = (tierId: string) => {
    const tier = value.tiers.find((t) => t.id === tierId);
    if (!tier) return;
    const letter = String.fromCharCode(65 + tier.bands.length); // A, B, C...
    updateTier(tierId, { bands: [...tier.bands, makeEmptyBand(letter)] });
  };
  const duplicateBand = (tierId: string, bandId: string) => {
    const tier = value.tiers.find((t) => t.id === tierId);
    if (!tier) return;
    const band = tier.bands.find((b) => b.id === bandId);
    if (!band) return;
    const letter = String.fromCharCode(65 + tier.bands.length);
    updateTier(tierId, { bands: [...tier.bands, { ...band, id: uid('band'), name: `Band ${letter}` }] });
  };
  const removeBand = (tierId: string, bandId: string) => {
    const tier = value.tiers.find((t) => t.id === tierId);
    if (!tier || tier.bands.length <= 1) return;
    updateTier(tierId, { bands: tier.bands.filter((b) => b.id !== bandId) });
  };

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Frequency (1–100)"
          type="number"
          size="small"
          value={value.frequency}
          onChange={(e) => {
            const n = e.target.value === '' ? '' : Math.max(1, Math.min(100, Number(e.target.value)));
            setField('frequency', n as any);
          }}
          inputProps={{ min: 1, max: 100, 'data-testid': 'duration-frequency-input' }}
          sx={{ minWidth: 180 }}
        />
        <Select
          value={value.period}
          onChange={(e) => setField('period', e.target.value as Period)}
          size="small"
          displayEmpty
          inputProps={{ 'data-testid': 'duration-period-select' }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value=""><em>Period</em></MenuItem>
          {PERIODS.map((p) => (
            <MenuItem key={p} value={p} data-testid={`duration-period-opt-${p}`}>{p}</MenuItem>
          ))}
        </Select>
      </Stack>

      <Divider>Tier Pricing {tierPricingEnabled ? '' : '(disabled at Contract level — Band pricing only)'}</Divider>

      {value.tiers.map((t, ti) => (
        <Paper key={t.id} variant="outlined" sx={{ p: 1.5 }} data-testid={`duration-tier-${ti}`}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>{t.label}</Typography>
            {tierPricingEnabled && (
              <>
                <IconButton size="small" data-testid={`duration-tier-duplicate-${ti}`}
                  onClick={() => duplicateTier(t.id)}
                  disabled={value.tiers.length >= MAX_TIERS}>
                  <ContentCopyOutlined fontSize="small" />
                </IconButton>
                {value.tiers.length > 1 && (
                  <IconButton size="small" data-testid={`duration-tier-remove-${ti}`}
                    onClick={() => removeTier(t.id)}>
                    <DeleteOutlineOutlined fontSize="small" />
                  </IconButton>
                )}
              </>
            )}
          </Stack>
          <Stack spacing={1}>
            {t.bands.map((b, bi) => (
              <Stack key={b.id} direction="row" spacing={1} alignItems="center"
                data-testid={`duration-band-${ti}-${bi}`}>
                <TextField
                  size="small" label="Band" value={b.name}
                  onChange={(e) => updateTier(t.id, {
                    bands: t.bands.map((x) => (x.id === b.id ? { ...x, name: e.target.value } : x)),
                  })}
                  inputProps={{ 'data-testid': `duration-band-name-${ti}-${bi}` }}
                  sx={{ minWidth: 120 }}
                />
                <TextField
                  size="small" label="Price" type="number"
                  value={b.price}
                  onChange={(e) => updateTier(t.id, {
                    bands: t.bands.map((x) => (x.id === b.id
                      ? { ...x, price: e.target.value === '' ? '' : Number(e.target.value) } : x)),
                  })}
                  InputProps={{ startAdornment: <InputAdornment position="start">£</InputAdornment> }}
                  inputProps={{ min: 0, max: 1000, step: '0.01', 'data-testid': `duration-band-price-${ti}-${bi}` }}
                  sx={{ minWidth: 160 }}
                />
                <IconButton size="small" data-testid={`duration-band-duplicate-${ti}-${bi}`}
                  onClick={() => duplicateBand(t.id, b.id)}>
                  <ContentCopyOutlined fontSize="small" />
                </IconButton>
                {t.bands.length > 1 && (
                  <IconButton size="small" data-testid={`duration-band-remove-${ti}-${bi}`}
                    onClick={() => removeBand(t.id, b.id)}>
                    <DeleteOutlineOutlined fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            ))}
            <Button
              size="small" startIcon={<AddOutlined />}
              data-testid={`duration-band-add-${ti}`}
              onClick={() => addBand(t.id)}
              sx={{ alignSelf: 'flex-start' }}
            >Add Band</Button>
            {dieselSurchargeEnabled && (
              <TextField
                size="small" label="Diesel Surcharge (%)" type="number" required
                value={t.dieselSurcharge}
                onChange={(e) => updateTier(t.id, {
                  dieselSurcharge: e.target.value === '' ? '' : Number(e.target.value),
                })}
                inputProps={{ min: 1, max: 100, step: '0.1', 'data-testid': `duration-diesel-${ti}` }}
                sx={{ maxWidth: 220 }}
              />
            )}
          </Stack>
        </Paper>
      ))}
      {tierPricingEnabled && (
        <Button
          size="small" startIcon={<AddOutlined />}
          data-testid="duration-tier-add"
          onClick={addTier}
          disabled={value.tiers.length >= MAX_TIERS}
          sx={{ alignSelf: 'flex-start' }}
        >Add Tier</Button>
      )}
    </Stack>
  );
}

export default PricingConfigurationTab;
