import type { Metadata } from "next";
import { Anton, Pathway_Gothic_One } from "next/font/google";
import { generateLocalBusiness } from "@/lib/json-ld";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const pathwayGothicOne = Pathway_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Ludo Sport Drake Academy — Esgrima con Sables de Madera",
  description:
    "Academia de esgrima deportiva con sables de madera. Clases para niños y jóvenes en San Luis Río Colorado. Primer clase gratis.",
  openGraph: {
    title: "Ludo Sport Drake Academy — Esgrima con Sables de Madera",
    description:
      "Academia de esgrima deportiva con sables de madera. Clases para niños y jóvenes en San Luis Río Colorado. Primer clase gratis.",
    locale: "es_MX",
    type: "website",
    url: "https://ludosport.com",
    siteName: "Ludo Sport Drake Academy",
    images: [
      {
        url: "https://ludosport.com/logo.jpeg",
        width: 800,
        height: 800,
        alt: "Ludo Sport Drake Academy",
      },
    ],
  },
  other: {
    "geo.region": "MX-SON",
    "geo.placename": "San Luis Río Colorado",
    "geo.position": "32.452;-114.7635",
    ICBM: "32.452, -114.7635",
    "places:location": "32.452,-114.7635",
    "twitter:card": "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateLocalBusiness();
  return (
    <html
      lang="es"
      className={`${anton.variable} ${pathwayGothicOne.variable}`}
    >
      <body className="bg-black text-[rgba(255,232,31,0.85)] min-h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
        {children}
      </body>
    </html>
  );
}
