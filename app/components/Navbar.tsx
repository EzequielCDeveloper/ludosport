import Image from "next/image";
import Link from "next/link";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 w-full z-50 bg-black transition-[background-color,box-shadow] duration-300"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt=""
            width={48}
            height={48}
            className=""
          />
          <span className="font-star-jedi text-white tracking-widest text-lg">
            DRAKE ACADEMY
          </span>
          </Link>

        <NavbarClient />
      </div>
    </nav>
  );
}
