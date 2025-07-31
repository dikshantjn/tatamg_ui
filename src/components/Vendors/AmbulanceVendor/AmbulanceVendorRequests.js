import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  Button,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Assignment,
  Emergency,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Visibility,
  LocalPhone,
  Person,
  AccessTime,
  Close,
  Check,
  PlayArrow,
  Done
} from '@mui/icons-material';
import AmbulanceVendorLayout from './AmbulanceVendorLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AmbulanceVendorRequests = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setRequests([
        {
          id: 'REQ001',
          customerName: 'John Doe',
          mobileNo: '+91 98765 43210',
          time: '15 mins ago',
          status: 'Pending'
        },
        {
          id: 'REQ002',
          customerName: 'Jane Smith',
          mobileNo: '+91 98765 43211',
          time: '1 hour ago',
          status: 'Accepted'
        },
        {
          id: 'REQ003',
          customerName: 'Mike Johnson',
          mobileNo: '+91 98765 43212',
          time: '2 hours ago',
          status: 'In Progress'
        },
        {
          id: 'REQ004',
          customerName: 'Sarah Wilson',
          mobileNo: '+91 98765 43213',
          time: '3 hours ago',
          status: 'Completed'
        },
        {
          id: 'REQ005',
          customerName: 'David Brown',
          mobileNo: '+91 98765 43214',
          time: '4 hours ago',
          status: 'Pending'
        },
        {
          id: 'REQ006',
          customerName: 'Emily Davis',
          mobileNo: '+91 98765 43215',
          time: '5 hours ago',
          status: 'Accepted'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'info';
      case 'Accepted':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <Done fontSize="small" />;
      case 'In Progress':
        return <PlayArrow fontSize="small" />;
      case 'Pending':
        return <Schedule fontSize="small" />;
      case 'Accepted':
        return <Check fontSize="small" />;
      default:
        return <Error fontSize="small" />;
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleAcceptRequest = (requestId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'Accepted' }
        : req
    ));
    toast.success('Request accepted successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleProcessRequest = (requestId) => {
    const request = requests.find(req => req.id === requestId);
    if (request) {
      navigate(`/vendor/ambulance/process-order/${requestId}`, { 
        state: { requestData: request } 
      });
    }
  };

  const getActionButton = (request) => {
    switch (request.status) {
      case 'Pending':
        return (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Check />}
            onClick={() => handleAcceptRequest(request.id)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              px: 2,
              py: 0.5
            }}
          >
            Accept Request
          </Button>
        );
      case 'Accepted':
        return (
          <Button
            variant="outlined"
            color="success"
            size="small"
            startIcon={<PlayArrow />}
            onClick={() => handleProcessRequest(request.id)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              px: 2,
              py: 0.5
            }}
          >
            Process Order
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AmbulanceVendorLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading requests...</Typography>
        </Box>
      </AmbulanceVendorLayout>
    );
  }

  return (
    <AmbulanceVendorLayout>
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ 
            fontWeight: 700, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            Ambulance Requests 🚑
          </Typography>
          <Typography variant="h6" color={theme.palette.text.secondary} sx={{ fontWeight: 400 }}>
            Manage and track all ambulance service requests
          </Typography>
        </Box>

                          {/* Requests Table */}
         <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
           <TableContainer 
             component={Paper} 
             sx={{ 
               borderRadius: 3,
               boxShadow: theme.shadows[4],
               backgroundColor: theme.palette.background.paper,
               border: `1px solid ${theme.palette.divider}`
             }}
           >
             <Table sx={{ minWidth: 650 }}>
               <TableHead>
                 <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                   <TableCell sx={{ 
                     color: 'white', 
                     fontWeight: 700, 
                     fontSize: '1rem',
                     borderBottom: 'none'
                   }}>
                     Customer
                   </TableCell>
                   <TableCell sx={{ 
                     color: 'white', 
                     fontWeight: 700, 
                     fontSize: '1rem',
                     borderBottom: 'none'
                   }}>
                     Contact
                   </TableCell>
                   <TableCell sx={{ 
                     color: 'white', 
                     fontWeight: 700, 
                     fontSize: '1rem',
                     borderBottom: 'none'
                   }}>
                     Request Time
                   </TableCell>
                   <TableCell sx={{ 
                     color: 'white', 
                     fontWeight: 700, 
                     fontSize: '1rem',
                     borderBottom: 'none'
                   }}>
                     Status
                   </TableCell>
                   <TableCell sx={{ 
                     color: 'white', 
                     fontWeight: 700, 
                     fontSize: '1rem',
                     borderBottom: 'none',
                     textAlign: 'center'
                   }}>
                     Actions
                   </TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {requests.map((request) => (
                   <TableRow 
                     key={request.id}
                     sx={{ 
                       '&:hover': {
                         backgroundColor: theme.palette.mode === 'dark' 
                           ? 'rgba(255,255,255,0.05)' 
                           : 'rgba(0,0,0,0.02)',
                         transition: 'background-color 0.3s ease'
                       },
                       '&:nth-of-type(even)': {
                         backgroundColor: theme.palette.mode === 'dark' 
                           ? 'rgba(255,255,255,0.02)' 
                           : 'rgba(0,0,0,0.01)'
                       }
                     }}
                   >
                     <TableCell>
                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         <Avatar
                           sx={{
                             width: 40,
                             height: 40,
                             mr: 2,
                             background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                             fontSize: '1rem',
                             fontWeight: 700
                           }}
                         >
                           {request.customerName.charAt(0)}
                         </Avatar>
                         <Box>
                           <Typography variant="subtitle1" sx={{ 
                             fontWeight: 700,
                             color: theme.palette.text.primary,
                             mb: 0.5
                           }}>
                             {request.customerName}
                           </Typography>
                           <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                             #{request.id}
                           </Typography>
                         </Box>
                       </Box>
                     </TableCell>
                     <TableCell>
                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
                         {request.mobileNo}
                       </Typography>
                     </TableCell>
                     <TableCell>
                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
                         {request.time}
                       </Typography>
                     </TableCell>
                     <TableCell>
                       <Chip 
                         label={request.status} 
                         size="small" 
                         color={getStatusColor(request.status)}
                         icon={getStatusIcon(request.status)}
                         sx={{
                           fontWeight: 600,
                           fontSize: '0.75rem',
                           height: 28,
                           '& .MuiChip-icon': {
                             fontSize: '1rem'
                           }
                         }}
                       />
                     </TableCell>
                     <TableCell sx={{ textAlign: 'center' }}>
                       {getActionButton(request)}
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </TableContainer>
         </Box>


              </Box>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme="colored"
        />
      </AmbulanceVendorLayout>
    );
  };

export default AmbulanceVendorRequests; 