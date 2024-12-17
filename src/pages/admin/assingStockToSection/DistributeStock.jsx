import React, { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import apis from "../../../utils/apis";
import toast from "react-hot-toast";

const DistributeStock = ({ stocks, setStocks,error,setError }) => {
  const [stockList, setStockList] = useState([]);
  const addStock = () => {
    setStocks([
      ...stocks,
      { id: Date.now(), _id: "", qty: 0, unit: "" },
    ]);
  };

  const handleChange = async (index, e) => {
    const { name, value } = e.target;
  
    if (name === "_id") {
      console.log(name,value)
      // Validate stock quantity when stockId changes
      const isValid = await isValidQuantity(value, stocks[index]?.qty);
      if (!isValid) {
        toast.error("Selected stock does not have enough quantity available.");
        return;
      }
    }
  
    if (name === "qty" && stocks[index]?._id) {
      // Validate quantity input when qty changes
      const isValid = await isValidQuantity(stocks[index]?._id, value);
      if (!isValid) {
        setError(true);
      }else{
        setError(false);
      }
    }
  
    const updatedStocks = stocks.map((stock, idx) =>
      idx === index ? { ...stock, [name]: value } : stock
    );
    setStocks(updatedStocks);
  };
  
  const isValidQuantity = async (stockId, qty) => {
    try {
      const response = await fetch(apis().getStockById(stockId));
      if (!response.ok) throw new Error("Failed to fetch stock details");
  
      const result = await response.json();
      const availableQty = result?.stock?.totalStock || 0;
      // Return false if input qty exceeds available stock qty
      return qty <= availableQty;
    } catch (error) {
      console.error("Error validating stock quantity:", error);
      toast.error(error.message || "An error occurred while validating quantity.");
      return false;
    }
  };
  
  const removeStock = (index) => {
    setStocks(stocks.filter((_, idx) => idx !== index));
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

  
  

  return (
    <div className="container">
      {stocks?.map((item, index) => (
        <div key={item.id} className="col-md-12 supplier_item my-3">
          <div className="row ">
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
            <div className="col-md-4 supplier_item">
              <label>Quantity *</label>
              <Input
                type="number"
                name="qty"
                value={item?.qty}
                onChange={(e) => handleChange(index,e)}
                placeholder="Enter Phone"
                required
              />
              {error&&<small className="text-danger">This much qantity is not available</small>}
            </div>
            <div className="col-md-4 row">
            <div className="col-md-9">
              <label>Unit *</label>
              <select
                name="unit"
                value={item?.unit}
                onChange={(e) => handleChange(index,e)}
                required
                className="custom-select"
              >
                <option value="">Select unit</option>
                <option value="kg">KG</option>
                <option value="ltr">Ltr</option>
              </select>
            </div>

            <div className="col-md-3 d-flex align-items-end gap-2">
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
        </div>
      ))}
    </div>
  );
};

export default DistributeStock;
