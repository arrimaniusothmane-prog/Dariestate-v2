"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  normalizeTheme,
  type Theme,
} from "@/lib/theme";

export type { Theme } from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  toggle: () => {},
});

const THEME_CHANGE_EVENT = "darestimate-theme-change";

function applyDomTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readStoredTheme(): Theme | null {
  try {
    return normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

function getSnapshot(): Theme {
  return readStoredTheme() ?? DEFAULT_THEME;
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

function subscribe(onStoreChange: () => void) {
  const handleChange = () => {
    applyDomTheme(readStoredTheme() ?? DEFAULT_THEME);
    onStoreChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, handleChange);
  window.addEventListener("storage", handleChange);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useLayoutEffect(() => {
    const stored = readStoredTheme() ?? DEFAULT_THEME;
    applyDomTheme(stored);
    if (document.documentElement.dataset.theme !== stored) {
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    }
  }, []);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    applyDomTheme(next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
