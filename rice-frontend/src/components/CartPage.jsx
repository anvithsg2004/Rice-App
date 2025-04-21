import React, { useState, useEffect } from 'react';
import './css/Cart.css';
import { useNavigate, Link } from 'react-router-dom';
import ProtectedRoute from '../Router/ProtectedRoute';
import { apiCall } from '../api/api';
import Razorpay from 'razorpay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            try {
                const data = await apiCall('get', '/carts');
                setCart(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load cart. Please try again later.');
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleQuantityChange = async (itemId, newQuantity) => {
        try {
            const currentItem = cart.items.find(item => item.itemId === itemId);
            if (!currentItem) return;

            // Validate locally first
            if (newQuantity < currentItem.minQuantity || newQuantity > currentItem.maxQuantity) {
                toast.error(`Quantity must be between ${currentItem.minQuantity} and ${currentItem.maxQuantity}`, {
                    style: {
                        background: '#fff0f0',
                        color: 'var(--text-dark)',
                        border: '1px solid #ff4444',
                    }
                });
                return;
            }

            const delta = newQuantity - currentItem.quantity;
            await apiCall('post', `/carts/add/${itemId}?quantity=${delta}`);

            // Refresh cart data
            const updatedCart = await apiCall('get', '/carts');
            setCart(updatedCart);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update quantity. Please try again.';
            toast.error(errorMessage, {
                style: {
                    background: '#fff0f0',
                    color: 'var(--text-dark)',
                    border: '1px solid #ff4444',
                }
            });
        }
    };

    const handleRemoveItem = async (itemId) => {
        toast.info(
            <div className="confirm-toast">
                <p>Are you sure you want to remove this item?</p>
                <div className="confirm-buttons">
                    <button onClick={async () => {
                        toast.dismiss();
                        try {
                            await apiCall('delete', `/carts/remove/${itemId}`);
                            const updatedCart = await apiCall('get', '/carts');
                            setCart(updatedCart);
                            toast.success('Item removed successfully', {
                                style: {
                                    background: 'var(--primary-dark)',
                                    color: 'white',
                                    border: '1px solid var(--accent-gold)',
                                }
                            });
                        } catch (error) {
                            const errorMessage = error.response?.data?.message || 'Failed to remove item. Please try again.';
                            toast.error(errorMessage);
                        }
                    }}>
                        Yes
                    </button>
                    <button onClick={() => toast.dismiss()}>
                        No
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: 'custom-confirm-toast'
            }
        );
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        setIsApplyingPromo(true);
        try {
            const updatedCart = await apiCall('post', `/carts/apply-promo?promoCode=${promoCode}`);
            setCart(updatedCart);
            setPromoCode('');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to apply promo code. Please try again.';
            toast.error(errorMessage, {
                style: {
                    background: '#fff0f0',
                    color: 'var(--text-dark)',
                    border: '1px solid #ff4444',
                }
            });
        } finally {
            setIsApplyingPromo(false);
        }
    };

    const initializeRazorpay = async () => {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            alert('Razorpay SDK failed to load. Are you online?');
            return false;
        }
        return true;
    };

    // Add this helper function
    // In your frontend's Cart.js, modify the loadRazorpay function:
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                return resolve(true);
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                console.log('Razorpay SDK loaded successfully');
                resolve(true);
            };
            script.onerror = () => {
                console.error('Razorpay SDK failed to load');
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async () => {
        try {
            // 1. Create Razorpay order
            const orderResponse = await apiCall('post', '/payments/create-order');
            // const forRemoving = await apiCall('post', '/carts/checkout');
            const { orderId, amount, currency, key } = orderResponse;

            if (!orderResponse.orderId) {
                throw new Error('Failed to create order - invalid response');
            }

            // 2. Initialize Razorpay
            const isRazorpayLoaded = await initializeRazorpay();
            if (!isRazorpayLoaded) return;

            // 3. Create payment options with test card prefill
            const options = {
                key: key,
                amount: amount * 100,
                currency: currency,
                name: "Rice Market",
                description: "Order Payment",
                order_id: orderId,
                prefill: {
                    name: "Test User",
                    email: "test@example.com",
                    contact: "9123456789",
                    method: "card",
                    card: {
                        number: "4111111111111111", // Test card number
                        expiry: "12/34",           // Test expiry
                        cvv: "123"                  // Test CVV
                    }
                },
                handler: async (response) => {
                    try {
                        // Use ACTUAL payment data from Razorpay response
                        const verificationData = {
                            paymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            signature: response.razorpay_signature
                        };

                        const verificationResponse = await apiCall('post', '/payments/verify', verificationData);

                        // Clear cart and redirect
                        setCart({
                            items: [],
                            subtotal: 0,
                            shipping: 0,
                            tax: 0,
                            discount: 0,
                            total: 0
                        });

                        navigate('/orders', { state: { order: verificationResponse.order } });
                    } catch (verificationError) {
                        console.error('Verification error:', verificationError);
                        alert('Payment verification failed: ' +
                            (verificationError.response?.data?.message || 'Please contact support'));
                    }
                },
                theme: {
                    color: "#3399cc"
                }
            };

            // 5. Open Razorpay modal
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                'Failed to initiate payment. Please try again.';
            toast.error(errorMessage, {
                style: {
                    background: '#fff0f0',
                    color: 'var(--text-dark)',
                    border: '1px solid #ff4444',
                }
            });
        }
    };


    return (
        <ProtectedRoute>
            <div className="cart-page">
                <h1>Your Shopping Cart</h1>

                {loading && <div className="loading">Loading cart...</div>}
                {error && <div className="error-message">{error}</div>}

                {!loading && !error && (
                    <div className="cart-container">
                        {!cart || cart.items.length === 0 ? (
                            <div className="empty-cart">
                                <p>Your cart is empty</p>
                                <p>Explore our <a href="/categories">rice collection</a> to find the perfect varieties!</p>
                            </div>
                        ) : (
                            <div className="cart-content">
                                <div className="cart-items">
                                    {cart.items.map(item => (
                                        <div key={item.itemId} className="cart-item">
                                            <div className="item-image">
                                                <Link to={`/item/${item.itemId}`}> {/* Wrap the image in a Link */}
                                                    <img
                                                        src={`/images/${item.itemId}.jpeg`}
                                                        alt={item.name}
                                                        onError={(e) => {
                                                            e.target.src = '/images/default-rice.jpg'; // Fallback image
                                                            console.error('Image load failed:', item.imageUrl);
                                                        }}
                                                        loading="lazy"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="item-details">
                                                <h3>{item.name}</h3>
                                                <p>₹{item.price} per kg</p>
                                            </div>
                                            <div className="item-quantity">
                                                <button
                                                    onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                                                    disabled={item.quantity <= item.minQuantity}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                                                    disabled={item.quantity >= item.maxQuantity}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="item-total">
                                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                                <button
                                                    className="remove-button"
                                                    onClick={() => handleRemoveItem(item.itemId)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-summary">
                                    <div className="promo-section">
                                        <h3>Apply Promo Code</h3>
                                        <div className="promo-input">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder="Enter promo code"
                                                disabled={isApplyingPromo}
                                            />
                                            <button
                                                onClick={handleApplyPromo}
                                                disabled={isApplyingPromo}
                                            >
                                                {isApplyingPromo ? 'Applying...' : 'Apply'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="order-summary">
                                        <div className="summary-row">
                                            <span>Subtotal:</span>
                                            <span>₹{cart.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Shipping:</span>
                                            <span>₹{cart.shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Tax (5%):</span>
                                            <span>₹{cart.tax.toFixed(2)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="summary-row discount">
                                                <span>Promo Discount:</span>
                                                <span>-₹{discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="summary-row total">
                                            <span>Total:</span>
                                            <span>₹{(cart.total - discount).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button
                                        className="checkout-button"
                                        onClick={handleCheckout}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    toastClassName="custom-toast"
                    progressClassName="custom-progress"
                />
            </div>
        </ProtectedRoute>
    );
};

export default Cart;
