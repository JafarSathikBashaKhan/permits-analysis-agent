import {
  Box, Button, Drawer, IconButton, Stack, TextField, Typography, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useMemo, useState, useEffect } from 'react';
import { PERMISSION_TYPE_CATALOGUE, Permission } from '../../data/mock';
import { tokens } from '../../theme';
import { useToast } from '../../components/Toast';

type Group = { id: string; name: string; permissionType: string };

export type CreatePermissionSliderProps = {
  open: boolean;
  onClose: () => void;
  existingPermissions: Permission[];
  groups: Group[];
  onCreate: (row: Permission) => void;
};

const NAME_MAX = 100;
const DESC_MAX = 500;

/**
 * US-132611 — Permission Setup | Builder – Create Permission
 *
 * Right-side slider panel with 4 required fields:
 *   Permission Name (≤100 chars, unique, required)
 *   Type            (dropdown of default + custom types, required)
 *   Group           (dropdown filtered by Type; empty-state message; required)
 *   Description     (≤500 chars, required)
 *
 * On Create → new row is added to the Builder list with status 'Draft'
 * On Cancel → confirmation dialog before closing/resetting.
 */
export function CreatePermissionSlider({
  open, onClose, existingPermissions, groups, onCreate,
}: CreatePermissionSliderProps) {
  const showToast = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [group, setGroup] = useState('');
  const [description, setDescription] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [technicalError, setTechnicalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(''); setType(''); setGroup(''); setDescription('');
      setShowErrors(false); setTechnicalError(null);
    }
  }, [open]);

  useEffect(() => { setGroup(''); }, [type]); // reset group when type changes

  const nameTrim = name.trim();
  const descTrim = description.trim();
  const duplicate = existingPermissions.some(
    (p) => p.name.trim().toLowerCase() === nameTrim.toLowerCase(),
  );

  const groupsForType = useMemo(() => {
    if (!type) return [];
    const t = type.toLowerCase();
    return groups.filter((g) => {
      const gt = String(g.permissionType ?? '').toLowerCase();
      return gt === t || gt.startsWith(t) || t.startsWith(gt.split(' ')[0]);
    });
  }, [groups, type]);

  const errors = {
    name: !nameTrim ? 'This field is required'
      : nameTrim.length > NAME_MAX ? `Name must be ${NAME_MAX} characters or fewer`
      : duplicate ? 'The permission name already exists.'
      : '',
    type: !type ? 'This field is required' : '',
    group: !type ? ''
      : groupsForType.length === 0 ? 'No groups yet. Create a group for this type.'
      : !group ? 'This field is required' : '',
    description: !descTrim ? 'This field is required'
      : descTrim.length > DESC_MAX ? `Description must be ${DESC_MAX} characters or fewer`
      : !/^[A-Za-z0-9\s.,!?()'"\-]+$/.test(descTrim) ? 'Description must be alphanumeric'
      : '',
  };
  const isValid = !errors.name && !errors.type && !errors.group && !errors.description;

  const handleCreate = () => {
    setShowErrors(true);
    if (!isValid) return;
    try {
      const now = new Date();
      const dt = now.toISOString().slice(0, 10);
      const row: Permission = {
        id: `P-${Date.now()}`,
        name: nameTrim,
        type,
        group,
        category: 'Resident',
        status: 'Draft',
        prefix: '',
        price: 0,
        version: 1,
        lastUpdated: dt,
        createdBy: 'admin.user',
        createdOn: dt,
        updatedBy: 'admin.user',
        updatedOn: dt,
        zones: 0,
        documents: 0,
      };
      onCreate(row);
      showToast('New Permission Created Successfully', 'success');
      onClose();
    } catch (e: any) {
      setTechnicalError('Something went wrong Please try again');
    }
  };

  const handleCancel = () => {
    const dirty = nameTrim || type || group || descTrim;
    if (dirty) setConfirmCancel(true);
    else onClose();
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleCancel}
        PaperProps={{ sx: { width: { xs: '100%', sm: 480 } } }}
        data-testid="create-permission-drawer"
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between"
          sx={{ px: 3, py: 2, borderBottom: `1px solid ${tokens.LINE}` }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: tokens.INK }}>
            Create Permission
          </Typography>
          <IconButton onClick={handleCancel} data-testid="create-drawer-close"><Close /></IconButton>
        </Stack>

        <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
          {technicalError && (
            <Alert severity="error" sx={{ mb: 2 }} data-testid="create-technical-error">
              {technicalError}
            </Alert>
          )}
          <Stack spacing={2.5}>
            <TextField
              label={<><span>Permission Name</span> <span style={{ color: '#C62828' }}>*</span></>}
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
              error={showErrors && !!errors.name}
              helperText={
                (showErrors && errors.name)
                  ? errors.name
                  : `${nameTrim.length}/${NAME_MAX}`
              }
              inputProps={{ maxLength: NAME_MAX, 'data-testid': 'create-name-input' }}
              fullWidth
              data-field="Permission Name"
            />
            <TextField
              select
              label={<><span>Type</span> <span style={{ color: '#C62828' }}>*</span></>}
              value={type}
              onChange={(e) => setType(e.target.value)}
              error={showErrors && !!errors.type}
              helperText={showErrors && errors.type ? errors.type : ' '}
              fullWidth
              data-field="Type"
              SelectProps={{ inputProps: { 'data-testid': 'create-type-input' } }}
            >
              {PERMISSION_TYPE_CATALOGUE.map((t) => (
                <MenuItem key={t} value={t} data-testid={`create-type-option-${t.replace(/\s/g, '-')}`}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label={<><span>Group</span> <span style={{ color: '#C62828' }}>*</span></>}
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              disabled={!type}
              error={showErrors && !!errors.group}
              helperText={
                !type ? 'Select a Type first'
                  : groupsForType.length === 0 ? 'No groups yet. Create a group for this type.'
                  : (showErrors && errors.group) ? errors.group : ' '
              }
              fullWidth
              data-field="Group"
              data-testid="create-group-select"
              SelectProps={{ inputProps: { 'data-testid': 'create-group-input' } }}
            >
              {groupsForType.map((g) => (
                <MenuItem key={g.id} value={g.name} data-testid={`create-group-option-${g.id}`}>
                  {g.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={<><span>Description</span> <span style={{ color: '#C62828' }}>*</span></>}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
              error={showErrors && !!errors.description}
              helperText={
                (showErrors && errors.description)
                  ? errors.description
                  : `${descTrim.length}/${DESC_MAX}`
              }
              multiline
              rows={4}
              inputProps={{ maxLength: DESC_MAX, 'data-testid': 'create-description-input' }}
              fullWidth
              data-field="Description"
            />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end"
          sx={{ px: 3, py: 2, borderTop: `1px solid ${tokens.LINE}` }}>
          <Button onClick={handleCancel} data-testid="create-cancel">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            data-testid="create-submit"
            disabled={!isValid && showErrors}
          >
            Create
          </Button>
        </Stack>
      </Drawer>

      <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <DialogTitle>Confirm cancellation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel? As this will reset the data on the screen and close it.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancel(false)} data-testid="cancel-dialog-decline">
            No, keep editing
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => { setConfirmCancel(false); onClose(); }}
            data-testid="cancel-dialog-confirm"
          >
            Yes, cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
