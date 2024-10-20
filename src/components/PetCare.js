import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PetCare.css';
import bannerImage from '../assets/PetCare Banner Photo.jpg'; // Placeholder banner image

function PetCare() {
  const [selectedPet, setSelectedPet] = useState('Dog'); // Default to Dog

  const categories = {
    Dog: [
      { category: 'Food & Treats', product: 'Dog Food', price: '₹599' },
      { category: 'Health and Wellness', product: 'Dog Supplements', price: '₹499' },
      { category: 'Pharmacy', product: 'Dog Medicine', price: '₹699' },
    ],
    Cat: [
      { category: 'Food & Treats', product: 'Cat Food', price: '₹599' },
      { category: 'Health and Wellness', product: 'Cat Supplements', price: '₹499' },
      { category: 'Pharmacy', product: 'Cat Medicine', price: '₹699' },
    ],
  };

  return (
    <div className="petcare-page">
      {/* Banner Section */}
      {/* Banner Section */}
      <section className="banner">
        <img src={bannerImage} alt="Pet Care Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Comprehensive Pet Care for Dogs and Cats</h1>
          <p>Explore food, wellness, and pharmacy options tailored for your pet.</p>
        </div>
      </section>


      {/* Pet Selector Buttons */}
      <div className="pet-selector">
        <button 
            className={`pet-button ${selectedPet === 'Dog' ? 'active' : ''}`} 
            onClick={() => setSelectedPet('Dog')}
        >
            DOG
        </button>
        <button 
            className={`pet-button ${selectedPet === 'Cat' ? 'active' : ''}`} 
            onClick={() => setSelectedPet('Cat')}
        >
            CAT
        </button>
      </div>

      {/* Categories Section */}
      <div className="categories">
        {categories[selectedPet].map((item) => (
          <div key={item.category} className="category-card">
            <h3>{item.category}</h3>
            <p>{item.product}</p>
            <p>Price: {item.price}</p>
            <button><Link to="/search">View</Link></button> {/* Changed to "View" */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PetCare;
