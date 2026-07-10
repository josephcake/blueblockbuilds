import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import ExplorerScene from "../../three/explorer/ExplorerScene.jsx";
import styles from "./InteractiveExplorer.module.css";

const defaultCameraPosition = [3.9, 2.05, 5.2];

function supportsWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

function CameraResetApplier({ resetSignal, controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...defaultCameraPosition);
    camera.lookAt(0, 0.25, 0);
    controlsRef.current?.target.set(0, 0.25, 0);
    controlsRef.current?.update();
  }, [camera, controlsRef, resetSignal]);

  return null;
}

export default function ExplorerViewer(props) {
  const webgl = supportsWebGL();
  const controlsRef = useRef(null);

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
        <PerspectiveCamera makeDefault position={defaultCameraPosition} fov={38} />
        <CameraResetApplier resetSignal={props.cameraReset} controlsRef={controlsRef} />
        <ExplorerScene {...props} />
        <OrbitControls
          ref={controlsRef}
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
