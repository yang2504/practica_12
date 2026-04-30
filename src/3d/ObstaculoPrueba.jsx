import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

export default function ObstaculoPrueba({ juegoIniciado, juegoTerminado }) {
  // Referencia para controlar el objeto físico frame a frame
  const obstaculoRef = useRef();

  // useFrame se ejecuta unas 60 veces por segundo (es el bucle del juego)
  useFrame((state) => {
    // Si el juego no ha empezado o ya terminó, no hacemos nada
    if (!juegoIniciado || juegoTerminado) return;
    if (!obstaculoRef.current) return;

    // Calculamos un movimiento oscilante (de izquierda a derecha) usando el tiempo
    const tiempo = state.clock.getElapsedTime();
    const posicionX = Math.sin(tiempo * 2) * 5; // Se moverá entre -5 y +5 en el eje X

    // Movemos el objeto físicamente
    obstaculoRef.current.setNextKinematicTranslation({
      x: posicionX,
      y: 0.5,
      z: -5 // Posición fija en el eje Z (frente al jugador)
    });
  });

  return (
    // 'kinematicPosition' significa que nosotros lo movemos por código, no la gravedad
    <RigidBody ref={obstaculoRef} type="kinematicPosition" position={[0, 0.5, -5]}>
      <mesh castShadow>
        <boxGeometry args={[2, 1, 1]} /> {/* Forma de caja rectangular */}
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  );
}