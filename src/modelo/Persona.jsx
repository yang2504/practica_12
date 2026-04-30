import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, Stage } from "@react-three/drei";

const Person = () => {
    // Modelo de una persona hecho con figuras geométricas
    const skinColor = "#f1c27d"; // Color de piel
    const shirtColor = "#4287f5"; // Color de camisa
    const pantsColor = "#333333"; // Color de pantalones
    const shoesColor = "#1a1a1a"; // Color de zapatos

    return (
        <group scale={1.2} position={[0, 1.5, 0]}>
            {/* Cabeza */}
            <mesh position={[0, 1.6, 0]}>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>

            {/* Cuello */}
            <mesh position={[0, 1.1, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>

            {/* Torso */}
            <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[1.2, 1.8, 0.6]} />
                <meshStandardMaterial color={shirtColor} />
            </mesh>

            {/* Brazo Izquierdo */}
            <group position={[-0.8, 0.8, 0]}>
                <mesh position={[0, -0.6, 0]}>
                    <cylinderGeometry args={[0.18, 0.15, 1.4, 16]} />
                    <meshStandardMaterial color={skinColor} />
                </mesh>
                {/* Manga Izquierda */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.22, 0.2, 0.5, 16]} />
                    <meshStandardMaterial color={shirtColor} />
                </mesh>
            </group>

            {/* Brazo Derecho */}
            <group position={[0.8, 0.8, 0]}>
                <mesh position={[0, -0.6, 0]}>
                    <cylinderGeometry args={[0.18, 0.15, 1.4, 16]} />
                    <meshStandardMaterial color={skinColor} />
                </mesh>
                {/* Manga Derecha */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.22, 0.2, 0.5, 16]} />
                    <meshStandardMaterial color={shirtColor} />
                </mesh>
            </group>

            {/* Pierna Izquierda */}
            <mesh position={[-0.3, -1.3, 0]}>
                <cylinderGeometry args={[0.25, 0.2, 1.2, 16]} />
                <meshStandardMaterial color={pantsColor} />
            </mesh>
            {/* Zapato Izquierdo */}
            <mesh position={[-0.3, -2.0, 0.1]}>
                <boxGeometry args={[0.3, 0.2, 0.6]} />
                <meshStandardMaterial color={shoesColor} />
            </mesh>

            {/* Pierna Derecha */}
            <mesh position={[0.3, -1.3, 0]}>
                <cylinderGeometry args={[0.25, 0.2, 1.2, 16]} />
                <meshStandardMaterial color={pantsColor} />
            </mesh>
            {/* Zapato Derecho */}
            <mesh position={[0.3, -2.0, 0.1]}>
                <boxGeometry args={[0.3, 0.2, 0.6]} />
                <meshStandardMaterial color={shoesColor} />
            </mesh>
        </group>
    );
};

const ModelCanvas = () => {
    return (
        <Canvas
            frameloop='always'
            gl={{ preserveDrawingBuffer: true }}
            camera={{ fov: 25, position: [0, 2, 8] }}
            dpr={[1, 2]}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls
                    autoRotate={true}
                    enableZoom={true}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                />
                <Stage>
                    <Person />
                </Stage>
                <Preload all />
            </Suspense>
        </Canvas>
    );
};

export default ModelCanvas;