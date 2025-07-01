import { API_CONFIG, getApiUrl, replaceUrlParams } from '../../../config/api.config';

export const VendorProductService = {
    getProductsByCategory: async (category) => {
        try {
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.VENDOR_PRODUCTS.GET_BY_CATEGORY, { category });
            console.log('Fetching products from endpoint:', getApiUrl(endpoint));
            
            const response = await fetch(getApiUrl(endpoint));
            console.log('Product fetch response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Error response data:', errorData);
                throw new Error(errorData?.message || 'Failed to fetch products');
            }

            const data = await response.json();
            console.log('Products fetched successfully:', data);
            return data.products;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    addToCart: async (userId, productId, quantity = 1) => {
        try {
            console.log('Adding to cart:', { userId, productId, quantity });
            console.log('Using endpoint:', getApiUrl(API_CONFIG.ENDPOINTS.CART.ADD_TO_CART));
            
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CART.ADD_TO_CART), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    productId,
                    quantity
                })
            });

            console.log('Add to cart response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Error response data:', errorData);
                throw new Error(errorData?.message || 'Failed to add item to cart');
            }

            const data = await response.json();
            console.log('Add to cart successful:', data);
            return data;
        } catch (error) {
            console.error('Error adding to cart:', {
                error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    checkInCart: async (userId, productId) => {
        try {
            console.log('Checking cart status:', { userId, productId });
            console.log('Using endpoint:', getApiUrl(API_CONFIG.ENDPOINTS.CART.CHECK_IN_CART));
            
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CART.CHECK_IN_CART), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    productId
                })
            });

            console.log('Check cart response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Error response data:', errorData);
                throw new Error(errorData?.message || 'Failed to check cart status');
            }

            const data = await response.json();
            console.log('Check cart successful:', data);
            return data.isInCart;
        } catch (error) {
            console.error('Error checking cart status:', {
                error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    getCartItems: async (userId) => {
        try {
            console.log('Fetching cart items for user:', userId);
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.CART.GET_CART_ITEMS, { userId });
            console.log('Using endpoint:', getApiUrl(endpoint));
            
            const response = await fetch(getApiUrl(endpoint));
            console.log('Get cart items response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Error response data:', errorData);
                throw new Error(errorData?.message || 'Failed to fetch cart items');
            }

            const data = await response.json();
            console.log('Cart items fetched successfully:', data);
            return data.cartItems;
        } catch (error) {
            console.error('Error fetching cart items:', {
                error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    clearCart: async (userId) => {
        try {
            console.log('Clearing cart for user:', userId);
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.CART.CLEAR_CART, { userId });
            console.log('Using endpoint:', getApiUrl(endpoint));
            
            const response = await fetch(getApiUrl(endpoint), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Clear cart response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Error response data:', errorData);
                throw new Error(errorData?.message || 'Failed to clear cart');
            }

            const data = await response.json();
            console.log('Cart cleared successfully:', data);
            return data;
        } catch (error) {
            console.error('Error clearing cart:', {
                error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    deleteCartItem: async (cartId) => {
        try {
            console.log('Deleting cart item:', cartId);
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.CART.DELETE_CART_ITEM, { cartId });
            console.log('Using endpoint:', getApiUrl(endpoint));
            
            const response = await fetch(getApiUrl(endpoint), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Delete cart item response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Error response data:', errorData);
                throw new Error(errorData?.message || 'Failed to delete cart item');
            }

            const data = await response.json();
            console.log('Cart item deleted successfully:', data);
            return data;
        } catch (error) {
            console.error('Error deleting cart item:', {
                error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    updateCartItemQuantity: async (cartId, quantity) => {
        try {
            console.log('Updating cart item quantity:', { cartId, quantity });
            const endpoint = replaceUrlParams(API_CONFIG.ENDPOINTS.CART.UPDATE_CART_QUANTITY, { cartId });
            console.log('Using endpoint:', getApiUrl(endpoint));
            
            const response = await fetch(getApiUrl(endpoint), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity })
            });

            console.log('Update cart quantity response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Error response data:', errorData);
                throw new Error(errorData?.message || 'Failed to update cart item quantity');
            }

            const data = await response.json();
            console.log('Cart item quantity updated successfully:', data);
            return data;
        } catch (error) {
            console.error('Error updating cart item quantity:', {
                error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }
}; 