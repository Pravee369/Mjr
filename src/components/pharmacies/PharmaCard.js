import React from "react";
import { NavLink } from "react-router-dom";

const PharmaCard = ({ pharmacy }) => {
  return (
    <div className="card" style={{ width: "15rem" }}>
      <img
        src={pharmacy.image}
        className="card-img"
        width="100px"
        height={"200px"}
        style={{ overflow: "hidden" }}
        alt={pharmacy.name}
      />
      <div className="card-body">
        <h5 className="card-title" style={{ marginBottom: "0.6rem" }}>
          {pharmacy.name}
        </h5>
        <p className="card-text">
          <strong>Phone:</strong> {pharmacy.phone}
          <br />
          <strong>Address:</strong> {pharmacy.address}
        </p>
        <NavLink to={`/pharmacies/${pharmacy.id}`} className="btn btn-primary">
          Visit Store
        </NavLink>
      </div>
    </div>
  );
};

export default PharmaCard;
