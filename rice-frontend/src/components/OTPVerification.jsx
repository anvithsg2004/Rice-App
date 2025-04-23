import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('https://rice-app-kl2g.onrender.com/api/verify-otp', { email, otp });
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || 'Verification failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="otp-container">
            <h2>Verify OTP</h2>
            <p>We've sent a 6-digit code to {email || 'your email'}</p>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter OTP"
                    required
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Verifying...' : 'Verify'}
                </button>
            </form>
        </div>
    );
};

export default OTPVerification;
