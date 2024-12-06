import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './SearchResults.css';

function SearchResults() {
    const [doctors, setDoctors] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorResponse = await fetch('http://localhost:8000/doctors');
                const productResponse = await fetch('http://localhost:8000/products');
                const doctorsData = await doctorResponse.json();
                const productsData = await productResponse.json();

                setDoctors(doctorsData);
                setProducts(productsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="search-results-page">
            <div className="results-container">
                <h2>Search Results for Doctors</h2>
                <div className="doctor-cards">
                    {doctors.length > 0 ? (
                        doctors.map(doctor => (
                            <div key={doctor.id} className="doctor-card">
                                <img src={doctor.image} alt={doctor.name} />
                                <div className="doctor-info">
                                    <h3>{doctor.name}</h3>
                                    <p>{doctor.specialty}</p>
                                    <p>{doctor.location}</p>
                                    <Link to={`/doctor-profile/${doctor.id}`} state={{ doctor }}>
                                        Learn More
                                    </Link>

                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No doctors available.</p>
                    )}
                </div>
            </div>

            <div className="results-container">
                <h2>Search Results for Products</h2>
                <div className="product-cards">
                    {products.length > 0 ? (
                        products.map(product => (
                            <div key={product.id} className="product-card">
                                <img src={product.image} alt={product.name} />
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p>{product.category}</p>
                                    <p>{product.price}</p>
                                    <Link to={`/product/${product.id}`} state={{ product }}>
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchResults;
