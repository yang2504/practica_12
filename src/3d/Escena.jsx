import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

function MundoJuego({ juegoIniciado, juegoTerminado, manejarChoque, llegarMeta }) {
  const ranaRef = useRef();
  const auto1Ref = useRef();
  const auto2Ref = useRef();
  const auto3Ref = useRef();

  // --- VARIABLES PARA EL ARRASTRE ---
  const isDragging = useRef(false);
  const cursorPoint = useRef(new THREE.Vector3());

  // 1. Al hacer click SOBRE la bolita
  const agarrarBolita = (e) => {
    if (!juegoIniciado || juegoTerminado) return;
    e.stopPropagation(); // Evita que el evento se confunda con el suelo
    isDragging.current = true;
  };

  // 2. Al mover el mouse SOBRE el suelo
  const moverBolita = (e) => {
    if (isDragging.current) {
      cursorPoint.current.copy(e.point); // Guardamos la coordenada del mouse
    }
  };

  // 3. Al soltar el click o salirnos del mapa
  const soltarBolita = () => {
    isDragging.current = false;
    if (ranaRef.current) {
      // Le quitamos toda la velocidad para que frene en seco
      ranaRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  };

  useFrame((state) => {
    if (!juegoIniciado || juegoTerminado) return;

    // Movimiento infinito de los autos
    const tiempo = state.clock.getElapsedTime();
    if (auto1Ref.current) auto1Ref.current.setTranslation({ x: Math.sin(tiempo * 1.5) * 10, y: 0.5, z: 0 }, true);
    if (auto2Ref.current) auto2Ref.current.setTranslation({ x: Math.cos(tiempo * 2.0) * 10, y: 0.5, z: -4 }, true);
    if (auto3Ref.current) auto3Ref.current.setTranslation({ x: Math.sin(tiempo * 1.8 + Math.PI) * 10, y: 0.5, z: -8 }, true);

    if (ranaRef.current) {
      const pos = ranaRef.current.translation();

      // --- LÓGICA DE FÍSICAS DE ARRASTRE ---
      if (isDragging.current) {
        // Calculamos la distancia entre la bolita y el cursor
        const dx = cursorPoint.current.x - pos.x;
        const dz = cursorPoint.current.z - pos.z;
        
        // setLinvel aplica velocidad continua. ¡Esto mantiene los choques reales!
        // Multiplicamos por 12 para darle "rapidez" al seguimiento.
        ranaRef.current.setLinvel({ x: dx * 12, y: 0, z: dz * 12 }, true);
      }

      // Comprobar Meta
      if (pos.z < -11) llegarMeta();
    }
  });

  return (
    <group>
      {/* EL SUELO: Ahora se encarga de rastrear el mouse y el "soltar" */}
      <RigidBody type="fixed">
        <mesh 
          position={[0, -0.5, -3]} 
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={moverBolita}
          onPointerUp={soltarBolita}
          onPointerOut={soltarBolita} // Por si el mouse se sale rápido del suelo
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

      {/* LA BOLITA: Solo se encarga de detectar el "agarrar" */}
      <RigidBody
        ref={ranaRef}
        position={[0, 0.5, 6]}
        restitution={1.2} // Rebote elástico
        onCollisionEnter={(e) => {
          if (juegoIniciado && !juegoTerminado && e.other.rigidBodyObject?.name === "auto") {
            manejarChoque();
            // Truco Pro: Si te choca un auto, te suelta la bolita. 
            // Así sientes el impacto y tienes que volver a agarrarla.
            soltarBolita(); 
          }
        }}
      >
        {/* onPointerDown detecta cuando hacemos click exactamente en la esfera */}
        <mesh castShadow onPointerDown={agarrarBolita}>
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