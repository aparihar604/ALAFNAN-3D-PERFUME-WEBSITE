import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import { Environment } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Model from "../../components/NewModel";
import { Canvas } from "@react-three/fiber";

// Register the GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Scene = forwardRef(({ modelPath = "/blue_perfume_bottle1.glb" }, ref) => {
  const modelRef = useRef(null);
  const FLOAT_SPEED = 5;
    //Expose a method to trigger the sinking animation from the parent
  useImperativeHandle(ref, () => ({
    startSinking: () => {
      handleButtonClick();
    },
  }));


  useEffect(() => {
    if (!modelRef.current) return;
    // Initial position for the model
    const initialPosition = { x: 0, y: 0, z: 0 };
    gsap.set(modelRef.current.position, initialPosition);
    const container = document.querySelector(".Model-container");
    console.log(container,'container'); // Should log the element
    if (!container) return;    // Scroll-based animations
    const scrollTl = gsap.timeline({
      defaults: {
        duration: 0, // No duration for immediate scroll sync
      },
      scrollTrigger: {
        trigger: ".Model-container", // The container for scroll interaction
        start: `top top`, // Start at 50% of the viewport height
        end: `bottom top`, //ps 100px from the bottom of the viewport
        scrub: true, // Smooth scrolling effect
        pin: true, // Pin the model during the scroll
        pinSpacing: true,
        immediateRender: true,
        ease: "power1.inOut",
      },
    });

    scrollTl.to(modelRef.current.position,
      { y: -0.8, duration: 30, ease: "power1.inOut" },
      0
    );

    // Infinite rotation
    gsap.to(modelRef.current.rotation, {
      y: Math.PI * 2,
      duration: 2.5,
      repeat: -1,
      ease: "linear",
    });
    ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "+=200",
      onEnter: () => {
        gsap.to(modelRef.current.position, {
          y: modelRef.current.position.y,
          ease: "power1.inOut",
        });
      },
      onLeave: () => {
        gsap.to(modelRef.current.position, { y: -0.8, ease: "power1.inOut" });
      },
      scrub: true,
    });

    return () => {
      scrollTl?.kill(); // Kills only this animation's ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Clean up all ScrollTriggers
    };
  }, [modelPath]);
  const handleButtonClick = () => {
    if (modelRef.current) {
      const targetPosition = { y: -4.8, x: 0, z:0, }; // Target sinking position
      const originalPosition = { y: 0, x: 0, z:0 }; // Original position
      const originalScale = { x: 1.5, y: 1.5, z: 1.5 }; // Original scale

      // Move the model into the button and scale it down
      gsap.to(modelRef.current.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 3,
        ease: "power2.out",
        onComplete: () => {
          const initialPosition = { x: 0, y: 0, z: 0 };
          gsap.set(modelRef.current.position, initialPosition);
          // Return model to its original position and scale after animation completes
          // gsap.to(modelRef.current.position, {
          //   x: originalPosition.x,
          //   y: originalPosition.y,
          //   z: originalPosition.z,
          //   duration: 1,
          //   ease: "power2.inOut",
          // });

          gsap.to(modelRef.current.scale, {
            x: originalScale.x,
            y: originalScale.y,
            z: originalScale.z,
            duration: 1,
            ease: "power2.inOut",
          });

          // // Restore opacity
          // gsap.to(modelRef.current, {
          //   opacity: 1,
          //   duration: 0.5,
          // });
        },
      });

      gsap.to(modelRef.current.scale, {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: 1.5,
        ease: "power2.out",
      });

      // Fade out the model (disappear effect)
      gsap.to(modelRef.current, {
        opacity: 0,
        duration: 1,
        delay: 0.5,
      });
    }
  };

  return (
      <Canvas>
        <Model
          ref={modelRef}
          modelPath={modelPath}
          floatspeed={FLOAT_SPEED}
          scale={[1.5, 1.5, 1.5]} // Adjust the size for your requirements
        />
        <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
      </Canvas>
  );
});

export default Scene;
