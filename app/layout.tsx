import type { Metadata } from "next";
import { Anton, Exo_2 } from "next/font/google";
import { generateLocalBusiness } from "@/lib/json-ld";
import { ACADEMY } from "@/lib/constants";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const exo2 = Exo_2({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ludosport.com"),
  title: "Ludo Sport Drake Academy — Esgrima con Sables de Madera",
  description:
    "Academia de esgrima deportiva con sables de madera. Clases para niños y jóvenes en San Luis Río Colorado. Primer clase gratis.",
  applicationName: "Ludo Sport Drake Academy",
  keywords: [
    "esgrima deportiva",
    "sables de madera",
    "LudoSport",
    "Drake Academy",
    "San Luis Río Colorado",
    "clases de esgrima",
    "niños",
    "jóvenes",
    "academia deportiva",
    "Sonora",
  ],
  alternates: {
    canonical: "https://ludosport.com",
    languages: {
      "es-MX": "https://ludosport.com",
    },
  },
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
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "https://ludosport.com/logo.jpeg",
        alt: "Ludo Sport Drake Academy — Esgrima con Sables de Madera",
      },
    ],
  },
  other: {
    "geo.region": "MX-SON",
    "geo.placename": "San Luis Río Colorado",
    "geo.position": ACADEMY.coordinatesMeta,
    ICBM: ACADEMY.coordinatesICBM,
    "places:location": ACADEMY.coordinatesMeta.replace(";", ","),
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
      className={`${anton.variable} ${exo2.variable}`}
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
