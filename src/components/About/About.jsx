import React from 'react';
import './About.css'; // Import CSS for styling
import aboutImage from '../../assets/About.png'; // Import background image

const About = () => {
  return (
    <>
      <div className="breadcrumb">Home / About</div>

      <div className="about-container" id='About'>
        {/* Background Image */}
        <img src={aboutImage} alt="Background" className="background-image" />

        <div className="overlay">
          <div className="about-content">
            <h1>About Us</h1>
            <p>
              At Local Face, we believe that perfumes are more than just scents; 
              they are expressions of one's individuality and style. 
              Our passion for exquisite fragrances led us to curate a collection 
              that captures the essence of diverse personalities, bringing you 
              an unparalleled olfactory experience.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;