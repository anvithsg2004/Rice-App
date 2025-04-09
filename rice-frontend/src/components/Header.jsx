import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Header.css';

const Header = () => {
    const navigate = useNavigate();

    const handleUserIconClick = () => {
        localStorage.getItem('authToken') ? navigate('/user') : navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <div className="logo">
                    <div className="logo-icon">RG</div>
                    <h1>Rice and Glory</h1>
                </div>
            </div>

            <div className="header-right">
                <nav className="main-nav">
                    <ul>
                        <li>
                            <Link to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>
                                Cart
                            </Link>
                        </li>
                        <li>
                            <Link to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
                                Orders
                            </Link>
                        </li>
                        {/* <li>
                            <Link to="/add-item" className={({ isActive }) => isActive ? 'active' : ''}>
                                Add Item
                            </Link>
                        </li> */}
                    </ul>
                </nav>
                <div className="user-icon">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        alt="User Profile"
                        className="profile-image"
                        onClick={handleUserIconClick}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
