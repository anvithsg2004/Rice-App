import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api/api';
import './css/LoginAndRegister.css';
import Loading from './Loading';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card otp-container">
                <div className="auth-brand">
                    <div className="auth-brand-icon">RG</div>
                </div>
                <h2>Verify Your Email</h2>
                <p className="auth-subtitle">
                    We've sent a 6-digit code to <strong>{email || 'your email'}</strong>
                </p>

                {error && <div className="error">{error}</div>}

                <form onSubmit={handleVerify}>
                    <div className="form-group">
                        <label htmlFor="otp-input">Verification Code</label>
                        <input
                            id="otp-input"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            className="otp-input"
                            autoComplete="one-time-code"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting || otp.length !== 6}
                    >
                        {isSubmitting ? (
                            <Loading variant="dots" size="sm" inline label="Verifying" />
                        ) : (
                            'Verify'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Wrong email? <Link to="/register">Go back</Link></p>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;
