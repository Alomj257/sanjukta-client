import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DataTable from '../../../components/dataTable/DataTable';
import './supplier-style.css';
import { FaEye } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import apis from '../../../utils/apis';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import DeleteModal from '../../../components/model/DeleteModal';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const SupplierTable = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);
    const [dateRange, setDateRange] = useState([]);
    const toastShownRef = useRef(false);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const response = await fetch(apis().getAllSuppliers);
            if (!response.ok) throw new Error('Failed to fetch suppliers');

            const result = await response.json();
            console.log("API Response: ", result);

            if (result?.suppliers?.length > 0) {
                const sortedSuppliers = result.suppliers.map(supplier => ({
                    ...supplier,
                    purchaseDate: normalizeDate(supplier.purchaseDate)
                })).sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

                setData(sortedSuppliers);
                setRecords(sortedSuppliers);
            } else {
                console.error("No suppliers data found", result);
                throw new Error("No supplier data found");
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        } finally {
            setLoading(false);
        }
    };

    const normalizeDate = (dateString) => {
        if (!dateString) return null;
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };

    const fetchSuppliersByDateRange = async (fromDate, toDate) => {
        setLoading(true);
        try {
            const url = apis().getSuppliersByDateRange(fromDate, toDate);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch suppliers by date range');

            const result = await response.json();
            console.log("Filtered API Response:", result);

            if (result?.suppliers?.length > 0) {
                setRecords(result.suppliers);
            } else {
                setRecords([]);
                toast.error("No suppliers found for the selected date range.");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (dates, dateStrings) => {
        if (dates && dateStrings[0] && dateStrings[1]) {
            setDateRange(dates);
            fetchSuppliersByDateRange(dateStrings[0], dateStrings[1]);
        } else {
            setDateRange([]);
            fetchSuppliers();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const [day, month, year] = dateString.split('-');
        const formattedDate = new Date(`${year}-${month}-${day}`);
        return formattedDate.toLocaleDateString('en-GB');
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
    
        // Title: Sanjukta (Red color)
        doc.setTextColor(255, 0, 0);
        doc.setFontSize(18);
        doc.text("Sanjukta", 105, 15, null, null, "center");
    
        // Subtitle: Supplier Report
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text("Supplier Report", 105, 25, null, null, "center");
    
        // Date Range
        if (dateRange.length === 2) {
            doc.setFontSize(12);
            doc.text(
                `Date From: ${dateRange[0].format("DD-MM-YYYY")} - To: ${dateRange[1].format("DD-MM-YYYY")}`,
                105,
                35,
                null,
                null,
                "center"
            );
        }
    
        let y = 45; // Initial Y position for content
        records.forEach((supplier, index) => {
            // Supplier Numbering
            doc.setFontSize(12);
            doc.text(`${index + 1}.`, 10, y);
    
            // Supplier Details (Side by Side)
            doc.setFont("helvetica", "bold");
            doc.text(`Name:`, 15, y);
            doc.setFont("helvetica", "normal");
            doc.text(`${supplier.supplierName}`, 35, y);
    
            doc.setFont("helvetica", "bold");
            doc.text(`Contact:`, 85, y);
            doc.setFont("helvetica", "normal");
            doc.text(`${supplier.contactDetails}`, 105, y);
    
            doc.setFont("helvetica", "bold");
            doc.text(`Date:`, 150, y);
            doc.setFont("helvetica", "normal");
            doc.text(`${formatDate(supplier.purchaseDate)}`, 165, y);
    
            y += 7;
    
            // Horizontal Line
            doc.setDrawColor(0);
            doc.line(10, y, 200, y);
    
            y += 5;
    
            // Table Headers (with Borders)
            let startX = 10;
            let rowHeight = 7;
            let colWidths = [10, 70, 40, 35, 35]; // Column widths (No., Item Name, Quantity, Price, Total)
            let startY = y;
    
            doc.setFont("helvetica", "bold");
            doc.rect(startX, startY, colWidths[0], rowHeight); // No.
            doc.text("No.", startX + 3, startY + 5);
    
            doc.rect(startX + colWidths[0], startY, colWidths[1], rowHeight); // Item Name
            doc.text("Item Name", startX + colWidths[0] + 3, startY + 5);
    
            doc.rect(startX + colWidths[0] + colWidths[1], startY, colWidths[2], rowHeight); // Quantity (Combined)
            doc.text("Quantity", startX + colWidths[0] + colWidths[1] + 3, startY + 5);
    
            doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], startY, colWidths[3], rowHeight); // Price
            doc.text("Price/Unit", startX + colWidths[0] + colWidths[1] + colWidths[2] + 3, startY + 5);
    
            doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], startY, colWidths[4], rowHeight); // Total Price
            doc.text("Total", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 3, startY + 5);
    
            y += rowHeight;
    
            // Table Rows for Items
            supplier.items.forEach((item, idx) => {
                doc.setFont("helvetica", "normal");
    
                // Draw table row borders
                doc.rect(startX, y, colWidths[0], rowHeight);
                doc.rect(startX + colWidths[0], y, colWidths[1], rowHeight);
                doc.rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], rowHeight);
                doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], y, colWidths[3], rowHeight);
                doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, colWidths[4], rowHeight);
    
                // Fill row with data
                doc.text(`${idx + 1}`, startX + 3, y + 5);
                doc.text(item.itemName, startX + colWidths[0] + 3, y + 5);
                doc.text(`${item.itemQuantity} ${item.unit}`, startX + colWidths[0] + colWidths[1] + 3, y + 5);
                doc.text(`Rs ${item.pricePerItem}`, startX + colWidths[0] + colWidths[1] + colWidths[2] + 3, y + 5);
                doc.text(`Rs ${item.totalPrice}`, startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 3, y + 5);
    
                y += rowHeight;
            });
    
            y += 10; // Space after each supplier's items
        });
    
        // Save the PDF
        doc.save(`Supplier_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };
    
    const columns = [
        { name: 'Purchase Date', selector: row => formatDate(row.purchaseDate) },
        { name: 'Supplier Name', selector: row => row.supplierName },
        { name: 'Supplier Address', selector: row => row.supplierAddress },
        { name: 'Email', selector: row => row.email },
        { name: 'GST', selector: row => row.gst },
        { name: 'Contact Details', selector: row => row.contactDetails },
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

    const handleView = (row) => navigate(`/admin/supplier/view/${row._id}`);
    const handleEdit = (row) => {
        const formattedRow = {
            ...row,
            purchaseDate: formatForInput(row.purchaseDate), // Ensure valid date
        };

        navigate(`/admin/supplier/edit/${row._id}`, { state: { supplierData: formattedRow } });
    };
    // Function to format date into YYYY-MM-DD
    const formatForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date)) {
            const [day, month, year] = dateString.split('-');
            return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
        }
        return date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
    };
    
    const handleDelete = (supplier) => {
        setSupplierToDelete(supplier);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!supplierToDelete) return;
        try {
            const response = await fetch(apis().deleteSupplier(supplierToDelete._id), { method: 'DELETE' });
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

    return (
        <div className='supplier-container'>
            <h3 className="supplier-header-title">Supplier List</h3>
            <div className='supplier-search'>
                <input type="text" placeholder='Search supplier by name' onChange={(e) => setRecords(data.filter(item => item.supplierName.toLowerCase().includes(e.target.value.toLowerCase())))} />
                <RangePicker format="DD-MM-YYYY" onChange={handleDateRangeChange} className="date-range-picker" style={{height: "42px"}}/>
                {dateRange.length > 0 && <button className='download_pdf' onClick={handleDownloadPDF}>Download Report</button>}
                <button className='supplierBtn' onClick={() => navigate('/admin/supplier/add')}>Add Supplier</button>
            </div>
            {loading ? <div className='loading-spinner'><ClipLoader size={30} color="#00BFFF" loading={loading} /></div> : <DataTable columns={columns} data={records} />}
            {showDeleteModal && <DeleteModal supplierName={supplierToDelete.supplierName} onConfirm={confirmDelete} onCancel={() => setShowDeleteModal(false)} />}
        </div>
    );
};

export default SupplierTable;
