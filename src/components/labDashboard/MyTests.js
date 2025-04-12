import React, { useEffect, useState, useContext } from "react";
import { loginContext } from "../contexts/loginContext";
import "./MyTests.css";

const MyTests = () => {
  const [ currentUser ] = useContext(loginContext);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.username) {
      fetch(`http://localhost:3000/lab-tests/tests?username=${currentUser.username}`)
        .then((res) => res.json())
        .then((data) => {
          setTests(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching tests:", err);
          setLoading(false);
        });
    }
  }, [currentUser]);

  if (loading) return <p className="mytests-loading">Loading your tests...</p>;

  return (
    <div className="mytests-container">
      <h2 className="mytests-title">My Lab Tests</h2>

      {tests.length === 0 ? (
        <p className="no-tests-msg">No tests added yet.</p>
      ) : (
        <div className="tests-grid">
          {tests.map((test) => (
            <div key={test._id} className="test-card">
              <h3>{test.testName}</h3>
              <p><strong>Sample :</strong> {test.sampleType}</p>
              <p><strong>Price :</strong> ₹{test.price}</p>
              <p><strong>Result Time :</strong> {test.resultTime}</p>
              {test.instructions && <p><strong>Instructions :</strong> {test.instructions}</p>}
              {test.description && <p className="description">{test.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTests;
