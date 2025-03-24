import { useState, useContext, useEffect } from "react";
import { loginContext } from '../contexts/loginContext'
import axios from "axios";
import "./GetVerified.css";
import defaultHospitalIcon from "../../images/default-hospital-icon.png";

function GetVerified(){
  
  let [currentUser,error,userLoginStatus,loginUser,logoutUser]=useContext(loginContext);
  const [hospitalEmailId, setHospitalEmailId] = useState("");
  const [message, setMessage] = useState("");
  const [verificationRequest, setVerificationRequest] = useState(null);
  let doctorEmail = currentUser.username;
  
  const fetchVerificationStatus = async () => {
    try {
      const response = await axios.get(`/verifications-api/user-verification/${doctorEmail}`);
      if (response.data.message) {
        setVerificationRequest(null);
      } else {
        setVerificationRequest(response.data);
      }
    } catch (error) {
      console.error("Error fetching verification status:", error);
    }
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, [doctorEmail]);


  const handleVerificationRequest = async () => {
    if (!hospitalEmailId) {
      setMessage("Please enter a valid Hospital ID.");
      return;
    }
  
    try {
      const checkResponse = await axios.get(`/verifications-api/check-hospital/${hospitalEmailId}`);
  
      if (checkResponse.status === 200) {
        const response = await axios.post("/verifications-api/request-verification", {
          hospitalEmailId,
          doctorEmail,
        });
  
        if (response.status === 201 || response.status === 200) {
          setMessage(response.data.message);
          fetchVerificationStatus();
        } else {
          setMessage("Failed to send request. Please try again.");
        }
        setHospitalEmailId("");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage("The hospital with the entered Email ID is not registered on our website.");
      } else {
        setMessage("An error occurred. Please try again later.");
      }
      setHospitalEmailId("");
    }
  };

  const handleDeleteRequest = async () => {
    try {
      const response = await axios.delete(`/verifications-api/delete-verification/${doctorEmail}`);
      setMessage(response.data.message);
      setVerificationRequest(null);
    } catch (error) {
      setMessage("Failed to delete request. Please try again later.");
    }
  };

  let statusMessage;
  if (!verificationRequest) {
    statusMessage = "You haven't made any verification requests yet.";
  } else {
      const hospitalName = verificationRequest.hospitalName || "the hospital";

      switch (verificationRequest.status) {
        case "pending":
          statusMessage = `Your verification request to ${hospitalName} is currently pending approval.`;
          break;
        case "approved":
          statusMessage = `Your verification request to ${hospitalName} has been approved!`;
          break;
        case "rejected":
          statusMessage = `Your verification request to ${hospitalName} was rejected. You can submit a new request.`;
          break;
        default:
          statusMessage = `Unknown request status for ${hospitalName}. Please contact support.`;
      }
  }

  return (
    <div className="get-verified-container">
      <h2 className="title">Get Verified at Your Hospital</h2>

      <div className="icon-container">
        <img
          src={defaultHospitalIcon}
          alt="Hospital Icon"
          className="hospital-icon"
        />
      </div>
      
      <p className="status-message">{statusMessage}</p>
      
      {message && <p className={`message ${message.includes("successfully") ? "success-message" : "error-message"}`}>{message}</p>}

      <div className="form-group">
        <label className="label">Hospital Email ID:</label>
        <input
          type="text"
          placeholder="Enter Hospital Email ID"
          value={hospitalEmailId}
          onChange={(e) => setHospitalEmailId(e.target.value)}
          className="input-field"
        />

        <div className="button-group">
          <button onClick={handleVerificationRequest} className="submit-button">
            Send Verification Request
          </button>

          {verificationRequest && verificationRequest.status !== "approved" && (
            <button onClick={handleDeleteRequest} className="delete-button">
              Cancel Request
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default GetVerified;
