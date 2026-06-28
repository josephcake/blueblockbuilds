import { useEffect } from "react";

export function useScrollLock(locked) {
  useEffect(() => {
    document.body.classList.toggle("scroll-locked", locked);
    return () => document.body.classList.remove("scroll-locked");
  }, [locked]);
}
