import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Paper,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Badge,
  Avatar,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  ExpandMore as ChevronDownIcon,
  Mic as MicIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  GpsFixed as GpsFixedIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  History as HistoryIcon,
  LocalShipping as TrackingIcon,
  FolderSpecial as HealthRecordsIcon,
  Emergency as EmergencyIcon
} from '@mui/icons-material';
import Logo from '../../ui/Logo';
import { colors } from '../../../styles/colors';
import { clearAuthData, getUserId } from '../../../services/User/Auth/auth.utils';
import { userService } from '../../../services/User/Profile/user.service';
import { fetchCartItems, selectCartItemCount } from '../../../store/slices/cartSlice';

// Add CSS animation for gradient border
const gradientBorderStyle = `
  @keyframes gradientMove {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

// Inject the CSS into the document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = gradientBorderStyle;
  if (!document.head.querySelector('style[data-gradient-animation]')) {
    styleElement.setAttribute('data-gradient-animation', 'true');
    document.head.appendChild(styleElement);
  }
}

const SearchBox = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    'Search for doctors...',
    'Search for hospitals...',
    'Search for blood banks...',
    'Search for pharmacies...',
    'Search for ambulance...',
    'Search for lab tests...',
    'Search for medicine delivery...',
    'Search for bed booking...',
    'Search for consultations...',
    'Search for physiotherapy...',
    'Search for care at home...',
    'Search for medical tourism...'
  ];

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const popularLocations = [
    { name: 'Mumbai', address: 'Maharashtra, India' },
    { name: 'Delhi', address: 'National Capital Territory, India' },
    { name: 'Bangalore', address: 'Karnataka, India' },
    { name: 'Hyderabad', address: 'Telangana, India' },
    { name: 'Chennai', address: 'Tamil Nadu, India' }
  ];

  const handleLocationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLocationClose = () => {
    setAnchorEl(null);
    setLocationSearch('');
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.name);
    handleLocationClose();
  };

  const handleUseCurrentLocation = () => {
    // Implement geolocation logic here
    handleLocationClose();
  };

  const filteredLocations = popularLocations.filter(location =>
    location.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    location.address.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <Box sx={{ 
      flex: 1, 
      maxWidth: 600, 
      mx: 2,
      display: { xs: 'none', md: 'flex' }
    }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          bgcolor: '#F8FAFC',
          border: `1px solid ${colors.primary}`,
          borderRadius: 1.5,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:focus-within': {
            bgcolor: 'white',
            borderColor: colors.primary,
            boxShadow: `0 0 0 3px rgba(56, 163, 165, 0.1)`,
            transform: 'scale(1.01)'
          }
        }}
      >
        {/* Location Section */}
        <Box sx={{ 
          borderRight: '1px solid #E2E8F0',
          minWidth: 140,
          maxWidth: 180
        }}>
          <Button
            onClick={handleLocationClick}
            startIcon={<LocationIcon sx={{ fontSize: 16 }} />}
            endIcon={<ChevronDownIcon sx={{ 
              fontSize: 16,
              transform: anchorEl ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s ease'
            }} />}
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              px: 1.5,
              py: 1,
              color: '#64748B',
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: 0,
              '&:hover': {
                bgcolor: 'rgba(56, 163, 165, 0.05)'
              }
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '0.875rem'
              }}
            >
              {selectedLocation}
            </Typography>
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLocationClose}
            PaperProps={{
              sx: {
                width: 320,
                maxHeight: 400,
                mt: 1,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #E2E8F0'
              }
            }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search location..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: '#64748B' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5
                  }
                }}
              />
            </Box>

            <MenuItem onClick={handleUseCurrentLocation} sx={{ mx: 1, borderRadius: 1 }}>
              <ListItemIcon>
                <GpsFixedIcon sx={{ fontSize: 18, color: colors.primary }} />
              </ListItemIcon>
              <ListItemText primary="Use current location" />
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            {filteredLocations.map((location, index) => (
              <MenuItem 
                key={index}
                onClick={() => handleLocationSelect(location)}
                sx={{ mx: 1, borderRadius: 1, flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {location.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {location.address}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Search Section */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder={placeholders[placeholderIndex]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#64748B' }} />
                </InputAdornment>
              ),
              disableUnderline: true
            }}
            sx={{
              '& .MuiInputBase-root': {
                px: 2,
                py: 1,
                fontSize: '0.875rem'
              },
              '& .MuiInputBase-input': {
                '&::placeholder': {
                  color: '#94A3B8',
                  opacity: 1
                }
              }
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

const Header = ({ isAuthenticated, onAuthChange, onShowSignIn }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const cartItemCount = useSelector(selectCartItemCount);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNav, setShowNav] = useState(true);

  // Fetch cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isAuthenticated]);

  // Scroll handling for header styling and navigation visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      // Show/hide navigation based on scroll direction
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down - hide nav
          setShowNav(false);
        } else {
          // Scrolling up - show nav
          setShowNav(true);
        }
      } else {
        // At top of page - always show nav
        setShowNav(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Fetch user profile data when authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const userId = getUserId();
          if (userId) {
            const response = await userService.getUserDetails(userId);
            if (response.data) {
              const formattedData = userService.formatUserData(response.data);
              setUserProfile(formattedData);
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  // Handle profile menu
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  // Handle Emergency Button Click
  const handleEmergencyClick = () => {
    setShowEmergencyModal(true);
  };

  const proceedToCall = () => {
    setShowEmergencyModal(false);
    const confirmCall = window.confirm("Do you want to call emergency services?");
    if (confirmCall) {
      window.location.href = "tel:+919921003190";
    }
  };

  // Navigation function
  const handleLinkClick = (path) => {
    setIsDrawerOpen(false);
    setProfileAnchorEl(null);
    document.body.style.overflow = 'auto';
    navigate(path);
  };

  // Handle Login Click
  const handleLoginClick = () => {
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
      document.body.style.overflow = 'auto';
    }
    if (onShowSignIn) {
      onShowSignIn();
    }
  };

  // Handle speech recognition
  const handleSpeakClick = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMobileSearchQuery(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser. Please try using Chrome or Edge.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setProfileAnchorEl(null);
    setIsDrawerOpen(false);
    document.body.style.overflow = 'auto';

    clearAuthData();
    onAuthChange(false);
    navigate("/");
  };

  // Handle Drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    document.body.style.overflow = !isDrawerOpen ? 'hidden' : 'auto';
  };

  // Navigation Links
  const mainNavLinks = [
    { path: '/ambulance', text: 'AMBULANCE' },
    { path: '/blood-bank', text: 'BLOOD BANK' },
    { path: '/medicine-order', text: 'MEDICINE DELIVERY' },
    { path: '/hospital-bed-booking', text: 'HOSPITAL BED BOOKING' },
    { path: '/doctor-consultation', text: 'CONSULT DOCTORS' },
    { path: '/lab-tests', text: 'LAB TESTS' },
    { path: '/products', text: 'PRODUCTS' },
    { path: '/child-care', text: 'CHILD CARE' },
    { path: '/ayurveda', text: 'AYURVEDA' },
    { path: '/medical-loans', text: 'MEDICAL LOANS' },
  ];

  const subNavLinks = [
    { path: '/physiotherapy', text: 'Physiotherapy' },
    { path: '/care-at-home', text: 'Care At Home' },
    { path: '/medical-tourism', text: 'Medical Tourism' },
    { path: '/rehabilitation', text: 'Rehabilitation' },
    { path: '/early-detection', text: 'Early Detection' },
    { path: '/nutrition', text: 'Nutrition' },
    { path: '/pet-care', text: 'Pet Care' },
    { path: '/organ-donation', text: 'Organ/Hair Donation' },
    { path: '/vaccines', text: 'Vaccines' },
    { path: '/maternal-care', text: 'Maternal Care' },
    { path: '/insurance', text: 'Medical Insurance' },
    { path: '/health-blogs', text: 'Health Blogs' },
  ];

  // Profile dropdown items
  const profileDropdownItems = [
    { path: '/profile', text: 'My Profile', icon: <AccountCircleIcon /> },
    { path: '/order-history', text: 'My Orders', icon: <HistoryIcon /> },
    { path: '/track-order', text: 'Track Order', icon: <TrackingIcon /> },
    { path: '/health-records', text: 'Health Records', icon: <HealthRecordsIcon /> }
  ];

  // Render profile section
  const renderProfileSection = () => {
    if (isAuthenticated) {
      return (
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton
            onClick={handleProfileClick}
            size="small"
            sx={{
              width: 40,
              height: 40,
              color: '#1A365D',
              '&:hover': {
                bgcolor: 'rgba(56, 163, 165, 0.1)'
              }
            }}
          >
            {userProfile && userProfile.photo ? (
              <Avatar 
                src={userProfile.photo} 
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <PersonIcon />
            )}
          </IconButton>

          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #E2E8F0'
              }
            }}
          >
            {profileDropdownItems.map((item) => (
              <MenuItem 
                key={item.path}
                component={Link}
                to={item.path}
                onClick={() => {
                  handleLinkClick(item.path);
                  handleProfileClose();
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>
      );
    }
    
    return (
      <Button
        onClick={handleLoginClick}
        startIcon={<PersonIcon />}
        sx={{
          color: '#1A365D',
          textTransform: 'none',
          fontWeight: 500,
          px: 2,
          borderRadius: 2,
          display: { xs: 'none', md: 'flex' },
          '&:hover': {
            bgcolor: 'rgba(56, 163, 165, 0.1)'
          }
        }}
      >
        Login
      </Button>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Main Header */}
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{ 
          bgcolor: 'white',
          color: 'text.primary',
          transition: 'all 0.3s ease',
          transform: isScrolled ? 'translateY(0)' : 'translateY(0)'
        }}
      >
        {/* Top Toolbar */}
        <Toolbar 
          sx={{ 
            px: { xs: 2, sm: 4 },
            py: 0.75,
            minHeight: '64px !important'
          }}
        >
          {/* Logo Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            minWidth: { xs: 'auto', md: 220 }
          }}>
            {isMobile && (
              <IconButton
                onClick={toggleDrawer}
                sx={{ 
                  color: '#1A365D',
                  p: 1
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Logo size={isMobile ? 'small' : 'regular'} />
            </Link>
          </Box>

          {/* Search Box - Desktop Only */}
          <SearchBox />

          {/* Right Actions */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            mr: { xs: 0, md: 0.5 },
            ml: { xs: 'auto', md: 0 }
          }}>
            {/* Vedika Plus Button */}
            <Button
              component={Link}
              to="/membership"
              sx={{
                color: 'primary.main',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                borderRadius: 2,
                display: { xs: 'none', md: 'flex' },
                background: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 215, 0, 0.1)'
                }
              }}
            >
              Vedika<Box component="span" sx={{ color: 'white', bgcolor: '#8A2BE2', px: 0.5, borderRadius: 2, ml: 0.5 }}>Plus</Box>
            </Button>

            {/* Vedika AI Button */}
            <Button
              onClick={handleSpeakClick}
              startIcon={<MicIcon />}
              sx={{
                background: 'transparent',
                color: '#8A2BE2',
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                borderRadius: 2,
                display: { xs: 'none', md: 'flex' },
                position: 'relative',
                overflow: 'visible',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-1px',
                  left: '-1px',
                  right: '-1px',
                  bottom: '-1px',
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #8A2BE2, #4169E1, #FF1493, #00CED1)',
                  backgroundSize: '300% 300%',
                  animation: 'gradientMove 3s ease infinite',
                  zIndex: -2
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  right: '0px',
                  bottom: '0px',
                  borderRadius: 2,
                  background: 'white',
                  zIndex: -1
                },
                '&:hover': {
                  color: '#6A1B9A'
                }
              }}
            >
              Vedika AI
            </Button>

            {/* Emergency Button */}
            <Button
              onClick={handleEmergencyClick}
              startIcon={<EmergencyIcon />}
              sx={{
                color: 'error.main',
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                borderRadius: 2,
                display: { xs: 'none', md: 'flex' },
                border: '1px solid #f44336',
                '&:hover': {
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  borderColor: '#d32f2f'
                }
              }}
            >
              Emergency
            </Button>

            {/* Cart Button */}
            <IconButton
              component={Link}
              to="/checkout-product-medicine"
              sx={{
                color: '#1A365D',
                '&:hover': {
                  bgcolor: 'rgba(56, 163, 165, 0.1)'
                }
              }}
            >
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Profile Section */}
            {renderProfileSection()}

            {/* Mobile Sign In Button */}
            {!isAuthenticated && isMobile && (
              <Button
                onClick={handleLoginClick}
                variant="contained"
                size="small"
                sx={{
                  bgcolor: colors.primary,
                  color: 'white',
                  textTransform: 'none',
                  px: 2,
                  borderRadius: 2
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Search Bar */}
        {isMobile && (
          <Box sx={{ 
            px: 2, 
            pb: 1,
            display: { xs: 'block', md: 'none' },
            position: isScrolled ? 'sticky' : 'static',
            top: isScrolled ? 0 : 'auto',
            zIndex: isScrolled ? 1000 : 'auto',
            bgcolor: 'white',
            borderBottom: isScrolled ? '1px solid #E2E8F0' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search for doctors, hospitals, services..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748B' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleSpeakClick}>
                      <MicIcon sx={{ color: colors.primary }} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#F8FAFC',
                  borderRadius: 2,
                  border: `1px solid ${colors.primary}`,
                  py: 0.5,
                  '&:focus-within': {
                    bgcolor: 'white',
                    transform: 'scale(1.01)'
                  }
                }
              }}
            />
          </Box>
        )}

        {/* Navigation Links */}
        <Box sx={{ 
          px: { xs: 2, sm: 4 },
          display: { xs: 'none', lg: 'block' },
          borderTop: '1px solid #E2E8F0',
          transform: showNav ? 'translateY(0)' : 'translateY(-100%)',
          opacity: showNav ? 1 : 0,
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          maxHeight: showNav ? '200px' : '0px'
        }}>
          {/* Main Navigation */}
          <Box sx={{ 
            display: 'flex', 
            gap: 0.5,
            py: 1,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' }
          }}>
            {mainNavLinks.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  color: location.pathname === link.path ? colors.primary : '#64748B',
                  textTransform: 'none',
                  fontWeight: location.pathname === link.path ? 600 : 500,
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                  minWidth: 'auto',
                  whiteSpace: 'nowrap',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'rgba(56, 163, 165, 0.1)',
                    color: colors.primary
                  }
                }}
              >
                {link.text}
              </Button>
            ))}
          </Box>

          {/* Sub Navigation */}
          <Box sx={{ 
            display: 'flex', 
            gap: 0.5,
            pb: 1,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' }
          }}>
            {subNavLinks.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  color: location.pathname === link.path ? colors.primary : '#94A3B8',
                  textTransform: 'none',
                  fontWeight: location.pathname === link.path ? 600 : 400,
                  fontSize: '0.7rem',
                  px: 1.5,
                  py: 0.5,
                  minWidth: 'auto',
                  whiteSpace: 'nowrap',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'rgba(56, 163, 165, 0.1)',
                    color: colors.primary
                  }
                }}
              >
                {link.text}
              </Button>
            ))}
          </Box>
        </Box>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 320,
            bgcolor: 'white'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* User Profile Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            p: 2,
            bgcolor: '#F8FAFC',
            borderRadius: 2
          }}>
            <Avatar
              src={userProfile?.photo}
              sx={{ width: 48, height: 48 }}
            >
              {userProfile?.name?.charAt(0) || <PersonIcon />}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              {isAuthenticated && userProfile ? (
                <>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {userProfile.name || 'Welcome User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userProfile.phone_number || 'No phone number'}
                  </Typography>
                  <Button
                    component={Link}
                    to="/profile"
                    onClick={toggleDrawer}
                    size="small"
                    sx={{ 
                      mt: 1,
                      textTransform: 'none',
                      color: colors.primary
                    }}
                  >
                    View & Edit Profile
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  variant="contained"
                  sx={{
                    bgcolor: colors.primary,
                    color: 'white',
                    textTransform: 'none'
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          </Box>

          {/* Navigation Links */}
          <List>
            {[...mainNavLinks, ...subNavLinks].map((link) => (
              <ListItem
                key={link.path}
                component={Link}
                to={link.path}
                onClick={() => handleLinkClick(link.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  color: location.pathname === link.path ? colors.primary : 'text.primary',
                  bgcolor: location.pathname === link.path ? 'rgba(56, 163, 165, 0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(56, 163, 165, 0.1)'
                  }
                }}
              >
                <ListItemText 
                  primary={link.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === link.path ? 600 : 400
                  }}
                />
              </ListItem>
            ))}

            {isAuthenticated && (
              <>
                <Divider sx={{ my: 2 }} />
                {profileDropdownItems.map((item) => (
                  <ListItem
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={() => handleLinkClick(item.path)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(56, 163, 165, 0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
                <ListItem
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 1,
                    color: 'error.main',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(244, 67, 54, 0.1)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Emergency Modal */}
      <Dialog
        open={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
          Emergency Service
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            English
          </Typography>
          <Typography paragraph>
            Thank you for choosing our Emergency Service. For immediate assistance and 24/7 support, please select one of our Premium Membership Plans that includes:
          </Typography>
          <Box component="ul" sx={{ textAlign: 'left', mb: 2 }}>
            <li>24/7 Priority Emergency Support</li>
            <li>Instant Lab Test Booking & Report Delivery</li>
            <li>Direct Access to Healthcare Professionals</li>
            <li>Unlimited Digital Health Records Storage</li>
          </Box>

          <Typography variant="h6" gutterBottom>
            हिंदी
          </Typography>
          <Typography paragraph>
            आपातकालीन सेवा चुनने के लिए धन्यवाद। तत्काल सहायता और 24/7 सपोर्ट के लिए, कृपया हमारी प्रीमियम सदस्यता योजनाओं में से एक चुनें जिसमें शामिल हैं:
          </Typography>
          <Box component="ul" sx={{ textAlign: 'left' }}>
            <li>24/7 प्राथमिकता आपातकालीन सहायता</li>
            <li>तत्काल लैब टेस्ट बुकिंग और रिपोर्ट डिलीवरी</li>
            <li>स्वास्थ्य पेशेवरों तक सीधी पहुंच</li>
            <li>असीमित डिजिटल स्वास्थ्य रिकॉर्ड स्टोरेज</li>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 3 }}>
          <Button
            onClick={proceedToCall}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none' }}
          >
            Connect to Emergency Support
          </Button>
          <Button
            onClick={() => setShowEmergencyModal(false)}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Header;