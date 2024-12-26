import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import Input from "../../../components/ui/Input";
import LoadingButton from "../../../components/ui/LoadingButton";
import Button from "../../../components/ui/Button";
import apis from "../../../utils/apis";

const AddUpdateReturnStock = () => {
  const [stockList, setStockList] = useState([]);
  const { state } = useLocation();
  const [formData, setFormData] = useState({
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

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "qty") {
      const updatedItems = [...formData.stocks];
      updatedItems[index][name] = parseFloat(value) || null;
      setFormData({ ...formData, stocks: updatedItems });
    }
  };

  const removeItem = (index) => {
    const updatedItems = formData.stocks.filter((_, i) => i !== index);
    setFormData({ ...formData, stocks: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = apis().addReturnStock;
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

  return (
    <div className="suppier_main">
      <h4 className="mt-2 mb-3">Return Stocks</h4>
      <button
        type="button"
        className="btn btn-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <form onSubmit={handleSubmit}>
        <div className="row product_container">
          <h4 style={{ paddingTop: "20px", marginBottom: '20px'}}>Select quantity for return from available quantity *</h4>

          {formData.stocks.map((item, index) => (
            <div key={index} className="col-md-12 product_item">
              <div className="row">
                <div className="col-md-4">
                  <label>Selected Stock</label>
                  <select
                    name="_id"
                    value={item._id}
                    disabled
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
                    onChange={(e) => handleChange(e, index)}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div className="col-md-3 product_item">
                  <label>Unit</label>
                  <select
                    name="unit"
                    value={item.unit}
                    disabled
                    className="custom-select"
                  >
                    <option value="">Select unit</option>
                    <option value="kg">Kg</option>
                    <option value="ltr">Ltr</option>
                  </select>
                </div>
                {formData.stocks.length > 1 && (
                  <div className="col-md-1 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-danger itemBtn"
                      onClick={() => removeItem(index)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="col-md-4 product_item mt-5">
            <Button>
              <LoadingButton title="Return Stocks" onClick={handleSubmit} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUpdateReturnStock;
