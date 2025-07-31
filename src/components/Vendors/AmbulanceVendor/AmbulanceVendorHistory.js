import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  History,
  CheckCircle,
  DirectionsCar,
  AccessTime
} from '@mui/icons-material';
import AmbulanceVendorLayout from './AmbulanceVendorLayout';

const AmbulanceVendorHistory = () => {
  const theme = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setHistory([
        {
          id: 'HIST001',
          patient: 'John Doe',
          phone: '+91 98765 43210',
          type: 'Emergency',
          status: 'Completed',
          date: '2024-01-15',
          time: '14:30',
          duration: '45 mins',
          location: 'Mumbai Central, Mumbai',
          destination: 'Apollo Hospital, Andheri',
          ambulance: 'A1',
          driver: 'Rajesh Kumar',
          revenue: 2500,
          rating: 5
        },
        {
          id: 'HIST002',
          patient: 'Jane Smith',
          phone: '+91 98765 43211',
          type: 'Non-Emergency',
          status: 'Completed',
          date: '2024-01-14',
          time: '10:15',
          duration: '30 mins',
          location: 'Andheri West, Mumbai',
          destination: 'Kokilaben Hospital, Andheri',
          ambulance: 'A3',
          driver: 'Suresh Singh',
          revenue: 1800,
          rating: 4
        },
        {
          id: 'HIST003',
          patient: 'Mike Johnson',
          phone: '+91 98765 43212',
          type: 'Emergency',
          status: 'Completed',
          date: '2024-01-13',
          time: '16:45',
          duration: '60 mins',
          location: 'Bandra East, Mumbai',
          destination: 'Lilavati Hospital, Bandra',
          ambulance: 'A2',
          driver: 'Amit Patel',
          revenue: 3200,
          rating: 5
        },
        {
          id: 'HIST004',
          patient: 'Sarah Wilson',
          phone: '+91 98765 43213',
          type: 'Non-Emergency',
          status: 'Completed',
          date: '2024-01-12',
          time: '09:30',
          duration: '35 mins',
          location: 'Juhu, Mumbai',
          destination: 'Nanavati Hospital, Vile Parle',
          ambulance: 'A1',
          driver: 'Rajesh Kumar',
          revenue: 2200,
          rating: 4
        },
        {
          id: 'HIST005',
          patient: 'David Brown',
          phone: '+91 98765 43214',
          type: 'Emergency',
          status: 'Completed',
          date: '2024-01-11',
          time: '22:15',
          duration: '40 mins',
          location: 'Powai, Mumbai',
          destination: 'Hiranandani Hospital, Powai',
          ambulance: 'A3',
          driver: 'Suresh Singh',
          revenue: 2800,
          rating: 4
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeColor = (type) => {
    return type === 'Emergency' ? 'error' : 'default';
  };

  if (loading) {
    return (
      <AmbulanceVendorLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading history...</Typography>
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
            Service History 📋
          </Typography>
          <Typography variant="h6" color={theme.palette.text.secondary} sx={{ fontWeight: 400 }}>
            View completed ambulance service records
          </Typography>
        </Box>

        {/* History Table */}
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
                    Patient
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    borderBottom: 'none'
                  }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    borderBottom: 'none'
                  }}>
                    Date & Time
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    borderBottom: 'none'
                  }}>
                    Duration
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    borderBottom: 'none'
                  }}>
                    Ambulance
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    borderBottom: 'none'
                  }}>
                    Revenue
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    borderBottom: 'none'
                  }}>
                    Rating
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    borderBottom: 'none'
                  }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((record) => (
                  <TableRow 
                    key={record.id}
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
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {record.patient}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {record.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={record.type} 
                        size="small" 
                        color={getTypeColor(record.type)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {new Date(record.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {record.time}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {record.duration}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCar fontSize="small" />
                        <Typography variant="body2">
                          {record.ambulance}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{record.revenue.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2">⭐</Typography>
                        <Typography variant="body2">{record.rating}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={record.status} 
                        size="small" 
                        color="success"
                        icon={<CheckCircle fontSize="small" />}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </AmbulanceVendorLayout>
  );
};

export default AmbulanceVendorHistory; 