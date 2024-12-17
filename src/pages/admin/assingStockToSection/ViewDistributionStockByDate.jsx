import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apis from "../../../utils/apis";
import DataTable from '../../../components/dataTable/DataTable';
import { ClipLoader } from "react-spinners";
import { FaEye } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";

const ViewDistributionStockByDate = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { sectionId } = state;

  const getStocksGroupByDate = async () => {
    try {
      const response = await fetch(apis().getAllStocksGroupByDate(sectionId));
      console.log(sectionId);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      if (result && result.stocks && result.stocks.length >= 0) {
        setRecords(result.stocks);
      } else {
        throw new Error("No data found for this date");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStocksGroupByDate();
  }, [sectionId]);

  const handleAcceptReject = async (row, status) => {
    if (!row) return;
    try {
      const acceptUrl = apis().updateSectionStatus(
        sectionId,
        row?.date,
        status
      );
      const response = await fetch(acceptUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      if (!response.ok) throw new Error(`Failed to ${status}`);
      toast.success(` Section ${status} successfully`);
      getStocksGroupByDate();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const columns = [
   
    {
      name: "Date",
      selector: (row) =>
        new Date(row?.date).toLocaleDateString() +
        " " +
        new Date(row?.date).toLocaleTimeString(),
    },
    {
      name: "Stocks",
      selector: (row) => row?.stocks?.length,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-4 justify-content-center">
          <button
            onClick={() =>
              navigate("distribution/stock", {
                state: { data: row, sectionId },
              })
            }
            className="readBtn Btn"
          >
            <FaEye /> See
          </button>
          {/* <button
                        //   onClick={() => handleAcceptReject(item, "accept")}
                          className="editBtn Btn"
                        >
                          <MdCheck /> Accept
                        </button> */}
          {row?.status === "reject" && (
            <button
              onClick={() => handleAcceptReject(row, "assign")}
              className="deleteBtn Btn"
            >
              <MdClose /> Reassign
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <div className="loading-spinner">
          <ClipLoader size={30} color="#00BFFF" loading={loading} />
        </div>
      ) : (
        <div className="table_main">
          {records.length <= 0 ? (
            <>
              <div className="text-center">No any stock </div>
            </>
          ) : (
            // <table className="item-table">
            //   <thead>
            //     <tr>
            //       <th>Stocks</th>
            //       <th>Date</th>
            //       <th>Status</th>
            //       <th>Action</th>
            //     </tr>
            //   </thead>
            //   <tbody>
            //     {records?.map((item, index) => (
            //       <tr key={index}>
            //         <td>{item?.stocks?.length}</td>
            //         <td>
            //           {new Date(item?.date).toLocaleDateString()}{" "}
            //           {new Date(item?.date).toLocaleTimeString()}
            //         </td>
            //         <td>{item?.status}</td>
            //         <td className="text-center">
            //           <div className="d-flex gap-4 justify-content-center">
            //             <button
            //               onClick={() =>
            //                 navigate("distribution/stock", {
            //                   state: { data: item, sectionId },
            //                 })
            //               }
            //               className="readBtn Btn"
            //             >
            //               <FaEye /> See
            //             </button>
            //             {/* <button
            //             //   onClick={() => handleAcceptReject(item, "accept")}
            //               className="editBtn Btn"
            //             >
            //               <MdCheck /> Accept
            //             </button> */}
            //             {item?.status === "reject" && (
            //               <button
            //                 onClick={() => handleAcceptReject(item, "assign")}
            //                 className="deleteBtn Btn"
            //               >
            //                 <MdClose /> Reassign
            //               </button>
            //             )}
            //           </div>
            //         </td>
            //       </tr>
            //     ))}
            //   </tbody>
            // </table>
            <DataTable columns={columns} data={records} />

          )}
        </div>
      )}
    </div>
  );
};

export default ViewDistributionStockByDate;
