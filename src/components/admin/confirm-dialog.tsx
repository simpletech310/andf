"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "primary";
  showReason?: boolean;
  reasonPlaceholder?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  showReason = false,
  reasonPlaceholder = "Enter a reason...",
  loading = false,
}: ConfirmDialogProps) {
  const [reason, setReason] = useState("");

  function handleConfirm() {
    onConfirm(showReason ? reason : undefined);
    setReason("");
  }

  function handleClose() {
    setReason("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            className="relative w-full max-w-md mx-4 rounded-2xl bg-background-card border border-border shadow-xl p-6"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-foreground-muted mt-2">{message}</p>

            {showReason && (
              <textarea
                className="mt-4 w-full rounded-lg bg-background-elevated border border-border px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={3}
                placeholder={reasonPlaceholder}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            )}

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={handleClose} disabled={loading}>
                {cancelLabel}
              </Button>
              <Button
                variant={variant === "destructive" ? "destructive" : "primary"}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Processing..." : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
