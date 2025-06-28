// Primary brand colors
export const colors = {
    primary: '#38A3A5',
    primaryLight: '#4FB5B7',
    primaryDark: '#2D8587',
    primaryGradient: 'linear-gradient(135deg, #38A3A5 0%, #4FB5B7 100%)',
    
    // Category icon colors and backgrounds
    categoryColors: {
        health: { icon: '#38A3A5', bg: '#F0FAFA' },
        monitor: { icon: '#4FB5B7', bg: '#F0FAFA' },
        medicine: { icon: '#38A3A5', bg: '#F0FAFA' },
        care: { icon: '#4FB5B7', bg: '#F0FAFA' },
        emergency: { icon: '#38A3A5', bg: '#F0FAFA' },
        consultation: { icon: '#4FB5B7', bg: '#F0FAFA' }
    },
    
    // AI gradient colors
    aiGradient: 'linear-gradient(45deg, #38A3A5, #4FB5B7)',
    aiGradientHover: 'linear-gradient(45deg, #2D8587, #38A3A5)',
    
    // Text colors
    textPrimary: '#1A365D',
    textSecondary: '#64748B',
    
    // Background colors
    backgroundLight: '#F8FAFC',
    backgroundWhite: '#FFFFFF',
    
    // Border colors
    borderLight: '#E2E8F0',
    
    // Status colors
    error: '#DC2626',
    success: '#059669',
    
    // Overlay colors
    overlay: 'rgba(56, 163, 165, 0.1)', // Based on primary color
    micGradient: 'linear-gradient(45deg, #38A3A5, #4FB5B7)',
};

// Common color combinations for components
export const colorStyles = {
    buttonPrimary: {
        background: colors.primary,
        color: colors.backgroundWhite,
        hover: {
            background: colors.backgroundWhite,
            color: colors.primary,
            border: `1px solid ${colors.primary}`
        }
    },
    buttonAI: {
        background: colors.primary,
        color: colors.backgroundWhite,
        hover: {
            background: colors.backgroundWhite,
            color: colors.primary,
            border: `1px solid ${colors.primary}`
        }
    },
    inputField: {
        border: colors.borderLight,
        focus: {
            border: colors.primary,
            shadow: '0 0 0 3px rgba(56, 163, 165, 0.1)'
        }
    }
}; 