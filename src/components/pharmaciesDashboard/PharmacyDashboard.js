import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { loginContext } from "../contexts/loginContext";
import { useContext } from "react";
import "./PharmacyDashboard.css"; // Add custom styles here

const PharmacyDashboard = () => {
  let [currentUser] = useContext(loginContext);
  let userName = currentUser?.name?.replace(/\s+/g, "-") || "Guest";
  return (
    <div className="lab-dashboard-container">
      <aside className="lab-dashboard-sidebar">
        <h2 className="sidebar-title">Pharmacy Dashboard</h2>
        <nav>
          <NavLink
            to={`/Organization/pharmacies/${userName}/dashboard/medicines`}
            className="lab-link"
          >
            🏥 Medicines
          </NavLink>
          <NavLink
            to={`/Organization/pharmacies/${userName}/dashboard/add-medicine`}
            className="lab-link"
          >
            ➕ Add Medicine
          </NavLink>
          <NavLink
            to={`/Organization/pharmacies/${userName}/dashboard/orders`}
            className="lab-link"
          >
            📦 Orders
          </NavLink>
          <NavLink
            to={`/Organization/pharmacies/${userName}/dashboard/accepted-orders`}
            className="lab-link"
          >
            📦 Accepted Orders
          </NavLink>
        </nav>
      </aside>
      <main className="lab-dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PharmacyDashboard;
