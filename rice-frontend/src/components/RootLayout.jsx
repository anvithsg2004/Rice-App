import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet from react-router-dom
import Header from './Header';
// import './css/Header.css';
// import './css/Header.css';

const RootLayout = () => {
    return (
        <div>
            <Header />
            <main>
                <Outlet /> {/* This will render child routes */}
            </main>
        </div>
    );
};

export default RootLayout;
