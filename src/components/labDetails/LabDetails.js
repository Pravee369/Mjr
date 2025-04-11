import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./LabDetails.css";

const LabDetails = () => {
  const { id } = useParams();
  const [lab, setLab] = useState(null);

  useEffect(() => {
    const fetchLabDetails = async () => {
      const res = await axios.get(`http://localhost:3000/labs-api/labs/${id}`);
      console.log("Lab Details API Response:", res.data);
      setLab(res.data);
      window.scrollTo(0, 0);
    };

    fetchLabDetails();
  }, [id]);

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!lab) {
    return <p className="loading-text">Loading Lab Details...</p>;
  }

  return (
    <div className="lab-details-container">
      <h2 className="lab-details-title">{lab.name}</h2>

      <div className="lab-details-card">
        <p><strong>Address :</strong> {lab.address}</p>
        <p><strong>Mobile :</strong> {lab.mobile}</p>
        <p><strong>Email :</strong> {lab.username}</p>
        <p><strong>Timings :</strong> {formatTime(lab.startTime)} - {formatTime(lab.endTime)}</p>
      </div>
    </div>
  );
};

export default LabDetails;
