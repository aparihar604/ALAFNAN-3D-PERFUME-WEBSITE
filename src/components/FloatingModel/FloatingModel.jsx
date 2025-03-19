import { forwardRef } from 'react';
import { Float } from '@react-three/drei';
import { Model } from '../Model';

const FloatingModel = forwardRef(
  (
    {
      modelPath,
      floatsSpeed = 1.7,
      rotationIntensity = 1,
      floatIntensity = 1,
      floatingRange = [-0.01, 0.01],
      children,
      ...props
    },
    ref // ref needs to be handled as the second argument of forwardRef
  ) => {
    return (
      <group ref={ref} {...props}>
        <Float
          speed={floatsSpeed} // Animation speed, defaults to 1
          rotationIntensity={rotationIntensity} // XYZ rotation intensity, defaults to 1
          floatIntensity={floatIntensity} // Up/down float intensity, works like a multiplier with floatingRange, defaults to 1
          floatingRange={floatingRange}
        >
          {children}
          <Model modelPath={modelPath} />
        </Float>
      </group>
    );
  }
);

FloatingModel.displayName = 'FloatingModel';

export default FloatingModel;