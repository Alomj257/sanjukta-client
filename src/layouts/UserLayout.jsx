import React from 'react';
import { Outlet } from 'react-router-dom';
import PanelNavigation from '../components/panelNavigation/PanelNavigation';
import './Layout.css';
import Sidebar from '../components/sidebar/Sidebar';

const UserLayout = () => {
  return (
    <div className="user-layout">
      {/* Sidebar */}
      <Sidebar role="user" />
      {/* Main content */}
      <div className="user-main">
        <PanelNavigation role="User" />
        <div className="user-main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
