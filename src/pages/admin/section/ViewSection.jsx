import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker, Table, Empty, Button } from "antd";
import apis from "../../../utils/apis"; // Import your apis.js
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ViewDistributionStockByDate from "../assingStockToSection/ViewDistributionStockByDate";
import { ClipLoader } from "react-spinners";

const ViewSection = () => {
  const { id } = useParams();
  const [sectionData, setSectionData] = useState(null);
  const [dailyStockReport, setDailyStockReport] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch section details
  useEffect(() => {
    const fetchSectionDetails = async () => {
      setLoading(true);
      try {
        const apiUrl = apis().getSectionById(id);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch section details");

        const result = await response.json();

        if (!result?.section) {
          throw new Error("Section details are missing in the response.");
        }

        const sectionDetails = result.section;

        if (sectionDetails?.userId) {
          const userResponse = await fetch(
            apis().getUserById(sectionDetails.userId)
          );
          if (!userResponse.ok) throw new Error("Failed to fetch user details");

          const userResult = await userResponse.json();

          sectionDetails.userName = userResult?.user?.name || "";
          sectionDetails.userEmail = userResult?.user?.email || "";
        }

        setSectionData(sectionDetails);
      } catch (error) {
        console.error("Error fetching section details:", error);
        toast.error(
          error.message ||
            "Something went wrong while fetching section details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSectionDetails();
  }, [id]);

  // Fetch daily stock report
  const fetchDailyStockReport = async (date) => {
    setReportLoading(true);
    try {
      const apiUrl = apis().getDailyStockReport(id, date);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch daily stock report");

      const result = await response.json();

      if (result?.dailyReport) {
        setDailyStockReport(result.dailyReport);
      } else {
        setDailyStockReport([]);
        toast.error("No stock data found for the selected date.");
      }
    } catch (error) {
      console.error("Error fetching daily stock report:", error);
      toast.error(
        error.message || "Something went wrong while fetching stock report."
      );
    } finally {
      setReportLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    fetchDailyStockReport(formattedDate);
  };

  // Generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Set title color to blue
    doc.setTextColor(0, 0, 255); // RGB for blue
  
    // Title of the report
    doc.setFontSize(16);
    doc.text("Daily Section Report", 14, 15);
  
    // Reset text color to default (black) for other content
    doc.setTextColor(0, 0, 0); // RGB for black
  
    // Format the date as dd-mm-yyyy
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const formattedDate = formatDate(selectedDate);
  
    // Section details
    doc.setFontSize(12);
    doc.text(`Section Name: ${sectionData.sectionName}`, 14, 25);
    doc.text(`Section User: ${sectionData.userName}`, 14, 32);
    doc.text(`Date: ${formattedDate}`, 14, 39);
  
    // Narrow horizontal line after the date
    doc.setLineWidth(0.2); // Narrow line width
    doc.line(14, 42, 200, 42); // Draws a horizontal line
  
    // Table title
    doc.setFontSize(14);
    doc.text("Stock Distributed List", 14, 50);
  
    // Reset font size for the table
    doc.setFontSize(12);
  
    // Prepare the table data (merging Quantity and Unit)
    const tableData = dailyStockReport.map((item) => [
      item.itemName,
      `${item.totalQty} ${item.unit}`, // Merge Quantity and Unit
    ]);
  
    // Add the table
    doc.autoTable({
      head: [["Item Name", "Quantity"]], // Updated column headers
      body: tableData,
      startY: 55, // Start the table below the title
      theme: "plain", // No color for the table
      styles: {
        halign: "left", // Left align text
        fontSize: 12, // Set font size for the table
      },
    });
  
    // Save the PDF
    doc.save("Daily_Stock_Report.pdf");
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <ClipLoader size={30} color="#00BFFF" />
      </div>
    );
  }

  if (!sectionData) {
    return <p>No section details available.</p>;
  }

  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Quantity",
      dataIndex: "totalQty",
      key: "totalQty",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
  ];

  return (
    <div className="suppier_main">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="section_header">
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/admin/section")}
          >
            Section
          </span>{" "}
          / View Details
        </h2>
        <Button type="primary" onClick={downloadPDF} disabled={!dailyStockReport.length}>
          Download Report
        </Button>
      </div>
      <div className="row section_container">
        <h4>Section Details</h4>
        <div className="col-md-6 section_item viewBox">
          <label>Section Name:</label>
          <span>{sectionData.sectionName}</span>
        </div>
        <div className="col-md-6 supplier_item viewBox">
          <label>User Name:</label>
          <span>{sectionData?.userName}</span>
        </div>
        <div className="col-md-6 supplier_item viewBox">
          <label>User Email:</label>
          <span>{sectionData?.userEmail}</span>
        </div>
        <div className="col-md-6 supplier_item viewBox">
          <label>User Phone Number:</label>
          <span>{sectionData?.userPhone}</span>
        </div>
        <div className="col-md-12">
          <h4 className="mt-4">Select Date for daily section report</h4>
          <DatePicker
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            style={{ marginBottom: "20px", marginTop: "10px" }}
          />
        </div>
        <div className="col-md-12">
          {reportLoading ? (
            <div className="loading-spinner">
              <ClipLoader size={30} color="#00BFFF" />
            </div>
          ) : selectedDate && dailyStockReport.length > 0 ? (
            <Table
              columns={columns}
              dataSource={dailyStockReport}
              rowKey={(record) => record.itemName}
              pagination={false}
              title={() => `Stock Report for ${selectedDate}`}
              bordered
            />
          ) : (
            <Empty
              description={
                selectedDate
                  ? "No stock data found for the selected date."
                  : "Please select a date to view the stock report."
              }
            />
          )}
        </div>
        <div className="col-md-12">
        <h4 className="mt-4">Distributin record</h4>
        </div>
      </div>
      <ViewDistributionStockByDate />
    </div>
  );
};

export default ViewSection;
