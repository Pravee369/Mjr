import React, { useState, useEffect, useContext } from "react";
import MedicineCard from "./MedicineCard";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { pharmaStore } from "./PharmacyStore";
import axios from "axios";

const PharmaStore = observer(() => {
  useEffect(() => {
    pharmaStore.searchFilterPlaceholder = "Search By Medicine Name...";
    pharmaStore.isPharmacyStore = true;
  }, []);
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const { id } = useParams();
  const parsedId = parseInt(id, 10); // Parse the id to an integer
  console.log(id, typeof id, pharmaStore.pharmacies);
  useEffect(() => {
    console.log(
      "pharmaStore.searchQuery in pharmaStore",
      pharmaStore.searchQuery,
      pharmaStore.isPharmacyStore
    );
    if (pharmaStore.isPharmacyStore) {
      setFilteredMedicines(
        medicines.filter((medicine) => {
          const query = pharmaStore.searchQuery.toLowerCase();
          return medicine.name.toLowerCase().includes(query);
        })
      );
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

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/pharmacies/medicines?pharmacyId=${pharmaStore.selectedPharmacyId}`
        );
        setMedicines(response.data);
        setFilteredMedicines(response.dat)
        pharmaStore.medicines=response.data
        pharmaStore.filteredMedicines=response.data
      } catch (err) {
        console.error("Error fetching medicines:", err);
        alert("Failed to fetch medicines. Please try again later.");
      }
    };

    fetchMedicines();
  }, []);
  useEffect(()=>{
    setMedicines(pharmaStore.medicines)
  },[pharmaStore.medicines])
  useEffect(()=>{
    setFilteredMedicines(pharmaStore.filteredMedicines)
  },[pharmaStore.filteredMedicines])

  return (
    <div>
      <div className="m-5">
        <div className="row mt-4">
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className="col-md-3 mb-4 d-flex justify-content-center"
              >
                <MedicineCard medicine={medicine} pharmacyId={parsedId} />
              </div>
            ))
          ) : (
            <p className="text-center text-muted">Loading ...</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default PharmaStore;
