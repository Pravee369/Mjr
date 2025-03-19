import React, { useContext, useEffect, useState } from 'react'
import { loginContext } from '../../../contexts/loginContext';
import axios from 'axios';

function BloodBanksApproval() {

    const user = JSON.parse(localStorage.getItem("user"));
      let [currentUser, error, userLoginStatus, loginUser, logoutUser] =
        useContext(loginContext);
    let [acceptedRequests, setAcceptedRequests] = useState([]);
    let token = localStorage.getItem("token");
    useEffect(() => {
      // Ensure this is correct
      if (!token) {
        console.error("No token found");
        return;
      }
  
      console.log("Fetching Requested Approvals...");
      axios
        .get("http://localhost:3000/blood-banks/get-required-blood", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (res) => {
          let allApprovals = res.data.payload || [];
          console.log("Fetches all the Requested Approvals :", allApprovals);
         
          await setAcceptedRequests(
            allApprovals.filter((obj) => {
              return obj.approved==="YES" && obj.approvedBy === user.username;
            })
          );
         
          console.log("Accepted Requests ", acceptedRequests);
        })
        .catch((err) => {
          console.log("Error in getting healthlogs:", err);
        });
    }, []);

  return (
    <div className='mt-5'>
      <div id="approvedRequests" className="approvedRequests">
       
       <div className="row" style={{ width: "100%" }}>
         <div>
           {acceptedRequests.length === 0 && (
             <p className=" no_requests">No Requests Approved Till Now!!</p>
           )}
         </div>
         {acceptedRequests.map((curObj, index) => {
           return (
             <div className="col-4 mt-3">
               <div className="card" style={{ width: "100%" }}>
                 <h5
                   className="card-title p-2"
                   style={{
                     backgroundColor: "#365E32",
                     color: "#fff",
                     borderTopLeftRadius: "5px",
                     borderTopRightRadius: "5px",
                     textAlign: "center",
                   }}
                 >
                   {curObj.bloodGroup}
                 </h5>
                 <div className="card-body">
                   <h6 className="card-subtitle mb-2 ">
                     <b>Name : </b> {curObj.patientName}
                   </h6>
                   <div className="card-text">
                     <b>Location : </b>
                     <p style={{ paddingLeft: "10px", margin: "0px" }}>
                       City : {curObj.city}
                     </p>
                     <p style={{ paddingLeft: "10px", margin: "0px" }}>
                       State : {curObj.state}
                     </p>
                     <p style={{ paddingLeft: "10px", margin: "0px" }}>
                       PinCode : {curObj.pinCode}
                     </p>
                     <p style={{ paddingLeft: "10px", margin: "0px" }}>
                       Specific Requirements : {curObj.requirements}
                     </p>
                   </div>
                   <p className="card-text">
                     <b>Contact Details :</b> {curObj.mobile}
                   </p>
                 </div>
               </div>
             </div>
           );
         })}
       </div>
     </div>
    </div>
  )
}

export default BloodBanksApproval
