interface ReportsViewProps {
  title: string;
  subtitle: string;
  roleLabel: string;
}

export default function ReportsView({
  title,
  subtitle,
  roleLabel,
}: ReportsViewProps) {
  return (
    <div className="space-y-lg">
      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
        <div className="flex flex-col gap-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-label-sm uppercase tracking-widest text-on-surface-variant">
              {roleLabel}
            </p>
            <h2 className="font-headline-lg-mobile text-on-surface">{title}</h2>
            <p className="mt-sm text-body-md text-on-surface-variant">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-md py-sm font-label-sm text-on-primary transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined">download</span>
            Exportar reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">co2</span>
            <h3 className="font-headline-lg-mobile text-on-surface">
              CO₂ evitado
            </h3>
          </div>
          <p className="mt-md text-display-lg text-primary">42.5 kg</p>
          <p className="mt-sm text-body-md text-on-surface-variant">
            Estimación acumulada del período.
          </p>
        </article>

        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary">
              scale
            </span>
            <h3 className="font-headline-lg-mobile text-on-surface">
              Volumen gestionado
            </h3>
          </div>
          <p className="mt-md text-display-lg text-secondary">1.284 ton</p>
          <p className="mt-sm text-body-md text-on-surface-variant">
            Toneladas procesadas y registradas.
          </p>
        </article>

        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-tertiary">
              analytics
            </span>
            <h3 className="font-headline-lg-mobile text-on-surface">
              Tasa de circularidad
            </h3>
          </div>
          <p className="mt-md text-display-lg text-tertiary">87%</p>
          <p className="mt-sm text-body-md text-on-surface-variant">
            Índice de aprovechamiento del material.
          </p>
        </article>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
        <div className="mb-md flex items-center justify-between">
          <h3 className="font-headline-lg-mobile text-on-surface">
            Resumen del período
          </h3>
          <span className="font-label-sm text-on-surface-variant">
            Últimos 30 días
          </span>
        </div>
        <div className="grid grid-cols-1 gap-md md:grid-cols-2">
          <div className="rounded-lg bg-surface-container-low p-md">
            <p className="font-label-sm text-on-surface-variant">
              Solicitudes activas
            </p>
            <p className="mt-sm text-headline-lg-mobile text-on-surface">24</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-md">
            <p className="font-label-sm text-on-surface-variant">
              Recolecciones completadas
            </p>
            <p className="mt-sm text-headline-lg-mobile text-on-surface">18</p>
          </div>
        </div>
      </div>
    </div>
  );
}
