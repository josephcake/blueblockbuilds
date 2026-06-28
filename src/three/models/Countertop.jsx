import { RoundedBox } from "@react-three/drei";
import { materials } from "../materials/materials.js";

export default function Countertop({ position = [0, 0, 0], scale = [1, 1, 1] }) {
  return <RoundedBox position={position} scale={scale} args={[1.8, 0.12, 0.72]} radius={0.035} smoothness={5} material={materials.stone} castShadow receiveShadow />;
}
