import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  signInUser, 
  signOutUser, 
  checkAuthState,
  clearError 
} from '../store/slices/authSlice';
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount 
} from '../store/slices/cartSlice';
import { 
  fetchProducts,
  selectAllProducts,
  selectProductLoading,
  selectProductError 
} from '../store/slices/productSlice';

const ReduxExample = () => {
  const dispatch = useDispatch();
  
  // Auth selectors
  const { user, isAuthenticated, loading: authLoading, error: authError } = useSelector(state => state.auth);
  
  // Cart selectors
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);
  
  // Product selectors
  const products = useSelector(selectAllProducts);
  const productLoading = useSelector(selectProductLoading);
  const productError = useSelector(selectProductError);

  // Check auth state on component mount
  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle sign in
  const handleSignIn = async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    await dispatch(signInUser(credentials));
  };

  // Handle sign out
  const handleSignOut = async () => {
    await dispatch(signOutUser());
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category
    }));
  };

  // Handle remove from cart
  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // Handle update quantity
  const handleUpdateQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ id: productId, quantity }));
  };

  // Handle clear error
  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="redux-example">
      <h2>Redux Integration Example</h2>
      
      {/* Authentication Section */}
      <div className="auth-section">
        <h3>Authentication</h3>
        {authLoading && <p>Loading authentication...</p>}
        {authError && (
          <div>
            <p style={{ color: 'red' }}>Error: {authError}</p>
            <button onClick={handleClearError}>Clear Error</button>
          </div>
        )}
        
        {isAuthenticated ? (
          <div>
            <p>Welcome, {user?.email}!</p>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <button onClick={handleSignIn}>Sign In</button>
        )}
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h3>Products</h3>
        {productLoading && <p>Loading products...</p>}
        {productError && <p style={{ color: 'red' }}>Error: {productError}</p>}
        
        <div className="products-grid">
          {products.slice(0, 3).map(product => (
            <div key={product.id} className="product-card">
              <h4>{product.name}</h4>
              <p>${product.price}</p>
              <button onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="cart-section">
        <h3>Shopping Cart ({cartItemCount} items)</h3>
        <p>Total: ${cartTotal.toFixed(2)}</p>
        
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <span>{item.name}</span>
                <span>Qty: {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <div className="cart-actions">
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button onClick={() => handleRemoveFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* State Debug Section */}
      <div className="debug-section">
        <h3>Current State</h3>
        <details>
          <summary>View Redux State</summary>
          <pre>
            {JSON.stringify({
              auth: {
                isAuthenticated,
                user: user ? { email: user.email, uid: user.uid } : null,
                loading: authLoading,
                error: authError
              },
              cart: {
                items: cartItems,
                total: cartTotal,
                itemCount: cartItemCount
              },
              products: {
                count: products.length,
                loading: productLoading,
                error: productError
              }
            }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default ReduxExample; 