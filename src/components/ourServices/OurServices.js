import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdNotificationsActive } from 'react-icons/md';
import { RiHealthBookFill } from 'react-icons/ri';
import { FaHandHoldingMedical } from "react-icons/fa";
import { FaHandHoldingWater } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { FaCalendarAlt, FaMicroscope } from "react-icons/fa";
import './OurServices.css';

const OurServices = () => {

  const navigate = useNavigate();
  
  const user=JSON.parse(localStorage.getItem('user'));
  let userName = user?.name?.replace(/\s+/g, "-") || "Guest";
  if(user)console.log(user.name)
const services = [
  {
    icon: "📄", // Replace with the actual icon or image
    title: "Upload Prescriptions",
    description:
      "Upload your prescriptions to avoid the hassle of carrying physical documents and keep your medical records organized and easily accessible. This ensures you have a secure, digital copy whenever you need it, simplifying your healthcare management.",
    path: (user)?`/${userName}/prescriptions`:"/login",
  },
  {
    icon: <MdNotificationsActive />, // Replace with the actual icon or image
    title: "Alarms",
    description:
      "Set alarms for doctor appointments and pill times to ensure you never miss a critical healthcare task.",
    path: (user)?`/${userName}/alarms`:"/login",
  },
  {
    icon: <RiHealthBookFill />, // Replace with the actual icon or image
    title: "Health Logging",
    description:
      "Upload health attributes like blood pressure and cholesterol levels to maintain a comprehensive digital health record. This enables easy monitoring and better tracking of your health trends.",
    path:(user)?`/${userName}/uploadlogs`:"/login",
  },
  {
    icon: "📊", // Replace with the actual icon or image
    title: "Tracking",
    description: "Track and save your medical history and health data",
    path:(user)? `/${userName}/seelogs`:"/login",
  },
  {
    icon: <FaHandHoldingMedical />, // Replace with the actual icon or image
    title: "Organ Banks",
    description: "Hope for a second chance—connect with potential organ donors and find the gift of life",
    path:(user)? `/${userName}/requestorgan`:"/login",
  },
  {
    icon: <FaHandHoldingWater /> , // Replace with the actual icon or image
    title: "Blood Banks",
    description: "Urgently need blood? Find donors and receive the gift of life.",
    path:(user)? `/${userName}/requestblood`:"/login",
  },
  {
    icon: <FaCartPlus /> , // Replace with the actual icon or image
    title: "Equipment Renters for Hospitals, Clinics",
    description: "Need medical equipment? Find rentals for your healthcare needs easily.",
    path:(user)? `/${userName}/rentequipment`:"/login",
  },
  {
    icon: <FaCalendarAlt /> , // Replace with the actual icon or image
    title: "Appointment Booking",
    description: "Looking for an appointment? Find and book a doctor hassle-free",
    path:(user)? `/${userName}/searchFilter`:"/login",
  },
  {
    icon: <FaMicroscope />, // Lab-related icon from react-icons (you can choose any)
    title: "Lab Test Booking",
    description: "Need a lab test? Search and book lab tests easily from trusted labs",
    path: (user) ? `/${userName}/labs-filter` : "/login",
  }
];


  const handleServiceClick = (path) => {
    if (localStorage.getItem('user')) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="services-container">
      <h1>Our services</h1>
      <p>
        Upload prescriptions and health attributes for a complete digital health record. Set reminders for appointments and medications, and regularly review your documents for accurate, up-to-date information.
      </p>
      <div className="services-grid">
        {services.map((service, index) => (
          <div
            className="service-card"
            key={index}
            onClick={() => {
              handleServiceClick(service.path);
              window.scrollTo(0, 0);
            }}
          >
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServices;
