import { useState, useEffect, useContext } from "react";
import { loginContext } from '../contexts/loginContext'
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./HospitalDetails.css";

function HospitalDetails() {
    let [currentUser] = useContext(loginContext);
    let userName = currentUser?.name?.replace(/\s+/g, "-") || "Guest";
  const { id } = useParams();
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchApprovedDoctors() {
      try {
        const hospitalResponse = await axios.get(`http://localhost:3000/user-api/hospital/${id}`);
        console.log(hospitalResponse.data)
        const response = await axios.get(`/verifications-api/verification-requests/${hospitalResponse.data.username}`);
        setDoctors(Array.isArray(response.data) ? response.data : []);
        console.log(doctors.filter(doc => doc.status === "approved"))
      } catch (error) {
        console.error("Error fetching approved doctors:", error);
        setDoctors([]);
      }
    }
    fetchApprovedDoctors();
  }, [id]);

  const handleRowClick = async (doctorEmail) => {
    try {
      const response = await axios.get(`/user-api/get-doctor-id/${doctorEmail}`);
      const doctorId = response.data._id;

      if (doctorId) {
        navigate(`/${userName}/searchFilter/doctor/${doctorId}`);
      }
    } catch (error) {
      console.error("Error fetching doctor ID:", error);
    }
  };

  return (
    <div className="hospital-details-container">
      <h2 className="title">Approved Doctors at this Hospital</h2>

      {doctors.length === 0 || doctors.filter(doc => doc.status === "approved").length === 0 ? (
        <p className="no-doctors">No approved doctors found.</p>
      ) : (
        <table className="doctors-table">
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {doctors.filter(doc => doc.status === "approved").map((doctor) => (
              <tr key={doctor._id} onClick={() => handleRowClick(doctor.doctorEmail)} className="clickable-row">
                <td>{doctor.doctorName}</td>
                <td>{doctor.doctorEmail}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.experience} years</td>
                <td>{doctor.doctorMobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HospitalDetails;
