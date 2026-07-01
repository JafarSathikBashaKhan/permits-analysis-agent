import { Box, Button, Stack, Typography } from '@mui/material';
import { tokens } from '../theme';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, gap: 2 }}>
      <Box>
        {eyebrow && (
          <Typography variant="h6" sx={{ mb: 0.5 }}>{eyebrow}</Typography>
        )}
        <Typography variant="h2" sx={{ mb: description ? 0.5 : 0 }}>{title}</Typography>
        {description && (
          <Typography sx={{ color: tokens.MUTED, maxWidth: 720 }}>{description}</Typography>
        )}
      </Box>
      {actions && <Stack direction="row" spacing={1}>{actions}</Stack>}
    </Box>
  );
}

export { Button };
