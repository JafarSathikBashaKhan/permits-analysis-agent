import {
  Box, Button, Drawer, Divider, Grid,
  IconButton, InputAdornment, Paper, Stack, Tab, Tabs, TextField, Typography, Chip,
} from '@mui/material';
import { Add, Upload, Close, Cancel } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, KeyboardEvent } from 'react';
import { PageHeader } from '../../shared/PageHeader';
import { streets } from '../../data/mock';
import { tokens } from '../../theme';

export function StreetsPage() {
  const [tab, setTab] = useState<'White' | 'Black'>('White');
  const [open, setOpen] = useState(false);
  const rows = streets.filter((s) => s.status === tab);
  const cols: GridColDef[] = [
    { field: 'usrn', headerName: 'USRN', width: 140 },
    { field: 'name', headerName: 'Street name', flex: 1, minWidth: 220 },
    { field: 'zone', headerName: 'Zone', width: 200 },
    ...(tab === 'Black' ? [{ field: 'expires', headerName: 'Blacklist expiry', width: 160, valueGetter: () => 'Indefinite' }] : []),
  ];

  return (
    <>
      <PageHeader
        eyebrow="Area"
        title="Streets"
        description="White list allows applications; Black list restricts them for a fixed or indefinite period."
        actions={
          <>
            <Button variant="outlined" startIcon={<Upload />} sx={{ mr: 1 }}>Bulk import CSV</Button>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>New street</Button>
          </>
        }
      />
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label={`White list (${streets.filter((s) => s.status === 'White').length})`} value="White" />
          <Tab label={`Black list (${streets.filter((s) => s.status === 'Black').length})`} value="Black" />
        </Tabs>
      </Paper>
      <Paper>
        <Box sx={{ height: 520 }}>
          <DataGrid rows={rows} columns={cols} disableRowSelectionOnClick />
        </Box>
      </Paper>

      <NewStreetDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function NewStreetDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [streetName, setStreetName] = useState('');
  const [usrn, setUsrn] = useState('');
  const [town, setTown] = useState('');
  const [propertyDraft, setPropertyDraft] = useState('');
  const [properties, setProperties] = useState<string[]>([]);

  const reset = () => {
    setStreetName(''); setUsrn(''); setTown(''); setPropertyDraft(''); setProperties([]);
  };
  const handleClose = () => { reset(); onClose(); };

  const addProperty = () => {
    const v = propertyDraft.trim();
    if (!v) return;
    setProperties((p) => [...p, v]);
    setPropertyDraft('');
  };
  const removeProperty = (i: number) =>
    setProperties((p) => p.filter((_, idx) => idx !== i));

  const onPropertyKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addProperty(); }
  };

  const canSubmit = streetName.trim() && usrn.trim() && town.trim();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 560, md: 640 }, display: 'flex', flexDirection: 'column' } }}
    >
      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontFamily: tokens.HEADING, fontWeight: 700, fontSize: '1.25rem', color: tokens.INK }}>
          New Street
        </Typography>
        <IconButton onClick={handleClose} size="small" edge="end">
          <Close />
        </IconButton>
      </Box>
      <Divider />

      <Box sx={{ px: 3, py: 3, flex: 1, overflowY: 'auto' }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <FieldLabel>Street Name</FieldLabel>
            <TextField
              placeholder="Enter Street Name"
              value={streetName}
              onChange={(e) => setStreetName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldLabel>USRN</FieldLabel>
            <TextField
              placeholder="USRN"
              value={usrn}
              onChange={(e) => setUsrn(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <FieldLabel>Town Name</FieldLabel>
            <TextField
              placeholder="Town Name"
              value={town}
              onChange={(e) => setTown(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <FieldLabel>Add Properties/Buildings Name &amp; No</FieldLabel>
            <TextField
              placeholder="Type and press enter to add"
              value={propertyDraft}
              onChange={(e) => setPropertyDraft(e.target.value)}
              onKeyDown={onPropertyKey}
              InputProps={{
                endAdornment: propertyDraft ? (
                  <InputAdornment position="end">
                    <Button size="small" onClick={addProperty}>Add</Button>
                  </InputAdornment>
                ) : undefined,
              }}
            />
            {properties.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
                {properties.map((p, i) => (
                  <Chip
                    key={`${p}-${i}`}
                    label={p}
                    onDelete={() => removeProperty(i)}
                    deleteIcon={<Cancel />}
                    sx={{ bgcolor: tokens.TINT_BLUE, color: tokens.NAVY_INK, fontWeight: 500 }}
                  />
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Box>

      <Divider />
      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 700 }}>
          {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" onClick={handleClose} sx={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!canSubmit}
            onClick={handleClose}
            sx={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}
          >
            Add Street
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: '0.9rem', color: tokens.INK, fontWeight: 500, mb: 0.75 }}>
      {children}
    </Typography>
  );
}
