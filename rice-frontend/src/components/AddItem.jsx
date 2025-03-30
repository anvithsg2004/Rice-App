import React, { useState, useEffect } from 'react';
import './css/AddItem.css';

const AddItem = () => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        imageUrl: '',
        quantity: '',
        originalPrice: '',
        discount: '',
        finalPrice: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const riceTypes = [
        'Basmati Rice',
        'Jasmine Rice',
        'Arborio Rice',
        'Sushi Rice',
        'Glutinous Rice (Sticky Rice)',
        'Carolina Gold Rice',
        'Brown Rice',
        'Wild Rice',
        'Red Rice',
        'Black Rice'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error for the changed field
        setErrors({
            ...errors,
            [name]: '',
        });

        // Calculate final price if both originalPrice and discount are provided
        if (name === 'originalPrice' || name === 'discount') {
            calculateFinalPrice();
        }
    };

    const calculateFinalPrice = () => {
        const { originalPrice, discount } = formData;
        if (originalPrice && discount && !isNaN(originalPrice) && !isNaN(discount)) {
            const finalPrice = originalPrice * (100 - discount) / 100;
            setFormData({
                ...formData,
                finalPrice: finalPrice.toFixed(2),
            });
        } else {
            setFormData({
                ...formData,
                finalPrice: '',
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.type) {
            newErrors.type = 'Type is required';
        }

        if (!formData.imageUrl.trim()) {
            newErrors.imageUrl = 'Image URL is required';
        }

        if (!formData.quantity || isNaN(formData.quantity)) {
            newErrors.quantity = 'Quantity must be a number';
        }

        if (!formData.originalPrice || isNaN(formData.originalPrice)) {
            newErrors.originalPrice = 'Original Price must be a number';
        }

        if (!formData.discount || isNaN(formData.discount) || formData.discount < 0 || formData.discount > 100) {
            newErrors.discount = 'Discount must be between 0 and 100';
        }

        if (!formData.finalPrice || isNaN(formData.finalPrice)) {
            newErrors.finalPrice = 'Final Price must be a number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            if (validateForm()) {
                setSuccessMessage('Item added successfully!');
                setFormData({
                    name: '',
                    type: '',
                    imageUrl: '',
                    quantity: '',
                    originalPrice: '',
                    discount: '',
                    finalPrice: '',
                });
            }
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="add-item-container">
            <h1>Add New Rice Item</h1>
            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            <form onSubmit={handleSubmit} className="add-item-form">
                <div className="form-group">
                    <label htmlFor="name">Name of the Rice:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'input-error' : ''}
                        placeholder="Enter rice name"
                        disabled={isSubmitting}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="type">Type of Rice:</label>
                    <div className="custom-dropdown">
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className={errors.type ? 'input-error' : ''}
                            disabled={isSubmitting}
                        >
                            <option value="" disabled hidden>Select Rice Type</option>
                            {riceTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.type && <div className="error-message">{errors.type}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className={errors.imageUrl ? 'input-error' : ''}
                        placeholder="Enter image URL"
                        disabled={isSubmitting}
                    />
                    {errors.imageUrl && <div className="error-message">{errors.imageUrl}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Quantity (kg):</label>
                    <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className={errors.quantity ? 'input-error' : ''}
                        placeholder="Enter quantity in kg"
                        disabled={isSubmitting}
                    />
                    {errors.quantity && <div className="error-message">{errors.quantity}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="originalPrice">Original Price ($):</label>
                    <input
                        type="text"
                        id="originalPrice"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className={errors.originalPrice ? 'input-error' : ''}
                        placeholder="Enter original price"
                    />
                    {errors.originalPrice && <div className="error-message">{errors.originalPrice}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="discount">Discount (%):</label>
                    <input
                        type="text"
                        id="discount"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        className={errors.discount ? 'input-error' : ''}
                        placeholder="Enter discount percentage"
                    />
                    {errors.discount && <div className="error-message">{errors.discount}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="finalPrice">Final Price ($):</label>
                    <input
                        type="text"
                        id="finalPrice"
                        name="finalPrice"
                        value={formData.finalPrice}
                        disabled
                        className={errors.finalPrice ? 'input-error' : ''}
                        placeholder="Final price will be calculated automatically"
                    />
                    {errors.finalPrice && <div className="error-message">{errors.finalPrice}</div>}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding Item...' : 'Add Item'}
                </button>
            </form>
        </div>
    );
};

export default AddItem;