import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Jugador from './Jugador';
import Obstaculos from './Obstaculos';

export default function Escena({ juegoIniciado, juegoTerminado, manejarChoque, llegarMeta }) {
  return (
    // Cambiamos la posición de la cámara
    <Canvas camera={{ position: [0, 18, 18], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />

      <Physics>
        
        {/* Jugador y Suelo */}
        <Jugador 
          juegoIniciado={juegoIniciado} 
          juegoTerminado={juegoTerminado} 
          manejarChoque={manejarChoque}
          llegarMeta={llegarMeta}
        />

        {/* Tráfico (Los autos) */}
        <Obstaculos juegoIniciado={juegoIniciado} />

        {/* LÍNEA DE META (Visual) Punto B */}
        <mesh position={[0, -0.4, -15.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 2]} />
          <meshStandardMaterial color="#f1c40f" /> {/* Franja amarilla */}
        </mesh>

      </Physics>
    </Canvas>
  );
}