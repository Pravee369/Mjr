import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Verifications.css";
import { loginContext } from "../contexts/loginContext";

function Verifications() {
  let [currentUser] = useContext(loginContext);
  const hospitalEmailId = currentUser.username;
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await axios.get(`/verifications-api/verification-requests/${hospitalEmailId}`);
        console.log("Fetched Requests:", response.data);
        setRequests(response.data || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    }
    fetchRequests();
  }, [hospitalEmailId]);

  const handleAction = async (requestId, status) => {
    try {
      await axios.put(`/verifications-api/update-status/${requestId}`, { status });
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );
      setSelectedRequest(null);
      document.body.classList.remove("modal-open");
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setSelectedRequest(null);
    document.body.classList.remove("modal-open");
  };

  return (
    <div className="verifications-container">
      <h2 className="title">Doctor Verification Requests</h2>

      <div className="filter-container">
        <label>Filter : </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <table className="requests-table">
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 || requests.filter(req => req.status === filter).length === 0 ? (
            <tr>
              <td colSpan="5">No verification requests found.</td>
            </tr>
          ) :(
            requests
              .filter((req) => req.status === filter)
              .map((req) => (
                <tr key={req._id} onClick={() => openModal(req)}>
                  <td>{req.doctorName}</td>
                  <td>{req.doctorEmail}</td>
                  <td>{req.specialization}</td>
                  <td>{req.status}</td>
                  <td>
                    {req.status === "pending" && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(req._id, "approved");
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(req._id, "rejected");
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>

      {selectedRequest && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Doctor Details</h3>
              {selectedRequest.doctorPhoto && (
                <img
                  src={selectedRequest.doctorPhoto}
                  alt="Doctor"
                  className="doctor-photo"
                  onError={(e) => {
                    e.target.style.display = "none"; 
                  }}
                />
              )}
            <p><strong>Name :</strong> {selectedRequest.doctorName}</p>
            <p><strong>Email :</strong> {selectedRequest.doctorEmail}</p>
            <p><strong>Mobile :</strong> {selectedRequest.doctorMobile}</p>
            <p><strong>Gender :</strong> {selectedRequest.doctorGender}</p>
            <p><strong>Specialization :</strong> {selectedRequest.specialization}</p>
            <p><strong>Experience :</strong> {selectedRequest.experience} years</p>
            <p><strong>License Number :</strong> {selectedRequest.licenseNumber}</p>
            <p><strong>Location :</strong> {selectedRequest.location}</p>
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Verifications;
