import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./TestAppointments.css"; // Create styles here if needed
import { loginContext } from "../contexts/loginContext";

const TestAppointments = () => {
  let [currentUser] = useContext(loginContext);
  const labName = currentUser.username; // This is actually the `username` of lab
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`/lab-tests/all-bookings?labId=${labName}`);
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.username) {
      fetchBookings();
    }
  }, [currentUser]);
  
  if (!currentUser?.username) {
    return <p>Loading user...</p>;
  }  

  return (
    <div className="test-appointments-container">
      <h2>Test Appointments</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="appointments-table">
          <table>
            <thead>
              <tr>
                <th>Test Name</th>
                <th>User Email</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr key={idx}>
                  <td>{booking.testName}</td>
                  <td>{booking.userEmail}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>₹{booking.price}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestAppointments;
