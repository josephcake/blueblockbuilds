import { Suspense, lazy, useMemo, useState } from "react";
import { explorerCategories } from "../../data/explorerCategories.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./InteractiveExplorer.module.css";

const lightPresets = ["showroom", "daylight", "warm interior", "dark studio"];
const cameraPresets = ["front", "three-quarter", "top", "detail"];
const ExplorerViewer = lazy(() => import("./ExplorerViewer.jsx"));

function getVariant(category, id) {
  return category.variants.find((variant) => variant.id === id) || category.variants[0];
}

export default function InteractiveExplorer() {
  const [categoryId, setCategoryId] = useState(explorerCategories[0].id);
  const category = useMemo(() => explorerCategories.find((item) => item.id === categoryId) || explorerCategories[0], [categoryId]);
  const [variantByCategory, setVariantByCategory] = useState(() => Object.fromEntries(explorerCategories.map((item) => [item.id, item.defaultVariant])));
  const [compareByCategory, setCompareByCategory] = useState(() => Object.fromEntries(explorerCategories.map((item) => [item.id, item.compareDefault])));
  const [modeByCategory, setModeByCategory] = useState(() => Object.fromEntries(explorerCategories.map((item) => [item.id, item.modes[0]])));
  const [compare, setCompare] = useState(false);
  const [annotations, setAnnotations] = useState(true);
  const [powered, setPowered] = useState(true);
  const [motion, setMotion] = useState(64);
  const [lightPreset, setLightPreset] = useState(lightPresets[0]);
  const [cameraPreset, setCameraPreset] = useState(cameraPresets[1]);
  const reducedMotion = useReducedMotion();

  const variant = getVariant(category, variantByCategory[category.id]);
  const compareVariant = getVariant(category, compareByCategory[category.id]);
  const mode = modeByCategory[category.id] || category.modes[0];

  const updateCategory = (id) => {
    setCategoryId(id);
    setCompare(false);
  };

  return (
    <section id="explorer" className={`${styles.section} surface-band`}>
      <div className="section-shell">
        <div className={styles.intro}>
          <SectionHeading
            eyebrow="3D product explorer"
            title="A showroom built from the decisions homeowners actually make."
            body="Explore cabinets, hinges, cooktops, flooring, countertops, bath fixtures, and toilets in a refined interactive system before a project ever becomes a punch list."
          />
        </div>

        <div className={styles.shell}>
          <aside className={styles.sidebar} aria-label="Explorer controls">
            <nav className={styles.categoryNav} aria-label="Product categories">
              {explorerCategories.map((item) => (
                <button
                  key={item.id}
                  className={item.id === category.id ? styles.activeCategory : ""}
                  type="button"
                  onClick={() => updateCategory(item.id)}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className={styles.copy}>
              <p className="eyebrow">{category.label}</p>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>

            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Variant</span>
              <div className={styles.segmented}>
                {category.variants.map((item) => (
                  <button
                    key={item.id}
                    className={item.id === variant.id ? styles.activeSegment : ""}
                    type="button"
                    onClick={() => setVariantByCategory((current) => ({ ...current, [category.id]: item.id }))}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Mode</span>
              <div className={styles.modeGrid}>
                {category.modes.map((item) => (
                  <button
                    key={item}
                    className={item === mode ? styles.activeMode : ""}
                    type="button"
                    onClick={() => setModeByCategory((current) => ({ ...current, [category.id]: item }))}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.toggles}>
              <label>
                <input type="checkbox" checked={compare} onChange={(event) => setCompare(event.target.checked)} />
                <span>Compare similar types</span>
              </label>
              <label>
                <input type="checkbox" checked={annotations} onChange={(event) => setAnnotations(event.target.checked)} />
                <span>Show annotations</span>
              </label>
              <label>
                <input type="checkbox" checked={powered} onChange={(event) => setPowered(event.target.checked)} />
                <span>Animated details</span>
              </label>
            </div>

            {compare && (
              <div className={styles.controlGroup}>
                <span className={styles.controlLabel}>Compare against</span>
                <select value={compareVariant.id} onChange={(event) => setCompareByCategory((current) => ({ ...current, [category.id]: event.target.value }))}>
                  {category.variants.filter((item) => item.id !== variant.id).map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className={styles.controlGroup}>
              <label className={styles.rangeLabel}>
                <span>Open / detail motion</span>
                <output>{motion}%</output>
              </label>
              <input type="range" min="0" max="100" value={motion} onChange={(event) => setMotion(Number(event.target.value))} />
            </div>

            <div className={styles.detailPanel}>
              <strong>{variant.name}</strong>
              <p>{variant.cue}</p>
              <ul>
                {variant.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </div>
          </aside>

          <div className={styles.stage}>
            <div className={styles.toolbar} aria-label="Viewer presets">
              <div>
                {cameraPresets.map((item) => (
                  <button key={item} className={cameraPreset === item ? styles.activeTool : ""} type="button" onClick={() => setCameraPreset(item)}>
                    {item}
                  </button>
                ))}
              </div>
              <select value={lightPreset} onChange={(event) => setLightPreset(event.target.value)} aria-label="Lighting preset">
                {lightPresets.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <Suspense fallback={<div className={styles.viewerFallback}><div /><span>{category.label}</span></div>}>
              <ExplorerViewer
                category={category}
                variant={variant}
                compareVariant={compareVariant}
                mode={mode}
                compare={compare}
                annotations={annotations}
                powered={powered}
                motion={motion / 100}
                lightPreset={lightPreset}
                cameraPreset={cameraPreset}
                reducedMotion={reducedMotion}
              />
            </Suspense>

            <div className={styles.compareTray}>
              <div>
                <span>Primary</span>
                <strong>{variant.name}</strong>
              </div>
              {compare && (
                <div>
                  <span>Comparison</span>
                  <strong>{compareVariant.name}</strong>
                </div>
              )}
            </div>
          </div>

          <aside className={styles.education} aria-label="Educational details">
            <h3>Design Notes</h3>
            <dl>
              <div>
                <dt>What it is</dt>
                <dd>{category.detail.what}</dd>
              </div>
              <div>
                <dt>Best use</dt>
                <dd>{category.detail.best}</dd>
              </div>
              <div>
                <dt>Consider</dt>
                <dd>{category.detail.considerations}</dd>
              </div>
            </dl>
            <div className={styles.attributeGrid}>
              {Object.entries(variant.attributes).map(([key, value]) => (
                <div key={key}>
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
