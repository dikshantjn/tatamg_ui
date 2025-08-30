import React, { useState, useEffect, useCallback, useRef } from 'react';
import './HealthRecords.css';
import { toast } from 'react-toastify';
import HealthRecordAccess from './HealthRecordAccess';
import HealthRecordPreviewModal from './HealthRecordPreviewModal';
import ShareMenu from './ShareMenu';
import { getHealthRecords, addHealthRecord, deleteHealthRecord } from '../../../services/User/HealthRecords/health-records.service';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getUserId } from '../../../services/User/Auth/auth.utils';

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;

const CATEGORIES = [
    { id: 'all', label: 'All Records', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'prescription', label: 'Prescription', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'test_report', label: 'Test Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'medical_bills', label: 'Medical Bills', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'mediclaim', label: 'Mediclaim Policy', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'vaccine', label: 'Vaccine/Immunization', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
];

const HealthRecords = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLocked, setIsLocked] = useState(() => {
        const sessionData = localStorage.getItem('healthRecordsSession');
        if (sessionData) {
            const { expiryTime } = JSON.parse(sessionData);
            // Check if session is still valid
            if (expiryTime && new Date().getTime() < expiryTime) {
                return false; // Session is still valid
            }
            localStorage.removeItem('healthRecordsSession'); // Clear expired session
        }
        return true; // Default to locked state
    });

    const [activeCategory, setActiveCategory] = useState('all');
    const [showUploadPanel, setShowUploadPanel] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        fileName: '',
        category: '',
        file: null
    });
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [shareMenuState, setShareMenuState] = useState({
        record: null,
        position: { top: 0, left: 0 }
    });

    // Use refs for timer management
    const timerRef = useRef(null);
    const lastActivityRef = useRef(Date.now());

    // Add click outside listener for share menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareMenuState.record && !event.target.closest('.share-menu') && !event.target.closest('.action-icon.share')) {
                setShareMenuState({ record: null, position: { top: 0, left: 0 } });
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [shareMenuState.record]);

    // Function to handle session timeout
    const handleSessionTimeout = useCallback(() => {
        setIsLocked(true);
        localStorage.removeItem('healthRecordsSession');
        toast.info('Session expired. Please authenticate again.');
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Function to reset session timer
    const resetSessionTimer = useCallback(() => {
        lastActivityRef.current = Date.now();
        const expiryTime = Date.now() + SESSION_TIMEOUT;
        
        // Update localStorage with new expiry time
        localStorage.setItem('healthRecordsSession', JSON.stringify({
            expiryTime,
            lastActivity: lastActivityRef.current
        }));
        
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        
        timerRef.current = setTimeout(handleSessionTimeout, SESSION_TIMEOUT);
    }, [handleSessionTimeout]);

    // Check session status periodically
    useEffect(() => {
        const checkSession = () => {
            const sessionData = localStorage.getItem('healthRecordsSession');
            if (sessionData && !isLocked) {
                const { expiryTime } = JSON.parse(sessionData);
                if (expiryTime && new Date().getTime() >= expiryTime) {
                    handleSessionTimeout();
                }
            }
        };

        const sessionCheckInterval = setInterval(checkSession, 1000); // Check every second

        return () => {
            clearInterval(sessionCheckInterval);
        };
    }, [isLocked, handleSessionTimeout]);

    // Handle user activity
    const handleUserActivity = useCallback(() => {
        if (!isLocked) {
            resetSessionTimer();
        }
    }, [isLocked, resetSessionTimer]);

    // Set up activity listeners
    useEffect(() => {
        if (!isLocked) {
            window.addEventListener('mousemove', handleUserActivity);
            window.addEventListener('keydown', handleUserActivity);
            window.addEventListener('click', handleUserActivity);
            window.addEventListener('scroll', handleUserActivity);
            window.addEventListener('touchstart', handleUserActivity);

            // Initial session timer
            resetSessionTimer();

            return () => {
                window.removeEventListener('mousemove', handleUserActivity);
                window.removeEventListener('keydown', handleUserActivity);
                window.removeEventListener('click', handleUserActivity);
                window.removeEventListener('scroll', handleUserActivity);
                window.removeEventListener('touchstart', handleUserActivity);
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
            };
        }
    }, [isLocked, handleUserActivity, resetSessionTimer]);

    // Fetch records
    const fetchRecords = useCallback(async () => {
        if (isLocked) return;

        try {
            setLoading(true);
            setError(null);
            
            // Get userId from Redux state or localStorage
            const userId = user?.userId || getUserId();
            
            if (!userId) {
                setError('User ID not found. Please try logging in again.');
                toast.error('Authentication error. Please log in again.');
                return;
            }

            console.log('Fetching records for userId:', userId);
            const data = await getHealthRecords(userId);
            setRecords(data);
        } catch (error) {
            console.error('Failed to fetch health records:', error);
            setError('Failed to fetch health records. Please try again.');
            toast.error('Failed to fetch health records. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user?.userId, isLocked]);

    // Fetch records when component mounts and when unlocked
    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const filteredRecords = records.filter(record => 
        activeCategory === 'all' || record.type === activeCategory
    );

    const handleRecordClick = (record) => {
        setSelectedRecord(record);
    };

    const handleClosePreview = () => {
        setSelectedRecord(null);
    };

    const handleShare = (record, event) => {
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        setShareMenuState({
            record,
            position: {
                top: rect.top - 10, // Position above the icon with 10px gap
                left: Math.max(10, rect.left - 80) // Center the menu over the icon, but keep it on screen
            }
        });
    };

    const handleCloseShareMenu = () => {
        setShareMenuState({ record: null, position: { top: 0, left: 0 } });
    };

    const handleDownload = (record) => {
        window.open(record.fileUrl, '_blank');
        toast.success('File opened in new tab');
    };

    const handleDelete = async (record) => {
        try {
            setIsDeleting(true);
            
            // Call the delete API
            await deleteHealthRecord(record.healthRecordId);
            
            // Update the local state to remove the deleted record
            setRecords(prevRecords => prevRecords.filter(r => r.healthRecordId !== record.healthRecordId));
            
            // Close the preview modal if it's open
            setSelectedRecord(null);
            
            toast.success(`${record.name} deleted successfully`);
        } catch (error) {
            console.error('Failed to delete record:', error);
            toast.error(error.message || 'Failed to delete record');
        } finally {
            setIsDeleting(false);
        }
    };


    const toggleLock = useCallback(() => {
        setIsLocked(true);
        localStorage.removeItem('healthRecordsSession');
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        toast.info('Records locked. Please authenticate to access.');
    }, []);

    const handleAccessGranted = useCallback(() => {
        setIsLocked(false);
        resetSessionTimer();
        toast.success('Access granted. Session will expire in 15 minutes of inactivity.');
    }, [resetSessionTimer]);

    const handleUploadFormChange = (e) => {
        const { name, value, files } = e.target;
        setUploadForm(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsUploading(true);
            
            // Get the file path from the file object
            const filePath = uploadForm.file.name;
            
            // Create the health record with file path
            const userId = user?.userId || getUserId();
            
            const recordData = {
                userId,
                name: uploadForm.fileName,
                type: uploadForm.category,
                fileUrl: filePath, // Just using the file name as the path
                uploadedAt: new Date().toISOString()
            };
            
            const response = await addHealthRecord(recordData);
            
            // Update the records list
            setRecords(prevRecords => [...prevRecords, response.data]);
            
            // Close panel and reset form
            handleClosePanel();
        toast.success('Record uploaded successfully');
            
        } catch (error) {
            console.error('Failed to upload record:', error);
            toast.error(error.message || 'Failed to upload record');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClosePanel = () => {
        setShowUploadPanel(false);
        setUploadForm({ fileName: '', category: '', file: null }); // Reset form
    };

    if (isLocked) {
        return <HealthRecordAccess onAccessGranted={handleAccessGranted} />;
    }

    return (
        <div className="health-records-container">
            <div className={`upload-panel ${showUploadPanel ? 'show' : ''}`}>
                <div className="upload-panel-header">
                    <h2>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Upload Health Record
                    </h2>
                    <button className="close-button" onClick={handleClosePanel}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleUploadSubmit} className="upload-form">
                    <div className="form-group">
                        <label htmlFor="fileName">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            File Name
                        </label>
                        <input
                            type="text"
                            id="fileName"
                            name="fileName"
                            value={uploadForm.fileName}
                            onChange={handleUploadFormChange}
                            placeholder="Enter a descriptive name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Record Type
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={uploadForm.category}
                            onChange={handleUploadFormChange}
                            required
                        >
                            <option value="">Select record type</option>
                            {CATEGORIES.filter(cat => cat.id !== 'all').map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="file">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload File
                        </label>
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                id="file"
                                name="file"
                                onChange={handleUploadFormChange}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                required
                            />
                            <div className="file-input-placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                {uploadForm.file ? (
                                    <span className="file-name">{uploadForm.file.name}</span>
                                ) : (
                                    <span>Drag and drop your file here, or click to browse</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-button" 
                            onClick={handleClosePanel}
                            disabled={isUploading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="upload-submit-button"
                            disabled={!uploadForm.fileName || !uploadForm.category || !uploadForm.file || isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                            Upload Record
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="records-header">
                <div className="header-content">
                    <div className="header-top">
                        <div className="title-section">
                            <h1>Health Records</h1>
                            <p className="subtitle">Securely store and manage all your medical documents in one place</p>
                        </div>
                        <div className="header-actions">
                            <button className="upload-header-button" onClick={() => setShowUploadPanel(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Upload
                            </button>
                            <button className="lock-button" onClick={toggleLock}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                Lock
                            </button>
                        </div>
                        </div>
                        <div className="categories-scroll">
                            <div className="categories">
                                {CATEGORIES.map(category => (
                                    <button
                                        key={category.id}
                                        className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(category.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                                        </svg>
                                        {category.label}
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="records-content">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading health records...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>{error}</p>
                        <button className="retry-button" onClick={fetchRecords}>
                            Try Again
                        </button>
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="no-records">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No records found</p>
                        <button className="upload-button" onClick={() => setShowUploadPanel(true)}>Upload New Record</button>
                    </div>
                ) : (
                    <div className="records-grid">
                        {filteredRecords.map(record => (
                            <div 
                                key={record.healthRecordId} 
                                className="record-card"
                            >
                                <div className="record-actions">
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShare(record, e);
                                        }} 
                                        className="action-icon share"
                                        data-tooltip="Share"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </div>
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(record);
                                        }} 
                                        className="action-icon download"
                                        data-tooltip="Download"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isDeleting) {
                                                handleDelete(record);
                                            }
                                        }} 
                                        className={`action-icon delete ${isDeleting ? 'disabled' : ''}`}
                                        data-tooltip="Delete"
                                    >
                                        {isDeleting ? (
                                            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <div className="record-card-header" onClick={() => handleRecordClick(record)}>
                                    <div className="record-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                d={CATEGORIES.find(c => c.id === record.type)?.icon} />
                                        </svg>
                                    </div>
                                    <div className="record-info">
                                        <h3>{record.name}</h3>
                                        <div className="record-details">
                                            <span className="date">{new Date(record.uploadedAt).toLocaleDateString()}</span>
                                            <span className="type">{CATEGORIES.find(c => c.id === record.type)?.label || record.type}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button className="upload-button" onClick={() => setShowUploadPanel(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {selectedRecord && (
                <HealthRecordPreviewModal
                    record={selectedRecord}
                    onClose={handleClosePreview}
                    onShare={handleShare}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                />
            )}

            {shareMenuState.record && (
                <ShareMenu 
                    record={shareMenuState.record}
                    position={shareMenuState.position}
                    onClose={handleCloseShareMenu}
                />
            )}
        </div>
    );
};

export default HealthRecords; 