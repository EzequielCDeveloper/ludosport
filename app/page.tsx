import SkipLink from "@/app/components/SkipLink";
import Starfield from "@/app/components/Starfield";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import MisionVision from "@/app/components/MisionVision";
import Valores from "@/app/components/Valores";
import Profesor from "@/app/components/Profesor";
import Actividades from "@/app/components/Actividades";
import Rangos from "@/app/components/Rangos";
import FAQs from "@/app/components/FAQs";
import CtaFinal from "@/app/components/CtaFinal";
import MapSection from "@/app/components/MapSection";
import Footer from "@/app/components/Footer";
import WhatsAppFloat from "@/app/components/WhatsAppFloat";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SkipLink />
      <Starfield />
      <Navbar />
      <Hero />
      <MisionVision />
      <Valores />
      <Profesor />
      <Actividades />
      <Rangos />
      <FAQs />
      <CtaFinal />
      <MapSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
