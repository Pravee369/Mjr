import React, { useState, useContext } from "react";
import { loginContext } from "../contexts/loginContext";
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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      username: currentUser.username, // Lab’s email ID
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
        });
      } else {
        alert("Failed to add test: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
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
        <button type="submit">Add Test</button>
      </form>
    </div>
  );
};

export default AddTest;
