import { InfoOutlined } from '@mui/icons-material';
import { Tooltip, Box } from '@mui/material';

export function FieldHint({ text }: { text: string }) {
  return (
    <Tooltip title={text} arrow placement="top">
      <Box component="span" sx={{ display: 'inline-flex', ml: 0.5, color: 'text.secondary', cursor: 'help', verticalAlign: 'middle' }}>
        <InfoOutlined sx={{ fontSize: 15 }} />
      </Box>
    </Tooltip>
  );
}
