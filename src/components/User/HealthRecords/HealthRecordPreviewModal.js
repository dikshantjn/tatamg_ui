import React, { useState, useEffect } from 'react';
import './HealthRecordPreviewModal.css';
import ShareMenu from './ShareMenu';

const HealthRecordPreviewModal = ({ record, onClose, onShare, onDownload, onDelete }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [shareMenuState, setShareMenuState] = useState(null);

    useEffect(() => {
        const loadPreview = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if it's a PDF
                const isPDF = record.fileUrl.toLowerCase().endsWith('.pdf');
                
                if (isPDF) {
                    // For PDFs, use the direct URL
                    setPreviewUrl(record.fileUrl);
                } else {
                    // For images, load and verify they can be displayed
                    const response = await fetch(record.fileUrl);
                    if (!response.ok) throw new Error('Failed to load file');
                    
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    setPreviewUrl(url);
                }
            } catch (err) {
                console.error('Error loading preview:', err);
                setError('Failed to load preview. The file might be inaccessible or corrupted.');
            } finally {
                setLoading(false);
            }
        };

        loadPreview();

        // Cleanup
        return () => {
            if (previewUrl && !previewUrl.startsWith('http')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [record.fileUrl]);

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareMenuState && !event.target.closest('.share-menu')) {
                setShareMenuState(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [shareMenuState]);

    const handleShare = (e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setShareMenuState({
            record,
            position: {
                top: rect.top,
                left: rect.left
            }
        });
    };

    const handleDownload = () => {
        onDownload(record);
    };

    const handleDelete = () => {
        onDelete(record);
    };

    return (
        <div className="health-record-modal-overlay" onClick={onClose}>
            <div className="health-record-modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{record.name}</h2>
                    <button className="close-button" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="modal-actions">
                    <button onClick={handleShare} className="action-icon share" title="Share">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                    <button onClick={handleDownload} className="action-icon download" title="Download">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </button>
                    <button onClick={handleDelete} className="action-icon delete" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="preview-loading">
                            <div className="spinner"></div>
                            <p>Loading preview...</p>
                        </div>
                    ) : error ? (
                        <div className="preview-error">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>{error}</p>
                            <button onClick={handleDownload} className="download-instead-button">
                                Download Instead
                            </button>
                        </div>
                    ) : (
                        <div className="preview-container">
                            {previewUrl?.toLowerCase().endsWith('.pdf') ? (
                                <iframe
                                    src={`${previewUrl}#toolbar=0`}
                                    title={record.name}
                                    className="pdf-preview"
                                />
                            ) : (
                                <img 
                                    src={previewUrl} 
                                    alt={record.name}
                                    className="image-preview"
                                    onError={() => setError('Failed to display the image.')}
                                />
                            )}
                        </div>
                    )}
                </div>

                {shareMenuState && (
                    <ShareMenu
                        record={shareMenuState.record}
                        position={shareMenuState.position}
                        onClose={() => setShareMenuState(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default HealthRecordPreviewModal; 