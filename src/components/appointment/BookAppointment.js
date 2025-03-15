import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./BookAppointment.css";

const AppointmentBooking = () => {
  const location = useLocation();
  const doctor = location.state?.doctor;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isAvailable, setIsAvailable] = useState(null);
  const [tokenNumber, setTokenNumber] = useState(null);
  const [expectedReportTime, setExpectedReportTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date();
  
  const generateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    
    const calendar = [];
    let week = new Array(firstDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      calendar.push(week);
    }
    return calendar;
  };

  const checkAvailability = async (date) => {
    try {
      const formattedDate = `${selectedYear}-${selectedMonth + 1}-${date}`;
      const response = await axios.post("http://localhost:3000/appointment-api/check", {
        doctorId: doctor._id,
        date: formattedDate,
      });
      const { available, token, reportTime } = response.data;

      setIsAvailable(available);
      if (available) {
        setTokenNumber(token);
        setExpectedReportTime(reportTime);
        setErrorMessage("");
      } else {
        setTokenNumber(null);
        setExpectedReportTime("");
        setErrorMessage("Appointment is not possible on this date. Please choose another date.");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      setErrorMessage("Failed to check availability. Please try again.");
    }
  };

  const handleDateClick = (date) => {
    const selectedDateObj = new Date(selectedYear, selectedMonth, date);
    if (selectedDateObj >= today) {
      setSelectedDate(date);
      checkAvailability(date);
    }
  };

  const handleConfirmAppointment = async () => {
    if (selectedDate && isAvailable) {
      try {
        const formattedDate = `${selectedYear}-${selectedMonth + 1}-${selectedDate}`;
        await axios.post("http://localhost:3000/appointment-api/book", {
          doctorId: doctor._id,
          date: formattedDate,
          token: tokenNumber,
        });
        alert("Appointment confirmed!");
      } catch (error) {
        console.error("Error confirming appointment:", error);
        alert("Failed to confirm appointment. Please try again.");
      }
    }
  };

  return (
    <div className="text-center p-6 border border-grey rounded-lg shadow-lg bg-white container">
      <h2>Book an Appointment with {doctor.name}</h2>
      <div className="calendar-controls text-center mt-4">
        <button onClick={() => setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))} className="btn bg-primary text-white p-2">Prev</button>
        <span className="p-2">{new Date(selectedYear, selectedMonth).toLocaleString("default", { month: "long", year: "numeric" })}</span>
        <button onClick={() => setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))} className="btn bg-primary text-white p-2">Next</button>
      </div>

      <div className="calendar-container text-center mt-2">
        <table className="calendar-table">
          <thead>
            <tr>
              <th className="calendar-header p-2">Sun</th>
              <th className="calendar-header p-2">Mon</th>
              <th className="calendar-header p-2">Tue</th>
              <th className="calendar-header p-2">Wed</th>
              <th className="calendar-header p-2">Thu</th>
              <th className="calendar-header p-2">Fri</th>
              <th className="calendar-header p-2">Sat</th>
            </tr>
          </thead>
          <tbody>
            {generateCalendar().map((week, index) => (
              <tr key={index}>
                {week.map((day, i) => (
                  <td
                    key={i}
                    onClick={() => day && handleDateClick(day)}
                    className={
                      day && new Date(selectedYear, selectedMonth, day) >= today ? "clickable" : "disabled"
                    }
                    style={{ backgroundColor: day === selectedDate ? "lightblue" : "white",padding:"2px" }}
                  >
                    {day || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isAvailable === false && <p style={{ color: "red" }}>{errorMessage}</p>}
      {isAvailable && (
        <div>
          <p><strong className="mt-3">Your Token Number:</strong> {tokenNumber}</p>
          <p><strong className="mt-1">Expected Report Time:</strong> {expectedReportTime}</p>
          <button className="btn btn-danger" onClick={handleConfirmAppointment}>Confirm Appointment</button>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
