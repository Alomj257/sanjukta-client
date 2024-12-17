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
      setFormData((pre) => ({ ...pre, stocks: state.stocks }));
    }
  }, [state]);

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
      } finally {
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
      } finally {
      }
    };
    fetchSection();
  }, []);

  return (
    <div className="suppier_main">
      <form onSubmit={handleSubmit}>
        <div className="row product_container">
          <h4>Product Details</h4>
          <div
            className={`col-md-${formData.productName === "other" ? "2" : "6"}`}
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
          <h4 style={{ paddingTop: "20px" }}>Stocks</h4>

          {formData.stocks.map((item, index) => (
            <div key={index} className="col-md-12 product_item">
              <div className="row">
                <div className="col-md-4">
                  <label>Select Stocks</label>
                  <select
                    name="_id"
                    value={item._id}
                    onChange={(e) => handleChange(e, index, true)}
                    required
                    className="custom-select"
                  >
                    <option value="">Select Stock</option>
                    {stockList &&
                      stockList?.map((val, index) => (
                        <option
                          className="text-capitalize"
                          key={index}
                          value={val?._id}
                        >
                          {val?.itemName}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label>Quantity *</label>
                  <Input
                    type="number"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => handleChange(e, index, true)}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div className="col-md-3 product_item">
                  <label>Unit *</label>
                  <select
                    name="unit"
                    value={item.unit}
                    onChange={(e) => handleChange(e, index, true)}
                    required
                    className="custom-select"
                  >
                    <option value="">Select unit</option>
                    <option value="kg">Kg</option>
                    <option value="ltr">Ltr</option>
                  </select>
                </div>
                <div className="col-md-1 d-flex align-items-end gap-2">
                  <button
                    type="button"
                    className="btn btn-primary itemBtn"
                    onClick={addNewItem}
                  >
                    <FaPlus />
                  </button>
                  {formData.stocks.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger itemBtn"
                      onClick={() => removeItem(index)}
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
              <LoadingButton title="Add product" onClick={handleSubmit} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUpdateProduct;
