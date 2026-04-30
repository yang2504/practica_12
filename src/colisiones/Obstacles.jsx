import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../context/GameContext';

const OBSTACLE_COUNT = 5;
const REPOSITION_INTERVAL = 2; 
const COLLISION_THRESHOLD = 1.2; 
const COOLDOWN_TIME = 1.0; 

export default function Obstacles({ carPositionRef }) {
  const obstacles = useRef([]);
  const cooldowns = useRef(new Array(OBSTACLE_COUNT).fill(0));
  const { incrementCollision } = useGame();

  
  const initialPositions = useMemo(() => {
    return Array.from({ length: OBSTACLE_COUNT }, () => randomPosition());
  }, []);

  
  const positions = useRef(initialPositions);

  
  useEffect(() => {
    const interval = setInterval(() => {
      const carPos = carPositionRef.current;
      const newPositions = [];
      for (let i = 0; i < OBSTACLE_COUNT; i++) {
        let pos;
       
        do {
          pos = randomPosition();
        } while (carPos && pos.distanceTo(carPos) < 2.5); 
        newPositions.push(pos);
      }
      positions.current = newPositions;
    }, REPOSITION_INTERVAL * 1000);

    return () => clearInterval(interval);
  }, [carPositionRef]);

  useFrame((_, delta) => {
    const carPos = carPositionRef.current;
    if (!carPos) return;

    for (let i = 0; i < OBSTACLE_COUNT; i++) {
      const obsPos = positions.current[i];
      const distance = carPos.distanceTo(obsPos);

      cooldowns.current[i] = Math.max(0, cooldowns.current[i] - delta);

      if (distance < COLLISION_THRESHOLD && cooldowns.current[i] <= 0) {
        incrementCollision();
        cooldowns.current[i] = COOLDOWN_TIME; 
      }
    }
  });

  return (
    <>
      {positions.current.map((pos, i) => (
        <Box key={i} args={[0.8, 0.8, 0.8]} position={pos}>
          <meshStandardMaterial color="blue" />
        </Box>
      ))}
    </>
  );
}


function randomPosition() {
  const limit = 4;
  return new THREE.Vector3(
    (Math.random() * 2 - 1) * limit,
    0.5,
    (Math.random() * 2 - 1) * limit
  );
}