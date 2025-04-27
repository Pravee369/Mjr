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

import React, { useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import RootLayout from "./RootLayout";
import Home from "./components/home/Home";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import HealthProfile from "./components/healthProfile/HealthProfile";
import General from "./components/forms/General";
import Diabetes from "./components/forms/Diabetes";
import Heartattack from "./components/forms/Heartattack";
import Eyesight from "./components/forms/Eyesight";
import Cancer from "./components/forms/Cancer";
import Prescription from "./components/forms/prescriptions/Prescription";
import Alarm from "./components/forms/alarms/Alarm";
import Healthlogs from "./components/forms/healthlogs/Healthlogs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import DoctorProfile from "./components/doctorProfile/DoctorProfile";
import BloodBanksProfile from "./components/organisations/bloodBanks/BloodBanksProfile";
import OrganBanksProfile from "./components/organisations/organBanks/OrganBanksProfile";
import LabsProfile from "./components/organisations/labs/LabsProfile";
import PharmaciesProfile from "./components/organisations/pharmacies/PharmaciesProfile";
import HospitalsProfile from "./components/organisations/hospitals/HospitalsProfile";
import EquipRentersProfile from "./components/organisations/equipRenters/EquipRentersProfile";
import ClinicsProfile from "./components/organisations/clinics/ClinicsProfile";
import RootLayoutOrg from "./components/organisations/rootLayout/RootLayout";
import RequestBlood from "./components/forms/RequestBlood";
import RequestOrgan from "./components/forms/RequestOrgan";
import RentEquipment from "./components/forms/RentEquipment";
import BookAppointment from "./components/appointment/BookAppointment.js";
import HomeFilter from "./components/homeFilter/HomeFilter.js";
import DoctorDetails from "./components/doctorDetails/DoctorDetails.js";
import { loginContext } from "./components/contexts/loginContext.js";
import Verifications from "./components/verifications/Verifications.js";
import GetAppointment from "./components/appointment/GetAppointment.js";
import HospitalDetails from "./components/hospitalDetails/HospitalDetails.js";
import BloodBanksApproval from "./components/organisations/bloodBanks/bloodBanksApproval/BloodBanksApproval.js";
import BloodBanksPending from "./components/organisations/bloodBanks/bloodBanksApproval/BloodBanksPending.js";
import OrganBanksApproval from "./components/organisations/organBanks/organBanksApproval/OrganBanksApproval.js";
import OrganBanksPending from "./components/organisations/organBanks/organBanksApproval/OrganBanksPending.js";
import EquipRentersApproval from "./components/organisations/equipRenters/equipRentersApproval/equipRentersApproval.js";
import EquipRentersPending from "./components/organisations/equipRenters/equipRentersApproval/equipRentersPending.js";
import LabsFilter from "./components/labsFilter/LabsFilter.js";
import LabDetails from "./components/labDetails/LabDetails.js";
import LabDashboard from "./components/labDashboard/LabDashboard.js";
import MyTests from "./components/labDashboard/MyTests.js";
import AddTest from "./components/labDashboard/AddTest.js";
import TestAppointments from "./components/labDashboard/TestAppointments.js";
import PharmaHome from "./components/pharmacies/Home.js";
import PharmaStore from "./components/pharmacies/PharmaStore.js";
import CartPage from "./components/pharmacies/Cart.js";
import OrderSuccessful from "./components/pharmacies/AfterCheckout.js";
import Checkout from "./components/pharmacies/Checkout.js";
import { observer } from "mobx-react";
import RouteLayout from "./components/pharmacies/RouteLayout.js";

import PharmacyDashboard from "./components/pharmaciesDashboard/PharmacyDashboard.js";
import PharmacyMedicines from "./components/pharmaciesDashboard/PharmacyMedicines.js";
import AddMedicine from "./components/pharmaciesDashboard/AddMedicine.js";
import PharmacyOrders from "./components/pharmaciesDashboard/PharmacyOrders.js";
import AcceptedOrders from "./components/pharmaciesDashboard/AcceptedOrders.js";

const App = observer(() => {
  let [currentUser, error, userLoginStatus, loginUser, logoutUser] =
    useContext(loginContext);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  let userName = user?.name?.replace(/\s+/g, "-") || "Guest";

  const browserRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/appointment/:id" element={<BookAppointment />} />
        <Route path="/appointments" element={<GetAppointment />} />
        {user && (
          <Route path="/pharmacies" element={<RouteLayout />}>
            <Route index element={<PharmaHome />} />
            <Route path="/pharmacies/:id" element={<PharmaStore />} />{" "}
            <Route path="/pharmacies/cart" element={<CartPage />} />{" "}
            <Route path="/pharmacies/checkout" element={<Checkout />} />{" "}
            <Route
              path="/pharmacies/order-success"
              element={<OrderSuccessful />}
            />{" "}
          </Route>
        )}
        {user && (
          <Route
            path={`/Doctor/${userName}`}
            element={<DoctorProfile />}
          ></Route>
        )}
        {user && (
          <Route path="Organization" element={<RootLayoutOrg />}>
            <Route
              path={`Laboratory/${userName}/dashboard`}
              element={<LabDashboard />}
            >
              <Route index element={<MyTests />} />
              <Route path="add-test" element={<AddTest />} />
              <Route path="test-appointments" element={<TestAppointments />} />
            </Route>
            <Route
              path={`pharmacies/${userName}/dashboard`}
              element={<PharmacyDashboard />}
            >
              <Route path="medicines" element={<PharmacyMedicines />} />
              <Route path="add-medicine" element={<AddMedicine />} />
              <Route path="orders" element={<PharmacyOrders />} />
              <Route path="accepted-orders" element={<AcceptedOrders/>}/>
            </Route>
            <Route
              path={`Blood Bank/approval/${userName}`}
              element={<BloodBanksApproval />}
            />
            <Route
              path={`Blood Bank/pending/${userName}`}
              element={<BloodBanksPending />}
            />
            <Route
              path={`Organ Bank/approval/${userName}`}
              element={<OrganBanksApproval />}
            />
            <Route
              path={`Organ Bank/pending/${userName}`}
              element={<OrganBanksPending />}
            />
            <Route
              path={`Equip Rent/approval/${userName}`}
              element={<EquipRentersApproval />}
            />
            <Route
              path={`Equip Rent/pending/${userName}`}
              element={<EquipRentersPending />}
            />
            <Route
              path={`Hospital/${userName}`}
              element={<HospitalsProfile />}
            />
            <Route
              path={`Hospital/${userName}/verifications`}
              element={<Verifications />}
            />
            <Route path={`Clinic/${userName}`} element={<ClinicsProfile />} />
            <Route
              path={`Equipment Renter/${userName}`}
              element={<EquipRentersProfile />}
            />
          </Route>
        )}

        {user && (
          <Route path={`/Patient/${userName}`} element={<Home />}></Route>
        )}

        {user && (
          <Route path={`${userName}/requestblood`} element={<RequestBlood />} />
        )}
        {user && (
          <Route
            path={`/${userName}/requestorgan`}
            element={<RequestOrgan />}
          />
        )}
        {user && (
          <Route
            path={`${userName}/rentequipment`}
            element={<RentEquipment />}
          />
        )}
        {user && (
          <Route
            path={`/${userName}/prescriptions`}
            element={<Prescription />}
          />
        )}
        {user && <Route path={`${userName}/alarms`} element={<Alarm />} />}
        {user && (
          <Route path={`/${userName}/seelogs`} element={<Healthlogs />} />
        )}
        {user && (
          <Route path={`/${userName}/uploadlogs`} element={<HealthProfile />}>
            <Route
              path={`/${userName}/uploadlogs/general`}
              element={<General />}
            />
            <Route
              path={`/${userName}/uploadlogs/diabetes`}
              element={<Diabetes />}
            />
            <Route
              path={`/${userName}/uploadlogs/heartattack`}
              element={<Heartattack />}
            />
            <Route
              path={`/${userName}/uploadlogs/eyesight`}
              element={<Eyesight />}
            />
            <Route
              path={`/${userName}/uploadlogs/cancer`}
              element={<Cancer />}
            />
          </Route>
        )}
        {user && (
          <Route
            path={`${userName}/bookappointment`}
            element={<BookAppointment />}
          />
        )}
        {user && (
          <Route path={`/${userName}/searchFilter`} element={<HomeFilter />} />
        )}
        {user && (
          <Route path={`/${userName}/labs-filter`} element={<LabsFilter />} />
        )}
        {user && (
          <Route
            path={`/${userName}/searchFilter/doctor/:id`}
            element={<DoctorDetails />}
          />
        )}
        {user && (
          <Route
            path={`/${userName}/searchFilter/hospital/:id`}
            element={<HospitalDetails />}
          />
        )}
        {user && (
          <Route
            path={`/${userName}/labs-filter/laboratory/:id`}
            element={<LabDetails />}
          />
        )}
      </Route>
    )
  );

  return (
    <div className="app">
      <RouterProvider router={browserRouter} />
    </div>
  );
});

export default App;
