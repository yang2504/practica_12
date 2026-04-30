import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

// Componente interno que maneja toda la lógica física
function MundoJuego({ juegoIniciado, juegoTerminado, manejarChoque, llegarMeta }) {
  const ranaRef = useRef();
  const auto1Ref = useRef();
  const auto2Ref = useRef();
  const auto3Ref = useRef();

  // Bucle del juego (Se ejecuta 60 veces por segundo)
  useFrame((state) => {
    if (!juegoIniciado || juegoTerminado) return;

    // 1. Mover los autos usando el reloj interno (Nunca falla)
    const tiempo = state.clock.getElapsedTime();
    
    // setTranslation mueve el objeto a una coordenada exacta [X, Y, Z]
    if (auto1Ref.current) auto1Ref.current.setTranslation({ x: Math.sin(tiempo * 1.5) * 10, y: 0.5, z: 0 }, true);
    if (auto2Ref.current) auto2Ref.current.setTranslation({ x: Math.cos(tiempo * 2.0) * 10, y: 0.5, z: -4 }, true);
    if (auto3Ref.current) auto3Ref.current.setTranslation({ x: Math.sin(tiempo * 1.8 + Math.PI) * 10, y: 0.5, z: -8 }, true);

    // 2. Comprobar si la Rana llegó a la meta
    if (ranaRef.current) {
      const pos = ranaRef.current.translation();
      if (pos.z < -11) llegarMeta();
    }
  });

  // Función para dar el salto exacto hacia donde se hace click
  const saltar = (e) => {
    if (!juegoIniciado || juegoTerminado || !ranaRef.current) return;
    
    const destino = e.point;
    const pos = ranaRef.current.translation();
    
    // Calculamos el vector de dirección
    const direccion = new THREE.Vector3(destino.x - pos.x, 0, destino.z - pos.z).normalize();
    
    // Aplicamos fuerza (10 de velocidad)
    ranaRef.current.applyImpulse({ x: direccion.x * 10, y: 0, z: direccion.z * 10 }, true);
  };

  return (
    <group>
      {/* SUELO (Detecta los clicks con onPointerDown) */}
      <RigidBody type="fixed">
        <mesh position={[0, -0.5, -3]} rotation={[-Math.PI / 2, 0, 0]} onPointerDown={saltar}>
          <planeGeometry args={[25, 30]} />
          <meshStandardMaterial color="#1e272e" />
        </mesh>
      </RigidBody>

      {/* LÍNEA DE META */}
      <mesh position={[0, -0.4, -12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 2]} />
        <meshStandardMaterial color="#f1c40f" />
      </mesh>

      {/* LA RANA */}
      <RigidBody
        ref={ranaRef}
        position={[0, 0.5, 6]}
        restitution={1.2} // Rebote al chocar
        onCollisionEnter={(e) => {
          if (juegoIniciado && !juegoTerminado && e.other.rigidBodyObject?.name === "auto") {
            manejarChoque();
          }
        }}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#2ed573" />
        </mesh>
      </RigidBody>

      {/* LOS AUTOS */}
      <RigidBody ref={auto1Ref} type="kinematicPosition" name="auto">
        <mesh castShadow><boxGeometry args={[2.5, 1, 1.2]} /><meshStandardMaterial color="#ff4757" /></mesh>
      </RigidBody>
      
      <RigidBody ref={auto2Ref} type="kinematicPosition" name="auto">
        <mesh castShadow><boxGeometry args={[2.5, 1, 1.2]} /><meshStandardMaterial color="#ff4757" /></mesh>
      </RigidBody>

      <RigidBody ref={auto3Ref} type="kinematicPosition" name="auto">
        <mesh castShadow><boxGeometry args={[2.5, 1, 1.2]} /><meshStandardMaterial color="#ff4757" /></mesh>
      </RigidBody>
    </group>
  );
}

// Escena Principal
export default function Escena({ juegoIniciado, juegoTerminado, manejarChoque, llegarMeta }) {
  return (
    <Canvas camera={{ position: [0, 18, 14], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
      
      {/* Contenedor de físicas */}
      <Physics>
        <MundoJuego 
          juegoIniciado={juegoIniciado} 
          juegoTerminado={juegoTerminado} 
          manejarChoque={manejarChoque}
          llegarMeta={llegarMeta}
        />
      </Physics>
    </Canvas>
  );
}