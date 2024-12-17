import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import apis from '../../../utils/apis';
import "./product.css"

const ProductList = () => {
  const [products, setProduct] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(apis().getAllNewStock);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProduct(data.stockList);
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
    const filtered = products.filter((stock) =>
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
      <h3 className="stock-header-title">Product List</h3>
      <div className="stock-header-actions mb-3">
        <input
          type="text"
          placeholder="Search product by name"
          className="form-control stock-search"
          onChange={handleSearch}
        />
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
                    {product&&product?.productName&&product.productName.charAt(0).toUpperCase() + product.productName.slice(1)}
                  </h5>
                </div>
                <div className="card-body bg-light">
                  <p className="card-text text-capitalize">
                    <strong>Total Product:</strong> {`${product?.qty} ${product?.unit}`}
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

export default ProductList;
