// import React, { useState } from 'react';
// import './supplier-style.css';
// import Input from '../../../components/ui/Input';
// import Button from '../../../components/ui/Button';
// import { useNavigate } from 'react-router-dom';
// import apis from '../../../utils/apis';
// import toast from 'react-hot-toast';
// import LoadingButton from '../../../components/ui/LoadingButton';
// import { FaPlus, FaTrashAlt } from 'react-icons/fa';

// const AddSupplier = () => {
//     const [formData, setFormData] = useState({
//         supplierName: '',
//         supplierAddress: '---',
//         email: '---',
//         gst: '---',
//         contactDetails: '',
//         items: [
//             {
//                 itemName: '',
//                 unit: '',
//                 itemQuantity: null,
//                 pricePerItem: null,
//             },
//         ],
//     });

//     const navigate = useNavigate();

//     const handleChange = (e, index, isItemField = false) => {
//         const { name, value } = e.target;
//         if (isItemField) {
//             const updatedItems = [...formData.items];
//             updatedItems[index][name] = name === 'itemQuantity' || name === 'pricePerItem' ? (parseFloat(value) || null) : value;
//             setFormData({ ...formData, items: updatedItems });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };
    

//     const addNewItem = () => {
//         setFormData({
//             ...formData,
//             items: [
//                 ...formData.items,
//                 { itemName: '', unit: '', itemQuantity: null, pricePerItem: null },
//             ],
//         });
//     };

//     const removeItem = (index) => {
//         const updatedItems = formData.items.filter((_, i) => i !== index);
//         setFormData({ ...formData, items: updatedItems });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(apis().addSupplier, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//             });

//             const result = await response.json();
//             if (response.ok) {
//                 toast.success(result.message);
//                 navigate('/admin/supplier');
//             } else {
//                 toast.error(result.message || 'Failed to add supplier');
//             }
//         } catch (error) {
//             toast.error(error.message || 'An error occurred while adding supplier');
//         }
//     };

//     return (
//         <div className='suppier_main'>
//             <h2 className='supplier_header'>
//                 <span
//                     style={{ color: 'blue', cursor: 'pointer' }}
//                     onClick={() => navigate('/admin/supplier')}
//                 >
//                     Supplier
//                 </span>
//                 / Add
//             </h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="row supplier_container">
//                     <h4>Supplier Details</h4>
//                     <div className="col-md-6 supplier_item">
//                         <label>Supplier Name *</label>
//                         <Input
//                             type="text"
//                             name="supplierName"
//                             value={formData.supplierName}
//                             onChange={(e) => handleChange(e)}
//                             placeholder="Enter supplier name"
//                             required
//                         />
//                     </div>

//                     <div className="col-md-6 supplier_item">
//                         <label>Supplier Address</label>
//                         <Input
//                             type="text"
//                             name="supplierAddress"
//                             value={formData.supplierAddress}
//                             onChange={(e) => handleChange(e)}
//                             placeholder="Enter supplier address"
//                         />
//                     </div>

//                     <div className="col-md-6 supplier_item">
//                         <label>Email</label>
//                         <Input
//                             type="text"
//                             name="email"
//                             value={formData.email}
//                             onChange={(e) => handleChange(e)}
//                             placeholder="Enter email"
//                         />
//                     </div>

//                     <div className="col-md-6 supplier_item">
//                         <label>GST</label>
//                         <Input
//                             type="text"
//                             name="gst"
//                             value={formData.gst}
//                             onChange={(e) => handleChange(e)}
//                             placeholder="Enter GST number"
//                         />
//                     </div>

//                     <div className="col-md-6 supplier_item">
//                         <label>Contact Details *</label>
//                         <Input
//                             type="text"
//                             name="contactDetails"
//                             value={formData.contactDetails}
//                             onChange={(e) => handleChange(e)}
//                             placeholder="Enter contact number"
//                             required
//                         />
//                     </div>

//                     <h4 style={{ paddingTop: '20px' }}>Items Details</h4>

//                     {formData.items.map((item, index) => (
//                         <div key={index} className="col-md-12 supplier_item">
//                             <div className="row">
//                                 <div className="col-md-3">
//                                     <label>Item Name *</label>
//                                     <Input
//                                         type="text"
//                                         name="itemName"
//                                         value={item.itemName}
//                                         onChange={(e) => handleChange(e, index, true)}
//                                         placeholder="Enter item name"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-3 supplier_item">
//                                     <label>Unit *</label>
//                                     <select
//                                         name="unit"
//                                         value={item.unit}
//                                         onChange={(e) => handleChange(e, index, true)}
//                                         required
//                                         className="custom-select"
//                                     >
//                                         <option value="">Select unit</option>
//                                         <option value="kg">Kg</option>
//                                         <option value="ltr">Ltr</option>
//                                         <option value="box">Box</option>
//                                         <option value="piece">Piece</option>
//                                     </select>
//                                 </div>
//                                 <div className="col-md-2">
//                                     <label>Quantity *</label>
//                                     <Input
//                                         type="number"
//                                         name="itemQuantity"
//                                         value={item.itemQuantity}
//                                         onChange={(e) => handleChange(e, index, true)}
//                                         placeholder="Enter quantity"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-2">
//                                     <label>Price per Item *</label>
//                                     <Input
//                                         type="number"
//                                         name="pricePerItem"
//                                         value={item.pricePerItem}
//                                         onChange={(e) => handleChange(e, index, true)}
//                                         placeholder="Enter price"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-2 d-flex align-items-end gap-2">
//                                     <button type="button" className="btn btn-primary itemBtn" onClick={addNewItem}>
//                                         <FaPlus />
//                                     </button>
//                                     {formData.items.length > 1 && (
//                                         <button
//                                             type="button"
//                                             className="btn btn-danger itemBtn"
//                                             onClick={() => removeItem(index)}
//                                         >
//                                             <FaTrashAlt />
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}

//                     <div className="col-md-4 supplier_item mt-5">
//                         <Button>
//                             <LoadingButton title="Add Supplier" onClick={handleSubmit} />
//                         </Button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddSupplier;



import React, { useState } from 'react';
import './supplier-style.css';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import apis from '../../../utils/apis';
import toast from 'react-hot-toast';
import LoadingButton from '../../../components/ui/LoadingButton';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const AddSupplier = () => {
    const [formData, setFormData] = useState({
        supplierName: '',
        supplierAddress: '---',
        email: '---',
        gst: '---',
        contactDetails: '',
        purchaseDate: null, // Added purchaseDate
        items: [
            {
                itemName: '',
                unit: '',
                itemQuantity: null,
                pricePerItem: null,
            },
        ],
    });

    const navigate = useNavigate();

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

    const handleDateChange = (date, dateString) => {
        setFormData({ ...formData, purchaseDate: dateString });
    };

    const addNewItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                { itemName: '', unit: '', itemQuantity: null, pricePerItem: null },
            ],
        });
    };

    const removeItem = (index) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: updatedItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apis().addSupplier, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                navigate('/admin/supplier');
            } else {
                toast.error(result.message || 'Failed to add supplier');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while adding supplier');
        }
    };

    return (
        <div className='suppier_main'>
            <h2 className='supplier_header'>
                <span
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => navigate('/admin/supplier')}
                >
                    Supplier
                </span>
                / Add
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
                        <label>Supplier Address</label>
                        <Input
                            type="text"
                            name="supplierAddress"
                            value={formData.supplierAddress}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter supplier address"
                        />
                    </div>

                    <div className="col-md-6 supplier_item">
                        <label>Email</label>
                        <Input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="col-md-6 supplier_item">
                        <label>GST</label>
                        <Input
                            type="text"
                            name="gst"
                            value={formData.gst}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter GST number"
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

                    <div className="col-md-6 supplier_item">
                        <label>Purchase Date *</label>
                        <DatePicker
                            format="DD-MM-YYYY"
                            value={formData.purchaseDate ? dayjs(formData.purchaseDate, "DD-MM-YYYY") : null}
                            onChange={handleDateChange}
                            className="ant-picker"
                            style={{ height: '44px', fontSize: '16px' }}
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
                                    <Input
                                        type="text"
                                        name="unit"
                                        value={item.unit}
                                        onChange={(e) => handleChange(e, index, true)}
                                        placeholder="Enter unit (e.g. kg, ltr)"
                                        required
                                    />
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
                            <LoadingButton title="Add Supplier" onClick={handleSubmit} />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddSupplier;
