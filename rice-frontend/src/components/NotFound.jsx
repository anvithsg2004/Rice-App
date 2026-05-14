import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import './css/NotFound.css';

const NotFound = () => {
    const error = useRouteError?.();
    const isRouteError = error && (error.status === 404 || error.statusText);

    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <span className="not-found-eyebrow">{isRouteError ? error.status || '404' : '404'}</span>
                <h1>
                    Looks like this <em>grain</em> got lost
                </h1>
                <p>
                    The page you're searching for doesn't exist — or it's been moved.
                    Let's get you back to the kitchen.
                </p>
                <div className="not-found-actions">
                    <Link to="/" className="not-found-button primary">
                        Back to home
                    </Link>
                    <Link to="/categories" className="not-found-button ghost">
                        Browse rice
                    </Link>
                </div>

                <div className="not-found-decoration" aria-hidden="true">
                    <span className="grain grain-1">🌾</span>
                    <span className="grain grain-2">🌾</span>
                    <span className="grain grain-3">🌾</span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
