import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import Model from "../../components/NewModel";

const Scene = ({ modelPath }) => {
  const modelRef = useRef(null);

  useEffect(() => {
    if (!modelRef.current) return;

    // Continuous rotation using GSAP
    const rotateAnimation = gsap.to(modelRef.current.rotation, {
      y: "+=6.283", // Full rotation (2 * Math.PI)
      duration: 2.5, // Duration of one rotation
      ease: "linear",
      repeat: -1, // Infinite rotation
    });

    // Cleanup on unmount
    return () => rotateAnimation.kill();
  }, [modelPath, modelRef.current]);

  const handleHover = (hovered) => {
    setIsHovered(hovered);

    if (hovered) {
      // Hover-specific animation
      gsap.to(modelRef.current.scale, {
        x: 2.2,
        y: 2.2,
        z: 2.2,
        duration: 0.3,
        ease: "power1.out",
      });
      gsap.to(modelRef.current.rotation, {
        y: "+=3.14", // Half rotation during hover
        duration: 0.3,
        ease: "power1.out",
      });
    } else {
      // Reset scale and resume original rotation
      gsap.to(modelRef.current.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  };

  return (
    <group>
      <Canvas>
        <ambientLight intensity={Math.PI} />
        <Model
         modelPath={modelPath}
          ref={modelRef}
          scale={[2.5, 2.5, 2.5]}
          position={[0, 0.05, 0]} // Adjust position here: [x, y, z]
        />
        <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
      </Canvas>
    </group>
  );
};

export default React.memo(Scene);
