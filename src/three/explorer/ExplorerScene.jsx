import { Environment, Html, RoundedBox, ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { MeshPhysicalMaterial, MeshStandardMaterial, Vector3 } from "three";

const materialLibrary = {
  navy: { color: "#0b1a2e", roughness: 0.5, metalness: 0.04 },
  ivory: { color: "#ece7dc", roughness: 0.48, metalness: 0.02 },
  walnut: { color: "#7a5132", roughness: 0.58, metalness: 0.02 },
  oak: { color: "#b98b58", roughness: 0.46, metalness: 0.02 },
  stone: { color: "#d8d2c8", roughness: 0.28, metalness: 0.03 },
  tile: { color: "#b7bdc5", roughness: 0.54, metalness: 0.02 },
  charcoal: { color: "#111820", roughness: 0.35, metalness: 0.08 },
  metal: { color: "#a8abb0", roughness: 0.22, metalness: 0.82 },
  brass: { color: "#caa65b", roughness: 0.24, metalness: 0.72 },
  glass: { color: "#b9d5e8", roughness: 0.04, metalness: 0, transmission: 0.38, transparent: true, opacity: 0.34 },
  water: { color: "#8ec7ff", roughness: 0.08, metalness: 0, transparent: true, opacity: 0.5 },
  blackGlass: { color: "#06080b", roughness: 0.16, metalness: 0.12 },
  glow: { color: "#ff7b3d", roughness: 0.2, metalness: 0, emissive: "#ff5f24", emissiveIntensity: 1.4 }
};

const materialCache = new Map();

function getMaterial(options) {
  const key = JSON.stringify(options);
  if (!materialCache.has(key)) {
    const Material = options.transmission ? MeshPhysicalMaterial : MeshStandardMaterial;
    materialCache.set(key, new Material(options));
  }
  return materialCache.get(key);
}

function mat(name) {
  return materialLibrary[name];
}

function Annotation({ children, position, visible = true }) {
  if (!visible) return null;
  return (
    <Html position={position} center distanceFactor={7} transform>
      <span style={{
        display: "block",
        minWidth: 92,
        padding: "6px 8px",
        border: "1px solid rgba(216,210,200,.45)",
        background: "rgba(5,8,13,.78)",
        color: "#f7f8fa",
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        textAlign: "center",
        whiteSpace: "nowrap"
      }}>
        {children}
      </span>
    </Html>
  );
}

function CameraDirector({ preset }) {
  const { camera } = useThree();
  const target = useMemo(() => new Vector3(0, 0.25, 0), []);
  const positions = {
    front: new Vector3(0, 1.15, 6.1),
    "three-quarter": new Vector3(3.9, 2.05, 5.2),
    top: new Vector3(0.2, 6.8, 1.2),
    detail: new Vector3(1.7, 1.1, 3.45)
  };

  useFrame(() => {
    const next = positions[preset] || positions["three-quarter"];
    camera.position.lerp(next, 0.045);
    camera.lookAt(target);
  });

  return null;
}

function SceneLighting({ preset }) {
  const config = {
    showroom: { bg: "#070a10", key: 2.4, fill: 0.7, env: "warehouse" },
    daylight: { bg: "#11161c", key: 2.1, fill: 1.05, env: "city" },
    "warm interior": { bg: "#0c0906", key: 1.8, fill: 0.8, env: "apartment" },
    "dark studio": { bg: "#030406", key: 2.8, fill: 0.25, env: "night" }
  }[preset] || { bg: "#070a10", key: 2.4, fill: 0.7, env: "warehouse" };

  return (
    <>
      <color attach="background" args={[config.bg]} />
      <ambientLight intensity={config.fill} />
      <directionalLight position={[3, 5, 4]} intensity={config.key} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3.2, 2.8, 2.2]} intensity={0.7} color="#d8d2c8" />
      <Environment preset={config.env} />
    </>
  );
}

function ModelFrame({ children, label, offset = 0, compare = false }) {
  return (
    <group position={[offset, 0, 0]}>
      {compare && <Annotation position={[0, 2.45, 0]}>{label}</Annotation>}
      {children}
    </group>
  );
}

function CabinetSystem({ variant, mode, motion, annotations }) {
  const isEuro = variant.id === "european";
  const open = mode.includes("Open doors") ? motion : mode.includes("Cutaway") || mode.includes("Exploded") ? 0.82 : 0;
  const drawers = mode.includes("Open drawers") ? motion : mode.includes("Exploded") ? 0.72 : 0;
  const explode = mode.includes("Exploded") ? 1 : 0;
  const cutaway = mode.includes("Cutaway");

  return (
    <group>
      <RoundedBox args={[2.25, 1.65, 0.82]} radius={0.025} smoothness={4} position={[0, 0.45, -0.08]} material={getMaterial(mat("navy"))} castShadow receiveShadow />
      {!isEuro && (
        <group position={[0, 0.45, 0.36 + explode * 0.24]}>
          <mesh material={getMaterial(mat("ivory"))} castShadow><boxGeometry args={[2.42, 0.12, 0.08]} /></mesh>
          <mesh position={[0, 0.76, 0]} material={getMaterial(mat("ivory"))} castShadow><boxGeometry args={[2.42, 0.12, 0.08]} /></mesh>
          <mesh position={[-1.15, 0.38, 0]} material={getMaterial(mat("ivory"))} castShadow><boxGeometry args={[0.12, 1.64, 0.08]} /></mesh>
          <mesh position={[1.15, 0.38, 0]} material={getMaterial(mat("ivory"))} castShadow><boxGeometry args={[0.12, 1.64, 0.08]} /></mesh>
          <mesh position={[0, 0.38, 0]} material={getMaterial(mat("ivory"))} castShadow><boxGeometry args={[0.1, 1.64, 0.08]} /></mesh>
        </group>
      )}
      <group position={[-1.08 - explode * 0.28, 0.55, 0.42 + explode * 0.24]} rotation={[0, -open * 1.25, 0]}>
        <RoundedBox position={[0.5, 0, 0]} args={[0.96, 1.42, 0.07]} radius={isEuro ? 0.018 : 0.035} smoothness={5} material={getMaterial(isEuro ? mat("ivory") : mat("walnut"))} castShadow />
      </group>
      <group position={[1.08 + explode * 0.28, 0.55, 0.42 + explode * 0.24]} rotation={[0, open * 1.25, 0]}>
        <RoundedBox position={[-0.5, 0, 0]} args={[0.96, 1.42, 0.07]} radius={isEuro ? 0.018 : 0.035} smoothness={5} material={getMaterial(isEuro ? mat("ivory") : mat("walnut"))} castShadow />
      </group>
      {[0.1, -0.28].map((y, index) => (
        <group key={y} position={[0, y + 0.74, 0.58 + drawers * (0.38 + index * 0.18) + explode * 0.4]}>
          <RoundedBox args={[1.72, 0.26, 0.52]} radius={0.022} smoothness={4} material={getMaterial(isEuro ? mat("ivory") : mat("walnut"))} castShadow />
          <mesh position={[0, 0, 0.29]} material={getMaterial(mat("metal"))}><boxGeometry args={[0.86, 0.035, 0.035]} /></mesh>
        </group>
      ))}
      {[-0.44, 0.06, 0.56].map((y) => (
        <mesh key={y} position={[0, y + 0.42, cutaway ? 0.15 : 0.02]} material={getMaterial(mat("stone"))} castShadow>
          <boxGeometry args={[1.88, 0.035, 0.66]} />
        </mesh>
      ))}
      <mesh position={[0, -0.46, 0.12]} material={getMaterial(mat("charcoal"))}><boxGeometry args={[1.78, 0.22, 0.54]} /></mesh>
      <Annotation visible={annotations} position={[0, 1.6, 0.62]}>{isEuro ? "frameless box" : "visible face frame"}</Annotation>
      <Annotation visible={annotations} position={[1.45, 0.8, 0.75]}>hinge line</Annotation>
      <Annotation visible={annotations} position={[0, -0.64, 0.4]}>toe kick</Annotation>
    </group>
  );
}

function HingeSystem({ variant, mode, motion, annotations }) {
  const exposed = variant.id === "exposed-decorative";
  const wide = variant.id === "wide-angle";
  const angle = mode.includes("Closed") ? 0 : mode.includes("Partial") ? motion * 0.9 : mode.includes("Fully") ? 1.65 : motion * (wide ? 2.25 : 1.25);
  const explode = mode.includes("Exploded") ? 0.28 : 0;
  const xray = mode.includes("X-ray");

  return (
    <group>
      <RoundedBox args={[1.35, 1.8, 0.18]} radius={0.025} smoothness={4} position={[-0.72, 0.42, 0]} material={getMaterial(mat("navy"))} castShadow />
      <group position={[0, 0.42, 0.14 + explode]} rotation={[0, -angle, 0]}>
        <RoundedBox position={[0.63, 0, 0]} args={[1.18, 1.7, 0.08]} radius={0.025} smoothness={4} material={getMaterial(xray ? { ...mat("ivory"), transparent: true, opacity: 0.42 } : mat("ivory"))} castShadow />
      </group>
      {[-0.35, 0.35].map((y) => (
        <group key={y} position={[-0.15, y + 0.42, 0.28]}>
          {exposed ? (
            <>
              <mesh material={getMaterial(mat("brass"))} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.54, 24]} /></mesh>
              <mesh position={[-0.16, 0, 0]} material={getMaterial(mat("brass"))}><boxGeometry args={[0.28, 0.22, 0.035]} /></mesh>
              <mesh position={[0.16, 0, 0]} material={getMaterial(mat("brass"))}><boxGeometry args={[0.28, 0.22, 0.035]} /></mesh>
            </>
          ) : (
            <>
              <mesh position={[-0.12 - explode, 0, 0]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.12, 0.12, 0.055, 36]} /></mesh>
              <mesh position={[0.14 + explode, 0, 0]} material={getMaterial(mat("metal"))}><boxGeometry args={[0.32, 0.19, 0.045]} /></mesh>
              <mesh position={[0.02, 0, 0.08]} material={getMaterial(variant.id.includes("soft") ? mat("charcoal") : mat("metal"))}><boxGeometry args={[0.34, 0.055, 0.055]} /></mesh>
            </>
          )}
        </group>
      ))}
      <Annotation visible={annotations} position={[0.42, 1.38, 0.46]}>{wide ? "wide-angle arm" : exposed ? "visible barrel" : "concealed cup"}</Annotation>
      <Annotation visible={annotations} position={[-0.7, -0.58, 0.34]}>mounting plate</Annotation>
    </group>
  );
}

function CooktopSystem({ variant, mode, powered, annotations }) {
  const on = powered && (mode === "On" || mode === "Installed" || mode === "Detail");
  const gas = variant.id === "gas";
  const electric = variant.id === "electric";
  const cutaway = mode.includes("Cutaway");

  return (
    <group>
      <RoundedBox args={[3.3, 0.28, 1.78]} radius={0.04} smoothness={4} position={[0, 0.15, 0]} material={getMaterial(mat("stone"))} receiveShadow castShadow />
      <RoundedBox args={[2.18, 0.1, 1.16]} radius={0.035} smoothness={6} position={[0, 0.35, 0]} material={getMaterial(gas ? mat("charcoal") : mat("blackGlass"))} castShadow />
      {cutaway && <mesh position={[0, -0.08, 0]} material={getMaterial(mat("metal"))}><boxGeometry args={[2.04, 0.38, 1.02]} /></mesh>}
      {gas ? (
        <group>
          {[[-0.62, -0.28], [0.62, -0.28], [-0.62, 0.28], [0.62, 0.28]].map(([x, z]) => (
            <group key={`${x}-${z}`} position={[x, 0.46, z]}>
              <mesh material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.19, 0.19, 0.06, 40]} /></mesh>
              <mesh position={[0, 0.055, 0]} material={getMaterial(mat("charcoal"))}><torusGeometry args={[0.24, 0.018, 8, 32]} /></mesh>
              {on && <mesh position={[0, 0.09, 0]} material={getMaterial(mat("glow"))}><torusGeometry args={[0.16, 0.012, 8, 42]} /></mesh>}
            </group>
          ))}
          {[-0.34, 0, 0.34].map((x) => <mesh key={x} position={[x, 0.48, 0.66]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.055, 0.055, 0.08, 20]} /></mesh>)}
        </group>
      ) : (
        <group>
          {[[-0.58, -0.25, 0.28], [0.55, -0.22, 0.22], [-0.46, 0.34, 0.18], [0.54, 0.34, 0.26]].map(([x, z, r]) => (
            <mesh key={`${x}-${z}`} position={[x, 0.415, z]} material={getMaterial(on ? mat("glow") : mat("metal"))}>
              <torusGeometry args={[r, 0.012, 8, 64]} />
            </mesh>
          ))}
          {electric && on && <pointLight position={[0, 0.74, 0]} intensity={0.75} color="#ff6d3d" distance={2.3} />}
        </group>
      )}
      <Annotation visible={annotations} position={[0, 1.02, -0.72]}>{gas ? "burner assembly" : electric ? "radiant zones" : "induction markings"}</Annotation>
      <Annotation visible={annotations} position={[1.35, 0.18, 0.72]}>countertop cutout</Annotation>
    </group>
  );
}

function FlooringSystem({ variant, mode, annotations }) {
  const cross = mode.includes("Cross") || mode.includes("Exploded");
  const room = mode.includes("Room");
  const materialName = variant.id === "hardwood" ? "oak" : variant.id === "engineered" ? "walnut" : variant.id === "vinyl" ? "stone" : "ivory";
  const layers = variant.id === "hardwood" ? 1 : variant.id === "engineered" ? 4 : 3;

  return (
    <group rotation={[0, -0.22, 0]}>
      {Array.from({ length: room ? 18 : 6 }).map((_, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        return (
          <RoundedBox
            key={index}
            args={[0.9, 0.08, 2.15]}
            radius={0.012}
            smoothness={2}
            position={[(col - 1) * 0.92 + (row % 2) * 0.25, cross ? 0.12 + row * 0.06 : 0, (row - 2) * 0.55]}
            material={getMaterial(mat(materialName))}
            castShadow
            receiveShadow
          />
        );
      })}
      {cross && Array.from({ length: layers }).map((_, index) => (
        <mesh key={index} position={[1.65, -0.18 + index * 0.12, 0]} material={getMaterial(index === layers - 1 ? mat(materialName) : mat(index % 2 ? "charcoal" : "stone"))}>
          <boxGeometry args={[0.78, 0.08, 1.9]} />
        </mesh>
      ))}
      {Array.from({ length: 10 }).map((_, index) => (
        <mesh key={index} position={[-1.1 + index * 0.23, 0.065, -0.42 + (index % 4) * 0.28]} rotation={[0, 0.2, 0]} material={getMaterial(mat("charcoal"))}>
          <boxGeometry args={[0.16, 0.006, 0.012]} />
        </mesh>
      ))}
      <Annotation visible={annotations} position={[0, 0.7, -1.2]}>plank layout</Annotation>
      <Annotation visible={annotations && cross} position={[1.65, 0.62, 0]}>layered construction</Annotation>
    </group>
  );
}

function CountertopSystem({ variant, mode, annotations }) {
  const wood = variant.id === "butcher";
  const marble = variant.id === "marble";
  const granite = variant.id === "granite";
  const waterfall = mode.includes("Waterfall");
  const cutaway = mode.includes("Cutaway");
  const materialName = wood ? "walnut" : variant.id === "laminate" ? "ivory" : variant.id === "solid-surface" ? "stone" : "charcoal";

  return (
    <group>
      <RoundedBox args={[3, cutaway ? 0.34 : 0.22, 1.48]} radius={variant.id === "porcelain" ? 0.018 : 0.045} smoothness={5} position={[0, 0.32, 0]} material={getMaterial(mat(materialName))} castShadow receiveShadow />
      {waterfall && <RoundedBox args={[0.2, 1.18, 1.48]} radius={0.035} smoothness={4} position={[1.4, -0.28, 0]} material={getMaterial(mat(materialName))} castShadow />}
      {mode.includes("Installation") && <RoundedBox args={[1.02, 0.16, 0.55]} radius={0.06} smoothness={8} position={[-0.55, 0.49, 0.1]} material={getMaterial(mat("ivory"))} />}
      {mode.includes("Installation") && <RoundedBox args={[0.64, 0.1, 0.5]} radius={0.035} smoothness={4} position={[0.72, 0.51, -0.05]} material={getMaterial(mat("blackGlass"))} />}
      {mode.includes("Edge") && <mesh position={[0, 0.13, 0.79]} material={getMaterial(mat("metal"))}><boxGeometry args={[2.8, 0.04, 0.035]} /></mesh>}
      {marble && [[-0.8, 0.18], [-0.2, -0.12], [0.45, 0.22], [0.86, -0.24]].map(([x, z], index) => (
        <mesh key={index} position={[x, 0.445, z]} rotation={[0, 0.35 + index * 0.24, 0]} material={getMaterial(mat("ivory"))}>
          <boxGeometry args={[0.72, 0.012, 0.018]} />
        </mesh>
      ))}
      {granite && Array.from({ length: 18 }).map((_, index) => (
        <mesh key={index} position={[-1.2 + (index % 6) * 0.48, 0.445, -0.46 + Math.floor(index / 6) * 0.36]} material={getMaterial(mat(index % 2 ? "stone" : "metal"))}>
          <sphereGeometry args={[0.025, 8, 8]} />
        </mesh>
      ))}
      {wood && Array.from({ length: 7 }).map((_, index) => (
        <mesh key={index} position={[-1.25 + index * 0.42, 0.445, 0]} material={getMaterial(mat("oak"))}>
          <boxGeometry args={[0.025, 0.012, 1.34]} />
        </mesh>
      ))}
      <Annotation visible={annotations} position={[0, 0.9, -0.82]}>{variant.attributes.Type} surface</Annotation>
      <Annotation visible={annotations} position={[1.25, 0.12, 0.82]}>edge profile</Annotation>
    </group>
  );
}

function BathSystem({ variant, mode, annotations }) {
  const shower = variant.id.includes("shower") || variant.id.includes("glass") || variant.id.includes("combo");
  const tub = variant.id.includes("tub") || variant.id.includes("combo");
  const glassOff = mode.includes("Glass off");
  const doorOpen = mode.includes("Door open") ? 0.86 : 0;
  const footprint = mode.includes("Footprint");
  const explode = mode.includes("Exploded") ? 0.28 : 0;

  return (
    <group>
      <mesh position={[0, -0.38, 0]} material={getMaterial(mat("stone"))} receiveShadow>
        <boxGeometry args={[3, 0.08, 2.05]} />
      </mesh>
      {shower && (
        <group>
          <RoundedBox args={[1.42, 0.12, 1.1]} radius={0.035} smoothness={4} position={[-0.45, -0.27 + explode, 0]} material={getMaterial(mat("ivory"))} />
          {!glassOff && <mesh position={[0.36 + explode, 0.48, 0.5]} material={getMaterial(mat("glass"))}><boxGeometry args={[0.06, 1.62, 1.06]} /></mesh>}
          {!glassOff && <group position={[-0.36, 0.48, 0.5]} rotation={[0, -doorOpen, 0]}><mesh position={[0.34, 0, 0]} material={getMaterial(mat("glass"))}><boxGeometry args={[0.62, 1.55, 0.05]} /></mesh></group>}
          <mesh position={[-0.45, 0.18, -0.52]} material={getMaterial(mat("tile"))}><boxGeometry args={[1.48, 1.28, 0.08]} /></mesh>
          <mesh position={[-0.92, 0.32, -0.46]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.055, 0.055, 0.18, 20]} /></mesh>
          <mesh position={[-0.45, -0.18, 0.15]} material={getMaterial(mat("metal"))}><boxGeometry args={[0.55, 0.025, 0.045]} /></mesh>
        </group>
      )}
      {tub && (
        <group position={[shower ? 0.82 : 0, 0, 0]}>
          <mesh position={[0, -0.05 + explode, 0]} scale={[1.28, 0.42, 0.58]} material={getMaterial(mat("ivory"))} castShadow>
            <sphereGeometry args={[0.82, 48, 18]} />
          </mesh>
          <mesh position={[0, 0.12 + explode, 0]} scale={[1.05, 0.2, 0.38]} material={getMaterial(mat("charcoal"))}>
            <sphereGeometry args={[0.68, 40, 14]} />
          </mesh>
          <mesh position={[0.76, 0.36, -0.2]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.025, 0.025, 0.62, 18]} /></mesh>
        </group>
      )}
      {footprint && <mesh position={[0, -0.31, 0]} material={getMaterial({ ...mat("water"), opacity: 0.24 })}><boxGeometry args={[2.62, 0.015, 1.64]} /></mesh>}
      <Annotation visible={annotations} position={[0.55, 1.44, 0.74]}>{shower ? "glass enclosure" : "freestanding form"}</Annotation>
      <Annotation visible={annotations} position={[-0.52, -0.05, -0.64]}>drain / waterproofing zone</Annotation>
    </group>
  );
}

function ToiletSystem({ variant, mode, annotations }) {
  const square = variant.id === "square-modern";
  const bidet = variant.id.includes("bidet") || variant.id === "square-modern";
  const electric = variant.id === "electric-bidet";
  const openSeat = mode.includes("Seat") || mode.includes("Lid") || mode.includes("Bidet");
  const openLid = mode.includes("Lid") ? 1.25 : openSeat ? 0.65 : 0;
  const explode = mode.includes("Exploded") ? 0.25 : 0;

  return (
    <group>
      <RoundedBox args={square ? [1.06, 0.34, 1.16] : [0.98, 0.3, 1.18]} radius={square ? 0.04 : 0.22} smoothness={10} position={[0, 0.1, 0.18 + explode]} material={getMaterial(mat("ivory"))} castShadow />
      <mesh position={[0, 0.17, 0.18 + explode]} scale={[square ? 0.48 : 0.42, 0.06, variant.id.includes("round") ? 0.42 : 0.58]} material={getMaterial(mat("charcoal"))}>
        <sphereGeometry args={[1, 40, 12]} />
      </mesh>
      <RoundedBox args={[0.9, 0.72, 0.28]} radius={0.045} smoothness={5} position={[0, 0.78 + explode, -0.54]} material={getMaterial(mat("ivory"))} castShadow />
      <RoundedBox args={[0.74, 0.1, 0.94]} radius={square ? 0.025 : 0.16} smoothness={8} position={[0, 0.38 + explode, 0.14]} rotation={[openSeat, 0, 0]} material={getMaterial(electric ? mat("charcoal") : mat("ivory"))} castShadow />
      <RoundedBox args={[0.78, 0.08, 0.98]} radius={square ? 0.025 : 0.16} smoothness={8} position={[0, 0.45 + explode, 0.1]} rotation={[openLid, 0, 0]} material={getMaterial(mat("ivory"))} castShadow />
      {bidet && <mesh position={[0, 0.21, 0.7]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.025, 0.025, 0.38, 18]} /></mesh>}
      {electric && <RoundedBox args={[0.15, 0.1, 0.42]} radius={0.025} smoothness={4} position={[0.58, 0.38, 0.06]} material={getMaterial(mat("blackGlass"))} />}
      {electric && <mesh position={[0.62, 0.16, -0.72]} material={getMaterial(mat("metal"))}><boxGeometry args={[0.035, 0.035, 0.46]} /></mesh>}
      {mode.includes("Footprint") && <mesh position={[0, -0.08, 0]} material={getMaterial({ ...mat("water"), opacity: 0.24 })}><boxGeometry args={[1.22, 0.014, 1.58]} /></mesh>}
      <Annotation visible={annotations} position={[0.86, 0.72, 0.2]}>{bidet ? "bidet hardware" : "standard seat"}</Annotation>
      <Annotation visible={annotations} position={[-0.72, 1.26, -0.55]}>tank form</Annotation>
    </group>
  );
}

function CategoryModel(props) {
  const map = {
    cabinets: CabinetSystem,
    hinges: HingeSystem,
    cooktops: CooktopSystem,
    flooring: FlooringSystem,
    countertops: CountertopSystem,
    bath: BathSystem,
    toilets: ToiletSystem
  };
  const Model = map[props.category.id] || CabinetSystem;
  return <Model {...props} />;
}

export default function ExplorerScene({ category, variant, compareVariant, compare, mode, annotations, powered, motion, lightPreset, cameraPreset }) {
  return (
    <>
      <SceneLighting preset={lightPreset} />
      <CameraDirector preset={cameraPreset} />
      <group position={[0, -0.15, 0]} rotation={[0, compare ? 0 : -0.18, 0]}>
        <ModelFrame label={variant.name} offset={compare ? -1.55 : 0} compare={compare}>
          <CategoryModel category={category} variant={variant} mode={mode} annotations={annotations} powered={powered} motion={motion} />
        </ModelFrame>
        {compare && (
          <ModelFrame label={compareVariant.name} offset={1.55} compare>
            <CategoryModel category={category} variant={compareVariant} mode={mode} annotations={annotations} powered={powered} motion={motion} />
          </ModelFrame>
        )}
      </group>
      <mesh position={[0, -0.82, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.4, 96]} />
        <meshStandardMaterial color="#06090f" roughness={0.52} metalness={0.04} />
      </mesh>
      <ContactShadows position={[0, -0.79, 0]} opacity={0.38} scale={7} blur={2.2} far={3.2} />
    </>
  );
}
