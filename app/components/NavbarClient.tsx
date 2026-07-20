"use client";

import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { useScrollNav } from "@/app/hooks/useScrollNav";

export default function NavbarClient() {
  const { isSolid, activeSection } = useScrollNav();
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply navbar--solid class to the parent <nav> element
  useEffect(() => {
    const nav = document.getElementById("navbar");
    if (!nav) return;
    nav.classList.toggle("navbar--solid", isSolid);
  }, [isSolid]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Hamburger toggle */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className={`md:hidden flex flex-col gap-[5px] p-2 z-[1001] relative ${menuOpen ? "navbar__toggle--active" : ""}`}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        <span className="navbar__toggle-bar block w-[26px] h-[3px] bg-white transition-all duration-300" />
        <span className="navbar__toggle-bar block w-[26px] h-[3px] bg-white transition-all duration-300" />
        <span className="navbar__toggle-bar block w-[26px] h-[3px] bg-white transition-all duration-300" />
      </button>

      {/* Desktop nav links */}
      <ul className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={`font-display text-sm uppercase tracking-[0.08em] transition-colors duration-200 ${
                link.cta
                  ? "text-white bg-[#0a58ca] hover:bg-[var(--color-red-dark)] px-4 py-2"
                  : "text-white hover:text-[var(--color-yellow)]"
              } ${
                !link.cta && activeSection === link.href.slice(1)
                  ? "navbar__link--active"
                  : ""
              }`}
              {...(!link.cta && activeSection === link.href.slice(1)
                ? { "aria-current": "page" as const }
                : {})}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile menu overlay */}
      <div
        className="fixed top-0 w-[75%] max-w-xs h-full bg-[var(--color-black-2)] flex flex-col justify-center items-center gap-8 z-[1000] transition-[right] duration-300 ease-out md:hidden"
        style={{ right: menuOpen ? "0" : "-100%" }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={closeMenu}
            className={`font-display text-lg uppercase tracking-[0.08em] transition-colors duration-200 ${
              link.cta
                ? "text-white bg-[#0a58ca] hover:bg-[var(--color-red-dark)] px-6 py-3"
                : "text-white hover:text-[var(--color-yellow)]"
            } ${
              !link.cta && activeSection === link.href.slice(1)
                ? "navbar__link--active"
                : ""
            }`}
            {...(!link.cta && activeSection === link.href.slice(1)
              ? { "aria-current": "page" as const }
              : {})}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
