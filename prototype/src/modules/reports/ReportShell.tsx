import { useState } from 'react';
import { Box, Button, IconButton, Stack, Tab, Tabs, Typography, Tooltip, Chip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import BarChartIcon from '@mui/icons-material/BarChart';
import { PageHeader } from '../../shared/PageHeader';

function PowerBiEmbedPlaceholder({ reportName, height = 640 }: { reportName: string; height?: number }) {
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
    setTimeout(() => setLoading(false), 700);
  };

  return (
    <Box sx={{
      border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'background.paper',
    }}>
      <Stack direction="row" alignItems="center" spacing={1}
        sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Chip icon={<BarChartIcon />} label="Power BI Embedded" size="small" color="primary" variant="outlined" />
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          {reportName} · workspace v1
        </Typography>
        <Tooltip title="Refresh report">
          <IconButton size="small" onClick={refresh} disabled={loading}><RefreshIcon fontSize="small" /></IconButton>
        </Tooltip>
        <Tooltip title="Fullscreen">
          <IconButton size="small"><FullscreenIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Stack>

      <Box key={reloadKey} sx={{
        height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e6ebf1 100%)',
        position: 'relative',
      }}>
        {loading && (
          <Box sx={{
            position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography variant="body2">Loading token…</Typography>
          </Box>
        )}
        <BarChartIcon sx={{ fontSize: 96, color: 'primary.light', mb: 2, opacity: 0.6 }} />
        <Typography variant="h6" color="text.secondary">{reportName}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, maxWidth: 480, textAlign: 'center' }}>
          Renders via <strong>powerbi-client-react</strong> in production —
          this prototype shows a placeholder while the embed token is fetched
          from <code>GetReportToken/CommonReportToken</code>.
        </Typography>
      </Box>
    </Box>
  );
}

type ReportShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  tabs?: string[];
};

export function ReportShell({ eyebrow = 'Reports', title, description, tabs }: ReportShellProps) {
  const [tab, setTab] = useState(0);
  const activeName = tabs && tabs.length > 0 ? `${title} — ${tabs[tab]}` : title;

  return (
    <Box>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      {tabs && tabs.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, bgcolor: 'background.paper' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable"
            sx={{ px: 2 }}>
            {tabs.map((t) => <Tab key={t} label={t} />)}
          </Tabs>
        </Box>
      )}

      <PowerBiEmbedPlaceholder reportName={activeName} />

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button variant="outlined" size="small">Export to PDF</Button>
        <Button variant="outlined" size="small">Export to CSV</Button>
      </Stack>
    </Box>
  );
}
