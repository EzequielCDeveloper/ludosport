"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { useScrollNav } from "@/app/hooks/useScrollNav";

export default function NavbarClient() {
  const { isSolid, activeSection } = useScrollNav();
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Apply navbar--solid class to the parent <nav> element
  useEffect(() => {
    const nav = document.getElementById("navbar");
    if (!nav) return;
    nav.classList.toggle("navbar--solid", isSolid);
  }, [isSolid]);

  // Focus management: move focus to first link when menu opens, return to hamburger when closed
  useEffect(() => {
    if (menuOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [menuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <>
      {/* Hamburger toggle */}
      <button
        ref={buttonRef}
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
        ref={menuRef}
        className="fixed top-0 w-[75%] max-w-xs h-full bg-[var(--color-black-2)] flex flex-col justify-center items-center gap-8 z-[1000] transition-[right] duration-300 ease-out md:hidden"
        style={{ right: menuOpen ? "0" : "-100%" }}
        aria-hidden={!menuOpen}
        {...(!menuOpen ? { inert: true } : {})}
      >
        {NAV_LINKS.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            onClick={closeMenu}
            ref={index === 0 ? firstLinkRef : undefined}
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
