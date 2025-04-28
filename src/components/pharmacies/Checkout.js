import { observer } from "mobx-react";
import { pharmaStore } from "./PharmacyStore";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginContext } from "../contexts/loginContext";

const Checkout = observer(() => {
  let [currentUser] = useContext(loginContext);

  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const calculateTotal = () => {
    return pharmaStore.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handlePlaceOrder = () => {
    if (!address.trim() || !phone.trim()) {
      setError("Please provide both a delivery address and a phone number.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    setShowModal(true);
  };
  const confirmOrder = async () => {
    try {
      const orderDetails = {
        userName: currentUser.name, // Assuming user details are stored in pharmaStore
        email: currentUser.username,
        phone,
        address,
        cart: pharmaStore.cart,
        pharmacyId: pharmaStore.selectedPharmacyId,
      };
      let token = localStorage.getItem("token"); // Ensure this is correct
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await axios.post(
        "http://localhost:3000/pharmacies/orders",
        orderDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Order placed successfully!");
        setShowModal(false);
        navigate("/pharmacies/order-success");
        pharmaStore.clearCart();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setShowModal(false);
      alert("Failed to place the order. Please try again.");
    }
  };

  return (
    <div className="container mt-4 p-4 bg-white shadow rounded">
      <h2 className="border-bottom pb-2">Checkout</h2>
      {pharmaStore.cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
                <th>Subtotal (₹)</th>
              </tr>
            </thead>
            <tbody>
              {pharmaStore.cart.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <h4>Delivery Details</h4>
            <textarea
              className="form-control mb-3"
              rows="3"
              placeholder="Enter your delivery address here..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>
          <div
            className="d-flex justify-content-end mt-4"
            style={{ fontSize: "1.2rem", fontWeight: "bold" }}
          >
            <p>Total Amount: ₹{calculateTotal().toFixed(2)}</p>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-success" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}

      {/* Modal for confirmation */}
      {showModal && (
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
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <h4>Confirm Your Order</h4>
            <p>
              <strong>Delivery Address:</strong>
            </p>
            <p>{address}</p>
            <p>
              <strong>Phone Number:</strong>
            </p>
            <p>{phone}</p>
            <p>
              <strong>Total Amount:</strong> ₹{calculateTotal().toFixed(2)}
            </p>
            <div style={{ marginTop: "20px" }}>
              <button
                className="btn btn-secondary"
                style={{
                  marginRight: "10px",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#007bff",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={confirmOrder}
              >
                Yes, Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Checkout;
