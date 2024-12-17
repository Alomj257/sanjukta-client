import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apis from "../../../utils/apis"; // Import your apis.js
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ViewDistribution from "../assingStockToSection/ViewDistribution";
import ViewDistributionStockByDate from "../assingStockToSection/ViewDistributionStockByDate";

const ViewSection = () => {
  const { id } = useParams();
  const [sectionData, setsectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

        setsectionData(sectionDetails);
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

  const downloadPDF = async () => {
    const element = document.querySelector(".suppier_main");
    const button = element.querySelector("button");
    if (button) button.style.display = "none"; // Hide the button in the PDF

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    if (button) button.style.display = ""; // Show the button back in the UI

    const fileName = `${sectionData.sectionName.replace(
      /\s+/g,
      "_"
    )}_Details.pdf`;
    pdf.save(fileName);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <ClipLoader size={30} color="#00BFFF" loading={loading} />
      </div>
    );
  }

  if (!sectionData) {
    return <p>No section details available.</p>;
  }
  return (
    <div className="suppier_main">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="section_header">
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/admin/section")}
          >
            section
          </span>{" "}
          / View Details
        </h2>
        <button
          onClick={downloadPDF}
          style={{ marginBottom: "20px" }}
          className="download_pdf"
        >
          Download as PDF
        </button>
      </div>
      <div className="row section_container">
        <h4>Section Details</h4>
        <div className="col-md-6 section_item viewBox">
          <label>section Name:</label>
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
     
        {/* <ViewDistribution /> */}
        <ViewDistributionStockByDate/>
      </div>
    </div>
  );
};

export default ViewSection;
