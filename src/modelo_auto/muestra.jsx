import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Preload, Stage } from "@react-three/drei";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Car = () => {
    // Como no tienes el archivo 3D, construiremos un auto básico usando figuras geométricas.
    return (
        <group scale={1.5} position={[0, 0.5, 0]}>
            {/* Chasis principal del auto */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[4, 1, 2]} />
                <meshStandardMaterial color="crimson" />
            </mesh>

            {/* Cabina del auto */}
            <mesh position={[-0.5, 0.75, 0]}>
                <boxGeometry args={[2, 0.8, 1.8]} />
                <meshStandardMaterial color="darkred" />
            </mesh>

            {/* Ruedas */}
            {/* Rueda delantera izquierda */}
            <mesh position={[1.2, -0.5, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Rueda delantera derecha */}
            <mesh position={[1.2, -0.5, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Rueda trasera izquierda */}
            <mesh position={[-1.2, -0.5, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Rueda trasera derecha */}
            <mesh position={[-1.2, -0.5, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    );
};

const CarCanvas = () => {
    return (
        <Canvas
            frameloop='always'
            gl={{ preserveDrawingBuffer: true }}
            camera={{ fov: 15, position: [5, 0, 1] }}
            dpr={[1, 2]}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={1} />
                <hemisphereLight intensity={1} />
                <OrbitControls
                    autoRotate={true}
                    enableZoom={false}
                    minPolarAngle={Math.PI / 2}
                    maxPolarAngle={Math.PI / 2}
                />
                <Stage>
                    <Car />
                </Stage>
                <Preload all />
            </Suspense>
        </Canvas>
    );
};

export default CarCanvas;