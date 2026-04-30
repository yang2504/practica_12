import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

// Componente para un solo auto
function Auto({ posicionInicial, velocidad, juegoIniciado }) {
  const autoRef = useRef();

  useFrame((state, delta) => {
    if (!juegoIniciado || !autoRef.current) return;

    const pos = autoRef.current.translation();
    let nuevaX = pos.x + velocidad * delta; // Se mueve según su velocidad

    // Efecto Pac-Man: Si sale del mapa por la derecha, aparece por la izquierda (y viceversa)
    if (velocidad > 0 && nuevaX > 10) nuevaX = -10;
    if (velocidad < 0 && nuevaX < -10) nuevaX = 10;

    autoRef.current.setNextKinematicTranslation({ x: nuevaX, y: pos.y, z: pos.z });
  });

  return (
    <RigidBody 
      ref={autoRef} 
      type="kinematicPosition" 
      position={posicionInicial} 
      name="obstaculo"
      canSleep={false} // <--- ¡Añadimos esto al auto también!
    >
      <mesh castShadow>
        <boxGeometry args={[2.5, 1, 1.2]} />
        <meshStandardMaterial color="#ff4757" />
      </mesh>
    </RigidBody>
  );
}

// Exportamos un grupo de autos con diferentes posiciones y velocidades
export default function Obstaculos({ juegoIniciado }) {
  return (
    <>
      <Auto posicionInicial={[-10, 0.5, 3]} velocidad={6} juegoIniciado={juegoIniciado} />
      <Auto posicionInicial={[10, 0.5, -1]} velocidad={-8} juegoIniciado={juegoIniciado} />
      <Auto posicionInicial={[-8, 0.5, -5]} velocidad={5} juegoIniciado={juegoIniciado} />
      <Auto posicionInicial={[8, 0.5, -9]} velocidad={-7} juegoIniciado={juegoIniciado} />
    </>
  );
}