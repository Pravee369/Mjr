import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultProfile from "../../images/default-profile.png";
import "./DoctorDetails.css";
import axios from "axios";

const DoctorDetails = () => {
  const { id } = useParams(); // Get doctor ID from URL
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorResponse = await axios.get(`http://localhost:3000/user-api/doctor/${id}`);
        const verificationResponse = await axios.get(`http://localhost:3000/verifications-api/user-verification/${doctorResponse.data.username}`);
  
        setDoctor({
          ...doctorResponse.data,
          verificationStatus: verificationResponse.data.status === "approved" ? "verified" : "unverified",
          verifiedAt: verificationResponse.data.status === "approved" ? verificationResponse.data.hospitalName : null
        });
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };
  
    fetchDoctorData();
  }, [id]);
 
  if (!doctor) return <p>Loading...</p>;
  const handleBookAppointment = () => {
    navigate(`/appointment/${doctor._id}`, { state: { doctor } });
  };

  return (
    <div className="text-center p-6 border border-grey rounded-lg shadow-lg bg-white container" max-width="300px">

      <h4 className="text-center display-6 m-0 text-info">Here is the complete profile !!</h4>
      <img
        src={doctor.photo || defaultProfile}
        alt={doctor.name}
        className = "text-center w-32 h-32 rounded-full object-cover mb-3"
      />
      <h2 className="text-2xl font-bold text-center">{doctor.name}</h2>
      {doctor.verificationStatus === "verified" && (
        <p className="text-green-600 font-semibold text-sm">
          ✅ Verified doctor at {doctor.verifiedAt}
        </p>
      )}
      <p className="text-center text-gray-600">{doctor.specialization}</p>
      <p className="text-center text-gray-700">
        {doctor.experience} years of experience
      </p>
      <p className="mt-4 text-center">Works at {doctor.hospitalName}</p>
      <a href="" onClick={handleBookAppointment}>want to book appointment ?</a>
    </div>
  );
};




export default DoctorDetails;
