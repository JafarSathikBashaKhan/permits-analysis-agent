import { useState, useMemo } from 'react';
import {
  Box, Button, Card, CardContent, Chip, Drawer, Grid, IconButton, MenuItem,
  Stack, Step, Stepper, StepLabel, Tab, Tabs, TextField, Typography,
  FormControlLabel, Checkbox, Divider, Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { usePersistentState } from '../hooks/usePersistentState';
import { useToast } from './Toast';
import { BUILDER_ROWS_KEY } from '../modules/builder/BuilderListPage';
import { PAYMENT_METHOD_OPTIONS } from '../constants/enums';

type Permission = {
  id: string;
  name: string;
  type: string;
  group: string;
  status: 'Draft' | 'Published';
  vehicleRequired?: boolean;
  documentTypes?: string[];
  basePrice?: number;
  adminFee?: number;
  zones?: string[];
};

type Application = {
  id: string;
  applicantId: string;
  permissionType: string;
  status: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    zone?: string;
  };
  documents: { name: string; url: string }[];
  vehicle?: {
    vrm: string;
    make?: string;
    model?: string;
    color?: string;
    fuelType?: string;
    co2?: string;
  };
  pricing: {
    basePrice: number;
    tierPrice?: number;
    dieselSurcharge?: number;
    adminFee: number;
    total: number;
  };
  paymentMethod: string;
  createdAt: string;
  createdBy: string;
};

const STEPS = ['Address', 'Documents', 'Vehicle', 'Price & Payment'];

export function BuyNowDrawer({
  open,
  onClose,
  applicantId,
}: {
  open: boolean;
  onClose: () => void;
  applicantId: string;
}) {
  const showToast = useToast();
  const [allPermissions] = usePersistentState<Permission[]>(BUILDER_ROWS_KEY, []);
  const [contractSettings] = usePersistentState<Record<string, boolean>>('prototype:contract-settings:state', {});
  const [mnpsToggles] = usePersistentState<Record<string, boolean>>('prototype:mnps-contract:toggles', {});
  const [applications, setApplications] = usePersistentState<Application[]>('prototype:applications:rows', []);

  const [permType, setPermType] = useState('Permit');
  const [selectedPerm, setSelectedPerm] = useState<Permission | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Address tab
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [selectedZone, setSelectedZone] = useState('');

  // Documents tab
  const [uploadedDocs, setUploadedDocs] = useState<{ name: string; url: string }[]>([]);

  // Vehicle tab
  const [vrm, setVrm] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [co2, setCo2] = useState('');

  // Price & Payment tab
  const [paymentMethod, setPaymentMethod] = useState(3); // Online After Approval
  const [termsAccepted, setTermsAccepted] = useState(false);

  const publishedPerms = useMemo(
    () => allPermissions.filter((p) => p.status === 'Published' && p.type === permType),
    [allPermissions, permType]
  );

  const dieselSurchargeEnabled = contractSettings['dieselSurcharge'] || false;
  const tierPricingEnabled = contractSettings['tierPricing'] || false;
  const autoguruEnabled = mnpsToggles['autoguruToggle'] || false;

  const handleAutoguruLookup = () => {
    if (!vrm.trim()) return;
    // Mock Autoguru API lookup
    showToast('Looking up vehicle details...', 'info');
    setTimeout(() => {
      setMake('Toyota');
      setModel('Corolla');
      setColor('Silver');
      setFuelType('Petrol');
      setCo2('120');
      showToast('Vehicle details retrieved from Autoguru', 'success');
    }, 1000);
  };

  const calculatePrice = () => {
    if (!selectedPerm) return { basePrice: 0, tierPrice: 0, dieselSurcharge: 0, adminFee: 0, total: 0 };
    const basePrice = selectedPerm.basePrice || 100;
    const tierPrice = tierPricingEnabled ? 15 : 0; // Mock tier pricing
    const dieselSurcharge = dieselSurchargeEnabled && fuelType === 'Diesel' ? 5 : 0;
    const adminFee = selectedPerm.adminFee || 3.5;
    const total = basePrice + tierPrice + dieselSurcharge + adminFee;
    return { basePrice, tierPrice, dieselSurcharge, adminFee, total };
  };

  const canProceed = () => {
    if (activeStep === 0) return addressLine1 && city && postcode && selectedZone;
    if (activeStep === 1) return uploadedDocs.length > 0;
    if (activeStep === 2) return vrm && make && model;
    if (activeStep === 3) return termsAccepted;
    return false;
  };

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!selectedPerm) return;
    const pricing = calculatePrice();
    const newApp: Application = {
      id: `APP-${Date.now()}`,
      applicantId,
      permissionType: selectedPerm.name,
      status: 'Awaiting Payment',
      address: {
        line1: addressLine1,
        line2: addressLine2,
        city,
        postcode,
        zone: selectedZone,
      },
      documents: uploadedDocs,
      vehicle: { vrm, make, model, color, fuelType, co2 },
      pricing,
      paymentMethod: PAYMENT_METHOD_OPTIONS.find((o) => o.id === paymentMethod)?.label || 'Unknown',
      createdAt: new Date().toISOString(),
      createdBy: 'BO User',
    };
    setApplications((prev) => [newApp, ...prev]);
    showToast('Application submitted successfully. Status: Awaiting Payment', 'success');
    onClose();
    // Reset form
    setActiveStep(0);
    setSelectedPerm(null);
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setPostcode('');
    setSelectedZone('');
    setUploadedDocs([]);
    setVrm('');
    setMake('');
    setModel('');
    setColor('');
    setFuelType('');
    setCo2('');
    setPaymentMethod(3);
    setTermsAccepted(false);
  };

  const pricing = calculatePrice();

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 900, maxWidth: '90vw' } }}>
      {/* US-165020 — hidden diagnostic values for automated verification of the pricing formula */}
      {selectedPerm && (
        <>
          <span style={{ display: 'none' }} data-testid="buynow-hidden-base">{pricing.basePrice.toFixed(2)}</span>
          <span style={{ display: 'none' }} data-testid="buynow-hidden-admin-fee">{pricing.adminFee.toFixed(2)}</span>
          <span style={{ display: 'none' }} data-testid="buynow-hidden-tier">{pricing.tierPrice.toFixed(2)}</span>
          <span style={{ display: 'none' }} data-testid="buynow-hidden-diesel">{pricing.dieselSurcharge.toFixed(2)}</span>
          <span style={{ display: 'none' }} data-testid="buynow-hidden-total">{pricing.total.toFixed(2)}</span>
          {/* US-181519 — permission label rich text rendered on the application form */}
          {(() => {
            let labelHtml = '';
            try {
              const raw = localStorage.getItem(`prototype:permissionLabel:${selectedPerm.id}`);
              if (raw) labelHtml = (JSON.parse(raw) as { labelText?: string }).labelText || '';
            } catch { /* ignore */ }
            return (
              <>
                <span style={{ display: 'none' }} data-testid="buynow-hidden-label-html">{labelHtml}</span>
                {labelHtml ? (
                  <Box
                    data-testid="buynow-permission-label"
                    sx={{ px: 3, pt: 2, '& a': { color: 'primary.main', textDecoration: 'underline' }, '& ul, & ol': { pl: 3 } }}
                    dangerouslySetInnerHTML={{ __html: labelHtml }}
                  />
                ) : null}
              </>
            );
          })()}
        </>
      )}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 1,
        }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
            Buy New Application
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {selectedPerm ? selectedPerm.name : 'Select Permission Type'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {!selectedPerm ? (
          <>
            <Tabs value={permType} onChange={(_, v) => setPermType(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tab label="Permit" value="Permit" />
              <Tab label="Licensing" value="Licensing" />
              <Tab label="Suspension" value="Suspension" />
              <Tab label="Dispensation" value="Dispensation" />
              <Tab label="Exemption" value="Exemption" />
            </Tabs>
            <Grid container spacing={2}>
              {publishedPerms.length === 0 && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    No published permissions found for type "{permType}". Please create and publish permissions in
                    Permission Builder first.
                  </Alert>
                </Grid>
              )}
              {publishedPerms.map((p) => (
                <Grid item xs={12} sm={6} key={p.id}>
                  <Card
                    variant="outlined"
                    data-testid={`buynow-perm-card-${p.id}`}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: 'primary.main', boxShadow: 2 },
                    }}
                    onClick={() => setSelectedPerm(p)}
                  >
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="h6" fontWeight={600}>
                          {p.name}
                        </Typography>
                        <Chip size="small" label={p.status} color="success" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Type: {p.type} | Group: {p.group}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Base Price: £{p.basePrice || 100} | Admin Fee: £{p.adminFee || 3.5}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => setSelectedPerm(null)} sx={{ mb: 2 }}>
              Change Permission Type
            </Button>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  Address Details
                </Typography>
                <TextField label="Address Line 1" fullWidth required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                <TextField label="Address Line 2" fullWidth value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField label="City" fullWidth required value={city} onChange={(e) => setCity(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Postcode" fullWidth required value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                  </Grid>
                </Grid>
                <TextField
                  label="Zone"
                  select
                  fullWidth
                  required
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  helperText="Select the zone for this address. Only zonal permissions require this."
                >
                  <MenuItem value="Zone A">Zone A</MenuItem>
                  <MenuItem value="Zone B">Zone B</MenuItem>
                  <MenuItem value="Zone C">Zone C</MenuItem>
                </TextField>
              </Stack>
            )}

            {activeStep === 1 && (
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  Required Documents
                </Typography>
                <Alert severity="info">
                  The following documents are required for "{selectedPerm.name}": Proof of Residence, Proof of Vehicle
                  Ownership.
                </Alert>
                <Button
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  onClick={() => {
                    const fileName = `document-${Date.now()}.pdf`;
                    setUploadedDocs([...uploadedDocs, { name: fileName, url: `/uploads/${fileName}` }]);
                    showToast(`Uploaded ${fileName}`, 'success');
                  }}
                >
                  Upload Document
                </Button>
                {uploadedDocs.map((doc) => (
                  <Chip
                    key={doc.name}
                    label={doc.name}
                    onDelete={() => setUploadedDocs(uploadedDocs.filter((d) => d.name !== doc.name))}
                    sx={{ alignSelf: 'flex-start' }}
                  />
                ))}
              </Stack>
            )}

            {activeStep === 2 && (
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  Vehicle Details
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField label="VRM" fullWidth required value={vrm} onChange={(e) => setVrm(e.target.value.toUpperCase())} />
                  {autoguruEnabled && (
                    <Button variant="contained" onClick={handleAutoguruLookup}>
                      Lookup
                    </Button>
                  )}
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField label="Make" fullWidth required value={make} onChange={(e) => setMake(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Model" fullWidth required value={model} onChange={(e) => setModel(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Color" fullWidth value={color} onChange={(e) => setColor(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Fuel Type"
                      select
                      fullWidth
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                    >
                      <MenuItem value="Petrol">Petrol</MenuItem>
                      <MenuItem value="Diesel">Diesel</MenuItem>
                      <MenuItem value="Electric">Electric</MenuItem>
                      <MenuItem value="Hybrid">Hybrid</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="CO2 (g/km)" fullWidth value={co2} onChange={(e) => setCo2(e.target.value)} />
                  </Grid>
                </Grid>
              </Stack>
            )}

            {activeStep === 3 && (
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  Price & Payment
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      Price Breakdown
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Base Price:</Typography>
                        <Typography variant="body2" fontWeight={600} data-testid="buynow-base-price">
                          £{pricing.basePrice.toFixed(2)}
                        </Typography>
                      </Stack>
                      {tierPricingEnabled && pricing.tierPrice > 0 && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">Tier Pricing:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            £{pricing.tierPrice.toFixed(2)}
                          </Typography>
                        </Stack>
                      )}
                      {dieselSurchargeEnabled && pricing.dieselSurcharge > 0 && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">Diesel Surcharge:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            £{pricing.dieselSurcharge.toFixed(2)}
                          </Typography>
                        </Stack>
                      )}
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Admin Fee:</Typography>
                        <Typography variant="body2" fontWeight={600} data-testid="buynow-admin-fee">
                          £{pricing.adminFee.toFixed(2)}
                        </Typography>
                      </Stack>
                      <Divider />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={700}>
                          Total:
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="primary.main" data-testid="buynow-total">
                          £{pricing.total.toFixed(2)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
                <TextField
                  label="Payment Method"
                  select
                  fullWidth
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(Number(e.target.value))}
                >
                  {PAYMENT_METHOD_OPTIONS.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={<Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />}
                  label="I agree to terms and conditions"
                />
              </Stack>
            )}
          </>
        )}
      </Box>

      {selectedPerm && (
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={1}
          sx={{
            px: 3,
            py: 2,
            borderTop: 1,
            borderColor: 'divider',
            position: 'sticky',
            bottom: 0,
            bgcolor: 'background.paper',
          }}
        >
          <Button onClick={onClose} disabled={false}>
            Cancel
          </Button>
          <Stack direction="row" spacing={1}>
            {activeStep > 0 && (
              <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
                Back
              </Button>
            )}
            {activeStep < STEPS.length - 1 && (
              <Button variant="contained" onClick={handleNext} endIcon={<ArrowForwardIcon />} disabled={!canProceed()} data-testid="buynow-next">
                Save and Continue
              </Button>
            )}
            {activeStep === STEPS.length - 1 && (
              <Button
                variant="contained"
                onClick={handleSubmit}
                endIcon={<CheckCircleOutline />}
                disabled={!canProceed()}
              >
                Submit Application
              </Button>
            )}
          </Stack>
        </Stack>
      )}
    </Drawer>
  );
}
