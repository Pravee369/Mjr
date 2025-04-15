import React, { useState, useContext } from "react";
import { loginContext } from "../contexts/loginContext";
import axios from "axios";
import "./AddTest.css";

const AddTest = () => {
  const [currentUser] = useContext(loginContext);

  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    price: "",
    sampleType: "",
    resultTime: "",
    instructions: "",
    slotDuration: "30",
    maxBookingsPerSlot: "1",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      username: currentUser.username, 
    };

    try {
      const response = await fetch("http://localhost:3000/lab-tests/add-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Test added successfully!");
        setFormData({
          testName: "",
          description: "",
          price: "",
          sampleType: "",
          resultTime: "",
          instructions: "",
          slotDuration: "30",
          maxBookingsPerSlot: "1",
        });
      } 
      else if(response.status === 409) {
        alert(data.message);  

      }
      else {
        alert("Failed to add test: " + data.message);
      }
    } catch (error) {
      console.error("Error adding test:", error);
      alert("An error occurred while adding the test.");
    }
  };

  return (
    <div className="add-test-container">
      <h2>Add New Test</h2>
      <form onSubmit={handleSubmit} className="add-test-form">
        <input
          type="text"
          name="testName"
          placeholder="Test Name"
          value={formData.testName}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Test Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="sampleType"
          placeholder="Sample Type (e.g., Blood, Urine)"
          value={formData.sampleType}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price (in ₹)"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="resultTime"
          placeholder="Result Time (e.g., 24 hrs)"
          value={formData.resultTime}
          onChange={handleChange}
        />
        <textarea
          name="instructions"
          placeholder="Any Special Instructions"
          value={formData.instructions}
          onChange={handleChange}
        />

        <h4 className="slot-section-title">Slot Configuration</h4>

        <div className="slot-settings-group">
          <div className="form-group">
            <label htmlFor="slotDuration">Slot Duration</label>
            <select
              id="slotDuration"
              name="slotDuration"
              value={formData.slotDuration}
              onChange={handleChange}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="maxBookingsPerSlot">Max Bookings Per Slot</label>
            <input
              id="maxBookingsPerSlot"
              type="number"
              name="maxBookingsPerSlot"
              min="1"
              value={formData.maxBookingsPerSlot}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit">Add Test</button>
      </form>
    </div>
  );
};

export default AddTest;
