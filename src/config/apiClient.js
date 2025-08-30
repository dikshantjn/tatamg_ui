import axios from 'axios';
import { API_CONFIG } from './api.config';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
    }
});

// Request interceptor to automatically add headers
apiClient.interceptors.request.use(
    (config) => {
        // Ensure ngrok warning is always bypassed
        config.headers['ngrok-skip-browser-warning'] = 'true';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Log API errors for debugging
        if (error.response) {
            console.error('API Error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                url: error.config?.url,
                data: error.response.data
            });
        }
        return Promise.reject(error);
    }
);

export { apiClient };
