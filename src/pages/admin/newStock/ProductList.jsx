import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import apis from '../../../utils/apis';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';  // Add Axios for API calls
import './product.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false); // Separate state for update popup
  const [showNotificationPopup, setShowNotificationPopup] = useState(false); // Separate state for notification popup
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(apis().getAllNewStock);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.stockList);
        setFilteredStocks(data.stockList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(apis().getNotifications);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data.notifications);
        const unreadCount = data.notifications.filter((n) => !n.read).length;
        setNotificationCount(unreadCount);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchNotifications();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = products.filter((stock) =>
      stock.itemName.toLowerCase().includes(query)
    );
    setFilteredStocks(filtered);
  };

  const toggleUpdatePopup = () => {
    setShowUpdatePopup(!showUpdatePopup);
  };

  const toggleNotificationPopup = () => {
    setShowNotificationPopup(!showNotificationPopup);
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`${apis().getNotifications}/${notificationId}`);
      if (response.status === 200) {
        // Remove the deleted notification from the state
        setNotifications(notifications.filter((notification) => notification._id !== notificationId));
        setNotificationCount(notificationCount - 1);  // Update notification count
      }
    } catch (err) {
      console.error('Error deleting notification:', err.message);
    }
  };

  const handleShowAllNotifications = () => {
    setShowNotificationPopup(!showNotificationPopup);
  };

  // Handle update stock (quantity change)
  const handleUpdateStock = async () => {
    if (newQuantity && selectedProduct) {
      try {
        const updatedProduct = { ...selectedProduct, qty: newQuantity };
        const response = await axios.put(apis().updateNewStock(selectedProduct._id), updatedProduct);
        if (response.status === 200) {
          setProducts(products.map((product) => product._id === selectedProduct._id ? updatedProduct : product));
          setFilteredStocks(filteredStocks.map((product) => product._id === selectedProduct._id ? updatedProduct : product));
          setShowUpdatePopup(false);  // Close the update popup
        }
      } catch (err) {
        console.error('Error updating stock:', err.message);
      }
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setNewQuantity(product.qty);  // Pre-fill quantity field
    setShowUpdatePopup(true); // Open the update popup
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(apis().deleteNewStock(productId));
      if (response.status === 200) {
        // Remove the deleted product from the state
        setProducts(products.filter((product) => product._id !== productId));
        setFilteredStocks(filteredStocks.filter((product) => product._id !== productId));
      }
    } catch (err) {
      console.error('Error deleting product:', err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <ClipLoader size={30} color="#00BFFF" loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="stock" style={{ padding: '10px' }}>
      <h3 className="stock-header-title">Product List</h3>
      <div className="stock-header-actions mb-3">
        <input
          type="text"
          placeholder="Search product by name"
          className="form-control stock-search"
          onChange={handleSearch}
        />
        <div className="notification-icon" onClick={toggleNotificationPopup}>
          <FaBell size={30} />
          {notificationCount > 0 && (
            <span className="notification-count">{notificationCount}</span>
          )}
        </div>
      </div>
      <hr />
      {filteredStocks?.length === 0 ? (
        <p>No product available</p>
      ) : (
        <div className="row">
          {filteredStocks?.map((product) => (
            <div key={product._id} className="col-md-3 mb-4">
              <div className="card shadow-lg border-0 rounded product-card-">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">
                    {product?.productName &&
                      product.productName.charAt(0).toUpperCase() + product.productName.slice(1)}
                  </h5>
                </div>
                <div className="card-body bg-light">
                  <p className="card-text text-capitalize">
                    <strong>Total Product:</strong> {`${product?.qty} ${product?.unit}`}
                  </p>
                  <button
                    style={{marginRight: '10px'}}
                    className="btn btn-warning btn-sm mr-2"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Popup */}
      {showUpdatePopup && (
        <div className="notification-popup">
          <div className="popup-header">
            <h4>Edit Product Quantity</h4>
            <button onClick={toggleUpdatePopup}>&times;</button>
          </div>
          <div className="popup-body">
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                className="form-control"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
            </div>
            <button className="btn btn-primary mt-2" onClick={handleUpdateStock}>
              Update
            </button>
          </div>
        </div>
      )}

      {/* Notifications Popup */}
      {showNotificationPopup && (
        <div className="notification-popup">
          <div className="popup-header">
            <h4>Notifications</h4>
            <button onClick={toggleNotificationPopup}>&times;</button>
          </div>
          <div className="notification-table-wrapper" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {notifications
                  .slice(0, showNotificationPopup ? notifications.length : 4)
                  .map((notification) => (
                    <tr key={notification._id}>
                      <td>
                        {notification.sectionId?.sectionName || 'No Section'}
                      </td>
                      <td>{notification.productName || 'No Product Name'}</td>
                      <td>{`${notification.qty || 0} ${notification.unit || ''}`}</td>
                      <td>
                        {notification.date ? new Date(notification.date).toLocaleString() : 'No Date'}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteNotification(notification._id)}
                        >
                          Read
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {notifications.length > 4 && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleShowAllNotifications}
              >
                {showNotificationPopup ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
