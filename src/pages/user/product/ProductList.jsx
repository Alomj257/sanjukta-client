import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apis from "../../../utils/apis";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Product = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [sectionName, setSectionName] = useState("");

  useEffect(() => {
    if (!state || !state?.sectionId || !state.date) {
      navigate(-1);  // Go back if state is missing
    }
  }, [state, navigate]);

  useEffect(() => {
    const fetchProductByDate = async () => {
      try {
        const response = await fetch(
          apis().getProductByDate(state.sectionId, state.date)
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const result = await response.json();
        if (result && result?.products && result?.products?.length > 0) {
          setProduct(result?.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(error.message);
      }
    };
    fetchProductByDate();
  }, [state]);
  
  useEffect(() => {
    const fetchProductByDate = async () => {
      try {
        const response = await fetch(
          apis().getProductByDate(state.sectionId, state.date)
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const result = await response.json();
        if (result && result?.products && result?.products?.length > 0) {
          setProduct(result?.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(error.message);
      }
    };

    const fetchSectionName = async () => {
      try {
        const response = await fetch(apis().getSectionById(state.sectionId));
        if (!response.ok) throw new Error("Failed to fetch section name");
        const result = await response.json();
        setSectionName(result?.section?.sectionName || "Unknown Section");
      } catch (error) {
        console.error("Error fetching section name:", error);
        toast.error(error.message);
      }
    };

  
    fetchProductByDate();
    fetchSectionName();
  }, [state]);

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 255); // Blue color for the title
    doc.text("Product sent to new stock report", 10, 10);
  
    // Section and Date
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color for normal text
    doc.text(`Section: ${sectionName}`, 10, 20);
  
    // Format date as DD-MM-YYYY
    const formattedDate = new Date(state.date)
      .toLocaleDateString("en-GB") // Formats as DD/MM/YYYY
      .replace(/\//g, "-"); // Replace slashes with dashes
    doc.text(`Date: ${formattedDate}`, 10, 30);
  
    // Narrow horizontal line
    doc.setLineWidth(0.2); // Narrow line width
    doc.line(10, 35, 200, 35); // Draw line from (10, 35) to (200, 35)
  
    // Table
    const tableColumn = ["Product Name", "Quantity"];
    const tableRows = product.map((item) => [
      item?.productName,
      `${item?.qty} ${item?.unit}`,
    ]);
  
    doc.autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      styles: {
        cellPadding: 3,
        fontSize: 10,
        halign: "left", // Align text to the left
        valign: "middle",
        lineColor: [255, 255, 255], // No border color
        lineWidth: 0, // No border width
        fillColor: [255, 255, 255], // No background color for rows
        textColor: [0, 0, 0], // Black text
      },
      headStyles: {
        fillColor: [255, 255, 255], // No background color for header
        textColor: [0, 0, 0], // Black text
        fontStyle: "normal",
        lineWidth: 0, // No header borders
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // No background color for body rows
        textColor: [0, 0, 0], // Black text
        lineWidth: 0, // No body borders
      },
      tableLineColor: [255, 255, 255], // No border color
      tableLineWidth: 0, // No border width
    });
  
    // Save the PDF
    doc.save(`Product_List_${sectionName}_${formattedDate}.pdf`);
  };
  

  return (
    <>
      <div className="table_main">
        <h4 className="mt-3" style={{ marginLeft: "10px" }}>
          Product List for Section: 
          <br />
          <p className="mt-2" style={{ color: "red" }}>{sectionName}</p>
        </h4>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary mt-2"
          style={{ marginBottom: "1rem", marginLeft: "10px" }}
        >
          Back
        </button>
        <button
          onClick={downloadPDF}
          className="btn btn-primary mt-2"
          style={{ marginBottom: "1rem", marginLeft: "10px" }}
        >
          Download 
        </button>
        {product.length <= 0 ? (
          <div className="text-center">No any stock</div>
        ) : (
          <table className="item-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {product.map((item, index) => (
                <tr key={index}>
                  <td className="text-capitalize">{item?.productName}</td>
                  <td>
                    {new Date(item?.date).toLocaleDateString()}{" "}
                    {new Date(item?.date).toLocaleTimeString()}
                  </td>
                  <td>
                    {item?.qty}
                    {item?.unit}
                  </td>
                  <td>
                    <button
                      className="editBtn Btn"
                      onClick={() =>
                        navigate("/user/section/product/add-update-product", {
                          state: { ...state, product: item }, // **Added**: Pass selected product to the next component for editing
                        })
                      }
                    >
                      <MdEdit /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Product;

const Stock = ({ id }) => {
  const [stockName, setStockName] = useState("");
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(apis().getStockById(id));
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setStockName(data?.stock?.itemName);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStocks();
  }, []);
  return <>{stockName}</>;
};
