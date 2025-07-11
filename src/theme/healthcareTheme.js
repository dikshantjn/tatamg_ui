import { createTheme } from '@mui/material/styles';

// Healthcare-appropriate color palette
const healthcareTheme = createTheme({
  palette: {
    primary: {
      main: '#38A3A5', // Teal - healthcare primary
      light: '#66BB6A',
      dark: '#2C7A7B',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4ECDC4', // Mint green
      light: '#7DD3C7',
      dark: '#2ECC71',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4CAF50',
      light: '#66BB6A',
      dark: '#388E3C',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#F44336',
      light: '#EF5350',
      dark: '#D32F2F',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#1A365D',
      secondary: '#64748B',
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.12)',
    '0px 12px 24px rgba(0, 0, 0, 0.15)',
    '0px 16px 32px rgba(0, 0, 0, 0.18)',
    '0px 20px 40px rgba(0, 0, 0, 0.20)',
    '0px 24px 48px rgba(0, 0, 0, 0.22)',
    '0px 28px 56px rgba(0, 0, 0, 0.24)',
    '0px 32px 64px rgba(0, 0, 0, 0.26)',
    '0px 36px 72px rgba(0, 0, 0, 0.28)',
    '0px 40px 80px rgba(0, 0, 0, 0.30)',
    '0px 44px 88px rgba(0, 0, 0, 0.32)',
    '0px 48px 96px rgba(0, 0, 0, 0.34)',
    '0px 52px 104px rgba(0, 0, 0, 0.36)',
    '0px 56px 112px rgba(0, 0, 0, 0.38)',
    '0px 60px 120px rgba(0, 0, 0, 0.40)',
    '0px 64px 128px rgba(0, 0, 0, 0.42)',
    '0px 68px 136px rgba(0, 0, 0, 0.44)',
    '0px 72px 144px rgba(0, 0, 0, 0.46)',
    '0px 76px 152px rgba(0, 0, 0, 0.48)',
    '0px 80px 160px rgba(0, 0, 0, 0.50)',
    '0px 84px 168px rgba(0, 0, 0, 0.52)',
    '0px 88px 176px rgba(0, 0, 0, 0.54)',
    '0px 92px 184px rgba(0, 0, 0, 0.56)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(56, 163, 165, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #38A3A5, #2C7A7B)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2C7A7B, #1A5F5F)',
          },
        },
        outlined: {
          borderColor: '#38A3A5',
          color: '#38A3A5',
          '&:hover': {
            background: 'rgba(56, 163, 165, 0.08)',
            borderColor: '#2C7A7B',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default healthcareTheme; 