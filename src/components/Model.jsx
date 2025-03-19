import { useGLTF } from '@react-three/drei';
import { Suspense, useMemo } from 'react';

export function Model({ modelPath, ...props }) {
  // Memoize the GLTF load to prevent unnecessary reloads
  const { nodes, materials } = useMemo(() => useGLTF(modelPath), [modelPath]);

  return (
    <Suspense fallback={null}> {/* Optional: Add a loader here */}
      <group {...props} dispose={null} scale={[0.5, 0.5, 0.5]}>
        {nodes && materials && (
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh1_Mesh1026?.geometry} // Adjust based on actual model structure
            material={materials['Material.001']} // Adjust based on actual model structure
            rotation={[Math.PI / 2, 0, 0]}
          />
        )}
      </group>
    </Suspense>
  );
}

// Remember to preload models if necessary
const modelPaths = [
  '/blue_perfume_bottle1.glb',
  '/brown_perfume_bottle1.glb',
  '/caribbean_green_perfume_bottle1.glb',
  '/cyan_perfume_bottle1.glb',
  '/mexican_pink_perfume_bottle1.glb',
  '/purple_perfume_bottle1.glb',
  '/red_perfume_bottle1.glb',
  '/rose_red_perfume_bottle1.glb',
  '/white_perfume_bottle1.glb'
];
modelPaths.forEach(modelPath => useGLTF.preload(modelPath));