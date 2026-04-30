import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import ObstaculoPrueba from './ObstaculoPrueba';

export default function Escena({ juegoIniciado, juegoTerminado }) {
  return (
    <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />

      <Physics>
        {/* El Suelo */}
        <RigidBody type="fixed">
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 30]} />
            <meshStandardMaterial color="#34495e" />
          </mesh>
        </RigidBody>

        {/* Nuestro obstáculo animado */}
        <ObstaculoPrueba 
          juegoIniciado={juegoIniciado} 
          juegoTerminado={juegoTerminado} 
        />
      </Physics>
    </Canvas>
  );
}