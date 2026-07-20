import Image from "next/image";
import Link from "next/link";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt="Drake Academy"
            width={48}
            height={48}
            className=""
          />
          <span className="font-display text-white tracking-widest text-lg">
            DRAKE ACADEMY
          </span>
          </Link>

        <NavbarClient />
      </div>
    </nav>
  );
}
