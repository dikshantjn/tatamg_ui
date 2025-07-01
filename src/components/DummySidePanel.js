import React from 'react';

const DummySidePanel = ({ isOpen, onClose }) => {
    console.log('🎭 DummySidePanel called with isOpen:', isOpen);
    
    if (!isOpen) {
        console.log('❌ DummySidePanel not rendering - isOpen is false');
        return null;
    }
    
    console.log('✅ DummySidePanel rendering - isOpen is true');
    
    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'flex-end',
                zIndex: 99999,
                border: '3px solid red'
            }}
            onClick={onClose}
        >
            <div 
                style={{
                    width: '400px',
                    height: '100vh',
                    backgroundColor: 'white',
                    padding: '20px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 100000,
                    border: '3px solid blue'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%'
                    }}
                >
                    ×
                </button>
                
                <h1 style={{ color: 'blue', marginTop: '50px' }}>DUMMY SIDE PANEL</h1>
                <p style={{ color: 'green' }}>This is a test side panel to check if side panels work!</p>
                <p style={{ color: 'purple' }}>If you can see this, side panel rendering is working.</p>
                
                <div style={{ marginTop: '20px' }}>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'green',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Close Panel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DummySidePanel; 