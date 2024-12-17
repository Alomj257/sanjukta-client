import React, { useEffect, useState } from "react";
import "./section-style.css";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import apis from "../../../utils/apis";
import toast from "react-hot-toast";
import LoadingButton from "../../../components/ui/LoadingButton";
import DistributeStock from "../assingStockToSection/DistributeStock";

const AddSection = () => {
  const [formData, setFormData] = useState({});
  const [user, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apis().addSections, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        navigate("/admin/section");
      } else {
        toast.error(result.message || "Failed to add section");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while adding section");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(apis().getAllUsers);
        if (!response.ok) throw new Error("Failed to fetch users");
        const result = await response.json();
        if (result && result.users && result.users.length > 0) {
          setUsers(result?.users);
        } else {
          throw new Error("No Section data found");
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="suppier_main">
      <h2 className="section_header">
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/admin/section")}
        >
          Section
        </span>
        / Add
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="row section_container">
          <h4>Section Details</h4>
          <div className="col-md-6 section_item">
            <label>Section Name *</label>
            <Input
              type="text"
              name="sectionName"
              value={formData?.sectionName}
              onChange={(e) => handleChange(e)}
              placeholder="Enter section name"
              required
            />
          </div>

          {/* <h4 style={{ paddingTop: "20px" }}>Assign Details</h4> */}
          <div className="col-md-12 section_item">
            <div className="row">
              <div className="col-md-6 section_item">
                <label>Select User *</label>
                <select
                  name="userId"
                  value={formData?.userId}
                  onChange={(e) => handleChange(e)}
                  required
                  className="custom-select"
                >
                  <option value="">Select user</option>
                  {user?.map((val, index) => (
                    <option key={index} value={val?._id}>
                      {val?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label>Phone Number *</label>
                <Input
                  type="tel"
                  name="userPhone"
                  value={formData?.userPhone}
                  onChange={(e) => handleChange(e)}
                  placeholder="Enter Phone"
                  required
                />
              </div>
            </div>
          </div>
         
          <div className="col-md-4 section_item mt-5" onClick={handleSubmit}>
            <Button  >
              <LoadingButton title="Add section" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSection;
