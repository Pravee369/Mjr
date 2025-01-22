import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { loginContext } from '../contexts/loginContext';
import './Form.css'

function Cancer() {

  const { register, handleSubmit,reset } = useForm();
  let [currentUser,error,userLoginStatus,loginUser,logoutUser]=useContext(loginContext)


  const submitForm = (data) => {
    console.log(data);
    data["type"]="cancer";
    data["username"]=currentUser.username;
    data=JSON.stringify(data);
    let formData = new FormData();
    formData.append("healthdata",data);  // Ensure it's a JSON string
    
    let token = localStorage.getItem('token'); // Ensure this is correct
        if (!token) {
            console.error('No token found');
            return;
        }

    axios.post('http://localhost:3000/healthlog-api/upload', formData,
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

  return (
   
      <div className="container1">
        <div className="auction-form">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="form-input1">
              <div className="label">
                <label for="cancer-type">Cancer Type</label>
              </div>
              <div className="input">
                <input
                  id="cancer-type"
                  type="text"
                  placeholder="Cancer Type"
                  name="cancer_type"
                  {...register("cancer-type")}
                />
              </div>
            </div>

            <div className="form-input1">
              <div className="label">
                <label for="location">Location</label>
              </div>
              <div className="input">
                <input
                  id="location"
                  type="text"
                  placeholder="eg. Lungs"
                  name="location"
                  {...register("cancer-location")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="stage">stage</label>
              </div>
              <div className="input">
                <input
                  id="stage"
                  type="number"
                  placeholder=""
                  name="stage"
                  {...register("cancer-stage")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="tumor-size">Tumor Size</label>
              </div>
              <div className="input">
                <input
                  id="tumor-size"
                  type="number"
                  placeholder=""
                  name="tumor_size"
                  {...register("tumor-size")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="haemoglobin">Haemoglobin</label>
              </div>
              <div className="input">
                <input
                  id="haemoglobin"
                  type="text"
                  placeholder=""
                  name="haemoglobin"
                  {...register("haemoglobin")}
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

export default Cancer