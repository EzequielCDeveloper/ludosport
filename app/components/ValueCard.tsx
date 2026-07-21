import type { ComponentType, SVGProps } from "react";
import { BORDER_COLORS } from "@/lib/colors";

interface ValueCardProps {
  title: string;
  text: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
}

export default function ValueCard({ title, text, icon: Icon, color }: ValueCardProps) {
  return (
    <article
      className={`border border-white/[0.06] border-t-4 bg-white/[0.015] p-10 ${BORDER_COLORS[color] || "border-t-white/20"}`}
      style={{
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      <Icon className="w-12 h-12 mb-4 text-[var(--color-yellow)]" aria-hidden="true" />
      <h3 className="text-xl font-display text-white mb-2">{title}</h3>
      <p className="text-white font-body leading-relaxed">
        {text}
      </p>
    </article>
  );
}
