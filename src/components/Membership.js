import React, { useState } from 'react';
import './Membership.css';

function Membership() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [activeFaq, setActiveFaq] = useState(null);

    const benefits = [
        {
            icon: "₹",
            title: "8% Extra Vedika Credits",
            description: "Applicable on medicines and healthcare products",
            highlight: true,
            iconClass: "icon-credits"
        },
        {
            icon: "LAB",
            title: "60% Extra Credits on Lab Tests",
            description: "Applicable on your first diagnostic order",
            highlight: true,
            iconClass: "icon-lab"
        },
        {
            icon: "FREE",
            title: "FREE Delivery",
            description: "Enjoy free delivery on orders above ₹399",
            highlight: false,
            iconClass: "icon-delivery"
        },
        {
            icon: "DOC",
            title: "Free Doctor Consultations",
            description: "Get 10 free teleconsultations with certified doctors",
            highlight: false,
            iconClass: "icon-doctor"
        },
        {
            icon: "24/7",
            title: "Priority Support",
            description: "24/7 priority customer support for all queries",
            highlight: false,
            iconClass: "icon-support"
        },
        {
            icon: "₹0",
            title: "Zero Convenience Fees",
            description: "No additional charges on any transactions",
            highlight: false,
            iconClass: "icon-fees"
        }
    ];

    const steps = [
        {
            number: "1",
            title: "Purchase Membership",
            description: "Get your Vedika Plus membership for just ₹99",
            icon: "₹"
        },
        {
            number: "2",
            title: "Instant Activation",
            description: "Your membership activates immediately after purchase",
            icon: "⚡"
        },
        {
            number: "3",
            title: "Start Saving",
            description: "Enjoy exclusive benefits on every order for 12 months",
            icon: "✓"
        }
    ];

    const testimonials = [
        {
            name: "Priya Sharma",
            location: "Mumbai",
            rating: 5,
            text: "Vedika Plus has saved me thousands on my family's healthcare expenses. The free consultations are incredibly helpful!"
        },
        {
            name: "Rajesh Kumar",
            location: "Delhi",
            rating: 5,
            text: "The extra credits and free delivery make it so convenient. Best investment for my health!"
        },
        {
            name: "Meera Patel",
            location: "Bangalore",
            rating: 5,
            text: "Priority support and zero convenience fees - Vedika Plus is worth every penny."
        }
    ];

    const faqs = [
        {
            question: "What are the benefits of Vedika Plus?",
            answer: "Vedika Plus offers 8% extra credits on medicines, 60% extra credits on lab tests, free delivery, free doctor consultations, priority support, and zero convenience fees."
        },
        {
            question: "How long is my Vedika Plus membership valid?",
            answer: "Your membership is valid for 12 months from the date of activation."
        },
        {
            question: "When will I get the Vedika Credits?",
            answer: "Credits are automatically added to your wallet within 48 hours of order delivery."
        },
        {
            question: "Can I cancel my Vedika Plus membership?",
            answer: "Memberships are non-refundable once activated, but you can choose not to renew."
        },
        {
            question: "Is there a limit on the credits I can earn?",
            answer: "Credits are subject to monthly caps as mentioned in the terms and conditions."
        }
    ];

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const nextTestimonial = () => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="membership-page">
            {/* New Hero Section with Split Screen Design */}
            <section className="hero-section-new">
                <div className="geometric-overlay">
                    <div className="shape-circle shape-1"></div>
                    <div className="shape-circle shape-2"></div>
                    <div className="shape-circle shape-3"></div>
                    <div className="shape-dots"></div>
                </div>
                
                <div className="container">
                    <div className="hero-split-content">
                        {/* Left Content */}
                        <div className="hero-left">
                            <div className="logo-section-new">
                                <div className="plus-icon">+</div>
                                <h1 className="logo-text-new">Vedika Plus</h1>
                            </div>
                            
                            <h2 className="hero-headline-new">
                                Reduce your medical expenses with Vedika Plus
                            </h2>
                            
                            <div className="benefit-highlight-card">
                                Enjoy benefits worth ₹2000
                            </div>
                            
                            <div className="section-header">
                                Get exclusive access to
                            </div>
                        </div>
                        
                        {/* Right Content */}
                        <div className="hero-right">
                            <div className="family-image-container">
                                <img 
                                    src={require('../assets/portrait-successful-mid-adult-doctor-with-crossed-arms.jpg')} 
                                    alt="Happy Healthcare Family" 
                                    className="family-image"
                                />
                                <div className="floating-cta">
                                    Start saving more! 💰
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Preview Section */}
                <div className="benefits-preview">
                    <div className="container">
                        <div className="preview-cards">
                            <div className="preview-card highlight">
                                <div className="preview-icon wallet">₹</div>
                                <h3>8% Extra Vedika Credits</h3>
                                <p>Applicable on medicines and healthcare products. *TC Apply</p>
                            </div>
                            <div className="preview-card highlight">
                                <div className="preview-icon lab">LAB</div>
                                <h3>60% Extra Vedika Credits</h3>
                                <p>Applicable on all lab tests. *TC Apply</p>
                            </div>
                            <div className="preview-card">
                                <div className="preview-icon delivery">FREE</div>
                                <h3>FREE Delivery</h3>
                                <p>Enjoy free delivery on medicine and healthcare orders above ₹399</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Benefits Section */}
                <div className="additional-benefits">
                    <div className="container">
                        <h3 className="additional-title">Additional Benefits</h3>
                        <div className="additional-grid">
                            <div className="additional-item">
                                <div className="additional-icon lab-flask">⚗️</div>
                                <span>50% Extra Vedika Credits on 1st lab test</span>
                            </div>
                            <div className="additional-item">
                                <div className="additional-icon home-medical">🏠</div>
                                <span>Get 100% Vedika Credits on healthcare products from the House of Vedika</span>
                            </div>
                            <div className="additional-item">
                                <div className="additional-icon doctor-consultation">👨‍⚕️</div>
                                <span>10 Free Doctor Consultations</span>
                            </div>
                            <div className="additional-item">
                                <div className="additional-icon no-fees">🚫</div>
                                <span>Zero Convenience Fees</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <h2 className="section-title">Exclusive Benefits Worth ₹2000+</h2>
                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div 
                                key={index} 
                                className={`benefit-card ${benefit.highlight ? 'highlight' : ''}`}
                            >
                                <div className={`icon ${benefit.iconClass}`}>{benefit.icon}</div>
                                <h3 className="benefit-title">{benefit.title}</h3>
                                <p className="benefit-description">{benefit.description}</p>
                                {benefit.highlight && <div className="highlight-badge">Popular</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing-section">
                <div className="container">
                    <div className="pricing-card">
                        <div className="discount-badge">67% OFF</div>
                        <h3 className="pricing-title">Vedika Plus Membership</h3>
                        <div className="pricing-duration">12 Months</div>
                        <div className="pricing-details">
                            <span className="original-price">₹299</span>
                            <span className="discounted-price">₹99</span>
                        </div>
                        <button className="cta-button" onClick={() => alert('Membership purchase coming soon!')}>
                            Get Vedika Plus Now
                        </button>
                        <ul className="pricing-features">
                            <li>✓ Valid for 12 months from activation</li>
                            <li>✓ Instant activation upon purchase</li>
                            <li>✓ Non-transferable membership</li>
                            <li>✓ All benefits included</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <div className="container">
                    <h2 className="section-title">How Vedika Plus Works</h2>
                    <div className="steps-container">
                        {steps.map((step, index) => (
                            <div key={index} className="step-card">
                                <div className="step-number">{step.number}</div>
                                <div className={`icon icon-step`}>{step.icon}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <h2 className="section-title">What Our Members Say</h2>
                    <div className="testimonials-carousel">
                        <button className="carousel-btn prev" onClick={prevTestimonial}>‹</button>
                        <div className="testimonial-card">
                            <div className="rating">
                                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                                    <span key={i} className="star">★</span>
                                ))}
                            </div>
                            <p className="testimonial-text">"{testimonials[activeTestimonial].text}"</p>
                            <div className="testimonial-author">
                                <strong>{testimonials[activeTestimonial].name}</strong>
                                <span>{testimonials[activeTestimonial].location}</span>
                            </div>
                        </div>
                        <button className="carousel-btn next" onClick={nextTestimonial}>›</button>
                    </div>
                    <div className="carousel-indicators">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === activeTestimonial ? 'active' : ''}`}
                                onClick={() => setActiveTestimonial(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div className="faq-accordion">
                        {faqs.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <button 
                                    className={`faq-question ${activeFaq === index ? 'active' : ''}`}
                                    onClick={() => toggleFaq(index)}
                                >
                                    {faq.question}
                                    <span className="faq-toggle">{activeFaq === index ? '−' : '+'}</span>
                                </button>
                                <div className={`faq-answer ${activeFaq === index ? 'active' : ''}`}>
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            </section>
        </div>
    );
}

export default Membership;
