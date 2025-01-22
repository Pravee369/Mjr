import React from 'react'
import Sidebar from './../sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import './UserProfile.css'


function UserProfile() {
  return (
    <div className="user-profile d-flex">
        <div className='sidebar'><Sidebar/></div>
        <div className='user-profile-content'>
          <Outlet/>
        </div>
    </div>
    
  )
}

export default UserProfile