import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginContext } from "../contexts/loginContext";
import "./Login.css";
import ForgotPassword from "../forgotPassword/ForgotPassword";

function Login() {
  let [currentUser, error, userLoginStatus, loginUser] = useContext(loginContext);

  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  let { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (userLoginStatus === true) {
      let user = JSON.parse(localStorage.getItem("user"));
      let token = localStorage.getItem("token");
      
      if (user?.mobile) {
        setMobile(user.mobile);
        sendOtp(user.mobile, token);
      }
    }
  }, [userLoginStatus]);

  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
  }, [otpSent, timer]);

  const sendOtp = (phone, token) => {
    axios
      .post(
        "http://localhost:3000/otp-auth/send-otp",
        { phone },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log("OTP sent successfully:", res);
        setOtpSent(true);
        setTimer(60);
        setResendDisabled(true);
      })
      .catch((err) => {
        console.error("Error sending OTP:", err);
      });
  };

  const handleVerifyOtp = () => {

    if (timer <= 0) {
      alert("OTP has expired. Please request a new one.");
      setOtp("")
      return;
    }
    let token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:3000/otp-auth/verify-otp",
        { phone: mobile, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success) {
          console.log("OTP Verified Successfully");
          // let user = JSON.parse(localStorage.getItem("user"));
          // let userName;
          // if(user) userName = user.name.replace(/\s+/g, "-") ;
          // else userName=""
          navigate("/");
        } else {
          alert("Invalid OTP. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error verifying OTP:", err);
      });
  };

  return userLoginStatus === true ? (
    otpSent ? <div className="overlay">
    <div className="otp-verification">
      <h3 className="text-white">Enter OTP</h3>
      <input
        type="text"
        id="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button className="btn text-white bg-danger m-2" onClick={handleVerifyOtp}>
        Confirm
      </button>
      <p className="text-white lead">OTP expires in: {timer} seconds</p>
      <button
        className="btn text-white bg-danger border border-danger"
        onClick={() => { sendOtp(mobile, localStorage.getItem("token")); setOtp(""); }}
        disabled={resendDisabled}
      >
        Resend OTP
      </button>
    </div>
  </div>: (
      <p>Sending OTP...</p>
    )
  ) : (
    <div className="login">
      <div className="wrapper">
        <div className="add-user mt-0">
          <div className="title-text">
            <div className="title">Account Login</div>
          </div>
          {error && error.length !== 0 && (
            <p className="text-danger text-center">
              <b>{error}</b>
            </p>
          )}
          <div>
            <form onSubmit={handleSubmit(loginUser)}>
              <div className="field">
                <input
                  type="email"
                  placeholder="Email Id"
                  {...register("username", { required: true })}
                  required
                />
              </div>
              {errors.username && <p className="text-danger fw-bold fs-5">* Email Id is required</p>}
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: true })}
                  required
                />
              </div>
              {errors.password && <p className="text-danger fw-bold fs-5">* Password is required</p>}
              <a
                href="#"
                className="forgot-password"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  console.log("Forgot Password clicked");
                  setShowForgotPassword(true);
                }}
              >
                Forgot Password?
              </a>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
              </div>
            </form>
          </div>
        </div>
      </div>
      {showForgotPassword && (
        <div className="modal-overlay-fp" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-fp" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn-fp" onClick={() => setShowForgotPassword(false)}>✖</button>
            <ForgotPassword />
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
