import Image from "next/image";
import { ACADEMY, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#1a1a1a] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.jpeg"
                alt=""
                width={32}
                height={32}
                className=""
              />
              <span className="font-display text-white tracking-wider">
                DRAKE ACADEMY
              </span>
            </div>
            <p className="font-body text-sm text-[var(--color-gray-aa)] italic">
              &ldquo;El verdadero dominio comienza con el dominio de uno
              mismo.&rdquo;
            </p>
          </div>

          {/* Navigation links */}
          <div>
            <ul className="flex flex-wrap justify-center gap-5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-display text-sm text-[var(--color-gray-aa)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-sm text-[var(--color-gray-aa)]">
              WhatsApp: +52 653 164 9951
            </p>
            <p className="font-body text-sm text-[var(--color-gray-aa)] mt-1">
              {ACADEMY.address}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#1a1a1a] pt-8 text-center">
          <p className="font-body text-xs text-[var(--color-gray-aa)]">
            &copy; 2026 Ludo Sport Drake Academy. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
