import { useRef, useEffect } from 'react';
import FloatingModel from '../FloatingModel/FloatingModel'; // Assuming you have this component
import { Environment, OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Scene = ({ modelPath, FLOAT_SPEED = 1.5 }) => {
    const model1Ref = useRef(null);
    const groupRef = useRef(null);

    useEffect(() => {
        if (!model1Ref.current) return;

        const isMobile = window.innerWidth <= 1026; // Mobile detection for different model positions
        const initialPosition = isMobile ? { x: 0, y: -0.3 } : { x: 1.2, y: 0.2 };

        gsap.set(model1Ref.current.position, initialPosition);

        const introTl = gsap.timeline({
            defaults: {
                duration: 3,
                ease: 'back.out(1.4)',
            },
        });

        // Trigger model animation when scroll starts
        if (window.scrollY < 20) {
            introTl
                .from(model1Ref.current.position, { y: 5.3, x: initialPosition.x }, 0)
                .from(model1Ref.current.rotation, { z: 3 }, 0);
        }

        const scrollTl = gsap.timeline({
            defaults: {
                duration: 2,
            },
            scrollTrigger: {
                trigger: '.hero-container', // You can change the trigger class based on your layout
                pin: true,
                start: 'top top',
                end: '+=500',
                scrub: 2,
                immediateRender: false,
                ease: 'power1.inOut',
            },
        });

        scrollTl
            .to(model1Ref.current.position, { x: isMobile ? 0 : -3, y: -0.2, z: 6 }, 0)
            .to(model1Ref.current.rotation, { z: 0.8 }, 0);

        // Continuous spinning animation
        gsap.to(model1Ref.current.rotation, {
            y: Math.PI * 2,
            duration: 3, // Adjust the duration for slower or faster spinning
            repeat: -1, // Infinite loop
            ease: 'none', // Keep the spin constant
        });
    }, [modelPath]);

    return (
        <group ref={groupRef}>
            {/* FloatingModel component should load the 3D model from the passed modelPath */}
            <FloatingModel ref={model1Ref} modelPath={modelPath} floatspeed={FLOAT_SPEED} />
            <Environment files='/hdr/lobby.hdr' environmentIntensity={1.5} />
            <OrbitControls />
        </group>
    );
};

export default Scene;
