import React, { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import apis from "../../../utils/apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DistributeStock = ({ stocks, setStocks }) => {
  const [stockList, setStockList] = useState([]);
  const [errors, setErrors] = useState({}); // Individual errors for each stock
  const navigate = useNavigate();

  const addStock = () => {
    setStocks([...stocks, { id: Date.now(), _id: "", qty: 0, unit: "" }]);
  };

  const handleChange = async (index, e) => {
    const { name, value } = e.target;

    if (name === "_id") {
      const selectedStock = stockList.find((stock) => stock._id === value);

      if (!value) {
        // Reset unit to "Select stock" when no stock is selected
        const updatedStocks = stocks.map((stock, idx) =>
          idx === index ? { ...stock, _id: "", unit: "" } : stock
        );
        setStocks(updatedStocks);
        return;
      }

      if (!selectedStock) return;

      const updatedStocks = stocks.map((stock, idx) =>
        idx === index
          ? { ...stock, _id: value, unit: selectedStock.unit }
          : stock
      );
      setStocks(updatedStocks);
    }

    if (name === "qty" && stocks[index]?._id) {
      const isValid = await isValidQuantity(stocks[index]?._id, value);
      const updatedErrors = { ...errors, [index]: !isValid };
      setErrors(updatedErrors);

      const updatedStocks = stocks.map((stock, idx) =>
        idx === index ? { ...stock, qty: value } : stock
      );
      setStocks(updatedStocks);
    }
  };

  const isValidQuantity = async (stockId, qty) => {
    try {
      const response = await fetch(apis().getStockById(stockId));
      if (!response.ok) throw new Error("Failed to fetch stock details");

      const result = await response.json();
      const availableQty = result?.stock?.totalStock || 0;

      if (qty > availableQty) {
        toast.error(`Only ${availableQty} units are available.`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error validating stock quantity:", error);
      toast.error(error.message || "An error occurred while validating quantity.");
      return false;
    }
  };

  const removeStock = (index) => {
    setStocks(stocks.filter((_, idx) => idx !== index));
    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
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
    <div className="" style={{ padding: "10px" }}>
      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)} // Navigate back to the previous page
      >
        Back
      </button>
      {stocks?.map((item, index) => (
        <div key={item.id} className="col-md-12 supplier_item">
          <div className="row align-items-center">
            <div className="col-md-4">
              <label>Select Stock *</label>
              <select
                name="_id"
                value={item?._id}
                onChange={(e) => handleChange(index, e)}
                required
                className="custom-select text-capitalize"
              >
                <option value="">Select Stock</option>
                {stockList &&
                  stockList.map((val, idx) => (
                    <option
                      className="text-capitalize"
                      key={idx}
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
                value={item?.qty}
                onChange={(e) => handleChange(index, e)}
                placeholder="Enter Quantity"
                required
              />
              {errors[index] && (
                <small className="text-danger">
                  This much quantity is not available
                </small>
              )}
            </div>
            <div className="col-md-2">
              <label>Unit *</label>
              <p
                className="form-control text-capitalize text-center mt-3"
                style={{ height: "45px", lineHeight: "30px" }} // Adjust height for better visibility
              >
                {item?.unit || "Select stock"}
              </p>
            </div>
            <div className="col-md-2 d-flex gap-2 align-items-center mt-4">
              <button
                type="button"
                className="btn btn-primary itemBtn"
                onClick={addStock}
              >
                <FaPlus />
              </button>
              {stocks?.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger itemBtn"
                  onClick={() => removeStock(index)}
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DistributeStock;
