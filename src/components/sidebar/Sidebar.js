import React, { useState, useContext  } from "react";
import { FaBars, FaUserAlt, FaCommentAlt } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { AiFillFile } from "react-icons/ai";
import { IoLogOutSharp } from "react-icons/io5";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { loginContext } from '../contexts/loginContext'
import "./Sidebar.css";
const Sidebar = () => {
  
  let [currentUser,error,userLoginStatus,loginUser,logoutUser]=useContext(loginContext)


  let para = useParams();
  let user = JSON.parse(localStorage.getItem("user"));
  console.log('User retrieved is :',user)
  let userName=user.name;
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () =>
    setIsOpen(!isOpen);
  const returnClass = () => {
    return isOpen ? "dark-body" : "light-body";
  };

  const returnClass2 = () => {
    return isOpen ? "sidebar-open" : "sidebar-close";
  };
  const menuItem = [
    // {
    //   path: `/Patient/${userName}/general`,
    //   name: "General",
    //   icon: <FaUserAlt />,
    // },
    // {
    //   path: `/Patient/${userName}/diabetes`,
    //   name: "Diabetes",
    //   icon: <MdPayments />,
    // },
    // {
    //   path: `/Patient/${userName}/heartattack`,
    //   name: "HeartAttack",
    //   icon: <FaCommentAlt />,
    // },
    // {
    //   path: `/Patient/${userName}/eyesight`,
    //   name: "Eyesight",
    //   icon: <AiFillFile />,
    // },
    // {
    //   path: `/Patient/${userName}/cancer`,
    //   name: "Cancer",
    //   icon: <AiFillFile />,
    // },
    // {
    //   path: `/Patient/${userName}/prescriptions`,
    //   name: "Upload prescriptions",
    //   icon: <AiFillFile />,
    // },
    // {
    //   path: `/Patient/${userName}/alarms`,
    //   name: "Alarms",
    //   icon: <AiFillFile />,
    // },
    // {
    //   path: `/Patient/${userName}/healthlogs`,
    //   name: "Health Logs",
    //   icon: <AiFillFile />,
    // },
    {
      path: `/Patient/${userName}/requestblood`,
      name: "Request Blood",
      icon: <AiFillFile />,
    },
    {
      path: `/Patient/${userName}/requestorgan`,
      name: "Request Organs",
      icon: <AiFillFile />,
    },
    {
      path: `/Patient/${userName}/rentEquipment`,
      name: "Rent Equipment",
      icon: <AiFillFile />,
    }
  ];
  
  const classes = `{container-fluid g-0 d-flex  ${returnClass()}`;

  const navigate = useNavigate();
  return (
    <div className={classes} >
      <div style={{ width: isOpen ? "250px" : "50px" }} className="sidebar">
        <div className="top_section">
          <div style={{ marginLeft: "0px" }} className="bars p-2">
            <FaBars  style={{ "fontSize":"1.5rem"}} onClick={toggle}  />
          </div>
        </div>
  
          <div>
            {menuItem.map((item, index) => (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <Link 
                to={item.path}
                key={index}
                className="link"
                activeclassName="active"
              >
               
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text chakra-petch-regular"
                >
                  {item.name}
                </div>
              </Link>
            ))}
             
          </div>

        
        </div>
      </div>
      
   
  );
};

export default Sidebar;
