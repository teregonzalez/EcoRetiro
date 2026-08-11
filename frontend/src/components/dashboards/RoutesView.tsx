export default function RoutesView() {
  return (
    <div className="relative min-h-[calc(100vh-180px)] overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-lg">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          alt="Mapa de rutas"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC82W5E7AhUzpv5NRItDqsX3HQjV2FW1M5wBD180W6Zq9BTg4HGlDBBMpEb6H3EvIb57kWKDMKPtbLw4Z1bkstvQ8xm4aq9KMiNc5LMFdqGp25L4slaCTeZdaSQWabMC1v8NbwLiy_R4OybEQHQcz2zchYrNO_Wcq83ehpROQXi5TNdDxE7wUCqWFCYCz_6cvqc9UyemlWtDb00nh0BRTV24Z6Y0ho7_dUnAwHyAyJTr4BfX1OlWW_3"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low/80 via-surface/50 to-surface-container-lowest/70" />
      </div>

      <div className="relative z-10 flex h-full flex-col gap-md p-margin lg:flex-row">
        <section className="w-full max-w-[420px] rounded-2xl border border-outline-variant/70 bg-surface/90 p-md shadow-lg backdrop-blur-md lg:h-full">
          <div className="mb-md flex items-center justify-between">
            <div>
              <h2 className="font-headline-lg-mobile text-on-surface">
                Rutas activas
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Gestionando recolección en sector sur.
              </p>
            </div>
            <span className="rounded-full bg-primary-container px-3 py-1 font-label-sm text-on-primary-container">
              El Bosque
            </span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: "R-305",
                status: "En Tránsito",
                statusClass: "bg-tertiary-fixed text-on-tertiary-fixed",
                driver: "Carlos Mendoza",
                route: "Hacia: Gran Avenida P.30",
                eta: "ETA: 12 min",
              },
              {
                id: "R-308",
                status: "Cargando",
                statusClass:
                  "bg-secondary-container text-on-secondary-container",
                driver: "Ana Rojas",
                route: "Punto: Alejandro Guzmán 1200",
                eta: "ETA: --",
              },
              {
                id: "R-299",
                status: "Completada",
                statusClass: "bg-surface-variant text-on-surface-variant",
                driver: "Luis Torres",
                route: "Sector: Padre Hurtado Sur",
                eta: "14:30",
              },
            ].map((route) => (
              <div
                key={route.id}
                className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-on-surface">
                      {route.id}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-label-sm ${route.statusClass}`}
                    >
                      {route.status}
                    </span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant">
                    {route.eta}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container">
                    <span className="material-symbols-outlined text-[16px]">
                      person
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-label-sm text-on-surface">
                      {route.driver}
                    </p>
                    <p className="truncate text-[13px] text-on-surface-variant">
                      {route.route}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1">
          <div className="ml-auto flex max-w-[320px] flex-col gap-md rounded-2xl border border-outline-variant/70 bg-surface/90 p-md shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="font-label-sm uppercase tracking-wider text-on-surface-variant">
                Estado de flota
              </h3>
              <span className="material-symbols-outlined text-primary">
                speed
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-display-lg tracking-tighter text-primary">
                92
              </span>
              <span className="mb-2 font-headline-lg text-primary">%</span>
            </div>
            <p className="-mt-2 text-body-md text-on-surface-variant">
              Eficiencia operativa hoy
            </p>
            <div className="mt-2 flex gap-2">
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-surface-container p-3">
                <span className="font-headline-lg text-on-surface">8</span>
                <span className="text-center text-[10px] font-label-sm text-on-surface-variant">
                  Activos
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-error-container p-3">
                <span className="font-headline-lg text-on-error-container">
                  2
                </span>
                <span className="text-center text-[10px] font-label-sm text-on-error-container">
                  Mantenimiento
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
