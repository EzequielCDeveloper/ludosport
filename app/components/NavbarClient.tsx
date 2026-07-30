"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { useScrollNav } from "@/app/hooks/useScrollNav";
import { useFocusTrap } from "@/app/hooks/useFocusTrap";
import CtaButton from "@/app/components/CtaButton";

export default function NavbarClient() {
  const { isSolid, activeSection } = useScrollNav();
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    buttonRef.current?.focus();
  }, []);

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
  }, [menuOpen, closeMenu]);

  // Focus trap: keep Tab/Shift+Tab within the mobile menu while open
  useFocusTrap(menuRef, menuOpen);

  // Feature-detect inert support for fallback (SPEC-FAWS-009)
  const supportsInert =
    typeof HTMLElement !== "undefined" && "inert" in HTMLElement.prototype;

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full z-50 bg-black transition-[background-color,box-shadow] duration-300 ${isSolid ? "navbar--solid" : ""}`}
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2" title="Ludo Sport Drake Academy — Inicio">
          <Image
            src="/logo.jpeg"
            alt=""
            width={48}
            height={48}
            preload
            style={{ width: 48, height: 48 }}
          />
          <span className="font-star-jedi text-white tracking-widest text-lg">
            DRAKE ACADEMY
          </span>
        </Link>

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
              {link.cta ? (
                <CtaButton
                  href={link.href}
                  variant="blue"
                  className="font-display text-sm uppercase tracking-[0.08em] px-4 py-2"
                  title="Contáctanos"
                >
                  {link.label}
                </CtaButton>
              ) : (
                <a
                  href={link.href}
                  className={`font-display text-sm uppercase tracking-[0.08em] transition-colors duration-200 text-white hover:text-[var(--color-yellow)] ${
                    activeSection === link.href.slice(1)
                      ? "navbar__link--active"
                      : ""
                  }`}
                  {...(activeSection === link.href.slice(1)
                    ? { "aria-current": "page" as const }
                    : {})}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile menu overlay — suppressHydrationWarning: inert attribute is
            applied client-only via feature detection (SPEC-FAWS-009) */}
        <div
          ref={menuRef}
          className="fixed top-0 w-[75%] max-w-xs h-full bg-[var(--color-black-2)] flex flex-col justify-center items-center gap-8 z-[1000] transition-[right] duration-300 ease-out md:hidden"
          style={{ right: menuOpen ? "0" : "-100%" }}
          suppressHydrationWarning
          {...(menuOpen
            ? {
                role: "dialog" as const,
                "aria-modal": "true" as const,
                "aria-label": "Menú de navegación",
              }
            : {
                "aria-hidden": true,
                ...(supportsInert
                  ? { inert: true }
                  : { tabIndex: -1 }),
              })}
        >
          {/* Close button */}
          <button
            onClick={closeMenu}
            className="absolute top-4 right-4 text-white text-3xl w-10 h-10 flex items-center justify-center hover:text-[var(--color-yellow)] transition-colors"
            aria-label="Cerrar menú"
          >
            ×
          </button>

          {NAV_LINKS.map((link, index) => (
            link.cta ? (
              <CtaButton
                key={link.href}
                href={link.href}
                variant="blue"
                className={`font-display text-lg uppercase tracking-[0.08em] px-6 py-3 active:opacity-70`}
                onClick={closeMenu}
                ref={index === 0 ? firstLinkRef : undefined}
                title="Contáctanos"
              >
                {link.label}
              </CtaButton>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                ref={index === 0 ? firstLinkRef : undefined}
                className={`font-display text-lg uppercase tracking-[0.08em] transition-colors duration-200 active:opacity-70 text-white hover:text-[var(--color-yellow)] ${
                  activeSection === link.href.slice(1)
                    ? "navbar__link--active"
                    : ""
                }`}
                {...(activeSection === link.href.slice(1)
                  ? { "aria-current": "page" as const }
                  : {})}
              >
                {link.label}
              </a>
            )
          ))}
        </div>

        {/* Backdrop for mobile menu */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-[999] bg-black/50"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </div>
    </nav>
  );
}
