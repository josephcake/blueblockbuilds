import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils } from "three";
import KitchenIsland from "../models/KitchenIsland.jsx";
import Cabinet from "../models/Cabinet.jsx";
import Countertop from "../models/Countertop.jsx";
import Bathtub from "../models/Bathtub.jsx";
import Vanity from "../models/Vanity.jsx";
import TileBlock from "../models/TileBlock.jsx";
import Toilet from "../models/Toilet.jsx";
import { materials } from "../materials/materials.js";
import { useSceneProgress } from "../hooks/useSceneProgress.js";

export default function HeroScene() {
  const group = useRef(null);
  const kitchen = useRef(null);
  const bath = useRef(null);
  const toilet = useRef(null);
  const pendant = useRef(null);
  const samples = useRef(null);
  const slab = useRef(null);
  const progress = useSceneProgress();

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const kitchenSnap = progress.kitchen;
    const bathroomSnap = progress.bathroom;
    const anySnap = Math.max(kitchenSnap, bathroomSnap);

    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.18) * 0.09 + kitchenSnap * -0.2 + bathroomSnap * 0.32;
      group.current.rotation.x = 0.08 + Math.sin(time * 0.13) * 0.025;
      group.current.position.x = MathUtils.lerp(group.current.position.x, MathUtils.lerp(1.68, 0.85, anySnap), 0.055);
      group.current.position.y = MathUtils.lerp(group.current.position.y, Math.sin(time * 0.36) * 0.08 + bathroomSnap * 0.12, 0.055);
    }

    if (kitchen.current) {
      kitchen.current.position.x = MathUtils.lerp(kitchen.current.position.x, -0.5 + kitchenSnap * 0.95 - bathroomSnap * 4.6, 0.08);
      kitchen.current.position.y = MathUtils.lerp(kitchen.current.position.y, kitchenSnap * 0.08, 0.08);
      kitchen.current.position.z = MathUtils.lerp(kitchen.current.position.z, kitchenSnap * 1.15 - bathroomSnap * 1.8, 0.08);
      kitchen.current.rotation.y = MathUtils.lerp(kitchen.current.rotation.y, -0.28 + kitchenSnap * 0.66, 0.08);
      const kitchenScale = 1 + kitchenSnap * 0.24 - bathroomSnap * 0.36;
      kitchen.current.scale.setScalar(MathUtils.lerp(kitchen.current.scale.x, kitchenScale, 0.08));
    }

    if (bath.current) {
      bath.current.position.x = MathUtils.lerp(bath.current.position.x, 1.45 - bathroomSnap * 2.72 + kitchenSnap * 2.4, 0.08);
      bath.current.position.y = MathUtils.lerp(bath.current.position.y, bathroomSnap * 0.22, 0.08);
      bath.current.position.z = MathUtils.lerp(bath.current.position.z, -0.46 + bathroomSnap * 1.28 - kitchenSnap * 0.75, 0.08);
      bath.current.rotation.y = MathUtils.lerp(bath.current.rotation.y, 0.42 - bathroomSnap * 0.64, 0.08);
      const bathScale = 1 + bathroomSnap * 0.22 - kitchenSnap * 0.1;
      bath.current.scale.setScalar(MathUtils.lerp(bath.current.scale.x, bathScale, 0.08));
    }

    if (toilet.current) {
      toilet.current.position.x = MathUtils.lerp(toilet.current.position.x, 2.3 - bathroomSnap * 0.78 + kitchenSnap * 2.2, 0.08);
      toilet.current.position.y = MathUtils.lerp(toilet.current.position.y, -0.5 + bathroomSnap * 0.22, 0.08);
      toilet.current.position.z = MathUtils.lerp(toilet.current.position.z, -0.18 + bathroomSnap * 1.12 - kitchenSnap * 0.8, 0.08);
      toilet.current.rotation.y = MathUtils.lerp(toilet.current.rotation.y, -0.36 + bathroomSnap * 0.58, 0.08);
      const toiletScale = 0.78 + bathroomSnap * 0.22;
      toilet.current.scale.setScalar(MathUtils.lerp(toilet.current.scale.x, toiletScale, 0.08));
    }

    if (pendant.current) {
      pendant.current.rotation.z = Math.sin(time * 0.7) * 0.035;
      pendant.current.position.y = 2.12 + Math.sin(time * 0.52) * 0.06 + kitchenSnap * 0.14;
      pendant.current.position.z = MathUtils.lerp(pendant.current.position.z, kitchenSnap * 0.8, 0.06);
    }

    if (samples.current) {
      samples.current.rotation.y = time * 0.08 + kitchenSnap * 0.36 + bathroomSnap * -0.24;
      samples.current.position.z = MathUtils.lerp(samples.current.position.z, anySnap * 1.12, 0.06);
    }

    if (slab.current) {
      slab.current.rotation.z = Math.sin(time * 0.44) * 0.08;
      slab.current.position.z = MathUtils.lerp(slab.current.position.z, kitchenSnap * 0.78, 0.06);
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
      <Toilet ref={toilet} position={[2.3, -0.5, -0.18]} rotation={[0, -0.36, 0]} scale={0.78} />
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
