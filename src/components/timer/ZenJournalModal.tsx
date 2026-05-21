"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { getMeditateHeaders } from "@/lib/api/meditate-headers";
import { ZEN_JOURNAL_MAX_LENGTH } from "@/lib/validation/meditate";

type ZenJournalModalProps = {
  logId: string | null;
  open: boolean;
  onClose: () => void;
};

export function ZenJournalModal({ logId, open, onClose }: ZenJournalModalProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const remaining = ZEN_JOURNAL_MAX_LENGTH - content.length;

  const handleSubmit = async () => {
    if (!logId) return;
    const trimmed = content.trim();
    if (!trimmed) {
      setError("Please write a brief reflection or skip.");
      return;
    }
    if (trimmed.length > ZEN_JOURNAL_MAX_LENGTH) {
      setError(`Maximum ${ZEN_JOURNAL_MAX_LENGTH} characters.`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/meditate/journal", {
        method: "POST",
        headers: getMeditateHeaders(),
        body: JSON.stringify({ logId, content: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not save your reflection."
        );
        return;
      }

      setContent("");
      onClose();
    } catch {
      setError("Could not save your reflection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    setContent("");
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && logId && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleSkip}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-labelledby="journal-title"
            aria-modal="true"
            className="sacred-glow relative w-full max-w-md rounded-2xl border border-amber-500/20 bg-stone-900/95 px-8 py-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <h2
              id="journal-title"
              className="font-serif text-xl tracking-wide text-amber-300/90"
            >
              Zen Journal
            </h2>
            <p className="mt-2 text-sm tracking-wide text-stone-500">
              A quiet note from your practice (50 characters max).
            </p>

            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value.slice(0, ZEN_JOURNAL_MAX_LENGTH));
                setError(null);
              }}
              maxLength={ZEN_JOURNAL_MAX_LENGTH}
              rows={2}
              placeholder="Still waters within…"
              className="mt-6 w-full resize-none rounded-xl border border-stone-700/80 bg-stone-950/50 px-4 py-3 text-stone-200 placeholder:text-stone-600 focus:border-amber-500/40 focus:outline-none"
            />

            <div className="mt-2 flex justify-between text-xs text-stone-500">
              <span>{remaining} left</span>
              <span>
                {content.length}/{ZEN_JOURNAL_MAX_LENGTH}
              </span>
            </div>

            {error && (
              <p className="mt-3 text-sm text-amber-600/90" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-full border border-amber-500/40 bg-amber-500/15 py-3 font-serif tracking-widest text-amber-300 transition-all duration-700 ease-in-out hover:bg-amber-500/25 disabled:opacity-40"
              >
                {submitting ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                disabled={submitting}
                className="rounded-full border border-stone-700/80 px-6 py-3 text-sm tracking-widest text-stone-400 uppercase transition-all duration-700 ease-in-out hover:text-stone-300"
              >
                Skip
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
