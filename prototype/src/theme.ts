import { createTheme, alpha } from '@mui/material/styles';

// Marston Holdings brand palette (extracted from marstonholdings.co.uk
// Elementor globals: primary #162B48 navy, accent #E77E08 orange,
// text greys #54595F / #7A7A7A). Typography: Roboto Slab for headings,
// Roboto for body.
const NAVY        = '#162B48';   // Marston brand navy (primary)
const NAVY_SOFT   = '#243D63';
const NAVY_INK    = '#0B172A';
const ORANGE      = '#E77E08';   // Marston brand orange (accent)
const ORANGE_SOFT = '#F49B37';
const ORANGE_DARK = '#B4610A';
const BG          = '#F5F6F8';   // cool off-white background
const PAPER       = '#FFFFFF';
const INK         = '#1F2A3A';
const TEXT        = '#54595F';   // Marston secondary text
const MUTED       = '#7A7A7A';   // Marston text grey
const LINE        = '#E1E4E8';

const HEADING = '"Roboto Slab", Georgia, serif';
const BODY    = '"Roboto", "Helvetica Neue", Arial, sans-serif';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: NAVY, light: NAVY_SOFT, dark: NAVY_INK, contrastText: '#FFFFFF' },
    secondary: { main: ORANGE, light: ORANGE_SOFT, dark: ORANGE_DARK, contrastText: '#FFFFFF' },
    success: { main: '#2E7D50' },
    warning: { main: ORANGE },
    error:   { main: '#C0392B' },
    info:    { main: NAVY_SOFT },
    background: { default: BG, paper: PAPER },
    text: { primary: INK, secondary: TEXT },
    divider: LINE,
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: BODY,
    h1: { fontFamily: HEADING, fontWeight: 600, fontSize: '2.25rem', letterSpacing: '-0.01em', lineHeight: 1.2 },
    h2: { fontFamily: HEADING, fontWeight: 600, fontSize: '1.625rem', letterSpacing: '-0.005em', lineHeight: 1.25 },
    h3: { fontFamily: HEADING, fontWeight: 600, fontSize: '1.35rem', lineHeight: 1.3 },
    h4: { fontFamily: HEADING, fontWeight: 600, fontSize: '1.15rem' },
    h5: { fontFamily: BODY, fontWeight: 600, fontSize: '1rem' },
    h6: { fontFamily: BODY, fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: MUTED },
    body1: { fontSize: '0.9375rem', lineHeight: 1.55 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.55, color: TEXT },
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: 0, fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem', color: MUTED },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: BG },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-thumb': { background: alpha(NAVY, 0.2), borderRadius: 4 },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: `1px solid ${LINE}`, backgroundImage: 'none' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 3, paddingInline: 16, paddingBlock: 7 },
        containedPrimary: {
          background: NAVY,
          '&:hover': { background: NAVY_SOFT },
        },
        containedSecondary: {
          background: ORANGE,
          color: '#FFFFFF',
          '&:hover': { background: ORANGE_DARK },
        },
        outlinedPrimary: { borderColor: alpha(NAVY, 0.35), '&:hover': { borderColor: NAVY, background: alpha(NAVY, 0.04) } },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 3, fontWeight: 500, fontSize: '0.75rem', letterSpacing: '0.02em' },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', fullWidth: true, variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { background: PAPER, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: NAVY, borderWidth: 1 } },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 44,
          color: MUTED,
          '&.Mui-selected': { color: NAVY, fontWeight: 600 },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, background: ORANGE },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: PAPER, color: INK, borderBottom: `1px solid ${LINE}` },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: TEXT, background: alpha(NAVY, 0.03) },
      },
    },
    MuiLink: {
      styleOverrides: { root: { color: NAVY, textDecorationColor: alpha(NAVY, 0.4) } },
    },
  },
});

export const tokens = { NAVY, NAVY_SOFT, NAVY_INK, ORANGE, ORANGE_SOFT, ORANGE_DARK, BG, PAPER, INK, TEXT, MUTED, LINE, HEADING, BODY };
