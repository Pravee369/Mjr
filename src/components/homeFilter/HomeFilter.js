import { useState, useEffect, useContext } from "react";
import { loginContext } from '../contexts/loginContext'
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import defaultProfile from "../../images/default-profile.png";
import "./HomeFilter.css"
import { useNavigate } from "react-router-dom";

const HomeFilter = () => {
  let [currentUser] = useContext(loginContext);
  let userName = currentUser?.name?.replace(/\s+/g, "-") || "Guest";
  const [category, setCategory] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [results, setResults] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals,setHospitals]=useState([])
  const [indexd, setIndexd] = useState(0);
  const [indexh, setIndexh] = useState(0);
  const [loading, setLoading] = useState(true)

  const categories = ["Doctor", "Clinic", "Hospital"];
  const specializations = ["Cardiology", "Dermatology", "Neurology", "Orthopedics",
                           "Gynoecology","Pediatrics","Dentist","Psychiatry","Nephrology"];

   
   const [error, setError] = useState(null);

   let navigate = useNavigate()
   
   useEffect(() => {
   const fetchData = async () => {
     try {
         const response = await axios.get("http://localhost:3000/user-api/alldoctorsandhospitals");
         setDoctors(response.data.doctors || [] );
        let doctorsData = response.data.doctors || [];

          const doctorsWithVerification = await Promise.all(
            doctorsData.map(async (doctor) => {
              try {
                const verificationResponse = await axios.get(
                  `http://localhost:3000/verifications-api/user-verification/${doctor.username}`
                );

                console.log(`Verification response for ${doctor.username}:`, verificationResponse.data);

                return {
                  ...doctor,
                  verificationStatus: verificationResponse.data.status === "approved" ? "verified" : "unverified",
                  verifiedAt: verificationResponse.data.status === "approved" ? verificationResponse.data.hospitalName : null
                };
              } catch (error) {
                console.error(`Error fetching verification for ${doctor.username}:`, error);
                return { ...doctor, verificationStatus: "unverified" };
              }
            })
          );
          
          setDoctors(doctorsWithVerification);
          console.log("Doctors Data with Verification:", doctorsWithVerification);
         setHospitals(response.data.hospitals || [])
         } catch (err) {
         setError("Error fetching data");
         } finally {
          setLoading(false);
         }
         };
         fetchData();
       }, []);
 
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


                          
  if(loading) return <p>loading...</p>
  if (error) return <p>{error}</p>;
                      
// Group doctors into sets of 3
const groupedDoctors = [];
for (let i = 0; i < doctors.length; i += 3) {
 groupedDoctors.push(doctors.slice(i, i + 3));
}
   
const groupedHospitals=[]
for (let i = 0; i < hospitals.length; i += 3) {
 groupedHospitals.push(hospitals.slice(i, i + 3));
}


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
       
       <div className="flex flex-col items-center w-full">
         <div className="relative w-full max-w-5xl p-4">

         <p className="text-gray-500 text-center text-sm sm:text-base">
         Locate the best doctors and healthcare facilities quickly with customized search options
        </p>

          {/* for doctors */}
           {/* Left Arrow */}
           {indexd > 0 && (
             <button
               className="btn bg-grey"
               onClick={() => setIndexd(indexd - 1)}
             >
               <ChevronLeft size={24} />
             </button>
           )}
   
           {/* Cards Wrapper */}
           <div className="flex justify-center">
             <div className="row row-cols-sm-1 row-cols-md-3">
               {groupedDoctors.length > 0 &&
                 groupedDoctors[indexd]?.map((doctor, i) => (
                   <div
                     key={i}
                     className="p-4 border rounded-lg shadow-lg text-center bg-white"
                     onClick={() => navigate(`/${userName}/searchFilter/doctor/${doctor._id}`)}
                   >
                     <img
                       src={doctor.photo && doctor.photo !== "" ? doctor.photo : defaultProfile}
                       alt="Doctor Profile"
                       className="rounded-full object-cover"
                     />
                     <h3 className="text-lg font-bold">{doctor.name}</h3>
                     {doctor.verificationStatus === "verified" && (
                        <p className="text-green-600 font-semibold text-sm">
                          ✅ Verified doctor at {doctor.verifiedAt}
                        </p>
                      )}
                     <p className="text-sm text-gray-600">{doctor.specialization}</p>
                     <p className="text-sm font-medium text-gray-700">
                       {doctor.experience} years experience
                     </p>
                   </div>
                 ))}
             </div>
           </div>
   
           {/* Right Arrow */}
           {indexd < groupedDoctors.length - 1 && (
             <button
               className="btn bg-gray"
               onClick={() => setIndexd(indexd + 1)}
             >
               <ChevronRight size={24} />
             </button>
           )}
           
          <br></br>
          <p className="text-gray-500 text-center text-sm sm:text-base">Find your hospital</p>

           {/* for hospitals */}
           {indexh > 0 && (
             <button
               className="btn bg-grey"
               onClick={() => setIndexh(indexh - 1)}
             >
               <ChevronLeft size={24} />
             </button>
           )}
   
           {/* Cards Wrapper */}
           <div className="flex justify-center">
             <div className="row row-cols-sm-1 row-cols-md-3">
               {groupedHospitals.length > 0 &&
                 groupedHospitals[indexh]?.map((hospital, i) => (
                   <div
                     key={i}
                     className="p-4 border rounded-lg shadow-lg text-center bg-white"
                     onClick={() => navigate(`/${userName}/searchFilter/hospital/${hospital._id}`)}
                   >
                     
                     <h3 className="text-lg font-bold">{hospital.name}</h3>
                     <p className="text-sm text-gray-600">{hospital.location}</p>
                    
                   </div>
                 ))}
             </div>
           </div>
   
           {/* Right Arrow */}
           {indexh < groupedHospitals.length - 1 && (
             <button
               className="btn bg-gray"
               onClick={() => setIndexh(indexh + 1)}
             >
               <ChevronRight size={24} />
             </button>
           )}

         </div>
       </div>
        

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
            <a href="" onClick={() => navigate(`/${userName}/searchFilter/doctor/${item._id}`)}> click here to know more </a>
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
