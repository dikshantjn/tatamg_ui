// Healthcare Vendor Theme Configuration
export const vendorLightTheme = {
  palette: {
    mode: 'light',
    primary: {
      main: '#6C47FF',
      light: '#8B68FF',
      dark: '#4B32CC',
      contrastText: '#fff',
    },
    secondary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#fff',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
      card: '#FFFFFF',
      sidebar: '#FFFFFF',
      header: '#FFFFFF',
    },
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      disabled: '#A0AEC0',
    },
    divider: '#E2E8F0',
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#fff',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#fff',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      contrastText: '#fff',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#fff',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
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
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.05)',
    '0px 10px 15px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px rgba(0, 0, 0, 0.05)',
    '0px 25px 50px rgba(0, 0, 0, 0.10)',
    ...Array(19).fill('0px 25px 50px rgba(0, 0, 0, 0.10)'),
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1A202C',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
};

export const vendorDarkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B68FF',
      light: '#A584FF',
      dark: '#6C47FF',
      contrastText: '#fff',
    },
    secondary: {
      main: '#64B5F6',
      light: '#90CAF9',
      dark: '#42A5F5',
      contrastText: '#fff',
    },
    background: {
      default: '#0D1117',
      paper: '#161B22',
      card: '#21262D',
      sidebar: '#161B22',
      header: '#161B22',
    },
    text: {
      primary: '#F0F6FC',
      secondary: '#8B949E',
      disabled: '#484F58',
    },
    divider: '#30363D',
    success: {
      main: '#238636',
      light: '#2EA043',
      dark: '#1A7F37',
      contrastText: '#fff',
    },
    warning: {
      main: '#D29922',
      light: '#F2CC60',
      dark: '#BB8009',
      contrastText: '#fff',
    },
    error: {
      main: '#F85149',
      light: '#FF7B72',
      dark: '#DA3633',
      contrastText: '#fff',
    },
    info: {
      main: '#58A6FF',
      light: '#79C0FF',
      dark: '#388BFD',
      contrastText: '#fff',
    },
    grey: {
      50: '#F0F6FC',
      100: '#C9D1D9',
      200: '#B1BAC4',
      300: '#8B949E',
      400: '#6E7681',
      500: '#484F58',
      600: '#30363D',
      700: '#21262D',
      800: '#161B22',
      900: '#0D1117',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: '#F0F6FC',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: '#F0F6FC',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#F0F6FC',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: '#F0F6FC',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      color: '#F0F6FC',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#F0F6FC',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#F0F6FC',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#8B949E',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#8B949E',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.3)',
    '0px 4px 6px rgba(0, 0, 0, 0.3)',
    '0px 10px 15px rgba(0, 0, 0, 0.3)',
    '0px 20px 25px rgba(0, 0, 0, 0.3)',
    '0px 25px 50px rgba(0, 0, 0, 0.4)',
    ...Array(19).fill('0px 25px 50px rgba(0, 0, 0, 0.4)'),
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
          border: '1px solid #30363D',
          backgroundColor: '#21262D',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#161B22',
          color: '#F0F6FC',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#161B22',
          color: '#F0F6FC',
          borderRight: '1px solid #30363D',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#30363D',
          },
          '&.Mui-selected': {
            backgroundColor: '#8B68FF20',
            color: '#8B68FF',
            '&:hover': {
              backgroundColor: '#8B68FF30',
            },
          },
        },
      },
    },
  },
}; 