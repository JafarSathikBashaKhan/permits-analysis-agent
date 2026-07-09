import { useState } from 'react';
import {
  Box, Button, Card, CardContent, Chip, Divider, FormControlLabel, Grid, MenuItem,
  Stack, Switch, Tab, Tabs, TextField, Typography, IconButton, Alert,
} from '@mui/material';
import { PageHeader } from '../../shared/PageHeader';
import { tokens } from '../../theme';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import PaletteOutlined from '@mui/icons-material/PaletteOutlined';
import PublicOutlined from '@mui/icons-material/PublicOutlined';
import PaymentOutlined from '@mui/icons-material/PaymentOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import UploadOutlined from '@mui/icons-material/UploadOutlined';
import PreviewOutlined from '@mui/icons-material/PreviewOutlined';
import { useToast } from '../../components/Toast';

type Tab = 'general' | 'portal' | 'permission-visibility' | 'payment' | 'security' | 'integrations';

const ALL_PERMISSIONS = [
  'Resident Permit', 'Visitor Permit', 'Business Permit', 'Trades Permit',
  'Blue Badge Permit', 'Weekly Scratch Card', 'Skip Hire', 'Scaffolding',
  'Bay Suspension', 'Dispensation',
];

export function ApplyConfigPage() {
  const [tab, setTab] = useState<Tab>('general');
  const showToast = useToast();
  const [portalOpen, setPortalOpen] = useState(true);
  const [signupEnabled, setSignupEnabled] = useState(true);
  const [guestApply, setGuestApply] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [dobRequired, setDobRequired] = useState(true);
  const [redact, setRedact] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#0D3E66');
  const [portalUrl, setPortalUrl] = useState('https://apply.wokingham.gov.uk');
  const [supportEmail, setSupportEmail] = useState('permits@wokingham.gov.uk');
  const [contactPhone, setContactPhone] = useState('+44 118 974 6000');
  const [maxTempVehicles, setMaxTempVehicles] = useState('3');
  const [sessionTimeout, setSessionTimeout] = useState('20');
  const [visible, setVisible] = useState<string[]>(ALL_PERMISSIONS.slice(0, 6));
  const [savedToast, setSavedToast] = useState(false);

  const toggleVisible = (name: string) =>
    setVisible((v) => v.includes(name) ? v.filter((x) => x !== name) : [...v, name]);

  const save = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Apply Config"
        title="Apply Portal Configuration"
        description="Controls the customer-facing Apply portal — branding, which permits are visible, payment methods, and integrations."
        actions={
          <>
            <Button variant="outlined" startIcon={<PreviewOutlined />} onClick={() => showToast('Preview coming soon', 'info')}>Preview Portal</Button>
            <Button variant="contained" onClick={save}>Save Changes</Button>
          </>
        }
      />

      {savedToast && <Alert severity="success" sx={{ mb: 2 }}>Apply config saved successfully.</Alert>}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid #E0E0E0', mb: 2 }} variant="scrollable">
        <Tab value="general" iconPosition="start" icon={<TuneOutlined fontSize="small" />} label="General" />
        <Tab value="portal" iconPosition="start" icon={<PaletteOutlined fontSize="small" />} label="Portal Branding" />
        <Tab value="permission-visibility" iconPosition="start" icon={<PublicOutlined fontSize="small" />} label="Permission Visibility" />
        <Tab value="payment" iconPosition="start" icon={<PaymentOutlined fontSize="small" />} label="Payment" />
        <Tab value="security" iconPosition="start" icon={<LockOutlined fontSize="small" />} label="Security" />
        <Tab value="integrations" iconPosition="start" icon={<LanguageOutlined fontSize="small" />} label="Integrations" />
      </Tabs>

      {tab === 'general' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Portal Availability</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ bgcolor: '#F7FAFD' }}>
                  <CardContent>
                    <FormControlLabel control={<Switch checked={portalOpen} onChange={(_, v) => setPortalOpen(v)} />}
                      label={<Box><Typography sx={{ fontWeight: 600 }}>Apply Portal Open</Typography>
                        <Typography sx={{ color: tokens.MUTED, fontSize: '0.82rem' }}>Toggle off to put the portal into scheduled downtime.</Typography>
                      </Box>} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ bgcolor: '#F7FAFD' }}>
                  <CardContent>
                    <FormControlLabel control={<Switch checked={guestApply} onChange={(_, v) => setGuestApply(v)} />}
                      label={<Box><Typography sx={{ fontWeight: 600 }}>Guest Apply</Typography>
                        <Typography sx={{ color: tokens.MUTED, fontSize: '0.82rem' }}>Allow applications without creating an account.</Typography>
                      </Box>} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ bgcolor: '#F7FAFD' }}>
                  <CardContent>
                    <FormControlLabel control={<Switch checked={signupEnabled} onChange={(_, v) => setSignupEnabled(v)} />}
                      label={<Box><Typography sx={{ fontWeight: 600 }}>Public Signup</Typography>
                        <Typography sx={{ color: tokens.MUTED, fontSize: '0.82rem' }}>Applicants can register directly on the portal.</Typography>
                      </Box>} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ bgcolor: '#F7FAFD' }}>
                  <CardContent>
                    <FormControlLabel control={<Switch checked={autoRenew} onChange={(_, v) => setAutoRenew(v)} />}
                      label={<Box><Typography sx={{ fontWeight: 600 }}>Auto-renewal Available</Typography>
                        <Typography sx={{ color: tokens.MUTED, fontSize: '0.82rem' }}>Applicants may opt in to auto-renew their permits.</Typography>
                      </Box>} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>Contact Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Portal URL" value={portalUrl} onChange={(e) => setPortalUrl(e.target.value)} /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Support Email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Max Temporary Vehicles" value={maxTempVehicles} onChange={(e) => setMaxTempVehicles(e.target.value)} /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Applicant Session Timeout (min)" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth size="small" select label="Default Language" defaultValue="en-GB">
                <MenuItem value="en-GB">English (UK)</MenuItem>
                <MenuItem value="cy-GB">Welsh</MenuItem>
              </TextField></Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tab === 'portal' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Branding</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Council Logo</Typography>
                <Card variant="outlined" sx={{ height: 160, display: 'grid', placeItems: 'center', bgcolor: '#FAFBFC' }}>
                  <Stack alignItems="center" spacing={1}>
                    <UploadOutlined sx={{ fontSize: 40, color: tokens.MUTED }} />
                    <Button variant="outlined" size="small" onClick={() => showToast('Upload dialog coming soon', 'info')}>Upload Logo</Button>
                    <Typography sx={{ color: tokens.MUTED, fontSize: '0.78rem' }}>PNG / SVG, max 500KB</Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Favicon</Typography>
                <Card variant="outlined" sx={{ height: 160, display: 'grid', placeItems: 'center', bgcolor: '#FAFBFC' }}>
                  <Stack alignItems="center" spacing={1}>
                    <UploadOutlined sx={{ fontSize: 40, color: tokens.MUTED }} />
                    <Button variant="outlined" size="small" onClick={() => showToast('Upload dialog coming soon', 'info')}>Upload Favicon</Button>
                    <Typography sx={{ color: tokens.MUTED, fontSize: '0.78rem' }}>32x32 ICO / PNG</Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth size="small" label="Primary Color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                  InputProps={{ startAdornment: <Box sx={{ width: 20, height: 20, bgcolor: primaryColor, borderRadius: 0.5, mr: 1, border: '1px solid #E0E0E0' }} /> }} />
              </Grid>
              <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Portal Title" defaultValue="Wokingham Parking Permits" /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Tagline" defaultValue="Apply, renew and manage your permit online" /></Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Welcome Message" defaultValue="Welcome to the Wokingham Borough Council parking permit portal. Please have your address and vehicle details ready." />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tab === 'permission-visibility' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Permission Type Visibility on Apply Portal</Typography>
            <Typography sx={{ color: tokens.MUTED, mb: 2 }}>Toggle which permission types appear to applicants on the Buy Now grid.</Typography>
            <Grid container spacing={1.5}>
              {ALL_PERMISSIONS.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p}>
                  <Card variant="outlined" sx={{ bgcolor: visible.includes(p) ? '#E7F5EC' : '#FAFBFC' }}>
                    <CardContent sx={{ py: 1.25, '&:last-child': { pb: 1.25 } }}>
                      <FormControlLabel
                        control={<Switch checked={visible.includes(p)} onChange={() => toggleVisible(p)} />}
                        label={<Stack direction="row" spacing={1} alignItems="center">
                          <Typography sx={{ fontWeight: 600 }}>{p}</Typography>
                          {visible.includes(p) && <Chip size="small" label="Visible" sx={{ bgcolor: '#1E7E34', color: '#FFF' }} />}
                        </Stack>} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Typography sx={{ mt: 2, color: tokens.MUTED, fontSize: '0.85rem' }}>
              <b>{visible.length}</b> of {ALL_PERMISSIONS.length} permission types visible on the applicant portal.
            </Typography>
          </CardContent>
        </Card>
      )}

      {tab === 'payment' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Payment Methods</Typography>
            <Grid container spacing={2}>
              {['Card', 'Direct Debit', 'PayPal', 'Apple Pay', 'Google Pay', 'Bank Transfer'].map((m, i) => (
                <Grid item xs={12} md={4} key={m}>
                  <Card variant="outlined">
                    <CardContent>
                      <FormControlLabel control={<Switch defaultChecked={i < 3} />} label={<Typography sx={{ fontWeight: 600 }}>{m}</Typography>} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>Charges</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Admin Fee (£)" defaultValue="2.50" /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Diesel Surcharge (£)" defaultValue="5.00" /></Grid>
              <Grid item xs={12} md={4}><TextField fullWidth size="small" label="Refund Window (days)" defaultValue="14" /></Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tab === 'security' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Applicant Data & Privacy</Typography>
            <Stack spacing={1.5}>
              <FormControlLabel control={<Switch checked={dobRequired} onChange={(_, v) => setDobRequired(v)} />}
                label={<Box><Typography sx={{ fontWeight: 600 }}>Require Date of Birth</Typography>
                  <Typography sx={{ color: tokens.MUTED, fontSize: '0.82rem' }}>Enforce DOB on Blue Badge and age-restricted permits.</Typography></Box>} />
              <FormControlLabel control={<Switch checked={smsEnabled} onChange={(_, v) => setSmsEnabled(v)} />}
                label={<Box><Typography sx={{ fontWeight: 600 }}>SMS Verification</Typography>
                  <Typography sx={{ color: tokens.MUTED, fontSize: '0.82rem' }}>Send OTP to applicant mobile on signup and payment.</Typography></Box>} />
              <FormControlLabel control={<Switch checked={redact} onChange={(_, v) => setRedact(v)} />}
                label={<Box><Typography sx={{ fontWeight: 600 }}>PII Redaction in Logs</Typography>
                  <Typography sx={{ color: tokens.MUTED, fontSize: '0.82rem' }}>Automatically redact personal data in system audit logs.</Typography></Box>} />
            </Stack>
            <Divider sx={{ my: 2 }} />
            <TextField fullWidth size="small" label="Data Sharing Policy URL" defaultValue="https://wokingham.gov.uk/data-sharing" sx={{ mb: 1.5 }} />
            <TextField fullWidth size="small" label="Cookie Policy URL" defaultValue="https://wokingham.gov.uk/cookies" />
          </CardContent>
        </Card>
      )}

      {tab === 'integrations' && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Third-Party Integrations</Typography>
            {[
              { name: 'Autoguru', desc: 'Vehicle VRM lookup (make, model, fuel, CO2)', status: 'Connected' },
              { name: 'Experian', desc: 'Applicant address & identity verification', status: 'Connected' },
              { name: 'Illumin8', desc: 'Blue Badge photo capture', status: 'Not connected' },
              { name: 'Print Partner (Datagraphic)', desc: 'Physical permit printing & dispatch', status: 'Connected' },
              { name: 'Stripe', desc: 'Card payments and refunds', status: 'Connected' },
              { name: 'GOV.UK Notify', desc: 'Transactional SMS and email delivery', status: 'Not connected' },
            ].map((intg) => (
              <Stack key={intg.name} direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5, borderBottom: '1px solid #EEE' }}>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{intg.name}</Typography>
                  <Typography sx={{ color: tokens.MUTED, fontSize: '0.85rem' }}>{intg.desc}</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip size="small" label={intg.status} sx={{
                    bgcolor: intg.status === 'Connected' ? '#E7F5EC' : '#EEEEEE',
                    color: intg.status === 'Connected' ? '#1E7E34' : '#616161',
                    fontWeight: 600,
                  }} />
                  <Button size="small" variant="outlined" onClick={() => showToast(intg.status === 'Connected' ? 'Integration coming soon' : 'Integration coming soon', 'info')}>{intg.status === 'Connected' ? 'Manage' : 'Connect'}</Button>
                </Stack>
              </Stack>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
