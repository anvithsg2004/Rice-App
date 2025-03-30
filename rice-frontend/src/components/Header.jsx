import React from 'react';
import { NavLink } from 'react-router-dom';
import './css/Header.css';

const Header = () => {
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
                            <NavLink activeClassName="active" exact to="/">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" to="/categories">
                                Categories
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" to="/cart">
                                Cart
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" to="/orders">
                                Orders
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" to="/add-item">
                                Add Item
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" to="/auth">
                                Login/Logout
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className="user-icon">
                    <NavLink activeClassName="active" to="/user">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                            alt="User Profile"
                            className="profile-image"
                        />
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

export default Header;