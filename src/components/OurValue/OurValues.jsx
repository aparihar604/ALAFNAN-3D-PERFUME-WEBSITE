import './OurValues.css'; // You can put the CSS in an external file or in the component
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';

const OurValues = () => {
  return (
    <div className="values-section">
      <div className="values-container">
        <div className="image-container">
          <motion.img 
          variants={fadeIn("right", 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
            src={assets.OurValues} 
            alt="Perfume Bottle" 
            className="perfume-image" 
          />
        </div>
        <motion.div
        variants={fadeIn("left", 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        className="text-container">
          <h2 className="title">Our Values</h2>
          <p className="description">
            At Local Face, our perfume retail store is built on a foundation of passion and authenticity.
            We believe in celebrating the individuality of every customer, providing a diverse collection 
            of scents that resonate with their unique personality and style. Our dedicated team of 
            fragrance enthusiasts is committed to creating a welcoming and inclusive environment, where 
            connections are forged, and inspiration thrives.
          </p>
          <p className="description">
            Embracing sustainability and continuous learning, Local Face strives to be more than just 
            a shopping destination; we are a community that inspires and empowers individuals on their 
            fragrance journey.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default OurValues;