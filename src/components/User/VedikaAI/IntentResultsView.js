import React, { useMemo } from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import ResultItem from './ResultItem';
import IntentNavigationService from '../../../services/VedikaAI/IntentNavigationService';

/**
 * Intent Results View Component
 * Displays AI intent results with proper formatting and actions
 * Based on Flutter IntentResultsView and IntentWidgetFactory implementation
 */
const IntentResultsView = ({ 
  intentData, 
  onActionPressed, 
  navigate,
  isProcessing = false 
}) => {
  // Extract data early to use in useMemo
  const { intent, results = [], suggestions = [], summary, isMedicalAdvice = false } = intentData || {};

  // Memoize results before any conditional returns
  const memoizedResults = useMemo(() => {
    if (!results || results.length === 0) return [];
    return results.map((result, index) => (
      <ResultItem
        key={index}
        resultItem={result}
        onActionPressed={onActionPressed}
        navigate={navigate}
      />
    ));
  }, [results, onActionPressed, navigate]);

  if (isProcessing) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 2,
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} sx={{ color: '#8A2BE2' }} />
          <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
            Processing...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!intentData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 2,
        py: 2
      }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      py: 1
    }}>
      {/* Summary */}
      {!isMedicalAdvice && summary && (
        <Typography sx={{ 
          color: 'rgba(255,255,255,0.9)', 
          fontSize: 14,
          lineHeight: 1.4,
          textAlign: 'center',
          fontWeight: 500
        }}>
          {summary}
        </Typography>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography sx={{ 
            color: 'white', 
            fontSize: 13, 
            fontWeight: 500 
          }}>
            Results:
          </Typography>
          {memoizedResults}
        </Box>
      ) : (
        <Box sx={{
          mt: 1.5,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(138,43,226,0.18), rgba(65,105,225,0.14), rgba(255,255,255,0.05))',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.18)',
          textAlign: 'center'
        }}>
          <Typography sx={{ 
            color: 'white', 
            fontSize: 15, 
            fontWeight: 700 
          }}>
            No results found
          </Typography>
        </Box>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography sx={{ 
            color: 'white', 
            fontSize: 13, 
            fontWeight: 500 
          }}>
            Suggestions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion.toString()}
                size="small"
                onClick={() => {
                  // Handle suggestion click - could trigger new search
                  console.log('Suggestion clicked:', suggestion);
                }}
                sx={{
                  borderColor: 'rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.9)',
                  background: 'rgba(15,17,21,0.94)',
                  fontSize: 12,
                  fontWeight: 600,
                  '&:hover': { 
                    background: 'rgba(255,255,255,0.1)' 
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default IntentResultsView;
