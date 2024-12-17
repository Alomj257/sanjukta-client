import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleLogout = () => {
      try {
        localStorage.clear();
      } catch (error) {
        console.log(error);
      }
      navigate("/login");
    };
    handleLogout();
  }, []);
  return <></>;
};

export default Logout;
