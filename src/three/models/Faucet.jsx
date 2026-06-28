import { materials } from "../materials/materials.js";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Faucet({ position = [0, 0, 0], scale = [1, 1, 1], running = false }) {
  const stream = useRef(null);
  const dropA = useRef(null);
  const dropB = useRef(null);

  useFrame(({ clock }) => {
    if (!running) return;
    const time = clock.elapsedTime;
    if (stream.current) {
      stream.current.scale.y = 0.82 + Math.sin(time * 12) * 0.08;
      stream.current.material.opacity = 0.36 + Math.sin(time * 7) * 0.08;
    }
    [dropA, dropB].forEach((drop, index) => {
      if (!drop.current) return;
      const cycle = (time * 0.8 + index * 0.52) % 1;
      drop.current.position.y = -0.08 - cycle * 0.5;
      drop.current.scale.setScalar(0.85 + cycle * 0.5);
      drop.current.material.opacity = 0.62 * (1 - cycle);
    });
  });

  return (
    <group position={position} scale={scale}>
      <mesh material={materials.metal} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.42, 24]} />
      </mesh>
      <mesh position={[0.11, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.metal} castShadow>
        <cylinderGeometry args={[0.023, 0.023, 0.24, 24]} />
      </mesh>
      <mesh position={[0.22, 0.13, 0]} material={materials.metal} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.16, 20]} />
      </mesh>
      {running && (
        <group position={[0.22, 0.03, 0]}>
          <mesh ref={stream} position={[0, -0.2, 0]} material={materials.water}>
            <cylinderGeometry args={[0.014, 0.01, 0.46, 16]} />
          </mesh>
          <mesh ref={dropA} material={materials.water}>
            <sphereGeometry args={[0.026, 12, 12]} />
          </mesh>
          <mesh ref={dropB} material={materials.water}>
            <sphereGeometry args={[0.018, 12, 12]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
