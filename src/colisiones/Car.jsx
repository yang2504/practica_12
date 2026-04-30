import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

export default function Car({ carPositionRef }) {
  const carRef = useRef();
  const { camera, raycaster, pointer } = useThree();
  const [isPointerDown, setIsPointerDown] = useState(false);

  
  const targetPos = useRef(new THREE.Vector3(0, 0.5, 0));

  
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);


  const handlePointerDown = useCallback(() => setIsPointerDown(true), []);
  const handlePointerUp = useCallback(() => setIsPointerDown(false), []);
  const handlePointerMove = useCallback(
    (event) => {
      if (!isPointerDown) return;

      raycaster.setFromCamera(pointer, camera);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, intersection);

      if (intersection) {
        
        const limit = 4;
        intersection.x = THREE.MathUtils.clamp(intersection.x, -limit, limit);
        intersection.z = THREE.MathUtils.clamp(intersection.z, -limit, limit);
        targetPos.current.set(intersection.x, 0.5, intersection.z);
      }
    },
    [isPointerDown, camera, raycaster, pointer]
  );

  
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointermove', handlePointerMove);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointermove', handlePointerMove);
    };
  }, [handlePointerDown, handlePointerUp, handlePointerMove]);

  
  useFrame((_, delta) => {
    if (carRef.current && isPointerDown) {
      
      carRef.current.position.lerp(targetPos.current, Math.min(1, delta * 8));
    }

    
    if (carPositionRef && carRef.current) {
      carPositionRef.current = carRef.current.position.clone();
    }
  });

  return (
    <group ref={carRef} position={[0, 0.5, 0]}>
      
      <Box args={[1, 0.4, 1.5]}>
        <meshStandardMaterial color="red" />
      </Box>
      
      <Box args={[0.2, 0.1, 0.3]} position={[-0.45, -0.25, 0.6]} />
      <Box args={[0.2, 0.1, 0.3]} position={[0.45, -0.25, 0.6]} />
      <Box args={[0.2, 0.1, 0.3]} position={[-0.45, -0.25, -0.6]} />
      <Box args={[0.2, 0.1, 0.3]} position={[0.45, -0.25, -0.6]} />
    </group>
  );
}