import React from 'react';
import './OurStorySection.css'; // External CSS file for styling
import { assets } from '../../assets/assets';

const OurStorySection = () => {
  return (
    <section className="our-story-section">
      <div className="story-text">
        <h2>Our Story</h2>
        <p>
          Local Face Perfumes was founded by a group of perfume enthusiasts with a shared vision to create a haven
          for perfume lovers seeking authentic, locally-inspired fragrances. Inspired by the diversity and richness
          of cultures around the world, we set out on a journey to curate a collection of scents that capture the
          essence of each region. Our aim is to bring you closer to the heart and soul of different cultures through
          the art of perfumery.
        </p>
      </div>
      <div className="story-image">
        <img src={assets.AboutPerfume} alt="" />
      </div>
    </section>
  );
};

export default OurStorySection;
