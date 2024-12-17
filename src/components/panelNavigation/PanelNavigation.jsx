import React from 'react';
import { FaUser } from "react-icons/fa";
import './PanelNavigation.css';

const PanelNavigation = ({ role }) => {
    const userName = localStorage.getItem('userName') || 'Guest';

    return (
        <nav className="panel-navigation">
            <span className="logo-text">Hi {role}</span>
            <div className="panel-user-info">
                <FaUser className="user-icon" />
                <span className="user-name">
                    {userName}
                </span>
            </div>
        </nav>
    );
};

export default PanelNavigation;
