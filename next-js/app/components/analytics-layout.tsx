"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { assignAlgoliaProps, assignEventProps } from "../lib/chord/middleware";

import { useChord } from "../hooks/useChord";

export function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const chord = useChord();
  const pathname = usePathname();

  if (typeof window !== "undefined" && chord) {
    chord.addSourceMiddleware(assignAlgoliaProps);
    chord.addSourceMiddleware(assignEventProps);
  }

  useEffect(() => {
    if (chord) {
      chord.page();
    }
  }, [chord, pathname]);

  return <>{children}</>;
}
