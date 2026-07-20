"use client";

import { useState, useCallback } from "react";

interface AccordionState {
  openId: number | null;
  toggle: (id: number) => void;
}

export function useAccordion(): AccordionState {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = useCallback((id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return { openId, toggle };
}
