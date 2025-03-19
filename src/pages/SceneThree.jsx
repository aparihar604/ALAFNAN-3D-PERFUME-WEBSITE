import React, { useRef, useState, useEffect } from 'react';
import FloatingModel from '../components/FloatingModel/FloatingModel';
import { Environment, OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Scene = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const model1Ref = useRef(null);
  const model2Ref = useRef(null);
  const model3Ref = useRef(null);
  const model4Ref = useRef(null);
  const model5Ref = useRef(null);
  const groupRef = useRef(null);
  const FLOAT_SPEED = 1.5;
  const modelPaths = [
    '/caribbean_green_perfume_bottle1.glb',
    '/purple_perfume_bottle1.glb',
    '/white_perfume_bottle1.glb',
    '/brown_perfume_bottle1.glb',
    '/black_perfume_bottle1.glb',
  ];

  //Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1026); // Adjust the width as needed for tablet/mobile
    };

    handleResize(); // Call on component mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!model1Ref.current || !model2Ref.current) return;

    // Set initial positions based on screen size
    if (isMobileOrTablet) {
      // Adjusted positions for mobile/tablet view
      gsap.set(model1Ref.current.position, { x: -4, y: 0.2, z: 0 });
      gsap.set(model2Ref.current.position, { x: 4, y: 0.2, z: 0 });
    } else {
      // Positions for desktop view (original positions)
      gsap.set(model1Ref.current.position, { x: -4, y: 0.2 });
      gsap.set(model2Ref.current.position, { y: 5, z: 2 });
      gsap.set(model3Ref.current.position, { x: 2, y: 0.35, z: 2 });
      gsap.set(model4Ref.current.position, { x: 3, y: -1 });
      gsap.set(model5Ref.current.position, { y: -5 });
    }

    // Scroll-triggered animation (for both views)
    const scrollTl = gsap.timeline({
      defaults: { duration: 2 },
      scrollTrigger: {
        trigger: ".heroTwo-container",
        pin: !isMobileOrTablet, // Disable pinning on mobile and tablet
        start: "top top",
        end: "+=500",
        scrub: 2,
        immediateRender: false,
        ease: "power1.inOut",
      },
    });

    if (isMobileOrTablet) {
      // Animation for mobile/tablet view
      scrollTl
        .to(model1Ref.current.position, { x: -0.2, y: -0.2, z: 0.8 }, 0)
        .to(model2Ref.current.position, { x: 0.2, y: -0.2, z: 0.5 }, 0)


    } else {
      // Animation for desktop view (all 5 models)
      scrollTl
        .to(model1Ref.current.position, { x: -1.7, y: 0, z: 0.8 }, 0)
        .to(model1Ref.current.rotation, { y:0.6 }, 0)
        .to(model2Ref.current.position, { x: -1.3, y: -0.2, z: 0.8 }, 0)
        .to(model2Ref.current.rotation, { duration:1}, 0)
        .to(model3Ref.current.position, { x: -0.9, y: -0.4, z: 0.8 }, 0)
        .to(model3Ref.current.rotation, { duration:1 }, 0)
        .to(model4Ref.current.position, { x: -0.5, y: -0.2, z: 0.8 }, 0)
        .to(model4Ref.current.rotation, { duration:1 }, 0)
        .to(model5Ref.current.position, { x: 0, y: 0, z: 0.8 }, 0)
        .to(model5Ref.current.rotation, { duration:1 }, 0);
    }
  }, [isMobileOrTablet]);

  return (
    <group ref={groupRef}>
      {/* Conditionally render models based on screen size */}
      <FloatingModel ref={model1Ref} modelPath={modelPaths[0]} floatspeed={FLOAT_SPEED} />
      <FloatingModel ref={model2Ref} modelPath={modelPaths[1]} floatspeed={FLOAT_SPEED} />
      {/* Render additional models only on desktop */}
      {!isMobileOrTablet && (
        <>
          <FloatingModel ref={model3Ref} modelPath={modelPaths[2]} floatspeed={FLOAT_SPEED} />
          <FloatingModel ref={model4Ref} modelPath={modelPaths[3]} floatspeed={FLOAT_SPEED} />
          <FloatingModel ref={model5Ref} modelPath={modelPaths[4]} floatspeed={FLOAT_SPEED} />
        </>
      )}
      <Environment files='/hdr/lobby.hdr' environmentIntensity={1.5} />
      <OrbitControls />
    </group>
  );
};

export default Scene;