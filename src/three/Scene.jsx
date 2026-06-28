import CameraRig from "./CameraRig.jsx";
import Lighting from "./Lighting.jsx";
import Environment from "./Environment.jsx";
import HeroScene from "./scenes/HeroScene.jsx";

export default function Scene() {
  return (
    <>
      <color attach="background" args={["#05080d"]} />
      <CameraRig />
      <Lighting />
      <Environment />
      <HeroScene />
    </>
  );
}
