"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function FollowingCube() {
  // Load the GLTF model
  const gltf = useGLTF("/cube.glb")
  const cubeRef = useRef<THREE.Object3D>(null!);

  // Access the camera
  const { camera } = useThree();

  // Store mouse position normalized to [-1, 1]
  const [mouse, setMouse] = useState(new THREE.Vector2(0, 0));

  // Listen for mouse move
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMouse(new THREE.Vector2(x, y));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation loop to rotate the cube toward the target
  useFrame(() => {
    if (!cubeRef.current) return;

    // Project mouse to 3D world space
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);

    const dir = vector.sub(camera.position).normalize();
    const distance = 5;
    const target = camera.position.clone().add(dir.multiplyScalar(distance));

    // Make the cube look at the target
    cubeRef.current.lookAt(target);
  });

  return (
    <primitive object={gltf.scene} ref={cubeRef} position={[0, 0, -2]} />
  );
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <FollowingCube />
    </Canvas>
  );
}
