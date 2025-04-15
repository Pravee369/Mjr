import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { loginContext } from "../contexts/loginContext";
import axios from "axios";
import "./LabDetails.css";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // 👈 Import plugin
dayjs.extend(isSameOrAfter);

const LabDetails = () => {
  let [currentUser] = useContext(loginContext);
  const { id } = useParams();
  const [lab, setLab] = useState(null);
  const [tests, setTests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotError, setSlotError] = useState("");

  // UseEffect for fetching lab details
  useEffect(() => {
    const fetchLabDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/labs-api/labs/${id}`);
        setLab(res.data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching lab details:", error);
      }
    };

    fetchLabDetails();
  }, [id]);

  // UseEffect for fetching lab tests
  useEffect(() => {
    const fetchLabTests = async () => {
      if (lab?.username) {
        try {
          const res = await axios.get(`http://localhost:3000/lab-tests/tests?username=${lab.username}`);
          setTests(res.data);
        } catch (error) {
          console.error("Error fetching lab tests:", error);
        }
      }
    };

    fetchLabTests();
  }, [lab]);

  // UseEffect for generating slots based on test, date, and lab timings
  useEffect(() => {
    const generateSlots = async () => {
      if (!selectedTest || !bookingDate || !lab?.startTime || !lab?.endTime) return;

      const start = dayjs(`${bookingDate}T${lab.startTime}`);
      const end = dayjs(`${bookingDate}T${lab.endTime}`);
      const duration = selectedTest.slotDuration;

      let slots = [];
      for (let t = start; t.add(duration, "minute").isBefore(end); t = t.add(duration, "minute")) {
        slots.push(t.format("HH:mm"));
      }

      // Fetch booked slots
      try {
        const res = await axios.get("http://localhost:3000/lab-tests/bookings", {
          params: {
            labId: lab.username,
            testName: selectedTest.testName,
            date: bookingDate,
          },
        });

        const bookedSlots = res.data.bookingsCountByTime || {}; // e.g., { "09:00": 2, "10:00": 1 }

        const available = slots.map((time) => {
          const count = bookedSlots[time] || 0;
          return {
            time,
            count,
            isFull: count >= selectedTest.maxBookingsPerSlot,
          };
        });

        setAvailableSlots(available);
        setBookingTime(""); // Reset previously selected time
        setSlotError("");
      } catch (err) {
        console.error("Error fetching booked slots", err);
        setSlotError("Failed to fetch available slots");
      }
    };

    generateSlots();
  }, [bookingDate, selectedTest, lab]);

  // UseEffect for handling keydown event for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // UseEffect for handling scroll lock/unlock when modal is opened/closed
  useEffect(() => {
        if (showModal) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
     }, [showModal]);

  const isDateValid = (dateStr) => {
    return dayjs(dateStr).isSameOrAfter(dayjs().format("YYYY-MM-DD"));
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!lab) {
    return <p className="loading-text">Loading Lab Details...</p>;
  }

  const openBookingModal = (test) => {
    setSelectedTest(test);
    setShowModal(true);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleBooking = async () => {
    if (!bookingDate || !bookingTime) return;

    setIsBooking(true);
    try {
      const response = await axios.post("http://localhost:3000/lab-tests/bookings", {
        labId: lab.username,
        labName: lab.name,
        testName: selectedTest.testName,
        price: selectedTest.price,
        date: bookingDate,
        time: bookingTime,
        userEmail: currentUser.username, // If stored after login
      });
      if (response.status === 201) {
        setSuccessMsg("Test booked successfully!");
        setShowModal(false);
        setBookingDate("");
        setBookingTime("");
      } else {
        setErrorMsg(response.data.message || "Booking failed.");
      }
    } catch (error) {
      console.error("Error booking test:", error);
      setErrorMsg(error.response?.data?.message || "Booking failed.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleOutsideClick = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="lab-details-container">
        <h2 className="lab-details-title">{lab.name}</h2>

        <div className="lab-details-card">
          <p><strong>Address:</strong> {lab.address}</p>
          <p><strong>Mobile:</strong> {lab.mobile}</p>
          <p><strong>Email ID:</strong> {lab.username}</p>
          <p><strong>Timings:</strong> {formatTime(lab.startTime)} - {formatTime(lab.endTime)}</p>
        </div>
      </div>

      <div className="lab-test-details-container">
        <div className="lab-tests-section">
          <h3 className="lab-tests-heading">Tests Offered</h3>
          {tests.length === 0 ? (
            <p className="no-tests-msg">No tests available.</p>
          ) : (
            <div className="lab-tests-grid">
              {tests.map((test) => (
                <div key={test._id} className="lab-test-card">
                  <h4>{test.testName}</h4>
                  <p><strong>Sample Type :</strong> {test.sampleType}</p>
                  <p><strong>Price :</strong> ₹{test.price}</p>
                  <p><strong>Result Time :</strong> {test.resultTime}</p>
                  {test.instructions && (
                    <p><strong>Instructions :</strong> {test.instructions}</p>
                  )}
                  {test.description && (
                    <p className="lab-test-description">{test.description}</p>
                  )}
                  <button className="book-btn" onClick={() => openBookingModal(test)}>Book Test</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showModal && selectedTest && (
        <div className="booking-modal" onClick={handleOutsideClick}>
          <div className="booking-content" onClick={(e) => e.stopPropagation()}>
            <h3>Book : {selectedTest.testName}</h3>
            <p><strong>Price :</strong> ₹{selectedTest.price}</p>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => {
                if (isDateValid(e.target.value)) {
                  setBookingDate(e.target.value);
                }
              }}
              min={dayjs().format("YYYY-MM-DD")}
            />
            {bookingDate && (
              <>
                <p><strong>Select a Time Slot</strong></p>
                {slotError && <p className="error-msg">{slotError}</p>}
                <div className="slot-grid">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      className={`slot-btn ${slot.isFull ? "disabled-slot" : ""} ${bookingTime === slot.time ? "selected-slot" : ""}`}
                      onClick={() => !slot.isFull && setBookingTime(slot.time)}
                      disabled={slot.isFull}
                    >
                      <div>
                        {dayjs(`${bookingDate}T${slot.time}`).format("hh:mm A")}
                      </div>
                      <div className="slot-capacity-text">
                        {slot.count}/{selectedTest.maxBookingsPerSlot} booked
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="booking-buttons">
              <button onClick={handleBooking} disabled={isBooking}>
                {isBooking ? "Booking..." : "Confirm Booking"}
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>

            {successMsg && <p className="success-msg">{successMsg}</p>}
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default LabDetails;
