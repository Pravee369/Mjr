import { observer } from "mobx-react";
import React from "react";

const OrderSuccessful = observer(() => {
  return (
    <div className="container mt-5">
      <h2>Checkout</h2>
      <p>Thank you for your order!</p>
      <p>Your order has been placed successfully.</p>
      <p>We will contact you shortly with the details.</p>
    </div>
  );
});

export default OrderSuccessful;
