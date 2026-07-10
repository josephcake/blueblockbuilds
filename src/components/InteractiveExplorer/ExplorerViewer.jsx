import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import ExplorerScene from "../../three/explorer/ExplorerScene.jsx";
import styles from "./InteractiveExplorer.module.css";

const cameraPositions = {
  front: [0, 1.15, 6.1],
  "three-quarter": [3.9, 2.05, 5.2],
  top: [0.2, 6.8, 1.2],
  detail: [1.7, 1.1, 3.45]
};

function supportsWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

function CameraPresetApplier({ preset, resetSignal, controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    const position = cameraPositions[preset] || cameraPositions["three-quarter"];
    camera.position.set(...position);
    camera.lookAt(0, 0.25, 0);
    controlsRef.current?.target.set(0, 0.25, 0);
    controlsRef.current?.update();
  }, [camera, controlsRef, preset, resetSignal]);

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
        <PerspectiveCamera makeDefault position={cameraPositions[props.cameraPreset] || cameraPositions["three-quarter"]} fov={38} />
        <CameraPresetApplier preset={props.cameraPreset} resetSignal={props.cameraReset} controlsRef={controlsRef} />
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
