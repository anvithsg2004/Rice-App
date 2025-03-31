// ItemDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/ItemDetailPage.css';

const ItemDetailPage = () => {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    // Simulated data - in a real app, this would come from an API
    const sampleItems = [
        {
            id: 1,
            name: 'Basmati Rice',
            description: 'Premium quality basmati rice from India with long grains and aromatic flavor.',
            price: 599,
            discountedPrice: 499,
            image: 'https://images.unsplash.com/photo-1611143669185-af24681a3251?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            nutrients: [
                { name: 'Protein', value: '7g' },
                { name: 'Fiber', value: '1g' },
                { name: 'Carbs', value: '78g' },
                { name: 'Calories', value: '350kcal' },
                { name: 'Fat', value: '1g' }
            ]
        },
        // Add other sample items here
    ];

    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const foundItem = sampleItems.find(i => i.id === parseInt(itemId));
            if (foundItem) {
                setItem(foundItem);
            }
            setLoading(false);
        }, 500);
    }, [itemId]);

    const handleAddToCart = () => {
        // Add to cart logic would go here
        alert(`${quantity} ${item.name} added to cart!`);
    };

    if (loading) {
        return <div className="loading">Loading item details...</div>;
    }

    if (!item) {
        return <div className="error">Item not found</div>;
    }

    return (
        <div className="item-detail-container">
            <div className="item-image-container">
                <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details-container">
                <h1>{item.name}</h1>
                <div className="price-container">
                    <span className="original-price">₹{item.price}</span>
                    <span className="discounted-price">₹{item.discountedPrice}</span>
                    <span className="discount-badge">17% OFF</span>
                </div>
                <p className="description">{item.description}</p>

                <div className="nutrients-container">
                    <h3>Nutritional Information (per 100g)</h3>
                    <ul className="nutrients-list">
                        {item.nutrients.map((nutrient, index) => (
                            <li key={index}>
                                <span className="nutrient-name">{nutrient.name}</span>
                                <span className="nutrient-value">{nutrient.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="quantity-container">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                    >
                        -
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
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
    );
};

export default ItemDetailPage;