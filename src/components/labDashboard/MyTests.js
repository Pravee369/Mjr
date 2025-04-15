import React, { useEffect, useState, useContext } from "react";
import { loginContext } from "../contexts/loginContext";
import "./MyTests.css";

const MyTests = () => {
  const [ currentUser ] = useContext(loginContext);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setIsModalOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
  
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);
  
    // UseEffect for handling scroll lock/unlock when modal is opened/closed
    useEffect(() => {
          if (isModalOpen) {
              document.body.classList.add('no-scroll');
          } else {
              document.body.classList.remove('no-scroll');
          }
       }, [isModalOpen]);

  const handleEditTest = (test) => {
    setSelectedTest({ ...test });  // Clone the test data for editing
    setIsModalOpen(true);          // Open the modal
    setIsEditing(true);            // Set editing mode
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTest(null);
    setIsEditing(false);           // Reset editing mode
  };

  const handleSaveTest = () => {
    // Send update request to backend
    fetch(`http://localhost:3000/lab-tests/tests/${selectedTest._id}`, {
      method: "PUT",
      body: JSON.stringify(selectedTest),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTests((prevTests) =>
            prevTests.map((test) =>
              test._id === selectedTest._id ? selectedTest : test
            )
          );
          handleCloseModal();  // Close the modal after saving
        }
      })
      .catch((err) => {
        console.error("Error updating test:", err);
      });
  };

  const handleOutsideClick = () => {
    setIsModalOpen(false);
  };


  const handleDeleteTest = (testId) => {
    // Send delete request to the backend
    fetch(`http://localhost:3000/lab-tests/tests/${testId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTests((prevTests) => prevTests.filter((test) => test._id !== testId));
          setIsModalOpen(false);  // Close the modal after delete
        }
      })
      .catch((err) => {
        console.error("Error deleting test:", err);
      });
  };

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
              <button onClick={() => handleEditTest(test)} className="test-edit-btn">Edit</button>
              <button onClick={() => handleDeleteTest(test._id)} className="test-delete-btn">Delete</button>
            </div>
          ))}
        </div>
      )}
      {/* Modal for editing test */}
      {isModalOpen && selectedTest && (
        <div className="test-modal-overlay" onClick={handleOutsideClick}>
          <div className="test-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Test : {selectedTest.testName}</h3>
            <label>
              Test Name :
              <input
                type="text"
                name="testName"
                value={selectedTest.testName}
                readOnly
              />
            </label>
            <label>
              Description :
              <textarea
                name="description"
                value={selectedTest.description}
                onChange={(e) =>
                  setSelectedTest({ ...selectedTest, description: e.target.value })
                }
              />
            </label>
            <label>
              Sample Type :
              <input
                type="text"
                name="sampleType"
                value={selectedTest.sampleType}
                onChange={(e) =>
                  setSelectedTest({ ...selectedTest, sampleType: e.target.value })
                }
              />
            </label>
            <label>
              Price :
              <input
                type="number"
                name="price"
                value={selectedTest.price}
                onChange={(e) =>
                  setSelectedTest({ ...selectedTest, price: e.target.value })
                }
              />
            </label>
            <label>
              Result Time :
              <input
                type="text"
                name="resultTime"
                value={selectedTest.resultTime}
                onChange={(e) =>
                  setSelectedTest({ ...selectedTest, resultTime: e.target.value })
                }
              />
            </label>
            <label>
              Instructions :
              <textarea
                name="instructions"
                value={selectedTest.instructions}
                onChange={(e) =>
                  setSelectedTest({ ...selectedTest, instructions: e.target.value })
                }
              />
            </label>
            <div className="test-modal-buttons">
              <button onClick={handleSaveTest} className="test-save-btn">Save Changes</button>
              <button onClick={handleCloseModal} className="test-close-btn">Close</button>
              <button onClick={() => handleDeleteTest(selectedTest._id)} className="test-delete-btn">Delete Test</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTests;
