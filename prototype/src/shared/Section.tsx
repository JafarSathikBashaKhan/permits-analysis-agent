import { Box, Paper, Typography } from '@mui/material';

export function Section({ id, title, description, children, actions }: { id?: string; title: string; description?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <Paper id={id} sx={{ p: 3, mb: 3, scrollMarginTop: '80px' }}>
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
