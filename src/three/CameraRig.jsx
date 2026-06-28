import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";
import { usePointerInfluence } from "./hooks/usePointerInfluence.js";
import { useSceneProgress } from "./hooks/useSceneProgress.js";

const target = new Vector3(0, 0.25, 0);

export default function CameraRig() {
  const { camera } = useThree();
  const pointer = usePointerInfluence();
  const progress = useSceneProgress();

  useFrame(() => {
    const z = MathUtils.lerp(7.4, 6.4, progress.kitchen);
    const y = MathUtils.lerp(1.4, 2.1, progress.bathroom);
    camera.position.x = MathUtils.lerp(camera.position.x, pointer.x * 0.45, 0.045);
    camera.position.y = MathUtils.lerp(camera.position.y, y + pointer.y * 0.25, 0.045);
    camera.position.z = MathUtils.lerp(camera.position.z, z, 0.04);
    camera.lookAt(target);
  });

  return null;
}
