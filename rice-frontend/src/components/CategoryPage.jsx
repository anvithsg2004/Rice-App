import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/CategoryPage.css';
import { getAllCategories, getCategoryByName } from '../api/categoryApi';

const CategoryPage = () => {
    const [riceItems, setRiceItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedType, setSelectedType] = useState('All');
    const [sortBy, setSortBy] = useState('Recommended');
    const [isLoading, setIsLoading] = useState(true);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [error, setError] = useState(null);
    const [typeNotFoundError, setTypeNotFoundError] = useState(false);

    useEffect(() => {
        const fetchRiceItems = async () => {
            setIsLoading(true);
            setError(null);
            setTypeNotFoundError(false);

            try {
                let data;

                if (selectedType === 'All') {
                    data = await getAllCategories();
                } else {
                    data = await getCategoryByName(selectedType);
                }

                // Ensure data is an array
                if (!Array.isArray(data)) {
                    data = [data];
                }

                // Flatten the rice items from categories
                const items = data.flatMap(category => {
                    return category.riceItems.map(item => ({
                        id: item.id,
                        name: item.name || 'Unnamed Rice', // Provide default values
                        description: item.description || 'No description available',
                        finalPrice: item.finalPrice || 0, // Ensure finalPrice is a number
                        imageUrl: item.imageUrl || '/images/default-rice.jpg',
                        inStock: item.quantity > 0, // Determine if in stock based on quantity
                        type: category.name
                    }));
                });

                if (items.length === 0) {
                    if (selectedType !== 'All') {
                        setTypeNotFoundError(true);
                    } else {
                        setError('No rice items found.');
                    }
                    setIsLoading(false);
                    return;
                }

                const prices = items.map(item => item.finalPrice);
                const calculatedMaxPrice = Math.ceil(Math.max(...prices) / 100) * 100;

                setRiceItems(items);
                setMaxPrice(calculatedMaxPrice);
                setPriceRange([0, calculatedMaxPrice]);
                setIsLoading(false);
            } catch (err) {
                // setError('Failed to fetch rice items. Please try again later.');
                setIsLoading(false);
                console.error('Error fetching rice items:', err);
            }
        };

        fetchRiceItems();
    }, [selectedType]);

    useEffect(() => {
        if (!isLoading) {
            const filtered = riceItems.filter(item => {
                const itemName = (item.name || '').toString().toLowerCase();
                const itemType = (item.type || '').toString();
                const searchText = searchTerm.toLowerCase();
                const itemPrice = Number(item.finalPrice) || 0;

                const matchesSearch = itemName.includes(searchText);
                const matchesPrice = itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
                const matchesType = selectedType === 'All' || itemType === selectedType;

                return matchesSearch && matchesPrice && matchesType;
            });

            const sortedItems = [...filtered].sort((a, b) => {
                const aPrice = Number(a.finalPrice) || 0;
                const bPrice = Number(b.finalPrice) || 0;

                switch (sortBy) {
                    case 'High to Low': return bPrice - aPrice;
                    case 'Low to High': return aPrice - bPrice;
                    default: return 0;
                }
            });

            setFilteredItems(sortedItems);
        }
    }, [searchTerm, priceRange, sortBy, riceItems, isLoading, selectedType]);

    return (
        <div className="category-page">
            <h1>Rice Categories</h1>

            {isLoading ? (
                <div className="loading">Loading...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="main-content">
                    <div className="filters-sidebar">
                        <div className="filter-section">
                            <h3>Price Range</h3>
                            <div className="price-range">
                                <div className="price-range-container">
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPrice}
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    />
                                </div>
                                <div className="price-values">
                                    <span>₹0</span>
                                    <span>₹{priceRange[1]}</span>
                                </div>
                            </div>
                        </div>

                        <div className="filter-section">
                            <h3>Type</h3>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="All">All Types</option>
                                <option value="Basmati Rice">Basmati Rice</option>
                                <option value="Jasmine Rice">Jasmine Rice</option>
                                <option value="Arborio Rice">Arborio Rice</option>
                                <option value="Sushi Rice">Sushi Rice</option>
                                <option value="Glutinous Rice (Sticky Rice)">Glutinous Rice (Sticky Rice)</option>
                                <option value="Carolina Gold Rice">Carolina Gold Rice</option>
                                <option value="Brown Rice">Brown Rice</option>
                                <option value="Wild Rice">Wild Rice</option>
                                <option value="Red Rice">Red Rice</option>
                                <option value="Black Rice">Black Rice</option>
                            </select>
                        </div>
                    </div>

                    <div className="content-area">
                        <div className="search-sort-container">
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Search for rice..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="sort-by">
                                <label>Sort By:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="Recommended">Recommended</option>
                                    <option value="High to Low">Price: High to Low</option>
                                    <option value="Low to High">Price: Low to High</option>
                                </select>
                            </div>
                        </div>

                        <div className="items-grid">
                            {typeNotFoundError ? (
                                <div className="no-results">
                                    No products found for the selected type
                                </div>
                            ) : filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <div
                                        key={item.id}
                                        className={`item-card ${item.inStock ? 'in-stock' : 'out-of-stock'}`}
                                    >
                                        <div className="item-image">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = '/images/default-rice.jpg';
                                                }}
                                            />
                                            {!item.inStock && (
                                                <div className="out-of-stock-label">Out of Stock</div>
                                            )}
                                        </div>
                                        <div className="item-details">
                                            <h3>{item.name}</h3>
                                            <p className="item-description">{item.description}</p>
                                            <div className="item-meta">
                                                <span className="price">
                                                    ₹{item.finalPrice !== undefined && item.finalPrice !== null
                                                        ? item.finalPrice.toFixed(2)
                                                        : '0.00'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="buy-button-container">
                                            <Link to={`/item/${item.id}`}>
                                                <button
                                                    className={`buy-button ${!item.inStock ? 'disabled' : ''}`}
                                                    disabled={!item.inStock}
                                                >
                                                    {item.inStock ? 'Buy Now' : 'Coming Soon'}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">
                                    No products found matching your criteria
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
