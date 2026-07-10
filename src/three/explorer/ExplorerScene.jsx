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

function CabinetDoorSkin({ euro, x = 0.5, height = 1.34 }) {
  const trimMaterial = getMaterial(euro ? mat("metal") : materialOptions("oak"));
  const railY = height / 2 - 0.08;
  const stileHeight = height - 0.18;
  return (
    <group>
      {euro ? (
        <>
          <ThinLine position={[x, railY, 0.052]} args={[0.7, 0.022, 0.018]} material={trimMaterial} />
          <ThinLine position={[x, -railY, 0.052]} args={[0.7, 0.012, 0.014]} material={getMaterial(mat("charcoal"))} />
        </>
      ) : (
        <>
          <ThinLine position={[x, railY, 0.052]} args={[0.82, 0.05, 0.018]} material={trimMaterial} />
          <ThinLine position={[x, -railY, 0.052]} args={[0.82, 0.05, 0.018]} material={trimMaterial} />
          <ThinLine position={[x - 0.37, 0, 0.052]} args={[0.052, stileHeight, 0.018]} material={trimMaterial} />
          <ThinLine position={[x + 0.37, 0, 0.052]} args={[0.052, stileHeight, 0.018]} material={trimMaterial} />
          <ThinLine position={[x, 0, 0.056]} args={[0.54, 0.02, 0.014]} material={getMaterial({ ...mat("charcoal"), transparent: true, opacity: 0.28, cacheKey: "shadow-reveal" })} />
        </>
      )}
    </group>
  );
}

function CabinetCarcass({ framed = false, cutaway = false, explode = 0 }) {
  const panelMaterial = getMaterial(cutaway ? { ...mat("navy"), transparent: true, opacity: 0.54, cacheKey: "cabinet-cutaway-navy" } : mat("navy"));
  return (
    <group>
      <mesh position={[0, 0.44, -0.51 - explode * 0.04]} material={getMaterial(mat("charcoal"))} receiveShadow>
        <boxGeometry args={[2.12, 1.56, 0.05]} />
      </mesh>
      <mesh position={[-1.1 - explode * 0.06, 0.43, -0.08]} material={panelMaterial} castShadow>
        <boxGeometry args={[0.07, 1.62, 0.9]} />
      </mesh>
      <mesh position={[1.1 + explode * 0.06, 0.43, -0.08]} material={panelMaterial} castShadow>
        <boxGeometry args={[0.07, 1.62, 0.9]} />
      </mesh>
      <mesh position={[0, 1.24 + explode * 0.06, -0.08]} material={getMaterial(mat("navy"))} castShadow>
        <boxGeometry args={[2.2, 0.085, 0.9]} />
      </mesh>
      <mesh position={[0, -0.35 - explode * 0.04, -0.08]} material={getMaterial(mat("navy"))} castShadow>
        <boxGeometry args={[2.2, 0.085, 0.9]} />
      </mesh>
      <mesh position={[0, -0.54, 0.1]} material={getMaterial(mat("charcoal"))} castShadow>
        <boxGeometry args={[1.86, 0.22, 0.56]} />
      </mesh>
      <ThinLine position={[0, -0.37, 0.39]} args={[1.6, 0.018, 0.018]} material={getMaterial(mat("metal"))} />
      {framed && (
        <group position={[0, 0.45, 0.41 + explode * 0.06]}>
          <ThinLine position={[0, 0.77, 0]} args={[2.32, 0.12, 0.08]} material={getMaterial(mat("ivory"))} />
          <ThinLine position={[0, -0.77, 0]} args={[2.32, 0.12, 0.08]} material={getMaterial(mat("ivory"))} />
          <ThinLine position={[-1.1, 0, 0]} args={[0.12, 1.62, 0.08]} material={getMaterial(mat("ivory"))} />
          <ThinLine position={[1.1, 0, 0]} args={[0.12, 1.62, 0.08]} material={getMaterial(mat("ivory"))} />
          <ThinLine position={[0, 0, 0]} args={[0.1, 1.58, 0.08]} material={getMaterial(mat("ivory"))} />
        </group>
      )}
    </group>
  );
}

function CabinetHingeDetail({ side = -1, y = 0, open = 0, explode = 0 }) {
  const x = side * 0.98;
  return (
    <group position={[x + side * explode * 0.04, y, 0.26]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("metal"))} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.17, 24]} />
      </mesh>
      <mesh position={[side * 0.045, 0, 0.04]} material={getMaterial(mat("metal"))} castShadow>
        <boxGeometry args={[0.12, 0.18, 0.035]} />
      </mesh>
      <mesh position={[side * (0.13 + open * 0.04), 0, 0.08]} rotation={[0, side * open * 0.6, 0]} material={getMaterial(mat("metal"))} castShadow>
        <boxGeometry args={[0.18, 0.045, 0.035]} />
      </mesh>
      <Screw position={[side * 0.06, 0.055, 0.055]} scale={0.32} />
      <Screw position={[side * 0.06, -0.055, 0.055]} scale={0.32} />
    </group>
  );
}

function ShelfObjects() {
  return (
    <group>
      {[-0.46, -0.38, -0.3, -0.22].map((x, index) => (
        <mesh key={x} position={[x, 0.24 + index * 0.018, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(index % 2 ? mat("ivory") : mat("stone"))} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.018, 36]} />
        </mesh>
      ))}
      <mesh position={[0.42, 0.3, 0.01]} material={getMaterial(mat("ivory"))} castShadow>
        <cylinderGeometry args={[0.14, 0.1, 0.18, 28]} />
      </mesh>
      <mesh position={[0.42, 0.43, 0.01]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("charcoal"))}>
        <torusGeometry args={[0.1, 0.012, 10, 28]} />
      </mesh>
      <RoundedBox args={[0.34, 0.34, 0.28]} radius={0.025} smoothness={4} position={[0.03, 0.86, -0.02]} material={getMaterial(mat("stone"))} castShadow />
      <RoundedBox args={[0.26, 0.42, 0.22]} radius={0.02} smoothness={4} position={[0.46, 0.9, -0.04]} material={getMaterial(mat("oak"))} castShadow />
      <mesh position={[-0.5, 0.88, -0.03]} rotation={[0, 0, Math.PI / 2]} material={getMaterial(mat("metal"))} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.52, 18]} />
      </mesh>
    </group>
  );
}

function DrawerObjects({ tier }) {
  if (tier === 0) {
    return (
      <group>
        {[-0.42, -0.18, 0.08, 0.34].map((x, index) => (
          <mesh key={x} position={[x, 0.06, -0.12 + index * 0.02]} rotation={[0, 0, Math.PI / 2]} material={getMaterial(mat("metal"))} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.42, 12]} />
          </mesh>
        ))}
        <RoundedBox args={[0.22, 0.055, 0.38]} radius={0.02} smoothness={4} position={[0.6, 0.04, -0.08]} material={getMaterial(mat("charcoal"))} />
      </group>
    );
  }
  if (tier === 1) {
    return (
      <group>
        {[-0.42, -0.12, 0.2].map((x) => (
          <mesh key={x} position={[x, 0.08, -0.08]} rotation={[Math.PI / 2, 0, 0]} material={getMaterial(mat("ivory"))} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.14, 24]} />
          </mesh>
        ))}
        <RoundedBox args={[0.32, 0.12, 0.28]} radius={0.02} smoothness={4} position={[0.5, 0.05, -0.04]} material={getMaterial(mat("stone"))} />
      </group>
    );
  }
  return (
    <group>
      {[-0.38, 0.02, 0.42].map((x, index) => (
        <mesh key={x} position={[x, 0.08, -0.08]} rotation={[0, 0, Math.PI / 2]} material={getMaterial(index === 1 ? mat("oak") : mat("ivory"))} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.38, 20]} />
        </mesh>
      ))}
      <RoundedBox args={[0.28, 0.16, 0.34]} radius={0.025} smoothness={4} position={[0.68, 0.05, -0.04]} material={getMaterial(mat("walnut"))} />
    </group>
  );
}

function DoorCabinet({ variant, mode, motion, annotations }) {
  const isEuro = variant.id === "european-door";
  const framed = variant.id === "american-door";
  const open = mode.includes("Open") ? motion : mode.includes("Cutaway") || mode.includes("Exploded") ? 0.82 : 0;
  const explode = mode.includes("Exploded") ? 1 : 0;
  const cutaway = mode.includes("Cutaway");
  const doorMaterial = getMaterial(isEuro ? mat("ivory") : materialOptions("walnut"));

  return (
    <group>
      <CabinetCarcass framed={framed} cutaway={cutaway} explode={explode} />
      {[0.18, 0.64].map((y) => (
        <mesh key={y} position={[0, y, cutaway ? 0.12 : -0.02]} material={getMaterial(mat("stone"))} castShadow>
          <boxGeometry args={[1.84, 0.038, 0.68]} />
        </mesh>
      ))}
      <ShelfObjects />
      <group position={[-1.06 - explode * 0.12, 0.47, 0.42 + explode * 0.08]} rotation={[0, -open * 1.32, 0]}>
        <RoundedBox position={[0.535, 0, 0]} args={[1.05, 1.44, 0.074]} radius={isEuro ? 0.016 : 0.035} smoothness={5} material={doorMaterial} castShadow />
        <CabinetDoorSkin euro={isEuro} x={0.535} height={1.44} />
        <mesh position={[0.91, 0, 0.06]} material={getMaterial(mat("metal"))} castShadow><boxGeometry args={[0.035, 0.72, 0.035]} /></mesh>
        <mesh position={[0.535, 0, -0.065]} material={getMaterial(mat("stone"))}><boxGeometry args={[0.84, 1.16, 0.018]} /></mesh>
      </group>
      <group position={[1.06 + explode * 0.12, 0.47, 0.42 + explode * 0.08]} rotation={[0, open * 1.32, 0]}>
        <RoundedBox position={[-0.535, 0, 0]} args={[1.05, 1.44, 0.074]} radius={isEuro ? 0.016 : 0.035} smoothness={5} material={doorMaterial} castShadow />
        <CabinetDoorSkin euro={isEuro} x={-0.535} height={1.44} />
        <mesh position={[-0.91, 0, 0.06]} material={getMaterial(mat("metal"))} castShadow><boxGeometry args={[0.035, 0.72, 0.035]} /></mesh>
        <mesh position={[-0.535, 0, -0.065]} material={getMaterial(mat("stone"))}><boxGeometry args={[0.84, 1.16, 0.018]} /></mesh>
      </group>
      {[-1, 1].map((side) => [0.88, 0.48, 0.08].map((y) => <CabinetHingeDetail key={`${side}-${y}`} side={side} y={y} open={open} explode={explode} />))}
      <Annotation visible={annotations} position={[0, 1.55, 0.62]}>{isEuro ? "frameless slab doors" : "framed overlay doors"}</Annotation>
      <Annotation visible={annotations} position={[1.25, 0.74, 0.44]}>inside concealed hinges</Annotation>
      <Annotation visible={annotations} position={[0, -0.68, 0.36]}>toe kick</Annotation>
    </group>
  );
}

function DrawerCabinet({ mode, motion, annotations }) {
  const open = mode.includes("Open") ? motion : mode.includes("Cutaway") || mode.includes("Exploded") ? 0.84 : 0;
  const explode = mode.includes("Exploded") ? 1 : 0;
  const cutaway = mode.includes("Cutaway");
  const frontMaterial = getMaterial(materialOptions("walnut"));

  return (
    <group>
      <CabinetCarcass cutaway={cutaway} explode={explode} />
      {[0.9, 0.46, 0.02].map((y, index) => {
        const drawerDepth = open * (0.5 + index * 0.08) + explode * 0.1;
        const showContents = mode.includes("Open") || mode.includes("Cutaway") || mode.includes("Exploded");
        return (
          <group key={y} position={[0, y, 0.4 + drawerDepth]}>
            <RoundedBox args={[2.02, 0.4, 0.08]} radius={0.025} smoothness={4} material={frontMaterial} castShadow />
            <CabinetDoorSkin euro={false} x={0} height={0.38} />
            <mesh position={[0, 0.01, -0.32]} material={getMaterial(mat("stone"))} castShadow>
              <boxGeometry args={[1.62, 0.08, 0.58]} />
            </mesh>
            <mesh position={[-0.82, 0.01, -0.32]} material={getMaterial(materialOptions("oak"))} castShadow><boxGeometry args={[0.055, 0.28, 0.62]} /></mesh>
            <mesh position={[0.82, 0.01, -0.32]} material={getMaterial(materialOptions("oak"))} castShadow><boxGeometry args={[0.055, 0.28, 0.62]} /></mesh>
            <mesh position={[0, -0.13, -0.32]} material={getMaterial(materialOptions("oak"))} castShadow><boxGeometry args={[1.62, 0.045, 0.62]} /></mesh>
            <mesh position={[0, 0.02, 0.08]} material={getMaterial(mat("metal"))} castShadow><boxGeometry args={[0.86, 0.035, 0.035]} /></mesh>
            {showContents && <DrawerObjects tier={index} />}
          </group>
        );
      })}
      {[0.9, 0.46, 0.02].map((y) => (
        <group key={y}>
          <ThinLine position={[-1.02, y, 0.12]} args={[0.035, 0.045, 0.66]} material={getMaterial(mat("metal"))} />
          <ThinLine position={[1.02, y, 0.12]} args={[0.035, 0.045, 0.66]} material={getMaterial(mat("metal"))} />
          <Screw position={[-1.04, y + 0.08, 0.44]} scale={0.3} />
          <Screw position={[1.04, y + 0.08, 0.44]} scale={0.3} />
        </group>
      ))}
      <Annotation visible={annotations} position={[0, 1.52, 0.58]}>separate drawer stack</Annotation>
      <Annotation visible={annotations} position={[1.36, 0.48, 0.5]}>slide rails</Annotation>
      <Annotation visible={annotations && open > 0.1} position={[0.18, 0.1, 1.18]}>organized drawer contents</Annotation>
    </group>
  );
}

function CabinetSystem({ variant, mode, motion, annotations }) {
  if (variant.id === "drawer-base") {
    return <DrawerCabinet mode={mode} motion={motion} annotations={annotations} />;
  }

  return <DoorCabinet variant={variant} mode={mode} motion={motion} annotations={annotations} />;
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

function CategoryModel(props) {
  const map = {
    cabinets: CabinetSystem,
    hinges: HingeSystem,
    cooktops: CooktopSystem,
    countertops: CountertopSystem
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
