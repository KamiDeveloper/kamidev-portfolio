"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment, PerspectiveCamera } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingStructure() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    meshRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2}>
        <dodecahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color="#333333"
          roughness={0.2}
          metalness={1}
          distort={0.4}
          speed={2}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 100 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 10 - 5;
        temp.push({ x, y, z, factor: Math.random() });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if(!mesh.current) return;
    particles.forEach((p, i) => {
        const t = state.clock.getElapsedTime();
        dummy.position.set(
            p.x + Math.sin(t * p.factor * 0.5) * 0.5,
            p.y + Math.cos(t * p.factor * 0.3) * 0.5,
            p.z
        );
        dummy.rotation.set(0, t * 0.1, 0);
        dummy.scale.setScalar(0.05 + Math.abs(Math.sin(t * p.factor)));
        dummy.updateMatrix();
        mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#666666" transparent opacity={0.4} wireframe />
    </instancedMesh>
  );
}

export default function FluidBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} color="#e6e6e6" intensity={2} />
        <pointLight position={[-10, -10, -10]} color="#666666" intensity={2} />
        
        <FloatingStructure />
        <Particles count={60} />
        
        <Environment preset="city" />
        <fog attach="fog" args={['#1a1a1a', 5, 20]} />
      </Canvas>
    </div>
  );
}
