import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";

function Register() {
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Patient");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    unregister,
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  useEffect(() => {
    // Unregister unused fields when category changes
    if (category === "Patient") {
      unregister([
        "specialization",
        "experience",
        "licenseNumber",
        "hospitalName",
        "location",
        "photo",
        "regNo",
        "organizationType",
      ]);
    } else if (category === "Doctor") {
      unregister([
        "regNo",
        "age",
        "organizationType",
      ]);
    } else if (category === "Organization") {
      unregister([
        "specialization",
        "experience",
        "licenseNumber",
        "hospitalName",
        "location",
        "gender",
        "age",
        "photo",
      ]);
    }
  }, [category, unregister]);
  
  const addNewUser = (newUser) => {
    newUser["category"] = category;
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    console.log(newUser);
    const formData = new FormData();

  // Append all user data to FormData
    Object.keys(newUser).forEach((key) => {
      if (key !== "photo") {
        formData.append(key, newUser[key]); // Add all fields except photo
      }
    });

    // Append the photo file (only if uploaded)
    if (newUser.photo) {
      formData.append("photo", newUser.photo); // Select the first file
    }

    console.log("FormData content:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    axios
      .post("http://localhost:3000/user-api/register-user", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Important for file uploads
      })
      .then((response) => {
        if (response.status === 201) {
          navigate("/login");
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="register">
      <div className="wrapper">
        <div className="title-text">
          <div className="title">{category} Signup</div>
        </div>
        <div className="form-container">
        {error && <p className="error-message-top">{error}</p>}
          <div className="slide-controls">
            <input type="radio" name="slide" id="patient" defaultChecked />
            <input type="radio" name="slide" id="doctor" />
            <input type="radio" name="slide" id="organization" />
            <label
              htmlFor="patient"
              className="slide patient"
              onClick={() => setCategory("Patient")}
            >
              Patient
            </label>
            <label
              htmlFor="doctor"
              className="slide doctor"
              onClick={() => setCategory("Doctor")}
            >
              Doctor
            </label>
            <label
              htmlFor="organization"
              className="slide organization"
              onClick={() => setCategory("Organization")}
            >
              Organization
            </label>
            <div className="slider-tab"></div>
          </div>
          <div className="form-inner">
            <form
              action="#"
              className="signup"
              onSubmit={handleSubmit(addNewUser)}
            >
              <div className="field">
                <input
                  type="text"
                  placeholder="Email Address"
                  {...register("username")}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Create Password"
                  {...register("password", { required: "Password is required" })}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword", { required: "Please confirm your password" })}
                />
              </div>
              {category === "Patient" && (
                <>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Name"
                      {...register("name")}
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Contact Number"
                      {...register("mobile")}
                      required
                    />
                  </div>
                  <div className="field">
                    <select
                      {...register("gender", { required: true })}
                      defaultValue=""
                      onChange={(e) => {
                        e.target.style.color = e.target.value ? "#000" : "#999";
                      }}
                      style={{ color: "#999" }}
                    >
                      <option value="" disabled hidden>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <input
                      type="number"
                      placeholder="Age"
                      {...register("age")}
                      required
                    />
                  </div>
                </>
              )}

              {category === "Doctor" && (
                <>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Name"
                      {...register("name")}
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Contact Number"
                      {...register("mobile")}
                      required
                    />
                  </div>
                  <div className="field">
                    <select
                      {...register("gender", { required: true })}
                      defaultValue=""
                      onChange={(e) => {
                        e.target.style.color = e.target.value ? "#000" : "#999";
                      }}
                      style={{ color: "#999" }}
                    >
                      <option value="" disabled hidden>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Specialization"
                      {...register("specialization")}
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="number"
                      placeholder="Experience (Years)"
                      {...register("experience")}
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="License Number"
                      {...register("licenseNumber")}
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Hospital Name"
                      {...register("hospitalName")}
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Location"
                      {...register("location")}
                      required
                    />
                  </div>
                  <div class="form-input-upload-man">
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setValue("photo", file); // Store the file in react-hook-form manually
                    }}
                  />
                  </div>
                </>
              )}

              {category === "Organization" && (
                <>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Organization Name"
                      {...register("name")}
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Contact Number"
                      {...register("mobile")}
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Registration Number"
                      {...register("regNo")}
                      required
                    />
                  </div>
                  <div className="field">
                    <select
                      {...register("organizationType", { required: true })}
                      defaultValue=""
                      onChange={(e) => {
                        e.target.style.color = e.target.value ? "#000" : "#999";
                      }}
                      style={{ color: "#999" }}
                    >
                      <option value="" disabled hidden>
                        Select Organization Type
                      </option>
                      <option value="Hospital">Hospital</option>
                      <option value="Clinic">Clinic</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Blood Bank">Blood Bank</option>
                      <option value="Organ Bank">Organ Bank</option>
                      <option value="Equipment Renter">
                        Equipment Renter
                      </option>
                    </select>
                  </div>
                </>
              )}
              
              <div className="field btn">
                <input type="submit" value="Signup" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;