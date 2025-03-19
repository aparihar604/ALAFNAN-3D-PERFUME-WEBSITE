import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const Scene = ({ modelPath, position = [0, 0, 0], rotationSpeed = 0.01 }) => {
  const modelRef = useRef(null);

  // Rotate the model at a given speed
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += rotationSpeed;
    }
  });

  const { scene } = useGLTF(modelPath);

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      position={position} 
      scale={[2, 2, 2]} 
    />
  );
};

export default Scene;
