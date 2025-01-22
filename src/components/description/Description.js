import React from "react";
import "./Description.css";
import healthcareImage from "../../images/ourservicesImage.png"; // Replace with the correct path

const Description = () => {
  return (
    <div className="container">
      <section className="section">
        <img src={healthcareImage} alt="Healthcare" className="image" />
        <div className="content">
          <h2>Leading healthcare providers</h2>
          <p>
            Trafalgar provides progressive, and affordable healthcare,
            accessible on mobile and online for everyone. To us, it's not just
            work. We take pride in the solutions we deliver.
          </p>
          <button className="button">Learn more</button>
        </div>
      </section>
      <section className="section">
        <div className="content">
          <h2>Download our mobile apps</h2>
          <p>
            Our dedicated patient engagement app and web portal allow you to
            access information instantaneously (no tedious form, long calls, or
            administrative hassle) and securely.
          </p>
          <button className="button">Download</button>
        </div>
        <img src={healthcareImage} alt="Mobile App" className="image" />
      </section>
    </div>
  );
};

export default Description;
