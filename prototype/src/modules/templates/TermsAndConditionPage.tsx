import { useMemo, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer,
  IconButton, MenuItem, Stack, TextField, Typography, Divider, Chip,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { PageHeader } from '../../shared/PageHeader';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../components/Toast';

const PERMISSION_TYPES = [
  'Resident Permit', 'Visitor Permit', 'Business Permit', 'Blue Badge',
  'Suspension', 'Dispensation', 'Scratch Card',
];

type Template = {
  id: string;
  templateName: string;
  permissionType: string;
  content: string;
  published: boolean;
  version: number;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
};

const seed = (): Template[] => [
  {
    id: 'TC-001', templateName: 'Resident Permit T&C 2024', permissionType: 'Resident Permit',
    content: '<p>By applying for a resident permit you agree to the terms outlined in this agreement...</p>',
    published: true, version: 1,
    createdOn: '02/01/2024', createdBy: 'System Admin',
    updatedOn: '10/06/2024', updatedBy: 'Sarah Johnson',
  },
  {
    id: 'TC-002', templateName: 'Visitor Permit T&C', permissionType: 'Visitor Permit',
    content: '<p>Visitor permits are valid only for the vehicle registered and cannot be transferred...</p>',
    published: true, version: 1,
    createdOn: '15/01/2024', createdBy: 'System Admin',
    updatedOn: '15/01/2024', updatedBy: 'System Admin',
  },
  {
    id: 'TC-003', templateName: 'Business Permit T&C v2', permissionType: 'Business Permit',
    content: '<p>Business permits are issued for commercial use and require valid registration...</p>',
    published: false, version: 2,
    createdOn: '20/03/2024', createdBy: 'Mark Peters',
    updatedOn: '05/06/2024', updatedBy: 'Mark Peters',
  },
];

type PanelMode = 'closed' | 'view' | 'edit' | 'add';

const strip = (html: string) => html.replace(/<p>|<\/p>|<br\s*\/?>|&nbsp;/gi, '').trim();

export function TermsAndConditionPage() {
  const showToast = useToast();
  const [rows, setRows] = usePersistentState<Template[]>('prototype:templates:tnc:rows', seed);
  const [search, setSearch] = useState('');
  const [panel, setPanel] = useState<PanelMode>('closed');
  const [target, setTarget] = useState<Template | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);

  const [name, setName] = useState('');
  const [permType, setPermType] = useState('');
  const [content, setContent] = useState('');

  useMemo(() => {
    if (panel === 'add') { setName(''); setPermType(''); setContent(''); }
    else if (panel === 'edit' && target) {
      setName(target.templateName); setPermType(target.permissionType); setContent(target.content);
    }
  }, [panel, target]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      r.templateName.toLowerCase().includes(q) || r.permissionType.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const saveable =
    name.trim().length > 0 && name.trim().length <= 1000 &&
    permType.length > 0 &&
    strip(content).length > 0 && strip(content).length <= 1000;

  const save = () => {
    if (!saveable) return;
    const now = new Date().toLocaleDateString('en-GB');
    if (panel === 'add') {
      const id = `TC-${String(rows.length + 1).padStart(3, '0')}`;
      setRows([...rows, {
        id, templateName: name.trim(), permissionType: permType, content,
        published: false, version: 1, createdOn: now, createdBy: 'Current User',
        updatedOn: now, updatedBy: 'Current User',
      }]);
      showToast('Template created successfully', 'success');
    } else if (panel === 'edit' && target) {
      // Versioning: create new version, keep old
      const nextVersion = target.version + 1;
      const newId = `${target.id}-v${nextVersion}`;
      const newTemplate: Template = {
        id: newId,
        templateName: name.trim(),
        permissionType: permType,
        content,
        published: false, // New version starts as draft
        version: nextVersion,
        createdOn: target.createdOn,
        createdBy: target.createdBy,
        updatedOn: now,
        updatedBy: 'Current User',
      };
      setRows([...rows, newTemplate]);
      showToast(`Template updated (new version ${nextVersion} created)`, 'success');
    }
    setPanel('closed'); setTarget(null);
  };

  const doDelete = () => {
    if (!deleteTarget) return;
    setRows(rows.filter((r) => r.id !== deleteTarget.id));
    showToast('Template deleted successfully', 'success');
    setDeleteTarget(null);
  };

  const bulkPublish = () => {
    const ids = new Set(selection.map(String));
    setRows((prev) => prev.map((r) => ids.has(String(r.id)) ? { ...r, published: true } : r));
    setSelection([]);
    showToast(`${ids.size} template(s) published`, 'success');
  };

  const bulkDelete = () => {
    const ids = new Set(selection.map(String));
    setRows(rows.filter((r) => !ids.has(String(r.id))));
    setSelection([]);
    showToast(`${ids.size} template(s) deleted`, 'success');
  };

  const cols: GridColDef[] = [
    {
      field: 'templateName', headerName: 'Template Name', flex: 1.4, minWidth: 220,
      renderCell: (p) => (
        <Button size="small" variant="text" sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={() => { setTarget(p.row as Template); setPanel('view'); }}>
          {p.value}
        </Button>
      ),
    },
    { field: 'permissionType', headerName: 'Permission Type', width: 170 },
    { field: 'version', headerName: 'Version', width: 90 },
    {
      field: 'published', headerName: 'Status', width: 120,
      renderCell: (p) => (
        <Chip size="small" label={p.value ? 'Published' : 'Draft'}
          color={p.value ? 'success' : 'default'} variant={p.value ? 'filled' : 'outlined'} />
      ),
    },
    { field: 'createdOn', headerName: 'Created On', width: 130 },
    { field: 'createdBy', headerName: 'Created By', width: 160 },
    { field: 'updatedOn', headerName: 'Updated On', width: 130 },
    { field: 'updatedBy', headerName: 'Updated By', width: 160 },
    {
      field: 'actions', headerName: 'Action', width: 90, sortable: false, filterable: false,
      renderCell: (p) => (
        <IconButton size="small" color="error" onClick={() => setDeleteTarget(p.row as Template)}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader eyebrow="Templates" title="Terms and Condition"
        description="Terms & Conditions templates linked to permission types." />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }} alignItems="center">
        <TextField size="small" placeholder="Search by Template Name, Permission Type"
          value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 320 }} />
        <Box sx={{ flex: 1 }} />
        {selection.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {selection.length} Row Selected
            </Typography>
            <Button variant="outlined" onClick={bulkPublish}>Publish</Button>
            <Button variant="outlined" color="error" onClick={bulkDelete}>Delete</Button>
          </>
        )}
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setTarget(null); setPanel('add'); }}>
          Add Template
        </Button>
      </Stack>

      <Box sx={{ height: 560, bgcolor: 'background.paper', borderRadius: 1 }}>
        <DataGrid rows={filtered} columns={cols} getRowId={(r) => r.id} density="compact"
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection disableRowSelectionOnClick
          rowSelectionModel={selection}
          onRowSelectionModelChange={setSelection} />
      </Box>

      <Drawer anchor="right" open={panel !== 'closed'} onClose={() => { setPanel('closed'); setTarget(null); }}
        PaperProps={{ sx: { width: { xs: '100%', sm: 720 } } }}>
        <Stack sx={{ height: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between"
            sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
            <Typography variant="h6">
              {panel === 'view' ? 'View Template' : panel === 'edit' ? 'Edit Template' : 'Create Template'}
            </Typography>
            <Stack direction="row" spacing={1}>
              {panel === 'view' && target && (
                <Button size="small" startIcon={<EditIcon />} onClick={() => setPanel('edit')}>Edit</Button>
              )}
              <IconButton onClick={() => { setPanel('closed'); setTarget(null); }}><CloseIcon /></IconButton>
            </Stack>
          </Stack>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
            {panel === 'view' && target ? (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Template Name</Typography>
                  <Typography variant="body1" fontWeight={600}>{target.templateName}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Permission Type</Typography>
                  <Typography variant="body2">{target.permissionType}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">Template Content</Typography>
                  <Box sx={{ mt: 1, p: 2, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'grey.50' }}
                    dangerouslySetInnerHTML={{ __html: target.content }} />
                </Box>
                <Divider />
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography variant="body2">{target.createdOn} · {target.createdBy}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Updated</Typography>
                    <Typography variant="body2">{target.updatedOn} · {target.updatedBy}</Typography>
                  </Box>
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={2.5}>
                <TextField label="Template Name *" fullWidth size="small" value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 1000))}
                  helperText={`${name.length}/1000`} />
                <TextField label="Permission Type *" fullWidth size="small" select
                  value={permType} onChange={(e) => setPermType(e.target.value)}>
                  {PERMISSION_TYPES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Template Content *</Typography>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                    <Stack direction="row" spacing={0.5} sx={{ px: 1, py: 0.5, bgcolor: 'grey.100', borderBottom: 1, borderColor: 'divider' }}>
                      <Chip label="B" size="small" sx={{ fontWeight: 700 }} />
                      <Chip label="I" size="small" sx={{ fontStyle: 'italic' }} />
                      <Chip label="U" size="small" sx={{ textDecoration: 'underline' }} />
                      <Chip label="• List" size="small" />
                      <Chip label="1. List" size="small" />
                      <Chip label="🔗 Link" size="small" />
                    </Stack>
                    <TextField multiline fullWidth minRows={10} value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter template body (HTML supported)…"
                      InputProps={{ sx: { borderRadius: 0, '& fieldset': { border: 'none' } } }} />
                  </Box>
                  <Typography variant="caption" color={strip(content).length > 1000 ? 'error' : 'text.secondary'}>
                    {strip(content).length}/1000 characters
                  </Typography>
                </Box>
              </Stack>
            )}
          </Box>

          {panel !== 'view' && (
            <Stack direction="row" spacing={1} justifyContent="flex-end"
              sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button onClick={() => { setPanel('closed'); setTarget(null); }}>Cancel</Button>
              <Button variant="contained" disabled={!saveable} onClick={save}>Save</Button>
            </Stack>
          )}
        </Stack>
      </Drawer>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete template?</DialogTitle>
        <DialogContent>
          <Typography>
            Delete <strong>{deleteTarget?.templateName}</strong>? Applications already using this template will be unaffected.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={doDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
