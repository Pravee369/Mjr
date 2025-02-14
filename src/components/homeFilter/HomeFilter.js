import { useState, useEffect } from "react";
import axios from "axios";

const HomeFilter = () => {
  const [category, setCategory] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [results, setResults] = useState([]);

  const categories = ["Doctor", "Clinic", "Hospital"];
  const specializations = ["Cardiology", "Dermatology", "Neurology", "Orthopedics",
                           "Gynoecology","Pediatrics","Dentist","Psychiatry"];

  useEffect(() => {
    if (category || specialization) {
      axios
        .get("http://localhost:3000/user-api/filter", {
          params: { category, specialization: specialization || ""},
        })
        .then((res) => setResults(res.data))
        .catch((err) => console.error(err));
    } else {
      setResults([]); // Clear results when no filter is selected
    }
  }, [category, specialization]);

  return (
    <div className="m-4 p-4 bg-gray-100 rounded-lg shadow-lg text-center">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">Filter Health Services</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">

        {/* Category Dropdown */}
        <div className="w-full sm:w-1/2">
          <label className="block text-gray-600 font-semibold mb-2">Category</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full p-2 border border-gray-800 rounded-lg m-3"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Specialization Dropdown */}
        <div className="w-full sm:w-1/2">
          <label className="block text-gray-600 font-semibold mb-2">Specialization</label>
          <select
            onChange={(e) => setSpecialization(e.target.value)}
            value={specialization}
            className="w-full p-2 border border-gray-800 rounded-lg m-3"
          >
            <option value="">Select Specialization</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Section */}

      {/* Default message when no filters are applied */}
      {results.length === 0 && !category && !specialization && (
        <p className="text-gray-500 text-center text-sm sm:text-base">
         Locate the best doctors and healthcare facilities quickly with customized search options
        </p>
      )}

      {/* Responsive Grid for Small Cards */}
      {/* <div className="row row-cols-sm-2 row-cols-md-4 row-cols-lg-5 bg-gray-50 shadow-lg text-center">
        {results.length > 0 &&
          results.map((item, index) => (
            <div key={index} className="card border text-center bg-gray-50 m-1">

              <h2 className="font-bold text-center">{item.name}</h2>
              {item.category === "Doctor" && 
              (
                <div className="card-body text-center">
                <p className="text-gray">
                  {item.specialization}
                </p>
                <p className="text-gray">
                  {item.experience}
                </p>
                </div>
              )}
              {item.category === "Organization" && 
              (
                <div className="card-body text-center">
                <p className="text-center">
                {item.organizationType}
                </p>
                </div>
              )}
            </div>
          ))}
      </div> */}

  <div className="row row-cols-sm-2 row-cols-md-4 row-cols-lg-5 bg-gray-50 shadow-lg text-center p-2">
  {results.length > 0 &&
    results.map((item, index) => (
      <div
        key={index}
        className="card border rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-white m-2 p-2"
      >
        <h2 className="font-semibold text-lg text-gray-800">{item.name}</h2>
        
        {item.category === "Doctor" && (
          <div className="card-body text-center mt-2">
            <p className="text-gray-600 font-medium">{item.specialization}</p>
            <p className="text-gray-500 text-sm">{item.experience} years of experience</p>
          </div>
        )}
        
        {item.category === "Organization" && (
          <div className="card-body text-center mt-2">
            <p className="text-gray-700 font-medium">{item.organizationType}</p>
          </div>
        )}
      </div>
    ))}
</div>

    </div>
  );
};

export default HomeFilter;
