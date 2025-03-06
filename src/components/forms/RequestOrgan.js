import React, { useContext, useState , useEffect} from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { loginContext } from '../contexts/loginContext';
import OrganBanksApproval from '../organisations/organBanks/organBanksApproval/OrganBanksApproval';
import './Form.css'

function RequestOrgan() {

  const { register, handleSubmit,reset } = useForm();
  let [currentUser,error,userLoginStatus,loginUser,logoutUser]=useContext(loginContext)
  let [myRequests,setMyRequests] = useState([])

  const user = JSON.parse(localStorage.getItem('user'));

  const submitForm = (data) => {
    console.log(data);
    data["type"]="request-organ";
    data["username"]=currentUser.username;
    data["mobile"] = currentUser.mobile;
    data["approved"] = "NO";
    data["approvedBy"] = null;
    data["patientName"] = currentUser.name;
    
    let token = localStorage.getItem('token'); 
        if (!token) {
            console.error('No token found');
            return;
        }

    axios.post('http://localhost:3000/organ-banks/send-organ-request', data,
      {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    )
      .then(response => {
        console.log(response.data);
        reset(); 
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(()=>
    {

      let token = localStorage.getItem('token'); 
        if (!token) {
            console.error('No token found');
            return;
        }
    axios.get('http://localhost:3000/organ-banks/get-organ-requests',
      {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    }
    )
      .then(response => {
        console.log(response.data)
        const userRequests = response.data.filter(
          item => item.username === currentUser.username
        );
        setMyRequests(userRequests)
        //console.log(userRequests.data);
        //reset(); 
      })
      .catch(error => {
        console.log(error);
      });

    },[])

  return (
   
      <div className="container1">
        <div className="auction-form">
          <form onSubmit={handleSubmit(submitForm)}>
          <div className="form-input1">
            <div className="label">
              <label htmlFor="organ-required">Organ Required</label>
            </div>
            <div className="input">
              <select
                id="organ-required"
                {...register("organRequired")}
                defaultValue=""//{{ color: 'grey' }}{{ color: 'black' }}
                onChange={(e) => e.target.style.color = e.target.value ? "#000" : "#999"}
                style={{ color: "#999" }} 
              >
                <option value="" disabled hidden>Select Organ Needed</option>
                <option value="kidney" style={{ color: 'black' }}>Kidney</option>
                <option value="liver" style={{ color: 'black' }}>Liver</option>
                <option value="heart" style={{ color: 'black' }}>Heart</option>
                <option value="lung" style={{ color: 'black' }}>Lung</option>
                <option value="pancreas" style={{ color: 'black' }}>Pancreas</option>
                <option value="intestine" style={{ color: 'black' }}>Intestine</option>
                <option value="cornea" style={{ color: 'black' }}>Cornea</option>
                <option value="skin" style={{ color: 'black' }}>Skin</option>
                <option value="bone_marrow" style={{ color: 'black' }}>Bone Marrow</option>
                <option value="bone" style={{ color: 'black' }}>Bone</option>
                <option value="heart_valve" style={{ color: 'black' }}>Heart Valve</option>
                <option value="tendons_ligaments" style={{ color: 'black' }}>Tendons & Ligaments</option>
              </select>
            </div>
          </div>
          <div className="form-input1">
            <div className="label">
              <label htmlFor="blood-type">Blood Group</label>
            </div>
            <div className="input">
              <select
                id="blood-group"
                {...register("bloodGroup")}
                defaultValue=""
                onChange={(e) => e.target.style.color = e.target.value ? "#000" : "#999"}
                style={{ color: "#999" }} 
              >
                <option id="myElement" value="" disabled hidden style={{ color: 'grey' }}>Select Blood Group
                </option>
                <option value="OPositive" style={{ color: 'black' }}>O +ve</option>
                <option value="ONegative" style={{ color: 'black' }}>O -ve</option>
                <option value="APositive" style={{ color: 'black' }}>A +ve</option>
                <option value="ANegative" style={{ color: 'black' }}>A -ve</option>
                <option value="BPositive" style={{ color: 'black' }}>B +ve</option>
                <option value="BNegative" style={{ color: 'black' }}>B -ve</option>
                <option value="ABPositive" style={{ color: 'black' }}>AB +ve</option>
                <option value="ABNegative" style={{ color: 'black' }}>AB -ve</option>
              </select>
            </div>
          </div>

            <div className="form-input1">
              <div className="label">
                <label htmlFor="location">Location</label>
              </div>
              <div className="input">
                <div className="input-group">
                  <div className="input1">
                    <label htmlFor="city" className="label1">
                      City : 
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="eg. Hyderabad"
                      {...register("city")}
                    />
                  </div>
                  <div className="input1">
                    <label htmlFor="state">State : </label>
                    <input
                      id="state"
                      type="text"
                      placeholder="eg. Telangana"
                      {...register("state")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="pin-code">PIN Code</label>
              </div>
              <div className="input">
                <input
                  id="pin-code"
                  type="number"
                  placeholder=""
                  name="stage"
                  {...register("pinCode")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="specific-requirements">Any Specific Requirements</label>
              </div>
              <div className="input">
                <input
                  id="specific-requirements"
                  type="text"
                  placeholder=""
                  name="specific-requirements"
                  {...register("requirements")}
                />
              </div>
            </div>
            <div className="submit-button">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>

          {/* requests made by me  */}

       {myRequests.length !==0 ? 
       
       (<div>
       <h3 className="lead mt-3">  Check whether requested organ found or not </h3>

<div className="row row-cols-1 row-cols-md-3 g-4">
  {myRequests.map((obj, index) => (
   <div className="col" key={index}>
   <div className="card h-100 shadow-sm">
     {/* Card Header */}
     <div className="card-header text-center bg-primary text-white">
       <h5 className="card-title mb-0">{obj.organRequired}</h5>
     </div>

     {/* Card Body */}
     <div className="card-body text-center">
       <p
         className="card-text"
         style={{
           fontWeight: "bold",
           color: obj.approved === "YES"? "green" : "red",
         }}
       >
         {obj.approved === "YES" ? "Approved" : "Not Approved"}
       </p>
       {obj.approved ==="YES" ? (
         <p className="text-success">Approved by: {obj.approvedBy}</p>
       ) : (
         <p className="text-danger">
           Unfortunately, not approved by anyone.
         </p>
       )}
     </div>

     {/* Card Footer */}
     <div
       className="card-footer text-center"
       style={{
         backgroundColor: obj.approved==="YES" ? "lightgreen" : "lightcoral",
         fontWeight: "bold",
       }}
     >
       {obj.approved ==="YES" ? "Request Approved" : "Pending Approval"}
     </div>
   </div>
 </div>
))}
</div>
</div>):(<h3>You did not make any organ requests yet !!</h3>)}

{  user.category==="Organization" && user.organizationType==="Organ Bank" &&

  <div> 
    <OrganBanksApproval/>
  </div>

}

      </div>
   
  );
}

export default RequestOrgan;