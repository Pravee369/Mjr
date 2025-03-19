import React, { useEffect, useState } from 'react'
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
    const [showModal, setShowModal] = useState(false);
    const [leaves,setLeaves] =useState([]);

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
      setShowModal(true)
    }
  };


  const handleLeave = async () => {
    try {
      const formattedDate = `${selectedYear}-${selectedMonth + 1}-${selectedDate}`;
      await axios.post("http://localhost:3000/leaves-api/doctor-leaves", {
        date: formattedDate,
        doctorId:user._id,
      });
      alert("Leave submitted successfully!");
    } catch (error) {
      console.error("Error submitting leave:", error);
    }
  };


useEffect(()=>
{
  const updateLeaves = async () => {
    try {
      const response=await axios.get("http://localhost:3000/leaves-api/update-leaves", {
        doctorId:user._id,
      });
     setLeaves(response.data);
    } catch (error) {
      console.error("Error submitting leave:", error);
    }
  };
   updateLeaves();
})
  

  return (
    <div className="text-center p-6 border border-grey rounded-lg shadow-lg bg-white container">
      <h2 className="text-center"> Select Date </h2>
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
                    style={{ 
                      backgroundColor: leaves.includes(`${selectedYear}-${selectedMonth + 1}-${day}`) 
                        ? "red"  // Red if doctor is on leave
                        : day === selectedDate 
                        ? "lightblue" // Light blue for selected date
                        : "white",
                      color: leaves.includes(`${selectedYear}-${selectedMonth + 1}-${day}`) ? "white" : "black",
                      padding: "2px"
                    }}
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
          <h3>Your Appointments </h3>
          {errorMessage ? (
            <p style={{ color: "red" }}>{errorMessage}</p>
          ) : appointments.length > 0 ? (
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>S.no </th>
                  <th>Patient Name</th>
                  <th>Time</th>
                </tr>
              </thead>
            <tbody>
               {appointments.map((appointment, index) => (
               <tr key={index} >
               <td>{index + 1}</td>
               <td>{appointment.userName}</td>
               <td>{appointment.time}</td>
              </tr>
              ))}
            </tbody>
            </table>
          ) : (
            <p>No appointments found for this date.</p> 
          )}
        </div>
      )}


      {/* Modal for Leave Confirmation */}
      {showModal && (
  <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
    <div className="modal-dialog">
      <div className="modal-content">
      <div className="modal-header text-center d-flex justify-content-center w-100">
        <button 
         className="btn-close" 
         aria-label="Close" 
         onClick={() => setShowModal(false)} >
       </button>
        </div>
        <div className="modal-body text-center">
          <p>Are you on leave for {`${selectedDate}-${selectedMonth + 1}-${selectedYear}`}?</p>
        </div>
        <div className="modal-footer d-flex align-items-center justify-content-center">
          <button className="btn btn-success" onClick={() => { handleLeave(); setShowModal(false); }}>
            YES
          </button>
          <button className="btn btn-danger" onClick={() => setShowModal(false)}>
            NO
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  )
}

export default GetAppointment;
