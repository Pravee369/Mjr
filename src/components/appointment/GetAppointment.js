import React, { useState } from 'react'
import axios from "axios";
import "./BookAppointment.css"

function GetAppointment() {

    const user = JSON.parse(localStorage.getItem('user')) || {}
    let userName = user?.name?.replace(/\s+/g, "-") || "Guest";
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [errorMessage, setErrorMessage] = useState("");
    const [appointments, setAppointments] = useState([]);

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

  const getAppointments= async (date)=>
  {
    try {
        const formattedDate = `${selectedYear}-${selectedMonth + 1}-${date}`;
        const response = await axios.get("http://localhost:3000/appointment-api/getApts",
         { params:{ doctorId:user._id , date :formattedDate }
         }
        );
        console.log(response.data)
        setAppointments(response.data);
        setErrorMessage("");
      } catch (error) {
       console.error("Error getting appointments:", error);
       setAppointments([]);
       setErrorMessage("Failed to fetch appointments. Please try again.");
      }
  }

  const handleDateClick = (date) => {
    const selectedDateObj = new Date(selectedYear, selectedMonth, date);
    if (selectedDateObj >= today) {
      setSelectedDate(date);
      getAppointments(date);
    }
  };

  

  return (
    <div className="text-center p-6 border border-grey rounded-lg shadow-lg bg-white container">
         <h2> Check Your Appointments by selecting date </h2>
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
    
      {selectedDate && (
        <div className="appointment-list mt-4">
          <h3>Appointments on {`${selectedDate}-${selectedMonth + 1}-${selectedYear}`}</h3>
          {errorMessage ? (
            <p style={{ color: "red" }}>{errorMessage}</p>
          ) : appointments.length > 0 ? (
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>S.no </th>
                  <th>Patient Name</th>
                  <th>Token</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{appointment.userName}</td>
                    <td>{appointment.token}</td>
                    <td>{appointment.expectedReportTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No appointments found for this date.</p>
          )}
        </div>
      )}


    </div>
  )
}

export default GetAppointment;
