import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

// --- COMPONENTE: Modelo del Carrito (Jugador) ---
const CarroModelo = ({ onPointerDown }) => (
  // Escala reducida a 0.35 para que entre en la pista
  // Rotado para que el frente del auto mire hacia adelante (Eje Z)
  <group scale={0.35} position={[0, -0.2, 0]} rotation={[0, Math.PI / 2, 0]} onPointerDown={onPointerDown}>
    <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[4, 1, 2]} /><meshStandardMaterial color="crimson" /></mesh>
    <mesh position={[-0.5, 0.75, 0]} castShadow><boxGeometry args={[2, 0.8, 1.8]} /><meshStandardMaterial color="darkred" /></mesh>
    <mesh position={[1.2, -0.5, 1.1]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 0.3, 32]} /><meshStandardMaterial color="#333" /></mesh>
    <mesh position={[1.2, -0.5, -1.1]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 0.3, 32]} /><meshStandardMaterial color="#333" /></mesh>
    <mesh position={[-1.2, -0.5, 1.1]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 0.3, 32]} /><meshStandardMaterial color="#333" /></mesh>
    <mesh position={[-1.2, -0.5, -1.1]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 0.3, 32]} /><meshStandardMaterial color="#333" /></mesh>
  </group>
);

// --- COMPONENTE: Modelo de la Persona (Obstáculos) ---
const PersonaModelo = () => {
  const skinColor = "#f1c27d";
  const shirtColor = "#4287f5";
  const pantsColor = "#333333";
  const shoesColor = "#1a1a1a";

  return (
    // Escala 0.5 y rotados para que caminen de frente
    <group scale={0.5} position={[0, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 1.6, 0]} castShadow><sphereGeometry args={[0.4, 32, 32]} /><meshStandardMaterial color={skinColor} /></mesh>
      <mesh position={[0, 1.1, 0]} castShadow><cylinderGeometry args={[0.15, 0.15, 0.3, 16]} /><meshStandardMaterial color={skinColor} /></mesh>
      <mesh position={[0, 0.1, 0]} castShadow><boxGeometry args={[1.2, 1.8, 0.6]} /><meshStandardMaterial color={shirtColor} /></mesh>
      <group position={[-0.8, 0.8, 0]}>
        <mesh position={[0, -0.6, 0]} castShadow><cylinderGeometry args={[0.18, 0.15, 1.4, 16]} /><meshStandardMaterial color={skinColor} /></mesh>
        <mesh position={[0, 0, 0]} castShadow><cylinderGeometry args={[0.22, 0.2, 0.5, 16]} /><meshStandardMaterial color={shirtColor} /></mesh>
      </group>
      <group position={[0.8, 0.8, 0]}>
        <mesh position={[0, -0.6, 0]} castShadow><cylinderGeometry args={[0.18, 0.15, 1.4, 16]} /><meshStandardMaterial color={skinColor} /></mesh>
        <mesh position={[0, 0, 0]} castShadow><cylinderGeometry args={[0.22, 0.2, 0.5, 16]} /><meshStandardMaterial color={shirtColor} /></mesh>
      </group>
      <mesh position={[-0.3, -1.3, 0]} castShadow><cylinderGeometry args={[0.25, 0.2, 1.2, 16]} /><meshStandardMaterial color={pantsColor} /></mesh>
      <mesh position={[-0.3, -2.0, 0.1]} castShadow><boxGeometry args={[0.3, 0.2, 0.6]} /><meshStandardMaterial color={shoesColor} /></mesh>
      <mesh position={[0.3, -1.3, 0]} castShadow><cylinderGeometry args={[0.25, 0.2, 1.2, 16]} /><meshStandardMaterial color={pantsColor} /></mesh>
      <mesh position={[0.3, -2.0, 0.1]} castShadow><boxGeometry args={[0.3, 0.2, 0.6]} /><meshStandardMaterial color={shoesColor} /></mesh>
    </group>
  );
};

// --- MOTOR DEL JUEGO PRINCIPAL ---
function MundoJuego({ juegoIniciado, juegoTerminado, manejarChoque, llegarMeta }) {
  const carritoRef = useRef();
  const persona1Ref = useRef();
  const persona2Ref = useRef();
  const persona3Ref = useRef();

  const isDragging = useRef(false);
  const cursorPoint = useRef(new THREE.Vector3());

  const agarrarCarrito = (e) => {
    if (!juegoIniciado || juegoTerminado) return;
    e.stopPropagation();
    isDragging.current = true;
  };

  const moverCarrito = (e) => {
    if (isDragging.current) cursorPoint.current.copy(e.point);
  };

  const soltarCarrito = () => {
    isDragging.current = false;
    if (carritoRef.current) carritoRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
  };

  useFrame((state) => {
    if (!juegoIniciado || juegoTerminado) return;

    // Movimiento infinito de las personas (obstáculos)
    const tiempo = state.clock.getElapsedTime();
    if (persona1Ref.current) persona1Ref.current.setTranslation({ x: Math.sin(tiempo * 1.5) * 10, y: 0.5, z: 0 }, true);
    if (persona2Ref.current) persona2Ref.current.setTranslation({ x: Math.cos(tiempo * 2.0) * 10, y: 0.5, z: -4 }, true);
    if (persona3Ref.current) persona3Ref.current.setTranslation({ x: Math.sin(tiempo * 1.8 + Math.PI) * 10, y: 0.5, z: -8 }, true);

    if (carritoRef.current) {
      const pos = carritoRef.current.translation();

      // Físicas de arrastre
      if (isDragging.current) {
        const dx = cursorPoint.current.x - pos.x;
        const dz = cursorPoint.current.z - pos.z;
        carritoRef.current.setLinvel({ x: dx * 12, y: 0, z: dz * 12 }, true);
      }

      if (pos.z < -11) llegarMeta();
    }
  });

  return (
    <group>
      {/* EL SUELO */}
      <RigidBody type="fixed">
        <mesh 
          position={[0, -0.5, -3]} 
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={moverCarrito}
          onPointerUp={soltarCarrito}
          onPointerOut={soltarCarrito}
        >
          <planeGeometry args={[25, 30]} />
          <meshStandardMaterial color="#1e272e" />
        </mesh>
      </RigidBody>

      {/* LÍNEA DE META */}
      <mesh position={[0, -0.4, -12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 2]} />
        <meshStandardMaterial color="#f1c40f" />
      </mesh>

      {/* EL CARRITO JUGADOR */}
      <RigidBody
        ref={carritoRef}
        position={[0, 0.5, 6]}
        restitution={1.2} // Rebote elástico
        onCollisionEnter={(e) => {
          if (juegoIniciado && !juegoTerminado && e.other.rigidBodyObject?.name === "obstaculo") {
            manejarChoque();
            soltarCarrito(); // Suelta el carro al chocar
          }
        }}
      >
        {/* Llamamos al modelo del auto y le pasamos el evento del mouse */}
        <CarroModelo onPointerDown={agarrarCarrito} />
      </RigidBody>

      {/* LAS PERSONAS (OBSTÁCULOS) */}
      <RigidBody ref={persona1Ref} type="kinematicPosition" name="obstaculo">
        <PersonaModelo />
      </RigidBody>
      
      <RigidBody ref={persona2Ref} type="kinematicPosition" name="obstaculo">
        <PersonaModelo />
      </RigidBody>

      <RigidBody ref={persona3Ref} type="kinematicPosition" name="obstaculo">
        <PersonaModelo />
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