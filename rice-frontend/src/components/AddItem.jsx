import React, { useState } from 'react';
// import './css/AddItem.css';
import { addItem } from '../api/addItemApi';

const AddItem = () => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        imageUrl: '',
        quantity: '',
        originalPrice: '',
        discount: '',
        finalPrice: '',
        description: '',
        nutrients: '',
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
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }

        // Validation patterns
        const validation = {
            quantity: /^\d*\.?\d*$/,
            originalPrice: /^\d*\.?\d*$/,
            discount: /^\d*\.?\d*$/
        };

        if (validation[name] && !validation[name].test(value)) return;

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            if (['originalPrice', 'discount'].includes(name)) {
                const originalPrice = parseFloat(newData.originalPrice) || 0;
                const discount = parseFloat(newData.discount) || 0;

                if (!isNaN(originalPrice) && discount >= 0 && discount <= 100) {
                    newData.finalPrice = (originalPrice * (100 - discount) / 100).toFixed(2);
                } else {
                    newData.finalPrice = '';
                }
            }

            return newData;
        });

        setErrors(prev => ({
            ...prev,
            [name]: '',
            ...(name === 'originalPrice' || name === 'discount' ? { finalPrice: '' } : {})
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const numericFields = ['quantity', 'originalPrice', 'discount', 'finalPrice'];

        // Required fields
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.type) newErrors.type = 'Type is required';
        if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        // Numeric validation
        numericFields.forEach(field => {
            const value = parseFloat(formData[field]);
            if (formData[field] === '' || isNaN(value)) {
                newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} must be a valid number`;
            }
        });

        // Specific validations
        if (parseFloat(formData.discount) > 100) newErrors.discount = 'Discount cannot exceed 100%';
        if (parseFloat(formData.quantity) <= 0) newErrors.quantity = 'Quantity must be greater than zero';

        // Nutrients validation
        const nutrientList = formData.nutrients.split(',').map(n => n.trim()).filter(n => n);
        if (nutrientList.length === 0) newErrors.nutrients = 'At least one nutrient required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name.trim(),
                type: formData.type,
                imageUrl: formData.imageUrl.trim(),
                quantity: parseFloat(formData.quantity),
                originalPrice: parseFloat(formData.originalPrice),
                discount: parseFloat(formData.discount),
                finalPrice: parseFloat(formData.finalPrice),
                description: formData.description.trim(),
                nutrients: formData.nutrients.split(',').map(n => n.trim()).filter(n => n)
            };

            const response = await addItem(payload);

            if (response.status !== 201) {
                const errorData = await response.json();
                console.log("Something went wrong", errorData);
                throw new Error(errorData.message || 'Server rejected the request');
            }

            setSuccessMessage('Item added successfully!');
            setFormData({
                name: '',
                type: '',
                imageUrl: '',
                quantity: '',
                originalPrice: '',
                discount: '',
                finalPrice: '',
                description: '',
                nutrients: ''
            });

            await addItem(payload);

        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            }
            console.error('API Error:', error);
            const errorMessage = error.name === 'TypeError'
                ? 'Network error - check your connection'
                : error.message;

            setErrors(prev => ({
                ...prev,
                serverError: errorMessage
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-item-container">
            <h1>Add New Rice Item</h1>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errors.serverError && <div className="error-message">{errors.serverError}</div>}

            <form onSubmit={handleSubmit} className="add-item-form">
                {/* Name Field */}
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

                {/* Type Field */}
                <div className="form-group">
                    <label htmlFor="type">Type of Rice:</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={`custom-dropdown ${errors.type ? 'input-error' : ''}`}
                        disabled={isSubmitting}
                    >
                        <option value="" disabled hidden>Select Rice Type</option>
                        {riceTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.type && <div className="error-message">{errors.type}</div>}
                </div>

                {/* Image URL Field */}
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

                {/* Description Field */}
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={errors.description ? 'input-error' : ''}
                        placeholder="Enter description"
                        disabled={isSubmitting}
                        rows="4"
                    />
                    {errors.description && <div className="error-message">{errors.description}</div>}
                </div>

                {/* Quantity Field */}
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

                {/* Price Fields */}
                <div className="price-fields">
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
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
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
                            placeholder="Calculated automatically"
                        />
                        {errors.finalPrice && <div className="error-message">{errors.finalPrice}</div>}
                    </div>
                </div>

                {/* Nutrients Section */}
                <div className="form-group">
                    <label htmlFor="nutrients">Nutrients (comma-separated):</label>
                    <input
                        type="text"
                        id="nutrients"
                        name="nutrients"
                        value={formData.nutrients}
                        onChange={handleChange}
                        className={errors.nutrients ? 'input-error' : ''}
                        placeholder="Vitamin B, Iron, Fiber"
                        disabled={isSubmitting}
                    />
                    {errors.nutrients && <div className="error-message">{errors.nutrients}</div>}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner"></span>
                            Adding Item...
                        </>
                    ) : (
                        'Add Item'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddItem;
