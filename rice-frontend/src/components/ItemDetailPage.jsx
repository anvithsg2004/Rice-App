import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './css/ItemDetailPage.css';
import { apiCall } from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

const ItemDetailPage = () => {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isWished, setIsWished] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItemDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiCall('get', `/rice-items/${itemId}`);
                if (!data) throw new Error('Item not found');
                setItem({ ...data, imageUrl: `/images/${data.id}.jpeg` });
                try {
                    const wl = new Set(JSON.parse(localStorage.getItem('rg_wishlist') || '[]'));
                    setIsWished(wl.has(data.id));
                } catch { /* noop */ }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchItemDetails();
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [itemId]);

    const handleAddToCart = async () => {
        if (!localStorage.getItem('authToken')) {
            navigate('/login');
            return;
        }

        setIsAdding(true);
        try {
            await apiCall('post', `/carts/add/${itemId}?quantity=${quantity}`);
            toast.success(`${quantity} kg of ${item.name} added to cart`, {
                icon: '🌾',
                autoClose: 2500,
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Cannot add more than the maximum quantity allowed';
            toast.error(errorMessage);
        } finally {
            setIsAdding(false);
        }
    };

    const handleShareClick = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: item?.name,
                    text: item?.description,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard', { icon: '📋', autoClose: 1500 });
            }
        } catch {
            /* user cancelled — no-op */
        }
    };

    const toggleWishlist = () => {
        try {
            const list = new Set(JSON.parse(localStorage.getItem('rg_wishlist') || '[]'));
            if (list.has(item.id)) {
                list.delete(item.id);
                setIsWished(false);
            } else {
                list.add(item.id);
                setIsWished(true);
                toast.success('Added to wishlist', { autoClose: 1500 });
            }
            localStorage.setItem('rg_wishlist', JSON.stringify(Array.from(list)));
        } catch { /* noop */ }
    };

    const handleIncreaseQuantity = () => {
        if (quantity < (item.maxQuantity || item.quantity || 10)) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > (item.minQuantity || 1)) {
            setQuantity(quantity - 1);
        }
    };

    if (loading) {
        return <Loading variant="branded" size="lg" label="Loading item details…" />;
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <Link to="/categories" className="back-link">← Back to shop</Link>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="error-container">
                <p className="error-message">Item not found</p>
                <Link to="/categories" className="back-link">← Back to shop</Link>
            </div>
        );
    }

    const handleImageError = (e) => {
        e.target.src = '/images/default-rice.jpg';
    };

    const hasDiscount = item.discount > 0 && item.originalPrice > item.finalPrice;
    const discountPct = hasDiscount
        ? Math.round(((item.originalPrice - item.finalPrice) / item.originalPrice) * 100)
        : 0;

    const trustBadges = [
        { icon: '🚚', label: 'Free delivery on orders ₹1,000+' },
        { icon: '🌱', label: 'Sustainably sourced' },
        { icon: '✨', label: 'Quality guaranteed' },
        { icon: '↩️', label: 'Easy returns within 7 days' },
    ];

    return (
        <div className="item-detail-container">
            <nav className="item-breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span aria-hidden="true">/</span>
                <Link to="/categories">Shop</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{item.name}</span>
            </nav>

            <div className="item-content">
                {/* === Image side === */}
                <div className="item-image-side">
                    <div className="item-image-container">
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            onError={handleImageError}
                        />
                        {hasDiscount && (
                            <span className="image-badge image-badge-discount">−{discountPct}%</span>
                        )}
                        <button
                            type="button"
                            className={`image-wishlist ${isWished ? 'is-active' : ''}`}
                            onClick={toggleWishlist}
                            aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
                            aria-pressed={isWished}
                        >
                            <svg viewBox="0 0 24 24" fill={isWished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="trust-badges">
                        {trustBadges.map((b, i) => (
                            <div key={i} className="trust-badge">
                                <span className="trust-icon" aria-hidden="true">{b.icon}</span>
                                <span className="trust-label">{b.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* === Info side === */}
                <div className="item-info-side">
                    <div className="item-header">
                        <span className="item-type">{item.type}</span>
                        <h1>{item.name}</h1>
                        <div className="item-rating" aria-label="4.8 out of 5 stars">
                            <span className="stars" aria-hidden="true">
                                {[1,2,3,4,5].map(i => <span key={i} className="star">★</span>)}
                            </span>
                            <span className="rating-meta">4.8 · 124 reviews</span>
                        </div>
                    </div>

                    <div className="item-price-container">
                        <span className="discounted-price">₹{item.finalPrice.toFixed(2)}</span>
                        {hasDiscount && (
                            <>
                                <span className="original-price">₹{item.originalPrice.toFixed(2)}</span>
                                <span className="discount-percentage">Save {discountPct}%</span>
                            </>
                        )}
                    </div>

                    <p className="item-description">{item.description}</p>

                    <div className="item-attributes">
                        <div className="attribute">
                            <span className="attribute-label">Available</span>
                            <span className="attribute-value">
                                {item.quantity} kg
                                {item.quantity > 0 && <em className="in-stock-dot" aria-hidden="true" />}
                            </span>
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">Min order</span>
                            <span className="attribute-value">{item.minQuantity || 1} kg</span>
                        </div>
                        <div className="attribute">
                            <span className="attribute-label">Max order</span>
                            <span className="attribute-value">{item.maxQuantity || 10} kg</span>
                        </div>
                    </div>

                    {item.nutrients && item.nutrients.length > 0 && (
                        <div className="item-nutrients">
                            <h3>Nutritional highlights</h3>
                            <ul>
                                {item.nutrients.map((nutrient, index) => (
                                    <li key={index}>
                                        <span className="nutrient-name">{nutrient}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Sticky purchase panel */}
                    <div className="purchase-panel">
                        <div className="purchase-row">
                            <label className="purchase-label">Quantity (kg)</label>
                            <div className="quantity-selector">
                                <button
                                    onClick={handleDecreaseQuantity}
                                    disabled={quantity <= (item.minQuantity || 1)}
                                    aria-label="Decrease quantity"
                                >−</button>
                                <span className="quantity-value">{quantity}</span>
                                <button
                                    onClick={handleIncreaseQuantity}
                                    disabled={quantity >= (item.maxQuantity || item.quantity || 10)}
                                    aria-label="Increase quantity"
                                >+</button>
                            </div>
                        </div>

                        <div className="purchase-row purchase-row-total">
                            <span className="purchase-label">Subtotal</span>
                            <span className="purchase-total">
                                ₹{(item.finalPrice * quantity).toFixed(2)}
                            </span>
                        </div>

                        <button
                            className="add-to-cart-button"
                            onClick={handleAddToCart}
                            disabled={isAdding || item.quantity <= 0}
                        >
                            {isAdding ? (
                                <Loading variant="dots" size="sm" inline label="Adding" />
                            ) : item.quantity <= 0 ? (
                                'Currently unavailable'
                            ) : (
                                `Add to cart · ₹${(item.finalPrice * quantity).toFixed(2)}`
                            )}
                        </button>

                        <button
                            className="share-button"
                            onClick={handleShareClick}
                            type="button"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="18" cy="5" r="3"/>
                                <circle cx="6" cy="12" r="3"/>
                                <circle cx="18" cy="19" r="3"/>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                            </svg>
                            Share
                        </button>
                    </div>
                </div>
            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={2500}
                hideProgressBar
                newestOnTop
                closeOnClick
                pauseOnHover
                toastClassName="custom-toast"
            />
        </div>
    );
};

export default ItemDetailPage;
