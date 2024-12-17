import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apis from "../../../utils/apis";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";

const Product = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    if (!state || !state?.sectionId || !state.date) {
      navigate(-1);
    }
  }, [state]);
  useEffect(() => {
    const fetchProductByDate = async () => {
      try {
        const response = await fetch(
          apis().getProductByDate(state.sectionId, state.date)
        );
        if (!response.ok) throw new Error("Failed to fetch sections");

        const result = await response.json();
        if (result && result?.products && result?.products?.length > 0) {
          setProduct(result?.products);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        toast.error(error.message);
      } finally {
      }
    };
    fetchProductByDate();
  }, []);

  return (
    <>
      <div className="table_main">
        {product.length <= 0 ? (
          <>
            <div className="text-center">No any stock </div>
          </>
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
                        navigate("/user/section/product/add-update-product", { state: { ...state } })
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
