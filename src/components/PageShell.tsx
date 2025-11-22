import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const accentMap = {
  sand: "rgba(246, 220, 196, 0.45)",
  teal: "rgba(112, 210, 202, 0.4)",
  night: "rgba(120, 145, 255, 0.35)",
};

export type PageShellProps = {
  children: ReactNode;
  className?: string;
  accent?: keyof typeof accentMap;
};

export const PageShell = ({ children, className, accent = "sand" }: PageShellProps) => {
  return (
    <div
      className={cn(
        "page-shell relative isolate overflow-hidden py-12",
        className
      )}
      style={{
        // @ts-expect-error custom property
        "--page-shell-aurora": accentMap[accent],
      }}
    >
      <div className="ambient-aurora" aria-hidden />
      <div className="ambient-grid" aria-hidden />
      <div className="ambient-edge" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
