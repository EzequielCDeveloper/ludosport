interface ValueCardProps {
  title: string;
  text: string;
  icon: string;
}

export default function ValueCard({ title, text, icon }: ValueCardProps) {
  return (
    <article
      className="border border-white/[0.06] border-t-3 border-[var(--color-yellow)]/20 bg-white/[0.015] p-10"
      style={{
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="w-12 h-12 mb-4 text-[var(--color-yellow)]"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <h3 className="text-xl font-display text-white mb-2">{title}</h3>
      <p className="text-[var(--color-gray-light)] font-body leading-relaxed">
        {text}
      </p>
    </article>
  );
}
