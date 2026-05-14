import React from 'react';
import { Link } from 'react-router-dom';
import './css/Footer.css';

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="app-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo" aria-label="Rice and Glory home">
                        <div className="footer-logo-icon">RG</div>
                        <span>Rice <em>&amp;</em> Glory</span>
                    </Link>
                    <p className="footer-tagline">
                        Premium rice varieties sourced from the world's finest growing regions —
                        delivered with care.
                    </p>
                </div>

                <div className="footer-columns">
                    <div className="footer-column">
                        <h4>Shop</h4>
                        <ul>
                            <li><Link to="/categories">All Rice</Link></li>
                            <li><Link to="/categories">Bestsellers</Link></li>
                            <li><Link to="/categories">New Arrivals</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Learn</h4>
                        <ul>
                            <li><Link to="/about-rice">About Rice</Link></li>
                            <li><Link to="/about-rice">Our Story</Link></li>
                            <li><Link to="/about-rice">Sustainability</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Account</h4>
                        <ul>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/orders">My Orders</Link></li>
                            <li><Link to="/user">Profile</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© {year} Rice &amp; Glory. All rights reserved.</span>
                <span className="footer-meta">Crafted with care · Made for cooks</span>
            </div>
        </footer>
    );
};

export default Footer;
