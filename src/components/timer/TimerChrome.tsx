"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type TimerChromeProps = {
  isImmersive: boolean;
  children: ReactNode;
};

export function TimerChrome({ isImmersive, children }: TimerChromeProps) {
  return (
    <motion.div
      animate={{
        opacity: isImmersive ? 0 : 1,
      }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className={isImmersive ? "pointer-events-none" : "pointer-events-auto"}
    >
      {children}
    </motion.div>
  );
}
