import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { loginContext } from '../contexts/loginContext';
import './Form.css';


function HeartAttack() {

  const { register, handleSubmit ,reset} = useForm();
  let [currentUser,error,userLoginStatus,loginUser,logoutUser]=useContext(loginContext)


  const submitForm = (data) => {
    console.log(data);
    data["type"]="heartattack";
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
                <label htmlFor="heart-beat-rate">
                  Heart beat Rate (in beats per min)
                </label>
              </div>
              <div className="input">
                <input
                  id="heart-beat-rate"
                  type="number"
                  placeholder="eg. 72"
                  {...register("heart_beat_rate")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label htmlFor="bp-lower-number">BP (Blood Pressure)</label>
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
                      placeholder="eg. 40"
                      {...register("bp_lower_number")}
                    />
                  </div>
                  <div className="input1">
                    <label htmlFor="bp-upper-number">Upper Number :</label>
                    <input
                      id="bp-upper-number"
                      type="text"
                      placeholder="eg. 120"
                      {...register("bp_upper_number")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="cholestrol">Cholestrol</label>
              </div>
              <div className="input">
                <input
                  id="cholestrol"
                  type="text"
                  placeholder="eg. 100mg/dL"
                  {...register("cholestrol")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="stress-test-results">Stress Test Results</label>
              </div>
              <div className="input">
                <input
                  id="stress-test-results"
                  type="text"
                  placeholder="Stress test results"
                  {...register("stress_test_results")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="imaging-results">Imaging Results</label>
              </div>
              <div className="input">
                <input
                  id="imaging-results"
                  type="text"
                  placeholder="Imaging results"
                  {...register("imaging_results")}
                />
              </div>
            </div>
            <div className="submit-button">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
   
  );
}

export default HeartAttack;
