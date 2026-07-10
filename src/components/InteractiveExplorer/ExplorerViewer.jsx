import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import ExplorerScene from "../../three/explorer/ExplorerScene.jsx";
import styles from "./InteractiveExplorer.module.css";

function supportsWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export default function ExplorerViewer(props) {
  const webgl = supportsWebGL();

  if (props.reducedMotion || !webgl) {
    return (
      <div className={styles.viewerFallback} role="img" aria-label={`${props.category.label} 3D explorer fallback`}>
        <div />
        <span>{props.category.label}</span>
      </div>
    );
  }

  return (
    <div className={styles.viewer} aria-label={`${props.category.label} interactive 3D viewer`}>
      <Canvas dpr={[1, 1.7]} gl={{ antialias: true, powerPreference: "high-performance" }} shadows>
        <PerspectiveCamera makeDefault position={[0, 1.35, 5.9]} fov={38} />
        <ExplorerScene {...props} />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={2.7}
          maxDistance={8}
          minPolarAngle={0.2}
          maxPolarAngle={1.42}
        />
      </Canvas>
    </div>
  );
}
