import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { loginContext } from '../contexts/loginContext';
import './Form.css'

function EyeSight() {

  const { register, handleSubmit ,reset} = useForm();
  let [currentUser,error,userLoginStatus,loginUser,logoutUser]=useContext(loginContext)


  const submitForm = (data) => {
    console.log(data);
    data["type"]="eyesight";
    data["username"]=currentUser.username;
    data=JSON.stringify(data);
    let formData = new FormData();
    formData.append("healthdata",data);  // Ensure it's a JSON string
    
    let token = localStorage.getItem('token'); // Ensure this is correct
    if (!token) {
        console.error('No token found');
        return;
    }
    axios.post('http://localhost:3000/healthlog-api/upload', formData,{
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
                <label for="refraction">Refraction</label>
              </div>
              <div className="input">
                <input
                  id="refraction"
                  type="text"
                  placeholder="Refraction"
                  name="refraction"
                  {...register("refraction")}
                />
              </div>
            </div>
            
            <div className="form-input1">
              <div className="label">
                <label for="eye-ball-size">Eye Ball Size</label>
              </div>
              <div className="input">
                <input
                  id="eye-ball-size"
                  type="number"
                  placeholder="Eye Ball Size"
                  name="eye_ball_size"
                  {...register("eye-ball-size")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="left-eye-sight">Left Eye Sight</label>
              </div>
              <div className="input">
                <input
                  id="left-eye-sight"
                  type="text"
                  placeholder=""
                  name="left_eye_sight"
                  {...register("left-eye-sight")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="right-eye-sight">Right Eye Sight</label>
              </div>
              <div className="input">
                <input
                  id="right-eye-sight"
                  type="text"
                  placeholder=""
                  name="right_eye_sight"
                  {...register("right-eye-sight")}
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

export default EyeSight