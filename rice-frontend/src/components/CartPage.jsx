import React, { useState, useEffect } from 'react';
import './css/Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Simulated cart data from local storage or API
                const mockCartItems = [
                    {
                        id: 'PROD1',
                        name: 'Basmati Rice',
                        image: 'https://images.unsplash.com/photo-1611143669185-af24681a3251?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                        price: 399,
                        quantity: 2,
                        maxQuantity: 10,
                        minQuantity: 1
                    },
                    {
                        id: 'PROD2',
                        name: 'Jasmine Rice',
                        image: 'https://images.unsplash.com/photo-1598379007742-315e2c024786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                        price: 299,
                        quantity: 1,
                        maxQuantity: 10,
                        minQuantity: 1
                    },
                    {
                        id: 'PROD3',
                        name: 'Wild Rice',
                        image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                        price: 499,
                        quantity: 3,
                        maxQuantity: 5,
                        minQuantity: 1
                    }
                ];

                setCartItems(mockCartItems);
                setLoading(false);
            } catch (err) {
                setError('Failed to load cart items. Please try again later.');
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateShipping = () => {
        const subtotal = calculateSubtotal();
        return subtotal > 1000 ? 0 : 50;
    };

    const calculateTax = () => {
        const subtotal = calculateSubtotal();
        return subtotal * 0.05;
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const shipping = calculateShipping();
        const tax = calculateTax();
        return subtotal + shipping + tax - discount;
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const handleRemoveItem = (itemId) => {
        if (window.confirm('Are you sure you want to remove this item from your cart?')) {
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        }
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        setIsApplyingPromo(true);
        try {
            // Simulate API call to validate promo code
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Apply discount (in a real app, this would come from the server)
            let discountAmount = 0;
            if (promoCode.toLowerCase() === 'ricesale') {
                discountAmount = calculateSubtotal() * 0.1; // 10% discount
            } else if (promoCode.toLowerCase() === 'riceship') {
                discountAmount = calculateShipping(); // Free shipping
            }

            setDiscount(discountAmount);
            setPromoCode('');
        } catch (error) {
            setError('Failed to apply promo code. Please try again.');
        } finally {
            setIsApplyingPromo(false);
        }
    };

    return (
        <div className="cart-page">
            <h1>Your Shopping Cart</h1>

            {loading && <div className="loading">Loading cart...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && (
                <div className="cart-container">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty</p>
                            <p>Explore our <a href="/categories">rice collection</a> to find the perfect varieties!</p>
                        </div>
                    ) : (
                        <div className="cart-content">
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="item-image">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="item-details">
                                            <h3>{item.name}</h3>
                                            <p>₹{item.price} per kg</p>
                                        </div>
                                        <div className="item-quantity">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, Math.max(item.minQuantity, item.quantity - 1))}
                                                disabled={item.quantity <= item.minQuantity}
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, Math.min(item.maxQuantity, item.quantity + 1))}
                                                disabled={item.quantity >= item.maxQuantity}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="item-total">
                                            <span>₹{item.price * item.quantity}</span>
                                            <button
                                                className="remove-button"
                                                onClick={() => handleRemoveItem(item.id)}
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
                                        <span>₹{calculateSubtotal()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Shipping:</span>
                                        <span>₹{calculateShipping()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Tax (5%):</span>
                                        <span>₹{calculateTax()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="summary-row discount">
                                            <span>Promo Discount:</span>
                                            <span>-₹{discount}</span>
                                        </div>
                                    )}
                                    <div className="summary-row total">
                                        <span>Total:</span>
                                        <span>₹{calculateTotal()}</span>
                                    </div>
                                </div>

                                <button className="checkout-button">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cart;