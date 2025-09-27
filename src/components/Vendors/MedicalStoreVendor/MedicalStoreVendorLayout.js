import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { getPrescriptionCountNumber } from '../../../services/Vendors/MedicalStoreVendor.service';
import { useVendorTheme } from '../../../contexts/VendorThemeContext';
import MedicalStoreVendorHeader from './MedicalStoreVendorHeader';
import MedicalStoreVendorSidebar from './MedicalStoreVendorSidebar';

// Layout wrapper for all Medical Store Vendor components
const MedicalStoreVendorLayout = ({ children, title = "Dashboard", notificationCount = 0, onStatusUpdate }) => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // State management
  const [vendorData, setVendorData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [loading, setLoading] = useState(true);
  const [sidebarActive, setSidebarActive] = useState(true);
  const [prescriptionCount, setPrescriptionCount] = useState(0);

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const authData = vendorAuthService.getVendorAuthData();
    if (!authData || authData.userType !== 'vendor') {
      console.log('Vendor not authenticated, redirecting to login');
      navigate('/');
      return;
    }

    setVendorData(authData.vendorData);
    
    // Fetch prescription count
    try {
      console.log('🔍 Fetching prescription count for vendorId:', authData.vendorData.vendorId);
      const count = await getPrescriptionCountNumber(authData.vendorData.vendorId);
      console.log('📊 Prescription count received:', count);
      setPrescriptionCount(count);
    } catch (error) {
      console.error('❌ Error fetching prescription count:', error);
      setPrescriptionCount(0);
    }
    
    setLoading(false);
    console.log('Medical store vendor authenticated:', authData.vendorData);
  };

  const handleLogout = async () => {
    try {
      const authData = vendorAuthService.getVendorAuthData();
      if (authData && authData.vendorData && authData.vendorData.vendorId) {
        await vendorAuthService.vendorLogout(authData.vendorData.vendorId);
        console.log('Medical store vendor logged out successfully from server');
      }
    } catch (error) {
      console.error('Error calling logout API:', error);
    } finally {
      vendorAuthService.clearVendorAuthData();
      window.location.href = '/';
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Sidebar */}
      <MedicalStoreVendorSidebar 
        open={drawerOpen}
        onToggle={handleDrawerToggle} 
        vendorData={vendorData}
        sidebarActive={sidebarActive}
        setSidebarActive={setSidebarActive}
        prescriptionCount={prescriptionCount}
      />

      {/* Main Content */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        width: '100%', // Ensure content fills available space
      }}>
        {/* Header */}
        <MedicalStoreVendorHeader 
          title={title}
          onMenuClick={handleDrawerToggle} 
          vendorData={vendorData}
          onLogout={handleLogout}
          notificationCount={notificationCount}
          onStatusUpdate={onStatusUpdate}
        />

        {/* Content Area */}
        <Box sx={{ 
          flexGrow: 1, 
          p: { xs: 1, sm: 3 }, 
          mt: '72px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          height: 'calc(100vh - 72px)',
          overflowY: 'auto',
          backgroundColor: theme.palette.background.default,
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MedicalStoreVendorLayout; 