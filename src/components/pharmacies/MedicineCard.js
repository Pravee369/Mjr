import { pharmaStore } from "./PharmacyStore";
import { observer } from "mobx-react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const MedicineCard = observer(({ medicine }) => {
  const itemInCart = pharmaStore.cart.find(
    (item) =>
      item.name === medicine.name &&
      item.pharmacyId === pharmaStore.selectedPharmacyId
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const handleAddToCart = (medicine) => {
    if (
      pharmaStore.cart.length > 0 &&
      pharmaStore.cart[0].pharmacyId !== pharmaStore.selectedPharmacyId
    ) {
      // If the cart contains items from a different pharmacy, show the modal
      setSelectedMedicine(medicine);
      setShowModal(true);
    } else {
      // Add the medicine to the cart
      pharmaStore.addToCart({ ...medicine });
    }
  };

  const handleReplaceCart = () => {
    // Clear the cart and add the new medicine
    pharmaStore.clearCart();
    pharmaStore.addToCart({ ...selectedMedicine });
    setShowModal(false);
  };

  return (
    <>
      <div
        className="card shadow-sm text-center p-3"
        style={{ width: "15rem" }}
      >
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={medicine.image}
            className="card-img"
            width="40px"
            height={"100px"}
            style={{ overflow: "hidden", width: "50px", height: "100px" }}
            alt={medicine.name}
          />
        </div>
        <div className="card-body">
          <h5
            className="card-title"
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "0.5rem",
            }}
          >
            {medicine.name}
          </h5>
          <p
            className="card-text"
            style={{
              fontSize: "0.9rem",
              color: "#555",
              marginBottom: "0.8rem",
            }}
          >
            {medicine.uses}
          </p>
          <p
            className="card-price"
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#10b981", // Emerald green
              marginBottom: "1rem",
            }}
          >
            ₹{medicine.price.toFixed(2)}
          </p>
          {itemInCart ? (
            <div className="d-flex justify-content-center align-items-center">
              <button
                className="btn btn-secondary"
                onClick={() => pharmaStore.decreaseQuantity(medicine.name)}
              >
                -
              </button>
              <span className="mx-2 font-weight-bold">
                {itemInCart.quantity}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => pharmaStore.increaseQuantity(medicine.name)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="btn btn-warning mt-2"
              onClick={() => handleAddToCart(medicine)}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Modal for replacing cart */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Replace Cart Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your cart contains items from a different pharmacy. Do you want to
          replace them with items from this pharmacy?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReplaceCart}>
            Replace Items
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default MedicineCard;
