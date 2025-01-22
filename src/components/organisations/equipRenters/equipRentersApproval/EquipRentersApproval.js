import React, { useContext, useEffect, useState } from "react";
import "./EquipRentersApproval.css";
import { CgProfile } from "react-icons/cg";
import { loginContext } from "../../../contexts/loginContext";
import { NavLink } from "react-router-dom";
import axios from "axios";

function EquipRentersApproval() {
  let [clickedObject,setClickedObject]=useState({})
  const user = JSON.parse(localStorage.getItem("user"));
  let [currentUser, error, userLoginStatus, loginUser, logoutUser] =
    useContext(loginContext);
  let [requestedApprovals, setRequestedApprovals] = useState([]);

  let [acceptedRequests, setAcceptedRequests] = useState([]);
  let token = localStorage.getItem("token");
  useEffect(() => {
    // Ensure this is correct
    if (!token) {
      console.error("No token found");
      return;
    }

    console.log("Fetching Requested Approvals...");
    axios
      .get("http://localhost:3000/equipment-renters/get-required-equipment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        let allApprovals = res.data.payload || [];
        console.log("Fetches all the Requested Approvals :", allApprovals);
        await setRequestedApprovals(
          allApprovals.filter((obj) => {
            console.log(obj, obj.approved);
            return obj.approved == "NO";
          })
        );
        await setAcceptedRequests(
          allApprovals.filter((obj) => {
            return obj.approved==="YES" && obj.approvedBy === user.username;
          })
        );
        console.log("Only Requested Approvals ", requestedApprovals);
        console.log("Accepted Requests ", acceptedRequests);
      })
      .catch((err) => {
        console.log("Error in getting healthlogs:", err);
      });
  }, []);

  let acceptReq = (RequestObj) => {
    console.log("Available is clicked");
    let temp = RequestObj._id;
    console.log("Clicked on Object", RequestObj, "with ID ", temp);
    let updatedObj = {};
    updatedObj["approved"] = "YES";
    updatedObj["approvedBy"] = user.username;
    updatedObj["equipment"] = RequestObj.equipment;
    updatedObj["city"] = RequestObj.city;
    updatedObj["mobile"] = RequestObj.mobile;
    updatedObj["pinCode"] = RequestObj.pinCode;
    updatedObj["state"] = RequestObj.state;
    updatedObj["type"] = RequestObj.type;
    updatedObj["username"] = RequestObj.username;
    updatedObj["requirements"] = RequestObj.requirements;
    console.log("Updated Approved Requested is ", updatedObj);
    axios
      .put(
            `http://localhost:3000/equipment-renters/update-rent-equipment-request/${temp}`,
        updatedObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Response for put request : ", response.data);
        requestedApprovals.forEach((ele) => {
          if (ele._id == temp) {
            ele.approved = "YES";
            ele.approvedBy = user.username;
          }
        });
        setAcceptedRequests([...acceptedRequests, RequestObj]);
        setRequestedApprovals(
          requestedApprovals.filter((obj) => {
            return obj._id != temp;
          })
        );
        console.log(
          "Requested Approvals after clicking on available ",
          requestedApprovals
        );
        console.log(
          "Accepted Approvals after clicking on Available ",
          acceptedRequests
        );
      })
      .catch((error) => console.error("Error in put request:", error));
  };
  const inactiveLink = {
    color: "#6C0345",
    fontSize: "1.1rem",
    fontWeight: 600,
    backgroundColor: "#EEE0C9",
  };

  const activeLink = {
    color: "black",
    fontSize: "1.1rem",
    backgroundColor: "#EEE0C9",
    fontWeight: 800,
  };
  let rejectRequest = (rejectedReq) => {
    // setRequests(
    //   requests.filter((obj) => {
    //     return obj.id != rejectedReq.id;
    //   })
    // );
  };
  return (
    <div className="bloodOrg" style={{ width: "100%" }}>
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Acknowledge
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <b>
                Are you sure the specified equipment is 
                available?
              </b>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  console.log("On Click Clicked ", clickedObject);
                  acceptReq(clickedObject);
                }}
                data-bs-dismiss="modal"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="top_bar">
        <div className="profile">
          <CgProfile />
        </div>
        <div className="content">
          <a href="#pendingRequests">Pending Requests</a>
          <a href="#approvedRequests">Approved Requests</a>
          <NavLink
            className="nav-link"
            to="/login"
            onClick={logoutUser}
          >
            Logout
          </NavLink>
        </div>
      </div>
      {/* Requested */}
      <div className="p-4" id="pendingRequests" style={{ width: "100%" }}>
        <div className="row" style={{ width: "100%" }}>
          {requestedApprovals.map((curObj, index) => {
            return (
              <div className="col-4 mt-3">
                <div className="card" style={{ width: "100%" }}>
                  <h5
                    className="card-title p-2"
                    style={{
                      backgroundColor: "#365E32",
                      color: "#fff",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                      textAlign: "center",
                    }}
                  >
                    <b>{curObj.equipment}</b>
                  </h5>
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 ">
                      <b>Name : </b> {curObj.patientName}
                    </h6>
                    <div className="card-text">
                      <b>Location : </b>
                      <p style={{ paddingLeft: "10px", margin: "0px" }}>
                        City : {curObj.city}
                      </p>
                      <p style={{ paddingLeft: "10px", margin: "0px" }}>
                        State : {curObj.state}
                      </p>
                      <p style={{ paddingLeft: "10px", margin: "0px" }}>
                        PinCode : {curObj.pinCode}
                      </p>
                      <p style={{ paddingLeft: "10px", margin: "0px" }}>
                        Specific Requirements : {curObj.requirements}
                      </p>
                    </div>
                    <p className="card-text">
                      <b>Contact Details :</b> {curObj.mobile}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      {/*<button
                        className="card-link btn btn-danger"
                        onClick={() => rejectRequest(curObj)}
                      >
                        Unavailable
                      </button>*/}
                      <button
                        className="card-link btn"
                        style={{
                          backgroundColor: "#347928",
                          color: "#fff",
                        }}
                        onClick={() => {
                          setClickedObject(curObj);
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Available
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div id="approvedRequests" className="approvedRequests">
        <h2 className="heading">Approved requests</h2>
        <div className="row" style={{ width: "100%" }}>
          <div>
            {acceptedRequests.length === 0 && (
              <p className=" no_requests">No Requests Approved Till Now!!</p>
            )}
          </div>
          {acceptedRequests.map((curObj, index) => {
            return (
              <div className="col-4 mt-3">
                <div className="card" style={{ width: "100%" }}>
                  <h5
                    className="card-title p-2"
                    style={{
                      backgroundColor: "#365E32",
                      color: "#fff",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                      textAlign: "center",
                    }}
                  >
                    {curObj.equipment}
                  </h5>
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 ">
                      <b>Name : </b> {curObj.patientName}
                    </h6>
                    <div className="card-text">
                      <b>Location : </b>
                      <p style={{ paddingLeft: "10px", margin: "0px" }}>
                        City : {curObj.city}
                      </p>
                      <p style={{ paddingLeft: "10px", margin: "0px" }}>
                        State : {curObj.state}
                      </p>
                      <p style={{ paddingLeft: "10px", margin: "0px" }}>
                        PinCode : {curObj.pinCode}
                      </p>
                      <p style={{ paddingLeft: "10px", margin: "0px" }}>
                        Specific Requirements : {curObj.requirements}
                      </p>
                    </div>
                    <p className="card-text">
                      <b>Contact Details :</b> {curObj.mobile}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EquipRentersApproval;