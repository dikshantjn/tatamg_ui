import React, { useState, useEffect } from 'react';
import ProductOrderHistory from './ProductOrderHistory';
import AmbulanceOrderHistory from './AmbulanceOrderHistory';
import BloodBankOrderHistory from './BloodBankOrderHistory';
import MedicineOrderHistory from './MedicineOrderHistory';
import LabTestOrderHistory from './LabTestOrderHistory';
import ClinicAppointmentHistory from './ClinicAppointmentHistory';
import BedBookingHistory from './BedBookingHistory';
import orderHistoryService from '../../../services/User/orderHistory.service';
import './OrderHistory.css';

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
        { id: 'clinic', label: 'Clinic Appointments', icon: '👨‍⚕️', count: clinicCount },
        { id: 'medicine', label: 'Medicine Orders', icon: '💊', count: 12 },
        { id: 'ambulance', label: 'Ambulance Bookings', icon: '🚑', count: ambulanceCount },
        { id: 'labTest', label: 'Lab Tests', icon: '🔬', count: labTestCount },
        { id: 'bloodBank', label: 'Blood Bank', icon: '🩸', count: bloodBankCount },
        { id: 'bedBooking', label: 'Bed Bookings', icon: '🏥', count: bedBookingCount },
        { id: 'product', label: 'Product Orders', icon: '📦', count: 7 }
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
            <div key={order.id} className="order-card">
                <div className="order-header">
                    <div className="order-info">
                        <h3 className="order-number">{order.orderNumber}</h3>
                        <p className="order-date">{formatDate(order.date)}</p>
                    </div>
                    <div className="order-status">
                        <span 
                            className="status-badge"
                            style={{ backgroundColor: statusColor }}
                        >
                            {statusText}
                        </span>
                    </div>
                </div>

                <div className="order-content">
                    {type === 'medicine' && (
                        <>
                            <div className="order-items">
                                <h4>Items:</h4>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="order-details">
                                <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                                <p><strong>Estimated Delivery:</strong> {formatDate(order.estimatedDelivery)}</p>
                                {order.actualDelivery && (
                                    <p><strong>Delivered On:</strong> {formatDate(order.actualDelivery)}</p>
                                )}
                            </div>
                        </>
                    )}

                    {type === 'ambulance' && (
                        <>
                            <div className="order-details">
                                <p><strong>Service:</strong> {order.service}</p>
                                <p><strong>Pickup:</strong> {order.pickup}</p>
                                <p><strong>Destination:</strong> {order.destination}</p>
                                <p><strong>Driver:</strong> {order.driver}</p>
                                <p><strong>Vehicle:</strong> {order.vehicle}</p>
                            </div>
                        </>
                    )}

                    {type === 'bed' && (
                        <>
                            <div className="order-details">
                                <p><strong>Hospital:</strong> {order.hospital}</p>
                                <p><strong>Room Type:</strong> {order.roomType}</p>
                                <p><strong>Check-in:</strong> {formatDate(order.checkIn)}</p>
                                <p><strong>Check-out:</strong> {formatDate(order.checkOut)}</p>
                                <p><strong>Patient:</strong> {order.patientName}</p>
                            </div>
                        </>
                    )}

                    {type === 'labTest' && (
                        <>
                            <div className="order-items">
                                <h4>Tests:</h4>
                                <ul>
                                    {order.tests.map((test, index) => (
                                        <li key={index}>{test}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="order-details">
                                <p><strong>Lab:</strong> {order.lab}</p>
                                <p><strong>Report Date:</strong> {formatDate(order.reportDate)}</p>
                                <p><strong>Report Status:</strong> {order.reportStatus}</p>
                            </div>
                        </>
                    )}

                    {type === 'bloodBank' && (
                        <>
                            <div className="order-details">
                                <p><strong>Blood Type:</strong> {order.bloodType}</p>
                                <p><strong>Units:</strong> {order.units}</p>
                                <p><strong>Hospital:</strong> {order.hospital}</p>
                                <p><strong>Request Type:</strong> {order.requestType}</p>
                            </div>
                        </>
                    )}

                    {type === 'clinic' && (
                        <>
                            <div className="order-details">
                                <p><strong>Doctor:</strong> {order.doctor}</p>
                                <p><strong>Specialty:</strong> {order.specialty}</p>
                                <p><strong>Clinic:</strong> {order.clinic}</p>
                                <p><strong>Appointment:</strong> {order.appointmentTime}</p>
                                <p><strong>Patient:</strong> {order.patientName}</p>
                            </div>
                        </>
                    )}
                </div>

                <div className="order-footer">
                    <div className="order-total">
                        <span className="total-label">Total:</span>
                        <span className="total-amount">{formatCurrency(order.total)}</span>
                    </div>
                    <div className="order-actions">
                        <button className="action-btn primary">View Details</button>
                        <button className="action-btn secondary">Track Order</button>
                    </div>
                </div>
            </div>
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
                    <div className="orders-section">
                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Loading your orders...</p>
                            </div>
                        ) : (
                            <div className="orders-grid">
                                {mockOrders[activeTab] && mockOrders[activeTab].length > 0 ? (
                                    mockOrders[activeTab].map((order) => renderOrderCard(order, activeTab))
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-icon">📋</div>
                                        <h3>No {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} found</h3>
                                        <p>You haven't placed any {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} yet.</p>
                                        <button className="browse-btn">Browse Services</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="order-history-container">
            <div className="order-history-layout">
                <div className="sidebar">
                    <div className="sidebar-header">
                        <div className="geometric-shapes">
                            <div className="shape shape-1"></div>
                            <div className="shape shape-2"></div>
                            <div className="shape shape-3"></div>
                        </div>
                        <h2 className="sidebar-title">My Orders</h2>
                        <p className="sidebar-subtitle">Select category to view orders</p>
                    </div>
                    
                    <div className="sidebar-buttons">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`sidebar-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <div className="button-content">
                                    <span className="button-icon">{tab.icon}</span>
                                    <div className="button-info">
                                        <span className="button-label">{tab.label}</span>
                                        <span className="button-count">{tab.count} orders</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="main-content">
                    {renderMainContent()}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory; 