import {
  Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, Grid, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { AttachFileOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { useEffect, useMemo, useState, ChangeEvent } from 'react';

/**
 * US-199490 / US-199506 — Change Address (system address) by BO with different zone.
 *
 * Flow:
 *  1. BO picks postcode from typed list → property → street → town
 *  2. System resolves zone. If same zone → banner "no extra charges".
 *  3. If different zone → show Cost Summary (current price, new price, difference,
 *     admin fee, VAT, editable Discount, final total or refund).
 *  4. Required documents are uploaded.
 *  5. Only when all required docs uploaded, "Proceed" enables and hands over to
 *     the email workflow dialog (raised by the parent).
 */

export type ChangeAddressPayload = {
  postcode: string;
  property: string;
  street: string;
  town: string;
  newZone: string;
  costSummary?: {
    currentPrice: number;
    newPrice: number;
    difference: number;
    adminFee: number;
    vat: number;
    discount: number;
    total: number;              // positive → payable, negative → refund
  };
  uploadedDocs: Array<{ name: string; size: string; type: string }>;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onProceed: (p: ChangeAddressPayload) => void;
  currentZone: string;
  currentPrice: number;
};

// TODO(real-backend): fetch these from an address API + zone mapping service.
const MOCK_POSTCODES = ['CC1 3AA', 'CC1 4BB', 'CC2 5CC', 'CC3 6DD', 'CC4 7EE', 'CC5 8FF'];
const MOCK_PROPERTIES: Record<string, string[]> = {
  'CC1 3AA': ['Flat 12', 'Flat 14', '15 Riverside Walk'],
  'CC1 4BB': ['22 High Street', '24 High Street'],
  'CC2 5CC': ['1 Northgate', '3 Northgate Court'],
  'CC3 6DD': ['4 Southbank', '6 Southbank Terrace'],
  'CC4 7EE': ['9 Kingsway'],
  'CC5 8FF': ['12 Market Street'],
};
const MOCK_STREETS: Record<string, string> = {
  'CC1 3AA': 'Riverside Walk',
  'CC1 4BB': 'High Street',
  'CC2 5CC': 'Northgate',
  'CC3 6DD': 'Southbank',
  'CC4 7EE': 'Kingsway',
  'CC5 8FF': 'Market Street',
};
const MOCK_ZONE_MAP: Record<string, { zone: string; price: number }> = {
  'CC1 3AA': { zone: 'Z04 Riverside', price: 120 },
  'CC1 4BB': { zone: 'Z01 City Centre', price: 180 },
  'CC2 5CC': { zone: 'Z02 Northgate', price: 100 },
  'CC3 6DD': { zone: 'Z03 Southbank', price: 140 },
  'CC4 7EE': { zone: 'Z05 Kingsway', price: 160 },
  'CC5 8FF': { zone: 'Z01 City Centre', price: 180 },
};

const REQUIRED_DOC_TYPES = ['Proof of Residence', 'Proof of Vehicle Ownership'];

export function ChangeAddressDialog({ open, onClose, onProceed, currentZone, currentPrice }: Props) {
  const [postcode, setPostcode] = useState('');
  const [property, setProperty] = useState('');
  const [town, setTown] = useState('');
  const [adminFee] = useState(10);
  const [discount, setDiscount] = useState<number>(0);
  const [docs, setDocs] = useState<Array<{ name: string; size: string; type: string }>>([]);

  useEffect(() => {
    if (open) {
      setPostcode(''); setProperty(''); setTown(''); setDiscount(0); setDocs([]);
    }
  }, [open]);

  const street = postcode ? MOCK_STREETS[postcode] ?? '' : '';
  const zoneInfo = postcode ? MOCK_ZONE_MAP[postcode] : undefined;
  const newZone = zoneInfo?.zone ?? '';
  const newPrice = zoneInfo?.price ?? 0;
  const sameZone = newZone && newZone === currentZone;

  const difference = newPrice - currentPrice;
  const vat = 0;
  const total = difference + adminFee + vat - discount;

  const uploadedTypes = new Set(docs.map((d) => d.type));
  const allDocsUploaded = REQUIRED_DOC_TYPES.every((t) => uploadedTypes.has(t));

  const canProceed = !!postcode && !!property && !!town.trim() && allDocsUploaded;

  const handleAttach = (docType: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const size = f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`;
    setDocs((prev) => [...prev.filter((d) => d.type !== docType), { name: f.name, size, type: docType }]);
    e.target.value = '';
  };

  const propertyOptions = useMemo(() => (postcode ? MOCK_PROPERTIES[postcode] ?? [] : []), [postcode]);

  const handleProceed = () => {
    const costSummary = sameZone ? undefined : {
      currentPrice, newPrice, difference, adminFee, vat, discount, total,
    };
    onProceed({
      postcode, property, street, town: town.trim(),
      newZone, costSummary, uploadedDocs: docs,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Change Address</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={MOCK_POSTCODES}
              value={postcode || null}
              onChange={(_, v) => { setPostcode(v ?? ''); setProperty(''); }}
              renderInput={(p) => <TextField {...p} label="Postcode *" fullWidth />}
              data-testid="postcode-autocomplete"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select label="Property *" fullWidth
              disabled={!postcode}
              value={property} onChange={(e) => setProperty(e.target.value)}
              data-testid="property-select"
            >
              {propertyOptions.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Street" fullWidth value={street} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Town *" fullWidth value={town} onChange={(e) => setTown(e.target.value)} />
          </Grid>

          {postcode && (
            <Grid item xs={12}>
              {sameZone ? (
                <Alert severity="info" data-testid="same-zone-banner">
                  Selected Zone is located on <b>{newZone}</b>. You are changing the address to the same zone.
                  So no extra charges apply.
                </Alert>
              ) : (
                <Alert severity="warning" data-testid="different-zone-banner">
                  The new address is in a different zone: <b>{newZone}</b> (was <b>{currentZone}</b>).
                  Cost adjustment applies — see summary below.
                </Alert>
              )}
            </Grid>
          )}

          {postcode && !sameZone && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }} data-testid="cost-summary">
                <Typography fontWeight={700} sx={{ mb: 1 }}>Cost Summary</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}><Typography variant="body2">Current Zone price</Typography></Grid>
                  <Grid item xs={6} textAlign="right"><Typography>£{currentPrice.toFixed(2)}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2">Selected Zone price</Typography></Grid>
                  <Grid item xs={6} textAlign="right"><Typography>£{newPrice.toFixed(2)}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2">Price difference</Typography></Grid>
                  <Grid item xs={6} textAlign="right"><Typography>£{difference.toFixed(2)}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2">Admin fee</Typography></Grid>
                  <Grid item xs={6} textAlign="right"><Typography>£{adminFee.toFixed(2)}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2">VAT (0%)</Typography></Grid>
                  <Grid item xs={6} textAlign="right"><Typography>£0.00</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2">Discount</Typography></Grid>
                  <Grid item xs={6} textAlign="right">
                    <TextField
                      size="small" type="number" value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                      inputProps={{ min: 0, step: '0.01', style: { textAlign: 'right' } }}
                      sx={{ width: 120 }}
                      data-testid="discount"
                    />
                  </Grid>
                  <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                  <Grid item xs={6}><Typography fontWeight={700}>{total >= 0 ? 'Amount payable' : 'Refund due'}</Typography></Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography fontWeight={700} color={total >= 0 ? 'text.primary' : 'success.main'}>
                      £{Math.abs(total).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography fontWeight={700} sx={{ mb: 1 }}>Required Documents</Typography>
            <Stack spacing={1}>
              {REQUIRED_DOC_TYPES.map((t) => {
                const uploaded = docs.find((d) => d.type === t);
                return (
                  <Stack key={t} direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ minWidth: 220 }}>{t} *</Typography>
                    {uploaded ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">{uploaded.name} ({uploaded.size})</Typography>
                        <Button size="small" color="error" startIcon={<DeleteOutlineOutlined />}
                          onClick={() => setDocs((prev) => prev.filter((d) => d.type !== t))}>Remove</Button>
                      </Stack>
                    ) : (
                      <Button component="label" size="small" startIcon={<AttachFileOutlined />}>
                        Upload
                        <input hidden type="file" onChange={handleAttach(t)} />
                      </Button>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!canProceed} onClick={handleProceed} data-testid="proceed-btn">
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
}
