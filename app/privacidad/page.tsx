import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Starfield from "@/app/components/Starfield";
import { ACADEMY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Aviso de Privacidad — Ludo Sport Drake Academy",
  description:
    "Aviso de Privacidad de Ludo Sport Drake Academy. Conoce cómo tratamos tus datos personales conforme a la LFPDPPP.",
};

export default function PrivacidadPage(): React.JSX.Element {
  return (
    <>
      <Starfield />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] tracking-wider mb-2">
            AVISO DE PRIVACIDAD
          </h1>
          <p className="font-body text-sm text-[var(--color-gray-aa)] mb-10">
            Última actualización: 30 de julio de 2026
          </p>

          <div className="space-y-8 font-body text-white/85 leading-relaxed text-justify">
            {/* 1. Responsable */}
            <section>
              <h2 className="font-display text-xl text-[var(--color-yellow)] uppercase tracking-wider mb-3">
                1. Identidad del Responsable
              </h2>
              <p>
                {ACADEMY.name} (en adelante &ldquo;Drake Academy&rdquo;), con
                domicilio en {ACADEMY.address}, C.P. {ACADEMY.cp}, es el
                responsable del tratamiento de los datos personales que se
                recaben a través de este sitio web, de conformidad con la Ley
                Federal de Protección de Datos Personales en Posesión de los
                Particulares (LFPDPPP) y su Reglamento.
              </p>
            </section>

            {/* 2. Datos recabados */}
            <section>
              <h2 className="font-display text-xl text-[var(--color-yellow)] uppercase tracking-wider mb-3">
                2. Datos Personales Recabados
              </h2>
              <p>
                A través de este sitio web recabamos de forma automática
                información de uso mediante cookies de Google Analytics, la
                cual incluye:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Páginas visitadas y tiempo de navegación.</li>
                <li>Tipo de dispositivo, navegador y sistema operativo.</li>
                <li>Ubicación geográfica aproximada (ciudad/país).</li>
                <li>Fuente de tráfico (cómo llegaste al sitio).</li>
              </ul>
              <p className="mt-3">
                Esta información es anónima y no permite identificarte
                personalmente. No recabamos nombre, correo electrónico ni
                ningún otro dato que te identifique de forma directa a menos
                que tú nos lo proporciones voluntariamente al contactarnos
                por WhatsApp.
              </p>
            </section>

            {/* 3. Finalidad */}
            <section>
              <h2 className="font-display text-xl text-[var(--color-yellow)] uppercase tracking-wider mb-3">
                3. Finalidad del Tratamiento
              </h2>
              <p>Los datos recabados se utilizan para las siguientes finalidades:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  <strong className="text-white">Finalidad principal:</strong>{" "}
                  analizar el tráfico del sitio web para mejorar la experiencia
                  de navegación, el contenido y los servicios ofrecidos.
                </li>
                <li>
                  <strong className="text-white">Finalidades secundarias:</strong>{" "}
                  medir el alcance de la academia en buscadores, evaluar el
                  interés en nuestras actividades, y optimizar la comunicación
                  con usuarios interesados.
                </li>
              </ul>
            </section>

            {/* 4. Cookies */}
            <section>
              <h2 className="font-display text-xl text-[var(--color-yellow)] uppercase tracking-wider mb-3">
                4. Uso de Cookies
              </h2>
              <p>
                Utilizamos cookies propias de Google Analytics (_ga, _ga_*)
                para fines estadísticos. Estas cookies no almacenan
                información personal identificable y son establecidas
                directamente por Google.
              </p>
              <p className="mt-3">
                Puedes desactivar las cookies en cualquier momento desde la
                configuración de tu navegador. Consulta los siguientes enlaces
                según tu navegador:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-cyan)] hover:underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-cyan)] hover:underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/es-mx/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-cyan)] hover:underline"
                  >
                    Safari
                  </a>
                </li>
              </ul>
              <p className="mt-3">
                También puedes instalar el{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-cyan)] hover:underline"
                >
                  complemento de inhabilitación de Google Analytics
                </a>{" "}
                para impedir que tus datos sean utilizados por GA4 en todos los
                sitios.
              </p>
            </section>

            {/* 5. Derechos ARCO */}
            <section>
              <h2 className="font-display text-xl text-[var(--color-yellow)] uppercase tracking-wider mb-3">
                5. Derechos ARCO
              </h2>
              <p>
                Conforme a la LFPDPPP, tienes derecho a Acceder, Rectificar,
                Cancelar u Oponerte al tratamiento de tus datos personales
                (derechos ARCO). Dado que no recabamos datos personales
                identificables de forma directa, si deseas ejercer estos
                derechos o tienes alguna duda sobre el tratamiento de tu
                información, puedes contactarnos en:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  WhatsApp:{" "}
                  <a
                    href={ACADEMY.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-cyan)] hover:underline"
                  >
                    {ACADEMY.whatsapp}
                  </a>
                </li>
                <li>
                  Facebook:{" "}
                  <a
                    href={ACADEMY.sameAs.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-cyan)] hover:underline"
                  >
                    ludosportdrake
                  </a>
                </li>
              </ul>
            </section>

            {/* 6. Transferencia */}
            <section>
              <h2 className="font-display text-xl text-[var(--color-yellow)] uppercase tracking-wider mb-3">
                6. Transferencia de Datos
              </h2>
              <p>
                Drake Academy no transfiere, vende ni comparte datos
                personales con terceros, salvo aquellos necesarios para el
                funcionamiento del servicio de analítica (Google LLC), el
                cual opera bajo sus propios términos y políticas de
                privacidad.
              </p>
            </section>

            {/* 7. Cambios */}
            <section>
              <h2 className="font-display text-xl text-[var(--color-yellow)] uppercase tracking-wider mb-3">
                7. Cambios al Aviso de Privacidad
              </h2>
              <p>
                Cualquier modificación a este aviso será publicada en esta
                misma página. Te recomendamos revisarlo periódicamente.
                La fecha de última actualización se indica al inicio del
                documento.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
