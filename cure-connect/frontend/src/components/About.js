import React from 'react';

const About = () => {
  return (
    <div className="about">
      <h2>About Cure Connect</h2>
      <p>
        Cure Connect is a comprehensive doctor appointment system designed to make healthcare
        accessible and convenient for everyone. Our platform connects patients with qualified
        healthcare professionals, making it easy to book appointments and manage your health.
      </p>

      <div className="mission">
        <h3>Our Mission</h3>
        <p>
          To revolutionize healthcare accessibility by providing a seamless platform that connects
          patients with doctors, ensuring timely and quality healthcare services.
        </p>
      </div>

      <div className="features">
        <h3>Why Choose Cure Connect?</h3>
        <ul>
          <li>Easy appointment booking</li>
          <li>Wide range of specialists</li>
          <li>Secure and confidential</li>
          <li>24/7 support</li>
          <li>User-friendly interface</li>
        </ul>
      </div>

      <div className="contact">
        <h3>Contact Us</h3>
        <p>Email: info@cureconnect.com</p>
        <p>Phone: +1 (555) 123-4567</p>
      </div>
    </div>
  );
};

export default About;
