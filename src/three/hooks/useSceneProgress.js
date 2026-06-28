import { useEffect, useState } from "react";

export function useSceneProgress() {
  const [progress, setProgress] = useState({ kitchen: 0, bathroom: 0 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const y = window.scrollY / height;
        setProgress({
          kitchen: Math.min(1, Math.max(0, (y - 0.14) / 0.24)),
          bathroom: Math.min(1, Math.max(0, (y - 0.52) / 0.22))
        });
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
