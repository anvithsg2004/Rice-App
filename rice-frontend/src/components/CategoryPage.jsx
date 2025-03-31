import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/CategoryPage.css';

const CategoryPage = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedType, setSelectedType] = useState('All');
    const [sortBy, setSortBy] = useState('Recommended');
    const [isLoading, setIsLoading] = useState(true);
    const [maxPrice, setMaxPrice] = useState(1000);

    // Simulate API call
    useEffect(() => {
        const fetchItems = () => {
            const sampleData = [
                {
                    id: 1,
                    name: 'Basmati Rice',
                    description: 'Premium quality basmati rice from India',
                    price: 599,
                    image: 'https://images.unsplash.com/photo-1611143669185-af24681a3251?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                    inStock: true,
                    type: 'Basmati',
                    sold: 150
                },
                {
                    id: 2,
                    name: 'Jasmine Rice',
                    description: 'Aromatic jasmine rice from Thailand',
                    price: 450,
                    image: 'https://images.unsplash.com/photo-1598379007742-315e2c024786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                    inStock: true,
                    type: 'Jasmine',
                    sold: 89
                },
                {
                    id: 3,
                    name: 'Wild Rice',
                    description: 'Nutritious wild rice blend',
                    price: 899,
                    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                    inStock: false,
                    type: 'Wild',
                    sold: 42
                },
                {
                    id: 4,
                    name: 'Black Rice',
                    description: 'Organic black rice with antioxidants',
                    price: 699,
                    image: 'https://images.unsplash.com/photo-1606751029598-4a642f1f9e6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                    inStock: true,
                    type: 'Black',
                    sold: 203
                },
                {
                    id: 5,
                    name: 'Carolina Gold Rice',
                    description: 'Historic and flavorful rice variety',
                    price: 1299,
                    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                    inStock: true,
                    type: 'Carolina Gold',
                    sold: 27
                },
                {
                    id: 6,
                    name: 'Brown Rice',
                    description: 'Whole grain brown rice with fiber',
                    price: 399,
                    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                    inStock: false,
                    type: 'Brown',
                    sold: 156
                },
            ];

            const prices = sampleData.map(item => item.price);
            const calculatedMaxPrice = Math.ceil(Math.max(...prices) / 100) * 100;

            setItems(sampleData);
            setMaxPrice(calculatedMaxPrice);
            setPriceRange([0, calculatedMaxPrice]);
            setIsLoading(false);
        };

        setTimeout(fetchItems, 500); // Simulate network delay
    }, []);

    // Filter and sort items
    useEffect(() => {
        const filtered = items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
            const matchesType = selectedType === 'All' || item.type === selectedType;
            return matchesSearch && matchesPrice && matchesType;
        });

        const sortedItems = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'High to Low': return b.price - a.price;
                case 'Low to High': return a.price - b.price;
                case 'Highest Sold': return b.sold - a.sold;
                default: return 0;
            }
        });

        setFilteredItems(sortedItems);
    }, [searchTerm, priceRange, selectedType, sortBy, items]);

    return (
        <div className="category-page">
            <h1>Rice Categories</h1>

            {isLoading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="main-content">
                    {/* Filters Sidebar */}
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
                                <option value="Basmati">Basmati</option>
                                <option value="Jasmine">Jasmine</option>
                                <option value="Wild">Wild</option>
                                <option value="Black">Black</option>
                                <option value="Carolina Gold">Carolina Gold</option>
                                <option value="Brown">Brown</option>
                            </select>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="content-area">
                        {/* Search and Sort */}
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
                                    <option value="Highest Sold">Highest Sold</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="items-grid">
                            {filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <div
                                        key={item.id}
                                        className={`item-card ${item.inStock ? 'in-stock' : 'out-of-stock'}`}
                                    >
                                        <div className="item-image">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                loading="lazy"
                                            />
                                            {!item.inStock && (
                                                <div className="out-of-stock-label">Out of Stock</div>
                                            )}
                                        </div>
                                        <div className="item-details">
                                            <h3>{item.name}</h3>
                                            <p>{item.description}</p>
                                            <div className="item-meta">
                                                <span className="price">₹{item.price}</span>
                                                <span className="sold">Sold: {item.sold}</span>
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