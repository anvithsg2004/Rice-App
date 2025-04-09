import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/api';

function Register() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Use direct axios call instead of apiCall to avoid auth header
            await axios.post(`${API_BASE_URL}/users`, userData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Registration failed. Please try again.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'white'
        }}>
            <div style={{
                maxWidth: '500px',
                width: '100%',
                padding: '2.5rem',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                margin: '0 auto',
                fontFamily: "'Inter', sans-serif",
                color: '#333333'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1B5E20', fontSize: '2rem', fontWeight: '700' }}>Register</h2>
                {error && <div style={{ color: '#CC0000', marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '8px', borderLeft: '4px solid #CC0000' }}>{error}</div>}
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                border: '1px solid #E0E0E0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                border: '1px solid #E0E0E0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                border: '1px solid #E0E0E0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number:</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={userData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+91 1234567890"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                border: '1px solid #E0E0E0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Address:</label>
                        <textarea
                            name="address"
                            value={userData.address}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                border: '1px solid #E0E0E0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                minHeight: '100px',
                                resize: 'vertical',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    <button type="submit" style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #2E7D32, #1B5E20)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}>Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;