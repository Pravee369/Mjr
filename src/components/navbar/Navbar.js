import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { loginContext } from '../contexts/loginContext'
import './Navbar.css'
import logo from '../../images/logo.png'

function Navbar() {

   let [currentUser,error,userLoginStatus,loginUser,logoutUser]=useContext(loginContext)

   const activeLink = {
      color: "#ffaa00",
      fontSize: "1rem",
      fontWeight: "bold",
      backgroundColor:"#EEE0C9"
    };
  
    const inactiveLink = {
      color: "black",
      fontSize: "1rem",
       backgroundColor:"#EEE0C9"
    };
    return (
      
        <div className="navigation ">
        <nav className="navbar navbar-expand-sm p-0 m-0">
          <a className="navbar-brand" href="#">
            <img
              src={logo}
              width="40px"
              height="40px"
              alt=""
            />
          </a>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">

            <ul className="navbar-nav ms-auto mb-0 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link active chakra-petch-regular"
                  active 
                  aria-current="page"
                  to="/"
                  style={({ isActive }) => {
                    return isActive ? activeLink : inactiveLink;
                  }}
                >
                  Home
                </NavLink>
              </li>
              {/* <li className="nav-item">
               {userLoginStatus && currentUser.userType=="admin" && 
                <NavLink  
                   to="/post-event" className="nav-link" 
                   style={({ isActive }) => {
                     return isActive ? activeLink : inactiveLink;
                   }}> 
                   Post Event 
                </NavLink>}
            </li> */}
            {/* <li className="nav-item">
               {userLoginStatus && 
               <NavLink  
                  to="/user-profile" className="nav-link"
                  style={({ isActive }) => {
                     return isActive ? activeLink : inactiveLink;
                   }}
               > 
               Your Profile 
               </NavLink>}
            </li> */}
{/*             
            <li className="nav-item">
               {userLoginStatus && currentUser.userType=="admin" && 
               <NavLink  
                  to="/registrations" className="nav-link"
                  style={({ isActive }) => {
                     return isActive ? activeLink : inactiveLink;
                   }}
               > 
               Registrations 
               </NavLink>}
            </li> */}


            {userLoginStatus===false &&
              <li className="nav-item">
                <NavLink
                  className="nav-link chakra-petch-regular"
                  to="/register"
                  style={({ isActive }) => {
                    return isActive ? activeLink : inactiveLink;
                  }}
                >
                  SignUp
                </NavLink>
              </li>}
             
  
              {!userLoginStatus ?
                (<li className="nav-item">
                  <NavLink
                    className="nav-link chakra-petch-regular"
                    to="/login"
                    style={({ isActive }) => {
                      return isActive ? activeLink : inactiveLink;
                    }}
                  >
                    Login
                  </NavLink>
                </li>
              ) : (
                <>
                <li className="nav-item">
                <NavLink
                    className="nav-link active chakra-petch-regular"
                    active 
                    aria-current="page"
                    to="/profile"
                    style={({ isActive }) => {
                      return isActive ? activeLink : inactiveLink;
                    }}
                  >
                    Profile
                  </NavLink></li>
                  <li className="nav-item">
                  <NavLink
                    className="nav-link chakra-petch-regular"
                    to="/login"
                    style={({ isActive }) => {
                      return isActive ? activeLink : inactiveLink;
                    }}
                    onClick={logoutUser}
                  >
                    Logout
                  </NavLink>
                </li></>
              )}
  
              {/* <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/aboutus"
                  style={({ isActive }) => {
                    return isActive ? activeLink : inactiveLink;
                  }}
                >
                  Aboutus
                </NavLink>
              </li> */}
            </ul>
          </div>
          </nav>
        </div>
      
    );
  }

export default Navbar
