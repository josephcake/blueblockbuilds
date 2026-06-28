import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import Scene from "./Scene.jsx";

export default function Experience({ onReady, onError }) {
  useEffect(() => {
    const timeout = window.setTimeout(onReady, 300);
    return () => window.clearTimeout(timeout);
  }, [onReady]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 1.4, 7.4], fov: 38 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={onReady}
      onError={onError}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
