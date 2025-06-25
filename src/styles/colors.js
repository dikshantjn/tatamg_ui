// Primary brand colors
export const colors = {
    primary: '#38A3A5',
    primaryLight: '#4FB5B7',
    primaryDark: '#2D8587',
    primaryGradient: 'linear-gradient(135deg, #38A3A5 0%, #4FB5B7 100%)',
    
    // AI gradient colors
    aiGradient: 'linear-gradient(45deg, #8A2BE2, #4169E1, #AC4A79, #8A2BE2)',
    aiGradientHover: 'linear-gradient(45deg, #9B4BE3, #527BF2, #BD5A8A, #9B4BE3)',
    
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
    overlay: 'rgba(56, 163, 165, 0.1)' // Based on primary color
};

// Common color combinations for components
export const colorStyles = {
    buttonPrimary: {
        background: colors.primaryGradient,
        color: colors.backgroundWhite,
        hover: {
            shadow: '0 4px 12px rgba(56, 163, 165, 0.2)'
        }
    },
    buttonAI: {
        background: colors.aiGradient,
        color: colors.backgroundWhite,
        hover: {
            shadow: '0 4px 12px rgba(138, 43, 226, 0.3)'
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