import { Box, Button, Chip, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { PageHeader } from '../../shared/PageHeader';
import { StatusChip } from '../../shared/StatusChip';
import { permissions } from '../../data/mock';
import { BasicInformationTab } from './tabs/BasicInformationTab';
import { GeneralSettingsTab } from './tabs/GeneralSettingsTab';
import { RulesTab } from './tabs/RulesTab';
import { PricingTab } from './tabs/PricingTab';
import { VehiclesTab } from './tabs/VehiclesTab';
import { ZonesTab } from './tabs/ZonesTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { RenewalsTab } from './tabs/RenewalsTab';
import { SpecialEventsTab } from './tabs/SpecialEventsTab';

const TABS = [
  { key: 'basic', label: 'Basic Information', El: BasicInformationTab },
  { key: 'general', label: 'General Settings', El: GeneralSettingsTab },
  { key: 'rules', label: 'Rules', El: RulesTab },
  { key: 'pricing', label: 'Pricing', El: PricingTab },
  { key: 'vehicles', label: 'Vehicles', El: VehiclesTab },
  { key: 'zones', label: 'Zones', El: ZonesTab },
  { key: 'documents', label: 'Documents', El: DocumentsTab },
  { key: 'renewals', label: 'Renewals', El: RenewalsTab },
  { key: 'events', label: 'Special Events', El: SpecialEventsTab },
];

export function BuilderDesignPage() {
  const { id, tab } = useParams();
  const nav = useNavigate();
  const isNew = id === 'new';
  const perm = useMemo(() => permissions.find((p) => p.id === id), [id]);
  const [current, setCurrent] = useState(tab ?? 'basic');

  const CurrentEl = TABS.find((t) => t.key === current)?.El ?? BasicInformationTab;
  const displayName = isNew ? 'New permission' : (perm?.name ?? id ?? 'Permission');

  return (
    <>
      <PageHeader
        eyebrow="Builder"
        title={displayName}
        description={isNew ? 'Configure a new permission template.' : `${perm?.type ?? ''} · ${perm?.group ?? ''} · ${perm?.category ?? ''}`}
        actions={
          <>
            <Button variant="outlined" color="primary" onClick={() => nav('/builder')}>Back to list</Button>
            <Button variant="outlined" color="primary">Save draft</Button>
            <Button variant="contained" color="primary">Publish</Button>
          </>
        }
      />

      <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
        {perm && <StatusChip status={perm.status} />}
        {perm && <Chip label={`v${perm.version}`} size="small" variant="outlined" />}
        {perm && <Typography variant="caption" color="text.secondary">Last updated {perm.lastUpdated} by {perm.createdBy}</Typography>}
      </Stack>

      <Paper sx={{ mb: 3, position: 'sticky', top: 60, zIndex: 5 }}>
        <Tabs
          value={current}
          onChange={(_, v) => { setCurrent(v); nav(`/builder/${id}/${v}`, { replace: true }); }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 1 }}
        >
          {TABS.map((t) => <Tab key={t.key} value={t.key} label={t.label} />)}
        </Tabs>
      </Paper>

      <Box>
        <CurrentEl permission={perm} />
      </Box>
    </>
  );
}
