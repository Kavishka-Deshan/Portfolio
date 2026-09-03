"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/context/ThemeContext";

/*
 * The Toaster was hardcoded to `theme="dark"`, so notifications kept the dark
 * skin on the light theme. Sonner only knows "light" | "dark", so the cyber
 * theme maps onto dark.
 */
export default function Toasts() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme === "light" ? "light" : "dark"}
      position="bottom-right"
      richColors
      closeButton
    />
  );
}
