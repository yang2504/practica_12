import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

export default function Jugador({ juegoIniciado, juegoTerminado, manejarChoque, llegarMeta }) {
  const jugadorRef = useRef();

  // Función para mover al jugador con el click
  const moverJugador = (e) => {
    // Si el juego no ha empezado o ya perdimos/ganamos, no hacemos nada
    if (!juegoIniciado || juegoTerminado || !jugadorRef.current) return;

    const puntoDestino = e.point; // Coordenada exacta del click en el suelo
    const posActual = jugadorRef.current.translation();
    
    // Calculamos la dirección hacia donde empujar
    const dx = puntoDestino.x - posActual.x;
    const dz = puntoDestino.z - posActual.z;
    
    // Normalizamos la fuerza para que siempre se mueva a la misma velocidad
    const magnitud = Math.sqrt(dx * dx + dz * dz);
    const fuerza = 8; // Velocidad del salto
    
    // Aplicamos el empujón físico
    jugadorRef.current.applyImpulse({ 
      x: (dx / magnitud) * fuerza, 
      y: 0, 
      z: (dz / magnitud) * fuerza 
    }, true);
  };

  // Verificamos en cada frame si la rana llegó a la meta
  useFrame(() => {
    if (!jugadorRef.current) return;
    const pos = jugadorRef.current.translation();
    
    // Si la rana pasa de la posición Z -15, significa que cruzó la meta
    if (pos.z < -15 && juegoIniciado && !juegoTerminado) {
      llegarMeta();
    }
  });

  return (
    <group>
      {/* EL SUELO: Detecta los clicks */}
      <RigidBody type="fixed">
        <mesh position={[0, -0.5, -5]} rotation={[-Math.PI / 2, 0, 0]} onClick={moverJugador}>
          <planeGeometry args={[20, 30]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      </RigidBody>

      {/* EL JUGADOR (La Rana) */}
      <RigidBody 
        ref={jugadorRef} 
        position={[0, 0.5, 4]} // <--- Cambiamos Z de 8 a 4 para que se vea
        restitution={1.5} 
        name="jugador"
        canSleep={false} // <--- ¡Esto evita que la rana se duerma!
        onCollisionEnter={(e) => {
          if (juegoIniciado && !juegoTerminado && e.other.rigidBodyObject?.name === "obstaculo") {
            manejarChoque();
          }
        }}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#2ed573" />
        </mesh>
      </RigidBody>
    </group>
  );
}