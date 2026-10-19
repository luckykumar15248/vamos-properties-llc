"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({ spanish }: { spanish: boolean }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const stored = document.documentElement.dataset.theme;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }
    setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex min-h-11 items-center px-2 text-sm text-white/80 hover:text-white"
      aria-label={
        spanish
          ? theme === "dark"
            ? "Cambiar a modo claro"
            : "Cambiar a modo oscuro"
          : theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
    >
      {spanish ? (theme === "dark" ? "Claro" : "Oscuro") : theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
