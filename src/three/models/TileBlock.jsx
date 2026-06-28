import { RoundedBox } from "@react-three/drei";
import { materials } from "../materials/materials.js";

export default function TileBlock({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], accent = false }) {
  return <RoundedBox position={position} rotation={rotation} scale={scale} args={[0.72, 0.08, 0.72]} radius={0.015} smoothness={3} material={accent ? materials.blue : materials.tile} castShadow receiveShadow />;
}
