export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[1001] focus:px-6 focus:py-3 focus:bg-[var(--color-red)] focus:text-white focus:font-display focus:text-lg focus:tracking-wide focus:uppercase focus:outline-none"
    >
      Saltar al contenido principal
    </a>
  );
}
