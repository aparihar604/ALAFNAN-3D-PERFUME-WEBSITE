// Scene.js

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Text, OrbitControls, Environment, Cloud } from '@react-three/drei';
import gsap from 'gsap';

const Scene = () => {
  const modelRefs = Array.from({ length: 6 }, () => useRef(null));
  const textRefs = Array.from({ length: 6 }, () => useRef(null));
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Model and Text Paths
  const modelPaths = [
    '/models/black_perfume_bottle1.glb',
    '/models/red_perfume_bottle1.glb',
    '/models/caribbean_green_perfume_bottle1.glb',
    '/models/purple_perfume_bottle1.glb',
    '/models/brown_perfume_bottle1.glb',
    '/models/mexican_pink_perfume_bottle1.glb'
  ];

  const modelTexts = [
    "TEA ROSE", "AFSHA",
    "FIDAI", "ETERNITY",
    "ARABIAN OUDH", "DUBAI NIGHT"
  ];

  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco_decoder/');  // Path to DRACO decoder files
  loader.setDRACOLoader(dracoLoader);

  const loadModel = (path, index) => {
    loader.load(
      path,
      (gltf) => {
        modelRefs[index].current = gltf.scene;
        setLoadingProgress((prev) => prev + 16.67); // Update progress
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          setLoadingProgress((xhr.loaded / xhr.total) * 100); // Calculate loading percentage
        }
      },
      (error) => {
        console.error(`Model loading failed: ${error}`);
      }
    );
  };

  useEffect(() => {
    modelPaths.forEach((path, index) => loadModel(path, index));

    // Set loaded state after all models are loaded
    if (modelRefs.every((ref) => ref.current)) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <group>
      {/* Loading State */}
      {!isLoaded && (
        <Text font="/fonts/Poppins-Bold.ttf" fontSize={0.5} color="white">
          Loading... {Math.round(loadingProgress)}%
        </Text>
      )}

      {/* Suspense for lazy loading */}
      <Suspense fallback={<Text font="/fonts/Poppins-Bold.ttf" fontSize={0.5} color="white">Loading...</Text>}>
        {modelRefs.map((modelRef, index) => (
          modelRef.current && (
            <primitive key={index} object={modelRef.current} scale={[1, 1, 1]} position={[0, 0, 0]} />
          )
        ))}
      </Suspense>

      {/* Text Overlays */}
      {modelTexts.map((text, index) => (
        <Text
          key={index}
          ref={textRefs[index]}
          font="/fonts/Poppins-Bold.ttf"
          position={[1, 0, 0]}
          fontSize={0.2}
          fontWeight={700}
          color="ffffff"
          anchorX="center"
          anchorY="middle"
          opacity={0}
          outlineColor="black"
        >
          {text}
        </Text>
      ))}

      {/* HDR Environment */}
      <Environment files="/hdr/lobby.hdr" background={true} />
      <Cloud position={[0, 0, -20]} scale={[1, 2, 1]} opacity={0.3} speed={0.2} />
      <OrbitControls />
    </group>
  );
};

export default Scene;
