import React, { useState, useEffect } from 'react';
import './css/Order.css';
import ProtectedRoute from '../Router/ProtectedRoute';
import { apiCall } from '../api/api';
import { useNavigate } from 'react-router-dom'; // Make sure this line exists

const Order = () => {
    const navigate = useNavigate();
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
                console.log('Fetching orders...');
                const response = await apiCall('get', '/orders/my-orders'); // Removed /api prefix

                console.log('Response:', response);

                if (response?.status === 401) {
                    navigate('/login');
                    return;
                }

                // The response is the actual data (no .data property)
                if (Array.isArray(response)) { // Check if response is array
                    setOrders(response);
                } else if (response) { // Handle single order object
                    setOrders([response]); // Wrap in array
                } else {
                    setError('No orders found');
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                if (err.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError(err.response?.data?.message || 'Failed to load orders. Please try again later.');
                }
            }
            setLoading(false);
        };

        fetchOrders();
    }, [navigate]);

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
        <ProtectedRoute>
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
                                                        <span className="item-weight">{item.weight}kg</span>
                                                        <span className="item-price">₹{item.price} × {item.quantity}</span>
                                                        <span className="item-total">₹{item.price * item.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="order-summary">
                                            <div className="summary-row">
                                                <span>Total Weight:</span>
                                                <span>{order.items.reduce((sum, item) => sum + (item.weight * item.quantity), 0)} kg</span>
                                            </div>

                                            <div className="summary-row">
                                                <span>Subtotal:</span>
                                                <span>₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                                            </div>

                                            <div className="summary-row">
                                                <span>Payment Method:</span>
                                                <span>{order.paymentMethod || 'UPI'}</span>
                                            </div>

                                            <div className="summary-row">
                                                <span>Delivery Address:</span>
                                                <span>
                                                    {order.deliveryAddress?.street &&
                                                        `${order.deliveryAddress.street}, 
                ${order.deliveryAddress.city}, 
                ${order.deliveryAddress.state} - 
                ${order.deliveryAddress.pincode}`
                                                    }
                                                    {!order.deliveryAddress?.street && 'No delivery address provided'}
                                                </span>
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
        </ProtectedRoute>
    );
};

export default Order;
