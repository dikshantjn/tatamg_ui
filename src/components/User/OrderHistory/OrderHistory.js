import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Tabs, Tab, Chip, Paper, useMediaQuery, Divider } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScienceIcon from '@mui/icons-material/Science';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import HotelIcon from '@mui/icons-material/Hotel';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ProductOrderHistory from './ProductOrderHistory';
import AmbulanceOrderHistory from './AmbulanceOrderHistory';
import BloodBankOrderHistory from './BloodBankOrderHistory';
import MedicineOrderHistory from './MedicineOrderHistory';
import LabTestOrderHistory from './LabTestOrderHistory';
import ClinicAppointmentHistory from './ClinicAppointmentHistory';
import BedBookingHistory from './BedBookingHistory';
import orderHistoryService from '../../../services/User/orderHistory.service';
import { LoadingState } from './mui/Primitives';

const OrderHistory = () => {
    const [activeTab, setActiveTab] = useState('clinic');
    const [loading, setLoading] = useState(false);
    const [ambulanceCount, setAmbulanceCount] = useState(0);
    const [bloodBankCount, setBloodBankCount] = useState(0);
    const [labTestCount, setLabTestCount] = useState(0);
    const [clinicCount, setClinicCount] = useState(0);
    const [bedBookingCount, setBedBookingCount] = useState(0);

    useEffect(() => {
        setLoading(true);
        // Fetch counts for different services
        const fetchCounts = async () => {
            try {
                // Fetch clinic appointments count
                const clinicResponse = await orderHistoryService.getClinicAppointments();
                if (clinicResponse.success) {
                    setClinicCount(clinicResponse.data.length);
                }

                // Fetch ambulance bookings count
                const ambulanceResponse = await orderHistoryService.getCompletedAmbulanceBookings();
                if (ambulanceResponse.success) {
                    setAmbulanceCount(ambulanceResponse.data.length);
                }

                // Fetch blood bank bookings count
                const bloodBankResponse = await orderHistoryService.getCompletedBloodBankBookings();
                if (bloodBankResponse.success) {
                    setBloodBankCount(bloodBankResponse.data.length);
                }

                // Fetch lab test bookings count
                const labTestResponse = await orderHistoryService.getCompletedLabTestBookings();
                if (labTestResponse.success) {
                    setLabTestCount(labTestResponse.data.length);
                }

                // Fetch bed bookings count
                const bedBookingResponse = await orderHistoryService.getCompletedBedBookings();
                if (bedBookingResponse.success) {
                    setBedBookingCount(bedBookingResponse.data.length);
                }
            } catch (error) {
                console.error('Error fetching counts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    const tabs = [
        { id: 'clinic', label: 'Clinic', icon: <LocalHospitalIcon fontSize="small" />, count: clinicCount },
        { id: 'medicine', label: 'Medicine', icon: <MedicationIcon fontSize="small" />, count: 0 },
        { id: 'ambulance', label: 'Ambulance', icon: <LocalShippingIcon fontSize="small" />, count: ambulanceCount },
        { id: 'labTest', label: 'Lab Tests', icon: <ScienceIcon fontSize="small" />, count: labTestCount },
        { id: 'bloodBank', label: 'Blood Bank', icon: <BloodtypeIcon fontSize="small" />, count: bloodBankCount },
        { id: 'bedBooking', label: 'Beds', icon: <HotelIcon fontSize="small" />, count: bedBookingCount },
        { id: 'product', label: 'Products', icon: <Inventory2Icon fontSize="small" />, count: 0 }
    ];

    // Mock data for demonstration
    const mockOrders = {
        medicine: [
            {
                id: 'MED001',
                orderNumber: 'ORD-2024-001',
                date: '2024-01-15',
                status: 'delivered',
                items: ['Paracetamol 500mg', 'Vitamin C', 'Iron Supplements'],
                total: 450,
                deliveryAddress: '123 Main St, Mumbai, Maharashtra',
                estimatedDelivery: '2024-01-16',
                actualDelivery: '2024-01-16'
            },
            {
                id: 'MED002',
                orderNumber: 'ORD-2024-002',
                date: '2024-01-10',
                status: 'in_transit',
                items: ['Antibiotics', 'Pain Relief Cream'],
                total: 320,
                deliveryAddress: '456 Park Ave, Delhi, Delhi',
                estimatedDelivery: '2024-01-12',
                actualDelivery: null
            }
        ],
        ambulance: [
            {
                id: 'AMB001',
                orderNumber: 'AMB-2024-001',
                date: '2024-01-14',
                status: 'completed',
                service: 'Emergency Ambulance',
                pickup: 'Home Address',
                destination: 'City General Hospital',
                total: 800,
                driver: 'Rajesh Kumar',
                vehicle: 'MH-01-AB-1234'
            }
        ],
        bed: [
            {
                id: 'BED001',
                orderNumber: 'BED-2024-001',
                date: '2024-01-13',
                status: 'active',
                hospital: 'City General Hospital',
                roomType: 'Private Room',
                checkIn: '2024-01-13',
                checkOut: '2024-01-16',
                total: 4500,
                patientName: 'John Doe'
            }
        ],
        labTest: [
            {
                id: 'LAB001',
                orderNumber: 'LAB-2024-001',
                date: '2024-01-12',
                status: 'completed',
                tests: ['Blood Test', 'Diabetes Screening', 'Cholesterol Test'],
                lab: 'Metro Diagnostics',
                total: 1200,
                reportDate: '2024-01-14',
                reportStatus: 'available'
            }
        ],
        bloodBank: [
            {
                id: 'BB001',
                orderNumber: 'BB-2024-001',
                date: '2024-01-11',
                status: 'completed',
                bloodType: 'O+',
                units: 2,
                hospital: 'City Blood Bank',
                total: 600,
                donorName: 'Anonymous',
                requestType: 'Emergency'
            }
        ],
        clinic: [
            {
                id: 'CLINIC001',
                orderNumber: 'CLINIC-2024-001',
                date: '2024-01-15',
                status: 'upcoming',
                doctor: 'Dr. Sarah Johnson',
                specialty: 'Cardiology',
                clinic: 'Heart Care Clinic',
                appointmentTime: '2024-01-20 10:00 AM',
                total: 500,
                patientName: 'John Doe'
            }
        ],
        product: [],
        bedBooking: []
    };

    const getStatusColor = (status) => {
        const statusColors = {
            delivered: '#10B981',
            completed: '#10B981',
            in_transit: '#F59E0B',
            active: '#3B82F6',
            upcoming: '#8B5CF6',
            cancelled: '#EF4444',
            pending: '#6B7280'
        };
        return statusColors[status] || '#6B7280';
    };

    const getStatusText = (status) => {
        const statusTexts = {
            delivered: 'Delivered',
            completed: 'Completed',
            in_transit: 'In Transit',
            active: 'Active',
            upcoming: 'Upcoming',
            cancelled: 'Cancelled',
            pending: 'Pending'
        };
        return statusTexts[status] || status;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const renderOrderCard = (order, type) => {
        const statusColor = getStatusColor(order.status);
        const statusText = getStatusText(order.status);
        return (
            <Paper key={order.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Stack>
                        <Typography fontWeight={600}>{order.orderNumber}</Typography>
                        <Typography variant="caption" color="text.secondary">{formatDate(order.date)}</Typography>
                    </Stack>
                    <Chip label={statusText} size="small" sx={{ bgcolor: statusColor, color: '#fff' }} />
                </Stack>
                <Stack spacing={1.5} sx={{ mb: 1.5 }}>
                    {type === 'medicine' && (
                        <>
                            <Typography variant="subtitle2">Items</Typography>
                            <Stack spacing={0.5}>
                                {order.items.map((item, index) => (
                                    <Typography key={index} variant="body2">{item}</Typography>
                                ))}
                            </Stack>
                            <Divider sx={{ my: 1 }} />
                            <Stack spacing={0.5}>
                                <Typography variant="body2"><b>Delivery Address:</b> {order.deliveryAddress}</Typography>
                                <Typography variant="body2"><b>Estimated Delivery:</b> {formatDate(order.estimatedDelivery)}</Typography>
                                {order.actualDelivery && (
                                    <Typography variant="body2"><b>Delivered On:</b> {formatDate(order.actualDelivery)}</Typography>
                                )}
                            </Stack>
                        </>
                    )}
                    {type === 'ambulance' && (
                        <Stack spacing={0.5}>
                            <Typography variant="body2"><b>Service:</b> {order.service}</Typography>
                            <Typography variant="body2"><b>Pickup:</b> {order.pickup}</Typography>
                            <Typography variant="body2"><b>Destination:</b> {order.destination}</Typography>
                            <Typography variant="body2"><b>Driver:</b> {order.driver}</Typography>
                            <Typography variant="body2"><b>Vehicle:</b> {order.vehicle}</Typography>
                        </Stack>
                    )}
                    {type === 'bed' && (
                        <Stack spacing={0.5}>
                            <Typography variant="body2"><b>Hospital:</b> {order.hospital}</Typography>
                            <Typography variant="body2"><b>Room Type:</b> {order.roomType}</Typography>
                            <Typography variant="body2"><b>Check-in:</b> {formatDate(order.checkIn)}</Typography>
                            <Typography variant="body2"><b>Check-out:</b> {formatDate(order.checkOut)}</Typography>
                            <Typography variant="body2"><b>Patient:</b> {order.patientName}</Typography>
                        </Stack>
                    )}
                    {type === 'labTest' && (
                        <>
                            <Typography variant="subtitle2">Tests</Typography>
                            <Stack spacing={0.5}>
                                {order.tests.map((test, index) => (
                                    <Typography key={index} variant="body2">{test}</Typography>
                                ))}
                            </Stack>
                            <Divider sx={{ my: 1 }} />
                            <Stack spacing={0.5}>
                                <Typography variant="body2"><b>Lab:</b> {order.lab}</Typography>
                                <Typography variant="body2"><b>Report Date:</b> {formatDate(order.reportDate)}</Typography>
                                <Typography variant="body2"><b>Report Status:</b> {order.reportStatus}</Typography>
                            </Stack>
                        </>
                    )}
                    {type === 'bloodBank' && (
                        <Stack spacing={0.5}>
                            <Typography variant="body2"><b>Blood Type:</b> {order.bloodType}</Typography>
                            <Typography variant="body2"><b>Units:</b> {order.units}</Typography>
                            <Typography variant="body2"><b>Hospital:</b> {order.hospital}</Typography>
                            <Typography variant="body2"><b>Request Type:</b> {order.requestType}</Typography>
                        </Stack>
                    )}
                    {type === 'clinic' && (
                        <Stack spacing={0.5}>
                            <Typography variant="body2"><b>Doctor:</b> {order.doctor}</Typography>
                            <Typography variant="body2"><b>Specialty:</b> {order.specialty}</Typography>
                            <Typography variant="body2"><b>Clinic:</b> {order.clinic}</Typography>
                            <Typography variant="body2"><b>Appointment:</b> {order.appointmentTime}</Typography>
                            <Typography variant="body2"><b>Patient:</b> {order.patientName}</Typography>
                        </Stack>
                    )}
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1}>
                        <Typography variant="body2" color="text.secondary">Total</Typography>
                        <Typography fontWeight={600}>{formatCurrency(order.total)}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Chip label="View Details" size="small" clickable disableRipple />
                        <Chip label="Track" size="small" clickable disableRipple variant="outlined" />
                    </Stack>
                </Stack>
            </Paper>
        );
    };

    // Render specific components for different tabs
    const renderMainContent = () => {
        switch (activeTab) {
            case 'clinic':
                return <ClinicAppointmentHistory />;
            case 'medicine':
                return <MedicineOrderHistory />;
            case 'product':
                return <ProductOrderHistory />;
            case 'ambulance':
                return <AmbulanceOrderHistory />;
            case 'bloodBank':
                return <BloodBankOrderHistory />;
            case 'labTest':
                return <LabTestOrderHistory />;
            case 'bedBooking':
                return <BedBookingHistory />;
            default:
                return (
                    <Box>
                        {loading ? (
                            <LoadingState label="Loading your orders..." />
                        ) : (
                            <Stack spacing={2}>
                                {mockOrders[activeTab] && mockOrders[activeTab].length > 0 ? (
                                    mockOrders[activeTab].map((order) => renderOrderCard(order, activeTab))
                                ) : (
                                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                                        <Stack spacing={1.5} alignItems="center">
                                            <Typography fontSize={36}>📋</Typography>
                                            <Typography variant="subtitle1">No {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} found</Typography>
                                            <Typography variant="body2" color="text.secondary">You haven't placed any {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} yet.</Typography>
                                        </Stack>
                                    </Paper>
                                )}
                            </Stack>
                        )}
                    </Box>
                );
        }
    };

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box sx={{ px: { xs: 1.5, sm: 3 }, py: 2 }}>
            <Stack spacing={2}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={700}>My Orders</Typography>
                    <Typography variant="body2" color="text.secondary">Select a category to view your orders</Typography>
                </Stack>

                {!isMobile ? (
                    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                        <Tabs
                            value={tabs.findIndex(t => t.id === activeTab)}
                            onChange={(_, idx) => setActiveTab(tabs[idx].id)}
                            variant="scrollable"
                            scrollButtons="auto"
                            TabIndicatorProps={{ sx: { height: 2 } }}
                            sx={{
                                '& .MuiTabs-flexContainer': {
                                    justifyContent: 'center',
                                },
                            }}
                        >
                            {tabs.map((t) => (
                                <Tab
                                    key={t.id}
                                    icon={t.icon}
                                    iconPosition="start"
                                    label={`${t.label} ${t.count ? `(${t.count})` : ''}`}
                                    disableRipple
                                />
                            ))}
                        </Tabs>
                    </Paper>
                ) : (
                    <Paper
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            px: 1.5,
                            py: 1.25,
                        }}
                    >
                        <Stack direction="row" spacing={1.25} sx={{ overflowX: 'auto', pb: 0.5 }}>
                            {tabs.map((t) => (
                                <Chip
                                    key={t.id}
                                    icon={t.icon}
                                    label={t.label}
                                    onClick={() => setActiveTab(t.id)}
                                    color={activeTab === t.id ? 'primary' : 'default'}
                                    variant={activeTab === t.id ? 'filled' : 'outlined'}
                                    size="medium"
                                    clickable
                                    disableRipple
                                    sx={{ px: 1.25, py: 0.5, fontWeight: 600 }}
                                />
                            ))}
                        </Stack>
                    </Paper>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '100%', maxWidth: 1200 }}>
                        {renderMainContent()}
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default OrderHistory; 