import React, { useState, useEffect, useContext } from 'react';
import { loginContext } from "../contexts/loginContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LabsFilter.css';
import { toast } from 'react-toastify';

function LabsFilter() {
  const [currentUser] = useContext(loginContext);
  let userName = currentUser?.name?.replace(/\s+/g, "-") || "Guest";

  const [search, setSearch] = useState("");
  const [labs, setLabs] = useState([]);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState("search");
  const [appointments, setAppointments] = useState([]);
  const [appointmentSearch, setAppointmentSearch] = useState("");

  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/labs-api/labs");
        setLabs(res.data);
      } catch (err) {
        console.log("Error fetching labs:", err);
      }
    };

    const fetchAppointments = async () => {
      if (currentUser?.username) {
        try {
          const res = await axios.get(`http://localhost:3000/lab-tests/my-appointments?userEmail=${currentUser.username}`);
          setAppointments(res.data);
        } catch (err) {
          console.log("Error fetching appointments:", err);
        }
      }
    };

    fetchLabs();
    fetchAppointments();
  }, [currentUser]);

  useEffect(() => {
    if (search) {
      axios.get("http://localhost:3000/labs-api/labs/search", {
        params: { query: search }
      })
      .then(res => setResults(res.data))
      .catch(err => console.log(err));
    } else {
      setResults([]);
    }
  }, [search]);

  const cancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axios.delete(`http://localhost:3000/lab-tests/cancel-appointment/${id}`);
        toast?.success?.("Appointment cancelled"); // Optional toast
        // Re-fetch appointments after cancel
        const res = await axios.get(`http://localhost:3000/lab-tests/my-appointments?userEmail=${currentUser.username}`);
        setAppointments(res.data);
      } catch (err) {
        console.error("Error cancelling appointment:", err);
        toast?.error?.("Failed to cancel appointment");
      }
    }
  };

  return (
    <div className="labs-filter-container">
      <div className="tabs-container">
        <button
          onClick={() => setActiveTab("search")}
          className={activeTab === "search" ? "tab active" : "tab"}
        >
          🔍 Search Labs
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={activeTab === "appointments" ? "tab active" : "tab"}
        >
          📅 My Bookings
        </button>
      </div>

      {activeTab === "search" ? (
        <>
          <h2 className="labs-filter-title">Search Laboratories</h2>
          <input
            type="text"
            placeholder="Search Labs by name or location..."
            className="labs-filter-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="labs-card-wrapper">
            {(results.length > 0 ? results : labs).map((lab) => (
              <div
                key={lab._id}
                className="lab-card"
                onClick={() => navigate(`/${userName}/labs-filter/laboratory/${lab._id}`)}
              >
                <h3 className="lab-name">{lab.name}</h3>
                <p className="lab-address">{lab.address}</p>
                <p className="lab-contact">Contact Number : {lab.mobile}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="labs-filter-title">My Bookings</h2>
          {appointments.length > 0 && (
            <input
              type="text"
              placeholder="Filter by test name..."
              className="labs-filter-input"
              value={appointmentSearch}
              onChange={(e) => setAppointmentSearch(e.target.value)}
            />
          )}
          {appointments.length === 0 ? (
            <p style={{ color: "#777", marginTop: "1rem" }}>
              You haven't booked any tests yet. Use the "Search Labs" tab to find labs and schedule tests.
            </p>
          ) : (
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Lab</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments
                  .filter((appt) =>
                    appt.testName.toLowerCase().includes(appointmentSearch.toLowerCase())
                  )
                  .map((appt, index) => (
                    <tr key={index}>
                      <td>{appt.testName}</td>
                      <td>{appt.labName}</td>
                      <td>{appt.date}</td>
                      <td>{appt.time}</td>
                      <td>
                        <button onClick={() => cancelAppointment(appt._id)} className="cancel-btn">
                          Cancel
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default LabsFilter;
