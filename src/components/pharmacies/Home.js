import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import PharmaCard from "./PharmaCard";
import data from "../../medicines_with_price.json";
import axios from "axios";
import {
  pharma_names,
  pharmaciesObjects,
  pharmacyAddresses,
} from "../../pharmacy_names";
import { pharmaStore } from "./PharmacyStore";
import { observer } from "mobx-react";
import PharmacyDefault from "../../images/pharmacyDefault.jpeg";
import pharmacy1 from "../../images/pharmacy1.jpeg";
import pharmacy2 from "../../images/pharmacy2.jpeg";
import pharmacy3 from "../../images/pharmacy3.jpeg";
import pharmacy4 from "../../images/pharmacy4.jpeg";
import pharmacy5 from "../../images/pharmacy5.jpeg";
import pharmacy6 from "../../images/pharmacy6.jpeg";
import pharmacy7 from "../../images/pharmacy7.jpeg";
import PharmacyNavbar from "./PharmacyNav";

const PharmaHome = observer(() => {
  const [searchQuery, setSearchQuery] = useState("");
  console.log(data);


  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await axios.get(
          "http://localhost:3000/user-api/get-all-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data.payload);
        pharmaStore.pharmacies = response.data.payload.filter(
          (user) =>
            user.category == "Organization" &&
            user.organizationType == "Pharmacy"
        );
        pharmaStore.filteredPharmacies = pharmaStore.pharmacies;
        console.log("pharmacy users", pharmaStore.pharmacies);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  let [filteredPharmacies,setFilteredPharmacies]=useState([])
  useEffect(()=>{
    setFilteredPharmacies(pharmaStore.filteredPharmacies)
  },[pharmaStore.filteredPharmacies])

  return (
    <div className="py-4 m-3 mt-5">
      <div className="row">
        {filteredPharmacies.length > 0 ? (
          filteredPharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{pharmacy.name}</h5>
                  <p className="card-text mb-1">
                    📞 <strong>{pharmacy.mobile}</strong>
                  </p>
                  <p className="card-text">📍 {pharmacy.address}</p>
                  <div className="mt-auto">
                    <NavLink
                      to={`/pharmacies/${pharmacy.username}`}
                      className="btn btn-primary w-100"
                      onClick={() => {
                        pharmaStore.selectedPharmacyId = pharmacy.username;
                      }}
                    >
                      Visit Store
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No pharmacies found for your search.</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default PharmaHome;
