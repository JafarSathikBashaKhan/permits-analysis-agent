import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar, SIDEBAR_WIDTH } from './Sidebar';
import { Topbar, TOPBAR_HEIGHT } from './Topbar';
import { tokens } from '../theme';

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', background: tokens.BG }}>
      <Sidebar />
      <Box
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Topbar />
        <Box
          component="main"
          sx={{
            flex: 1,
            mt: `${TOPBAR_HEIGHT}px`,
            p: { xs: 2, md: 4 },
            maxWidth: 1400,
            width: '100%',
            mx: 'auto',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
