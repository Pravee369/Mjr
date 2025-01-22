import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Alarm.css";
import { loginContext } from "../../contexts/loginContext";

function Alarm() {
  const [currentUser, error, userLoginStatus, loginUser, logoutUser] =
    useContext(loginContext);
  const [alarms, setAlarms] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [label, setLabel] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchAlarms();
  }, []);

  useEffect(() => {
    setPhoneNumber(currentUser.mobile);
    setUserName(currentUser.username);
  }, []);

  const fetchAlarms = async () => {
    try {
      let token=localStorage.getItem("token")
      const response = await axios.get("http://localhost:3000/alarms", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
      setAlarms(response.data);
    } catch (error) {
      console.error("Error fetching alarms:", error);
    }
  };

  const createAlarm = async () => {
    try {
      let token=localStorage.getItem("token")
      const response = await axios.post("http://localhost:3000/alarms", {
        date,
        time,
        label,
        phoneNumber,
        userName,
      }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
      setAlarms([...alarms, response.data]);
      setDate("");
      setTime(""); // Clear the input field after setting the alarm
      setLabel(""); // Clear the input field after setting the alarm
    } catch (error) {
      console.error("Error creating alarm:", error);
    }
  };


  return (
    <div className="alarms">
      <div className="time-input">
        <div className="inp1">
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required
          />
        </div>
        <div className="inp1">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="inp2">
          <input
            type="text"
            placeholder="Set alarm name"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
        </div>
      </div>
      <button className="mt-3 btn btn-success rounded" onClick={createAlarm}>
        Set Alarm
      </button>
      <ul>
        {alarms.map(
          (alarm) =>
            alarm.userName == currentUser.username && (
              <li key={alarm._id}>
                {alarm.date} {alarm.time} - {alarm.label} - {alarm.phoneNumber}
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default Alarm;
