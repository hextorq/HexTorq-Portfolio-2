export const routeToSection: Record<string, string> = {
  "/": "hero",
  "/about/": "about",
  "/services/": "services",
  "/products/": "products",
  "/projects/": "services",
  "/process/": "services",
  "/contact/": "contact",
};

const sectionToRoute: Record<string, string> = {
  hero: "/",
  about: "/about/",
  services: "/services/",
  products: "/products/",
  contact: "/contact/",
};

export function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function routeForSection(sectionId: string) {
  return sectionToRoute[sectionId] || "/";
}

export function currentSectionFromPath() {
  if (typeof window === "undefined") return null;
  return routeToSection[normalizePath(window.location.pathname)] || null;
}

export function pushRouteForSection(sectionId: string) {
  if (typeof window === "undefined") return;
  const route = routeForSection(sectionId);
  if (normalizePath(window.location.pathname) !== route) {
    window.history.pushState({}, "", route);
  }
}

export function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function templateUrls() {
  const raw = import.meta.env.VITE_TEMPLATE_URLS || "";
  return raw
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean);
}
