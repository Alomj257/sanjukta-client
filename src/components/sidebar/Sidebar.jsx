import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import { FaBars, FaPeopleGroup, FaPeopleCarryBox } from "react-icons/fa6";
import { MdSpaceDashboard, MdInventory } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import transparentLogo from '../../assets/logo.png';
import './Sidebar.css';

const Sidebar = ({ role }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const links = {
        admin: [
            { name: 'Dashboard', path: '/admin/dashboard', icon: <MdSpaceDashboard /> },
            { name: 'Supplier', path: '/admin/supplier', icon: <FaUsers /> },
            { name: 'Stock', path: '/admin/stock', icon: <MdInventory /> },
            { name: 'Section', path: '/admin/section', icon: <FaPeopleGroup /> },
            { name: 'New Stock', path: '/admin/product', icon: <FaPeopleCarryBox /> },
            { name: 'Logout', path: '/logout', icon: <IoLogOut />},
        ],
        user: [
            // { name: 'Dashboard', path: '/user/dashboard', icon: <MdSpaceDashboard /> },
            { name: 'Section', path: '/user/section', icon: <MdInventory /> },
            { name: 'Logout', path: '/logout', icon: <IoLogOut />},
        ],
    };

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Header */}
            <div className="sidebar-header">
                {!collapsed && (
                    <img
                        src={transparentLogo}
                        alt="Logo"
                        className="sidebar-logo"
                    />
                )}
                <button className="collapse-btn" onClick={toggleCollapse}>
                    <FaBars />
                </button>
            </div>

            {/* Links */}
            <ul className="sidebar-links">
                {links[role]?.map((link, index) => (
                    <li key={index} className="sidebar-link-item">
                        <NavLink
                            to={link.path}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <span className="sidebar-icon">{link.icon}</span>
                            {!collapsed && <span className="sidebar-text">{link.name}</span>}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
