import { View } from '@react-three/drei';
import Scene from '../../pages/SceneThree';
import './HeroTwo.css'; // Importing the CSS file

const HeroTwo = () => {
  return (
    <div className="heroTwo-container">
      <div className="heroTwo-content">
        <h1>Right Aligned Heading</h1>
        <p>This is a right-aligned paragraph inside the HeroTwo component. You can add any details here, making it look appealing and informative.</p>
        <button className="heroTwo-btn">Get Started</button>
      </div>

      {/* Overlay model or any other content */}
      <div className="ModelContainer">
        <View className="Model">
          <Scene />
        </View>
      </div>
    </div>
  );
};

export default HeroTwo;