import { Grid, Paper, Stack, Typography } from '@mui/material';
import { AdminPanelSettings, People, PersonSearch } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../shared/PageHeader';

const CARDS = [
  { to: '/users/roles', icon: <AdminPanelSettings />, title: 'Roles & Permissions', desc: 'Define which modules and actions each role can access.', count: '6 roles' },
  { to: '/users/system', icon: <People />, title: 'System Users', desc: 'Manage Back Office team members, invite new users and control status.', count: '24 users' },
  { to: '/users/applicants', icon: <PersonSearch />, title: 'Applicants', desc: 'View customers, their permits, vehicles, documents and history.', count: '12,432 applicants' },
];

export function UsersLandingPage() {
  return (
    <>
      <PageHeader eyebrow="Back Office" title="Users" description="Everything about people who use the system — staff and applicants." />
      <Grid container spacing={2.5}>
        {CARDS.map((c) => (
          <Grid item xs={12} md={4} key={c.to}>
            <Paper component={Link} to={c.to} sx={{ p: 3, display: 'block', textDecoration: 'none', color: 'inherit', height: '100%', '&:hover': { borderColor: 'primary.main' } }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <div style={{ color: '#0A2540' }}>{c.icon}</div>
                <div>
                  <Typography sx={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: '1.35rem', fontWeight: 600 }}>{c.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>{c.desc}</Typography>
                  <Typography variant="body2" color="primary" mt={2} fontWeight={600}>{c.count} →</Typography>
                </div>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
