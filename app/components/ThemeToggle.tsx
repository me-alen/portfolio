"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "portfolio-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);

    if (initialTheme !== "light") {
      requestAnimationFrame(() => {
        setTheme(initialTheme);
      });
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-[var(--border-color)] px-3 py-2 text-xs font-semibold text-[var(--soft-foreground)] transition-all duration-300 ease-out hover:scale-[1.02] hover:border-[var(--subtle-foreground)] active:scale-95 sm:px-4 sm:text-sm"
      aria-label="Toggle dark and light theme"
    >
      {theme === "dark" ? (
        <>
          <span className="sm:hidden">Light side</span>
          <span className="hidden sm:inline">Return to the light side</span>
        </>
      ) : (
        <>
          <span className="sm:hidden">Dark side</span>
          <span className="hidden sm:inline">Join the dark side</span>
        </>
      )}
    </button>
  );
}
