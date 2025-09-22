import React from 'react';
import {
    Box,
    Stack,
    Typography,
    CircularProgress,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Drawer,
    useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const useIsMobile = () => {
    return useMediaQuery('(max-width:600px)');
};

const statusToColor = (status) => {
    const map = {
        delivered: '#10B981',
        completed: '#10B981',
        in_transit: '#F59E0B',
        active: '#3B82F6',
        upcoming: '#8B5CF6',
        cancelled: '#EF4444',
        pending: '#6B7280',
        confirmed: '#10B981',
        rescheduled: '#6366F1',
    };
    return map[String(status || '').toLowerCase()] || '#6B7280';
};

export const StatusChip = ({ label }) => {
    return (
        <Chip
            label={label}
            size="small"
            sx={{
                bgcolor: statusToColor(label),
                color: '#fff',
                fontWeight: 600,
                textTransform: 'capitalize',
            }}
        />
    );
};

export const LoadingState = ({ label = 'Loading...' }) => {
    return (
        <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 6 }}>
            <CircularProgress size={28} thickness={4} />
            <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Stack>
    );
};

export const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
    return (
        <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 6 }}>
            <Typography fontSize={28}>⚠️</Typography>
            <Typography variant="h6">Error</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, textAlign: 'center' }}>
                {message}
            </Typography>
            {onRetry && (
                <Button variant="contained" onClick={onRetry} sx={{ textTransform: 'none', borderRadius: 2 }}>Try Again</Button>
            )}
        </Stack>
    );
};

export const EmptyState = ({ icon = '📋', title = 'Nothing here', subtitle, actionLabel, onAction }) => {
    return (
        <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 8 }}>
            <Typography fontSize={40}>{icon}</Typography>
            <Typography variant="h6">{title}</Typography>
            {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520, textAlign: 'center' }}>
                    {subtitle}
                </Typography>
            )}
            {actionLabel && (
                <Button variant="contained" onClick={onAction} sx={{ textTransform: 'none', borderRadius: 2 }}>{actionLabel}</Button>
            )}
        </Stack>
    );
};

export const BottomSheetDialog = ({ open, onClose, title, children, actions }) => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                transitionDuration={0}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        maxHeight: '85vh',
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="h6">{title}</Typography>
                        <IconButton size="small" onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Box sx={{ pb: 1 }}>{children}</Box>
                    {actions && (
                        <Stack direction="row" spacing={1} sx={{ pt: 2 }}>
                            {actions}
                        </Stack>
                    )}
                </Box>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" TransitionProps={{ timeout: 0 }}>
            {title && (
                <DialogTitle sx={{ pr: 6 }}>
                    {title}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
            )}
            <DialogContent dividers>{children}</DialogContent>
            {actions && <DialogActions>{actions}</DialogActions>}
        </Dialog>
    );
};

export const Section = ({ title, children, spacing = 1.5 }) => (
    <Stack spacing={spacing} sx={{ width: '100%' }}>
        {title && <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>}
        {children}
    </Stack>
);

export const Row = ({ label, value }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body2">{value}</Typography>
    </Stack>
);


