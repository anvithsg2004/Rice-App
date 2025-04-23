import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/Header.css';

const Header = () => {
    const location = useLocation();

    const handleUserIconClick = () => {
        const authToken = localStorage.getItem('authToken');
        window.location.href = authToken ? '/user' : '/login';
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-left">
                    <Link to="/" className="logo">
                        <div className="logo-icon">
                            <span>RG</span>
                        </div>
                        <h1>Rice and Glory</h1>
                    </Link>
                </div>

                <div className="header-right">
                    <nav className="main-nav">
                        <ul>
                            <li>
                                <Link to="/" className={isActive('/') ? 'active' : ''}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories" className={isActive('/categories') ? 'active' : ''}>
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className={isActive('/cart') ? 'active' : ''}>
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>
                                    Orders
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="user-icon" role="button" aria-label="User profile" onClick={handleUserIconClick}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                            alt="User Profile"
                            className="profile-image"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
