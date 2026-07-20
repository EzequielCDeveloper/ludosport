export default function MapSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-sm overflow-hidden border border-white/[0.06]">
          <iframe
            src="https://maps.google.com/maps?q=32.461111,-114.795667&z=15&output=embed"
            width="100%"
            height="380"
            style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Drake Academy"
          />
        </div>
      </div>
    </section>
  );
}
