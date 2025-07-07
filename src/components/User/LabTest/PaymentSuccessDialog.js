import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimes, FaListAlt } from 'react-icons/fa';
import './PaymentSuccessDialog.css';

const PaymentSuccessDialog = ({ isOpen, onClose, paymentData }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToOrders = () => {
    onClose();
    navigate('/order-history');
  };

  const handleCancel = () => {
    onClose();
    navigate(-1);
  };

  return (
    <div className="payment-success-overlay">
      <div className="payment-success-dialog">
        <div className="success-icon">
          <FaCheckCircle size={64} />
        </div>
        
        <div className="success-content">
          <h2>Payment Successful!</h2>
          <p className="success-message">
            Your lab test appointment has been booked successfully.
          </p>
          
          <div className="payment-details">
            <div className="detail-row">
              <span className="label">Payment ID:</span>
              <span className="value">{paymentData?.paymentId || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Amount Paid:</span>
              <span className="value">₹{paymentData?.amount || 0}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status:</span>
              <span className="value status-success">Confirmed</span>
            </div>
          </div>
        </div>

        <div className="dialog-actions">
          <button className="btn-secondary" onClick={handleCancel}>
            <FaTimes size={16} />
            Close
          </button>
          <button className="btn-primary" onClick={handleGoToOrders}>
            <FaListAlt size={16} />
            Go to My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessDialog; 