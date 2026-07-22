"use client";

import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { ACADEMY } from "@/lib/constants";

export default function MapSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;

      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [ACADEMY.coordinates.lat, ACADEMY.coordinates.lng],
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });
      mapRef.current = map;

      // CARTO Dark Matter tiles — free, no API key, dark themed.
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        },
      ).addTo(map);

      // Custom saber-themed marker — keeps brand palette, no broken default icon
      const markerIcon = L.divIcon({
        className: "ludosport-marker",
        html: `
          <svg width="34" height="34" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="17" cy="17" r="15" fill="rgba(220,53,69,0.25)" stroke="#ffe81f" stroke-width="1" opacity="0.7"/>
            <circle cx="17" cy="17" r="5" fill="#dc3545" stroke="#ffe81f" stroke-width="1.5"/>
          </svg>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -16],
      });

      L.marker([ACADEMY.coordinates.lat, ACADEMY.coordinates.lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(
          '<strong>Drake Academy</strong><br/>LudoSport San Luis Río Colorado',
        );

      // Hide spinner once Leaflet has its first render
      map.whenReady(() => setLoaded(true));
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
      }
      mapRef.current = null;
    };
  }, []);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-sm overflow-hidden border border-white/[0.06] relative">
          {!loaded && (
            <div
              className="absolute inset-0 z-10 bg-black flex items-center justify-center"
              role="status"
              aria-live="polite"
            >
              <div className="w-6 h-6 border-2 border-white/20 border-t-[var(--color-cyan)] rounded-full animate-spin" />
              <span className="sr-only">Cargando mapa...</span>
            </div>
          )}
          <div
            ref={containerRef}
            className="h-[380px] w-full bg-black"
            aria-label="Mapa: ubicación de Drake Academy en San Luis Río Colorado"
            role="application"
          />
        </div>
      </div>
    </section>
  );
}