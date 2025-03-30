import React, { useState, useEffect } from 'react';
import './css/Order.css';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'all',
        riceType: 'all'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockOrders = [
                    {
                        id: 'ORD12345',
                        date: '2023-10-05',
                        status: 'delivered',
                        items: [
                            { id: 'PROD1', name: 'Basmati Rice', weight: '5kg', price: 399, quantity: 1 },
                            { id: 'PROD2', name: 'Jasmine Rice', weight: '2kg', price: 299, quantity: 2 }
                        ],
                        total: 997,
                        totalWeight: 9,
                        paymentMethod: 'UPI',
                        deliveryAddress: '123 Main Street, Anytown, India'
                    },
                    {
                        id: 'ORD12346',
                        date: '2023-09-28',
                        status: 'processing',
                        items: [
                            { id: 'PROD3', name: 'Arborio Rice', weight: '1kg', price: 199, quantity: 3 }
                        ],
                        total: 597,
                        totalWeight: 3,
                        paymentMethod: 'Credit Card',
                        deliveryAddress: '123 Main Street, Anytown, India'
                    },
                    {
                        id: 'ORD12347',
                        date: '2023-09-15',
                        status: 'cancelled',
                        items: [
                            { id: 'PROD4', name: 'Sushi Rice', weight: '2kg', price: 249, quantity: 1 }
                        ],
                        total: 249,
                        totalWeight: 2,
                        paymentMethod: 'UPI',
                        deliveryAddress: '123 Main Street, Anytown, India'
                    },
                    {
                        id: 'ORD12348',
                        date: '2023-08-30',
                        status: 'delivered',
                        items: [
                            { id: 'PROD5', name: 'Wild Rice', weight: '1kg', price: 299, quantity: 2 }
                        ],
                        total: 598,
                        totalWeight: 2,
                        paymentMethod: 'Credit Card',
                        deliveryAddress: '123 Main Street, Anytown, India'
                    },
                    {
                        id: 'ORD12349',
                        date: '2023-08-10',
                        status: 'delivered',
                        items: [
                            { id: 'PROD6', name: 'Red Rice', weight: '3kg', price: 279, quantity: 1 },
                            { id: 'PROD7', name: 'Black Rice', weight: '1kg', price: 399, quantity: 1 }
                        ],
                        total: 678,
                        totalWeight: 4,
                        paymentMethod: 'UPI',
                        deliveryAddress: '123 Main Street, Anytown, India'
                    },
                    {
                        id: 'ORD12350',
                        date: '2023-07-25',
                        status: 'delivered',
                        items: [
                            { id: 'PROD8', name: 'Brown Rice', weight: '5kg', price: 249, quantity: 1 }
                        ],
                        total: 249,
                        totalWeight: 5,
                        paymentMethod: 'Credit Card',
                        deliveryAddress: '123 Main Street, Anytown, India'
                    }
                ];

                setOrders(mockOrders);
                setLoading(false);
            } catch (err) {
                setError('Failed to load orders. Please try again later.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const filteredOrders = orders.filter(order => {
        if (filters.status !== 'all' && order.status !== filters.status) return false;
        if (filters.dateRange !== 'all') {
            const orderDate = new Date(order.date);
            const currentDate = new Date();

            switch (filters.dateRange) {
                case 'week':
                    if ((currentDate - orderDate) > 7 * 24 * 60 * 60 * 1000) return false;
                    break;
                case 'month':
                    if ((currentDate - orderDate) > 30 * 24 * 60 * 60 * 1000) return false;
                    break;
                case 'year':
                    if ((currentDate - orderDate) > 365 * 24 * 60 * 60 * 1000) return false;
                    break;
                default:
                    break;
            }
        }
        if (filters.riceType !== 'all') {
            const hasRiceType = order.items.some(item =>
                item.name.toLowerCase().includes(filters.riceType)
            );
            if (!hasRiceType) return false;
        }
        return true;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'delivered':
                return <span className="status-badge delivered">Delivered</span>;
            case 'processing':
                return <span className="status-badge processing">Processing</span>;
            case 'cancelled':
                return <span className="status-badge cancelled">Cancelled</span>;
            case 'shipped':
                return <span className="status-badge shipped">Shipped</span>;
            default:
                return <span className="status-badge">{status}</span>;
        }
    };

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => (
        <li key={number} className={currentPage === number ? 'active' : ''}>
            <button onClick={() => setCurrentPage(number)}>{number}</button>
        </li>
    ));

    return (
        <div className="order-page">
            <h1>My Rice Orders</h1>

            {loading && <div className="loading">Loading orders...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && (
                <div className="orders-container">
                    <div className="filters">
                        <div className="filter-group">
                            <label>Order Status:</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="all">All Orders</option>
                                <option value="delivered">Delivered</option>
                                <option value="processing">Processing</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="shipped">Shipped</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Date Range:</label>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                            >
                                <option value="all">All Time</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Rice Type:</label>
                            <select
                                value={filters.riceType}
                                onChange={(e) => setFilters({ ...filters, riceType: e.target.value })}
                            >
                                <option value="all">All Rice Types</option>
                                <option value="basmati">Basmati</option>
                                <option value="jasmine">Jasmine</option>
                                <option value="arborio">Arborio</option>
                                <option value="sushi">Sushi</option>
                                <option value="wild">Wild</option>
                                <option value="red">Red</option>
                                <option value="black">Black</option>
                                <option value="brown">Brown</option>
                            </select>
                        </div>
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="no-orders">No orders found matching your criteria.</div>
                    ) : (
                        <div className="orders-list">
                            {currentOrders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div>
                                            <h3>Order #{order.id}</h3>
                                            <p>Ordered on: {new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>

                                    <div className="order-tracking">
                                        <h4>Order Tracking</h4>
                                        <div className="tracking-steps">
                                            <div className="tracking-step completed">
                                                <span className="step-icon">1</span>
                                                <span className="step-label">Ordered</span>
                                            </div>
                                            <div className={`tracking-step ${order.status === 'processing' ? 'processing' : (order.status === 'shipped' || order.status === 'delivered') ? 'completed' : ''}`}>
                                                <span className="step-icon">2</span>
                                                <span className="step-label">Processing</span>
                                            </div>
                                            <div className={`tracking-step ${order.status === 'shipped' ? 'processing' : order.status === 'delivered' ? 'completed' : ''}`}>
                                                <span className="step-icon">3</span>
                                                <span className="step-label">Shipped</span>
                                            </div>
                                            <div className={`tracking-step ${order.status === 'delivered' ? 'completed' : ''}`}>
                                                <span className="step-icon">4</span>
                                                <span className="step-label">Delivered</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="order-items">
                                        <h4>Rice Items:</h4>
                                        <ul>
                                            {order.items.map(item => (
                                                <li key={item.id}>
                                                    <span className="item-name">{item.name}</span>
                                                    <span className="item-weight">{item.weight}</span>
                                                    <span className="item-price">₹{item.price}</span>
                                                    <span className="item-quantity">×{item.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="order-summary">
                                        <div className="summary-row">
                                            <span>Total Weight:</span>
                                            <span>{order.totalWeight} kg</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Subtotal:</span>
                                            <span>₹{order.total}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Payment Method:</span>
                                            <span>{order.paymentMethod}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Delivery Address:</span>
                                            <span>{order.deliveryAddress}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <ul>
                                <li className={currentPage === 1 ? 'disabled' : ''}>
                                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                        Previous
                                    </button>
                                </li>
                                {renderPageNumbers}
                                <li className={currentPage === totalPages ? 'disabled' : ''}>
                                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Order;