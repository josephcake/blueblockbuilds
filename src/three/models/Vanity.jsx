import Cabinet from "./Cabinet.jsx";
import Sink from "./Sink.jsx";
import Faucet from "./Faucet.jsx";
import { materials } from "../materials/materials.js";

export default function Vanity({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Cabinet scale={[0.9, 0.82, 0.82]} />
      <Sink position={[0, 0.55, 0.04]} scale={[0.78, 0.8, 0.75]} />
      <Faucet position={[-0.28, 0.78, -0.08]} scale={[0.72, 0.72, 0.72]} />
      <mesh position={[0, 1.38, -0.16]} material={materials.mirror} castShadow>
        <boxGeometry args={[0.82, 0.82, 0.035]} />
      </mesh>
    </group>
  );
}
