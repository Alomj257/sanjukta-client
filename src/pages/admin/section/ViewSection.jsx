import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker, Table, Empty, Button, Row, Col } from "antd";
import apis from "../../../utils/apis"; // Import your apis.js
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { ClipLoader } from "react-spinners";
import ViewDistributionStockByDate from "../assingStockToSection/ViewDistributionStockByDate";

const ViewSection = () => {
  const { id } = useParams();
  const [sectionData, setSectionData] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedYearMonth, setSelectedYearMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [isMonthlyReport, setIsMonthlyReport] = useState(false); // To toggle between daily and monthly reports
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
        setReportData(result.dailyReport);
        setIsMonthlyReport(false); // Set to daily report
      } else {
        setReportData([]);
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

  // Fetch monthly stock report based on selected year and month
  const fetchMonthlyStockReport = async (yearMonth) => {
    setReportLoading(true);
    try {
      const apiUrl = apis().getMonthlyStockReport(id, yearMonth);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch monthly stock report");

      const result = await response.json();

      if (result?.monthlyReport) {
        setReportData(result.monthlyReport);
        setIsMonthlyReport(true); // Set to monthly report
      } else {
        setReportData([]);
        toast.error("No stock data found for the selected month.");
      }
    } catch (error) {
      console.error("Error fetching monthly stock report:", error);
      toast.error(
        error.message || "Something went wrong while fetching stock report."
      );
    } finally {
      setReportLoading(false);
    }
  };

  // Handle date change for daily report
  const handleDateChange = (date) => {
    if (!date) {
      setSelectedDate(null);
      setReportData([]); // Clear data if date is deselected
    } else {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
      fetchDailyStockReport(formattedDate);
    }
  };

  // Handle year/month change for monthly report
  const handleMonthChange = (date) => {
    if (!date) {
      setSelectedYearMonth(null);
      setReportData([]); // Clear data if month is deselected
    } else {
      const yearMonth = dayjs(date).format("YYYY-MM");
      setSelectedYearMonth(yearMonth);
      fetchMonthlyStockReport(yearMonth);
    }
  };

  // Generate PDF based on selected report type (daily or monthly)
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setTextColor(0, 0, 255);
    doc.setFontSize(16);
    doc.text(`${isMonthlyReport ? "Monthly" : "Daily"} Section Report`, 14, 15);

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(12);
    doc.text(`Section Name: ${sectionData.sectionName}`, 14, 25);
    doc.text(`Section User: ${sectionData.userName}`, 14, 32);
    doc.text(
      `${isMonthlyReport ? "Month" : "Date"}: ${isMonthlyReport
        ? dayjs(selectedYearMonth).format("MM-YY")
        : dayjs(selectedDate).format("DD-MM-YYYY")
      }`,
      14,
      39
    );

    doc.setLineWidth(0.2);
    doc.line(14, 42, 200, 42);

    doc.setFontSize(14);
    doc.text(`${isMonthlyReport ? "Monthly" : "Daily"} Stock Report`, 14, 50);

    doc.setFontSize(12);

    const tableData = reportData.map((item) => [
      item.itemName,
      `${item.totalQty} ${item.unit}`,
    ]);

    doc.autoTable({
      head: [["Item Name", "Quantity"]],
      body: tableData,
      startY: 55,
      theme: "plain",
      styles: {
        halign: "left",
        fontSize: 12,
      },
    });

    doc.save(
      `${isMonthlyReport ? "Monthly" : "Daily"}_Stock_Report_${dayjs().format(
        "DD-MM-YYYY"
      )}.pdf`
    );
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
          / Details
        </h2>
        <div>
          <Button
            type="primary"
            onClick={downloadPDF}
            disabled={!reportData.length}
            style={{ marginRight: "10px" }}
          >
            Download {isMonthlyReport ? "Monthly" : "Daily"} Report
          </Button>
        </div>
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

        <div className="col-md-12" style={{marginBottom: '10px'}}>
          <Row gutter={16} className="mt-3">
            <Col span={12}>
              <h4>Select date for daily report</h4>
              <DatePicker
                format="YYYY-MM-DD"
                onChange={handleDateChange}
                disabledDate={(current) => current && current.isAfter(dayjs())}
                style={{ width: "100%" }}
              />
            </Col>
            <Col span={12}>
              <h4>Select month for monthly report</h4>
              <DatePicker
                picker="month"
                format="YYYY-MM"
                onChange={handleMonthChange}
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={reportData}
          loading={reportLoading}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: <Empty description="No data" /> }}
        />
        <div className="col-md-12 mt-2">
        <h4>Stock Distribution Data</h4>
      </div>
      </div>
      <ViewDistributionStockByDate />
    </div>
  );
};

export default ViewSection;
