import React, { useEffect, useRef, useState } from "react";
import "./addStock.css";
import Button from "../../../../components/ui/Button";
import LoadingButton from "../../../../components/ui/LoadingButton";
import Input from "../../../../components/ui/Input";
import apis from "../../../../utils/apis";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllDatesOfMonth } from "../../../../utils/getDate";
const AddUpdateStock = ({ details, setPopUp,reFetch }) => {
  const [formData, setFormdata] = useState(details);
  const [stock, setStock] = useState([]);
  const {state}=useLocation();
  const navigate=useNavigate();

  useEffect(()=>{
    if(!state||!state?.sectionId)
        return navigate(-1);
  },[state])

  useEffect(()=>{
    if(details&&details?._id){
      setFormdata({...formData,stockId:details?._id?._id,unit:details?.unit})
    }
  },[details])

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await fetch(apis().getAllStock);
        if (!response.ok) throw new Error("Failed to fetch sections");

        const result = await response.json();
        if(result&&result?.stockList&&result?.stockList?.length>0){
        setStock(result?.stockList);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        toast.error(error.message);
      } finally {
      }
    };

    fetchSection();
  }, []);
  const handleChange = (e) => {
    const {name,value}=e.target;
    setFormdata({...formData,[name]:value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(details?._id){
      updateDetails();
    }else{
      addDetails();
    }
  }

  const updateDetails = async () => {
    try {
      console.log(details)
      const response = await fetch(apis().updateStockSection(state?.sectionId,details?._id?._id,details?.date), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setPopUp(false)
        reFetch();
      } else {
        toast.error(result.message || "Failed to add assign stock to section");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while adding section");
    }finally{
     
    }
  };

  const addDetails = async () => {
    try {
      const response = await fetch(apis().addStockToSection(state?.sectionId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setPopUp(false)
        reFetch();
      } else {
        toast.error(result.message || "Failed to add assign stock to section");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while adding section");
    }
    finally{
     
    }
  };

  return (
    <div className="pop">
      <div className="pop-body ">
        <h3 className="text-center mb-4">  Update Stock</h3>
        <form onSubmit={handleSubmit}>
          <div className="row section_container">
            <div className="col-md-12 section_item">
              <label>Select Stock *</label>
              <select
                name="stockId"
                value={formData?.stockId}
                onChange={(e) => handleChange(e)}
                required
                className="custom-select text-capitalize"
              >
                <option value="">Select Stock</option>
                {stock&&stock?.map((val,index)=>( <option className="text-capitalize" key={index} value={val?._id}>{val?.itemName}</option>))}
              </select>
            </div>
            <div className="col-md-12 mt-3 section_item">
              <div className="row">
                <div className="col-md-6">
                  <label>Quantity *</label>
                  <Input
                    type="number"
                    name="qty"
                    value={formData?.qty}
                    onChange={(e) => handleChange(e)}
                    placeholder="Enter Phone"
                    required
                  />
                </div>
                <div className="col-md-6 section_item">
                  <label>Unit *</label>
                  <select
                    name="unit"
                    value={formData?.unit}
                    onChange={(e) => handleChange(e)}
                    required
                    className="custom-select"
                  >
                    <option value="">Select unit</option>
                    <option value="kg">KG</option>
                    <option value="ltr">Ltr</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="d-flex gap-3 mt-5 pt-2">
              <div className="col-md-4 section_item">
                <Button>
                  <LoadingButton title="Update section" />
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setPopUp(false)}
                className="btn btn-secondary ms-auto my-auto py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUpdateStock;
