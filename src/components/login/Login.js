// import React,{useContext,useEffect} from 'react'
// import {useForm} from 'react-hook-form'
// import {useNavigate} from 'react-router-dom'
// import { loginContext } from '../contexts/loginContext'
// import './Login.css'

// function Login() {


//   let [currentUser,error,userLoginStatus,loginUser,logoutUser]=useContext(loginContext)

//   //  //navigate
//    const navigate = useNavigate();
 
//    //use form hook
//    let {
//      register,
//      handleSubmit,
//      formState: { errors },
//    } = useForm();



//    //user login
//    const handleUserLogin=(userCredObj)=>{
//     console.log(userCredObj)
//     loginUser(userCredObj)
//    }


//    useEffect(()=>{
//     if(userLoginStatus==true){
//       navigate(`/user-profile/${JSON.parse((localStorage.getItem('user'))).username}`)
//     }
//    },[userLoginStatus])

  

//   return (
//     <div className="add-user mt-0">
     
//       {/* form submission error */}
//       {error!=undefined &&  error.length !== 0 && (
//         <p className="display-3 text-danger text-center">{error}</p>
//       )}
//       {/* add user form */}
//       <div className="row">
         
//         <div className="col-11 col-sm-8 col-md-6 mx-auto">
//           <form 
//           onSubmit={handleSubmit(handleUserLogin)}
//           >
//             {/* username */}
//             <div className="mb-3">
//               <label htmlFor="name" className="text-white">Email Id</label>
//               <input
//                 type="text"
//                 id="username"
//                 className="form-control"
//                 placeholder="e.g. John"
//                 {...register("username", { required: true })}
//                 required
//               />
//               {/* validation errors for name */}
//               {errors.username?.type === "required" && (
//                 <p className="text-danger fw-bold fs-5">
//                   * Email Id is required
//                 </p>
//               )}
//             </div>
//             {/* password */}
//             <div className="mb-3">
//               <label htmlFor="name" className="text-white">Password</label>
//               <input
//                 type="password"
//                 placeholder="*********"
//                 id="password"
//                 className="form-control"
//                  {...register("password", { required: true })}
//                 required
//               />
//               {/* validation errors for name */}
//               {errors.password?.type === "required" && (
//                 <p className="text-danger fw-bold fs-5">
//                   * Password is required
//                 </p>
//               )}

              
//             </div>
            
           
           
           
//             {/* submit button */}
//             <button type="submit" className="btn btn-primary text-dark">
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login


import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginContext } from "../contexts/loginContext";
import "./Login.css";

function Login() {
  let [currentUser, error, userLoginStatus, loginUser, logoutUser] =
    useContext(loginContext);

  //  //navigate
  const navigate = useNavigate();

  //use form hook
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //user login
  const handleUserLogin = (userCredObj) => {
    console.log(userCredObj);
    loginUser(userCredObj);
  };

  useEffect(() => {
    if (userLoginStatus == true) {
      let user = JSON.parse(localStorage.getItem("user"));
      console.log('User retrieved is :',user)
      let userName=user.name;
      // let sentenceWithUnderscores = userName.replace(/ /g, "_");
      if(user.category=='Organization')
      {
        navigate(`/Organization/${user.organizationType}/${userName}`)
      }
      else
      navigate(`/${user.category}/${userName}`);
    }
  }, [userLoginStatus]);

  return (
    <div className="login">
      <div className="wrapper">
        <div className="add-user mt-0">
          <div className="title-text">
            <div className="title">Account Login</div>
          </div>
          {/* form submission error */}
          {error != undefined && error.length !== 0 && (
            <p className="text-danger text-center">
              <b>{error}</b>
            </p>
          )}
          {/* add user form */}
          <div className="">
            <div className="">
              <form onSubmit={handleSubmit(handleUserLogin)}>
                {/* username */}
                {/*<div className="mb-3">*/}
                {/*<label htmlFor="name" className="text-white">
                    Email Id
                  </label>*/}
                <div className="field">
                  <input
                    type="email"
                    id="username"
                    className=""
                    placeholder="Email Id"
                    {...register("username", { required: true })}
                    required
                  />
                </div>
                {/* validation errors for name */}
                {errors.username?.type === "required" && (
                  <p className="text-danger fw-bold fs-5">
                    * Email Id is required
                  </p>
                )}

                {/*</div>*/}
                {/* password */}
                {/*<div className="mb-3">*/}
                {/*<label htmlFor="name" className="text-white">
                  Password
                </label>*/}
                <div className="field">
                  <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    className=""
                    {...register("password", { required: true })}
                    required
                  />
                </div>
                {/* validation errors for name */}
                {errors.password?.type === "required" && (
                  <p className="text-danger fw-bold fs-5">
                    * Password is required
                  </p>
                )}
                {/*</div>*/}

                {/* submit button */}
                <div className="field btn">
                  <div className="btn-layer"></div>
                  <input type="submit" value="Login" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;