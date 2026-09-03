"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "cyber";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as Theme;
    if (saved && ["dark", "light", "cyber"].includes(saved)) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const order: Theme[] = ["dark", "light", "cyber"];
    const currentIndex = order.indexOf(theme);
    const newTheme = order[(currentIndex + 1) % order.length];

    // Arm the colour cross-fade only for the duration of the swap; see the
    // .theme-switching rule in globals.css.
    const root = document.documentElement;
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 400);

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    root.setAttribute("data-theme", newTheme);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
