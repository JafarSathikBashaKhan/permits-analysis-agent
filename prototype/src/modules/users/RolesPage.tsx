import { Box, Checkbox, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { PageHeader } from '../../shared/PageHeader';
import { roles } from '../../data/mock';

const MODULES = [
  'Dashboard', 'Applications', 'Users', 'Permission Setup', 'Templates', 'Print', 'Area', 'Reports', 'Contract Settings',
];
const ACTIONS = ['View', 'Create', 'Edit', 'Delete'];

function defaults(role: string, mod: string, action: string) {
  if (role === 'Super Admin' || role === 'Contract Admin') return true;
  if (role === 'Read Only') return action === 'View';
  if (role === 'BO Manager') return action !== 'Delete';
  if (role === 'BO User') return action === 'View' || action === 'Create' || action === 'Edit';
  if (role === 'CEO') return action === 'View' && ['Dashboard', 'Applications', 'Reports'].includes(mod);
  return false;
}

export function RolesPage() {
  return (
    <>
      <PageHeader eyebrow="Users" title="Roles & Permissions" description="Grant granular access per module and action. Changes apply on the next sign-in." />
      <Paper>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 180 }}>Module</TableCell>
                {roles.map((r) => (
                  <TableCell key={r} align="center" colSpan={ACTIONS.length}><Typography fontWeight={600}>{r}</Typography></TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell />
                {roles.flatMap((r) => ACTIONS.map((a) => (
                  <TableCell key={`${r}-${a}`} align="center"><Typography variant="caption" color="text.secondary">{a}</Typography></TableCell>
                )))}
              </TableRow>
            </TableHead>
            <TableBody>
              {MODULES.map((mod) => (
                <TableRow key={mod} hover>
                  <TableCell><Typography fontWeight={600}>{mod}</Typography></TableCell>
                  {roles.flatMap((r) => ACTIONS.map((a) => (
                    <TableCell key={`${mod}-${r}-${a}`} align="center" padding="none">
                      <Checkbox size="small" defaultChecked={defaults(r, mod, a)} disabled={r === 'Super Admin'} />
                    </TableCell>
                  )))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </>
  );
}
