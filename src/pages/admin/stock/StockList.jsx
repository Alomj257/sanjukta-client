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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(apis().getAllStock);
        if (!response.ok) {
          throw new Error('Failed to fetch stocks');
        }
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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = stocks.filter((stock) =>
      stock.itemName.toLowerCase().includes(query)
    );
    setFilteredStocks(filtered);
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
    <div className="container stock">
      <h3 className="stock-header-title">Stock List</h3>
      <div className="stock-header-actions mb-3">
        <input
          type="text"
          placeholder="Search stock by name"
          className="form-control stock-search"
          onChange={handleSearch}
        />
        <button
          className="supplierBtn"
          onClick={() => navigate('/admin/stock/existing')}
        >
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockList;
