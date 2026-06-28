import Cabinet from "./Cabinet.jsx";
import Countertop from "./Countertop.jsx";
import Sink from "./Sink.jsx";
import Faucet from "./Faucet.jsx";

export default function KitchenIsland({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, animated = false }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Cabinet position={[0, -0.28, 0]} scale={[1.35, 1, 1.35]} animated={animated} />
      <Countertop position={[0, 0.34, 0]} scale={[1.55, 1, 1.45]} />
      <Sink position={[0.34, 0.45, 0.04]} scale={[0.95, 0.9, 0.9]} />
      <Faucet position={[0.05, 0.72, -0.16]} running={animated} />
    </group>
  );
}
