import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/Header.css';

const Header = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const handleUserIconClick = () => {
        const authToken = localStorage.getItem('authToken');
        window.location.href = authToken ? '/user' : '/login';
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/categories', label: 'Shop' },
        { to: '/about-rice', label: 'About' },
        { to: '/cart', label: 'Cart' },
        { to: '/orders', label: 'Orders' },
    ];

    return (
        <header className={`app-header ${isScrolled ? 'is-scrolled' : ''}`}>
            <div className="header-container">
                <div className="header-left">
                    <Link to="/" className="logo" aria-label="Rice and Glory home">
                        <div className="logo-icon">
                            <span>RG</span>
                        </div>
                        <h1>Rice <em>&amp;</em> Glory</h1>
                    </Link>
                </div>

                <nav className="main-nav" aria-label="Primary">
                    <ul>
                        {navLinks.map(link => (
                            <li key={link.to}>
                                <Link to={link.to} className={isActive(link.to) ? 'active' : ''}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="header-right">
                    <button
                        className="icon-button user-icon"
                        type="button"
                        onClick={handleUserIconClick}
                        aria-label="User profile"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </button>

                    <button
                        className={`icon-button menu-toggle ${isMenuOpen ? 'is-open' : ''}`}
                        type="button"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-nav"
                        aria-label="Toggle menu"
                        onClick={() => setIsMenuOpen(v => !v)}
                    >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div
                id="mobile-nav"
                className={`mobile-nav-overlay ${isMenuOpen ? 'is-open' : ''}`}
                onClick={() => setIsMenuOpen(false)}
            >
                <nav
                    className="mobile-nav-panel"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Mobile primary"
                >
                    <ul>
                        {navLinks.map(link => (
                            <li key={link.to}>
                                <Link to={link.to} className={isActive(link.to) ? 'active' : ''}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mobile-nav-footer">
                        <button
                            type="button"
                            className="mobile-account-button"
                            onClick={handleUserIconClick}
                        >
                            My Account
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
