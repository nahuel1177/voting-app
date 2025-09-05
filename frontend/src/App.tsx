import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, useMediaQuery, Box, Container, useTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Parties from './pages/Parties';
import VotingTables from './pages/VotingTables';
//import Settings from './pages/Settings';
import { responsiveLightTheme, responsiveDarkTheme } from './theme';

// Simple page wrapper component
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: 'background.default',
        transition: 'opacity 0.2s ease-in-out',
      }}
    >
      {children}
    </Box>
  );
};

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check for saved theme preference, fallback to system preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? savedMode === 'true' : prefersDarkMode;
  });

  // Update theme when system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem('darkMode')) {
        setDarkMode(mediaQuery.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle dark/light mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', String(newMode));
      return newMode;
    });
  }, []);

  const theme = useMemo(() => {
    return darkMode ? responsiveDarkTheme : responsiveLightTheme;
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          pt: { xs: '64px', sm: '72px' }, // Account for AppBar height
          backgroundColor: 'background.default',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: theme.breakpoints.values.xl,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, sm: 4 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              }
            />
            <Route
              path="/parties"
              element={
                <PageWrapper>
                  <Parties />
                </PageWrapper>
              }
            />
            <Route
              path="/voting-tables"
              element={
                <PageWrapper>
                  <VotingTables />
                </PageWrapper>
              }
            />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
