import { useRef, useState, useEffect } from "react";
import FloatingModel from "../components/FloatingModel/FloatingModel";
import { Environment, OrbitControls, Html } from "@react-three/drei";
import gsap from "gsap";

const Scene = ({ modelPath }) => {
  const modelRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false); // Track hover state for the model
  const FLOAT_SPEED = 1.5;

  const productDetails = {
    name: "Ambar Ki Mas’huriyat",
    tagline: "Small tagline for this product",
    price: "1499 INR",
  };

  useEffect(() => {
    if (!modelRef.current) return;

    // Continuous rotation using GSAP
    const rotateAnimation = gsap.to(modelRef.current.rotation, {
      y: "+=6.283", // Full rotation (2 * Math.PI)
      duration: 3, // Duration of one rotation
      ease: "linear",
      repeat: -1, // Infinite rotation
    });

    // Cleanup on unmount
    return () => rotateAnimation.kill();
  }, []);

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
      {modelPath && (
        <FloatingModel
          ref={modelRef}
          modelPath={modelPath}
          floatspeed={FLOAT_SPEED}
          scale={[2.5, 2.5, 2.5]} 
          position={[0, 0.05, 0]} // Adjust position here: [x, y, z]
          onPointerOver={() => handleHover(true)} // Trigger hover animation
          onPointerOut={() => handleHover(false)} // Reset hover animation
        />
      )}

      <Html
        position={[1.5, 0, 0]} // Adjust based on model positioning
        distanceFactor={5}
        style={{
          background: "rgba(0, 0, 0, 0.9)",
          border: "1px solid #00d9ff",
          borderRadius: "15px",
          padding: "1rem",
          color: "#fff",
          width: "250px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "'Poppins', sans-serif",
          opacity: isHovered ? 1 : 0, // Only show text when hovered
          transform: isHovered ? "translateX(0)" : "translateX(100%)", // Move text from right to left on hover
          transition: "transform 0.5s ease, opacity 0.5s ease",
        }}
      >
        <img
          src="/path-to-image.png" // Replace with your image path
          alt={productDetails.name}
          style={{
            width: "120px",
            height: "auto",
            marginBottom: "1rem",
          }}
        />
        <h2 style={{ margin: 0, fontSize: "1.2rem", textAlign: "center" }}>
          {productDetails.name}
        </h2>
        <p style={{ margin: "0.5rem 0", fontSize: "0.9rem", textAlign: "center" }}>
          {productDetails.tagline}
        </p>
        <p style={{ margin: "0.5rem 0", fontSize: "1rem", fontWeight: "bold" }}>
          Price - {productDetails.price}
        </p>
        <button
          style={{
            padding: "0.5rem 1rem",
            background: "transparent",
            border: "1px solid #fff",
            borderRadius: "5px",
            color: "#fff",
            fontSize: "0.9rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-bag"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a2 2 0 0 1 2 2v1h3.5A1.5 1.5 0 0 1 15 5.5v9A1.5 1.5 0 0 1 13.5 16h-11A1.5 1.5 0 0 1 1 14.5v-9A1.5 1.5 0 0 1 2.5 3H6V2a2 2 0 0 1 2-2zm2 3V3a2 2 0 1 0-4 0v1h4z" />
          </svg>
          Add to Bag
        </button>
      </Html>

      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
      <OrbitControls />
    </group>
  );
};

export default Scene;
