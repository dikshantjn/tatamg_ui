import React, { useState } from 'react';
import './ProductProfile.css';
import drops from '../assets/drops.jpg';
import wearable from '../assets/wearable.jpg';
import otc from '../assets/otc.jpg';

function ProductProfile({ product }) {
    const [selectedImage, setSelectedImage] = useState(product.images[0]);

    return (
        <div className="product-profile">
            <div className="product-gallery">
                <div className="main-image">
                    <img src={selectedImage} alt={product.name} />
                </div>
                <div className="image-thumbnails">
                    {product.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={product.name}
                            className={selectedImage === image ? 'active' : ''}
                            onClick={() => setSelectedImage(image)}
                        />
                    ))}
                </div>
            </div>
            <div className="product-details">
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p className="price">{product.price}</p>
                <button className="buy-button">Add to Cart</button>
            </div>
        </div>
    );
}

// Example product data for testing purposes
const sampleProduct = {
    name: 'Sample Product',
    description: 'This is a detailed description of the sample product. It has many features and benefits.',
    price: '$199.99',
    images: [
        drops, // Replace with actual image paths
        wearable,
        otc,
    ],
};

export default function ProductProfilePage() {
    return <ProductProfile product={sampleProduct} />;
}
