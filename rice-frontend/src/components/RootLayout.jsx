import React from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './css/RootLayout.css';

const HIDE_FOOTER_ROUTES = ['/login', '/register', '/verify-otp'];

const RootLayout = () => {
    const location = useLocation();
    const hideFooter = HIDE_FOOTER_ROUTES.includes(location.pathname);

    return (
        <div className="root-layout">
            <Header />
            <main className="root-main">
                <Outlet />
            </main>
            {!hideFooter && <Footer />}
            <ScrollRestoration />
        </div>
    );
};

export default RootLayout;
