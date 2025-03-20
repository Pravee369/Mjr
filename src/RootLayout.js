import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Chatbot from './components/chatbot/Chatbot';
import './RootLayout.css'

function  RootLayout() {
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