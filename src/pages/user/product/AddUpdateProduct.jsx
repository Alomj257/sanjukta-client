import React, { useEffect, useState } from "react";
import "./product.css";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import Input from "../../../components/ui/Input";
import LoadingButton from "../../../components/ui/LoadingButton";
import Button from "../../../components/ui/Button";
import apis from "../../../utils/apis";

const AddUpdateProduct = () => {
  const [productList, setProductList] = useState([{ productName: "", qty: 0, unit: "", price: 0 }]);
  const [stockList, setStockList] = useState([]);
  const [newStockList, setNewStockList] = useState([]);
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    productName: "",
    newProductName: "",
    qty: 0,
    unit: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!state || !state?.sectionId || !state.date) {
      navigate(-1);
    }
  }, [state]);

  useEffect(() => {
    if (state && state.product) {
      setFormData(state.product);
    }
  }, [state]);

  const handleProductChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProducts = [...productList];
    updatedProducts[index][name] = name === "qty" || name === "price" ? parseFloat(value) || 0 : value;
    setProductList(updatedProducts);
  };

  const addNewProduct = () => {
    setProductList([...productList, { productName: "", qty: 0, unit: "", price: 0 }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = productList.filter((_, i) => i !== index);
    setProductList(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = state?.product
        ? apis().updateProduct(state?.product?._id)
        : apis().addProduct;
      const response = await fetch(url, {
        method: state?.product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: productList, // Send the list of products
          sectionId: state?.sectionId,
          date: state.date,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        navigate(-1);
      } else {
        toast.error(result.message || "Failed to add products");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while adding products");
    }
  };

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await fetch(apis().getAllStock);
        if (!response.ok) throw new Error("Failed to fetch sections");

        const result = await response.json();
        if (result && result?.stockList && result?.stockList?.length > 0) {
          setStockList(result?.stockList);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        toast.error(error.message);
      }
    };
    fetchSection();
  }, []);

  return (
    <div className="suppier_main">
      <form onSubmit={handleSubmit}>
        <div className="row product_container">
          <h4>Product Details</h4>
          {productList.map((product, index) => (
            <div key={index} className="col-md-12 product_item">
              <div className="row">
                <div className="col-md-3">
                  <label>Product Name</label>
                  <Input
                    type="text"
                    name="productName"
                    value={product.productName}
                    onChange={(e) => handleProductChange(e, index)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label>Quantity</label>
                  <Input
                    type="number"
                    name="qty"
                    value={product.qty}
                    onChange={(e) => handleProductChange(e, index)}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label>Unit</label>
                  <select
                    name="unit"
                    value={product.unit}
                    onChange={(e) => handleProductChange(e, index)}
                    required
                    className="custom-select"
                  >
                    <option value="">Select unit</option>
                    <option value="kg">Kg</option>
                    <option value="ltr">Ltr</option>
                    <option value="piece">Piece</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label>Price</label>
                  <Input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={(e) => handleProductChange(e, index)}
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end gap-2">
                  <button
                    type="button"
                    className="btn btn-primary itemBtn"
                    onClick={addNewProduct}
                  >
                    <FaPlus />
                  </button>
                  {productList.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger itemBtn"
                      onClick={() => removeProduct(index)}
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="col-md-4 product_item mt-5">
            <Button>
              <LoadingButton title="Add products" onClick={handleSubmit} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUpdateProduct;
