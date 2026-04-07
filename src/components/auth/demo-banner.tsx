"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="relative flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium text-amber-900 dark:text-amber-200"
          style={{
            background: "linear-gradient(90deg, oklch(0.92 0.12 70 / 80%), oklch(0.95 0.10 55 / 80%), oklch(0.92 0.12 70 / 80%))",
            backgroundSize: "200% 100%",
            animation: "gradient-shift 6s ease infinite",
          }}
        >
          <FlaskConical className="h-4 w-4 shrink-0" />
          <span>
            You&apos;re viewing <strong>demo data</strong> — predictions are simulated.{" "}
            <Link
              href="/login"
              className="underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
            >
              Sign in
            </Link>{" "}
            to use your own data.
          </span>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss demo banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-amber-900/10 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
