import { useRef, useEffect, useState, useContext } from 'react';
import FloatingModel from '../components/FloatingModel/FloatingModel';
import { Environment, OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import { StoreContext } from "../context/storeContext";
import { useParams } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Scene = () => {
  const model1Ref = useRef(null);
  const groupRef = useRef(null);
  const [modelPath, setModelPath] = useState('');
  const FLOAT_SPEED = 1.5;
  const { url } = useContext(StoreContext);
  const { id } = useParams(); // Fetch the product ID from the URL

  useEffect(() => {
    const fetchModelPath = async () => {
      try {
        const response = await axios.get(`${url}/product/show/${id}`);
        console.log("Model path:", response.data.data.imageModel); // Log model path
        setModelPath(response.data.data.imageModel);
      } catch (error) {
        console.error('Error fetching model path:', error);
      }
    };

    fetchModelPath();
  }, [id, url]);

  useEffect(() => {
    if (!model1Ref.current || !modelPath) return;

    const isMobile = window.innerWidth <= 1026;
    const initialPosition = isMobile ? { x: 0, y: -0.3 } : { x: 1.2, y: 0.2 };

    gsap.set(model1Ref.current.position, initialPosition);

    const introTl = gsap.timeline({
      defaults: {
        duration: 3,
        ease: 'back.out(1.4)',
      },
    });

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
        trigger: '.product-detail-container',
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

    gsap.to(model1Ref.current.rotation, {
      y: Math.PI * 2,
      duration: 3,
      repeat: -1,
      ease: 'none',
    });
  }, [modelPath]);

  return (
    <group ref={groupRef}>
      {modelPath && (
        <FloatingModel ref={model1Ref} modelPath={`/${modelPath}`} floatspeed={FLOAT_SPEED} />
      )}
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
      <OrbitControls />
    </group>
  );
};

export default Scene;