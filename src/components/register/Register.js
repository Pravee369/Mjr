// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import './Register.css';
// import axios from "axios";

// function Register() {
//   const [error, setError] = useState("");
//   const [category, setCategory] = useState("Patient");

//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const patientBtn = document.querySelector("label.patient");
//     const doctorBtn = document.querySelector("label.doctor");
//     const orgBtn = document.querySelector("label.organization");

//     if (patientBtn && doctorBtn && orgBtn) {
//       patientBtn.onclick = () => {
//         setCategory("Patient");
//       };
//       doctorBtn.onclick = () => {
//         setCategory("Doctor");
//       };
//       orgBtn.onclick = () => {
//         setCategory("Organization");
//       };
//     }
//   }, []);

//   const addNewUser = (newUser) => {

//     // newUser['category'] = category;
//     // console.log(newUser);
//     console.log(newUser);
//     newUser["category"]=category;
//     newUser=JSON.stringify(newUser);
//     console.log(newUser);
//     axios.post("http://localhost:3000/user-api/register-user", newUser)
//       .then((response) => {
//         if (response.status === 201) {
//           navigate("/login");
//         } else {
//           setError(response.data.message);
//         }
//       })
//       .catch((err) => {
//         setError(err.message);
//       });
//   };

//   return (
//     <div className = 'register'>
//       <div className="wrapper">
//         <div className="title-text">
//           <div className="title">{category} Signup</div>
//         </div>
//         <div className="form-container">
//           <div className="slide-controls">
//             <input type="radio" name="slide" id="patient" defaultChecked />
//             <input type="radio" name="slide" id="doctor" />
//             <input type="radio" name="slide" id="organization" />
//             <label htmlFor="patient" className="slide patient">Patient</label>
//             <label htmlFor="doctor" className="slide doctor">Doctor</label>
//             <label htmlFor="organization" className="slide organization">Organization</label>
//             <div className="slider-tab"></div>
//           </div>
//           <div className="form-inner">
//             <form action="#" className="signup" onSubmit={handleSubmit(addNewUser)}>
//               <div className="field">
//                 <input type="text" placeholder="Email Address" {...register('email')} required />
//               </div>
//               <div className="field">
//                 <input type="password" placeholder="Create Password" {...register('password')} required />
//               </div>
//               <div className="field">
//                 <input type="password" placeholder="Confirm Password" required />
//               </div>
//               {category === "Patient" && (
//                 <>
//                   <div className="field">
//                     <input type="text" placeholder="Name" {...register('username')} required />
//                   </div>
//                   <div className="field">
//                     <input type="text" placeholder="Contact Number" {...register('mobile')} required />
//                   </div>
//                   <div className="field">
//                     {/* <label>Gender:</label> */}
//                     <select
//                       {...register("gender", { required: true })}
//                       defaultValue=""
//                       onChange={(e) => {
//                         e.target.style.color = e.target.value ? "#000" : "#999";
//                       }}
//                       style={{ color: "#999" }}
//                     >
//                       <option value="" disabled hidden>
//                         Select Gender
//                       </option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                   <div className="field">
//                     <input type="number" placeholder="Age" {...register('age')} required />
//                   </div>
//                 </>
//               )}

//               {category === "Doctor" && (
//                 <>
//                   <div className="field">
//                     <input type="text" placeholder="Name" {...register('username')} required />
//                   </div>
//                   <div className="field">
//                     <input type="text" placeholder="Contact Number" {...register('mobile')} required />
//                   </div>
//                   <div className="field">
//                     <select
//                       {...register("gender", { required: true })}
//                       defaultValue=""
//                       onChange={(e) => {
//                         e.target.style.color = e.target.value ? "#000" : "#999";
//                       }}
//                       style={{ color: "#999" }}
//                     >
//                       <option value="" disabled hidden>
//                         Select Gender
//                       </option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                   <div className="field">
//                     <input type="text" placeholder="Specialization" {...register('specialization')} required />
//                   </div>
//                   <div className="field">
//                     <input type="number" placeholder="Experience (Years)" {...register('experience')} required />
//                   </div>
//                   <div className="field">
//                     <input type="text" placeholder="License Number" {...register('license-number')} required />
//                   </div>
//                   <div className="field">
//                     <input type="text" placeholder="Hospital Name" {...register('hospital-name')} required />
//                   </div>
//                   <div className="field">
//                     <input type="text" placeholder="Location" {...register('location')} required />
//                   </div>
//                   <div class="form-input-upload-man">
//                     <input
//                       id="images"
//                       type="file"
//                       placeholder="upload"
//                       {...register("photo", { required: true })}
//                     />
//                   </div>
//                 </>
//               )}

//               {category === "Organization" && (
//                 <>
//                   <div className="field">
//                     <input type="text" placeholder="Organization Name" {...register('username')} required />
//                   </div>
//                   <div className="field">
//                     <input type="text" placeholder="Contact Number" {...register('mobile')} required />
//                   </div>
//                   <div className="field">
//                     <input type="text" placeholder="Registration Number" {...register('reg-no')} required />
//                   </div>
//                   <div className="field">
//                     {/* <label>Gender:</label> */}
//                     <select
//                       {...register("organization-type", { required: true })}
//                       defaultValue=""
//                       onChange={(e) => {
//                         e.target.style.color = e.target.value ? "#000" : "#999";
//                       }}
//                       style={{ color: "#999" }}
//                     >
//                       <option value="" disabled hidden>
//                         Select Organization Type
//                       </option>
//                       <option value="Hospital">Hospital</option>
//                       <option value="Clinic">Clinic</option>
//                       <option value="Pharmacy">Pharmacy</option>
//                       <option value="Laboratory">Laboratory</option>
//                       <option value="Blood Bank">Blood Bank</option>
//                       <option value="Oragn Bank">Organ Bank</option>
//                       <option value="Equipment Renter">Equipment Renter</option>
//                     </select>
//                   </div>
//                 </>
//               )}
//               <div className="field btn">
//                 {/* <div className="btn-layer"></div> */}
//                 <input type="submit" value="Signup"/>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;



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
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password", "");
  // useEffect(() => {
  //   const patientBtn = document.querySelector("label.patient");
  //   const doctorBtn = document.querySelector("label.doctor");
  //   const orgBtn = document.querySelector("label.organization");

  //   if (patientBtn && doctorBtn && orgBtn) {
  //     patientBtn.onclick = () => {
  //       setCategory("Patient");
  //     };
  //     doctorBtn.onclick = () => {
  //       setCategory("Doctor");
  //     };
  //     orgBtn.onclick = () => {
  //       setCategory("Organization");
  //     };
  //   }
  // }, []);

  const addNewUser = (newUser) => {
    newUser['category']=category
    console.log(newUser);
    axios
      .post("http://localhost:3000/user-api/register-user", newUser)
      .then((response) => {
        console.log(response)
        if (response.status === 201) {
          console.log('status 201')
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
          <div className="slide-controls">
            <input type="radio" name="slide" id="patient" defaultChecked />
            <input type="radio" name="slide" id="doctor" />
            <input type="radio" name="slide" id="organization" />
            {/* <label htmlFor="patient" className="slide patient">
              Patient
            </label>
            <label htmlFor="doctor" className="slide doctor">
              Doctor
            </label>
            <label htmlFor="organization" className="slide organization">
              Organization
            </label> */}
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
              {/* <div className="field">
                <input
                  type="password"
                  placeholder="Create Password"
                  {...register("password")}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                />
              </div> */}
              <div className="field">
                <input
                  type="password"
                  placeholder="Create Password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <p className="error-message">{errors.password.message}</p>}
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
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
                    {/* <label>Gender:</label> */}
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
                      placeholder="upload"
                      {...register("photo", { required: true })}
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
                    {/* <label>Gender:</label> */}
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
                      <option value="Equipment Renter">Equipment Renter</option>
                    </select>
                  </div>
                </>
              )}
              <div className="field btn">
                {/* <div className="btn-layer"></div> */}
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
