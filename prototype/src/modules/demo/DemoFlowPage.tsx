import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, CircularProgress, Divider, Stack,
  Step, StepLabel, Stepper, Typography, Chip, Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { PageHeader } from '../../shared/PageHeader';
import { useToast } from '../../components/Toast';

type StepResult = { key: string; label: string; entityName: string; entityId: string; route: string };

const readLS = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};
const writeLS = <T,>(key: string, value: T) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
};

const STREETS_KEY = 'prototype:area:streets:rows';
const ZONES_KEY = 'prototype:area:zones:rows';
const GROUPS_KEY = 'prototype:builder:groups:rows';
const BUILDER_KEY = 'prototype:builder:list:rows';
const APPS_KEY = 'prototype:applications:rows';

const now = () => new Date().toISOString().slice(0, 16).replace('T', ' ');
const today = () => new Date().toISOString().slice(0, 10);

const stepMeta = [
  { key: 'street', label: 'Create Street' },
  { key: 'zone', label: 'Create Zone & Map Street' },
  { key: 'group', label: 'Create Group' },
  { key: 'permission', label: 'Build & Publish Permission' },
  { key: 'application', label: 'Buy Now — Create Application' },
];

export function DemoFlowPage() {
  const showToast = useToast();
  const navigate = useNavigate();
  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<StepResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const runFlow = async () => {
    setRunning(true);
    setError(null);
    setResults([]);
    setActive(0);
    const stamp = Date.now();
    const suffix = String(stamp).slice(-4);
    const collected: StepResult[] = [];

    try {
      // 1) Create Street
      await sleep(400);
      const streetId = `st-demo-${stamp}`;
      const streetName = `Demo Street ${suffix}`;
      const property = {
        id: `p-demo-${stamp}-1`,
        name: '1 Demo House',
        uprn: `9${suffix}00001`,
        postcode: 'CO1 1AA',
        permissionLimit: 2,
      };
      const newStreet = {
        id: streetId,
        name: streetName,
        usrn: `USRN-9${suffix}`,
        town: 'Colchester',
        noOfProperties: 1,
        status: 'Active' as const,
        createdOn: now(),
        createdByUser: 'demo.flow',
        updatedOn: now(),
        updatedByUser: 'demo.flow',
        properties: [property],
      };
      const streets = readLS<any[]>(STREETS_KEY, []);
      writeLS(STREETS_KEY, [newStreet, ...streets]);
      collected.push({ key: 'street', label: 'Street', entityName: streetName, entityId: streetId, route: '/streets' });
      setResults([...collected]);
      showToast(`Street "${streetName}" created`, 'success');
      setActive(1);
      await sleep(800);

      // 2) Create Zone mapping that street (Published)
      const zoneId = `z-demo-${stamp}`;
      const zoneName = `Demo Zone ${suffix}`;
      const newZone = {
        id: zoneId,
        name: zoneName,
        streetCount: 1,
        status: 'Published' as const,
        isBackOfficeUse: false,
        createdOn: now(),
        createdByUser: 'demo.flow',
        updatedOn: now(),
        updatedByUser: 'demo.flow',
        streets: [newStreet],
      };
      const zones = readLS<any[]>(ZONES_KEY, []);
      writeLS(ZONES_KEY, [newZone, ...zones]);
      collected.push({ key: 'zone', label: 'Zone', entityName: zoneName, entityId: zoneId, route: '/zones' });
      setResults([...collected]);
      showToast(`Zone "${zoneName}" published`, 'success');
      setActive(2);
      await sleep(800);

      // 3) Create Group
      const groupId = `g-demo-${stamp}`;
      const groupName = `Demo Group ${suffix}`;
      const newGroup = {
        id: groupId,
        name: groupName,
        permissionType: 'Resident',
        groupType: 'Zonal' as const,
        householdLimit: 2,
        maxVouchers: 0,
        backOfficeUse: false,
        status: 'Active' as const,
        linkedPermissions: 1,
        createdOn: now(),
        createdByUser: 'demo.flow',
        updatedOn: now(),
        updatedByUser: 'demo.flow',
      };
      const groups = readLS<any[]>(GROUPS_KEY, []);
      writeLS(GROUPS_KEY, [newGroup, ...groups]);
      collected.push({ key: 'group', label: 'Group', entityName: groupName, entityId: groupId, route: '/groups' });
      setResults([...collected]);
      showToast(`Group "${groupName}" created`, 'success');
      setActive(3);
      await sleep(800);

      // 4) Build & Publish Permission
      const permId = `P-DEMO-${suffix}`;
      const permName = `Demo Resident Permit ${suffix}`;
      const newPermission = {
        id: permId,
        name: permName,
        type: 'Resident',
        group: groupName,
        category: 'Resident',
        status: 'Published',
        prefix: 'DEM',
        price: 50,
        version: 1,
        lastUpdated: today(),
        createdBy: 'demo.flow',
        zones: 1,
        documents: 0,
      };
      const builderRows = readLS<any[]>(BUILDER_KEY, []);
      writeLS(BUILDER_KEY, [newPermission, ...builderRows]);
      collected.push({ key: 'permission', label: 'Permission', entityName: permName, entityId: permId, route: '/builder' });
      setResults([...collected]);
      showToast(`Permission "${permName}" published`, 'success');
      setActive(4);
      await sleep(800);

      // 5) Create Application (Buy Now)
      const appId = `A-DEMO-${suffix}`;
      const appRef = `AP-${new Date().getFullYear()}-${suffix}`;
      const startDate = today();
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      const newApp = {
        id: appId,
        ref: appRef,
        applicant: 'Demo Applicant',
        permission: permName,
        type: 'Permit',
        submitted: today(),
        status: 'Awaiting Payment',
        amount: 50,
        zone: zoneName,
        assignedTo: 'Unassigned',
        startDate,
        expiryDate: expiry.toISOString().slice(0, 10),
      };
      const apps = readLS<any[]>(APPS_KEY, []);
      writeLS(APPS_KEY, [newApp, ...apps]);
      collected.push({ key: 'application', label: 'Application', entityName: `${appRef} — ${permName}`, entityId: appId, route: `/applications/${appId}` });
      setResults([...collected]);
      showToast(`Application "${appRef}" created — Awaiting Payment`, 'success');
      setActive(5);
    } catch (e: any) {
      setError(e?.message || 'Flow failed');
    } finally {
      setRunning(false);
    }
  };

  const reset = () => {
    setActive(-1);
    setResults([]);
    setError(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="Demo"
        title="End-to-End Flow"
        description="Runs the full happy-path in one click: Street → Zone → Group → Permission → Buy Now. Every entity is persisted to localStorage exactly like the real pages, so it lights up across the whole app."
      />

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Button
              variant="contained"
              startIcon={running ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
              onClick={runFlow}
              disabled={running}
            >
              {running ? 'Running…' : results.length === 5 ? 'Run Again' : 'Run End-to-End Flow'}
            </Button>
            {results.length > 0 && !running && (
              <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={reset}>
                Reset display
              </Button>
            )}
          </Stack>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Stepper activeStep={active} alternativeLabel>
            {stepMeta.map((s, i) => (
              <Step key={s.key} completed={active > i}>
                <StepLabel>{s.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Created entities
            </Typography>
            <Stack spacing={1.5} divider={<Divider flexItem />}>
              {results.map((r) => (
                <Stack key={r.key} direction="row" spacing={2} alignItems="center">
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Box sx={{ minWidth: 120 }}>
                    <Chip size="small" label={r.label} color="primary" variant="outlined" />
                  </Box>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    <strong>{r.entityName}</strong>{' '}
                    <Typography component="span" variant="caption" color="text.secondary">
                      ({r.entityId})
                    </Typography>
                  </Typography>
                  <Button size="small" endIcon={<OpenInNewIcon />} onClick={() => navigate(r.route)}>
                    Open
                  </Button>
                </Stack>
              ))}
            </Stack>
            {active === 5 && (
              <Alert severity="success" sx={{ mt: 3 }}>
                Complete. The new street is on <strong>Area → Streets</strong>, the zone on <strong>Area → Zones</strong> (Published), the group on <strong>Permission Setup → Groups</strong>, the permission on <strong>Permission Setup → Permission Builder</strong> (Published), and the application on <strong>Applications</strong> in status "Awaiting Payment".
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
