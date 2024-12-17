import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apis from "../../../utils/apis"; // Import your apis.js
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { MdWarning } from "react-icons/md";
import UserDistributionView from "./UserDistributionView";

const UserSection = () => {
  const [sectionData, setsectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const email = localStorage.getItem("email");
  const { state } = useLocation();
  const navigate=useNavigate();

  useEffect(() => {
    const getUserByEmail = async () => {
      try {
        const apiUrl = apis().getUserByEmail(email);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch user details");
        const result = await response.json();
        if (!result?.user) {
          throw new Error("User details are missing in the response.");
        }
        setId(result?.user?._id);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error(
          error.message || "Something went wrong while fetching user details."
        );
      }
    };
    getUserByEmail();
  }, [email]);

  useEffect(() => {
    const fetchSectionDetails = async () => {
      setLoading(true);
      try {
        const apiUrl = apis().getSectionByUserId(id);
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
          setSectionId(result?.section?._id);
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
    if (id) {
      fetchSectionDetails();
    }
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
      {state === "review" && (
        <div className="  rounded bg-light my-3 text-warning text-center">
          {" "}
          <MdWarning /> Section is pending for acceptance, please accept it
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={downloadPDF}
          style={{ marginBottom: "20px" }}
          className="download_pdf ms-auto"
        >
          Download as PDF
        </button>
      </div>
      <div className="row section_container">
        <div className="d-flex justify-content-between">
          <div className="col-md-6 section_item ">
            <label>Section </label>
            <span className="fw-bold"> {sectionData.sectionName}</span>
          </div>
        </div>
        <UserDistributionView sectionId={sectionId} />
      </div>
    </div>
  );
};

export default UserSection;
