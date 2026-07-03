import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Drawer, IconButton, Stack, TextField, Typography, Alert, Divider,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PageHeader } from '../../shared/PageHeader';

type EmailTemplate = {
  id: string;
  templateName: string;
  permissionType: string;
  linkedEvents: string[];
  emailSubject: string;
  fromEmail: string;
  bodyHtml: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
};

const seed = (): EmailTemplate[] => [
  {
    id: 'EM-001', templateName: 'Application Received', permissionType: 'Resident Permit',
    linkedEvents: ['Application Submitted'],
    emailSubject: 'Your resident permit application has been received',
    fromEmail: 'noreply@mnps.gov.uk',
    bodyHtml: '<p>Dear {{ApplicantName}},</p><p>We have received your application for a Resident Permit ({{PermitReference}})...</p>',
    createdOn: '02/01/2024', createdBy: 'System Admin',
    updatedOn: '02/01/2024', updatedBy: 'System Admin',
  },
  {
    id: 'EM-002', templateName: 'Application Approved', permissionType: 'Resident Permit',
    linkedEvents: ['Application Approved', 'Permit Issued'],
    emailSubject: 'Your permit has been approved',
    fromEmail: 'noreply@mnps.gov.uk',
    bodyHtml: '<p>Dear {{ApplicantName}},</p><p>Good news — your permit is now active from {{StartDate}} to {{EndDate}}.</p>',
    createdOn: '02/01/2024', createdBy: 'System Admin',
    updatedOn: '10/03/2024', updatedBy: 'Sarah Johnson',
  },
  {
    id: 'EM-003', templateName: 'Application Rejected', permissionType: 'Business Permit',
    linkedEvents: ['Application Rejected'],
    emailSubject: 'Update on your permit application',
    fromEmail: 'noreply@mnps.gov.uk',
    bodyHtml: '<p>Dear {{ApplicantName}},</p><p>Unfortunately your application has not been approved. Reason: {{RejectionReason}}.</p>',
    createdOn: '15/01/2024', createdBy: 'System Admin',
    updatedOn: '15/01/2024', updatedBy: 'System Admin',
  },
  {
    id: 'EM-004', templateName: 'Payment Failed', permissionType: 'Visitor Permit',
    linkedEvents: ['Payment Failed'],
    emailSubject: 'Payment for your permit could not be processed',
    fromEmail: 'noreply@mnps.gov.uk',
    bodyHtml: '<p>Dear {{ApplicantName}},</p><p>We were unable to process your payment. Please try again from your account.</p>',
    createdOn: '20/02/2024', createdBy: 'Mark Peters',
    updatedOn: '20/02/2024', updatedBy: 'Mark Peters',
  },
  {
    id: 'EM-005', templateName: 'Renewal Reminder', permissionType: 'Resident Permit',
    linkedEvents: ['30 Days Before Expiry'],
    emailSubject: 'Your permit is due to expire soon',
    fromEmail: 'noreply@mnps.gov.uk',
    bodyHtml: '<p>Dear {{ApplicantName}},</p><p>Your permit expires on {{ExpiryDate}}. Renew now to avoid a lapse.</p>',
    createdOn: '05/03/2024', createdBy: 'System Admin',
    updatedOn: '05/03/2024', updatedBy: 'System Admin',
  },
];

export function EmailsPage() {
  const [rows] = useState<EmailTemplate[]>(seed());
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState<EmailTemplate | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      r.templateName.toLowerCase().includes(q) || r.permissionType.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const cols: GridColDef[] = [
    {
      field: 'templateName', headerName: 'Template Name', flex: 1.3, minWidth: 210,
      renderCell: (p) => (
        <Button size="small" variant="text" sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={() => setTarget(p.row as EmailTemplate)}>
          {p.value}
        </Button>
      ),
    },
    { field: 'permissionType', headerName: 'Permission Type', width: 170 },
    {
      field: 'linkedEvents', headerName: 'Linked Events', flex: 1, minWidth: 200,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {(p.value as string[]).map((e) => (
            <Chip key={e} label={e} size="small" color="secondary" variant="outlined" />
          ))}
        </Stack>
      ),
    },
    { field: 'emailSubject', headerName: 'Email Subject', flex: 1.4, minWidth: 260 },
    { field: 'createdOn', headerName: 'Created On', width: 130 },
    { field: 'createdBy', headerName: 'Created By', width: 160 },
    { field: 'updatedOn', headerName: 'Updated On', width: 130 },
    { field: 'updatedBy', headerName: 'Updated By', width: 160 },
  ];

  return (
    <Box>
      <PageHeader eyebrow="Templates" title="Emails"
        description="Read-only view of email templates linked to permission events." />

      <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
        To create or edit an email template, go to the <strong>MNPS Template creation screen</strong>. This module is view-only.
      </Alert>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
        <TextField size="small" placeholder="Search by Template Name, Permission Type"
          value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 320 }} />
      </Stack>

      <Box sx={{ height: 560, bgcolor: 'background.paper', borderRadius: 1 }}>
        <DataGrid rows={filtered} columns={cols} getRowId={(r) => r.id} density="compact"
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick />
      </Box>

      <Drawer anchor="right" open={!!target} onClose={() => setTarget(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 720 } } }}>
        {target && (
          <Stack sx={{ height: '100%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between"
              sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Typography variant="h6">View Email Template</Typography>
              <IconButton onClick={() => setTarget(null)}><CloseIcon /></IconButton>
            </Stack>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Template Name</Typography>
                  <Typography variant="body1" fontWeight={600}>{target.templateName}</Typography>
                </Box>
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Permission Type</Typography>
                    <Typography variant="body2">{target.permissionType}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">From</Typography>
                    <Typography variant="body2">{target.fromEmail}</Typography>
                  </Box>
                </Stack>
                <Box>
                  <Typography variant="caption" color="text.secondary">Linked Events</Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                    {target.linkedEvents.map((e) => (
                      <Chip key={e} label={e} size="small" color="secondary" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email Subject</Typography>
                  <Typography variant="body2">{target.emailSubject}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Body</Typography>
                  <Box sx={{ mt: 1, p: 2, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'grey.50' }}
                    dangerouslySetInnerHTML={{ __html: target.bodyHtml }} />
                </Box>
                <Divider />
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography variant="body2">{target.createdOn} · {target.createdBy}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Updated</Typography>
                    <Typography variant="body2">{target.updatedOn} · {target.updatedBy}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        )}
      </Drawer>
    </Box>
  );
}
