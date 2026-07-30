import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// 'unsafe-eval' is required by Next.js HMR and source maps in development.
// It is excluded from production builds via the isDev guard below.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://*.basemaps.cartocdn.com https://*.openstreetmap.org;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;${isDev ? "" : " report-uri /csp-violations;"}
`;

const nextConfig: NextConfig = {
  images: {},
  poweredByHeader: false,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains",
        },
        {
          key: "Content-Security-Policy",
          value: cspHeader.replace(/\s{2,}/g, " ").trim(),
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), accelerometer=(), autoplay=(), fullscreen=(self), gyroscope=(), magnetometer=(), payment=()",
        },
      ],
    },
  ],
};

export default nextConfig;
