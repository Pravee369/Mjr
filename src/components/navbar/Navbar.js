import React, { useState, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { loginContext } from '../contexts/loginContext'
import './Navbar.css'
import logo from '../../images/logo.png'
import defaultProfile from "../../images/default-profile.png";
import Profile from "../profile/Profile";
import GetVerified from '../getVerified/GetVerified';
import defaultOrganizationIcon from "../../images/default-organization-icon.png";
import { useNavigate } from 'react-router-dom';

function Navbar() {

   let [currentUser, error, userLoginStatus, loginUser, logoutUser] = useContext(loginContext);
   const [preview, setPreview] = useState(defaultProfile);
   const [showModal, setShowModal] = useState(false);
   const [modalContent, setModalContent] = useState(null);
   let userName = currentUser?.name?.replace(/\s+/g, "-") || "Guest";
   const navigate = useNavigate();

   useEffect(() => {
       if (currentUser) {
          if(currentUser.photo){
            setPreview(currentUser.photo);
          } else if(currentUser.category === "Organization") {
            setPreview(defaultOrganizationIcon);
          }
        }
   }, [currentUser]);

   useEffect(() => {
      if (showModal) {
          document.body.classList.add('no-scroll');
      } else {
          document.body.classList.remove('no-scroll');
      }
   }, [showModal]);

   const toggleModal = (content = null) => {
      setModalContent(content);
      setShowModal(!!content);
   };

   const handleLogout = () => {
      logoutUser();
      toggleModal(null);
      navigate("/login");
   };

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
      <div className="navigation">
         <nav className="navbar navbar-expand-sm p-0 m-0">
            <a className="navbar-brand" href="#">
               <img src={logo} width="40px" height="40px" alt="Logo" />
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
            {userLoginStatus===false ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link active chakra-petch-regular"
                    to="/" 
                    style={({ isActive }) => (isActive ? activeLink : inactiveLink)}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link chakra-petch-regular"
                    to="/register"
                    style={({ isActive }) => (isActive ? activeLink : inactiveLink)}>
                    SignUp
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link chakra-petch-regular"
                    to="/login"
                    style={({ isActive }) => (isActive ? activeLink : inactiveLink)}>
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link active chakra-petch-regular nav-bar-button"
                    to="/" 
                    style={({ isActive }) => (isActive ? activeLink : inactiveLink)}>
                    Home
                  </NavLink>
                </li>
                
                {currentUser.category==="Doctor" && 
                  <li>
                    <NavLink className="nav-link chakra-petch-regular nav-bar-button"
                    to="/appointments"
                    style={({ isActive }) => (isActive ? activeLink : inactiveLink)}>
                    Appointments
                  </NavLink>
                  </li>
                }

                {  currentUser.category==="Organization" && currentUser.organizationType==="Organ Bank" && 
                <li>
                 <NavLink className="nav-link chakra-petch-regular nav-bar-button"
                 to={`/Organization/Organ Bank/pending/${userName}`}
                 style={({ isActive }) => (isActive ? activeLink : inactiveLink)}>
                 Pending Requests
                </NavLink>
               </li>
                }

               {  currentUser.category==="Organization" && currentUser.organizationType==="Organ Bank" && 
                <li>
                 <NavLink className="nav-link chakra-petch-regular nav-bar-button"
                 to={`/Organization/Organ Bank/approval/${userName}`}
                 style={({ isActive }) => (isActive ? activeLink : inactiveLink)}>
                 Approvals
                </NavLink>
               </li>   
                }

                {  currentUser.category==="Organization" && currentUser.organizationType==="Blood Bank" &&
                <li>
                 <NavLink className="nav-link chakra-petch-regular nav-bar-button"
                 to={`/Organization/Blood Bank/pending/${userName}`}
                 style={({ isActive }) => (isActive ? activeLink : inactiveLink)}>
                  Pending Requests
                </NavLink>
               </li>
                }

               {  currentUser.category==="Organization" && currentUser.organizationType==="Blood Bank" &&         
                <li>
                 <NavLink className="nav-link chakra-petch-regular nav-bar-button"
                 to={`/Organization/Blood Bank/approval/${userName}`}
                 style={({ isActive }) => (isActive ? activeLink : inactiveLink)}>
                 Approvals
                </NavLink>
               </li>
               }

               {  currentUser.category==="Organization" && currentUser.organizationType==="Equipment Renter" &&         
                <li>
                 <NavLink className="nav-link chakra-petch-regular nav-bar-button"
                 to={`/Organization/Equip Rent/pending/${userName}`}
                 style={({ isActive }) => (isActive ? activeLink : inactiveLink)}>
                 Pending Requests
                </NavLink>
               </li>
               }


               {  currentUser.category==="Organization" && currentUser.organizationType==="Equipment Renter" &&         
                <li>
                 <NavLink className="nav-link chakra-petch-regular nav-bar-button"
                 to={`/Organization/Equip Rent/approval/${userName}`}
                 style={({ isActive }) => (isActive ? activeLink : inactiveLink)}>
                 Approvals
                </NavLink>
               </li>
               }

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#" 
                    id="navbarDropdown" 
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <img src={preview} alt="Profile" className="profile-photo rounded-circle"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <button className="dropdown-item" onClick={() => toggleModal('profile')}>
                        Profile
                      </button>
                    </li>
                    {currentUser.category==="Doctor" && 
                      <li>
                        <button className="dropdown-item" onClick={() => toggleModal('getVerified')}>
                          Get Verified
                        </button>
                      </li>
                    }
                    {currentUser.category==="Organization" && currentUser.organizationType==="Hospital" &&
                      <li>
                        <NavLink className="dropdown-item" to={`Organization/Hospital/${userName}/verifications`}>
                          Verifications
                        </NavLink>
                      </li>
                    }
                    {currentUser.category==="Organization" && currentUser.organizationType==="Laboratory" &&
                      <li>
                        <NavLink className="dropdown-item" to={`Organization/Laboratory/${userName}/dashboard`}>
                          Dashboard
                        </NavLink>
                      </li>
                    }
                    <li>
                        <button className="dropdown-item" onClick={() => toggleModal('logoutConfirm')}>
                           Logout
                        </button>
                    </li>
                  </ul>
                </li>

              </>
            )}
            </ul>
          </div>
        </nav>

         {showModal && (
            <div className="modal-container" onClick={() => toggleModal(null)}>
               <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                  <button className="close-button-modal" onClick={() => toggleModal(null)}>✖</button>
                  <div className="modal-content">
                     {modalContent === 'profile' && <Profile />}
                     {modalContent === 'getVerified' && <GetVerified />}
                     {modalContent === 'logoutConfirm' && (
                        <div className="logout-modal">
                           <h3>Confirm Logout</h3>
                           <p>Are you sure you want to log out?</p>
                           <div className="logout-buttons">
                              <button className="btn btn-secondary" onClick={() => toggleModal(null)}>Cancel</button>
                              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}
    
      </div>  )
  } 


export default Navbar;
