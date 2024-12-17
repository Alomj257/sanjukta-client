import React, { useState, useEffect, useRef } from 'react';
import DataTable from '../../../components/dataTable/DataTable';
import './stock-style.css'; // Custom CSS for the StockTable
import { FaEye } from 'react-icons/fa';
import { MdEdit, MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import apis from '../../../utils/apis';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import DeleteModal from '../../../components/model/DeleteModal';

const StockTable = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [stockToDelete, setStockToDelete] = useState(null);
    const toastShownRef = useRef(false);

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            try {
                const response = await fetch(apis().getAllExistingItems);
                if (!response.ok) throw new Error('Failed to fetch stock data');

                const result = await response.json();
                if (result && result.existingItems && result.existingItems.length > 0) {
                    const sortedStocks = result.existingItems.sort(
                        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                    );
                    setData(sortedStocks);
                    setFilteredData(sortedStocks);

                    if (!toastShownRef.current) {
                        toastShownRef.current = true;
                    }
                } else {
                    throw new Error('No stock data found');
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);

        if (searchValue.trim() === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(
                (stock) =>
                    stock.itemName.toLowerCase().includes(searchValue)
            );
            setFilteredData(filtered);
        }
    };

    const columns = [
        {
            name: 'Item Name',
            selector: (row) => row.itemName,
            sortable: true,
        },
        {
            name: 'Unit',
            selector: (row) => row.unit,
        },
        {
            name: 'Total Stock',
            selector: (row) => row.itemQuantity,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="action-buttons">
                    <button
                        onClick={() => handleView(row)}
                        className="readBtn Btn"
                    >
                        <FaEye />
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="editBtn Btn"
                    >
                        <MdEdit />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="deleteBtn Btn"
                    >
                        <MdDelete />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handleView = (row) => {
        navigate(`/admin/stock/existing/view/${row._id}`);
    };

    const handleEdit = (row) => {
        navigate(`/admin/stock/existing/edit/${row._id}`, { state: { stockData: row } });
    };

    const handleDelete = (stock) => {
        setStockToDelete(stock);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!stockToDelete) return;

        try {
            const deleteUrl = apis().deleteExistingItem(stockToDelete._id); // Use the API delete URL
            const response = await fetch(deleteUrl, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete stock');

            setData(data.filter((item) => item._id !== stockToDelete._id));
            setFilteredData(filteredData.filter((item) => item._id !== stockToDelete._id));
            toast.success('Stock deleted successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleAddStock = () => {
        navigate('/admin/stock/existing/add');
    };

    return (
        <div className="supplier-container">
            <h3 className="supplier-header-title">Existing Stock List</h3>
            <h4 onClick={() => {navigate('/admin/stock')}} style={{color: 'blue', cursor: 'pointer'}}>Go to Stock List</h4>
            
            <div className='supplier-search'>
                <input
                    type="text"
                    placeholder="Search by item name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button onClick={handleAddStock} className="supplierBtn">
                    Add Existing Stock
                </button>
            </div>
            {loading ? (
                <div className='loading-spinner'>
                    <ClipLoader size={30} color="#00BFFF" loading={loading} />
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredData || []}
                    pagination
                    highlightOnHover
                    striped
                />
            )}
            {showDeleteModal && (
                <DeleteModal
                    supplierName={stockToDelete?.itemName}
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default StockTable;
