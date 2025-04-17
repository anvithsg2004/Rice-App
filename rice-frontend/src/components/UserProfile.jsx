import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import './css/UserProfile.css';
import {
    fetchUser,
    updateUser,
    addUPI,
    removeUPI,
    addPaymentMethod,
    removePaymentMethod,
    deleteUser,
} from '../api/userApi';
import ProtectedRoute from '../Router/ProtectedRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
    const navigate = useNavigate(); // Add this
    // ... existing state and useEffect ...
    const [user, setUser] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        email: '',
        savedUPI: [],
        savedCards: []
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddUPI, setShowAddUPI] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);
    const [newUPI, setNewUPI] = useState('');
    const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // UserProfile.jsx
    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                const userData = await fetchUser();
                if (!userData) {
                    throw new Error('User not found');
                }
                setUser({
                    ...userData,
                    savedUPI: userData.savedUPI || [],
                    savedCards: userData.savedCards || []
                });
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (err) {
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        if (localStorage.getItem('authToken')) {
            loadUserData();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSaveChanges = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            const updatedUserData = await updateUser(user);
            setUser(updatedUserData);
            toast.success('Changes saved successfully!', {
                style: {
                    background: 'var(--primary-dark)',
                    color: 'white',
                    border: '1px solid var(--accent-gold)',
                }
            });
        } catch (error) {
            toast.error('Failed to save changes', {
                style: {
                    background: '#fff0f0',
                    color: 'var(--text-dark)',
                    border: '1px solid #ff4444',
                }
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        toast.info(
            <div className="confirm-toast">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="confirm-buttons">
                    <button onClick={async () => {
                        toast.dismiss();
                        try {
                            await deleteUser();
                            toast.success('Account deleted successfully!', {
                                style: {
                                    background: 'var(--primary-dark)',
                                    color: 'white',
                                    border: '1px solid var(--accent-gold)',
                                }
                            });
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('user');
                            navigate('/login');
                        } catch (error) {
                            toast.error('Failed to delete account', {
                                style: {
                                    background: '#fff0f0',
                                    color: 'var(--text-dark)',
                                    border: '1px solid #ff4444',
                                }
                            });
                        }
                    }}>
                        Yes
                    </button>
                    <button onClick={() => toast.dismiss()}>
                        No
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: 'custom-confirm-toast'
            }
        );
    };


    const handleDeleteUPI = async (upi) => {
        toast.info(
            <div className="confirm-toast">
                <p>Are you sure you want to delete this UPI?</p>
                <div className="confirm-buttons">
                    <button onClick={async () => {
                        toast.dismiss();
                        try {
                            const updatedUser = await removeUPI(upi);
                            setUser(updatedUser);
                            toast.success('UPI deleted successfully', {
                                style: {
                                    background: 'var(--primary-dark)',
                                    color: 'white',
                                    border: '1px solid var(--accent-gold)',
                                }
                            });
                        } catch (error) {
                            toast.error('Failed to delete UPI', {
                                style: {
                                    background: '#fff0f0',
                                    color: 'var(--text-dark)',
                                    border: '1px solid #ff4444',
                                }
                            });
                        }
                    }}>
                        Yes
                    </button>
                    <button onClick={() => toast.dismiss()}>
                        No
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: 'custom-confirm-toast'
            }
        );
    };


    const handleDeleteCard = async (card) => {
        toast.info(
            <div className="confirm-toast">
                <p>Are you sure you want to delete this card?</p>
                <div className="confirm-buttons">
                    <button onClick={async () => {
                        toast.dismiss();
                        try {
                            const updatedUser = await removePaymentMethod(card);
                            setUser(updatedUser);
                            toast.success('Card deleted successfully', {
                                style: {
                                    background: 'var(--primary-dark)',
                                    color: 'white',
                                    border: '1px solid var(--accent-gold)',
                                }
                            });
                        } catch (error) {
                            toast.error('Failed to delete card', {
                                style: {
                                    background: '#fff0f0',
                                    color: 'var(--text-dark)',
                                    border: '1px solid #ff4444',
                                }
                            });
                        }
                    }}>
                        Yes
                    </button>
                    <button onClick={() => toast.dismiss()}>
                        No
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: 'custom-confirm-toast'
            }
        );
    };

    const handleAddUPI = async () => {
        if (newUPI.trim()) {
            try {
                const updatedUser = await addUPI(newUPI);
                setUser(updatedUser);
                setNewUPI('');
                setShowAddUPI(false);
            } catch (error) {
                toast.error('Failed to add UPI', {
                    style: {
                        background: '#fff0f0',
                        color: 'var(--text-dark)',
                        border: '1px solid #ff4444',
                    }
                });
            }
        } else {
            toast.error('Please enter a valid UPI ID.', {
                style: {
                    background: '#fff0f0',
                    color: 'var(--text-dark)',
                    border: '1px solid #ff4444',
                }
            });
        }
    };

    const handleAddCard = async () => {
        const { number, expiry, cvv } = newCard;
        if (number.trim() && expiry.trim() && cvv.trim()) {
            try {
                const updatedUser = await addPaymentMethod(newCard);
                setUser(updatedUser);
                setNewCard({ number: '', expiry: '', cvv: '' });
                setShowAddCard(false);
            } catch (error) {
                toast.error('Failed to add payment method', {
                    style: {
                        background: '#fff0f0',
                        color: 'var(--text-dark)',
                        border: '1px solid #ff4444',
                    }
                });
            }
        } else {
            toast.error('Please fill all card details.', {
                style: {
                    background: '#fff0f0',
                    color: 'var(--text-dark)',
                    border: '1px solid #ff4444',
                }
            });
        }
    };

    const validateForm = () => {
        const { name, phoneNumber, address, email } = user;
        if (!name.trim()) {
            toast.error('Name is required', {
                style: {
                    background: '#fff0f0',
                    color: 'var(--text-dark)',
                    border: '1px solid #ff4444',
                }
            });
            return false;
        }
        if (!address.trim()) {
            toast.error('Address is required', {
                style: {
                    background: '#fff0f0',
                    color: 'var(--text-dark)',
                    border: '1px solid #ff4444',
                }
            });
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error('Please enter a valid email address', {
                style: {
                    background: '#fff0f0',
                    color: 'var(--text-dark)',
                    border: '1px solid #ff4444',
                }
            });
            return false;
        }
        return true;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <ProtectedRoute>
            <div className="user-profile">
                <h1>Profile</h1>
                <div className="profile-container">
                    <div className="profile-info">
                        {error && <div className="error-message">{error}</div>}

                        <div className="profile-section">
                            <h2>Personal Information</h2>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    aria-label="Full Name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number (+91)</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={user.phoneNumber}
                                    onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                                    aria-label="Phone Number"
                                    placeholder="No need +91"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <textarea
                                    id="address"
                                    value={user.address}
                                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                                    aria-label="Address"
                                    placeholder="Your address"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    aria-label="Email Address"
                                    placeholder="example@email.com"
                                />
                            </div>

                            <button
                                type="button"
                                className="save-button"
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                aria-label="Save Changes"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                        <div className="profile-section">
                            <h2>Payment Information</h2>
                            <div className="saved-payments">
                                <h3>Saved UPI</h3>
                                <ul>
                                    {user.savedUPI?.map((upi) => (
                                        <li key={upi}>
                                            {upi}
                                            <button
                                                type="button"
                                                className="delete-item-button"
                                                onClick={() => handleDeleteUPI(upi)}
                                                aria-label={`Delete UPI ${upi}`}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    className="add-button"
                                    onClick={() => setShowAddUPI(true)}
                                    aria-label="Add New UPI"
                                >
                                    Add New UPI
                                </button>
                                {showAddUPI && (
                                    <div className="add-item-form">
                                        <input
                                            type="text"
                                            placeholder="UPI ID"
                                            value={newUPI}
                                            onChange={(e) => setNewUPI(e.target.value)}
                                            aria-label="New UPI ID"
                                        />
                                        <button
                                            type="button"
                                            className="add-button"
                                            onClick={handleAddUPI}
                                            aria-label="Add UPI"
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            onClick={() => setShowAddUPI(false)}
                                            aria-label="Cancel Adding UPI"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="saved-payments">
                                <h3>Saved Cards</h3>
                                <ul>
                                    {user.savedCards?.map((card) => (
                                        <li key={`${card.number}-${card.expiry}`}>
                                            {card.number} | Expires: {card.expiry}
                                            <button
                                                type="button"
                                                className="delete-item-button"
                                                onClick={() => handleDeleteCard(card)}
                                                aria-label={`Delete Card ${card.number}`}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    className="add-button"
                                    onClick={() => setShowAddCard(true)}
                                    aria-label="Add New Card"
                                >
                                    Add New Card
                                </button>
                                {showAddCard && (
                                    <div className="add-item-form">
                                        <div className="form-group">
                                            <label htmlFor="cardNumber">Card Number</label>
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                value={newCard.number}
                                                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                                                aria-label="Card Number"
                                                placeholder="**** **** **** 1234"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="expiry">Expiry (MM/YY)</label>
                                            <input
                                                type="text"
                                                id="expiry"
                                                value={newCard.expiry}
                                                onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                                aria-label="Expiry Date"
                                                placeholder="MM/YY"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cvv">CVV</label>
                                            <input
                                                type="text"
                                                id="cvv"
                                                value={newCard.cvv}
                                                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                                                aria-label="CVV"
                                                placeholder="123"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="add-button"
                                            onClick={handleAddCard}
                                            aria-label="Add Card"
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            onClick={() => setShowAddCard(false)}
                                            aria-label="Cancel Adding Card"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="profile-section">
                            <h2>Account Management</h2>
                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                aria-label="Delete Account"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                            <button
                                type="button"
                                className="logout-button"
                                onClick={handleLogout}
                                aria-label="Logout"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    toastClassName="custom-toast"
                    progressClassName="custom-progress"
                />
            </div>
        </ProtectedRoute>
    );
};

export default UserProfile;
