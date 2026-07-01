import { createTheme, alpha } from '@mui/material/styles';

// Marston-inspired palette: deep navy blue anchor, muted gold accent,
// warm cream background. Classic UK utility feel.
const NAVY = '#0A2540';
const NAVY_SOFT = '#1B3A66';
const NAVY_INK = '#061729';
const GOLD = '#B08A2E';
const GOLD_SOFT = '#D4AA3E';
const CREAM = '#F7F4EC';
const PAPER = '#FFFFFF';
const INK = '#111827';
const MUTED = '#5B6473';
const LINE = '#E4E1D8';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: NAVY, light: NAVY_SOFT, dark: NAVY_INK, contrastText: '#FFFFFF' },
    secondary: { main: GOLD, light: GOLD_SOFT, dark: '#7C5F1D', contrastText: '#FFFFFF' },
    success: { main: '#2E7D50' },
    warning: { main: '#B87333' },
    error:   { main: '#B23A48' },
    info:    { main: NAVY_SOFT },
    background: { default: CREAM, paper: PAPER },
    text: { primary: INK, secondary: MUTED },
    divider: LINE,
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: '2.25rem', letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: '1.75rem', letterSpacing: '-0.015em' },
    h3: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: '1.375rem' },
    h4: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: '1.125rem' },
    h5: { fontWeight: 600, fontSize: '1rem' },
    h6: { fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: MUTED },
    body1: { fontSize: '0.9375rem', lineHeight: 1.55 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.55 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
    caption: { fontSize: '0.75rem', color: MUTED },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: CREAM },
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
        root: { borderRadius: 4, paddingInline: 18, paddingBlock: 8 },
        containedPrimary: {
          background: NAVY,
          '&:hover': { background: NAVY_SOFT },
        },
        outlinedPrimary: { borderColor: alpha(NAVY, 0.3), '&:hover': { borderColor: NAVY, background: alpha(NAVY, 0.04) } },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4, fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.02em' },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', fullWidth: true, variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { background: PAPER, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: NAVY } },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 44,
          color: MUTED,
          '&.Mui-selected': { color: NAVY },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, background: GOLD },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: PAPER, color: INK, borderBottom: `1px solid ${LINE}` },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: MUTED, background: alpha(NAVY, 0.02) },
      },
    },
  },
});

export const tokens = { NAVY, NAVY_SOFT, GOLD, GOLD_SOFT, CREAM, PAPER, INK, MUTED, LINE };
