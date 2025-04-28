import { useNavigate } from "react-router-dom";
import { pharmaStore } from "./PharmacyStore";
import { observer } from "mobx-react";
import {useState} from "react";

const CartPage = observer(() => {
  let navigate = useNavigate();
  let [address,setAddress]=useState("")
  return (
    <div className="container mt-4 p-4 bg-white shadow rounded">
      <h2 className="border-bottom pb-2">Shopping Cart</h2>
      {pharmaStore.cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        pharmaStore.cart.map((item) => (
          <div
            key={item.name}
            className="d-flex justify-content-between align-items-center p-3 border-bottom"
          >
            <div>
              <p
                className="font-weight-bold"
                style={{ display: "inline-block" }}
              >
                {item.name}
              </p>
              <p
                className="card-price"
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: "#10b981", // Emerald green
                  marginLeft: "1rem",
                  display: "inline-block",
                }}
              >
                ₹{item.price.toFixed(2)}
              </p>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-secondary"
                  onClick={() => pharmaStore.decreaseQuantity(item.name)}
                >
                  -
                </button>
                <span className="mx-2 font-weight-bold">{item.quantity}</span>
                <button
                  className="btn btn-secondary"
                  onClick={() => pharmaStore.increaseQuantity(item.name)}
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => pharmaStore.removeFromCart(item.name)}
            >
              Remove
            </button>
          </div>
        ))
      )}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <button
          className="btn btn-danger"
          onClick={() => {
            navigate("/pharmacies/checkout");
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
});

export default CartPage;
