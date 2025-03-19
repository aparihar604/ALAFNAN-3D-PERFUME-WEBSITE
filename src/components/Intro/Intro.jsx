import './Intro.css';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';
import backgroundImage from '../../assets/AImage.png';

const Intro = () => {
  return (
    <section className="intro">
      {/* Background Image */}
      <img src={backgroundImage} alt="Background" className="background-image" />

      <div className="overlay">
        <motion.h1
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="intro-title"
        >
          Welcome to Local Face
        </motion.h1>
        
        <motion.p
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="intro-description"
        >
          Welcome to Local Face Perfumes, where the spirit of victory and triumph come alive through scents that empower and inspire. Our curated collection, aptly named "Victory Scented," is a celebration of success and elegance, designed to unleash your victorious essence. Indulge in the sweet taste of triumph with captivating fragrances that tell the tale of your achievements. At Local Face, we believe that every victory deserves a signature scent, and we are dedicated to providing unforgettable fragrances that elevate your spirit and empower your journey.
        </motion.p>
      </div>
    </section>
  );
}

export default Intro;