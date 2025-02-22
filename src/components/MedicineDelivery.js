import React, { useState } from 'react';
import './MedicineDelivery.css';
import Testimonials from './Testimonials';
// Placeholder imports for category images and featured products
import categoryImage1 from '../assets/category1.jpg';
import categoryImage2 from '../assets/category2.jpg';
import categoryImage3 from '../assets/category3.jpg';
import featuredProduct1 from '../assets/otc.jpg';
import featuredProduct2 from '../assets/drops.jpg';
import featuredProduct3 from '../assets/tabs.jpg';
import bannerImage from '../assets/Medicine Delivery Banner Photo.jpg';  // Placeholder for the banner image

function MedicineDelivery() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="medicine-delivery-page">
      {/* Hero Section with Banner Image */}
      <section className="hero-section">
        <img src={bannerImage} alt="Medicine Delivery Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Get Your Medicines Delivered From Nearby Medical Shops</h1>
          <p>Order your prescription and over-the-counter medicines from the comfort of your home.</p>
          <button className="shop-now-btn" onClick={toggleForm}>
            Search Medicine / Upload Prescription
          </button>
        </div>
      </section>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-form-overlay">
          <div className="popup-form">
            <h2>Search for Medicines</h2>
            <form>
              <label>Medicine Name:</label>
              <input type="text" required />

              <label>Brand Name:</label>
              <input type="text" required />

              <label>Quantity:</label>
              <input type="number" required />

              <label>Doctor Name:</label>
              <input type="text" required />

              <label>Delivery Time:</label>
              <select required>
                <option value="same_day">Same Day</option>
                <option value="next_day">Next Day</option>
              </select>

              <button type="submit">Add to Cart</button>
              <button type="button" onClick={toggleForm} className="close-btn">Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Product Categories Section */}
      <section className="categories-section">
        <h2>Explore Our Categories</h2>
        <div className="categories">
          <div className="category">
            <img src={categoryImage1} alt="OTC Medicines" />
            <h3>OTC Medicines</h3>
            <p>Explore our wide range of over-the-counter medicines for common health issues.</p>
          </div>
          <div className="category">
            <img src={categoryImage2} alt="Prescription Medicines" />
            <h3>Prescription Medicines</h3>
            <p>Get your prescription medicines delivered safely to your door.</p>
          </div>
          <div className="category">
            <img src={categoryImage3} alt="Health Supplements" />
            <h3>Health Supplements</h3>
            <p>Choose from a variety of health supplements to boost your well-being.</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <h2>Featured Products</h2>
        <div className="featured-products">
          <div className="product">
            <img src={featuredProduct1} alt="Product 1" />
            <h3>Paracetamol 500mg</h3>
            <p>Effective pain relief for fever, headaches, and other ailments.</p>
            <button className="buy-now-btn">Buy Now</button>
          </div>
          <div className="product">
            <img src={featuredProduct2} alt="Product 2" />
            <h3>Vitamin C Tablets</h3>
            <p>Boost your immune system with our premium Vitamin C tablets.</p>
            <button className="buy-now-btn">Buy Now</button>
          </div>
          <div className="product">
            <img src={featuredProduct3} alt="Product 3" />
            <h3>Cough Syrup</h3>
            <p>Fast-acting cough syrup for relief from cold and cough symptoms.</p>
            <button className="buy-now-btn">Buy Now</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default MedicineDelivery;
