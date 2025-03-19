import { View } from '@react-three/drei';
import { motion } from 'framer-motion';
import './Collections.css';
import Scene from '../../pages/sceneFour';
import { fadeIn } from '../../variants';
import backgroundImage from '../../assets/AImage.png';

const Collections = () => {
  return (
    <div className="collections-section">
      <img src={backgroundImage} alt="Background" className="background-image" />
            <motion.h1
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="intro-title"
        >
          Our Collections
        </motion.h1>
      <div className="model-overlay">
        {/* Replace this with your model or overlay image */}
        <View className='Model' > 
          <Scene />
        </View>
      </div>
    </div>
  );
};

export default Collections;