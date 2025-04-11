import React, { useState, useEffect, useContext } from 'react';
import { loginContext } from "../contexts/loginContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LabsFilter.css';

function LabsFilter() {
  const [currentUser] = useContext(loginContext);
  let userName = currentUser?.name?.replace(/\s+/g, "-") || "Guest";

  const [search, setSearch] = useState("");
  const [labs, setLabs] = useState([]);
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLabs = async () => {
      const res = await axios.get("http://localhost:3000/labs-api/labs");
      setLabs(res.data);
    };
    fetchLabs();
  }, []);

  useEffect(() => {
    if (search) {
      axios.get("http://localhost:3000/labs-api/labs/search", {
        params: { query: search }
      })
      .then(res => setResults(res.data))
      .catch(err => console.log(err));
    } else {
      setResults([]);
    }
  }, [search]);

  return (
    <div className="labs-filter-container">
      <h2 className="labs-filter-title">Search Laboratories</h2>

      <input
        type="text"
        placeholder="Search Labs by name or location..."
        className="labs-filter-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="labs-card-wrapper">
        {(results.length > 0 ? results : labs).map((lab) => (
          <div
            key={lab._id}
            className="lab-card"
            onClick={() => navigate(`/${userName}/labs-filter/laboratory/${lab._id}`)}
          >
            <h3 className="lab-name">{lab.name}</h3>
            <p className="lab-address">{lab.address}</p>
            <p className="lab-contact">Contact Number : {lab.mobile}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LabsFilter;
