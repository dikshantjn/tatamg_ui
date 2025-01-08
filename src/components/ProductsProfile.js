import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductProfile.css';

function ProductsProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;

    if (!product) {
        return <p>No product details available.</p>;
    }

    const handleAddToCart = async () => {
        try {
            const price = typeof product.price === 'string'
                ? parseFloat(product.price.replace(/[^0-9.-]+/g, '')) // If it's a string, sanitize it
                : product.price; // If it's already a number, use it directly

            const response = await fetch('http://localhost:8000/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: product.id,
                    name: product.name,
                    price: price, // Ensure the correct price format
                    quantity: 1, // Default quantity
                }),
            });

            if (response.ok) {
                alert('Product added to cart successfully!');
                navigate('/checkout-2', { state: { product } }); // Redirect to CheckoutProduct.js with product data
            } else {
                navigate('/checkout-2', { state: { product } });
            }
        } catch (error) {
            navigate('/checkout-2', { state: { product } });
        }
    };

    return (
        <div className="product-profile">
            <div className="profile-header">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Price:</strong> {product.price}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="product-details">
                <h2>Product Details</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at nisi eget nulla posuere laoreet. Donec volutpat nulla at purus aliquam, nec blandit nunc elementum.</p>
            </div>

            <div className="reviews-section">
                <h2>Customer Reviews</h2>
                <div className="review">
                    <h4>John Doe</h4>
                    <p>Amazing product! Highly recommend it for anyone looking for quality.</p>
                </div>
                <div className="review">
                    <h4>Jane Smith</h4>
                    <p>Works as advertised. The quality is top-notch!</p>
                </div>
                {/* Add more reviews as needed */}
            </div>
        </div>
    );
}

export default ProductsProfile;
