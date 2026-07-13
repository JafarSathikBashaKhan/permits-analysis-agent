import { Paper, Typography, Box } from '@mui/material';
import { PageHeader } from './PageHeader';
import { tokens } from '../theme';

export function PlaceholderPage({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Paper sx={{ p: 6 }}>
        <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
          <Typography sx={{ color: tokens.MUTED, fontSize: '0.95rem' }}>
            This module is scaffolded — content coming soon.
          </Typography>
        </Box>
      </Paper>
    </>
  );
}
