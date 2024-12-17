import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apis from "../../../utils/apis";

const ViewProduct = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!product) navigate(-1);
    setData(product);
  }, [product]);

  return (
    <div>
      <h2 className="text-center my-4">Product Detail</h2>
      <div className="container">
        <div className="row">
          <div className="col-md-6 d-flex gap-3">
            <h5 className=" text-secondary">Product:</h5>
            <h5 className="fw-bold"> {data?.productName}</h5>
          </div>
          <div className="col-md-6 d-flex gap-3">
            <h5 className=" text-secondary">Quantity:</h5>
            <h5 className="fw-bold text-capitalize">
              {data?.qty} {data?.unit}
            </h5>
          </div>
        </div>
      </div>
      <div>
          <div className="table_main">
            {data?.stocks?.length <= 0 ? (
              <>
                <div className="text-center">No any stock </div>
              </>
            ) : (
              <table className="item-table">
                <thead>
                  <tr>
                    <th>Stocks</th>
                    <th>Date</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.stocks?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-capitalize">
                        <Stock id={item?._id} />
                      </td>
                      <td>
                        {new Date(item?.date).toLocaleDateString()}{" "}
                        {new Date(item?.date).toLocaleTimeString()}
                      </td>
                      <td>
                        {item?.qty}
                        {item?.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
      </div>
    </div>
  );
};

export default ViewProduct;

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
