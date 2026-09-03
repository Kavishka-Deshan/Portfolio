"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        /*
         * Deliberately no `filter` here. Framer keeps the settled value inline
         * (`filter: blur(0px)`), and any filter other than `none` makes this div
         * the containing block for every `position: fixed` descendant — which
         * pinned the cursor canvas, navbar, scanlines, back-to-top and FAB to
         * the document instead of the viewport, so they stopped working past
         * the first screenful. `y` is safe: it settles to `transform: none`.
         */
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
