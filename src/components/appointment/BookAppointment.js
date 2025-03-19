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
  const [isAvailable, setIsAvailable] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [appointments, setAppointments] = useState([]);

  const avgTreatTime = 15; // 15 minutes
  const startTime = doctor.startTime || 9 * 60; // 9 AM in minutes
  const closeTime = doctor.closeTime || 17 * 60; // 5 PM in minutes
  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const user = JSON.parse(localStorage.getItem('user')) || {}
  let userName = user?.name?.replace(/\s+/g, "-") || "Guest";
  console.log(userName)

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

  useEffect(()=>{
  const fetchBookedSlots = async () => {
    try {
      const formattedDate = `${selectedYear}-${selectedMonth + 1}-${selectedDate}`;
      const response = await axios.get(`http://localhost:3000/appointment-api/allApts?doctorId=${doctor._id}&date=${formattedDate}`);
      console.log(response.data)
      setBookedSlots(response.data);
      console.log(bookedSlots)
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };
  fetchBookedSlots();
  },[bookedSlots])

  useEffect(()=>{
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/appointment-api/getAptsOfPatient", {
          params: { userId: user._id },
        });
        // Sorting appointments by date in descending order (most recent first)
        const sortedAppointments = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAppointments(sortedAppointments);
        setErrorMessage("");
      } catch (error) {
        console.error("Error getting appointments:", error);
        setAppointments([]);
        setErrorMessage("Failed to fetch appointments. Please try again.");
      }
    };
    fetchAppointments();
  },[appointments])

  const checkAvailability = async (date) => {
    try {
      const formattedDate = `${selectedYear}-${selectedMonth + 1}-${date}`;
      const response = await axios.post("http://localhost:3000/appointment-api/check", {
        doctorId: doctor._id,
        date: formattedDate,
      });
      const { available } = response.data;

      setIsAvailable(available);
      console.log(isAvailable)
      if (available) {
        setErrorMessage("");
        generateSlots();
      } else {
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

  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:3000/appointment-api/deleteAppointment/${appointmentId}`);
      setAppointments((prevAppointments) => prevAppointments.filter((apt) => apt._id !== appointmentId));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setErrorMessage("Failed to delete appointment. Please try again.");
    }
  };

  const generateSlots = () => {
    let tempSlots = [];
    for (let time = startTime; time < closeTime; time += avgTreatTime) {
      let hours = Math.floor(time / 60);
      let minutes = time % 60;
      let formattedTime = `${hours}:${minutes === 0 ? "00" : minutes}`;
      tempSlots.push(formattedTime);
    }
    setSlots(tempSlots);
  };

  useEffect(() => {
    console.log("Updated booked slots:", bookedSlots);
  }, [bookedSlots]);
  
 

  const handleBooking = async () => {
    try {
      const formattedDate = `${selectedYear}-${selectedMonth + 1}-${selectedDate}`;
      await axios.post("http://localhost:3000/appointment-api/book", 
        { doctorId:doctor._id, 
          doctorName :doctor.name,
          date: formattedDate, 
          time: selectedSlot ,
          userName:userName,
          userId:user._id,
        });
        alert("Appointment confirmed!");
        setSelectedSlot("");
        console.log("Appointment booked successfully!");
    
    } catch (error) {
      console.error("Booking failed:", error);
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
      
      <h3 className="mt-5">Book your slot </h3>

      {selectedDate ?
      (<div>
      {isAvailable === true  && selectedDate ? (
    <div>
    <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} className="rounded p-2">
  <option value="">Select your slot</option>
  {slots.length > 0 ? (
    slots.map((slot) => (
      <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
        {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
      </option>
    ))
  ) : (
    <option disabled> No slots available </option>
  )}
</select>
    <button onClick={handleBooking} disabled={!selectedSlot} className="m-2 p-2 bg-success  rounded text-white border border-success">
      Confirm Appointment
    </button>
  </div>
) : (
  <h4 className="text-danger ">Sorry, the doctor is not available on the selected day</h4>
)}
</div>):
<h4 className="text-danger">Please select the date to book appointment</h4>
}



<div className="mt-5">
  <h2 className="text-2xl font-semibold mb-4">Booked Appointments</h2>
  {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}

  <div className="overflow-x-auto">
    <table className="min-w-full border-collapse">
      {/* Header with only a bottom border */}
      <thead className="bg-gray-100 border-b border-gray-400">
        <tr>
          <th className="border border-gray-600 px-4 py-2 text-left font-medium">Date</th>
          <th className="border border-gray-600 px-4 py-2 text-left font-medium">Time</th>
          <th className="border border-gray-600 px-4 py-2 text-left font-medium">Doctor</th>
          <th className="border border-gray-600 px-4 py-2 text-center font-medium">Want to Cancel ?</th>
        </tr>
      </thead>
      
      {/* Each row has a bottom border for separation */}
      <tbody>
        {appointments.map((apt) => {
          const isPast = new Date(apt.date).setHours(0, 0, 0, 0) < today;
          return (
            <tr key={apt._id} className="border border-gray-600">
              <td className="border border-gray-600 px-4 py-2">{apt.date}</td>
              <td className="border border-gray-600 px-4 py-2">{apt.time}</td>
              <td className="border border-gray-600 px-4 py-2">{apt.doctorName}</td>
              <td className="border border-gray-600 px-4 py-2 text-center">
                <button
                  onClick={() => handleDelete(apt._id)}
                  disabled={isPast}
                  className={`px-4 py-1 rounded text-white font-semibold ${
                    isPast ? "bg-gray-400 cursor-not-allowed border border-gray" : "bg-danger border border-danger"
                  }`}
                >
                  {isPast ? "Past Appointment" : "Cancel"}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>


    </div>
  );
};

export default AppointmentBooking;
