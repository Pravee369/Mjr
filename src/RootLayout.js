import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import './RootLayout.css'

function  RootLayout() {
  console.log("root layout file")
  return (
    
      <div className="root-main">
         <div className=" m-0 ">
            <Navbar />
         </div>
         <div classname="outlet">
            <Outlet />
          </div>
      </div>
    
  );
}

export default RootLayout;