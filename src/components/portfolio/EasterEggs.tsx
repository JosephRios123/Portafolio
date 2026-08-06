import { useEffect } from "react";
import { toast } from "sonner";

export const EASTER_EGG_EVENT = "portfolio:easter-egg";

export function revealEasterEgg(detail: string) {
  window.dispatchEvent(new CustomEvent(EASTER_EGG_EVENT, { detail }));
}

export default function EasterEggs() {
  useEffect(() => {
    const found = new Set<string>();
    const onReveal = (event: Event) => {
      const message = (event as CustomEvent<string>).detail;
      if (found.has(message)) return;
      found.add(message);
      document.documentElement.classList.add("easter-egg-active");
      window.setTimeout(() => document.documentElement.classList.remove("easter-egg-active"), 1200);
      toast.success("¡Easter Egg encontrado!", { description: message });
    };
    window.addEventListener(EASTER_EGG_EVENT, onReveal);
    return () => window.removeEventListener(EASTER_EGG_EVENT, onReveal);
  }, []);

  return null;
}