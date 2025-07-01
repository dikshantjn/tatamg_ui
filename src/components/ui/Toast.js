import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ type = 'success', title, message, onClose, duration = 3000 }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, duration - 300); // Start exit animation 300ms before removal

        const closeTimer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(closeTimer);
        };
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '!';
            default:
                return 'i';
        }
    };

    return (
        <div className={`toast ${type} ${isExiting ? 'exiting' : ''}`}>
            <div className="toast-icon" role="img" aria-label={type}>
                {getIcon()}
            </div>
            <div className="toast-content">
                <div className="toast-title">{title}</div>
                {message && <div className="toast-message">{message}</div>}
            </div>
            <button 
                className="toast-close" 
                onClick={onClose}
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export { Toast, ToastContainer }; 