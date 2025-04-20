import { useState, useEffect, useContext } from "react";
import { loginContext } from '../contexts/loginContext';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./HospitalDetails.css";

function HospitalDetails() {
  let [currentUser] = useContext(loginContext);
  const navigate = useNavigate();
  let userName = currentUser?.name?.replace(/\s+/g, "-") || "Guest";

  const { id } = useParams();

  const [hospitalData, setHospitalData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [ambulances, setAmb] = useState([]);
  const [depts, setDepts] = useState([]);
  const [diagnostics, setDiag] = useState([]);
  const [infras, setInfras] = useState([]);
  const [patientSupp, setPatientSupp] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isEditable = currentUser?._id === id;

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const servicesRes = await axios.get(`http://localhost:3000/hc-api/servicesOfHospital/${id}`);
        const data = servicesRes.data;
        setHospitalData(data);
        console.log(hospitalData)
        if (data?.branches?.length) setBranches(data.branches || []);
        if (data?.ambulances?.length) setAmb(data.ambulances || []);
        if (data?.depts?.length) setDepts(data.depts || []);
        if (data?.diagnostics?.length) setDiag(data.diagnostics || []);
        if (data?.infras?.length) setInfras(data.infras || []);
        if (data?.patientSupp?.length) setPatientSupp(data.patientSupp || []);

        setLoading(false);
      } catch (err) {
        console.error("Services fetch error:", err);
        setHospitalData({}); // So that other components don’t break
        setLoading(false);
      }
    };
    fetchHospital();
  }, [id]);

  useEffect(() => {
    async function fetchApprovedDoctors() {
      try {
        const hospitalResponse = await axios.get(`http://localhost:3000/user-api/hospital/${id}`);
        const response = await axios.get(`/verifications-api/verification-requests/${hospitalResponse.data.username}`);
        setDoctors(Array.isArray(response.data) ? response.data : []);
        console.log("Doctors fetched:", response.data);
      } catch (error) {
        setError("Error fetching approved doctors.");
      }
    }
    fetchApprovedDoctors();
  }, [id]);

  const handleChange = (setFn, list, index, field, value) => {
    const updated = [...list];
    updated[index][field] = value;
    setFn(updated);
  };

  const handleAdd = (setFn, list) => {
    setFn([...list, { name: "", description: "" }]);
  };

  const handleDelete = (setFn, list, index) => {
    const updated = [...list];
    updated.splice(index, 1);
    setFn(updated);
  };

  const handleRowClick = async (doctorEmail) => {
    try {
      const response = await axios.get(`/user-api/get-doctor-id/${doctorEmail}`);
      const doctorId = response.data._id;
      if (doctorId) {
        navigate(`/${userName}/searchFilter/doctor/${doctorId}`);
      }
    } catch (error) {
      setError("Error fetching doctor ID.");
    }
  };

  const handleSave = async () => {
    try {
      const servicesToSend = {
        branches,
        ambulances,
        depts,
        diagnostics,
        infras,
        patientSupp,
      };
      await axios.put(`http://localhost:3000/hc-api/services/${id}`, servicesToSend);
      alert("Services updated!");
      setSaveSuccess(true);
    } catch (error) {
      setError("Error saving services.");
    }
  };

  const renderCards = (title, list, setFn) => (
  <>
    <h2 className="text-2xl font-bold text-center mb-6 mt-5">{title}</h2>
    {list.length === 0 ? (
      <p className="text-center text-gray-500">No {title.toLowerCase()} found.</p>
    ) : (
      <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 ">
        {list.map((item, index) => (
          <div key={index} className="col card-hosp m-1">
            <div className="w-full">
              {isEditable ? (
                <input
                  type="text"
                  className="text-xl font-semibold text-blue-700 border border-blue-200 p-2 rounded-md w-full mb-3"
                  placeholder={`${title} Name`}
                  value={item.name}
                  onChange={(e) => handleChange(setFn, list, index, "name", e.target.value)}
                />
              ) : (
                <h3 className="text-white text-xl">{item.name}</h3>
              )}
              {isEditable ? (
                <textarea
                  className="border border-blue-200 p-2 rounded-md w-full"
                  placeholder={`${title} Description`}
                  value={item.description}
                  onChange={(e) => handleChange(setFn, list, index, "description", e.target.value)}
                  rows="3"
                />
              ) : (
                <p className="text-white">{item.description}</p>
              )}
                
                {isEditable && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDelete(setFn, list, index)}
                  className="btn btn-danger border border-danger text-white p-2 m-1"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          </div>
        ))}
      </div>
    )}
    {isEditable && (
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handleAdd(setFn, list)}
          className="btn btn-primary border border-primary p-2 text-white mt-3"
        >
          + Add {title}
        </button>
      </div>
    )}
  </>
);

  

  if (loading) return <div className="p-4">Loading...</div>;
  {error && <div className="p-4 text-red-500 text-center">{error}</div>}


  return (
    <div className="hospital-details-container max-w-4xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Our Approved Doctors</h2>
      {doctors.length === 0 || doctors.filter(doc => doc.status === "approved").length === 0 ? (
        <p className="text-center text-gray-500">No approved doctors found.</p>
      ) : (
        <table className="table-auto w-full border-collapse mb-8">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2 border">Doctor Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Specialization</th>
              <th className="p-2 border">Experience</th>
              <th className="p-2 border">Contact</th>
            </tr>
          </thead>
          <tbody>
            {doctors.filter(doc => doc.status === "approved").map((doctor) => (
              <tr key={doctor._id} onClick={() => handleRowClick(doctor.doctorEmail)} className="cursor-pointer hover:bg-gray-100">
                <td className="p-2 border">{doctor.doctorName}</td>
                <td className="p-2 border">{doctor.doctorEmail}</td>
                <td className="p-2 border">{doctor.specialization}</td>
                <td className="p-2 border">{doctor.experience} years</td>
                <td className="p-2 border">{doctor.doctorMobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {renderCards("Branches", branches, setBranches)}
      {renderCards("Ambulance Services", ambulances, setAmb)}
      {renderCards("Departments", depts, setDepts)}
      {renderCards("Diagnostics & Labs", diagnostics, setDiag)}
      {renderCards("Infrastructure", infras, setInfras)}
      {renderCards("Patient Support", patientSupp, setPatientSupp)}

      {isEditable && (
        <div className="text-center mt-5">
          <button
            onClick={handleSave}
            className="btn btn-success text-white"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default HospitalDetails;
