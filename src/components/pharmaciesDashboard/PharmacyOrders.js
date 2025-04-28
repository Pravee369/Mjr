import React, { useEffect, useState } from "react";
import axios from "axios";

const PharmacyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(
          "http://localhost:3000/pharmacies/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
        setFilteredOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = orders.filter((order) =>
      order._id.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  };

  const handleAccept = async (orderId) => {
    try {
      let token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/pharmacies/orders/${orderId}`,
        { status: "Accepted" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Order accepted successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Accepted" } : order
        )
      );
    } catch (err) {
      console.error("Error accepting order:", err);
      alert("Failed to accept order. Please try again.");
    }
  };

  const handleReject = async (orderId) => {
    const rejectionReason = prompt("Enter the reason for rejection:");
    if (!rejectionReason) return;

    try {
      let token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/pharmacies/orders/${orderId}`,
        { status: "Rejected", rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Order rejected successfully!");
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (err) {
      console.error("Error rejecting order:", err);
      alert("Failed to reject order. Please try again.");
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="mt-4 p-2 bg-white shadow rounded">
      <h2 className="border-bottom pb-2">Pharmacy Orders</h2>

      {/* Search Filter */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-muted">No orders found.</p>
      ) : (
        <div className="row">
          {filteredOrders.map((order) => (
            <div key={order._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Order ID: {order._id}</h5>
                  <p className="card-text">
                    <strong>Customer Name:</strong> {order.userName}
                  </p>
                  <p className="card-text">
                    <strong>Email:</strong> {order.email}
                  </p>
                  <p className="card-text">
                    <strong>Phone:</strong> {order.phone}
                  </p>
                  <p className="card-text">
                    <strong>Address:</strong> {order.address}
                  </p>
                  <p className="card-text">
                    <strong>Medicines:</strong>
                    <ul>
                      {order.cart.map((item, index) => (
                        <li key={index}>
                          {item.name} - ₹{item.price.toFixed(2)} (Qty:{" "}
                          {item.quantity})
                        </li>
                      ))}
                    </ul>
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleAccept(order._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(order._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PharmacyOrders;
