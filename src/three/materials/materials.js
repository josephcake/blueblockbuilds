import { MeshStandardMaterial } from "three";

export const materials = {
  paintedWood: new MeshStandardMaterial({ color: "#f1f2f4", roughness: 0.62, metalness: 0.02 }),
  navyCabinet: new MeshStandardMaterial({ color: "#0b1a2e", roughness: 0.58, metalness: 0.04 }),
  stone: new MeshStandardMaterial({ color: "#d8d2c8", roughness: 0.42, metalness: 0.02 }),
  metal: new MeshStandardMaterial({ color: "#a7a39b", roughness: 0.28, metalness: 0.72 }),
  ceramic: new MeshStandardMaterial({ color: "#f7f8fa", roughness: 0.36, metalness: 0.02 }),
  blue: new MeshStandardMaterial({ color: "#1457d9", roughness: 0.48, metalness: 0.18 }),
  tile: new MeshStandardMaterial({ color: "#b9c0c8", roughness: 0.5, metalness: 0.02 }),
  mirror: new MeshStandardMaterial({ color: "#aeb8c6", roughness: 0.12, metalness: 0.85 }),
  water: new MeshStandardMaterial({ color: "#8ec7ff", roughness: 0.08, metalness: 0, transparent: true, opacity: 0.48 }),
  warmLight: new MeshStandardMaterial({ color: "#ffe8be", roughness: 0.3, metalness: 0.05, emissive: "#2f1f0f", emissiveIntensity: 0.55 })
};
