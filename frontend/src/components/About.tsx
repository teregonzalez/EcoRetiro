export default function About() {
  return (
    <>
      {/* Sección Hero de Sobre Nosotros */}
      <section className="py-xl px-margin bg-surface-container-low">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-tertiary-fixed text-on-primary-fixed font-label-sm text-label-sm mb-md uppercase tracking-widest">
            Nuestra Historia
          </span>
          <h1 className="font-display-lg text-display-lg text-primary mb-md">
            Sobre Nosotros
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-lg max-w-2xl mx-auto mb-xl leading-relaxed">
            Somos una plataforma dedicada a promover la{" "}
            <strong>simbiosis industrial</strong>. Nuestra misión es conectar a
            las pymes locales con empresas de reciclaje para transformar sus
            residuos en recursos valiosos, optimizando procesos y reduciendo la
            huella de carbono.
          </p>
        </div>
      </section>

      {/* Sección de Valores */}
      <section className="py-xl px-margin bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-xl">
            Nuestros Valores
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {/* Sostenibilidad */}
            <div className="bg-surface-container-low p-xl rounded-xl border border-outline-variant/30 hover:shadow-md transition-all">
              <span
                className="material-symbols-outlined text-[48px] text-tertiary-fixed-dim mb-md block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-md">
                Sostenibilidad
              </h3>
              <p className="font-body-md text-on-surface-variant">
                Promovemos prácticas que cuidan el planeta y garantizan un
                futuro regenerativo para las próximas generaciones.
              </p>
            </div>

            {/* Transparencia */}
            <div className="bg-surface-container-low p-xl rounded-xl border border-outline-variant/30 hover:shadow-md transition-all">
              <span
                className="material-symbols-outlined text-[48px] text-secondary-fixed-dim mb-md block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                visibility
              </span>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-md">
                Transparencia
              </h3>
              <p className="font-body-md text-on-surface-variant">
                Trazabilidad completa de cada residuo y datos abiertos sobre
                nuestro impacto ambiental.
              </p>
            </div>

            {/* Innovación */}
            <div className="bg-surface-container-low p-xl rounded-xl border border-outline-variant/30 hover:shadow-md transition-all">
              <span
                className="material-symbols-outlined text-[48px] text-tertiary mb-md block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lightbulb
              </span>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-md">
                Innovación
              </h3>
              <p className="font-body-md text-on-surface-variant">
                Tecnología de precisión para optimizar la economía circular y
                conectar industrias de forma inteligente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Impacto */}
      <section className="py-xl px-margin bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-xl">
            Nuestro Impacto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-md text-center">
            <div className="p-md">
              <div className="font-display-lg text-primary font-bold mb-xs">
                2,500+
              </div>
              <p className="font-body-md text-on-surface-variant">
                Toneladas Recicladas
              </p>
            </div>
            <div className="p-md">
              <div className="font-display-lg text-primary font-bold mb-xs">
                180+
              </div>
              <p className="font-body-md text-on-surface-variant">
                Empresas Conectadas
              </p>
            </div>
            <div className="p-md">
              <div className="font-display-lg text-primary font-bold mb-xs">
                450k
              </div>
              <p className="font-body-md text-on-surface-variant">
                CO₂ Ahorrado (Tons)
              </p>
            </div>
            <div className="p-md">
              <div className="font-display-lg text-primary font-bold mb-xs">
                5+
              </div>
              <p className="font-body-md text-on-surface-variant">
                Años de Impacto
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
