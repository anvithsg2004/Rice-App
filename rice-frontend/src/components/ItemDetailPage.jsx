import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/ItemDetailPage.css';
import { apiCall } from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItemDetailPage = () => {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItemDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await apiCall('get', `/rice-items/${itemId}`);
                if (!data) {
                    throw new Error('Item not found');
                }
                setItem({
                    ...data,
                    imageUrl: `/images/${data.id}.jpeg`
                });
            } catch (err) {
                setError(err.message);
                console.error('Error fetching item details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [itemId]);

    const handleAddToCart = async () => {
        if (!localStorage.getItem('authToken')) {
            navigate('/login');
            return;
        }

        try {
            const response = await apiCall('post', `/carts/add/${itemId}?quantity=${quantity}`);

            // Success toast
            toast.success(`${quantity} kg of ${item.name} added to cart!`, {
                icon: '🌾',
                style: {
                    background: 'var(--primary-dark)',
                    color: 'white',
                    border: '1px solid var(--accent-gold)',
                }
            });

        } catch (error) {
            // Error toast
            const errorMessage = error.response?.data?.message || 'Cannot add more than the maximum quantity allowed';
            toast.error(errorMessage, {
                style: {
                    background: '#fff0f0',
                    color: 'var(--text-dark)',
                    border: '1px solid #ff4444',
                }
            });
        }
    };

    const handleIncreaseQuantity = () => {
        if (quantity < (item.quantity || 10)) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading item details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="error-container">
                <p className="error-message">Item not found</p>
            </div>
        );
    }

    // Add image error handling
    const handleImageError = (e) => {
        e.target.src = '/images/default-rice.jpg';
        console.error('Image load failed:', e.target.src);
    };

    return (
        <div className="item-detail-container">
            <div className="item-header">
                <h1>{item.name}</h1>
                <p className="item-type">Type: {item.type}</p>
            </div>

            <div className="item-content">
                <div className="item-image-container">
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        onError={handleImageError}
                    />
                </div>

                <div className="item-info-container">
                    <div className="item-price-container">
                        <span className="original-price">₹{item.originalPrice.toFixed(2)}</span>
                        <span className="discounted-price">₹{item.finalPrice.toFixed(2)}</span>
                        <span className="discount-percentage">
                            {Math.round(((item.originalPrice - item.finalPrice) / item.originalPrice) * 100)}% OFF
                        </span>
                    </div>

                    <p className="item-description">{item.description}</p>

                    <div className="item-meta">
                        <div className="item-quantity">
                            <label>Available Quantity (kg):</label>
                            <span>{item.quantity}</span>
                        </div>
                        <div className="item-nutrients">
                            <h3>Nutritional Information:</h3>
                            <ul>
                                {item.nutrients.map((nutrient, index) => (
                                    <li key={index}>
                                        <span className="nutrient-name">{nutrient}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="quantity-selector">
                        <button
                            onClick={handleDecreaseQuantity}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <span className="quantity-value">{quantity}</span>
                        <button
                            onClick={handleIncreaseQuantity}
                            disabled={quantity >= (item.quantity || 10)}
                        >
                            +
                        </button>
                    </div>

                    <button
                        className="add-to-cart-button"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

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
    );
};

export default ItemDetailPage;
