import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apis from '../../../utils/apis'; // Import your apis.js
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SupplierDetails = () => {
    const { id } = useParams();
    const [supplierData, setSupplierData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSupplierDetails = async () => {
            try {
                setLoading(true); // Ensure loading spinner shows for new requests
                const apiUrl = apis().viewSupplier(id); // Generate API URL for the current ID
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Failed to fetch supplier details');
                const result = await response.json();
                setSupplierData(result.supplier);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSupplierDetails();
    }, [id]);

    const downloadPDF = async () => {
        const element = document.querySelector('.suppier_main');
        const button = element.querySelector('button');
        if (button) button.style.display = 'none'; // Hide the button in the PDF

        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        if (button) button.style.display = ''; // Show the button back in the UI

        const fileName = `${supplierData.supplierName.replace(/\s+/g, '_')}_Details.pdf`;
        pdf.save(fileName);
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <ClipLoader size={30} color="#00BFFF" loading={loading} />
            </div>
        );
    }

    if (!supplierData) {
        return <p>No supplier details available.</p>;
    }

    return (
        <div className="suppier_main">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h2 className="supplier_header">
                <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/admin/supplier')}>Supplier</span> / View Details
            </h2>
            <button onClick={downloadPDF} style={{ marginBottom: '20px' }} className='download_pdf'>
                Download as PDF
            </button>
            </div>
            <div className="row supplier_container">
                <h4>Supplier Details</h4>
                <div className="col-md-6 supplier_item viewBox">
                    <label>Supplier Name:</label>
                    <span>{supplierData.supplierName}</span>
                </div>
                <div className="col-md-6 supplier_item viewBox">
                    <label>Supplier Address:</label>
                    <span>{supplierData.supplierAddress}</span>
                </div>
                <div className="col-md-6 supplier_item viewBox">
                    <label>Email:</label>
                    <span>{supplierData.email}</span>
                </div>
                <div className="col-md-6 supplier_item viewBox">
                    <label>GST:</label>
                    <span>{supplierData.gst}</span>
                </div>
                <div className="col-md-6 supplier_item viewBox">
                    <label>Contact Details:</label>
                    <span>{supplierData.contactDetails}</span>
                </div>

                <h4 style={{ paddingTop: '20px' }}>Items Supplied</h4>
                <div className="table_main">
                    <table className="item-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Unit</th>
                                <th>Quantity</th>
                                <th>Price per Item</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplierData.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.itemName.charAt(0).toUpperCase() + item.itemName.slice(1)}</td>
                                    <td>{item.unit.charAt(0).toUpperCase() + item.unit.slice(1)}</td>
                                    <td>{item.itemQuantity}</td>
                                    <td>₹{item.pricePerItem}</td>
                                    <td>₹{item.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="viewBox total">
                    <label>Total Sum:</label>
                    <span>₹{supplierData.totalSum}</span>
                </div>
            </div>
        </div>
    );
};

export default SupplierDetails;
