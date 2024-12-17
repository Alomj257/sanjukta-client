import React, { useEffect, useState } from "react";
import apis from "../../../utils/apis";
import { ClipLoader } from "react-spinners";
import { useLocation, useNavigate } from "react-router-dom";
import { MdEdit, MdOutlineWarningAmber } from "react-icons/md";
import DeleteModal from "../../../components/model/DeleteModal";
import AddUpdateStock from "../../admin/assingStockToSection/addStock";
import toast from "react-hot-toast";

const ViewDitributionByDate = ({role}) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const [details, setDetails] = useState({});
  const { state } = useLocation();
  const { data, sectionId } = state;

  const navigate = useNavigate();
  useEffect(() => {
    if (!data || !sectionId) navigate(-1);
  }, [data, sectionId]);

  const fetchDataByDate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        apis().getAllSectionsStockByDate(sectionId, new Date(data?.date))
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
  useEffect(() => {
    fetchDataByDate();
  }, [data?.date, sectionId]);

  const handleEdit = (row) => {
    // navigate(`/admin/section/edit/${row._id}`, { state: { sectionData: row } });
    setPopUp(true);
    setDetails(row);
  };
  
  const refetch = () => {
    fetchDataByDate();
  };

  const confirmDelete = async () => {
    if (!sectionToDelete) return;
    try {
      const deleteUrl = apis().deleteStockFromSection(
        sectionId,
        sectionToDelete._id?._id,
        sectionToDelete.date
      );
      const response = await fetch(deleteUrl, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete section");

      setRecords(
        records.filter((s) => {
          const stockDate = new Date(s?.date).getTime();
          const inputDate = new Date(sectionToDelete?.date).getTime();
          return !(
            s?._id?._id === sectionToDelete._id?._id && stockDate === inputDate
          );
        })
      );
      toast.success("Stock deleted successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
      setSectionToDelete(null);
    }
  };

  return (
    <>
      <div className="section-container">
        <h4 className="mt-4">Stock Distributed</h4>
        {(role==="user"&&data?.status !== "accept") && (
          <>
            <div className="text-warning  text-center">
              <MdOutlineWarningAmber /> These stocks are not accepted,{" "}
              <strong>Please accept it.</strong>
            </div>
          </>
        )}
        {loading ? (
          <div className="loading-spinner">
            <ClipLoader size={30} color="#00BFFF" loading={loading} />
          </div>
        ) : (
          <div className="table_main">
            {records.length <= 0 ? (
              <>
                <div className="text-center">No Stock distributed</div>
              </>
            ) : (
              <table className="item-table">
                <thead>
                  <tr>
                    <th>Stock </th>
                    <th>Quantity</th>
                    <th>Date</th>
                   {role==="admin"&& <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {records?.map((item, index) => (
                    <tr key={index}>
                      <td>{item?._id?.itemName}</td>
                      <td>
                        {item?.qty}
                        {item?.unit}
                      </td>
                      <td>
                        {new Date(item?.date).toLocaleDateString()}{" "}
                        {new Date(item?.date).toLocaleTimeString()}
                      </td>
                     {role==="admin"&& <td>
                      <div>
                        {/* <button onClick={() => handleView(row)} className='readBtn Btn'><FaEye /></button> */}
                        <button
                          onClick={() => handleEdit(item)}
                          className="editBtn Btn"
                        >
                          <MdEdit />
                        </button>
                        {/* <button
                          onClick={() => handleDelete(item)}
                          className="deleteBtn Btn"
                        >
                          <MdDelete />
                        </button> */}
                      </div>
                    </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      {showDeleteModal && (
        <DeleteModal
          supplierName={sectionToDelete.supplierName}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
        {popUp && (
        <AddUpdateStock
          reFetch={refetch}
          details={details}
          setPopUp={setPopUp}
        />
      )}
    </>
  );
};

export default ViewDitributionByDate;
