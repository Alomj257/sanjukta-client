import React, { useState, useEffect } from "react";
import "./section-style.css";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import LoadingButton from "../../../components/ui/LoadingButton";
import { useLocation, useNavigate } from "react-router-dom";
import apis from "../../../utils/apis";
import toast from "react-hot-toast";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const EditSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionData } = location.state || {};
  const [user, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    sectionName: "",
    sectionAddress: "",
    email: "",
    gst: "",
    contactDetails: "",
    items: [
      {
        itemName: "",
        unit: "",
        itemQuantity: null,
        pricePerItem: null,
      },
    ],
  });

  // Set form data if sectionData is available
  useEffect(() => {
    if (sectionData) {
      setFormData({
        ...sectionData,
        items: sectionData.items || [
          { itemName: "", unit: "", itemQuantity: null, pricePerItem: null },
        ],
      });
    }
  }, [sectionData]);

  // Handle form data changes
  const handleChange = (e, index, isItemField = false) => {
    const { name, value } = e.target;
    if (isItemField) {
      const updatedItems = [...formData.items];
      updatedItems[index][name] =
        name === "itemQuantity" || name === "pricePerItem"
          ? parseFloat(value) || null
          : value;
      setFormData({ ...formData, items: updatedItems });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add a new item field
  const addNewItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { itemName: "", unit: "", itemQuantity: null, pricePerItem: null },
      ],
    });
  };

  // Remove an item field
  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apis().updateSection(sectionData._id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success("section updated successfully!");
        navigate("/admin/section");
      } else {
        toast.error(result.message || "Failed to update section");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while updating section");
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(apis().getAllUsers);
        if (!response.ok) throw new Error("Failed to fetch users");
        const result = await response.json();
        if (result && result.users && result.users.length > 0) {
          setUsers(result?.users);
        } else {
          console.error("No suppliers data found", result);
          throw new Error("No Section data found");
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error(error.message);
      } finally {
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (user?.length > 0 && !formData?.userId) {
      setFormData((prevData) => ({
        ...prevData,
        userId: user[0]._id,
      }));
    }
  }, [user]);

  return (
    <div className="suppier_main">
      <h2 className="section_header">
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/admin/section")}
        >
          Section
        </span>{" "}
        / Edit
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="row section_container">
          <h4>Section Details</h4>
          <div className="col-md-6 section_item">
            <label>Section Name *</label>
            <Input
              type="text"
              name="sectionName"
              value={formData.sectionName}
              onChange={(e) => handleChange(e)}
              placeholder="Enter section name"
              required
            />
          </div>
        </div>
        <div className="row mt-4">
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

          <div className="col-md-6 section_item">
            <label>User Phone Number *</label>
            <Input
              type="phone"
              name="userPhone"
              value={formData.userPhone}
              onChange={(e) => handleChange(e)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="col-md-4 section_item mt-5">
            <Button>
              <LoadingButton title="Update section" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditSection;
