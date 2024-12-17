import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import apis from '../../../utils/apis';
import toast from 'react-hot-toast';
import LoadingButton from '../../../components/ui/LoadingButton';

const AddStock = () => {
    const [formData, setFormData] = useState({
        itemName: '',
        unit: '',
        itemQuantity: '',
        pricePerItem: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apis().addExistingItem, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message || 'Stock added successfully');
                navigate('/admin/stock');
            } else {
                toast.error(result.message || 'Failed to add stock');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while adding stock');
        }
    };

    return (
        <div className="suppier_main">
            <h2 className="supplier_header">
                <span
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => navigate('/admin/stock/existing')}
                >
                    Existing Stock List
                </span>
                / Add
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="row supplier_container">
                    <h4>Stock Details</h4>
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
                            placeholder="Enter item quantity"
                            required
                        />
                    </div>
                    <div className="col-md-6 supplier_item">
                        <label>Price per Unit *</label>
                        <Input
                            type="number"
                            name="pricePerItem"
                            value={formData.pricePerItem}
                            onChange={handleChange}
                            placeholder="Enter price per unit"
                            required
                        />
                    </div>
                </div>
                <div className="col-md-4 supplier_item mt-5">
                        <Button>
                            <LoadingButton title="Add Existing Stock" onClick={handleSubmit} />
                        </Button>
                    </div>
            </form>
        </div>
    );
};

export default AddStock;
