import React from 'react';
import { Link } from 'react-router-dom';
import './Products.css';
import Testimonials from './Testimonials';
import bannerImage from '../assets/Healthcare products.jpg'; // Adjust the path as necessary
import otc from '../assets/otc.jpg';
import wearable from '../assets/wearable.jpg';
import nonwearable from '../assets/nonwearable.jpg';
import SearchByBrand from './SearchByBrand';

function Products() {
    const productDeals = [
        {
            title: 'New Arrivals',
            image: otc,
            link: '/shop/new-arrivals'
        },
        {
            title: 'Accessories',
            image: wearable,
            link: '/shop/accessories'
        },
        {
            title: 'Workspace',
            image: nonwearable,
            link: '/shop/workspace'
        },
    ];

    const productCategories = [
        {
            title: 'Wearable',
            description: 'Find the best wearable devices to track your health and fitness.',
            icon: wearable,
            link: wearable
        },
        {
            title: 'Non-wearable',
            description: 'Discover a variety of non-wearable health products for your needs.',
            icon: nonwearable,
            link: nonwearable
        },
        {
            title: 'OTC Products',
            description: 'Over-the-counter products for your everyday health requirements.',
            icon: otc,
            link: otc
        },
    ];

    return (
        <div className="products-page">
            {/* Banner Section */}
            <section className="banner">
                <img src={bannerImage} alt="Products Banner" className="banner-image" />
                <div className="banner-content">
                    <h1>Discover the Best Health Products</h1>
                    <p>Explore a wide range of products to meet your health and wellness needs.</p>
                </div>
            </section>

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
                    <h2>Deals by Product Type</h2>
                    <Link to="/search" className="view-all-link">View All</Link>
                </div>
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
