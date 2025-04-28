import React, { useEffect } from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Chatbot from './components/chatbot/Chatbot';
import './RootLayout.css'
import { pharmaStore } from './components/pharmacies/PharmacyStore';

function  RootLayout() {
   useEffect(()=>{
      pharmaStore.isPharmacy=false
   },[])
  return (
      <div className="root-main">
         <div className=" m-0 ">
            <Navbar />
         </div>
         <div classname="outlet">
            <Outlet />
         </div>
         <Chatbot />
      </div>
  );
}

export default RootLayout;