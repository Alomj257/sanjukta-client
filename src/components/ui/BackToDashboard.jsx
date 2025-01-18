import React from 'react';
import './backtoLogin.css';
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from 'react-router-dom';

const BackToDashboard = () => {
  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate('/admin/dashboard');
  }

  return (
    <div onClick={navigateHandler} className='back_toLogin_ui'>
        <GoArrowLeft />
        <span>Back</span>
    </div>
  )
}

export default BackToDashboard