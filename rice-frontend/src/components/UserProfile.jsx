import React, { useState } from 'react';
import './css/UserProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState({
        name: 'John Doe',
        phoneNumber: '+91 1234567890',
        address: '123 Main Street, Anytown, India',
        email: 'john.doe@example.com',
    });

    const [savedUPI, setSavedUPI] = useState(['UPI123456@ybl', 'UPI987654@ybl']);
    const [savedCards, setSavedCards] = useState([
        { number: '**** **** **** 1234', expiry: '12/25', cvv: '123' },
        { number: '**** **** **** 5678', expiry: '06/24', cvv: '456' },
    ]);

    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddUPI, setShowAddUPI] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);
    const [newUPI, setNewUPI] = useState('');
    const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '' });
    const [error, setError] = useState(null);

    // Form validation
    const validateForm = () => {
        const { name, phoneNumber, address, email } = user;
        if (!name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!/^\+91 \d{10}$/.test(phoneNumber)) {
            setError('Please enter a valid phone number in the format +91 1234567890');
            return false;
        }
        if (!address.trim()) {
            setError('Address is required');
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        setError(null);
        return true;
    };

    // Save changes
    const handleSaveChanges = () => {
        if (!validateForm()) return;

        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            alert('Changes saved successfully!');
        }, 1000);
    };

    // Delete account
    const handleDeleteAccount = () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        // Simulate API call
        setTimeout(() => {
            setIsDeleting(false);
            alert('Account deleted successfully!');
        }, 1000);
    };

    // Delete UPI
    const handleDeleteUPI = (index) => {
        if (window.confirm('Are you sure you want to delete this UPI?')) {
            setSavedUPI(savedUPI.filter((_, i) => i !== index));
        }
    };

    // Delete Card
    const handleDeleteCard = (index) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            setSavedCards(savedCards.filter((_, i) => i !== index));
        }
    };

    // Add new UPI
    const handleAddUPI = () => {
        if (newUPI.trim()) {
            setSavedUPI([...savedUPI, newUPI]);
            setNewUPI('');
            setShowAddUPI(false);
        } else {
            alert('Please enter a valid UPI ID.');
        }
    };

    // Add new Card
    const handleAddCard = () => {
        const { number, expiry, cvv } = newCard;
        if (number.trim() && expiry.trim() && cvv.trim()) {
            setSavedCards([...savedCards, { ...newCard }]);
            setNewCard({ number: '', expiry: '', cvv: '' });
            setShowAddCard(false);
        } else {
            alert('Please fill all card details.');
        }
    };

    return (
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
                                placeholder="+91 1234567890"
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
                                {savedUPI.map((upi, index) => (
                                    <li key={index}>
                                        {upi}
                                        <button
                                            type="button"
                                            className="delete-item-button"
                                            onClick={() => handleDeleteUPI(index)}
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
                                {savedCards.map((card, index) => (
                                    <li key={index}>
                                        {card.number} | Expires: {card.expiry}
                                        <button
                                            type="button"
                                            className="delete-item-button"
                                            onClick={() => handleDeleteCard(index)}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;