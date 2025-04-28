import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import PharmaCard from "./PharmaCard";
import data from "../../medicines_with_price.json";
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

const RouteLayout = observer(() => {
  console.log(data);
  let pharmacies = [];
  const getImage = (index) => {
    let ind = (index + 1) % 7;
    if (ind === 0) return PharmacyDefault;
    else if (ind === 1) return pharmacy1;
    else if (ind === 2) return pharmacy2;
    else if (ind === 3) return pharmacy3;
    else if (ind === 4) return pharmacy4;
    else if (ind === 5) return pharmacy5;
    else if (ind === 6) return pharmacy6;
    else return pharmacy7;
  };

  useEffect(() => {
    pharmaStore.isPharmacy = true;
    pharmaciesObjects.forEach((pharmacy, index) => {
      pharmacies.push({
        name: pharmacy.name,
        id: index,
        medicines: data,
        address: pharmacy.address,
        phone: pharmacy.phone,
        email: pharmacy.email,
        image: getImage(index),
        filteredMedicines: data,
      });
    });
    pharmaStore.pharmacies = pharmacies;
    console.log(pharmaStore.pharmacies.length);
  }, []);
  return (
    <div className="container-fluid">
      <Outlet />
    </div>
  );
});

export default RouteLayout;
