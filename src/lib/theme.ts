export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";

export const THEME_STORAGE_KEY = "darestimate-theme";

function normalizeTheme(value: string | null): Theme | null {
  if (value === "light" || value === "dark") return value;
  // Anciennes valeurs → clair / sombre
  if (value === "nuit") return "dark";
  if (value === "premium" || value === "airbnb" || value === "programa") return "light";
  return null;
}

/**
 * Runs synchronously in <head> before the first paint so the persisted theme
 * is applied without a flash.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem("${THEME_STORAGE_KEY}");var t=raw==="dark"||raw==="nuit"?"dark":raw==="light"||raw==="premium"||raw==="airbnb"||raw==="programa"||!raw?"light":"light";document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t;if(t==="dark")document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark")}catch(e){}})()`;

export { normalizeTheme };
