import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apis from '../../../utils/apis'; // Import your apis.js
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ViewStock = () => {
    const { id } = useParams();
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStockDetails = async () => {
            try {
                setLoading(true);
                const apiUrl = apis().getExistingItemById(id); 
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Failed to fetch stock details');
                const result = await response.json();
                setStockData(result.existingItem); 
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStockDetails();
    }, [id]);

    const downloadPDF = async () => {
        const element = document.querySelector('.stock_main');
        const button = element.querySelector('button');
        if (button) button.style.display = 'none';

        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        if (button) button.style.display = ''; // Show the button back in the UI

        const fileName = `Stock_${id}_Details.pdf`;
        pdf.save(fileName);
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <ClipLoader size={30} color="#00BFFF" loading={loading} />
            </div>
        );
    }

    if (!stockData) {
        return <p>No stock details available.</p>;
    }

    return (
        <div className="suppier_main">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2 className="supplier_header">
                    <span
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={() => navigate('/admin/stock/existing')}
                    >
                        Existing Stock List
                    </span>{' '}
                    / View Details
                </h2>
                <button onClick={downloadPDF} style={{ marginBottom: '20px' }} className="download_pdf">
                    Download as PDF
                </button>
            </div>
            <div className="row supplier_container">
                <h4>Stock Details</h4>
                <div className="col-md-6 supplier_item viewBox">
                    <label>Item Name:</label>
                    <span>{stockData.itemName.charAt(0).toUpperCase() + stockData.itemName.slice(1)}</span>
                </div>
                <div className="col-md-6 supplier_item viewBox">
                    <label>Unit:</label>
                    <span>{stockData.unit.charAt(0).toUpperCase() + stockData.unit.slice(1)}</span>
                </div>
                <div className="col-md-6 supplier_item viewBox">
                    <label>Quantity:</label>
                    <span>{stockData.itemQuantity}</span>
                </div>
                <div className="col-md-6 supplier_item viewBox">
                    <label>Price per Item:</label>
                    <span>₹{stockData.pricePerItem.toFixed(2)}</span>
                </div>
                <div className="col-md-6 supplier_item viewBox">
                    <label>Total Price:</label>
                    <span>₹{stockData.totalPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default ViewStock;
