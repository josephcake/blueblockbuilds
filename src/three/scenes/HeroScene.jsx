import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils } from "three";
import KitchenIsland from "../models/KitchenIsland.jsx";
import Cabinet from "../models/Cabinet.jsx";
import Countertop from "../models/Countertop.jsx";
import Bathtub from "../models/Bathtub.jsx";
import Vanity from "../models/Vanity.jsx";
import TileBlock from "../models/TileBlock.jsx";
import { materials } from "../materials/materials.js";
import { useSceneProgress } from "../hooks/useSceneProgress.js";

export default function HeroScene() {
  const group = useRef(null);
  const kitchen = useRef(null);
  const bath = useRef(null);
  const pendant = useRef(null);
  const samples = useRef(null);
  const slab = useRef(null);
  const progress = useSceneProgress();

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.18) * 0.09 + progress.kitchen * -0.25 + progress.bathroom * 0.36;
      group.current.rotation.x = 0.08 + Math.sin(time * 0.13) * 0.025;
      group.current.position.y = Math.sin(time * 0.36) * 0.08 + progress.bathroom * 0.12;
    }
    if (kitchen.current) {
      kitchen.current.position.x = MathUtils.lerp(-0.5, -1.22, progress.kitchen);
      kitchen.current.position.z = MathUtils.lerp(0, 0.3, progress.kitchen);
      kitchen.current.rotation.y = MathUtils.lerp(-0.28, 0.24, progress.kitchen);
    }
    if (bath.current) {
      bath.current.position.x = MathUtils.lerp(1.45, 0.25, progress.bathroom);
      bath.current.position.z = MathUtils.lerp(-0.46, 0.26, progress.bathroom);
      bath.current.rotation.y = MathUtils.lerp(0.42, -0.12, progress.bathroom);
    }
    if (pendant.current) {
      pendant.current.rotation.z = Math.sin(time * 0.7) * 0.035;
      pendant.current.position.y = 2.12 + Math.sin(time * 0.52) * 0.06;
    }
    if (samples.current) {
      samples.current.rotation.y = time * 0.08;
    }
    if (slab.current) {
      slab.current.rotation.z = Math.sin(time * 0.44) * 0.08;
    }
  });

  return (
    <group ref={group} position={[1.68, -0.22, 0]} rotation={[0.08, -0.3, 0]}>
      <group ref={kitchen}>
        <KitchenIsland position={[-0.35, -0.42, 0]} rotation={[0, -0.34, 0]} scale={1.06} animated />
        <Cabinet position={[-1.58, 0.64, -0.45]} rotation={[0, 0.22, 0]} scale={[0.78, 0.78, 0.78]} wall animated phase={1.6} />
        <group ref={slab}>
          <Countertop position={[0.62, 1.14, -0.24]} rotation={[0.12, 0.4, 0.08]} scale={[0.78, 0.7, 0.72]} />
        </group>
      </group>
      <group ref={bath}>
        <Bathtub position={[0.98, -0.58, -0.36]} rotation={[0, 0.36, 0]} scale={1.02} running />
        <Vanity position={[1.72, 0.32, 0.22]} rotation={[0, -0.44, 0]} scale={0.72} />
      </group>
      <group ref={samples}>
        <TileBlock position={[0.7, -1.25, 0.8]} rotation={[0.12, 0.2, 0.18]} scale={[1, 1, 1]} />
        <TileBlock position={[1.25, -1.1, 0.98]} rotation={[0.05, -0.24, -0.12]} scale={[0.78, 1, 0.78]} accent />
        <TileBlock position={[0.96, -0.98, 1.22]} rotation={[0.3, 0.7, -0.08]} scale={[0.52, 1, 0.52]} />
      </group>
      <mesh position={[-1.42, -0.03, 0.64]} rotation={[0, 0.3, 0]} material={materials.metal} castShadow>
        <boxGeometry args={[0.52, 0.055, 0.055]} />
      </mesh>
      <mesh position={[-1.32, -0.16, 0.76]} rotation={[0, -0.12, 0]} material={materials.metal} castShadow>
        <boxGeometry args={[0.36, 0.045, 0.045]} />
      </mesh>
      <group ref={pendant} position={[-0.9, 2.12, 0.1]}>
        <mesh position={[0, -0.18, 0]} material={materials.metal} castShadow>
          <cylinderGeometry args={[0.17, 0.32, 0.22, 36]} />
        </mesh>
        <mesh position={[0, -0.31, 0]} material={materials.warmLight}>
          <cylinderGeometry args={[0.2, 0.14, 0.02, 32]} />
        </mesh>
        <mesh position={[0, 0.38, 0]} material={materials.metal} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.92, 12]} />
        </mesh>
        <pointLight position={[0, -0.42, 0]} intensity={0.85} color="#ffe8be" distance={2.8} />
      </group>
      <mesh position={[0.08, -1.52, 0.15]} rotation={[-Math.PI / 2, 0, 0.08]} material={materials.navyCabinet} receiveShadow>
        <circleGeometry args={[2.35, 80]} />
      </mesh>
    </group>
  );
}
