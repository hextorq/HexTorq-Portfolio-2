import { useEffect, useState } from "react";
import { normalizePath, templateUrls } from "../routeUtils";

export default function TemplateSwitcher() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === "undefined") return null;

  const urls = templateUrls();
  const currentOrigin = window.location.origin.replace(/\/$/, "");
  const candidates = urls.filter((url) => url !== currentOrigin);

  if (!candidates.length) return null;

  const switchTemplate = () => {
    const index = Math.floor(Math.random() * candidates.length);
    const nextOrigin = candidates[index];
    const path = normalizePath(window.location.pathname);
    window.location.href = `${nextOrigin}${path}${window.location.search}${window.location.hash}`;
  };

  return (
    <button
      type="button"
      onClick={switchTemplate}
      aria-label="Switch portfolio template"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 80,
        border: "1px solid rgba(245, 158, 11, 0.48)",
        background: "rgba(8, 8, 8, 0.86)",
        color: "#f8f4ec",
        padding: "10px 13px",
        borderRadius: 8,
        font: "700 11px/1 JetBrains Mono, monospace",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: "pointer",
        backdropFilter: "blur(12px)",
      }}
    >
      Switch UI
    </button>
  );
}
