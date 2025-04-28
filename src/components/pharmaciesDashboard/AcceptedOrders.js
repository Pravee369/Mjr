import React, { useEffect, useState } from "react";
import axios from "axios";

const AcceptedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      try {
        let token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const pharmacyId = user.username;

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/pharmacies/orders/accepted?pharmacyId=${pharmacyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching accepted orders:", err);
        setError("Failed to fetch accepted orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchAcceptedOrders();
  }, []);

  if (loading) return <p>Loading accepted orders...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="mt-4 my-3 p-3 bg-white shadow rounded">
      <h2 className="border-bottom pb-2">Accepted Orders</h2>

      {orders.length === 0 ? (
        <p className="text-muted">No accepted orders found.</p>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-md-5 mb-4">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedOrders;
