import { createTheme, alpha } from '@mui/material/styles';

// NoticeIQ palette (extracted from lvuxportal.z33.web.core.windows.net/noticeiq bundle):
// primary #266798, deep navy #01448D, sidebar ink #0B162B, light accent #6EC1E4,
// page bg #F4F6F9, soft blue tint #E3ECF7, line #EDEFF3.
// Fonts: Open Sans (primary UI/headings), Roboto (secondary/body).
const NAVY        = '#266798';   // primary brand blue
const NAVY_SOFT   = '#3D82B5';
const NAVY_INK    = '#01448D';   // deep navy for headers, hover
const SIDEBAR     = '#0B162B';   // sidebar / dark chrome
const ACCENT      = '#6EC1E4';   // Elementor-style highlight
const ACCENT_SOFT = '#B8E0F2';
const BG          = '#F4F6F9';   // page background
const PAPER       = '#FFFFFF';
const TINT_BLUE   = '#E3ECF7';   // soft blue backgrounds
const INK         = '#1A1A1A';
const TEXT        = 'rgba(0, 0, 0, 0.87)';
const MUTED       = 'rgba(0, 0, 0, 0.6)';
const LINE        = '#EDEFF3';

// NoticeIQ uses Open Sans for UI + Roboto as secondary
const HEADING = '"Open Sans", "Helvetica Neue", Arial, sans-serif';
const BODY    = '"Open Sans", "Roboto", "Helvetica Neue", Arial, sans-serif';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: NAVY, light: NAVY_SOFT, dark: NAVY_INK, contrastText: '#FFFFFF' },
    secondary: { main: ACCENT, light: ACCENT_SOFT, dark: NAVY_INK, contrastText: '#0B162B' },
    success: { main: '#2E7D32' },
    warning: { main: '#ED6C02' },
    error:   { main: '#C62828' },
    info:    { main: NAVY },
    background: { default: BG, paper: PAPER },
    text: { primary: TEXT, secondary: MUTED },
    divider: LINE,
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: BODY,
    fontSize: 14,
    h1: { fontFamily: HEADING, fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.005em', lineHeight: 1.25 },
    h2: { fontFamily: HEADING, fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3 },
    h3: { fontFamily: HEADING, fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.35 },
    h4: { fontFamily: HEADING, fontWeight: 600, fontSize: '1.125rem' },
    h5: { fontFamily: HEADING, fontWeight: 600, fontSize: '1rem' },
    h6: { fontFamily: HEADING, fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: MUTED },
    body1: { fontSize: '0.875rem', lineHeight: 1.5 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5, color: MUTED },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em', fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem', color: MUTED },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: BG },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-thumb': { background: alpha(NAVY, 0.25), borderRadius: 4 },
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
        root: { borderRadius: 4, paddingInline: 16, paddingBlock: 6 },
        containedPrimary: {
          background: NAVY,
          '&:hover': { background: NAVY_INK },
        },
        containedSecondary: {
          background: ACCENT,
          color: SIDEBAR,
          '&:hover': { background: NAVY, color: '#FFFFFF' },
        },
        outlinedPrimary: { borderColor: alpha(NAVY, 0.4), '&:hover': { borderColor: NAVY, background: alpha(NAVY, 0.06) } },
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
        root: {
          background: PAPER,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: NAVY, borderWidth: 1 },
        },
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
          '&.Mui-selected': { color: NAVY, fontWeight: 700 },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, background: NAVY },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: PAPER, color: INK, borderBottom: `1px solid ${LINE}` },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: MUTED, background: TINT_BLUE },
      },
    },
    MuiLink: {
      styleOverrides: { root: { color: NAVY, textDecorationColor: alpha(NAVY, 0.4) } },
    },
  },
});

// Back-compat exports: legacy pages reference ORANGE / ORANGE_SOFT / ORANGE_DARK.
// Map them to NoticeIQ's accent so existing components keep working without churn.
export const tokens = {
  NAVY,
  NAVY_SOFT,
  NAVY_INK,
  SIDEBAR,
  ACCENT,
  ACCENT_SOFT,
  ORANGE: NAVY,          // legacy alias → primary
  ORANGE_SOFT: ACCENT,   // legacy alias → light accent
  ORANGE_DARK: NAVY_INK, // legacy alias → deep navy
  BG,
  PAPER,
  TINT_BLUE,
  INK,
  TEXT,
  MUTED,
  LINE,
  HEADING,
  BODY,
};
