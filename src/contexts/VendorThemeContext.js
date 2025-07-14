import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { vendorLightTheme, vendorDarkTheme } from '../theme/vendorTheme';

const VendorThemeContext = createContext();

export const useVendorTheme = () => {
  const context = useContext(VendorThemeContext);
  if (!context) {
    throw new Error('useVendorTheme must be used within a VendorThemeProvider');
  }
  return context;
};

export const VendorThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('vendorDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('vendorDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = createTheme(isDarkMode ? vendorDarkTheme : vendorLightTheme);

  const contextValue = {
    isDarkMode,
    toggleDarkMode,
    theme,
  };

  return (
    <VendorThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </VendorThemeContext.Provider>
  );
}; 