import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apis from '../../../utils/apis'; // Assuming apis() returns the correct URL for the API
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import LoadingButton from '../../../components/ui/LoadingButton';
import toast from 'react-hot-toast';

const EditStock = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { stockData } = location.state || {}; // Get stock data passed from the previous page

    const [formData, setFormData] = useState({
        itemName: '',
        unit: '',
        itemQuantity: '',
        pricePerItem: '',
        totalPrice: null,
    });

    // Set form data if stockData is available
    useEffect(() => {
        if (stockData) {
            setFormData({
                ...stockData,
                totalPrice: stockData.itemQuantity * stockData.pricePerItem, // Calculate total price if not available
            });
        }
    }, [stockData]);

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Ensure proper number conversion while allowing decimal values
        setFormData({ 
            ...formData, 
            [name]: name === 'itemQuantity' || name === 'pricePerItem' ? (value === '' ? '' : value) : value 
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the values if needed (e.g., non-empty, numeric values for price and quantity)
        if (formData.itemQuantity <= 0 || formData.pricePerItem <= 0) {
            toast.error('Quantity and Price must be greater than zero');
            return;
        }

        try {
            const response = await fetch(apis().updateExistingItem(stockData._id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (response.ok) {
                toast.success('Item updated successfully!');
                navigate('/admin/stock'); // Redirect to the stock page after update
            } else {
                toast.error(result.message || 'Failed to update item');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while updating item');
        }
    };

    return (
        <div className="suppier_main">
            <h2 className="supplier_header">
                <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/admin/stock/existing')}>
                    Existing Stock List
                </span> / Edit
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="row supplier_container">
                    <h4>Item Details</h4>

                    <div className="col-md-6 supplier_item">
                        <label>Item Name *</label>
                        <Input
                            type="text"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            placeholder="Enter item name"
                            required
                        />
                    </div>

                    <div className="col-md-6 supplier_item">
                        <label>Unit *</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            required
                            className="custom-select"
                        >
                            <option value="">Select unit</option>
                            <option value="kg">Kg</option>
                            <option value="ltr">Ltr</option>
                        </select>
                    </div>

                    <div className="col-md-6 supplier_item">
                        <label>Quantity *</label>
                        <Input
                            type="number"
                            name="itemQuantity"
                            value={formData.itemQuantity}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            required
                            min="0"
                        />
                    </div>

                    <div className="col-md-6 supplier_item">
                        <label>Price per Item *</label>
                        <Input
                            type="number"
                            name="pricePerItem"
                            value={formData.pricePerItem}
                            onChange={handleChange}
                            placeholder="Enter price"
                            required
                            min="0"
                            step="any" // Allows decimals
                        />
                    </div>

                    <div className="col-md-4 supplier_item mt-5">
                        <Button>
                            <LoadingButton title="Update Existing Stock" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditStock;
