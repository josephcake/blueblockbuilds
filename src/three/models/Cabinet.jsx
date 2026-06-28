import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { materials } from "../materials/materials.js";

export default function Cabinet({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], wall = false, animated = false, phase = 0 }) {
  const leftDoor = useRef(null);
  const rightDoor = useRef(null);
  const height = wall ? 0.68 : 0.92;

  useFrame(({ clock }) => {
    if (!animated || !leftDoor.current || !rightDoor.current) return;
    const openness = (Math.sin(clock.elapsedTime * 0.75 + phase) + 1) / 2;
    const eased = openness * openness * (3 - 2 * openness);
    leftDoor.current.rotation.y = eased * -1.18;
    rightDoor.current.rotation.y = eased * 1.18;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[1.35, wall ? 0.82 : 1.1, 0.42]} radius={0.025} smoothness={4} material={materials.navyCabinet} castShadow receiveShadow />
      <group ref={leftDoor} position={[-0.63, 0, 0.245]}>
        <mesh position={[0.29, 0, 0]} material={materials.paintedWood} castShadow>
          <boxGeometry args={[0.58, height, 0.04]} />
        </mesh>
        <mesh position={[0.55, 0, 0.035]} material={materials.metal} castShadow>
          <boxGeometry args={[0.035, 0.44, 0.035]} />
        </mesh>
      </group>
      <group ref={rightDoor} position={[0.63, 0, 0.245]}>
        <mesh position={[-0.29, 0, 0]} material={materials.paintedWood} castShadow>
          <boxGeometry args={[0.58, height, 0.04]} />
        </mesh>
        <mesh position={[-0.55, 0, 0.035]} material={materials.metal} castShadow>
          <boxGeometry args={[0.035, 0.44, 0.035]} />
        </mesh>
      </group>
    </group>
  );
}
