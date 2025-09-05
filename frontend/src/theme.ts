import { createTheme, alpha, ThemeOptions, responsiveFontSizes, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      card: string;
      hover: string;
      elevation1: string;
      elevation4: string;
      elevation8: string;
    };
  }
  interface ThemeOptions {
    customShadows?: {
      card?: string;
      hover?: string;
      elevation1?: string;
      elevation4?: string;
      elevation8?: string;
    };
  }

  interface TypographyVariants {
    button: React.CSSProperties;
    overline: React.CSSProperties;
    subtitle3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    button?: React.CSSProperties;
    overline?: React.CSSProperties;
    subtitle3?: React.CSSProperties;
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      card: string;
      hover: string;
      elevation1: string;
      elevation4: string;
      elevation8: string;
    };
  }
  interface ThemeOptions {
    customShadows?: {
      card?: string;
      hover?: string;
      elevation1?: string;
      elevation4?: string;
      elevation8?: string;
    };
  }

  interface TypographyVariants {
    button: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    button?: React.CSSProperties;
  }
}

// Define the custom shadows type
type CustomShadows = {
  card: string;
  hover: string;
  elevation1: string;
  elevation4: string;
  elevation8: string;
};

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
  }
  interface ThemeOptions {
    customShadows?: Partial<CustomShadows>;
  }
}

const customShadows: CustomShadows = {
  card: '0 1px 3px rgba(0, 0, 0, 0.08)',
  hover: '0 8px 30px rgba(0, 0, 0, 0.12)',
  elevation1: '0px 1px 2px rgba(0, 0, 0, 0.08)',
  elevation4: '0px 4px 12px rgba(0, 0, 0, 0.08)',
  elevation8: '0px 8px 24px rgba(0, 0, 0, 0.08)',
};

const baseTheme: ThemeOptions = {
  customShadows,
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.25,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.875rem',
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
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      fontWeight: 500,
    },
    subtitle3: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 1.5,
      textTransform: 'uppercase' as const,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 8px 30px 0 rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: "dark",
        },
      },
    },
  },
};

// Light Theme
const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#2773F5',
      light: '#818CF8',
      dark: '#1966B3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#10B981',
      light: '#6EE7B7',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444',
      light: '#FCA5A5',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6',
      light: '#93C5FD',
      dark: '#2563EB',
    },
    success: {
      main: '#10B981',
      light: '#6EE7B7',
      dark: '#059669',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      disabled: '#9CA3AF',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 20px',
          fontWeight: 500,
          textTransform: 'none' as const,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: (theme: any) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          boxShadow: theme.customShadows.elevation1,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: theme.customShadows.elevation8,
            transform: 'translateY(-2px)',
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 8,
        },
        elevation1: ({ theme }: { theme: Theme }) => ({
          boxShadow: theme.customShadows?.elevation1 || 'none',
        }),
        elevation4: ({ theme }: { theme: Theme }) => ({
          boxShadow: theme.customShadows?.elevation4 || 'none',
        }),
        elevation8: ({ theme }: { theme: Theme }) => ({
          boxShadow: theme.customShadows?.elevation8 || 'none',
        }),
      },
    },
    MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
          head: (props) => ({
          fontWeight: 600,
          backgroundColor:
            props.theme.palette.mode === 'light'
              ? alpha(props.theme.palette.grey[100], 0.5)
              : alpha(props.theme.palette.grey[900], 0.5),
        }),
        },
      },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1.5px',
          },
        },
        input: {
          padding: '12px 14px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: 'text.primary',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
});

// Dark Theme
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#818CF8',
      light: '#A5B4FC',
      dark: '#6366F1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F87171',
      light: '#FCA5A5',
      dark: '#EF4444',
    },
    warning: {
      main: '#FBBF24',
      light: '#FCD34D',
      dark: '#F59E0B',
    },
    info: {
      main: '#60A5FA',
      light: '#93C5FD',
      dark: '#3B82F6',
    },
    success: {
      main: '#34D399',
      light: '#6EE7B7',
      dark: '#10B981',
    },
    background: {
      default: '#111827',
      paper: '#1F2937',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      disabled: '#9CA3AF',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
});

// Apply responsive font sizes
export const responsiveLightTheme = responsiveFontSizes(lightTheme);
export const responsiveDarkTheme = responsiveFontSizes(darkTheme);

// Default export with light theme
export default lightTheme;
