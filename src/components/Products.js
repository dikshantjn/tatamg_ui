import React from 'react';
import { Link } from 'react-router-dom';
import './Products.css';
import Testimonials from './Testimonials'; // Import Testimonials component
import otc from '../assets/otc.jpg'; // Adjust the paths as necessary
import wearable from '../assets/wearable.jpg';
import nonwearable from '../assets/nonwearable.jpg';
import SearchByBrand from './SearchByBrand';

function Products() {
    const productDeals = [
        {
            title: 'New Arrivals',
            image: 'new-arrivals.jpg', // Replace with the actual image path
            link: '/shop/new-arrivals'
        },
        {
            title: 'Accessories',
            image: 'accessories.jpg', // Replace with the actual image path
            link: '/shop/accessories'
        },
        {
            title: 'Workspace',
            image: 'workspace.jpg', // Replace with the actual image path
            link: '/shop/workspace'
        },
    ];

    const productCategories = [
        {
            title: 'Wearable',
            description: 'Lorem ipsum dolor sit amet nulla adipiscing elit. Nunc maximus, nec ut commodo.',
            icon: wearable,// Replace with actual icon path
            link: wearable
        },
        {
            title: 'Non-wearable',
            description: 'Lorem ipsum dolor sit amet nulla adipiscing elit. Nunc maximus, nec ut commodo.',
            icon: nonwearable, // Replace with actual icon path
            link: nonwearable
        },
        {
            title: 'OTC Products',
            description: 'Lorem ipsum dolor sit amet nulla adipiscing elit. Nunc maximus, nec ut commodo.',
            icon: otc, // Replace with actual icon path
            link: otc
        },
    ];

    return (
        <div className="products-page">
            {/* Product Deals Section */}
            <div className="search-section brand">
                <SearchByBrand />
            </div>
            <section className="product-deals">
                <div className="heading-with-link">
                    <h2>Shop by Category</h2>
                    <Link to="/search" className="view-all-link">Browse all categories</Link>
                </div>
                <div className="deals-grid">
                    {productDeals.map(deal => (
                        <div key={deal.title} className="deal-card" style={{ backgroundImage: `url(${deal.image})` }}>
                            <div className="deal-overlay">
                                <h3>{deal.title}</h3>
                                <a href={deal.link}>Shop Now</a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Product Categories Section */}
            <section className="product-categories">
                <div className="heading-with-link">
                    <h2>Deals by Product type</h2>
                    <Link to="/search" className="view-all-link">View All</Link>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut commodo sagittis, sapien dui mattis dui, non pulvinar lorem felis nec erat.</p>
                <div className="categories-grid">
                    {productCategories.map(category => (
                        <div key={category.title} className="category-card">
                            <img src={category.icon} alt={category.title} className="category-icon" />
                            <h3>{category.title}</h3>
                            <p>{category.description}</p>
                            <a href={category.link}>Learn more →</a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <Testimonials />
            </section>
        </div>
    );
}

export default Products;
