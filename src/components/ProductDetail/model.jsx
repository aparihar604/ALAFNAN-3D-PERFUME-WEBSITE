// Model.jsx
import { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model = ({ modelPath }) => {
    const modelRef = useRef(null);

    const gltf = useLoader(GLTFLoader, modelPath);

    useFrame((state, delta) => {
        if (modelRef.current) {
            modelRef.current.rotation.y -= delta * 0.05;
            modelRef.current.rotation.x = Math.PI / 12;
        }
    });

    return (
        <group ref={modelRef}>
            <primitive object={gltf.scene} />
        </group>
    );
};

export default Model;