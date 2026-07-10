import { Environment, Html, RoundedBox, ContactShadows } from "@react-three/drei";
import { CanvasTexture, MeshPhysicalMaterial, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace } from "three";

const materialLibrary = {
  navy: { color: "#0b1a2e", roughness: 0.48, metalness: 0.05, clearcoat: 0.16, clearcoatRoughness: 0.42 },
  ivory: { color: "#ece7dc", roughness: 0.38, metalness: 0.02, clearcoat: 0.28, clearcoatRoughness: 0.22 },
  walnut: { color: "#7a5132", roughness: 0.56, metalness: 0.02, sheen: 0.16, sheenRoughness: 0.62 },
  oak: { color: "#b98b58", roughness: 0.5, metalness: 0.02, sheen: 0.18, sheenRoughness: 0.58 },
  stone: { color: "#d8d2c8", roughness: 0.24, metalness: 0.03, clearcoat: 0.26, clearcoatRoughness: 0.18 },
  tile: { color: "#b7bdc5", roughness: 0.5, metalness: 0.02, clearcoat: 0.18, clearcoatRoughness: 0.28 },
  charcoal: { color: "#111820", roughness: 0.32, metalness: 0.08, clearcoat: 0.22, clearcoatRoughness: 0.26 },
  metal: { color: "#a8abb0", roughness: 0.2, metalness: 0.84 },
  brass: { color: "#caa65b", roughness: 0.22, metalness: 0.74, clearcoat: 0.16, clearcoatRoughness: 0.18 },
  glass: { color: "#b9d5e8", roughness: 0.02, metalness: 0, transmission: 0.48, transparent: true, opacity: 0.32, clearcoat: 0.42, clearcoatRoughness: 0.03 },
  water: { color: "#8ec7ff", roughness: 0.08, metalness: 0, transparent: true, opacity: 0.5 },
  blackGlass: { color: "#06080b", roughness: 0.12, metalness: 0.12, clearcoat: 0.72, clearcoatRoughness: 0.08 },
  glow: { color: "#ff7b3d", roughness: 0.2, metalness: 0, emissive: "#ff5f24", emissiveIntensity: 1.4 }
};

const materialCache = new Map();
const textureCache = new Map();

function createTexture(cacheKey, draw, repeat = [1, 1]) {
  if (typeof document === "undefined") return null;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;
  draw(context, canvas);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(...repeat);
  texture.colorSpace = SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

function woodTexture(kind) {
  const palettes = {
    walnut: ["#5c351f", "#8a5a37", "#c18a5f", "#3f2517"],
    oak: ["#a76f38", "#d0a16b", "#f0c98f", "#72451f"]
  };
  const colors = palettes[kind] || palettes.oak;
  return createTexture(`wood-${kind}`, (context, canvas) => {
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.45, colors[1]);
    gradient.addColorStop(0.7, colors[2]);
    gradient.addColorStop(1, colors[0]);
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width; x += 8) {
      const wave = Math.sin(x * 0.035) * 14 + Math.sin(x * 0.011) * 22;
      context.strokeStyle = x % 24 === 0 ? "rgba(45,25,12,0.32)" : "rgba(255,230,180,0.1)";
      context.lineWidth = x % 24 === 0 ? 2 : 1;
      context.beginPath();
      context.moveTo(x + wave, 0);
      for (let y = 0; y <= canvas.height; y += 18) {
        context.lineTo(x + Math.sin(y * 0.045 + x * 0.015) * 18 + wave, y);
      }
      context.stroke();
    }

    for (let index = 0; index < 9; index += 1) {
      const x = 45 + index * 50;
      const y = 36 + (index % 3) * 48;
      context.strokeStyle = "rgba(53,27,12,0.24)";
      context.lineWidth = 2;
      context.beginPath();
      context.ellipse(x, y, 28, 9, index * 0.35, 0, Math.PI * 2);
      context.stroke();
    }
  }, [2.8, 1.4]);
}

function speckleTexture(cacheKey, base, flecks) {
  return createTexture(cacheKey, (context, canvas) => {
    context.fillStyle = base;
    context.fillRect(0, 0, canvas.width, canvas.height);
    flecks.forEach((color, colorIndex) => {
      context.fillStyle = color;
      for (let index = 0; index < 90; index += 1) {
        const x = (index * 71 + colorIndex * 43) % canvas.width;
        const y = (index * 37 + colorIndex * 59) % canvas.height;
        const radius = 1 + ((index + colorIndex) % 4);
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
    });
  }, [2, 1]);
}

function materialOptions(name) {
  const base = mat(name);
  if (name === "walnut" || name === "oak") {
    return { ...base, map: woodTexture(name), cacheKey: `material-${name}-grain` };
  }
  if (name === "stone") {
    return { ...base, map: speckleTexture("stone-soft-speckle", "#d8d2c8", ["rgba(255,255,255,.25)", "rgba(95,91,82,.18)", "rgba(19,25,32,.08)"]), cacheKey: "material-stone-speckle" };
  }
  return base;
}

function getMaterial(options) {
  const { cacheKey, ...materialConfig } = options;
  const key = cacheKey || JSON.stringify(materialConfig, (name, value) => (name === "map" && value ? value.uuid : value));
  if (!materialCache.has(key)) {
    const Material = materialConfig.transmission || materialConfig.clearcoat || materialConfig.sheen ? MeshPhysicalMaterial : MeshStandardMaterial;
    materialCache.set(key, new Material(materialConfig));
  }
  return materialCache.get(key);
}

function mat(name) {
  return materialLibrary[name];
}

function Screw({ position, rotation = [Math.PI / 2, 0, 0], scale = 1, material = getMaterial(mat("metal")) }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh material={material} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.014, 24]} />
      </mesh>
      <mesh position={[0, 0, 0.009]} material={getMaterial(mat("charcoal"))}>
        <boxGeometry args={[0.058, 0.007, 0.006]} />
      </mesh>
    </group>
  );
}

function ThinLine({ position, rotation = [0, 0, 0], args = [1, 0.01, 0.01], material = getMaterial(mat("metal")) }) {
  return (
    <mesh position={position} rotation={rotation} material={material}>
      <boxGeometry args={args} />
    </mesh>
  );
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

function CabinetDoorSkin({ euro, x = 0.5 }) {
  const trimMaterial = getMaterial(euro ? mat("metal") : materialOptions("oak"));
  return (
    <group>
      {euro ? (
        <>
          <ThinLine position={[x, 0.56, 0.052]} args={[0.7, 0.022, 0.018]} material={trimMaterial} />
          <ThinLine position={[x, -0.56, 0.052]} args={[0.7, 0.012, 0.014]} material={getMaterial(mat("charcoal"))} />
        </>
      ) : (
        <>
          <ThinLine position={[x, 0.58, 0.052]} args={[0.82, 0.05, 0.018]} material={trimMaterial} />
          <ThinLine position={[x, -0.58, 0.052]} args={[0.82, 0.05, 0.018]} material={trimMaterial} />
          <ThinLine position={[x - 0.37, 0, 0.052]} args={[0.052, 1.16, 0.018]} material={trimMaterial} />
          <ThinLine position={[x + 0.37, 0, 0.052]} args={[0.052, 1.16, 0.018]} material={trimMaterial} />
          <ThinLine position={[x, 0, 0.056]} args={[0.54, 0.02, 0.014]} material={getMaterial({ ...mat("charcoal"), transparent: true, opacity: 0.28, cacheKey: "shadow-reveal" })} />
        </>
      )}
    </group>
  );
}

function CabinetSystem({ variant, mode, motion, annotations }) {
  const isEuro = variant.id === "european";
  const open = mode.includes("Open doors") ? motion : mode.includes("Cutaway") || mode.includes("Exploded") ? 0.82 : 0;
  const drawers = mode.includes("Open drawers") ? motion : mode.includes("Exploded") ? 0.72 : 0;
  const explode = mode.includes("Exploded") ? 1 : 0;
  const cutaway = mode.includes("Cutaway");
  const doorMaterial = getMaterial(isEuro ? mat("ivory") : materialOptions("walnut"));

  return (
    <group>
      <RoundedBox args={[2.25, 1.65, 0.82]} radius={0.025} smoothness={4} position={[0, 0.45, -0.08]} material={getMaterial(mat("navy"))} castShadow receiveShadow />
      <mesh position={[0, 0.48, -0.52]} material={getMaterial(mat("charcoal"))} receiveShadow>
        <boxGeometry args={[2.04, 1.36, 0.04]} />
      </mesh>
      <mesh position={[-1.16, 0.43, -0.08]} material={getMaterial(mat("navy"))} castShadow>
        <boxGeometry args={[0.055, 1.58, 0.86]} />
      </mesh>
      <mesh position={[1.16, 0.43, -0.08]} material={getMaterial(mat("navy"))} castShadow>
        <boxGeometry args={[0.055, 1.58, 0.86]} />
      </mesh>
      {[0.14, 0.46, 0.78].map((y) => (
        <group key={y}>
          <Screw position={[-1.08, y, 0.34]} scale={0.42} />
          <Screw position={[1.08, y, 0.34]} scale={0.42} />
        </group>
      ))}
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
        <RoundedBox position={[0.5, 0, 0]} args={[0.96, 1.42, 0.07]} radius={isEuro ? 0.018 : 0.035} smoothness={5} material={doorMaterial} castShadow />
        <CabinetDoorSkin euro={isEuro} x={0.5} />
        <mesh position={[0.5, 0, -0.065]} material={getMaterial(mat("stone"))}>
          <boxGeometry args={[0.78, 1.18, 0.018]} />
        </mesh>
      </group>
      <group position={[1.08 + explode * 0.28, 0.55, 0.42 + explode * 0.24]} rotation={[0, open * 1.25, 0]}>
        <RoundedBox position={[-0.5, 0, 0]} args={[0.96, 1.42, 0.07]} radius={isEuro ? 0.018 : 0.035} smoothness={5} material={doorMaterial} castShadow />
        <CabinetDoorSkin euro={isEuro} x={-0.5} />
        <mesh position={[-0.5, 0, -0.065]} material={getMaterial(mat("stone"))}>
          <boxGeometry args={[0.78, 1.18, 0.018]} />
        </mesh>
      </group>
      {[0.1, -0.28].map((y, index) => (
        <group key={y} position={[0, y + 0.74, 0.58 + drawers * (0.38 + index * 0.18) + explode * 0.4]}>
          <RoundedBox args={[1.72, 0.26, 0.52]} radius={0.022} smoothness={4} material={doorMaterial} castShadow />
          <mesh position={[0, -0.03, -0.02]} material={getMaterial(mat("stone"))}>
            <boxGeometry args={[1.48, 0.16, 0.42]} />
          </mesh>
          <ThinLine position={[-0.78, -0.02, 0.04]} args={[0.035, 0.18, 0.48]} material={getMaterial(mat("charcoal"))} />
          <ThinLine position={[0.78, -0.02, 0.04]} args={[0.035, 0.18, 0.48]} material={getMaterial(mat("charcoal"))} />
          <mesh position={[0, 0, 0.29]} material={getMaterial(mat("metal"))}><boxGeometry args={[0.86, 0.035, 0.035]} /></mesh>
        </group>
      ))}
      {[-0.44, 0.06, 0.56].map((y) => (
        <mesh key={y} position={[0, y + 0.42, cutaway ? 0.15 : 0.02]} material={getMaterial(mat("stone"))} castShadow>
          <boxGeometry args={[1.88, 0.035, 0.66]} />
        </mesh>
      ))}
      <mesh position={[0, -0.46, 0.12]} material={getMaterial(mat("charcoal"))}><boxGeometry args={[1.78, 0.22, 0.54]} /></mesh>
      <ThinLine position={[0, -0.33, 0.43]} args={[1.58, 0.018, 0.018]} material={getMaterial(mat("metal"))} />
      {[-1.22, 1.22].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.92, 0.46]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("metal"))}>
            <cylinderGeometry args={[0.035, 0.035, 0.16, 20]} />
          </mesh>
          <mesh position={[x, 0.25, 0.46]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("metal"))}>
            <cylinderGeometry args={[0.035, 0.035, 0.16, 20]} />
          </mesh>
        </group>
      ))}
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
              <Screw position={[-0.21, 0.06, 0.026]} scale={0.46} material={getMaterial(mat("brass"))} />
              <Screw position={[-0.21, -0.06, 0.026]} scale={0.46} material={getMaterial(mat("brass"))} />
              <Screw position={[0.21, 0.06, 0.026]} scale={0.46} material={getMaterial(mat("brass"))} />
              <Screw position={[0.21, -0.06, 0.026]} scale={0.46} material={getMaterial(mat("brass"))} />
            </>
          ) : (
            <>
              <mesh position={[-0.12 - explode, 0, 0]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.12, 0.12, 0.055, 36]} /></mesh>
              <mesh position={[-0.12 - explode, 0, 0.035]} material={getMaterial(mat("charcoal"))}><torusGeometry args={[0.125, 0.008, 8, 36]} /></mesh>
              <mesh position={[0.14 + explode, 0, 0]} material={getMaterial(mat("metal"))}><boxGeometry args={[0.32, 0.19, 0.045]} /></mesh>
              <mesh position={[0.02, 0, 0.08]} material={getMaterial(variant.id.includes("soft") ? mat("charcoal") : mat("metal"))}><boxGeometry args={[0.34, 0.055, 0.055]} /></mesh>
              <mesh position={[0.02, 0.045, 0.135]} rotation={[0, 0, Math.PI / 2]} material={getMaterial(mat("metal"))}>
                <cylinderGeometry args={[0.018, 0.018, 0.34, 18]} />
              </mesh>
              {variant.id.includes("soft") && (
                <mesh position={[0.24 + explode, -0.065, 0.075]} rotation={[0, 0, Math.PI / 2]} material={getMaterial(mat("charcoal"))}>
                  <cylinderGeometry args={[0.028, 0.028, 0.18, 18]} />
                </mesh>
              )}
              {wide && (
                <>
                  <mesh position={[0.05, -0.06, 0.15]} rotation={[0, 0, -0.55]} material={getMaterial(mat("metal"))}>
                    <boxGeometry args={[0.44, 0.026, 0.034]} />
                  </mesh>
                  <mesh position={[0.16, 0.065, 0.15]} rotation={[0, 0, 0.48]} material={getMaterial(mat("metal"))}>
                    <boxGeometry args={[0.38, 0.026, 0.034]} />
                  </mesh>
                </>
              )}
              <Screw position={[-0.12 - explode, 0.055, 0.04]} scale={0.42} />
              <Screw position={[-0.12 - explode, -0.055, 0.04]} scale={0.42} />
              <Screw position={[0.24 + explode, 0.05, 0.04]} scale={0.38} />
              <Screw position={[0.24 + explode, -0.05, 0.04]} scale={0.38} />
            </>
          )}
        </group>
      ))}
      {variant.id.includes("overlay") && (
        <mesh position={[0.64, 0.42, 0.34]} material={getMaterial({ ...mat("water"), opacity: 0.18, cacheKey: "overlay-clearance-tint" })}>
          <boxGeometry args={[0.42, 1.48, 0.025]} />
        </mesh>
      )}
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
      <RoundedBox args={[2.36, 0.035, 1.34]} radius={0.045} smoothness={4} position={[0, 0.33, 0]} material={getMaterial(mat("charcoal"))} receiveShadow />
      <RoundedBox args={[2.18, 0.1, 1.16]} radius={0.035} smoothness={6} position={[0, 0.35, 0]} material={getMaterial(gas ? mat("charcoal") : mat("blackGlass"))} castShadow />
      {cutaway && (
        <>
          <mesh position={[0, -0.08, 0]} material={getMaterial(mat("metal"))}><boxGeometry args={[2.04, 0.38, 1.02]} /></mesh>
          <mesh position={[0, -0.34, 0]} material={getMaterial(mat("charcoal"))}><boxGeometry args={[1.82, 0.12, 0.82]} /></mesh>
          <ThinLine position={[-1.08, -0.12, 0]} args={[0.04, 0.34, 0.96]} />
          <ThinLine position={[1.08, -0.12, 0]} args={[0.04, 0.34, 0.96]} />
        </>
      )}
      {gas ? (
        <group>
          {[[-0.62, -0.28], [0.62, -0.28], [-0.62, 0.28], [0.62, 0.28]].map(([x, z]) => (
            <group key={`${x}-${z}`} position={[x, 0.46, z]}>
              <mesh material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.19, 0.19, 0.06, 40]} /></mesh>
              <mesh position={[0, 0.055, 0]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("charcoal"))}><torusGeometry args={[0.24, 0.018, 8, 32]} /></mesh>
              <mesh position={[0, 0.092, 0]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.09, 0.12, 0.035, 32]} /></mesh>
              <mesh position={[0, 0.13, 0]} rotation={[0, 0, Math.PI / 4]} material={getMaterial(mat("charcoal"))}><boxGeometry args={[0.52, 0.025, 0.055]} /></mesh>
              <mesh position={[0, 0.13, 0]} rotation={[0, 0, -Math.PI / 4]} material={getMaterial(mat("charcoal"))}><boxGeometry args={[0.52, 0.025, 0.055]} /></mesh>
              {on && <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("glow"))}><torusGeometry args={[0.16, 0.012, 8, 42]} /></mesh>}
              {on && <pointLight position={[0, 0.2, 0]} intensity={0.24} color="#ff7b3d" distance={0.9} />}
            </group>
          ))}
          {[-0.34, 0, 0.34].map((x) => (
            <group key={x} position={[x, 0.48, 0.66]}>
              <mesh material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.055, 0.055, 0.08, 20]} /></mesh>
              <ThinLine position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} args={[0.1, 0.01, 0.01]} material={getMaterial(mat("charcoal"))} />
            </group>
          ))}
        </group>
      ) : (
        <group>
          {[[-0.58, -0.25, 0.28], [0.55, -0.22, 0.22], [-0.46, 0.34, 0.18], [0.54, 0.34, 0.26]].map(([x, z, r]) => (
            <group key={`${x}-${z}`} position={[x, 0.415, z]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} material={getMaterial(on ? mat("glow") : mat("metal"))}>
                <torusGeometry args={[r, 0.012, 8, 64]} />
              </mesh>
              {!electric && <mesh rotation={[-Math.PI / 2, 0, 0]} material={getMaterial({ ...mat("water"), opacity: 0.16, cacheKey: "cool-induction-zone" })}><circleGeometry args={[r * 0.76, 48]} /></mesh>}
            </group>
          ))}
          {[-0.24, 0, 0.24].map((x) => (
            <mesh key={x} position={[x, 0.43, 0.59]} material={getMaterial(on ? mat("glow") : mat("metal"))}>
              <boxGeometry args={[0.08, 0.01, 0.018]} />
            </mesh>
          ))}
          <mesh position={[0.58, 0.43, 0.58]} material={getMaterial(on ? mat("glow") : mat("metal"))}>
            <boxGeometry args={[0.22, 0.01, 0.018]} />
          </mesh>
          {electric && on && <pointLight position={[0, 0.74, 0]} intensity={0.75} color="#ff6d3d" distance={2.3} />}
        </group>
      )}
      <ThinLine position={[0, 0.5, -0.66]} args={[2.02, 0.014, 0.014]} material={getMaterial(mat("metal"))} />
      <ThinLine position={[0, 0.5, 0.66]} args={[2.02, 0.014, 0.014]} material={getMaterial(mat("metal"))} />
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
  const plankMaterial = getMaterial(materialOptions(materialName));

  return (
    <group rotation={[0, -0.22, 0]}>
      {Array.from({ length: room ? 18 : 6 }).map((_, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const position = [(col - 1) * 0.92 + (row % 2) * 0.25, cross ? 0.12 + row * 0.06 : 0, (row - 2) * 0.55];
        return (
          <group key={index} position={position}>
            <RoundedBox
              args={[0.9, 0.08, 2.15]}
              radius={0.012}
              smoothness={2}
              material={plankMaterial}
              castShadow
              receiveShadow
            />
            <ThinLine position={[-0.455, 0.047, 0]} args={[0.012, 0.012, 2.08]} material={getMaterial(mat("charcoal"))} />
            <ThinLine position={[0.455, 0.047, 0]} args={[0.012, 0.012, 2.08]} material={getMaterial(mat("charcoal"))} />
            {[-0.55, 0, 0.55].map((z, lineIndex) => (
              <ThinLine key={z} position={[-0.02 + lineIndex * 0.04, 0.052, z]} args={[0.74, 0.007, 0.012]} material={getMaterial({ ...mat(lineIndex % 2 ? "oak" : "charcoal"), transparent: true, opacity: 0.34, cacheKey: `floor-grain-${lineIndex}-${materialName}` })} />
            ))}
          </group>
        );
      })}
      {cross && Array.from({ length: layers }).map((_, index) => (
        <group key={index} position={[1.65, -0.18 + index * 0.12, 0]}>
          <mesh material={getMaterial(index === layers - 1 ? materialOptions(materialName) : mat(index % 2 ? "charcoal" : "stone"))}>
            <boxGeometry args={[0.78, 0.08, 1.9]} />
          </mesh>
          <ThinLine position={[0, 0.048, 0]} args={[0.82, 0.012, 1.92]} material={getMaterial(mat("metal"))} />
        </group>
      ))}
      {cross && (
        <mesh position={[1.65, -0.46, 0]} material={getMaterial(mat("water"))}>
          <boxGeometry args={[0.86, 0.045, 1.94]} />
        </mesh>
      )}
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
  const quartz = variant.id === "quartz";
  const waterfall = mode.includes("Waterfall");
  const cutaway = mode.includes("Cutaway");
  const materialName = wood ? "walnut" : variant.id === "laminate" ? "ivory" : variant.id === "solid-surface" ? "stone" : "charcoal";
  const surfaceMaterial = getMaterial(
    wood
      ? materialOptions("walnut")
      : granite
        ? { ...mat("charcoal"), map: speckleTexture("granite-deep-speckle", "#151a1f", ["rgba(255,255,255,.22)", "rgba(130,128,120,.3)", "rgba(21,87,217,.08)"]), cacheKey: "countertop-granite" }
        : marble
          ? { ...mat("ivory"), roughness: 0.18, clearcoat: 0.5, clearcoatRoughness: 0.08, cacheKey: "countertop-marble-physical" }
          : quartz
            ? { ...mat("stone"), roughness: 0.2, clearcoat: 0.44, clearcoatRoughness: 0.1, cacheKey: "countertop-quartz-polished" }
            : materialOptions(materialName)
  );

  return (
    <group>
      <RoundedBox args={[3, cutaway ? 0.34 : 0.22, 1.48]} radius={variant.id === "porcelain" ? 0.018 : 0.045} smoothness={5} position={[0, 0.32, 0]} material={surfaceMaterial} castShadow receiveShadow />
      <RoundedBox args={[3.05, 0.16, 0.08]} radius={0.02} smoothness={4} position={[0, 0.53, -0.78]} material={surfaceMaterial} castShadow />
      <ThinLine position={[0, 0.18, 0.77]} args={[2.86, 0.04, 0.035]} material={getMaterial(mat("charcoal"))} />
      {waterfall && <RoundedBox args={[0.2, 1.18, 1.48]} radius={0.035} smoothness={4} position={[1.4, -0.28, 0]} material={surfaceMaterial} castShadow />}
      {mode.includes("Installation") && (
        <>
          <RoundedBox args={[1.02, 0.16, 0.55]} radius={0.06} smoothness={8} position={[-0.55, 0.49, 0.1]} material={getMaterial(mat("ivory"))} />
          <RoundedBox args={[1.14, 0.035, 0.66]} radius={0.055} smoothness={8} position={[-0.55, 0.505, 0.1]} material={getMaterial(mat("charcoal"))} />
          <RoundedBox args={[0.64, 0.1, 0.5]} radius={0.035} smoothness={4} position={[0.72, 0.51, -0.05]} material={getMaterial(mat("blackGlass"))} />
          <RoundedBox args={[0.78, 0.035, 0.62]} radius={0.035} smoothness={4} position={[0.72, 0.515, -0.05]} material={getMaterial(mat("charcoal"))} />
        </>
      )}
      {mode.includes("Edge") && <mesh position={[0, 0.13, 0.79]} material={getMaterial(mat("metal"))}><boxGeometry args={[2.8, 0.04, 0.035]} /></mesh>}
      {(marble || quartz) && [[-0.8, 0.18, 0.72], [-0.2, -0.12, 1.04], [0.45, 0.22, 0.62], [0.86, -0.24, 0.88], [-0.58, -0.42, 0.54]].map(([x, z, width], index) => (
        <mesh key={index} position={[x, 0.445, z]} rotation={[0, 0.35 + index * 0.24, 0]} material={getMaterial(marble ? mat("charcoal") : mat("ivory"))}>
          <boxGeometry args={[width, 0.014, index % 2 ? 0.012 : 0.02]} />
        </mesh>
      ))}
      {(granite || quartz) && Array.from({ length: granite ? 28 : 18 }).map((_, index) => (
        <mesh key={index} position={[-1.2 + (index % 6) * 0.48, 0.445, -0.46 + Math.floor(index / 6) * 0.36]} material={getMaterial(mat(index % 2 ? "stone" : "metal"))}>
          <sphereGeometry args={[granite ? 0.025 : 0.014, 8, 8]} />
        </mesh>
      ))}
      {wood && Array.from({ length: 7 }).map((_, index) => (
        <mesh key={index} position={[-1.25 + index * 0.42, 0.445, 0]} material={getMaterial(mat("oak"))}>
          <boxGeometry args={[0.025, 0.012, 1.34]} />
        </mesh>
      ))}
      {variant.id === "laminate" && <ThinLine position={[0, 0.445, 0.72]} args={[2.9, 0.018, 0.018]} material={getMaterial(mat("oak"))} />}
      {variant.id === "porcelain" && <ThinLine position={[0, 0.455, -0.71]} args={[2.82, 0.012, 0.014]} material={getMaterial(mat("ivory"))} />}
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
          {!glassOff && (
            <>
              <mesh position={[0.36 + explode, 0.48, 0.5]} material={getMaterial(mat("glass"))}><boxGeometry args={[0.06, 1.62, 1.06]} /></mesh>
              {[0.02, 0.94].map((z) => <ThinLine key={z} position={[0.4 + explode, 1.23, z]} args={[0.08, 0.04, 0.08]} material={getMaterial(mat("metal"))} />)}
            </>
          )}
          {!glassOff && (
            <group position={[-0.36, 0.48, 0.5]} rotation={[0, -doorOpen, 0]}>
              <mesh position={[0.34, 0, 0]} material={getMaterial(mat("glass"))}><boxGeometry args={[0.62, 1.55, 0.05]} /></mesh>
              <ThinLine position={[0.63, 0.08, 0.045]} args={[0.035, 0.72, 0.035]} material={getMaterial(mat("metal"))} />
            </group>
          )}
          <mesh position={[-0.45, 0.18, -0.52]} material={getMaterial(mat("tile"))}><boxGeometry args={[1.48, 1.28, 0.08]} /></mesh>
          {[-0.98, -0.72, -0.46, -0.2, 0.06].map((x) => <ThinLine key={x} position={[x, 0.18, -0.47]} args={[0.012, 1.24, 0.012]} material={getMaterial(mat("stone"))} />)}
          {[-0.26, 0.04, 0.34, 0.64].map((y) => <ThinLine key={y} position={[-0.45, y, -0.465]} args={[1.42, 0.012, 0.012]} material={getMaterial(mat("stone"))} />)}
          <RoundedBox args={[0.34, 0.26, 0.07]} radius={0.02} smoothness={4} position={[-0.16, 0.34, -0.46]} material={getMaterial(mat("charcoal"))} />
          <RoundedBox args={[0.42, 0.18, 0.36]} radius={0.025} smoothness={4} position={[-0.95, -0.08, 0.08]} material={getMaterial(mat("stone"))} />
          <mesh position={[-0.92, 0.32, -0.46]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.055, 0.055, 0.18, 20]} /></mesh>
          <mesh position={[-0.92, 0.5, -0.4]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.15, 0.15, 0.04, 32]} /></mesh>
          <mesh position={[-0.72, 0.12, -0.46]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.035, 0.035, 0.08, 18]} /></mesh>
          <mesh position={[-0.58, 0.12, -0.46]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.035, 0.035, 0.08, 18]} /></mesh>
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
          <mesh position={[0.42, 0.12 + explode, 0.46]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("metal"))}><torusGeometry args={[0.055, 0.01, 10, 28]} /></mesh>
          <mesh position={[0.74, 0.06 + explode, -0.36]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.045, 0.045, 0.02, 28]} /></mesh>
          <mesh position={[0.76, 0.36, -0.2]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.025, 0.025, 0.62, 18]} /></mesh>
          <mesh position={[0.76, 0.68, -0.07]} rotation={[0, 0, Math.PI / 2]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.022, 0.022, 0.28, 18]} /></mesh>
          <mesh position={[0.62, 0.39, -0.2]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.032, 0.032, 0.08, 18]} /></mesh>
          <mesh position={[0.9, 0.39, -0.2]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.032, 0.032, 0.08, 18]} /></mesh>
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
      <RoundedBox args={[0.96, 0.06, 0.32]} radius={0.025} smoothness={4} position={[0, 1.17 + explode, -0.54]} material={getMaterial(mat("ivory"))} castShadow />
      <mesh position={[square ? 0.32 : -0.32, 1.23 + explode, -0.42]} material={getMaterial(mat("metal"))}>
        <cylinderGeometry args={[0.055, 0.055, 0.025, 24]} />
      </mesh>
      <RoundedBox args={[0.74, 0.1, 0.94]} radius={square ? 0.025 : 0.16} smoothness={8} position={[0, 0.38 + explode, 0.14]} rotation={[openSeat, 0, 0]} material={getMaterial(electric ? mat("charcoal") : mat("ivory"))} castShadow />
      <RoundedBox args={[0.78, 0.08, 0.98]} radius={square ? 0.025 : 0.16} smoothness={8} position={[0, 0.45 + explode, 0.1]} rotation={[openLid, 0, 0]} material={getMaterial(mat("ivory"))} castShadow />
      <RoundedBox args={[0.46, 0.52, 0.44]} radius={square ? 0.035 : 0.12} smoothness={6} position={[0, -0.18, -0.18]} material={getMaterial(mat("ivory"))} castShadow />
      <mesh position={[-0.28, -0.05, 0.74]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.04, 0.04, 0.035, 18]} /></mesh>
      <mesh position={[0.28, -0.05, 0.74]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.04, 0.04, 0.035, 18]} /></mesh>
      <Screw position={[-0.25, 0.42 + explode, -0.3]} scale={0.5} />
      <Screw position={[0.25, 0.42 + explode, -0.3]} scale={0.5} />
      <mesh position={[-0.25, 0.31 + explode, 0.47]} material={getMaterial(mat("stone"))}><boxGeometry args={[0.12, 0.035, 0.045]} /></mesh>
      <mesh position={[0.25, 0.31 + explode, 0.47]} material={getMaterial(mat("stone"))}><boxGeometry args={[0.12, 0.035, 0.045]} /></mesh>
      {bidet && (
        <>
          <mesh position={[0, 0.21, 0.7]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.025, 0.025, 0.38, 18]} /></mesh>
          <RoundedBox args={[0.22, 0.06, 0.12]} radius={0.02} smoothness={4} position={[0, 0.24, 0.48]} material={getMaterial(mat("ivory"))} />
        </>
      )}
      {electric && <RoundedBox args={[0.15, 0.1, 0.42]} radius={0.025} smoothness={4} position={[0.58, 0.38, 0.06]} material={getMaterial(mat("blackGlass"))} />}
      {electric && (
        <>
          <mesh position={[0.62, 0.16, -0.72]} material={getMaterial(mat("metal"))}><boxGeometry args={[0.035, 0.035, 0.46]} /></mesh>
          <RoundedBox args={[0.24, 0.36, 0.045]} radius={0.018} smoothness={4} position={[0.78, 0.82, -0.2]} material={getMaterial(mat("blackGlass"))} />
          {[0.72, 0.82, 0.92].map((y) => <mesh key={y} position={[0.78, y, -0.17]} material={getMaterial(mat("glow"))}><circleGeometry args={[0.018, 16]} /></mesh>)}
        </>
      )}
      <mesh position={[-0.54, 0.12, -0.62]} rotation={[0, 0, Math.PI / 2]} material={getMaterial(mat("metal"))}><cylinderGeometry args={[0.015, 0.015, 0.48, 12]} /></mesh>
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

export default function ExplorerScene({ category, variant, compareVariant, compare, mode, annotations, powered, motion, lightPreset }) {
  return (
    <>
      <SceneLighting preset={lightPreset} />
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
