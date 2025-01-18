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
  const [stockList, setStockList] = useState([]);
  const [newStockList, setNewStockList] = useState([]);
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    productName: "",
    newProductName: "",
    qty: 0,
    unit: "",
    price: "",
    stocks: [
      {
        _id: "",
        unit: "",
        qty: null,
      },
    ],
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

  useEffect(() => {
    if (state && state.stocks) {
      setFormData((prev) => ({ ...prev, stocks: state.stocks }));
    }
  }, [state]);

  useEffect(() => {
    if (formData.productName && newStockList.length > 0) {
      const selectedProduct = newStockList.find(
        (product) => product.productName === formData.productName
      );
      if (selectedProduct) {
        setFormData((prev) => ({
          ...prev,
          unit: selectedProduct.unit || "",
        }));
      }
    }
  }, [formData.productName, newStockList]);

  const handleChange = (e, index, isItemField = false) => {
    const { name, value } = e.target;
    if (isItemField) {
      const updatedItems = [...formData.stocks];
      updatedItems[index][name] =
        name === "qty" || name === "pricePerItem"
          ? parseFloat(value) || null
          : value;
      setFormData({ ...formData, stocks: updatedItems });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addNewItem = () => {
    setFormData({
      ...formData,
      stocks: [...formData.stocks, { _id: "", unit: "", qty: null }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = formData.stocks.filter((_, i) => i !== index);
    setFormData({ ...formData, stocks: updatedItems });
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
          ...formData,
          sectionId: state?.sectionId,
          date: state.date,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        navigate(-1);
      } else {
        toast.error(result.message || "Failed to add supplier");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while adding supplier");
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

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await fetch(apis().getAllNewStock);
        if (!response.ok) throw new Error("Failed to fetch sections");

        const result = await response.json();
        if (result && result?.stockList && result?.stockList?.length > 0) {
          setNewStockList(result?.stockList);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        toast.error(error.message);
      }
    };
    fetchSection();
  }, []);

  return (
    <div className="supplier_main">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary mt-2"
        style={{ marginBottom: "1rem", marginLeft: "10px" }}
      >
        Back
      </button>
      <form onSubmit={handleSubmit}>
        <div className="row product_container">
          <h4>Product Details</h4>
          <div
            className={`col-md-${
              formData.productName === "other" ? "2" : "6"
            }`}
          >
            <label>Select Product</label>
            <select
              name="productName"
              value={formData.productName}
              onChange={(e) => handleChange(e)}
              required
              className="custom-select"
            >
              <option value="">Select Product Name</option>
              {newStockList &&
                newStockList?.map((val, index) => (
                  <option
                    className="text-capitalize"
                    key={index}
                    value={val?.productName}
                  >
                    {val?.productName}
                  </option>
                ))}
              <option value="other">Other</option>
            </select>
          </div>

          {formData?.productName === "other" && (
            <div className="col-md-3 product_item">
              <label>Product Name *</label>
              <Input
                type="text"
                name="newProductName"
                value={formData.newProductName}
                onChange={(e) => handleChange(e)}
                placeholder="Enter product name"
                required
              />
            </div>
          )}
          <div className="col-md-3 product_item">
            <label>Quantity *</label>
            <Input
              type="text"
              name="qty"
              value={formData.qty}
              onChange={(e) => handleChange(e)}
              placeholder="Enter product quantity"
              required
            />
          </div>
          <div className="col-md-3 product_item">
            <label>Unit *</label>
            {formData.productName === "other" ? (
              <select
                name="unit"
                value={formData.unit}
                onChange={(e) => handleChange(e)}
                required
                className="custom-select"
              >
                <option value="">Select unit</option>
                <option value="kg">Kg</option>
                <option value="ltr">Ltr</option>
                <option value="piece">Piece</option>
              </select>
            ) : (
              <Input
                type="text"
                name="unit"
                value={formData.unit}
                disabled
                placeholder="Unit will be auto-filled"
              />
            )}
          </div>
          {formData?.productName === "other" && (
            <div className="col-md-6 product_item">
              <label>Product Rate per unit *</label>
              <Input
                type="text"
                name="price"
                value={formData.price}
                onChange={(e) => handleChange(e)}
                placeholder="Enter product price"
                required
              />
            </div>
          )}
          <div className="col-md-3 product_item mt-4">
            <Button>
              <LoadingButton
                title={state?.product ? "Update product" : "Add product"}
                onClick={handleSubmit}
              />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUpdateProduct;
