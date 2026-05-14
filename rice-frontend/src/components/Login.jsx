import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/api';
import './css/LoginAndRegister.css';
import Loading from './Loading';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const token = btoa(`${email}:${password}`);
            const response = await axios.get(`${API_BASE_URL}/email/${email}`, {
                headers: { 'Authorization': `Basic ${token}` }
            });

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('userId', response.data.id);
            navigate('/');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('Login failed. Please check your connection and try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card login-container">
                <div className="auth-brand">
                    <div className="auth-brand-icon">RG</div>
                </div>
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Sign in to continue to Rice and Glory</p>

                {error && <div className="error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loading variant="dots" size="sm" inline label="Signing in" />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Create an account</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
