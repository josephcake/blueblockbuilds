import { useEffect, useState } from "react";

function sectionInfluence(id) {
  const section = document.getElementById(id);
  if (!section) return 0;
  const rect = section.getBoundingClientRect();
  const sectionCenter = rect.top + rect.height / 2;
  const viewportCenter = window.innerHeight / 2;
  const distance = Math.abs(sectionCenter - viewportCenter);
  const range = Math.max(window.innerHeight * 0.64, rect.height * 0.34);
  const raw = 1 - distance / range;
  const clamped = Math.min(1, Math.max(0, raw));
  return clamped * clamped * (3 - 2 * clamped);
}

export function useSceneProgress() {
  const [progress, setProgress] = useState({ hero: 1, kitchen: 0, studio: 0, bathroom: 0, active: "hero" });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hero = sectionInfluence("top");
        const kitchen = sectionInfluence("kitchen");
        const studio = sectionInfluence("studio");
        const bathroom = sectionInfluence("bathroom");
        const active = [
          ["hero", hero],
          ["kitchen", kitchen],
          ["studio", studio],
          ["bathroom", bathroom]
        ].sort((a, b) => b[1] - a[1])[0][0];
        setProgress({ hero, kitchen, studio, bathroom, active });
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}
