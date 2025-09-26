import React, { useState, useEffect, useRef } from 'react';
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
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  ExpandMore as ChevronDownIcon,
  Mic as MicIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  ShoppingCartOutlined as ShoppingCartIcon,
  GpsFixed as GpsFixedIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  History as HistoryIcon,
  LocalShippingOutlined as TrackingIcon,
  FolderSpecialOutlined as HealthRecordsIcon,
  Emergency as EmergencyIcon,
  Close as CloseIcon,
  NotificationsOutlined as NotificationsIcon,
  PersonAddOutlined as InviteFriendsIcon,
  SettingsOutlined as SettingsIcon,
  HelpOutline as HelpCenterIcon,
  DescriptionOutlined as TermsIcon
} from '@mui/icons-material';
import Logo from '../../ui/Logo';
import VedikaAIModal from '../VedikaAI/VedikaAIModal';
import { colors } from '../../../styles/colors';
import { clearAuthData, getUserId } from '../../../services/User/Auth/auth.utils';
import { userService } from '../../../services/User/Profile/user.service';
import { notificationService } from '../../../services/User/Notifications/notification.service';
import { fcmService } from '../../../services/User/FCM/fcm.service';
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
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const searchInputRef = useRef(null);

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

  const searchSuggestions = [
    { text: 'Cardiologist', category: 'Doctors', icon: '🫀' },
    { text: 'Dermatologist', category: 'Doctors', icon: '🧴' },
    { text: 'Pediatrician', category: 'Doctors', icon: '👶' },
    { text: 'Apollo Hospital', category: 'Hospitals', icon: '🏥' },
    { text: 'Fortis Healthcare', category: 'Hospitals', icon: '🏥' },
    { text: 'Blood Bank Near Me', category: 'Blood Banks', icon: '🩸' },
    { text: 'Medicine Delivery', category: 'Services', icon: '💊' },
    { text: 'Lab Tests', category: 'Services', icon: '🧪' },
    { text: 'Ambulance Service', category: 'Emergency', icon: '🚑' },
    { text: 'Physiotherapy', category: 'Services', icon: '🏃' },
    { text: 'Mental Health', category: 'Services', icon: '🧠' },
    { text: 'Dental Care', category: 'Doctors', icon: '🦷' }
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

  const handleSearchFocus = (event) => {
    if (searchQuery.trim()) {
      setSearchAnchorEl(searchInputRef.current);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      setSearchAnchorEl(searchInputRef.current);
    } else {
      setSearchAnchorEl(null);
    }
  };

  const handleSearchInputClick = (event) => {
    if (searchQuery.trim()) {
      setSearchAnchorEl(searchInputRef.current);
    }
  };

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };

  const handleSearchSelect = (suggestion) => {
    setSearchQuery(suggestion.text);
    setSearchAnchorEl(null);
  };

  const filteredLocations = popularLocations.filter(location =>
    location.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    location.address.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    suggestion.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ 
      flex: 1, 
      maxWidth: 800, 
      mx: 2,
      display: { xs: 'none', md: 'flex' }
    }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: 40,
          bgcolor: '#F8FAFC',
          border: `1px solid ${colors.primary}`,
          borderRadius: 2,
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
              height: 40,
              justifyContent: 'space-between',
              px: 1.5,
              py: 0.5,
              color: '#64748B',
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: 0,
              minHeight: 'auto',
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
            ref={searchInputRef}
            fullWidth
            variant="standard"
            placeholder={placeholders[placeholderIndex]}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onClick={handleSearchInputClick}
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
                py: 0.5,
                height: 40,
                fontSize: '0.875rem'
              },
              '& .MuiInputBase-input': {
                height: '100%',
                '&::placeholder': {
                  color: '#94A3B8',
                  opacity: 1
                }
              }
            }}
          />

          {/* Search Suggestions Menu */}
          <Menu
            anchorEl={searchAnchorEl}
            open={Boolean(searchAnchorEl)}
            onClose={handleSearchClose}
            disableAutoFocus
            disableEnforceFocus
            disableRestoreFocus
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                width: 400,
                maxHeight: 400,
                mt: 1,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #E2E8F0',
                borderRadius: 2
              }
            }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 1, fontSize: '0.8rem' }}>
                Search Suggestions
              </Typography>
            </Box>
            <Divider />
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                <MenuItem 
                  key={index}
                  onClick={() => handleSearchSelect(suggestion)}
                  sx={{ 
                    mx: 1, 
                    borderRadius: 1,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(56, 163, 165, 0.05)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    <Box sx={{ fontSize: '1.2rem' }}>
                      {suggestion.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500} sx={{ color: '#1A365D' }}>
                        {suggestion.text}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                        {suggestion.category}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No suggestions found
                </Typography>
              </Box>
            )}
          </Menu>
        </Box>
      </Paper>
    </Box>
  );
};

const Header = ({ isAuthenticated = false, onAuthChange = () => {}, onShowSignIn = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const cartItemCount = useSelector(selectCartItemCount);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [mobileSearchAnchorEl, setMobileSearchAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [mobilePlaceholderIndex, setMobilePlaceholderIndex] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [showVedikaAI, setShowVedikaAI] = useState(false);
  const topBarRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Mobile search placeholders
  const mobilePlaceholders = [
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

  // Rotate mobile placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setMobilePlaceholderIndex((prev) => (prev + 1) % mobilePlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [mobilePlaceholders.length]);

  // Fetch cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isAuthenticated]);

  // Scroll handling for header styling and mobile top bar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;

      setIsScrolled(currentScrollY > 10);

      if (isMobile) {
        if (currentScrollY < 10) {
          // At the top - show header
          setIsHeaderVisible(true);
        } else if (scrollDifference > 0 && currentScrollY > 10) {
          // Scrolling down - hide top bar
          setIsHeaderVisible(false);
        }
        // Don't show header when scrolling up - only show at top
      } else {
        // Desktop keeps header visible
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile]);

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

  // Fetch unread notification count when authenticated
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isAuthenticated) {
        try {
          const userId = getUserId();
          if (userId) {
            const count = await notificationService.getUnreadCount(userId);
            setUnreadNotificationCount(count);
          }
        } catch (error) {
          console.error('Error fetching unread notification count:', error);
          setUnreadNotificationCount(0);
        }
      } else {
        setUnreadNotificationCount(0);
      }
    };

    fetchUnreadCount();
    
    // Refresh notification count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
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
    if (onShowSignIn && typeof onShowSignIn === 'function') {
      onShowSignIn();
    }
  };

  // Handle mobile search suggestions
  const handleMobileSearchFocus = (event) => {
    if (mobileSearchQuery.trim()) {
      setMobileSearchAnchorEl(mobileSearchInputRef.current);
    }
  };

  const handleMobileSearchChange = (event) => {
    const value = event.target.value;
    setMobileSearchQuery(value);
    if (value.trim()) {
      setMobileSearchAnchorEl(mobileSearchInputRef.current);
    } else {
      setMobileSearchAnchorEl(null);
    }
  };

  const handleMobileSearchInputClick = (event) => {
    if (mobileSearchQuery.trim()) {
      setMobileSearchAnchorEl(mobileSearchInputRef.current);
    }
  };

  const handleMobileSearchClose = () => {
    setMobileSearchAnchorEl(null);
  };

  const handleMobileSearchSelect = (suggestion) => {
    setMobileSearchQuery(suggestion.text);
    setMobileSearchAnchorEl(null);
  };

  // Handle speech recognition
  const handleSpeakClick = () => {
    setShowVedikaAI(true);
  };

  // Handle Logout
  const handleLogout = async () => {
    setProfileAnchorEl(null);
    setIsDrawerOpen(false);
    document.body.style.overflow = 'auto';

    // Remove FCM token before clearing auth data
    try {
      const userId = getUserId();
      if (userId) {
        console.log('🔔 Removing FCM token on logout for userId:', userId);
        await fcmService.removeFCMToken(userId);
        console.log('✅ FCM token removed successfully');
      }
    } catch (error) {
      console.error('❌ Error removing FCM token on logout:', error);
    }

    clearAuthData();
    if (onAuthChange && typeof onAuthChange === 'function') {
      onAuthChange(false);
    }
    navigate("/");
  };

  // Handle Drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    document.body.style.overflow = !isDrawerOpen ? 'hidden' : 'auto';
  };


  // Profile dropdown items
  const profileDropdownItems = [
    { path: '/profile', text: 'My Profile', icon: <AccountCircleIcon /> },
    { path: '/notifications', text: 'Notifications', icon: <NotificationsIcon />, badge: unreadNotificationCount },
    { path: '/order-history', text: 'My Orders', icon: <HistoryIcon /> },
    { path: '/track-order', text: 'Track Order', icon: <TrackingIcon /> },
    { path: '/health-records', text: 'Health Records', icon: <HealthRecordsIcon /> }
  ];

  // Search suggestions for mobile
  const mobileSearchSuggestions = [
    { text: 'Cardiologist', category: 'Doctors', icon: '🫀' },
    { text: 'Dermatologist', category: 'Doctors', icon: '🧴' },
    { text: 'Pediatrician', category: 'Doctors', icon: '👶' },
    { text: 'Apollo Hospital', category: 'Hospitals', icon: '🏥' },
    { text: 'Fortis Healthcare', category: 'Hospitals', icon: '🏥' },
    { text: 'Blood Bank Near Me', category: 'Blood Banks', icon: '🩸' },
    { text: 'Medicine Delivery', category: 'Services', icon: '💊' },
    { text: 'Lab Tests', category: 'Services', icon: '🧪' },
    { text: 'Ambulance Service', category: 'Emergency', icon: '🚑' },
    { text: 'Physiotherapy', category: 'Services', icon: '🏃' },
    { text: 'Mental Health', category: 'Services', icon: '🧠' },
    { text: 'Dental Care', category: 'Doctors', icon: '🦷' }
  ];

  const filteredMobileSuggestions = mobileSearchSuggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
    suggestion.category.toLowerCase().includes(mobileSearchQuery.toLowerCase())
  );

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
            <Avatar 
              src={userProfile?.photo}
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: colors.primary,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
              imgProps={{
                onError: (e) => {
                  e.target.style.display = 'none';
                }
              }}
            >
              {userProfile?.name?.charAt(0)?.toUpperCase() || <PersonIcon sx={{ fontSize: 18 }} />}
            </Avatar>
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
                minWidth: 240,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #E2E8F0'
              }
            }}
          >
            {/* User Info Header */}
            <Box sx={{ 
              px: 2, 
              py: 1.5, 
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <Avatar
                src={userProfile?.photo}
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: colors.primary,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
                imgProps={{
                  onError: (e) => {
                    e.target.style.display = 'none';
                  }
                }}
              >
                {userProfile?.name?.charAt(0)?.toUpperCase() || <PersonIcon sx={{ fontSize: 18 }} />}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#1A365D', mb: 0.5 }}>
                  {userProfile?.name || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  {userProfile?.phone_number || userProfile?.email || 'No contact info'}
                </Typography>
              </Box>
            </Box>
            
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
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {React.cloneElement(item.icon, { 
                    sx: { color: '#1A365D', fontSize: 20 } 
                  })}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{ 
                    fontWeight: 500, 
                    color: '#1A365D',
                    fontSize: '0.9rem'
                  }}
                />
                {item.badge && item.badge > 0 && (
                  <Badge 
                    badgeContent={item.badge} 
                    color="error" 
                    sx={{ ml: 1 }}
                  />
                )}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon sx={{ color: '#EF4444', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{ 
                  fontWeight: 500, 
                  color: '#EF4444',
                  fontSize: '0.9rem'
                }}
              />
            </MenuItem>
          </Menu>
        </Box>
      );
    }
    
    return (
      <Button
        onClick={handleLoginClick}
        startIcon={
          <Avatar 
            sx={{ 
              width: 20, 
              height: 20, 
              bgcolor: colors.primary,
              color: 'white',
              fontSize: '0.75rem'
            }}
          >
            <PersonIcon sx={{ fontSize: 14 }} />
          </Avatar>
        }
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
        position="fixed" 
        elevation={isScrolled ? 4 : 1}
        sx={{ 
          bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
          color: 'text.primary',
          transition: 'all 0.3s ease',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: 0,
          '&.MuiAppBar-root': {
            position: 'fixed !important'
          }
        }}
      >
        <Box sx={{
          position: 'relative',
          overflow: 'hidden',
          height: isMobile ? (isHeaderVisible ? 120 : 56) : 'auto',
          transition: 'height 0.25s ease'
        }}>
        {/* Top Toolbar */}
        <Toolbar ref={topBarRef}
          sx={{ 
            px: { xs: 2, sm: 4 },
            py: 0.75,
            minHeight: '64px !important',
            transition: 'transform 0.25s ease',
            transform: isMobile && !isHeaderVisible ? 'translateY(-100%)' : 'translateY(0)'
          }}
        >
          {/* Logo Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            minWidth: { xs: 'auto', md: 280 }
          }}>
            {isMobile && (
              <IconButton
                onClick={toggleDrawer}
                sx={{ 
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <Avatar
                  src={userProfile?.photo}
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: colors.primary,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    border: '2px solid #E2E8F0'
                  }}
                  imgProps={{
                    onError: (e) => {
                      e.target.style.display = 'none';
                    }
                  }}
                >
                  {userProfile?.name?.charAt(0)?.toUpperCase() || <PersonIcon sx={{ fontSize: 18 }} />}
                </Avatar>
              </IconButton>
            )}
            
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Logo size={isMobile ? 'small' : 'small'} />
            </Link>

            {/* Vedika Plus Button - Desktop Only */}
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
                border: '1px solid transparent',
                '&:hover': {
                  bgcolor: 'transparent',
                  border: '1px solid #8A2BE2'
                }
              }}
            >
              <Box component="span" sx={{ color: 'black' }}>Vedika</Box><Box component="span" sx={{ color: 'white', bgcolor: '#8A2BE2', px: 0.5, borderRadius: 2, ml: 0.5 }}>Plus</Box>
            </Button>
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

            {/* Notifications Button */}
            <IconButton
              component={Link}
              to="/notifications"
              sx={{
                color: '#1A365D',
                '&:hover': {
                  bgcolor: 'rgba(56, 163, 165, 0.1)'
                }
              }}
            >
              <Badge badgeContent={unreadNotificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

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

         {/* Mobile Search Bar - Inside same container */}
         {isMobile && (
           <Box sx={{ 
             px: 2, 
             pb: 1,
             pt: 1,
             display: { xs: 'block', md: 'none' },
             bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
             borderTop: '1px solid #E2E8F0',
             position: 'absolute',
             left: 0,
             right: 0,
             bottom: 0,
             zIndex: 1,
             transition: 'all 0.25s ease',
             borderTopLeftRadius: 12,
             borderTopRightRadius: 12
           }}>
            <TextField
              ref={mobileSearchInputRef}
              fullWidth
              size="small"
               placeholder={mobilePlaceholders[mobilePlaceholderIndex]}
              value={mobileSearchQuery}
              onChange={handleMobileSearchChange}
              onFocus={handleMobileSearchFocus}
              onClick={handleMobileSearchInputClick}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                     <SearchIcon sx={{ color: colors.primary }} />
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
                   bgcolor: isScrolled ? 'rgba(248, 250, 252, 0.8)' : '#F8FAFC',
                   borderRadius: '20px !important',
                   borderTopLeftRadius: '20px !important',
                   borderTopRightRadius: '20px !important',
                   borderBottomLeftRadius: '20px !important',
                   borderBottomRightRadius: '20px !important',
                   border: `1px solid ${colors.primary}`,
                   py: 0.5,
                   '&:focus-within': {
                     bgcolor: 'white',
                     transform: 'scale(1.01)'
                   },
                   '& .MuiOutlinedInput-notchedOutline': {
                     borderRadius: '20px !important',
                     borderTopLeftRadius: '20px !important',
                     borderTopRightRadius: '20px !important',
                     borderBottomLeftRadius: '20px !important',
                     borderBottomRightRadius: '20px !important',
                   }
                 }
               }}
            />

            {/* Mobile Search Suggestions Menu */}
            <Menu
              anchorEl={mobileSearchAnchorEl}
              open={Boolean(mobileSearchAnchorEl)}
              onClose={handleMobileSearchClose}
              disableAutoFocus
              disableEnforceFocus
              disableRestoreFocus
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  width: '90vw',
                  maxWidth: 400,
                  maxHeight: 400,
                  mt: 1,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid #E2E8F0',
                  borderRadius: 2
                }
              }}
            >
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 1, fontSize: '0.8rem' }}>
                  Search Suggestions
                </Typography>
              </Box>
              <Divider />
              {filteredMobileSuggestions.length > 0 ? (
                filteredMobileSuggestions.slice(0, 8).map((suggestion, index) => (
                  <MenuItem 
                    key={index}
                    onClick={() => handleMobileSearchSelect(suggestion)}
                    sx={{ 
                      mx: 1, 
                      borderRadius: 1,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(56, 163, 165, 0.05)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                      <Box sx={{ fontSize: '1.2rem' }}>
                        {suggestion.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#1A365D' }}>
                          {suggestion.text}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                          {suggestion.category}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No suggestions found
                  </Typography>
                </Box>
              )}
            </Menu>
          </Box>
        )}
        </Box>

      </AppBar>

      {/* Spacer to account for fixed header without layout shift */}
      <Box sx={{ 
        height: isMobile ? 120 : 64,
        transition: 'height 0.25s ease',
        flexShrink: 0
      }} />

      {/* Vedika AI Modal (desktop and mobile) */}
      <VedikaAIModal open={showVedikaAI} onClose={() => setShowVedikaAI(false)} />

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 340,
            bgcolor: 'background.paper',
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(2, 6, 23, 0.25)',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {/* Drawer Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Logo size="small" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Menu
            </Typography>
          </Box>
          <IconButton onClick={toggleDrawer} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', maxHeight: 'calc(100dvh - 64px)' }}>
          {/* User Profile Section - Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2.5,
            borderBottom: '1px solid #E2E8F0'
          }}>
            <Avatar
              src={userProfile?.photo}
              sx={{ 
                width: 48, 
                height: 48,
                bgcolor: colors.primary,
                color: 'white',
                fontWeight: 600,
                fontSize: '1.2rem',
                border: '2px solid #E2E8F0'
              }}
              imgProps={{
                onError: (e) => {
                  e.target.style.display = 'none';
                }
              }}
            >
              {userProfile?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              {isAuthenticated && userProfile ? (
                <>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1A365D', mb: 0.5 }}>
                    {userProfile.name || 'Welcome User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                    {userProfile.phone_number || 'No phone number'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    {userProfile.email || 'No email address'}
                  </Typography>
                </>
              ) : (
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1A365D' }}>
                  Welcome to Vedika
                </Typography>
              )}
            </Box>
            {isAuthenticated && (
              <Button
                component={Link}
                to="/profile"
                onClick={toggleDrawer}
                size="small"
                sx={{ 
                  textTransform: 'none',
                  color: '#3B82F6',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.1)'
                  }
                }}
              >
                EDIT
              </Button>
            )}
          </Box>

          {/* Vedika Plus Section - Mobile Only */}
          <Box sx={{ 
            px: 2.5, 
            py: 2,
            borderBottom: '1px solid #E2E8F0',
            bgcolor: 'rgba(138, 43, 226, 0.05)'
          }}>
            <Button
              component={Link}
              to="/membership"
              onClick={toggleDrawer}
              fullWidth
              sx={{
                color: 'primary.main',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                background: 'white',
                border: '1px solid #8A2BE2',
                '&:hover': {
                  bgcolor: 'rgba(138, 43, 226, 0.1)',
                  border: '1px solid #8A2BE2'
                }
              }}
            >
              <Box component="span" sx={{ color: 'black' }}>Vedika</Box>
              <Box component="span" sx={{ color: 'white', bgcolor: '#8A2BE2', px: 0.5, borderRadius: 2, ml: 0.5 }}>Plus</Box>
            </Button>
          </Box>

          {/* Menu Items - Body */}
          <Box sx={{ p: 0 }}>
            <List sx={{ py: 0 }}>
              {/* My Orders */}
              <ListItem
                component={Link}
                to="/order-history"
                onClick={() => handleLinkClick('/order-history')}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ShoppingCartIcon sx={{ color: '#64748B' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="My Orders" 
                  primaryTypographyProps={{ 
                    fontWeight: 500, 
                    color: '#1A365D',
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItem>

              {/* Notifications */}
              <ListItem
                component={Link}
                to="/notifications"
                onClick={() => handleLinkClick('/notifications')}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <NotificationsIcon sx={{ color: '#64748B', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Notifications" 
                  primaryTypographyProps={{ 
                    fontWeight: 500, 
                    color: '#1A365D',
                    fontSize: '0.95rem'
                  }} 
                />
                {unreadNotificationCount > 0 && (
                  <Badge 
                    badgeContent={unreadNotificationCount} 
                    color="error" 
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItem>

              {/* Health Records */}
              <ListItem
                component={Link}
                to="/health-records"
                onClick={() => handleLinkClick('/health-records')}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <HealthRecordsIcon sx={{ color: '#64748B' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Health Records" 
                  primaryTypographyProps={{ 
                    fontWeight: 500, 
                    color: '#1A365D',
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItem>

              {/* Track Order */}
              <ListItem
                component={Link}
                to="/track-order"
                onClick={() => handleLinkClick('/track-order')}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <TrackingIcon sx={{ color: '#64748B' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Track Order" 
                  primaryTypographyProps={{ 
                    fontWeight: 500, 
                    color: '#1A365D',
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItem>

              {/* Logout */}
              <ListItem
                onClick={handleLogout}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  color: '#EF4444',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LogoutIcon sx={{ color: '#EF4444' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ 
                    fontWeight: 500, 
                    color: '#EF4444',
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItem>

              {/* Divider */}
              <Divider sx={{ my: 1 }} />

              {/* Invite Friends */}
              <ListItem
                sx={{
                  px: 2.5,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <InviteFriendsIcon sx={{ color: '#64748B', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Invite Friends" 
                  primaryTypographyProps={{ 
                    fontWeight: 500, 
                    color: '#1A365D',
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItem>

              {/* Settings */}
              <ListItem
                sx={{
                  px: 2.5,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <SettingsIcon sx={{ color: '#64748B', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Settings" 
                  primaryTypographyProps={{ 
                    fontWeight: 500, 
                    color: '#1A365D',
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItem>

              {/* Help Center */}
              <ListItem
                sx={{
                  px: 2.5,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <HelpCenterIcon sx={{ color: '#64748B', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Help Center" 
                  primaryTypographyProps={{ 
                    fontWeight: 500, 
                    color: '#1A365D',
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItem>

              {/* Terms and Conditions */}
              <ListItem
                sx={{
                  px: 2.5,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <TermsIcon sx={{ color: '#64748B', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Terms and Conditions" 
                  primaryTypographyProps={{ 
                    fontWeight: 500, 
                    color: '#1A365D',
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItem>
            </List>
          </Box>
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

      {/* Separate Sticky Search Bar for Mobile - Only when header is hidden */}
      {isMobile && !isHeaderVisible && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar + 1,
          bgcolor: 'white',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          px: 2,
          py: 1,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <TextField
            ref={mobileSearchInputRef}
            fullWidth
            size="small"
               placeholder={mobilePlaceholders[mobilePlaceholderIndex]}
            value={mobileSearchQuery}
            onChange={handleMobileSearchChange}
            onFocus={handleMobileSearchFocus}
            onClick={handleMobileSearchInputClick}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                     <SearchIcon sx={{ color: colors.primary }} />
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
                 borderRadius: '20px !important',
                 borderTopLeftRadius: '20px !important',
                 borderTopRightRadius: '20px !important',
                 borderBottomLeftRadius: '20px !important',
                 borderBottomRightRadius: '20px !important',
                 border: `1px solid ${colors.primary}`,
                 py: 0.5,
                 '&:focus-within': {
                   bgcolor: 'white',
                   transform: 'scale(1.01)'
                 },
                 '& .MuiOutlinedInput-notchedOutline': {
                   borderRadius: '20px !important',
                   borderTopLeftRadius: '20px !important',
                   borderTopRightRadius: '20px !important',
                   borderBottomLeftRadius: '20px !important',
                   borderBottomRightRadius: '20px !important',
                 }
               }
             }}
          />

          {/* Mobile Search Suggestions Menu for Sticky Search */}
          <Menu
            anchorEl={mobileSearchAnchorEl}
            open={Boolean(mobileSearchAnchorEl)}
            onClose={handleMobileSearchClose}
            disableAutoFocus
            disableEnforceFocus
            disableRestoreFocus
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                width: '90vw',
                maxWidth: 400,
                maxHeight: 400,
                mt: 1,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #E2E8F0',
                borderRadius: 2
              }
            }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 1, fontSize: '0.8rem' }}>
                Search Suggestions
              </Typography>
            </Box>
            <Divider />
            {filteredMobileSuggestions.length > 0 ? (
              filteredMobileSuggestions.slice(0, 8).map((suggestion, index) => (
                <MenuItem 
                  key={index}
                  onClick={() => handleMobileSearchSelect(suggestion)}
                  sx={{ 
                    mx: 1, 
                    borderRadius: 1,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(56, 163, 165, 0.05)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    <Box sx={{ fontSize: '1.2rem' }}>
                      {suggestion.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500} sx={{ color: '#1A365D' }}>
                        {suggestion.text}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                        {suggestion.category}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No suggestions found
                </Typography>
              </Box>
            )}
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default Header;