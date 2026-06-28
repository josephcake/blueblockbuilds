export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 7, 5]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-5, 5, 4]} angle={0.34} penumbra={0.7} intensity={3} color="#d8d2c8" />
      <pointLight position={[0, 1.2, -3]} intensity={1.2} color="#2f7dff" />
    </>
  );
}
