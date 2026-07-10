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
    const snap = Math.max(progress.kitchen, progress.studio, progress.bathroom);
    const z = 7.4 - snap * 0.95;
    const y = 1.4 + progress.bathroom * 0.36 + progress.kitchen * 0.14 + progress.studio * 0.22;
    const x = progress.kitchen * -0.24 + progress.studio * -0.06 + progress.bathroom * 0.18;
    camera.position.x = MathUtils.lerp(camera.position.x, x + pointer.x * 0.38, 0.055);
    camera.position.y = MathUtils.lerp(camera.position.y, y + pointer.y * 0.22, 0.055);
    camera.position.z = MathUtils.lerp(camera.position.z, z, 0.055);
    camera.fov = MathUtils.lerp(camera.fov, 38 - snap * 2, 0.04);
    camera.updateProjectionMatrix();
    camera.lookAt(target);
  });

  return null;
}
