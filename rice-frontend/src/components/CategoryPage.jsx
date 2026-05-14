import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/CategoryPage.css';
import { getAllCategories, getCategoryByName } from '../api/categoryApi';
import { apiCall } from '../api/api';
import Loading from './Loading';

const RICE_TYPES = [
    'All',
    'Basmati Rice',
    'Jasmine Rice',
    'Arborio Rice',
    'Sushi Rice',
    'Glutinous Rice (Sticky Rice)',
    'Carolina Gold Rice',
    'Brown Rice',
    'Wild Rice',
    'Red Rice',
    'Black Rice',
];

const SORT_OPTIONS = [
    { value: 'Recommended', label: 'Recommended' },
    { value: 'Low to High', label: 'Price: Low to High' },
    { value: 'High to Low', label: 'Price: High to Low' },
    { value: 'Name', label: 'Name (A–Z)' },
];

const CategoryPage = () => {
    const navigate = useNavigate();

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

    // New UX state
    const [inStockOnly, setInStockOnly] = useState(false);
    const [viewMode, setViewMode] = useState('grid');         // 'grid' | 'compact'
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [wishlist, setWishlist] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem('rg_wishlist') || '[]'));
        } catch { return new Set(); }
    });
    const [addingId, setAddingId] = useState(null);

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

                if (!Array.isArray(data)) {
                    data = [data];
                }

                const items = data.flatMap(category => {
                    return category.riceItems.map(item => ({
                        id: item.id,
                        name: item.name || 'Unnamed Rice',
                        description: item.description || 'No description available',
                        finalPrice: item.finalPrice || 0,
                        originalPrice: item.originalPrice || 0,
                        discount: item.discount || 0,
                        imageUrl: `/images/${item.id}.jpeg`,
                        inStock: item.quantity > 0,
                        type: category.name,
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
                setError('Failed to fetch rice items. Please try again later.');
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
                const matchesStock = !inStockOnly || item.inStock;

                return matchesSearch && matchesPrice && matchesType && matchesStock;
            });

            const sortedItems = [...filtered].sort((a, b) => {
                const aPrice = Number(a.finalPrice) || 0;
                const bPrice = Number(b.finalPrice) || 0;

                switch (sortBy) {
                    case 'High to Low': return bPrice - aPrice;
                    case 'Low to High': return aPrice - bPrice;
                    case 'Name': return (a.name || '').localeCompare(b.name || '');
                    default: return 0;
                }
            });

            setFilteredItems(sortedItems);
        }
    }, [searchTerm, priceRange, sortBy, riceItems, isLoading, selectedType, inStockOnly]);

    /* === Active filter chips === */
    const activeFilters = useMemo(() => {
        const chips = [];
        if (selectedType !== 'All') {
            chips.push({ key: 'type', label: selectedType, onClear: () => setSelectedType('All') });
        }
        if (searchTerm) {
            chips.push({ key: 'search', label: `"${searchTerm}"`, onClear: () => setSearchTerm('') });
        }
        if (priceRange[1] < maxPrice) {
            chips.push({
                key: 'price',
                label: `Up to ₹${priceRange[1]}`,
                onClear: () => setPriceRange([0, maxPrice]),
            });
        }
        if (inStockOnly) {
            chips.push({ key: 'stock', label: 'In stock only', onClear: () => setInStockOnly(false) });
        }
        return chips;
    }, [selectedType, searchTerm, priceRange, maxPrice, inStockOnly]);

    const clearAllFilters = () => {
        setSelectedType('All');
        setSearchTerm('');
        setPriceRange([0, maxPrice]);
        setInStockOnly(false);
    };

    /* === Wishlist === */
    const toggleWishlist = (id) => {
        setWishlist(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
                toast.success('Added to wishlist', { autoClose: 1500 });
            }
            localStorage.setItem('rg_wishlist', JSON.stringify(Array.from(next)));
            return next;
        });
    };

    /* === Quick add to cart === */
    const handleQuickAdd = async (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        if (!item.inStock) return;

        if (!localStorage.getItem('authToken')) {
            navigate('/login');
            return;
        }

        setAddingId(item.id);
        try {
            await apiCall('post', `/carts/add/${item.id}?quantity=1`);
            toast.success(`Added ${item.name} to cart`, {
                icon: '🌾',
                autoClose: 2000,
            });
        } catch (err) {
            const msg = err.response?.data?.message || 'Could not add to cart';
            toast.error(msg);
        } finally {
            setAddingId(null);
        }
    };

    const HeartIcon = ({ filled }) => (
        <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
    );

    const renderCard = (item) => {
        const isWished = wishlist.has(item.id);
        const isAdding = addingId === item.id;
        const hasDiscount = item.discount > 0 && item.originalPrice > item.finalPrice;
        const discountPct = hasDiscount
            ? Math.round(((item.originalPrice - item.finalPrice) / item.originalPrice) * 100)
            : 0;

        return (
            <article
                key={item.id}
                className={`item-card ${item.inStock ? 'in-stock' : 'out-of-stock'}`}
            >
                <Link to={`/item/${item.id}`} className="item-card-link" aria-label={`View ${item.name}`}>
                    <div className="item-image">
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            loading="lazy"
                            onError={(e) => { e.target.src = '/images/default-rice.jpg'; }}
                        />
                        <div className="item-badges">
                            {hasDiscount && (
                                <span className="badge badge-discount">−{discountPct}%</span>
                            )}
                            {!item.inStock && (
                                <span className="badge badge-stock">Sold out</span>
                            )}
                        </div>
                        <button
                            type="button"
                            className={`wishlist-button ${isWished ? 'is-active' : ''}`}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(item.id); }}
                            aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
                            aria-pressed={isWished}
                        >
                            <HeartIcon filled={isWished} />
                        </button>
                        {item.inStock && (
                            <button
                                type="button"
                                className="quick-add-button"
                                onClick={(e) => handleQuickAdd(e, item)}
                                disabled={isAdding}
                                aria-label={`Add ${item.name} to cart`}
                            >
                                {isAdding ? (
                                    <Loading variant="dots" size="sm" inline />
                                ) : (
                                    <>+ Quick add</>
                                )}
                            </button>
                        )}
                    </div>
                </Link>

                <div className="item-details">
                    <span className="item-type-tag">{item.type}</span>
                    <h3>
                        <Link to={`/item/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="item-description">{item.description}</p>
                    <div className="item-meta">
                        <div className="price-block">
                            <span className="price">₹{item.finalPrice?.toFixed(2) || '0.00'}</span>
                            {hasDiscount && (
                                <span className="original-price">₹{item.originalPrice.toFixed(2)}</span>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        );
    };

    return (
        <div className="category-page">
            {/* === Page header === */}
            <header className="catalog-header">
                <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">Shop</span>
                </nav>
                <h1>
                    {selectedType === 'All' ? 'All Rice Varieties' : selectedType}
                </h1>
                <p className="catalog-subtitle">
                    Curated rice varieties from the world's finest growing regions —
                    sourced with care, delivered to your kitchen.
                </p>
            </header>

            {/* === Category pills === */}
            <div className="category-pills-wrap" role="tablist" aria-label="Rice category">
                <div className="category-pills">
                    {RICE_TYPES.map(type => (
                        <button
                            key={type}
                            type="button"
                            role="tab"
                            aria-selected={selectedType === type}
                            className={`category-pill ${selectedType === type ? 'is-active' : ''}`}
                            onClick={() => setSelectedType(type)}
                        >
                            {type === 'All' ? 'All' : type.replace(' Rice', '').replace(' (Sticky Rice)', '')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="main-content">
                {/* === Filters sidebar === */}
                <aside
                    className={`filters-sidebar ${isFilterDrawerOpen ? 'is-open' : ''}`}
                    aria-label="Filters"
                >
                    <div className="filters-header">
                        <h2>Filters</h2>
                        <button
                            type="button"
                            className="filters-close"
                            onClick={() => setIsFilterDrawerOpen(false)}
                            aria-label="Close filters"
                        >×</button>
                    </div>

                    <div className="filter-section">
                        <h3>Price</h3>
                        <div className="price-range">
                            <input
                                type="range"
                                min="0"
                                max={maxPrice}
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                aria-label="Maximum price"
                            />
                            <div className="price-values">
                                <span>₹0</span>
                                <span className="price-value-current">₹{priceRange[1]}</span>
                            </div>
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Availability</h3>
                        <label className="toggle-row">
                            <span>In stock only</span>
                            <span className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                />
                                <span className="toggle-slider" />
                            </span>
                        </label>
                    </div>

                    <div className="filter-section">
                        <h3>Type</h3>
                        <div className="filter-chips">
                            {RICE_TYPES.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`filter-chip ${selectedType === type ? 'is-active' : ''}`}
                                    onClick={() => setSelectedType(type)}
                                >
                                    {type === 'All' ? 'All Types' : type.replace(' (Sticky Rice)', '')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeFilters.length > 0 && (
                        <button type="button" className="clear-filters" onClick={clearAllFilters}>
                            Clear all filters
                        </button>
                    )}
                </aside>

                {/* === Content area === */}
                <div className="content-area">
                    {/* Toolbar */}
                    <div className="catalog-toolbar">
                        <div className="search-bar">
                            <input
                                type="search"
                                placeholder="Search rice varieties…"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                aria-label="Search rice"
                            />
                        </div>

                        <div className="toolbar-right">
                            <button
                                type="button"
                                className="toolbar-button mobile-filter-trigger"
                                onClick={() => setIsFilterDrawerOpen(true)}
                                aria-label="Open filters"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="4" y1="6" x2="20" y2="6"/>
                                    <line x1="7" y1="12" x2="17" y2="12"/>
                                    <line x1="10" y1="18" x2="14" y2="18"/>
                                </svg>
                                <span>Filters</span>
                                {activeFilters.length > 0 && (
                                    <span className="filter-count">{activeFilters.length}</span>
                                )}
                            </button>

                            <div className="sort-by">
                                <label htmlFor="sort-select">Sort</label>
                                <select
                                    id="sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="view-toggle" role="group" aria-label="View density">
                                <button
                                    type="button"
                                    className={viewMode === 'grid' ? 'is-active' : ''}
                                    onClick={() => setViewMode('grid')}
                                    aria-label="Grid view"
                                    aria-pressed={viewMode === 'grid'}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                                        <rect x="14" y="14" width="7" height="7" rx="1"/>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className={viewMode === 'compact' ? 'is-active' : ''}
                                    onClick={() => setViewMode('compact')}
                                    aria-label="Compact view"
                                    aria-pressed={viewMode === 'compact'}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <rect x="3" y="3" width="5" height="5" rx="1"/>
                                        <rect x="10" y="3" width="5" height="5" rx="1"/>
                                        <rect x="17" y="3" width="4" height="5" rx="1"/>
                                        <rect x="3" y="10" width="5" height="5" rx="1"/>
                                        <rect x="10" y="10" width="5" height="5" rx="1"/>
                                        <rect x="17" y="10" width="4" height="5" rx="1"/>
                                        <rect x="3" y="17" width="5" height="4" rx="1"/>
                                        <rect x="10" y="17" width="5" height="4" rx="1"/>
                                        <rect x="17" y="17" width="4" height="4" rx="1"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active filter chips & results count */}
                    <div className="results-bar">
                        <div className="results-count">
                            {isLoading ? (
                                <span className="skeleton" style={{ display: 'inline-block', width: 110, height: 14 }} />
                            ) : (
                                <span>
                                    <strong>{filteredItems.length}</strong>
                                    {filteredItems.length === 1 ? ' product' : ' products'}
                                </span>
                            )}
                        </div>
                        {activeFilters.length > 0 && (
                            <div className="active-chips">
                                {activeFilters.map(chip => (
                                    <button
                                        key={chip.key}
                                        type="button"
                                        className="active-chip"
                                        onClick={chip.onClear}
                                        aria-label={`Remove ${chip.label} filter`}
                                    >
                                        {chip.label}
                                        <span aria-hidden="true">×</span>
                                    </button>
                                ))}
                                <button type="button" className="clear-chip" onClick={clearAllFilters}>
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className={`items-grid items-grid--${viewMode}`}>
                            {Array.from({ length: viewMode === 'compact' ? 9 : 6 }).map((_, i) => (
                                <Loading key={i} variant="skeleton" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : typeNotFoundError ? (
                        <div className="no-results">
                            <h3>No products in this category yet</h3>
                            <p>We're still curating this collection — check back soon.</p>
                            <button type="button" className="reset-button" onClick={() => setSelectedType('All')}>
                                Show all varieties
                            </button>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="no-results">
                            <h3>No matches found</h3>
                            <p>Try adjusting your filters or search terms.</p>
                            <button type="button" className="reset-button" onClick={clearAllFilters}>
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className={`items-grid items-grid--${viewMode}`}>
                            {filteredItems.map(renderCard)}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile drawer backdrop */}
            {isFilterDrawerOpen && (
                <div
                    className="filter-backdrop"
                    onClick={() => setIsFilterDrawerOpen(false)}
                    aria-hidden="true"
                />
            )}

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

export default CategoryPage;
