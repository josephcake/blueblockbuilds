import { ContactShadows } from "@react-three/drei";

export default function Environment() {
  return (
    <>
      <hemisphereLight args={["#f7f8fa", "#071427", 0.7]} />
      <ContactShadows position={[0, -1.55, 0]} opacity={0.32} scale={9} blur={2.6} far={4} />
    </>
  );
}
