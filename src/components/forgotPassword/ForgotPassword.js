import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30); // 30 seconds timer
  const [canResend, setCanResend] = useState(false);
  const [triggerTimer, setTriggerTimer] = useState(false);

  // Start timer when OTP is sent (step 2)
  useEffect(() => {
    if (step === 2) {
      setCanResend(false);
      setTimer(30);
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [step, triggerTimer]);

  // Function to resend OTP
  const handleResendOTP = async () => {
    try {
      const response = await axios.post("http://localhost:3000/user-api/send-otp", {
        email,
      });
      if (response.data.success) {
        setError("");
        setMessage("OTP resent successfully.");
        setTriggerTimer((prev) => !prev);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error resending OTP.");
    }
  };

  const handleEmailSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/user-api/check-email", { email });
      if (response.data.success) {
        setStep(2);
        setMessage(response.data.message);
        setError("");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error sending OTP.");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/user-api/verify-otp", { email, otp });
      if (response.data.success) {
        setStep(3);
        setMessage(response.data.message);
        setError("");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error verifying OTP.");
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/user-api/reset-password", { email, newPassword, confirmNewPassword });
      if (response.data.success) {
        setStep(4);
        setMessage(response.data.message);
        setError("");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error resetting password.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-heading">Forgot Password?</h2>
      {step === 1 && (
        <div>
          <p>Enter your registered email to receive OTP</p>
          <input className="forgot-password-input"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {message && <p className="success-message-fp">{message}</p>}
          {error && <p className="error-message-fp">{error}</p>}
          <button className="forgot-password-button" onClick={handleEmailSubmit}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p>Enter the OTP sent to your email</p>
          <input className="forgot-password-input"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {message && <p className="success-message-fp">{message}</p>}
          {error && <p className="error-message-fp">{error}</p>}
          <button className="forgot-password-button" onClick={handleOtpSubmit}>Verify OTP</button>
          <div style={{ marginTop: "10px" }}>
            {canResend ? (
              <button className="fp-resend-otp-button" onClick={handleResendOTP}>
                Resend OTP
              </button>
            ) : (
              <p>Resend OTP in {timer}s</p>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p>Enter your new password</p>
          <input className="forgot-password-input"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="forgot-password-input"
            type="password"
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {message && <p className="success-message-fp">{message}</p>}
          {error && <p className="error-message-fp">{error}</p>}
          <button className="forgot-password-button" onClick={handlePasswordReset}>Reset Password</button>
        </div>
      )}

      {step === 4 && (
        <div>
          <p>Password reset successfully. You can now log in.</p>
          {message && <p className="success-message-fp">{message}</p>}
          {error && <p className="error-message-fp">{error}</p>}
        </div>
      )}

    </div>
  );
};

export default ForgotPassword;
