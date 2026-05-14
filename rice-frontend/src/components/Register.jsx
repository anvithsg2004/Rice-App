import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/api';
import './css/LoginAndRegister.css';
import Loading from './Loading';

function Register() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await axios.post(`${API_BASE_URL}/start-registration`, userData);
            navigate('/verify-otp', { state: { email: userData.email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card register-container">
                <div className="auth-brand">
                    <div className="auth-brand-icon">RG</div>
                </div>
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join Rice and Glory for premium rice from around the world</p>

                {error && <div className="error">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="reg-name">Full Name</label>
                        <input
                            id="reg-name"
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            autoComplete="name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-email">Email</label>
                        <input
                            id="reg-email"
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            placeholder="Choose a strong password"
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-phone">Phone Number</label>
                        <input
                            id="reg-phone"
                            type="tel"
                            name="phoneNumber"
                            value={userData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+91 1234567890"
                            autoComplete="tel"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-address">Address</label>
                        <textarea
                            id="reg-address"
                            name="address"
                            value={userData.address}
                            onChange={handleChange}
                            placeholder="Street, city, state, postal code"
                            autoComplete="street-address"
                            rows={3}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loading variant="dots" size="sm" inline label="Sending OTP" />
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
