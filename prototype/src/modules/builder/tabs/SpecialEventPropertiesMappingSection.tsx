// US-187108 — Special Event Properties Mapping section.
// Rendered under Permissions tab sub-nav when General Settings > Special Event = Enable.
// Replaces "Zone Mapping" for special-event permissions.
import { useMemo, useState } from 'react';
import {
  Alert, Autocomplete, Box, Button, Checkbox, Chip, IconButton, Paper, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,
  Collapse,
} from '@mui/material';
import {
  AddOutlined, DeleteOutlineOutlined, ExpandLessOutlined, ExpandMoreOutlined,
  SaveOutlined, InfoOutlined,
} from '@mui/icons-material';
import { tokens } from '../../../theme';
import { usePersistentState } from '../../../hooks/usePersistentState';
import { streets as allStreets, properties as allProperties } from '../../../data/mock';

export type SEPMMapping = {
  savedAt?: string;
  // streetId -> array of selected property ids
  streets: Record<string, string[]>;
};

const EMPTY_MAPPING: SEPMMapping = { streets: {} };

export function SpecialEventPropertiesMappingSection({
  permissionId,
  showErrors = false,
}: {
  permissionId: string;
  showErrors?: boolean;
}) {
  const storageKey = `prototype:builder:${permissionId}:sepm`;
  const [mapping, setMapping] = usePersistentState<SEPMMapping>(storageKey, EMPTY_MAPPING);
  const [addOpen, setAddOpen] = useState(false);
  const [streetSearch, setStreetSearch] = useState('');
  const [propertySearch, setPropertySearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const addedStreetIds = Object.keys(mapping.streets);

  // Add a street to the map (initialized with no properties selected).
  const addStreet = (id: string) => {
    if (!id || addedStreetIds.includes(id)) return;
    setMapping({ ...mapping, streets: { ...mapping.streets, [id]: [] } });
    setExpanded((e) => ({ ...e, [id]: true }));
    setSaveError(null);
  };

  const removeStreet = (id: string) => {
    const next = { ...mapping.streets };
    delete next[id];
    setMapping({ ...mapping, streets: next });
  };

  const toggleProperty = (streetId: string, propId: string) => {
    const cur = mapping.streets[streetId] ?? [];
    const next = cur.includes(propId) ? cur.filter((x) => x !== propId) : [...cur, propId];
    setMapping({ ...mapping, streets: { ...mapping.streets, [streetId]: next } });
  };

  const toggleAllInStreet = (streetId: string, all: boolean) => {
    const propsInStreet = allProperties.filter((p) => p.streetId === streetId).map((p) => p.id);
    setMapping({
      ...mapping,
      streets: { ...mapping.streets, [streetId]: all ? propsInStreet : [] },
    });
  };

  const handleSave = () => {
    const streetIds = Object.keys(mapping.streets);
    const anyPropSelected = streetIds.some((s) => (mapping.streets[s] ?? []).length > 0);
    if (streetIds.length === 0 || !anyPropSelected) {
      setSaveError('Please select at least one street and one property to map.');
      setSavedFlash(false);
      return;
    }
    setSaveError(null);
    setMapping({ ...mapping, savedAt: new Date().toISOString() });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  };

  // "equals" logic filter — case-insensitive exact match. Empty = no filter.
  const streetMatchesSearch = (name: string) =>
    !streetSearch || name.trim().toLowerCase() === streetSearch.trim().toLowerCase();

  const propertyMatchesSearch = (name: string) =>
    !propertySearch || name.trim().toLowerCase() === propertySearch.trim().toLowerCase();

  const streetOptions = useMemo(
    () => allStreets.filter((s) => !addedStreetIds.includes(s.id)),
    [addedStreetIds],
  );

  const totalMapped = Object.values(mapping.streets).reduce((n, arr) => n + arr.length, 0);

  return (
    <Box data-testid="sepm-section">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.05rem', color: tokens.INK }}>
            Special Event Properties Mapping
          </Typography>
          <Chip data-testid="sepm-count" size="small"
            label={`${addedStreetIds.length} streets · ${totalMapped} properties`} />
        </Stack>
        <Button
          data-testid="sepm-add-street-btn"
          variant="outlined"
          startIcon={<AddOutlined />}
          onClick={() => setAddOpen((o) => !o)}
          sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
        >
          Add Street
        </Button>
      </Stack>

      {addOpen && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }} data-testid="sepm-add-panel">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center">
            <Autocomplete
              size="small"
              options={streetOptions}
              getOptionLabel={(o) => `${o.name} (${o.usrn})`}
              sx={{ minWidth: 320, flex: 1 }}
              onChange={(_, val) => val && addStreet(val.id)}
              renderInput={(params) => (
                <TextField {...params} label="Select street" placeholder="Search…"
                  inputProps={{ ...params.inputProps, 'data-testid': 'sepm-street-picker' }} />
              )}
            />
            <Button data-testid="sepm-add-panel-close" onClick={() => setAddOpen(false)}>Close</Button>
          </Stack>
        </Paper>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search property (equals)"
          size="small"
          value={propertySearch}
          onChange={(e) => setPropertySearch(e.target.value)}
          inputProps={{ 'data-testid': 'sepm-search-property' }}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Search street (equals)"
          size="small"
          value={streetSearch}
          onChange={(e) => setStreetSearch(e.target.value)}
          inputProps={{ 'data-testid': 'sepm-search-street' }}
          sx={{ flex: 1 }}
        />
      </Stack>

      {addedStreetIds.length === 0 && (
        <Alert severity="info" icon={<InfoOutlined />} data-testid="sepm-empty">
          No streets have been added yet. Click <b>Add Street</b> to begin mapping properties.
        </Alert>
      )}

      <Stack spacing={1.5}>
        {addedStreetIds.map((sid) => {
          const street = allStreets.find((s) => s.id === sid);
          if (!street) return null;
          if (!streetMatchesSearch(street.name)) return null;

          const propsInStreet = allProperties.filter((p) => p.streetId === sid);
          const visibleProps = propsInStreet.filter((p) => propertyMatchesSearch(p.name));
          const selected = mapping.streets[sid] ?? [];
          const allSelected = propsInStreet.length > 0 && selected.length === propsInStreet.length;
          const someSelected = selected.length > 0 && !allSelected;
          const isExpanded = expanded[sid] !== false;

          return (
            <Paper key={sid} variant="outlined" data-testid={`sepm-street-${sid}`}>
              <Stack direction="row" alignItems="center" sx={{ px: 1.5, py: 1, borderBottom: isExpanded ? '1px solid #E5E7EB' : 'none' }}>
                <IconButton
                  size="small"
                  data-testid={`sepm-street-toggle-${sid}`}
                  onClick={() => setExpanded((e) => ({ ...e, [sid]: !isExpanded }))}
                >
                  {isExpanded ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                </IconButton>
                <Checkbox
                  size="small"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(_, v) => toggleAllInStreet(sid, v)}
                  inputProps={{ 'aria-label': 'select all', ...({ 'data-testid': `sepm-street-select-all-${sid}` } as any) }}
                />
                <Typography sx={{ fontWeight: 700, mr: 1 }} data-testid={`sepm-street-name-${sid}`}>
                  {street.name}
                </Typography>
                <Chip size="small" label={street.usrn} sx={{ mr: 1 }} />
                <Chip size="small" color={selected.length ? 'primary' : 'default'}
                  label={`${selected.length}/${propsInStreet.length} selected`}
                  data-testid={`sepm-street-summary-${sid}`} />
                <Box sx={{ flex: 1 }} />
                <IconButton
                  data-testid={`sepm-street-remove-${sid}`}
                  onClick={() => removeStreet(sid)}
                  size="small"
                  aria-label="remove street"
                >
                  <DeleteOutlineOutlined fontSize="small" />
                </IconButton>
              </Stack>
              <Collapse in={isExpanded}>
                <Box sx={{ px: 1.5, py: 1 }}>
                  {propsInStreet.length === 0 ? (
                    <Typography data-testid={`sepm-street-empty-${sid}`} sx={{ color: tokens.MUTED, fontSize: '0.85rem', py: 1 }}>
                      No properties available for the selected street.
                    </Typography>
                  ) : (
                    <Table size="small" data-testid={`sepm-street-table-${sid}`}>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox" />
                          <TableCell sx={{ fontWeight: 700 }}>Property Name</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>UPRN</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Permission Limit</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {visibleProps.map((p) => {
                          const checked = selected.includes(p.id);
                          return (
                            <TableRow key={p.id} data-testid={`sepm-property-row-${p.id}`} hover>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  size="small"
                                  checked={checked}
                                  onChange={() => toggleProperty(sid, p.id)}
                                  inputProps={{ ...({ 'data-testid': `sepm-property-check-${p.id}` } as any) }}
                                />
                              </TableCell>
                              <TableCell>{p.name}</TableCell>
                              <TableCell>{p.uprn}</TableCell>
                              <TableCell>{p.permissionLimit}</TableCell>
                            </TableRow>
                          );
                        })}
                        {visibleProps.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} sx={{ color: tokens.MUTED, fontStyle: 'italic' }}
                              data-testid={`sepm-street-nofilter-${sid}`}>
                              No properties match the current filter.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
        <Button
          data-testid="sepm-save-btn"
          variant="contained"
          startIcon={<SaveOutlined />}
          onClick={handleSave}
          sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
        >
          Save Mapping
        </Button>
        {saveError && (
          <Typography data-testid="sepm-save-error" sx={{ color: '#C62828', fontSize: '0.85rem' }}>
            {saveError}
          </Typography>
        )}
        {savedFlash && (
          <Typography data-testid="sepm-saved-flash" sx={{ color: '#2E7D32', fontSize: '0.85rem' }}>
            Mapping saved.
          </Typography>
        )}
        {mapping.savedAt && !savedFlash && (
          <Typography data-testid="sepm-saved-at" sx={{ color: tokens.MUTED, fontSize: '0.8rem' }}>
            Last saved: {new Date(mapping.savedAt).toLocaleString()}
          </Typography>
        )}
      </Stack>

      {showErrors && addedStreetIds.length === 0 && (
        <Typography sx={{ color: '#C62828', fontSize: '0.85rem', mt: 1 }}>
          At least one property should be mapped for Special Event to publish.
        </Typography>
      )}
    </Box>
  );
}

export default SpecialEventPropertiesMappingSection;
