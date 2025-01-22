import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdNotificationsActive } from 'react-icons/md';
import { RiHealthBookFill } from 'react-icons/ri';
import './OurServices.css';

const OurServices = () => {

  const navigate = useNavigate();
  
  const user=JSON.parse(localStorage.getItem('user'));

const services = [
  {
    icon: "📄", // Replace with the actual icon or image
    title: "Upload Prescriptions",
    description:
      "Upload your prescriptions to avoid the hassle of carrying physical documents and keep your medical records organized and easily accessible. This ensures you have a secure, digital copy whenever you need it, simplifying your healthcare management.",
    path: (user)?`/user-profile/${JSON.parse(localStorage.getItem('user')).username}/prescriptions`:"/login",
  },
  {
    icon: <MdNotificationsActive />, // Replace with the actual icon or image
    title: "Alarms",
    description:
      "Set alarms for doctor appointments and pill times to ensure you never miss a critical healthcare task.",
    path: (user)?`/user-profile/${JSON.parse(localStorage.getItem('user')).username}/alarms`:"/login",
  },
  {
    icon: <RiHealthBookFill />, // Replace with the actual icon or image
    title: "Health Logging",
    description:
      "Upload health attributes like blood pressure and cholesterol levels to maintain a comprehensive digital health record. This enables easy monitoring and better tracking of your health trends.",
    path:(user)?`/user-profile/${JSON.parse(localStorage.getItem('user')).username}/healthlogs`:"/login",
  },
  {
    icon: "📊", // Replace with the actual icon or image
    title: "Tracking",
    description: "Track and save your medical history and health data",
    path:(user)? `/user-profile/${JSON.parse(localStorage.getItem('user')).username}`:"/login",
  },
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
            onClick={() => handleServiceClick(service.path)}
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
