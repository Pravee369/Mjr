import React, { useState } from "react";
import axios from "axios";
import { loginContext } from "../contexts/loginContext";
import { useContext } from "react";

const AddMedicine = () => {
  let [currentUser] = useContext(loginContext);
  let userName = currentUser?.name?.replace(/\s+/g, "-") || "Guest";
  const [formData, setFormData] = useState({
    name: "",
    composition: "",
    uses: "",
    sideEffects: "",
    image: "",
    price: "",
    pharmacyId: currentUser.username,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (
        !formData.name ||
        !formData.composition ||
        !formData.uses ||
        !formData.sideEffects ||
        !formData.image ||
        !formData.price
      ) {
        setErrorMessage("All fields are required.");
        return;
      }
      console.log("current user is", currentUser);
      setFormData({
        ...formData,
        pharmacyId: currentUser.username,
      });
      console.log(formData);
      // Send data to the backend
      await axios
        .post("http://localhost:3000/pharmacies/medicines", {
          ...formData,
          pharmacyId: currentUser.username,
        })
        .then((resp) => {
          console.log("Added med", resp);
        });
      setSuccessMessage("Medicine added successfully!");
      setFormData({
        name: "",
        composition: "",
        uses: "",
        sideEffects: "",
        image: "",
        price: "",
        pharmacyId: "",
      });
      setErrorMessage("");
    } catch (err) {
      console.error("Error adding medicine:", err);
      setErrorMessage("Failed to add medicine. Please try again.");
    }
  };

  return (
    <div className="mt-4 p-4 bg-white shadow rounded" style={{maxWidth:'500px'}}>
      <h2 className="border-bottom pb-2">Add Medicine</h2>
      {successMessage && <p className="text-success">{successMessage}</p>}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="name">Medicine Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="composition">Composition</label>
          <input
            type="text"
            id="composition"
            name="composition"
            className="form-control"
            value={formData.composition}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="uses">Uses</label>
          <textarea
            id="uses"
            name="uses"
            className="form-control"
            rows="3"
            value={formData.uses}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="sideEffects">Side Effects</label>
          <textarea
            id="sideEffects"
            name="sideEffects"
            className="form-control"
            rows="3"
            value={formData.sideEffects}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            className="form-control"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="price">Price (₹)</label>
          <input
            type="number"
            id="price"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Add Medicine
        </button>
      </form>
    </div>
  );
};

export default AddMedicine;
