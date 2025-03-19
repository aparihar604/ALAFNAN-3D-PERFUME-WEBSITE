import { useNavigate } from "react-router-dom";
import "./Hero.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Preload } from "@react-three/drei";
import { useRef } from "react";
import Scene from "../../pages/Scene";

const Hero = () => {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate("/shop");
  };

  const modelRef = useRef(null);

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>Elevate Your Spirit with Victory Scented Fragrances!</h1>
        <p>Shop now and embrace the sweet smell of victory with Local Face.</p>
        <button className="hero-btn" onClick={handleShopNowClick}>
          Shop Now
        </button>
      </div>

      {/* Container for 3D models */}
      <div className="ModelContainer">
        <Canvas style={{ width: "100%", height: "100%" }} camera={{ position: [0, 0, 5], fov: 60 }}>
          {/* Adding OrbitControls for model interaction */}
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
          
          {/* Preload the models before rendering */}
          <Preload all />

          {/* Models with spacing between them */}
          <Scene ref={modelRef} modelPath="/open.glb" position={[-3, 0, 0]} rotationSpeed={0.06} scale={4} />
          <Scene modelPath="/Aseel.glb" position={[0, 0, 0]} rotationSpeed={0.015} scale={4} />
          <Scene modelPath="/Dubai_Nights.glb" position={[3, 0, 0]} rotationSpeed={0.02} scale={4} />

          {/* Environment and lighting */}
          <Environment files="/hdr/lobby.hdr" intensity={3} />
        </Canvas>
      </div>
    </div>
  );
};

export default Hero;
