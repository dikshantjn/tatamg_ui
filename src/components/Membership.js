import React, { useState, useEffect } from 'react';
import './Membership.css';
import membershipService from '../services/User/membership.service.js';
import membershipPaymentService from '../services/payment/membership-payment.service.js';
import { getUserId } from '../services/User/Auth/auth.utils';

function Membership() {
    const [activeFaq, setActiveFaq] = useState(null);
    const [membershipPlans, setMembershipPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch membership plans and current user plan from API
    useEffect(() => {
        const fetchPlansAndCurrent = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch plans first
                const plans = await membershipService.getMembershipPlans();
                setMembershipPlans(plans);
                
                // Then fetch current plan (this won't fail the entire operation if 404)
                const userId = getUserId();
                if (userId) {
                    try {
                        const current = await membershipService.getCurrentUserPlan(userId);
                        setCurrentPlan(current?.currentPlan || null);
                    } catch (currentPlanError) {
                        // If current plan fails, just log it and continue
                        console.log('Could not fetch current plan, user likely has no active plan:', currentPlanError.message);
                        setCurrentPlan(null);
                    }
                } else {
                    setCurrentPlan(null);
                }
            } catch (err) {
                setError('Failed to load membership plans');
                console.error('Error fetching plans:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlansAndCurrent();
    }, []);

    // Fallback plans in case API fails
    const fallbackPlans = [
        {
            membershipPlanId: "fallback-silver",
            planName: "Silver",
            fees: 12000,
            planType: "Yearly",
            applicable: "1 Member only",
            services: [
                "24/7 Emergency Services"
            ],
            features: [
                "3 free online consultations per month.",
                "150 MB storage for Medical Health Records",
                "Access to Nutrition Plans",
                "Medico Legal Assistance",
                "Early Access to New Launched Products"
            ],
            offers: {
                medicineDiscount: "5%",
                labTestDiscount: "5%",
                productDiscount: "5%"
            },
            color: "#64748B",
            gradient: "linear-gradient(135deg, #64748B 0%, #475569 100%)",
            popular: false
        },
        {
            membershipPlanId: "fallback-gold",
            planName: "Gold",
            fees: 18000,
            planType: "Yearly",
            applicable: "1 Member only",
            services: [
                "24/7 Emergency Services"
            ],
            features: [
                "5 free online consultations per month.",
                "300 MB storage for Medical Health Records",
                "Access to Nutrition Plans",
                "Medico Legal Assistance",
                "Early Access to New Launched Products"
            ],
            offers: {
                medicineDiscount: "10%",
                labTestDiscount: "10%",
                productDiscount: "10%"
            },
            color: "#F59E0B",
            gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            popular: true
        },
        {
            membershipPlanId: "fallback-platinum",
            planName: "Platinum",
            fees: 24000,
            planType: "Yearly",
            applicable: "1 Member only",
            services: [
                "24/7 Emergency Services"
            ],
            features: [
                "10 free online consultations per month.",
                "500 MB storage for Medical Health Records",
                "Access to Nutrition Plans",
                "Medico Legal Assistance",
                "Mediclaim included for Rs 1 Lakh",
                "Early Access to New Launched Products"
            ],
            offers: {
                medicineDiscount: "15%",
                labTestDiscount: "15%",
                productDiscount: "15%"
            },
            color: "#8B5CF6",
            gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
            popular: false
        }
    ];

    // Transform API data to match component structure
    const transformPlanData = (apiPlan) => {
        const colorMap = {
            'Silver': '#64748B',
            'Gold': '#FFD700', 
            'Platinum': '#8B5CF6'
        };

        const gradientMap = {
            'Silver': 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
            'Gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            'Platinum': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
        };

        // Extract discount percentage from features
        const discountFeature = apiPlan.features.find(f => f.category === 'discounts');
        const discountValue = discountFeature ? discountFeature.value : '0%';

        return {
            membershipPlanId: apiPlan.membershipPlanId,
            planName: apiPlan.type,
            fees: apiPlan.price,
            planType: apiPlan.title,
            applicable: apiPlan.highlights[0] || `Up to ${apiPlan.type} members`,
            services: apiPlan.highlights.slice(1, 6) || [],
            features: apiPlan.highlights.slice(6) || [],
            offers: {
                medicineDiscount: discountValue,
                labTestDiscount: discountValue,
                productDiscount: discountValue
            },
            color: colorMap[apiPlan.type] || '#64748B',
            gradient: gradientMap[apiPlan.type] || 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
            popular: apiPlan.isPopular || false
        };
    };

    // Use API data if available, otherwise fallback
    const displayPlans = membershipPlans.length > 0 
        ? membershipPlans.map(transformPlanData)
        : fallbackPlans;

    // Order plans: Silver, Gold, Platinum
    const orderedDisplayPlans = [...displayPlans].sort((a, b) => {
        const order = ['Silver', 'Gold', 'Platinum'];
        return order.indexOf(a.planName) - order.indexOf(b.planName);
    });

    const [currentPlan, setCurrentPlan] = useState(null);

    // Generate dynamic FAQs based on API data
    const generateFAQs = () => {
        const baseFAQs = [
        {
            question: "How long is my membership valid?",
            answer: "All memberships are valid for 12 months from the date of activation."
        },
        {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Yes, you can upgrade your plan at any time. Downgrades will take effect at the next renewal cycle."
            },
            {
                question: "What is included in the emergency services?",
                answer: "All plans include 24/7 emergency services with priority support and immediate assistance for urgent healthcare needs."
            },
            {
                question: "Is the mediclaim coverage only for Platinum members?",
                answer: "Yes, the Rs 1 Lakh mediclaim coverage is exclusively available for Platinum plan members."
            }
        ];

        if (displayPlans.length > 0) {
            const planNames = displayPlans.map(plan => plan.planName).join(', ');
            const planPrices = displayPlans.map(plan => `${plan.planName} (₹${plan.fees.toLocaleString()}/year)`).join(', ');
            
            baseFAQs.unshift({
                question: "What are the different membership plans available?",
                answer: `We offer ${displayPlans.length} membership plans: ${planPrices}. Each plan offers different benefits and discounts.`
            });

            const discountInfo = displayPlans.map(plan => 
                `${plan.planName} offers ${plan.offers.medicineDiscount} discount on medicines, lab tests, and products`
            ).join('. ');
            
            baseFAQs.splice(2, 0, {
                question: "What discounts do I get with each plan?",
                answer: discountInfo + "."
            });
        }

        return baseFAQs;
    };

    const faqs = generateFAQs();

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const handleChoosePlan = async (plan) => {
        try {
            setProcessingPayment(true);
            
            // Prepare plan data for payment
            const planData = {
                membershipPlanId: plan.membershipPlanId || plan.planName.toLowerCase(),
                name: plan.planName,
                type: plan.planName,
                price: plan.fees
            };

            await membershipPaymentService.processPayment(
                planData,
                (successData) => {
                    // Payment successful
                    setSuccessData(successData);
                    setShowSuccessDialog(true);
                    setProcessingPayment(false);
                },
                (errorMessage) => {
                    // Payment failed
                    setErrorMessage(errorMessage || 'Payment failed. Please try again.');
                    setShowErrorDialog(true);
                    setProcessingPayment(false);
                }
            );
        } catch (error) {
            console.error('Error processing payment:', error);
            setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
            setShowErrorDialog(true);
            setProcessingPayment(false);
        }
    };

    const closeSuccessDialog = () => {
        setShowSuccessDialog(false);
        setSuccessData(null);
    };

    const closeErrorDialog = () => {
        setShowErrorDialog(false);
        setErrorMessage('');
    };

    const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
    const openPurchaseDetails = () => setShowPurchaseDialog(true);
    const closePurchaseDetails = () => setShowPurchaseDialog(false);

    return (
        <div className="membership-page">
            {/* Hero Section with Floating Plans */}
            <section className="hero-section-new">
                <div className="geometric-overlay">
                    <div className="shape-circle shape-1"></div>
                    <div className="shape-circle shape-2"></div>
                    <div className="shape-circle shape-3"></div>
                    <div className="shape-dots"></div>
                </div>
                
                <div className="container">
                    <div className="hero-content">
                            <div className="logo-section-new">
                                <div className="plus-icon">+</div>
                                <h1 className="logo-text-new">Vedika Plus</h1>
                            </div>
                            
                            <h2 className="hero-headline-new">
                                Choose Your Perfect Healthcare Plan
                            </h2>
                            </div>
                            
                    {/* Floating Plans Cards */}
                    <div className="floating-plans-container">
                        <div className="floating-plans-grid">
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
                                    Loading membership plans...
                            </div>
                            ) : error ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
                                    {error}
                                </div>
                            ) : (
                                orderedDisplayPlans.map((plan, index) => (
                                <div 
                                    key={index} 
                                    className={`floating-plan-card ${plan.popular ? 'popular' : ''}`}
                                >
                                    {plan.popular && <div className="popular-badge">Most Popular</div>}
                                    {currentPlan && (currentPlan.planDetails?.membershipPlanId === plan.membershipPlanId || currentPlan.planId === plan.membershipPlanId) && (
                                        <div className="plan-badge plan-badge-active">Active</div>
                                    )}
                                    
                                <div className="plan-header">
                                        <div className="plan-icon" style={{ background: plan.gradient }}>
                                            {plan.planName.charAt(0)}
                                        </div>
                                    <h3 className="plan-name">{plan.planName}</h3>
                                    <div className="plan-type">{plan.planType}</div>
                                </div>
                                
                                <div className="plan-pricing">
                                    <div className="plan-price">₹{plan.fees.toLocaleString()}</div>
                                    <div className="plan-period">per year</div>
                                </div>

                                    <div className="plan-applicable">{plan.applicable}</div>

                                <div className="plan-services">
                                    <h4>Services Included:</h4>
                                    <ul>
                                            {plan.services.map((service, idx) => (
                                                <li key={idx}>{service}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="plan-features">
                                    <h4>Features:</h4>
                                    <ul>
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="plan-offers">
                                    <h4>Discounts:</h4>
                                    <div className="offers-grid">
                                        <div className="offer-item">
                                            <span className="offer-label">Medicines:</span>
                                            <span className="offer-value">{plan.offers.medicineDiscount} off</span>
                                        </div>
                                        <div className="offer-item">
                                            <span className="offer-label">Lab Tests:</span>
                                            <span className="offer-value">{plan.offers.labTestDiscount} off</span>
                                        </div>
                                        <div className="offer-item">
                                            <span className="offer-label">Products:</span>
                                            <span className="offer-value">{plan.offers.productDiscount} off</span>
                                        </div>
                                    </div>
                                </div>

                                    {currentPlan && (currentPlan.planDetails?.membershipPlanId === plan.membershipPlanId || currentPlan.planId === plan.membershipPlanId) ? (
                                        <div className="active-actions">
                                            <div className="active-plan-tag">Active</div>
                                            <button className="purchase-details-link" onClick={openPurchaseDetails}>View Details</button>
                                        </div>
                                    ) : (
                                        <button 
                                            className="plan-cta-button" 
                                            style={{ 
                                                color: plan.color,
                                                borderColor: plan.color,
                                                opacity: processingPayment ? 0.7 : 1,
                                                cursor: processingPayment ? 'not-allowed' : 'pointer'
                                            }}
                                            onClick={() => handleChoosePlan(plan)}
                                            disabled={processingPayment}
                                        >
                                            {processingPayment ? 'Processing...' : 'Upgrade'}
                                        </button>
                                    )}
                            </div>
                                ))
                            )}
                        </div>
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

            {/* Success Dialog */}
            {showSuccessDialog && (
                <div className="success-dialog-overlay">
                    <div className="success-dialog">
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path fill="currentColor" d="M9.00039 16.2L4.80039 12L3.40039 13.4L9.00039 19L21.0004 7.00002L19.6004 5.60002L9.00039 16.2Z"/>
                            </svg>
                        </div>
                        <h2>Membership Activated</h2>
                        <div className="success-details">
                            <div className="success-breakdown">
                                <div className="bd-row">
                                    <div className="bd-label">Plan</div>
                                    <div className="bd-value">{successData?.plan?.name || successData?.membership?.planName}</div>
                                </div>
                                <div className="bd-row">
                                    <div className="bd-label">Amount</div>
                                    <div className="bd-value">₹{successData?.amount?.toLocaleString()}</div>
                                </div>
                                <div className="bd-row">
                                    <div className="bd-label">Valid until</div>
                                    <div className="bd-value">{new Date(successData?.membership?.endDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                        <p className="success-message">
                            Your membership is now active. Enjoy exclusive benefits and savings.
                        </p>
                        <button 
                            className="success-close-btn"
                            onClick={closeSuccessDialog}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Error Dialog */}
            {showErrorDialog && (
                <div className="error-dialog-overlay">
                    <div className="error-dialog">
                        <div className="error-icon">❌</div>
                        <h2>Payment Failed</h2>
                        <p className="error-message">{errorMessage}</p>
                        <div className="error-actions">
                            <button className="error-primary-btn" onClick={closeErrorDialog}>Try Again</button>
                            <button className="error-secondary-btn" onClick={closeErrorDialog}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Purchase Details Dialog */}
            {showPurchaseDialog && currentPlan && (
                <div className="purchase-dialog-overlay">
                    <div className="purchase-dialog">
                        <div className="purchase-header">
                            <div className="purchase-icon">🧾</div>
                            <h3>Purchase Details</h3>
                        </div>
                        <div className="purchase-grid">
                            <div className="row"><span className="label">Plan</span><span className="value">{currentPlan.planName}</span></div>
                            <div className="row"><span className="label">Amount Paid</span><span className="value">₹{currentPlan.amountPaid?.toLocaleString()}</span></div>
                            <div className="row"><span className="label">Status</span><span className="value status-paid">{currentPlan.status}</span></div>
                            <div className="row"><span className="label">Start Date</span><span className="value">{new Date(currentPlan.startDate).toLocaleDateString()}</span></div>
                            <div className="row"><span className="label">End Date</span><span className="value">{new Date(currentPlan.endDate).toLocaleDateString()}</span></div>
                            <div className="row"><span className="label">Duration</span><span className="value">{currentPlan.planDetails?.duration}</span></div>
                            <div className="row full"><span className="label">Description</span><span className="value">{currentPlan.planDetails?.description}</span></div>
                        </div>
                        <div className="purchase-actions">
                            <button className="purchase-close-btn" onClick={closePurchaseDetails}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Membership;
