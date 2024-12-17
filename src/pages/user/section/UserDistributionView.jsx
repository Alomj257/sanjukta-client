import React, { useEffect, useState } from "react";
import apis from "../../../utils/apis";
import { ClipLoader } from "react-spinners";
import { FaEye } from "react-icons/fa";
import { MdCheck, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../components/dataTable/DataTable";
import toast from "react-hot-toast";

const UserDistributionView = ({ sectionId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState([]);
  const navigate = useNavigate();

  const getStocksGroupByDate = async () => {
    try {
      const response = await fetch(
        apis().getStocksGroupByDate(sectionId, "assign")
      );
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

  const fetchAccepted = async () => {
    try {
      const response = await fetch(
        apis().getStocksGroupByDate(sectionId, "accept")
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();

      if (result && result.stocks && result.stocks.length >= 0) {
        setAccepted(result.stocks);
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
  }, []);

  useEffect(() => {
    fetchAccepted();
  }, []);

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
      fetchAccepted();
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
      name: "Return Stock",
      cell: (row) => (
        <div className="d-flex gap-4 justify-content-center">
          <button
             onClick={() =>
              navigate("return-stock", {
                state: { sectionId, date: row?.date, stocks: row?.stocks },
              })}
            className="readBtn Btn bg-transparent text-primary"
          >
            Return Stocks
          </button>
        </div>
      ),
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
          <button
            disabled
            className="editBtn Btn"
            style={{ background: "lightgreen" }}
          >
            <MdCheck /> Accepted
          </button>
        </div>
      ),
    },
    {
      name: "Product",
      cell: (row) => (
        <div className="d-flex gap-2">
          {row?.product?.productName && (
            <button
              className=" editBtn Btn text-warning p-1"
              onClick={() =>
                navigate("product", {
                  state: { sectionId, date: row?.date, product: row?.product },
                })
              }
            >
              Products
            </button>
          )}
          <button
            className="editBtn Btn text-warning"
            style={{ background: "gray" }}
            onClick={() =>
              navigate("product/add-update-product", {
                state: { sectionId, date: row?.date, stocks: row?.stocks },
              })
            }
          >
            New Product
          </button>
        </div>
      ),
    },
  ];
  return (
    <>
      <h4 className="mt-5">New Assign Stocks</h4>
      {loading ? (
        <div className="loading-spinner">
          <ClipLoader size={30} color="#00BFFF" loading={loading} />
        </div>
      ) : (
        <div className="table_main">
          {records.length <= 0 ? (
            <>
              <div className="text-center">No any stock assign</div>
            </>
          ) : (
            <table className="item-table">
              <thead>
                <tr>
                  <th>Stocks</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records?.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.stocks?.length}</td>
                    <td>
                      {new Date(item?.date).toLocaleDateString()}{" "}
                      {new Date(item?.date).toLocaleTimeString()}
                    </td>
                    <td>{item?.status}</td>
                    <td className="text-center">
                      <div className="d-flex gap-4 justify-content-center">
                        <button
                          onClick={() =>
                            navigate("distribution/stock", {
                              state: { data: item, sectionId },
                            })
                          }
                          className="readBtn Btn"
                        >
                          <FaEye /> See
                        </button>
                        <button
                          onClick={() => handleAcceptReject(item, "accept")}
                          className="editBtn Btn"
                        >
                          <MdCheck /> Accept
                        </button>
                        <button
                          onClick={() => handleAcceptReject(item, "reject")}
                          className="deleteBtn Btn"
                        >
                          <MdClose /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <h4>Accepted Stocks</h4>
      {loading ? (
        <div className="loading-spinner">
          <ClipLoader size={30} color="#00BFFF" loading={loading} />
        </div>
      ) : (
        <div className="table_main">
          {accepted.length <= 0 ? (
            <>
              <div className="text-center">No Stock distributed accepted</div>
            </>
          ) : (
            // <table className="item-table">
            //   <thead>
            //     <tr>
            //       <th>Stocks</th>
            //       <th>Date</th>
            //       <th>Status</th>
            //       <th>Action</th>
            //       <th>Product</th>
            //     </tr>
            //   </thead>
            //   <tbody>
            //     {accepted?.map((item, index) => (
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
            //             <button
            //               disabled
            //               className="editBtn Btn"
            //               style={{ background: "lightgreen" }}
            //             >
            //               <MdCheck /> Accepted
            //             </button>
            //           </div>
            //         </td>
            //         <td>
            //           {item?.product?.productName ? (
            //             <button
            //             className="bg-transparent border-0 text-capitalize"
            //             style={{ background: "lightgray" }}
            //             onClick={() =>
            //               navigate("add-update-product", {
            //                 state: { sectionId, date: item?.date,product:item?.product},
            //               })
            //             }
            //           >
            //            {item?.product?.productName}
            //           </button>
            //           ) : (
            //             <button
            //               className="editBtn Btn text-warning"
            //               style={{ background: "gray" }}
            //               onClick={() =>
            //                 navigate("add-update-product", {
            //                   state: { sectionId, date: item?.date,stocks:item?.stocks },
            //                 })
            //               }
            //             >
            //              Add Product
            //             </button>
            //           )}
            //         </td>
            //       </tr>
            //     ))}
            //   </tbody>
            // </table>
            <DataTable columns={columns} data={accepted} />
          )}
        </div>
      )}
    </>
  );
};

export default UserDistributionView;
