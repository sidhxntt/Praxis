"use client";
import { useState } from "react";

/**
 * Custom hook for confirm dialog
 * @param initialState string | null
 * @returns A stateful value, and a function to update it.
 * @example const [open, setOpen] = useDialogState<"approve" | "reject">()
 */
export default function useDialogState(initialState = null) {
  const [open, _setOpen] = useState(initialState);

  const setOpen = (str) => _setOpen((prev) => (prev === str ? null : str));

  return [open, setOpen];
}
