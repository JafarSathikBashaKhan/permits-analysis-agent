import { Alert, Box, Button, IconButton, Paper, Stack, Switch, Typography } from '@mui/material';
import { Add, DragIndicator, Edit } from '@mui/icons-material';
import { useState } from 'react';
import { Section } from '../../../shared/Section';
import { useToast } from '../../../components/Toast';
import { AddDocumentTypeDialog } from '../../../components/dialogs/AddDocumentTypeDialog';

type Doc = { name: string; required: boolean; expires: boolean };

export function DocumentsTab() {
  const showToast = useToast();
  const [addDocTypeOpen, setAddDocTypeOpen] = useState(false);
  const [docs, setDocs] = useState<Doc[]>([
    { name: 'Proof of address', required: true, expires: true },
    { name: 'Photo ID', required: true, expires: true },
    { name: 'Vehicle logbook (V5C)', required: true, expires: false },
    { name: 'Blue Badge (if applicable)', required: false, expires: true },
  ]);

  const toggle = (i: number, key: keyof Doc) => setDocs((old) => old.map((d, idx) => idx === i ? { ...d, [key]: !(d as any)[key] } : d));

  return (
    <>
      <Alert severity="info" sx={{ mb: 3, background: '#FFF7EC', border: '1px solid #EDEFF3', color: 'text.primary' }}>
        Required documents are enforced at the Documents step in Buy Now and appear on the Back Office application review page.
      </Alert>

      <Section title="Required documents" actions={<Button startIcon={<Add />} variant="outlined" size="small" onClick={() => setAddDocTypeOpen(true)}>Add document type</Button>}>
        <Stack spacing={1.25}>
          {docs.map((d, i) => (
            <Paper key={d.name} sx={{ p: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <DragIndicator color="disabled" />
                <Box flex={1}>
                  <Typography fontWeight={600}>{d.name}</Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" color="text.secondary">Required</Typography>
                  <Switch checked={d.required} onChange={() => toggle(i, 'required')} />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" color="text.secondary">Track expiry</Typography>
                  <Switch checked={d.expires} onChange={() => toggle(i, 'expires')} />
                </Stack>
                <IconButton size="small"><Edit fontSize="small" /></IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Section>

      <AddDocumentTypeDialog
        open={addDocTypeOpen}
        onClose={() => setAddDocTypeOpen(false)}
        onSave={(dt) => {
          setDocs((prev) => [...prev, { name: dt.name, required: dt.required, expires: false }]);
          showToast('Document type added', 'success');
        }}
      />
    </>
  );
}
