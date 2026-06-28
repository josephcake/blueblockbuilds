import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import { materials } from "../materials/materials.js";

const Toilet = forwardRef(function Toilet({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }, ref) {
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <RoundedBox position={[0, 0.26, -0.22]} args={[0.58, 0.68, 0.2]} radius={0.04} smoothness={6} material={materials.ceramic} castShadow receiveShadow />
      <RoundedBox position={[0, -0.1, 0.08]} args={[0.62, 0.38, 0.72]} radius={0.2} smoothness={14} material={materials.ceramic} castShadow receiveShadow />
      <mesh position={[0, 0.02, 0.08]} rotation={[Math.PI / 2, 0, 0]} material={materials.navyCabinet}>
        <torusGeometry args={[0.22, 0.035, 14, 48]} />
      </mesh>
      <RoundedBox position={[0, 0.64, -0.28]} args={[0.68, 0.18, 0.16]} radius={0.035} smoothness={6} material={materials.ceramic} castShadow />
      <mesh position={[0.24, 0.76, -0.18]} material={materials.metal} castShadow>
        <boxGeometry args={[0.16, 0.025, 0.035]} />
      </mesh>
    </group>
  );
});

export default Toilet;
