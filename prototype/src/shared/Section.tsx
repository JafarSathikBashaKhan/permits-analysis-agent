import { Box, Paper, Typography } from '@mui/material';

export function Section({ title, description, children, actions }: { title: string; description?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: description ? 0.5 : 0 }}>{title}</Typography>
          {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}
        </Box>
        {actions}
      </Box>
      {children}
    </Paper>
  );
}
