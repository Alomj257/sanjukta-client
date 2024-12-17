import React, { useState, useEffect, useRef } from 'react';
import DataTable from '../../../components/dataTable/DataTable';
import './supplier-style.css';
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import apis from '../../../utils/apis';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import DeleteModal from '../../../components/model/DeleteModal';

const SupplierTable = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);
    const toastShownRef = useRef(false);

    useEffect(() => {
    const fetchSuppliers = async () => {
        setLoading(true); // Set loading to true before starting the fetch
        try {
            const response = await fetch(apis().getAllSuppliers);
            if (!response.ok) throw new Error('Failed to fetch suppliers');

            const result = await response.json();
            console.log("API Response: ", result);  // Log the entire response for debugging
            
            // Ensure the 'createdAt' field exists and is valid for sorting
            if (result && result.suppliers && result.suppliers.length > 0) {
                const sortedSuppliers = result.suppliers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setData(sortedSuppliers);
                setRecords(sortedSuppliers);

                if (!toastShownRef.current) {
                    toastShownRef.current = true;
                }
            } else {
                console.error("No suppliers data found", result);  // Log if no data is found
                throw new Error("No supplier data found");
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            toast.error(error.message);
        } finally {
            setLoading(false); // Set loading to false after the fetch
        }
    };

    fetchSuppliers();
}, []);


    const columns = [
        {
            name: 'Supplier Name',
            selector: row => row.supplierName,
        },
        {
            name: 'Supplier Address',
            selector: row => row.supplierAddress,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'GST',
            selector: row => row.gst,
        },
        {
            name: 'Contact Details',
            selector: row => row.contactDetails,
        },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <button onClick={() => handleView(row)} className='readBtn Btn'><FaEye /></button>
                    <button onClick={() => handleEdit(row)} className='editBtn Btn'><MdEdit /></button>
                    <button onClick={() => handleDelete(row)} className='deleteBtn Btn'><MdDelete /></button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handleView = (row) => {
        navigate(`/admin/supplier/view/${row._id}`);
    };
    
    const handleEdit = (row) => {
        navigate(`/admin/supplier/edit/${row._id}`, { state: { supplierData: row } });
    };

    const handleDelete = (supplier) => {
        setSupplierToDelete(supplier);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!supplierToDelete) return;

        try {
            const deleteUrl = apis().deleteSupplier(supplierToDelete._id);
            const response = await fetch(deleteUrl, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete supplier');
            setData(data.filter(item => item._id !== supplierToDelete._id));
            setRecords(records.filter(item => item._id !== supplierToDelete._id));
            toast.success('Supplier deleted successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setShowDeleteModal(false);
            setSupplierToDelete(null);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        const newRecords = data.filter(item => item.supplierName.toLowerCase().includes(query.toLowerCase()));
        setRecords(newRecords);
    };

    const handleAddSupplierClick = () => {
        navigate('/admin/supplier/add');
    };

    return (
        <div className='supplier-container'>
            <h3 className="supplier-header-title">Supplier List</h3>
            <div className='supplier-search'>
                <input type="text" placeholder='Search supplier by name' onChange={handleSearch} />
                <button className='supplierBtn' onClick={handleAddSupplierClick}>Add Supplier</button>
            </div>

            {loading ? (
                <div className='loading-spinner'>
                    <ClipLoader size={30} color="#00BFFF" loading={loading} />
                </div>
            ) : (

                    <DataTable columns={columns} data={records} />
                ) 
            }

            {showDeleteModal && (
                <DeleteModal
                    supplierName={supplierToDelete.supplierName}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default SupplierTable;
