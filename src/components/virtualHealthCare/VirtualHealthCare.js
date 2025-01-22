import React from "react";
import "./VirtualHealthCare.css"; // Assuming you have a CSS file for styling
import { useNavigate } from "react-router-dom";

const VirtualHealthcare = () => {

   let navigate= useNavigate();
  return (
    <div className="virtual-health-container1">
      <div className="content">
        <h1>Virtual healthcare for you</h1>
        <p>
          Trafalgar provides progressive, and affordable healthcare, accessible
          on mobile and online for everyone
        </p>
        <button className="consultButton" onClick={()=>{navigate("/login")}}>Login to avail our services</button>
      </div>
      <div className="imageContainer">
        <img
          src={require("../../images/bannerImage.png")}
          alt="Virtual Healthcare"
          className="healthcareImage"
        />
      </div>
    </div>
  );
};

export default VirtualHealthcare;
