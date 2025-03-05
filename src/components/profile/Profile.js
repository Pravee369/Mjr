import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { loginContext } from "../contexts/loginContext";
import "./profile.css";
import defaultProfile from "../../images/default-profile.png";

const Profile = () => {
  let [currentUser, error, userLoginStatus, loginUser, logoutUser] = useContext(loginContext);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(defaultProfile);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        ...currentUser,
      }));
      if (currentUser.photo) {
        setPreview(currentUser.photo);
      }
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDeletePhoto = () => {
    setImage(null);
    setPreview(defaultProfile);
    setFormData({ ...formData, photo: "" });
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "photo") {
          formDataToSend.append(key, value);
        }
      });

      if (image) {
        formDataToSend.append("photo", image);
      } else if (formData.photo === "") {
        formDataToSend.append("photo", "");
      }

      const response = await axios.put(
        "http://localhost:3000/profile-api/edit-profile",
        formDataToSend,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(response.data.payload));
        
        loginUser(response.data.payload);
        setFormData(response.data.payload);
        setPreview(response.data.payload.photo || defaultProfile);
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

  if (!currentUser || Object.keys(currentUser).length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-header">Profile</h2>
      
      {currentUser.category === "Doctor" && (
        <>
          <div className="profile-photo-container">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Profile"
                  className="profile-photo"
                />
                {editable && (
                  <button
                    onClick={handleDeletePhoto}
                    className="delete-photo-btn"
                  >
                    Delete Photo
                  </button>
                )}
              </>
            ) : (
              <p>No photo uploaded</p>
            )}
          </div>
          <div className="profile-details">
            <p>
              {editable && <><strong>Change Profile Photo :</strong><input type="file" accept="image/*" onChange={handleImageChange} className="my-2" /></>}
            </p>
          </div>
        </>
      )}

      <div className="profile-details">
        <p>
          <strong>Name :</strong>{" "}
          {editable ? <input name="name" value={formData.name || ""} onChange={handleChange} /> : currentUser.name}
        </p>
        <p>
          <strong>Mobile :</strong>{" "}
          {editable ? <input name="mobile" value={formData.mobile || ""} onChange={handleChange} /> : currentUser.mobile}
        </p>

        {currentUser.category === "Doctor" && (
          <>
            <p>
              <strong>Gender :</strong>{" "}
              {editable ? <input name="gender" value={formData.gender || ""} onChange={handleChange} /> : currentUser.gender}
            </p>
            <p>
              <strong>Specialization :</strong>{" "}
              {editable ? (
                <input name="specialization" value={formData.specialization || ""} onChange={handleChange} />
              ) : (
                currentUser.specialization
              )}
            </p>
            <p>
              <strong>Experience :</strong>{" "}
              {editable ? (
                <input name="experience" type="number" value={formData.experience || ""} onChange={handleChange} />
              ) : (
                currentUser.experience
              )}
            </p>
            <p>
              <strong>License Number :</strong>{" "}
              {editable ? (
                <input name="licenseNumber" type="text" value={formData.licenseNumber || ""} onChange={handleChange} />
              ) : (
                currentUser.licenseNumber
              )}
            </p>
            <p>
              <strong>Hospital Name :</strong>{" "}
              {editable ? (
                <input name="hospitalName" type="text" value={formData.hospitalName || ""} onChange={handleChange} />
              ) : (
                currentUser.hospitalName
              )}
            </p>
            <p>
              <strong>Location :</strong>{" "}
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
              <strong>Age :</strong>{" "}
              {editable ? <input name="age" type="number" value={formData.age || ""} onChange={handleChange} /> : currentUser.age}
            </p>
            <p>
              <strong>Gender :</strong>{" "}
              {editable ? <input name="gender" value={formData.gender || ""} onChange={handleChange} /> : currentUser.gender}
            </p>
          </>
        )}

        {currentUser.category === "Organization" && (
          <>
            <p>
              <strong>Organization Type :</strong>{" "}
              {editable ? (
                <input name="organizationType" value={formData.organizationType || ""} onChange={handleChange} />
              ) : (
                currentUser.organizationType
              )}
            </p>
            <p>
              <strong>Registration Number :</strong>{" "}
              {editable ? <input name="regNo" value={formData.regNo || ""} onChange={handleChange} /> : currentUser.regNo}
            </p>
          </>
        )}

        {editable ? (
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
        ) : (
          <button onClick={() => setEditable(true)} className="edit-btn">
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
