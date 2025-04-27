import React, { useEffect, useState } from "react";
import axios from "axios";
import { loginContext } from "../contexts/loginContext";
import { useContext } from "react";

const PharmacyMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMedicine, setEditingMedicine] = useState(null); // Track the medicine being edited
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    available: true,
  });
  let [currentUser] = useContext(loginContext);
  let userName = currentUser?.name?.replace(/\s+/g, "-") || "Guest";
  console.log("user is", currentUser);
  let pharmacyId = currentUser.username;
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/pharmacies/medicines?pharmacyId=${pharmacyId}`
        );
        setMedicines(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setError("Failed to fetch medicines. Please try again later.");
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleEditClick = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      price: medicine.price,
      image: medicine.image,
      available: medicine.available,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/pharmacies/medicines/${editingMedicine._id}`,
        formData
      );
      alert("Medicine updated successfully!");
      setEditingMedicine(null);

      // Update the medicines list locally
      setMedicines((prevMedicines) =>
        prevMedicines.map((medicine) =>
          medicine._id === editingMedicine._id
            ? { ...medicine, ...formData }
            : medicine
        )
      );
    } catch (err) {
      console.error("Error updating medicine:", err);
      alert("Failed to update medicine. Please try again.");
    }
  };

  if (loading) return <p>Loading medicines...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="mt-4 p-4 bg-white shadow rounded">
      <h2 className="border-bottom pb-2">Medicines</h2>
      {medicines.length === 0 ? (
        <p className="text-muted">No medicines available.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Image</th>
              <th>Medicine Name</th>
              <th>Price (₹)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine._id}>
                <td>
                  <img
                    src={medicine.image}
                    alt={medicine.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{medicine.name}</td>
                <td>₹{medicine.price.toFixed(2)}</td>
                <td>
                  {medicine.available ? (
                    <span className="text-success">Available</span>
                  ) : (
                    <span className="text-danger">Unavailable</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEditClick(medicine)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editingMedicine && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setEditingMedicine(null)}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <h4>Edit Medicine</h4>
            <div className="" style={{ marginTop: "0.5rem" }}>
              <label>Medicine Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="" style={{ marginTop: "0.5rem" }}>
              <label>Price (₹)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="" style={{ marginTop: "0.5rem" }}>
              <label>Image URL</label>
              <input
                type="text"
                className="form-control"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-check" style={{ marginTop: "0.5rem" }}>
              <input
                type="checkbox"
                className="form-check-input"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
              />
              <label className="form-check-label">Available</label>
            </div>
            <div className="mt-3" style={{ display:"flex",justifyContent:"space-between",alignitems:"center" }}>
              <button
                className="btn btn-secondary mr-2"
                onClick={() => setEditingMedicine(null)}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyMedicines;
