import { observer } from "mobx-react-lite";
import { NavLink, useNavigate } from "react-router-dom";
import { pharmaStore } from "./PharmacyStore";
import { useEffect } from "react";

const PharmacyNavbar = observer(() => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log(
      "pharmaStore.searchQuery",
      pharmaStore.searchQuery,
      pharmaStore.isPharmacyStore
    );
    if (pharmaStore.isPharmacyStore) {
      const filteredMedicines = pharmaStore.medicines.filter((medicine) => {
        const query = pharmaStore.searchQuery.toLowerCase();
        return medicine.name.toLowerCase().includes(query);
      });
      pharmaStore.filteredmedicines = filteredMedicines;
      console.log(pharmaStore.filteredmedicines);
      return;
    }
    const filteredPharmacies = pharmaStore.pharmacies.filter((pharmacy) => {
      const query = pharmaStore.searchQuery.toLowerCase();
      return (
        pharmacy.name.toLowerCase().includes(query) ||
        pharmacy.address.toLowerCase().includes(query)
      );
    });
    pharmaStore.filteredPharmacies = filteredPharmacies;
    console.log(pharmaStore.filteredPharmacies.length);
  }, [pharmaStore.searchQuery]);
  return (
    <nav
      className="navbar navbar-expand-lg p-2"
      style={{ backgroundColor: "#EEE0C9" }}
    >
      <div className="container-fluid">
        {/* Logo */}
        <NavLink
          className="navbar-brand"
          to="/"
          onClick={() => {
            pharmaStore.isPharmacy = false;
          }}
        >
          Home
        </NavLink>
        <span className="ms-1">{`Deliver to :\n${"JNTU College,Kukatpally,Hyderabad,500085"}`}</span>
        <div style={{ width: "50%" }}>
          <input
            className="form-control"
            placeholder={pharmaStore.searchFilterPlaceholder}
            value={pharmaStore.searchQuery}
            onChange={(e) => {
              console.log("search query", e.target.value);
              pharmaStore.searchQuery = e.target.value;
            }}
          />
        </div>

        {/* Cart */}
        <div className="d-flex align-items-center">
          <button
            className="btn-outline-light position-relative"
            onClick={() => navigate("/pharmacies/cart")}
            style={{
              border: "none",
              background: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            <b>🛒</b>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {pharmaStore.cart.length}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
});

export default PharmacyNavbar;
