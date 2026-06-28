import { RoundedBox } from "@react-three/drei";
import { materials } from "../materials/materials.js";

export default function Sink({ position = [0, 0, 0], scale = [1, 1, 1] }) {
  return (
    <group position={position} scale={scale}>
      <RoundedBox args={[0.62, 0.14, 0.38]} radius={0.06} smoothness={8} material={materials.ceramic} castShadow receiveShadow />
      <RoundedBox position={[0, 0.045, 0]} args={[0.46, 0.08, 0.24]} radius={0.04} smoothness={8} material={materials.navyCabinet} />
    </group>
  );
}
