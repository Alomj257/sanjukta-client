import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import apis from '../../../utils/apis';
import './stock-style.css';
import { useNavigate } from 'react-router-dom';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [updatedTotalStock, setUpdatedTotalStock] = useState('');
  const navigate = useNavigate();

  // Fetch Stocks on Component Mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(apis().getAllStock);
        if (!response.ok) throw new Error('Failed to fetch stocks');
        const data = await response.json();
        setStocks(data.stockList);
        setFilteredStocks(data.stockList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = stocks.filter((stock) =>
      stock.itemName.toLowerCase().includes(query)
    );
    setFilteredStocks(filtered);
  };

  // Open Edit Modal
  const openEditModal = (stock) => {
    setCurrentStock(stock);
    setUpdatedTotalStock(stock.totalStock);
    setEditModal(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setEditModal(false);
    setCurrentStock(null);
  };

  // Handle Edit
  const handleEdit = async () => {
    try {
      const response = await fetch(apis().updateStock(currentStock._id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalStock: updatedTotalStock }),
      });
      if (!response.ok) throw new Error('Failed to update stock');

      // Update stocks state locally
      setStocks((prev) =>
        prev.map((stock) =>
          stock._id === currentStock._id
            ? { ...stock, totalStock: updatedTotalStock }
            : stock
        )
      );
      setFilteredStocks((prev) =>
        prev.map((stock) =>
          stock._id === currentStock._id
            ? { ...stock, totalStock: updatedTotalStock }
            : stock
        )
      );

      closeEditModal();
    } catch (error) {
      console.error('Error updating stock:', error.message);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (stock) => {
    setCurrentStock(stock);
    setDeleteModal(true);
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setCurrentStock(null);
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      const response = await fetch(apis().deleteStock(currentStock._id), { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete stock');

      // Update state without reload
      setStocks((prev) => prev.filter((stock) => stock._id !== currentStock._id));
      setFilteredStocks((prev) => prev.filter((stock) => stock._id !== currentStock._id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting stock:', error.message);
    }
  };

  // Loading Spinner
  if (loading) {
    return (
      <div className="loading-spinner">
        <ClipLoader size={30} color="#00BFFF" loading={loading} />
      </div>
    );
  }

  // Error Message
  if (error) {
    return <div>Error: {error}</div>;
  }

  // JSX Return
  return (
    <div className="stock">
      <h3 className="stock-header-title">Stock List</h3>
      <div className="stock-header-actions mb-3">
        <input
          type="text"
          placeholder="Search stock by name"
          className="form-control stock-search"
          onChange={handleSearch}
        />
        <button className="supplierBtn" onClick={() => navigate('/admin/stock/existing')}>
          Existing Stock
        </button>
      </div>
      <hr />
      {filteredStocks.length === 0 ? (
        <p>No stock available</p>
      ) : (
        <div className="row">
          {filteredStocks.map((stock) => (
            <div key={stock._id} className="col-md-3 mb-4">
              <div className="card shadow-lg border-0 rounded">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">
                    {stock.itemName.charAt(0).toUpperCase() + stock.itemName.slice(1)}
                  </h5>
                </div>
                <div className="card-body bg-light">
                  <p className="card-text">
                    <strong>Total Stock:</strong> {`${stock.totalStock} ${stock.unit}`}
                  </p>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEditModal(stock)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => openDeleteModal(stock)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal - Positioned at the center */}
      {editModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Stock</h5>
                <button className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <label>Total Stock:</label>
                <input
                  type="number"
                  value={updatedTotalStock}
                  onChange={(e) => setUpdatedTotalStock(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEditModal}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleEdit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal - Positioned at the center */}
      {deleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="btn-close" onClick={closeDeleteModal}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this stock: <strong>{currentStock.itemName}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeDeleteModal}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );

};

export default StockList;
