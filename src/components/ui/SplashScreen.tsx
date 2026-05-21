"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import {
  SPLASH_ATTRIBUTION,
  SPLASH_QUOTE,
} from "@/lib/splash/content";

const AUTO_DISMISS_MS = 3000;
const ENTER_DURATION_S = 1.5;
const EXIT_DURATION_S = 0.9;

type SplashScreenProps = {
  show: boolean;
  onDismiss: () => void;
  onExitComplete: () => void;
};

function ChevronUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M11.47 7.72a.75.75 0 011.06 0l6 6a.75.75 0 11-1.06 1.06L12 9.31l-5.47 5.47a.75.75 0 01-1.06-1.06l6-6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SplashScreen({
  show,
  onDismiss,
  onExitComplete,
}: SplashScreenProps) {
  const reduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enterDuration = reduceMotion ? 0.2 : ENTER_DURATION_S;
  const exitDuration = reduceMotion ? 0.25 : EXIT_DURATION_S;

  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (!show) return;

    timerRef.current = setTimeout(() => {
      dismiss();
    }, AUTO_DISMISS_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [show, dismiss]);

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {show && (
        <motion.div
          key="splash-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to MindEase"
          className="fixed inset-0 z-50 flex flex-col bg-[#0D0E0E] bg-background"
          initial={{ y: 0, opacity: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { y: "-100%", opacity: 0 }
          }
          transition={{ duration: exitDuration, ease: "easeInOut" }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgb(245_158_11_/_0.06)_0%,_transparent_65%)]"
            aria-hidden
          />

          <div className="relative flex flex-1 flex-col items-center justify-center px-8">
            <motion.blockquote
              className="max-w-lg text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: enterDuration, ease: "easeInOut" }}
            >
              <p className="font-serif text-2xl leading-relaxed font-medium tracking-wide text-stone-300 sm:text-3xl">
                &ldquo;{SPLASH_QUOTE}&rdquo;
              </p>
              <footer className="mt-8 font-serif text-sm tracking-[0.25em] text-stone-500 uppercase">
                — {SPLASH_ATTRIBUTION}
              </footer>
            </motion.blockquote>
          </div>

          <motion.div
            className="relative flex justify-center pb-12 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: enterDuration,
              ease: "easeInOut",
              delay: reduceMotion ? 0 : 0.4,
            }}
          >
            <button
              type="button"
              onClick={dismiss}
              className="sacred-glow group flex flex-col items-center gap-2 rounded-full border border-transparent px-6 py-3 text-stone-500 transition-all duration-700 ease-in-out hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-400/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500/40"
            >
              <span className="text-xs tracking-[0.3em] uppercase">
                Enter Now
              </span>
              <span className="transition-transform duration-700 ease-in-out group-hover:-translate-y-0.5 group-hover:text-amber-400/90">
                <ChevronUpIcon />
              </span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
