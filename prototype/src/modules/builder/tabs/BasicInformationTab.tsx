import { Alert, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Section } from '../../../shared/Section';
import { FieldHint } from '../../../shared/FieldHint';
import { permissionTypes, groupsByType, categories, Permission } from '../../../data/mock';

export function BasicInformationTab({ permission }: { permission?: Permission }) {
  const [name, setName] = useState(permission?.name ?? '');
  const [type, setType] = useState<string>(permission?.type ?? '');
  const [group, setGroup] = useState<string>(permission?.group ?? '');
  const [category, setCategory] = useState<string>(permission?.category ?? '');
  const [description, setDescription] = useState('');

  const groups = type ? groupsByType[type] ?? [] : [];
  const nameLimit = 100;
  const descLimit = 500;
  const nameError = name.length === 0 ? '' : (name.length > nameLimit ? `Max ${nameLimit} characters` : '');

  return (
    <>
      <Alert severity="info" sx={{ mb: 3, background: '#F4F1E8', border: '1px solid #E4E1D8', color: 'text.primary' }}>
        Basic information identifies this permission. The <b>Name</b> is shown to applicants; <b>Type</b>, <b>Group</b> and <b>Category</b> determine where it appears in the Back Office and the Buy Now flow.
      </Alert>

      <Section
        title="Identity"
        description="A short, unique name and its classification."
      >
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={8}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Permission Name<span style={{ color: '#B23A48' }}> *</span>
              <FieldHint text="Unique across all permissions. Displayed to applicants. Maximum 100 characters." />
            </Typography>
            <TextField
              placeholder="e.g. City Centre Resident 2026"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, nameLimit))}
              helperText={nameError || `${name.length}/${nameLimit}`}
              error={!!nameError}
              inputProps={{ maxLength: nameLimit }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Type<span style={{ color: '#B23A48' }}> *</span>
              <FieldHint text="High-level permit family. Options come from the contract's enabled types." />
            </Typography>
            <TextField
              select
              value={type}
              onChange={(e) => { setType(e.target.value); setGroup(''); }}
              placeholder="Select type"
            >
              {permissionTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Group<span style={{ color: '#B23A48' }}> *</span>
              <FieldHint text="Groups within the chosen Type. Only groups belonging to this Type are shown." />
            </Typography>
            <TextField
              select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              disabled={!type}
              helperText={!type ? 'Pick a type first' : ''}
            >
              {groups.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Category<span style={{ color: '#B23A48' }}> *</span>
              <FieldHint text="Reporting/analytical category. Independent of Type/Group." />
            </Typography>
            <TextField select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4} />

          <Grid item xs={12}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Description
              <FieldHint text="Internal description shown in the Back Office grid. Up to 500 characters." />
            </Typography>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, descLimit))}
              multiline
              minRows={3}
              helperText={`${description.length}/${descLimit}`}
              inputProps={{ maxLength: descLimit }}
              placeholder="For example: 12-month resident permit for the City Centre parking zone including 3 vehicles and unlimited visitor scratchcards."
            />
          </Grid>
        </Grid>
      </Section>

      <Section title="Preview" description="How this appears elsewhere in the app.">
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <PreviewCard title="In the Back Office grid" body={name || 'Permission Name'} sub={`${type || 'Type'} · ${group || 'Group'}`} />
          <PreviewCard title="In Buy Now (customer)" body={name || 'Permission Name'} sub={description || 'No description yet.'} />
        </Stack>
      </Section>
    </>
  );
}

function PreviewCard({ title, body, sub }: { title: string; body: string; sub: string }) {
  return (
    <div style={{ flex: '1 1 300px', border: '1px solid #E4E1D8', padding: 16, borderRadius: 6, background: '#FFFFFF' }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{title}</Typography>
      <Typography sx={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: '1.15rem', fontWeight: 600, mt: 0.75 }}>{body}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{sub}</Typography>
    </div>
  );
}
