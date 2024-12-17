import React, { useState, useEffect } from 'react';
import './supplier-style.css';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import LoadingButton from '../../../components/ui/LoadingButton';
import { useLocation, useNavigate } from 'react-router-dom';
import apis from '../../../utils/apis';
import toast from 'react-hot-toast';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

const EditSupplier = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { supplierData } = location.state || {}; // Get supplier data passed from the previous page

    const [formData, setFormData] = useState({
        supplierName: '',
        supplierAddress: '',
        email: '',
        gst: '',
        contactDetails: '',
        items: [
            {
                itemName: '',
                unit: '',
                itemQuantity: null,
                pricePerItem: null,
            },
        ],
    });

    // Set form data if supplierData is available
    useEffect(() => {
        if (supplierData) {
            setFormData({
                ...supplierData,
                items: supplierData.items || [{ itemName: '', unit: '', itemQuantity: null, pricePerItem: null }],
            });
        }
    }, [supplierData]);

    // Handle form data changes
    const handleChange = (e, index, isItemField = false) => {
        const { name, value } = e.target;
        if (isItemField) {
            const updatedItems = [...formData.items];
            updatedItems[index][name] = name === 'itemQuantity' || name === 'pricePerItem' ? (parseFloat(value) || null) : value;
            setFormData({ ...formData, items: updatedItems });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Add a new item field
    const addNewItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                { itemName: '', unit: '', itemQuantity: null, pricePerItem: null },
            ],
        });
    };

    // Remove an item field
    const removeItem = (index) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: updatedItems });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(apis().updateSupplier(supplierData._id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (response.ok) {
                toast.success('Supplier updated successfully!');
                navigate('/admin/supplier');
            } else {
                toast.error(result.message || 'Failed to update supplier');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while updating supplier');
        }
    };

    return (
        <div className='suppier_main'>
            <h2 className='supplier_header'>
                <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/admin/supplier')}>
                    Supplier
                </span> / Edit
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="row supplier_container">
                    <h4>Supplier Details</h4>
                    <div className="col-md-6 supplier_item">
                        <label>Supplier Name *</label>
                        <Input
                            type="text"
                            name="supplierName"
                            value={formData.supplierName}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter supplier name"
                            required
                        />
                    </div>

                    <div className="col-md-6 supplier_item">
                        <label>Supplier Address *</label>
                        <Input
                            type="text"
                            name="supplierAddress"
                            value={formData.supplierAddress}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter supplier address"
                            required
                        />
                    </div>

                    <div className="col-md-6 supplier_item">
                        <label>Email *</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div className="col-md-6 supplier_item">
                        <label>GST *</label>
                        <Input
                            type="text"
                            name="gst"
                            value={formData.gst}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter GST number"
                            required
                        />
                    </div>

                    <div className="col-md-6 supplier_item">
                        <label>Contact Details *</label>
                        <Input
                            type="text"
                            name="contactDetails"
                            value={formData.contactDetails}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter contact number"
                            required
                        />
                    </div>

                    <h4 style={{ paddingTop: '20px' }}>Items Details</h4>

                    {formData.items.map((item, index) => (
                        <div key={index} className="col-md-12 supplier_item">
                            <div className="row">
                                <div className="col-md-3">
                                    <label>Item Name *</label>
                                    <Input
                                        type="text"
                                        name="itemName"
                                        value={item.itemName}
                                        onChange={(e) => handleChange(e, index, true)}
                                        placeholder="Enter item name"
                                        required
                                    />
                                </div>
                                <div className="col-md-3 supplier_item">
                                    <label>Unit *</label>
                                    <select
                                        name="unit"
                                        value={item.unit}
                                        onChange={(e) => handleChange(e, index, true)}
                                        required
                                        className="custom-select"
                                    >
                                        <option value="">Select unit</option>
                                        <option value="kg">Kg</option>
                                        <option value="ltr">Ltr</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label>Quantity *</label>
                                    <Input
                                        type="number"
                                        name="itemQuantity"
                                        value={item.itemQuantity}
                                        onChange={(e) => handleChange(e, index, true)}
                                        placeholder="Enter quantity"
                                        required
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label>Price per Item *</label>
                                    <Input
                                        type="number"
                                        name="pricePerItem"
                                        value={item.pricePerItem}
                                        onChange={(e) => handleChange(e, index, true)}
                                        placeholder="Enter price"
                                        required
                                    />
                                </div>
                                <div className="col-md-2 d-flex align-items-end gap-2">
                                    <button type="button" className="btn btn-primary itemBtn" onClick={addNewItem}>
                                        <FaPlus />
                                    </button>
                                    {formData.items.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-danger itemBtn"
                                            onClick={() => removeItem(index)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="col-md-4 supplier_item mt-5">
                        <Button>
                            <LoadingButton title="Update Supplier" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditSupplier;
