import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import './Form.css'
import axios from 'axios';
import { loginContext } from '../contexts/loginContext';

function GeneralForm() {

  let [currentUser,error,userLoginStatus,loginUser,logoutUser]=useContext(loginContext)


  const { register, handleSubmit,reset } = useForm();

  const submitForm = (data) => {
    console.log(data);
    data["type"]="general";
    data["username"]=currentUser.username;
    data=JSON.stringify(data);
    let formData = new FormData();
    formData.append("healthdata",data);  // Ensure it's a JSON string
     let token = localStorage.getItem('token'); // Ensure this is correct
        if (!token) {
            console.error('No token found');
            return;
        }

    axios.post('http://localhost:3000/healthlog-api/upload', formData, {
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
   
      <div className="container1 ">
        <div className="auction-form">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="form-input1">
              <div className="label">
                <label htmlFor="bp">BP (Blood Pressure)</label>
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
                      {...register("bp_lower_number")}
                    />
                  </div>
                  <div className="input1">
                    <label htmlFor="bp-upper-number">Upper Number :</label>
                    <input
                      id="bp-upper-number"
                      type="text"
                      placeholder=""
                      {...register("bp_upper_number")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="temperature">Temperature (F)</label>
              </div>
              <div className="input">
                <input
                  id="temperature"
                  type="number"
                  placeholder="temperature"
                  {...register("temperature")}
                />
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
                  placeholder="xxxxxxxx"
                  {...register("cholestrol")}
                />
              </div>
            </div>
            <div className="form-input1">
              <div className="label">
                <label for="blood">Blood</label>
              </div>
              <div className="input">
                <input
                  id="blood"
                  type="text"
                  placeholder="999999999"
                  {...register("blood")}
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

export default GeneralForm