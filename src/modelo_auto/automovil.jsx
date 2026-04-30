import React from 'react';

const Isohedron = () => {
    return (
        <mesh>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color="white" polygonOffset={true} />
        </mesh>
    );
}
export default Isohedron;
