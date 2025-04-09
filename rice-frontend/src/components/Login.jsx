import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link
import { API_BASE_URL } from '../api/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const token = btoa(`${email}:${password}`);
            // Send request to fetch user data with Basic Auth
            const response = await axios.get(`${API_BASE_URL}/email/${email}`, {
                headers: { 'Authorization': `Basic ${token}` }
            });

            // Store token and user data
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('userId', response.data.id); // Store user ID separately if needed
            console.log('User data:', response.data); // Debugging line
            console.log('Token:', token); // Debugging line
            navigate('/'); // Redirect to home
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('Login failed. Please check your connection and try again.');
            }
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
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1B5E20', fontSize: '2rem', fontWeight: '700' }}>Login</h2>
                {error && <p style={{ color: '#CC0000', marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '8px', borderLeft: '4px solid #CC0000' }}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    }}>Login</button>
                </form>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p>Don't have an account? <Link to="/register" style={{ color: '#2E7D32', textDecoration: 'none' }}>Create a account</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;