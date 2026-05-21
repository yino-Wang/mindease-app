"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BREATH_CYCLE_MS } from "@/lib/timer/constants";

type BreathingBubbleProps = {
  visible: boolean;
};

export function BreathingBubble({ visible }: BreathingBubbleProps) {
  const reduceMotion = useReducedMotion();

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      {reduceMotion ? (
        <div className="sacred-glow h-40 w-40 rounded-full bg-amber-500/15 blur-2xl" />
      ) : (
        <motion.div
          className="sacred-glow relative flex h-40 w-40 items-center justify-center rounded-full bg-amber-500/10"
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: [1, 1.22, 1], opacity: [0.4, 0.85, 0.4] }}
          transition={{
            duration: BREATH_CYCLE_MS / 1000,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        >
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="relative h-28 w-28 rounded-full bg-amber-500/10 blur-xl" />
        </motion.div>
      )}
    </div>
  );
}
