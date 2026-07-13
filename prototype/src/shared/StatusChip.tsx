import { Chip } from '@mui/material';

const MAP: Record<string, { bg: string; fg: string; label?: string }> = {
  Draft:            { bg: '#F0EDE4', fg: '#6C5B22' },
  Published:        { bg: '#DDECE1', fg: '#255C3B' },
  Active:           { bg: '#DDECE1', fg: '#255C3B' },
  'Pending Approval': { bg: '#FFE9D1', fg: '#89430A' },
  'In Progress':    { bg: '#DEE7F4', fg: '#1F3E7C' },
  'Under Review':   { bg: '#EEE1F6', fg: '#5C2789' },
  Approved:         { bg: '#DDECE1', fg: '#255C3B' },
  Rejected:         { bg: '#F7DBDB', fg: '#8C1F1F' },
  Cancelled:        { bg: '#E8E7E4', fg: '#4B4B4B' },
  Suspended:        { bg: '#FFE1E1', fg: '#8C1F1F' },
  'On Hold':        { bg: '#FBE9BE', fg: '#7A4A00' },
  Expired:          { bg: '#E8E7E4', fg: '#4B4B4B' },
  Closed:           { bg: '#E8E7E4', fg: '#4B4B4B' },
  'Awaiting Payment': { bg: '#FFE9D1', fg: '#89430A' },
  'Payment Failed': { bg: '#F7DBDB', fg: '#8C1F1F' },
  NFI:              { bg: '#FBE9BE', fg: '#7A4A00' },
};

export function StatusChip({ status, size = 'small' }: { status: string; size?: 'small' | 'medium' }) {
  const c = MAP[status] ?? { bg: '#EEE', fg: '#333' };
  return (
    <Chip
      label={status}
      size={size}
      sx={{
        bgcolor: c.bg,
        color: c.fg,
        border: `1px solid ${c.fg}22`,
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    />
  );
}
