// // import React from 'react'
// // import {createBrowserRouter,RouterProvider} from 'react-router-dom' ;
// // import RootLayout from './RootLayout'; 
// // import Home from './components/home/Home';
// // import Register from './components/register/Register';
// // import Login from './components/login/Login';
// // import UserProfile from './components/userProfile/UserProfile';
// // import General from './components/forms/General';
// // import Diabetes from './components/forms/Diabetes';
// // import Heartattack from './components/forms/Heartattack';
// // import Eyesight from './components/forms/Eyesight';
// // import Cancer from './components/forms/Cancer';
// // import Prescription  from './components/forms/prescriptions/Prescription';
// // import Alarm from './components/forms/alarms/Alarm';
// // import Healthlogs from './components/forms/healthlogs/Healthlogs';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import './App.css'

// // function App() {
// //   const browserRouter=createBrowserRouter([
// //     {
// //       path:"/",
// //       element:<RootLayout />,
// //       children:[
// //         {
// //           path:"/",
// //           element:<Home />
// //         },
// //         {
// //           path:"/register",
// //           element:<Register />
// //         },
// //         {
// //           path:"/login",
// //           element:<Login />
// //         },
// //         {
// //           path:/user-profile/${JSON.parse((localStorage.getItem('user'))).username},
// //           element:<UserProfile />,
// //           children:[
// //             {
// //                path:"general",
// //               element:< General/>
// //             },
// //             {
// //               path:"diabetes",
// //               element:< Diabetes/>
// //             },
// //             {
// //               path:"heartattack",
// //               element:< Heartattack/>
// //             },
// //             {
// //               path:"eyesight",
// //               element:< Eyesight/>
// //             },
// //             {
// //               path:"cancer",
// //               element:< Cancer/>
// //             },
// //             {
// //               path:"prescriptions",
// //               element:< Prescription/>
// //             },
// //             {
// //               path:"alarms",
// //               element:< Alarm/>
// //             },
// //             {
// //               path:"healthlogs",
// //               element:< Healthlogs/>
// //             }
// //           ]
// //         }
// //       ]
// //     }
// //   ])

// //   return (
// //     <div className="app">
// //       <RouterProvider router={browserRouter} />
// //     </div>
// //   );
// // }

// // export default App;


// import React from 'react';
// import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
// import RootLayout from './RootLayout';
// import Home from './components/home/Home';
// import Register from './components/register/Register';
// import Login from './components/login/Login';
// import UserProfile from './components/userProfile/UserProfile';
// import General from './components/forms/General';
// import Diabetes from './components/forms/Diabetes';
// import Heartattack from './components/forms/Heartattack';
// import Eyesight from './components/forms/Eyesight';
// import Cancer from './components/forms/Cancer';
// import Prescription from './components/forms/prescriptions/Prescription';
// import Alarm from './components/forms/alarms/Alarm';
// import Healthlogs from './components/forms/healthlogs/Healthlogs';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';

// function App() {
//   const user = JSON.parse(localStorage.getItem('user'));

//   const browserRouter = createBrowserRouter(
//     createRoutesFromElements(
//       <Route path="/" element={<RootLayout />}>
//         <Route path="/" element={<Home />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         {user && (
//           <Route path={/user-profile/${user.name}} element={<UserProfile />}>
//             <Route path="general" element={<General />} />
//             <Route path="diabetes" element={<Diabetes />} />
//             <Route path="heartattack" element={<Heartattack />} />
//             <Route path="eyesight" element={<Eyesight />} />
//             <Route path="cancer" element={<Cancer />} />
//             <Route path="prescriptions" element={<Prescription />} />
//             <Route path="alarms" element={<Alarm />} />
//             <Route path="healthlogs" element={<Healthlogs />} />
//           </Route>
//         )}
//       </Route>
//     )
//   );

//   return (
//     <div className="app">
//       <RouterProvider router={browserRouter} />
//     </div>
//   );
// }

// export default App;

// import React from 'react'
// import {createBrowserRouter,RouterProvider} from 'react-router-dom' ;
// import RootLayout from './RootLayout'; 
// import Home from './components/home/Home';
// import Register from './components/register/Register';
// import Login from './components/login/Login';
// import UserProfile from './components/userProfile/UserProfile';
// import General from './components/forms/General';
// import Diabetes from './components/forms/Diabetes';
// import Heartattack from './components/forms/Heartattack';
// import Eyesight from './components/forms/Eyesight';
// import Cancer from './components/forms/Cancer';
// import Prescription  from './components/forms/prescriptions/Prescription';
// import Alarm from './components/forms/alarms/Alarm';
// import Healthlogs from './components/forms/healthlogs/Healthlogs';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css'

// function App() {
//   const browserRouter=createBrowserRouter([
//     {
//       path:"/",
//       element:<RootLayout />,
//       children:[
//         {
//           path:"/",
//           element:<Home />
//         },
//         {
//           path:"/register",
//           element:<Register />
//         },
//         {
//           path:"/login",
//           element:<Login />
//         },
//         {
//           path:/user-profile/${JSON.parse((localStorage.getItem('user'))).username},
//           element:<UserProfile />,
//           children:[
//             {
//                path:"general",
//               element:< General/>
//             },
//             {
//               path:"diabetes",
//               element:< Diabetes/>
//             },
//             {
//               path:"heartattack",
//               element:< Heartattack/>
//             },
//             {
//               path:"eyesight",
//               element:< Eyesight/>
//             },
//             {
//               path:"cancer",
//               element:< Cancer/>
//             },
//             {
//               path:"prescriptions",
//               element:< Prescription/>
//             },
//             {
//               path:"alarms",
//               element:< Alarm/>
//             },
//             {
//               path:"healthlogs",
//               element:< Healthlogs/>
//             }
//           ]
//         }
//       ]
//     }
//   ])

//   return (
//     <div className="app">
//       <RouterProvider router={browserRouter} />
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import RootLayout from './RootLayout';
import Home from './components/home/Home';
import Register from './components/register/Register';
import Login from './components/login/Login';
import HealthProfile from './components/healthProfile/HealthProfile';
import General from './components/forms/General';
import Diabetes from './components/forms/Diabetes';
import Heartattack from './components/forms/Heartattack';
import Eyesight from './components/forms/Eyesight';
import Cancer from './components/forms/Cancer';
import Prescription from './components/forms/prescriptions/Prescription';
import Alarm from './components/forms/alarms/Alarm';
import Healthlogs from './components/forms/healthlogs/Healthlogs';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import DoctorProfile from './components/doctorProfile/DoctorProfile';
import BloodBanksProfile from './components/organisations/bloodBanks/BloodBanksProfile';
import OrganBanksProfile from './components/organisations/organBanks/OrganBanksProfile';
import LabsProfile from './components/organisations/labs/LabsProfile';
import PharmaciesProfile from './components/organisations/pharmacies/PharmaciesProfile';
import HospitalsProfile from './components/organisations/hospitals/HospitalsProfile';
import EquipRentersProfile from './components/organisations/equipRenters/EquipRentersProfile';
import ClinicsProfile from './components/organisations/clinics/ClinicsProfile';
import RootLayoutOrg from './components/organisations/rootLayout/RootLayout';
import RequestBlood from './components/forms/RequestBlood';
import RequestOrgan from './components/forms/RequestOrgan';
import RentEquipment from './components/forms/RentEquipment';
import Profile from './components/profile/Profile';
import BookAppointment from "./components/appointment/BookAppointment.js";
import HomeFilter from './components/homeFilter/HomeFilter.js';
import DoctorDetails from "./components/doctorDetails/DoctorDetails.js"

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  const browserRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        {user && (
          <Route 
           path={`/Doctor/${user.name}`} 
           element={<DoctorProfile />}
           ></Route>
        )}
        {user && (
          <Route path='Organization' element={<RootLayoutOrg />}>
            <Route path={`Laboratory/${user.name}`} element={<LabsProfile/>}/>
            <Route path={`Blood Bank/${user.name}`} element={<BloodBanksProfile/>}/>
            <Route path={`Organ Bank/${user.name}`} element={<OrganBanksProfile/>}/>
            <Route path={`Pharmacy/${user.name}`} element={<PharmaciesProfile/>}/>
            <Route path={`Hospital/${user.name}`} element={<HospitalsProfile/>}/>
            <Route path={`Clinic/${user.name}`} element={<ClinicsProfile/>}/>
            <Route path={`Equipment Renter/${user.name}`} element={<EquipRentersProfile/>}/>
          </Route>
        )}

        {user && (
          <Route path={`/Patient/${user.name}`} element={<Home />}>
          </Route>
        )}

        { user && ( <Route path={`${user.name}/requestblood`} element={<RequestBlood />} />) }
        { user && ( <Route path={`/${user.name}/requestorgan`} element={<RequestOrgan />} /> ) }
        { user && ( <Route path={`${user.name}/rentequipment`} element={<RentEquipment />} /> )}
        { user && ( <Route path={`/${user.name}/prescriptions`} element={<Prescription />} /> )}
        { user && ( <Route path={`${user.name}/alarms`} element={<Alarm />} /> )}
        { user && ( <Route path={`/${user.name}/seelogs`} element={<Healthlogs />} /> )}
        {user && (
          <Route path={`/${user.name}/uploadlogs`} element={<HealthProfile />}>
            <Route path={`/${user.name}/uploadlogs/general`} element={<General />} />
            <Route path={`/${user.name}/uploadlogs/diabetes`}element={<Diabetes />} />
            <Route path={`/${user.name}/uploadlogs/heartattack`} element={<Heartattack />} />
            <Route path={`/${user.name}/uploadlogs/eyesight`} element={<Eyesight />} />
            <Route path={`/${user.name}/uploadlogs/cancer`} element={<Cancer />} />
           
          </Route>
        )}
         { user && ( <Route path={`${user.name}/bookappointment`} element={< BookAppointment />} />) }
         { user && ( <Route path={`${user.name}/searchFilter`} element={< HomeFilter />} />) }
      </Route>
    )
  );

  return (
    <div className="app">
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;