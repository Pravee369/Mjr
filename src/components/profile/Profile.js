import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { loginContext } from "../contexts/loginContext";

const Profile = () => {
  let [currentUser, error, userLoginStatus, loginUser, logoutUser] = useContext(loginContext);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormData(currentUser); // Load user data into the form
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3000/profile-api/edit-profile",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
        // Update local storage for persistence
        localStorage.setItem("user", JSON.stringify(response.data.payload));
        
        loginUser(response.data.payload);
        setFormData(response.data.payload); 

        setEditable(false);
        window.location.reload();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <p>
        <strong>Name:</strong>{" "}
        {editable ? <input name="name" value={formData.name || ""} onChange={handleChange} /> : currentUser.name}
      </p>
      <p>
        <strong>Mobile:</strong>{" "}
        {editable ? <input name="mobile" value={formData.mobile || ""} onChange={handleChange} /> : currentUser.mobile}
      </p>

      {currentUser.category === "Doctor" && (
        <>
          <p>
            <strong>Gender:</strong>{" "}
            {editable ? <input name="gender" value={formData.gender || ""} onChange={handleChange} /> : currentUser.gender}
          </p>
          <p>
            <strong>Specialization:</strong>{" "}
            {editable ? (
              <input name="specialization" value={formData.specialization || ""} onChange={handleChange} />
            ) : (
              currentUser.specialization
            )}
          </p>
          <p>
            <strong>Experience:</strong>{" "}
            {editable ? (
              <input name="experience" type="number" value={formData.experience || ""} onChange={handleChange} />
            ) : (
              currentUser.experience
            )}
          </p>
          <p>
            <strong>License Number:</strong>{" "}
            {editable ? (
              <input name="licenseNumber" type="text" value={formData.licenseNumber || ""} onChange={handleChange} />
            ) : (
              currentUser.licenseNumber
            )}
          </p>
          <p>
            <strong>Hospital Name:</strong>{" "}
            {editable ? (
              <input name="hospitalName" type="text" value={formData.hospitalName || ""} onChange={handleChange} />
            ) : (
              currentUser.hospitalName
            )}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            {editable ? (
              <input name="location" type="text" value={formData.location || ""} onChange={handleChange} />
            ) : (
              currentUser.location
            )}
          </p>
        </>
      )}

      {currentUser.category === "Patient" && (
        <>
          <p>
            <strong>Age:</strong>{" "}
            {editable ? <input name="age" type="number" value={formData.age || ""} onChange={handleChange} /> : currentUser.age}
          </p>
          <p>
            <strong>Gender:</strong>{" "}
            {editable ? <input name="gender" value={formData.gender || ""} onChange={handleChange} /> : currentUser.gender}
          </p>
        </>
      )}

      {currentUser.category === "Organization" && (
        <>
          <p>
            <strong>Organization Type:</strong>{" "}
            {editable ? (
              <input name="organizationType" value={formData.organizationType || ""} onChange={handleChange} />
            ) : (
              currentUser.organizationType
            )}
          </p>
          <p>
            <strong>Registration Number:</strong>{" "}
            {editable ? <input name="regNo" value={formData.regNo || ""} onChange={handleChange} /> : currentUser.regNo}
          </p>
        </>
      )}

      {editable ? (
        <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Save
        </button>
      ) : (
        <button onClick={() => setEditable(true)} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
          Edit
        </button>
      )}
    </div>
  );
};

export default Profile;
