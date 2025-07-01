import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_CONFIG } from '../config/api.config';

// Use the base URL without adding /socket since your backend likely has its own socket path
const SOCKET_SERVER_URL = API_CONFIG.SOCKET_URL;

export const useSocket = (userId) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);

    const connect = useCallback(() => {
        if (!userId) {
            setError('User ID is required for socket connection');
            return;
        }

        try {
            socketRef.current = io(SOCKET_SERVER_URL, {
                transports: ['websocket', 'polling'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000,
                forceNew: true,
                upgrade: true,
                path: '/socket.io/', // Use default Socket.IO path
                query: { userId }
            });

            // Socket event handlers
            socketRef.current.on('connect', () => {
                console.log('✅ Socket connected');
                setIsConnected(true);
                setError(null);
                socketRef.current.emit('register', userId);
            });

            socketRef.current.on('connect_error', (err) => {
                console.error('❌ Socket connection error:', err);
                setIsConnected(false);
                setError(err.message);
                attemptReconnect();
            });

            socketRef.current.on('error', (err) => {
                console.error('❌ Socket error:', err);
                setError(err.message);
            });

            socketRef.current.on('disconnect', () => {
                console.log('❌ Socket disconnected');
                setIsConnected(false);
                attemptReconnect();
            });

        } catch (err) {
            console.error('❌ Socket initialization error:', err);
            setError(err.message);
        }
    }, [userId]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, []);

    const attemptReconnect = useCallback(() => {
        setTimeout(() => {
            if (socketRef.current && !socketRef.current.connected) {
                console.log('🔄 Attempting to reconnect...');
                socketRef.current.connect();
            }
        }, 2000);
    }, []);

    const subscribe = useCallback((event, handler) => {
        if (socketRef.current) {
            socketRef.current.on(event, handler);
        }
    }, []);

    const unsubscribe = useCallback((event, handler) => {
        if (socketRef.current) {
            socketRef.current.off(event, handler);
        }
    }, []);

    const emit = useCallback((event, data) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit(event, data);
        }
    }, [isConnected]);

    // Connect on mount, disconnect on unmount
    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return {
        socket: socketRef.current,
        isConnected,
        error,
        connect,
        disconnect,
        subscribe,
        unsubscribe,
        emit
    };
}; 