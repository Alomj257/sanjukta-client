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
        apis().getStocksGroupByDate(sectionId, "assigned")
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();

      if (result && result.stocks && result.stocks.length > 0) {
        setRecords(result.stocks);
      } else {
        setRecords([]); // Ensure empty records if no data is found
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
        apis().getStocksGroupByDate(sectionId, "accepted")
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();

      if (result && result.stocks && result.stocks.length > 0) {
        setAccepted(result.stocks);
      } else {
        setAccepted([]); // Ensure empty accepted list if no data
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

  useEffect(() => {
    fetchAccepted();
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
      toast.success(`Section ${status} successfully`);
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
              })
            }
            className="readBtn Btn bg-danger text-white"
          >
            Return Stocks
          </button>
        </div>
      ),
    },
    {
      name: "Add Product",
      cell: (row) => (
        <div className="d-flex gap-4 justify-content-center">
          <button
            className="editBtn Btn text-white bg-success"
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
    {
      name: "Products",
      cell: (row) => (
        <div className="d-flex gap-2">
          {row?.product?.productName && (
            <button
              className=" editBtn Btn bg-info text-white"
              onClick={() =>
                navigate("product", {
                  state: { sectionId, date: row?.date, product: row?.product },
                })
              }
            >
              Products
            </button>
          )}
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
        </div>
      ),
    },
  ];

  return (
    <>
      {records.length > 0 && (
        <>
          <h4 className="mt-4">New Assign Stocks</h4>
          {loading ? (
            <div className="loading-spinner">
              <ClipLoader size={30} color="#00BFFF" loading={loading} />
            </div>
          ) : (
            <div className="table_main">
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
                            onClick={() => handleAcceptReject(item, "accepted")}
                            className="editBtn Btn"
                          >
                            <MdCheck /> Accept
                          </button>
                          <button
                            onClick={() => handleAcceptReject(item, "rejected")}
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
            </div>
          )}
        </>
      )}
      <h4 className="mt-4">Accepted Stocks</h4>
      {loading ? (
        <div className="loading-spinner">
          <ClipLoader size={30} color="#00BFFF" loading={loading} />
        </div>
      ) : (
        <div className="table_main">
          {accepted.length <= 0 ? (
            <div className="text-center">No Stock distributed accepted</div>
          ) : (
            <DataTable columns={columns} data={accepted} />
          )}
        </div>
      )}
    </>
  );
};

export default UserDistributionView;
