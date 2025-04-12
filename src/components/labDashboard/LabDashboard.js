import React, {useContext} from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./LabDashboard.css";
import { loginContext } from "../contexts/loginContext";

function LabDashboard() {
  let [currentUser] = useContext(loginContext);
  let userName = currentUser?.name?.replace(/\s+/g, "-") || "Guest";

  return (
    <div className="lab-dashboard-container">
      <aside className="lab-dashboard-sidebar">
        <h2 className="sidebar-title">Lab Dashboard</h2>
        <nav>
          <NavLink to={`/Organization/Laboratory/${userName}/dashboard`} end className="lab-link">🧪 My Tests</NavLink>
          <NavLink to={`/Organization/Laboratory/${userName}/dashboard/add-test`} className="lab-link">➕ Add New Test</NavLink>
          <NavLink to={`/Organization/Laboratory/${userName}/dashboard/test-appointments`} className="lab-link">📅 Test Appointments</NavLink>
        </nav>
      </aside>

      <main className="lab-dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default LabDashboard;
