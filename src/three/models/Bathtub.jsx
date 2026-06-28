import Faucet from "./Faucet.jsx";
import { materials } from "../materials/materials.js";

export default function Bathtub({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, running = false }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh scale={[1.72, 0.32, 0.78]} material={materials.ceramic} castShadow receiveShadow>
        <sphereGeometry args={[0.58, 48, 24]} />
      </mesh>
      <mesh position={[0, 0.08, 0]} scale={[1.28, 0.2, 0.48]} material={materials.navyCabinet}>
        <sphereGeometry args={[0.5, 48, 18]} />
      </mesh>
      <mesh position={[0, 0.19, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.58, 0.74, 1]} material={materials.ceramic} castShadow>
        <torusGeometry args={[0.5, 0.035, 14, 64]} />
      </mesh>
      <Faucet position={[0.65, 0.52, -0.18]} scale={[0.9, 0.9, 0.9]} running={running} />
    </group>
  );
}
