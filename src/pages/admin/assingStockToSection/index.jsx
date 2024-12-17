import React, { useEffect, useState } from "react";
import DistributeStock from "./DistributeStock";
import "./assignStockToSection.css";
import Button from "../../../components/ui/Button";
import LoadingButton from "../../../components/ui/LoadingButton";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import apis from "../../../utils/apis";
const AssignStockToSection = () => {
  const [stocks, setStocks] = useState([{ _id: "", qty: null, unit: "" }]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionData } = location.state || {};
  useEffect(() => {
    if (!sectionData) navigate(-1);
  }, [sectionData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stocks?.length <= 0) {
      return;
    }
    sectionData.date = new Date();
    const updateStocks = stocks.map((val, i) => ({
      ...val,
      date: sectionData.date,
    }));
   sectionData.stocks=updateStocks;

    try {
      const response = await fetch(apis().updateSection(sectionData._id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionData),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success("Stock distributed successfully!");
        navigate("/admin/section");
      } else {
        toast.error(result.message || "Failed to Stock distributed");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while Stock distributed");
    }
  };
  return (
    <div className="">
      <h4 style={{ paddingTop: "20px" }}>Stock Distribute</h4>
      <DistributeStock
        error={error}
        setError={setError}
        stocks={stocks}
        setStocks={setStocks}
      />
      <div
        className="col-md-4 section_item mt-5 mx-auto"
        onClick={handleSubmit}
      >
        <Button>
          <LoadingButton title="Distribute Stock" />
        </Button>
      </div>
    </div>
  );
};

export default AssignStockToSection;
