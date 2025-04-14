import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { loginContext } from '../contexts/loginContext';
import './Form.css'

function Diabetes() {
  const { register, handleSubmit,reset  } = useForm();

   let [currentUser,error,userLoginStatus,loginUser,logoutUser]=useContext(loginContext)

   const submitForm = (data) => {
    console.log(data);
    data["type"]="diabetes";
    data["username"]=currentUser.username;
    data=JSON.stringify(data);
    let formData = new FormData();
    formData.append("healthdata",data);  // Ensure it's a JSON string
    
    let token = localStorage.getItem('token'); // Ensure this is correct
    if (!token) {
        console.error('No token found');
        return;
    }
    axios.post('http://localhost:3000/healthlog-api/upload', formData , {
      headers: {
          "Authorization": `Bearer ${token}`
      }
  })
      .then(response => {
        console.log(response.data);
        reset(); 
      })
      .catch(error => {
        console.log(error);
      });
  };


  return (
    
      <div className="container1">
        <div className="auction-form">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="form-input1">
              <div className="label">
                <label for="blood-glucose-level">Blood Glucode Level</label>
              </div>
              <div className="input">
                <input
                  id="blood-glucose-level"
                  type="number"
                  placeholder="in mg/dL"
                  name="blood_glucose_level"
                  {...register("blood_glucose_level")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label htmlFor="bp">BP (Blood Pressure) in mmHg</label>
              </div>
              <div className="input">
                <div className="input-group">
                  <div className="input1">
                    <label htmlFor="bp-lower-number" className="label1">
                      Lower Number :
                    </label>
                    <input
                      id="bp-lower-number"
                      type="text"
                      placeholder=""
                      name="bp_lower_number"
                      {...register("bp_lower_number")}
                    />
                  </div>
                  <div className="input1">
                    <label htmlFor="bp-upper-number">Upper Number :</label>
                    <input
                      id="bp-upper-number"
                      type="text"
                      placeholder=""
                      name="bp_upper_number"
                      {...register("bp_upper_number")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="ketone">Ketone</label>
              </div>
              <div className="input">
                <input
                  id="ketone"
                  type="number"
                  placeholder="mg/dL"
                  name="ketone"
                  {...register("ketone")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="hba1c">HbA1c</label>
              </div>
              <div className="input">
                <input
                  id="hba1c"
                  type="text"
                  placeholder="in %"
                  name="hba1c"
                  {...register("hba1c")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="weight">Weight</label>
              </div>
              <div className="input">
                <input
                  id="weight"
                  type="number"
                  placeholder="kg"
                  name="weight"
                  {...register("weight")}
                />
              </div>
            </div>
            <div className='submit-button'>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>  
      </div>

  );
}

export default Diabetes