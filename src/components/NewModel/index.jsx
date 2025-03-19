import { Float } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { Suspense, forwardRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Model = forwardRef(
  (
    {
      modelPath,
      ...props
    },
    ref // ref needs to be handled as the second argument of forwardRef
  ) => {
        const { scene } = useLoader(GLTFLoader, modelPath);
  return (
        <group
         ref={ref}
         {...props}
          
          // onPointerOver={() => handleHover(true)} // Trigger hover animation
          // onPointerOut={() => handleHover(false)} // Reset hover animation
        >
          <Float
            speed={1.7} // Animation speed, defaults to 1
            rotationIntensity={1} // XYZ rotation intensity, defaults to 1
            floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange, defaults to 1
            floatingRange={[-0.01, 0.01]}
          >
            <Suspense fallback={<div>test loadiung</div>}>
              <primitive object={scene} />
            </Suspense>
          </Float>
        </group>
  );
});

export default Model;
