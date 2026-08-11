import type { PymeHistoryRow, PymeProfile } from "../../api/dashboard";

interface PymeWasteSpotlightViewProps {
  entry: PymeHistoryRow | null;
  profile: PymeProfile | null;
}

const CHILE_TIMEZONE = "America/Santiago";

const formatDetailDate = (rawDate: string | null) => {
  if (!rawDate) return "Sin fecha de disponibilidad";

  const normalized = rawDate.trim();
  if (!normalized) return "Sin fecha de disponibilidad";

  const dateOnlyMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  let date: Date;

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    date = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0),
    );
  } else {
    date = new Date(normalized);
  }

  if (Number.isNaN(date.getTime())) return rawDate;

  return date.toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: CHILE_TIMEZONE,
  });
};

const normalizeAmount = (value: number, unit: string) => {
  if (unit.toLowerCase() === "ton") {
    return {
      value: value.toFixed(1),
      unit: "Ton",
    };
  }

  if (value >= 1000) {
    return {
      value: (value / 1000).toFixed(1),
      unit: "Ton",
    };
  }

  return {
    value: value.toFixed(1),
    unit,
  };
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case "Gestionado":
      return "bg-primary-fixed/30 text-primary";
    case "En camino":
      return "bg-secondary-container text-on-secondary-container";
    default:
      return "bg-error-container/60 text-on-error-container";
  }
};

export default function PymeWasteSpotlightView({
  entry,
  profile,
}: PymeWasteSpotlightViewProps) {
  if (!entry) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-center shadow-sm">
        <span className="material-symbols-outlined text-[48px] text-outline-variant">
          inventory_2
        </span>
        <h3 className="mt-md font-headline-lg-mobile text-on-surface">
          No hay residuos para mostrar
        </h3>
        <p className="mt-sm text-on-surface-variant">
          Cuando registres un residuo, aqui veras su detalle completo.
        </p>
      </div>
    );
  }

  const amount = normalizeAmount(entry.cantidad, entry.unidad);
  const generatorName = profile?.empresa || "Empresa generadora";
  const statusClasses = getStatusClasses(entry.estado);
  const availabilityDate = formatDetailDate(entry.fecha);
  const routeLabel = profile?.ubicacion || "Ubicacion pendiente";

  return (
    <div className="relative">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-lg">
        <div className="flex flex-col justify-between gap-md md:flex-row md:items-center">
          <div className="flex items-center gap-sm text-on-surface-variant">
            <span className="font-label-sm hover:text-secondary">Map View</span>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <span className="font-label-sm text-on-surface">
              Detalle: WR-{entry.id}
            </span>
          </div>

          <div className="flex flex-wrap gap-sm">
            <button className="flex items-center gap-xs rounded-lg bg-surface-container px-md py-sm font-label-sm text-on-surface transition-colors hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-[18px]">
                share
              </span>
              Share
            </button>
            <button className="flex items-center gap-xs rounded-lg bg-surface-container px-md py-sm font-label-sm text-on-surface transition-colors hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-[18px]">
                print
              </span>
              Print Manifest
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
          <div className="flex flex-col gap-gutter lg:col-span-8">
            <section className="group relative overflow-hidden rounded-xl bg-surface-container-lowest p-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
              <div className="absolute left-0 top-0 h-full w-2 bg-secondary" />

              <div className="relative z-10 flex flex-col justify-between gap-lg md:flex-row md:items-start">
                <div>
                  <div className="mb-md flex flex-wrap items-center gap-sm">
                    <div className="flex items-center gap-xs rounded-full bg-secondary-container px-sm py-xs font-label-sm uppercase text-on-secondary-container">
                      <span className="material-symbols-outlined text-[16px]">
                        category
                      </span>
                      {entry.tipo}
                    </div>
                    <div
                      className={`rounded-full px-sm py-xs font-label-sm uppercase ${statusClasses}`}
                    >
                      {entry.estado}
                    </div>
                  </div>

                  <h1 className="mb-xs font-display-lg tracking-tight text-on-surface">
                    {routeLabel}
                  </h1>
                  <p className="flex items-center gap-xs font-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">
                      factory
                    </span>
                    Generator: {generatorName}
                  </p>
                </div>

                <div className="flex min-w-[140px] flex-col items-center justify-center rounded-xl bg-surface-container-low p-md shadow-sm transition-transform group-hover:scale-105">
                  <span className="mb-xs font-label-sm uppercase tracking-widest text-on-surface-variant">
                    Est. Weight
                  </span>
                  <span className="font-headline-lg text-secondary">
                    {amount.value}
                  </span>
                  <span className="font-label-sm text-on-surface-variant">
                    {amount.unit}
                  </span>
                </div>
              </div>

              <div className="relative mt-lg grid grid-cols-2 gap-md pt-lg md:grid-cols-4">
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />

                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm uppercase text-on-surface-variant">
                    Quality Grade
                  </span>
                  <div className="flex items-center gap-xs font-headline-lg-mobile text-on-surface">
                    <span className="text-tertiary-fixed-dim">
                      {entry.estado === "Gestionado"
                        ? "A"
                        : entry.estado === "En camino"
                          ? "B"
                          : "C"}
                    </span>
                    <span className="text-sm font-normal text-on-surface-variant">
                      Trazabilidad activa
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm uppercase text-on-surface-variant">
                    Contamination
                  </span>
                  <div className="flex items-center gap-xs font-headline-lg-mobile text-on-surface">
                    <span className="h-2 w-2 rounded-full bg-inverse-primary" />
                    <span className="text-sm font-normal">
                      Sin incidencias reportadas
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm uppercase text-on-surface-variant">
                    Packaging
                  </span>
                  <div className="flex items-center gap-xs font-headline-lg-mobile text-on-surface">
                    <span className="material-symbols-outlined text-outline">
                      view_in_ar
                    </span>
                    <span className="text-sm font-normal">
                      Unidad declarada: {entry.unidad}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm uppercase text-on-surface-variant">
                    Density
                  </span>
                  <div className="flex items-center gap-xs font-headline-lg-mobile text-on-surface">
                    <span className="text-sm font-normal">
                      Disponibilidad: {availabilityDate}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-gutter md:grid-cols-2">
              <article className="flex h-full flex-col rounded-xl bg-surface-container-lowest p-md shadow-sm transition-shadow hover:shadow-md">
                <h3 className="mb-md font-headline-lg-mobile text-on-surface">
                  Material Comp.
                </h3>

                <div className="flex flex-1 flex-col justify-center">
                  <div className="relative mx-auto mb-md aspect-square w-full max-w-[200px]">
                    <svg
                      className="h-full w-full -rotate-90 transform"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        className="text-surface-container"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="12"
                      />
                      <circle
                        className="text-secondary drop-shadow-sm"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeDasharray="213 251.2"
                        strokeWidth="12"
                      />
                      <circle
                        className="text-secondary-fixed-dim"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeDasharray="25 251.2"
                        strokeDashoffset="-213"
                        strokeWidth="12"
                      />
                      <circle
                        className="text-outline-variant"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeDasharray="13.2 251.2"
                        strokeDashoffset="-238"
                        strokeWidth="12"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-headline-lg text-on-surface">
                        {entry.cantidad.toFixed(0)}
                      </span>
                      <span className="font-label-sm text-on-surface-variant">
                        {entry.unidad}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-xs">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-xs">
                        <span className="h-3 w-3 rounded-sm bg-secondary" />{" "}
                        Tipo principal
                      </span>
                      <span className="font-bold">{entry.tipo}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-xs">
                        <span className="h-3 w-3 rounded-sm bg-secondary-fixed-dim" />{" "}
                        Estado
                      </span>
                      <span className="font-bold">{entry.estado}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-xs">
                        <span className="h-3 w-3 rounded-sm bg-outline-variant" />{" "}
                        Solicitud
                      </span>
                      <span className="font-bold">WR-{entry.id}</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="group relative overflow-hidden rounded-xl bg-surface-container-lowest p-md shadow-sm">
                <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary-container/10 blur-2xl transition-colors group-hover:bg-primary-container/20" />

                <h3 className="flex items-center gap-sm font-headline-lg-mobile text-on-surface">
                  <span className="material-symbols-outlined text-primary">
                    eco
                  </span>
                  Impact Preview
                </h3>
                <p className="mt-sm font-body-md text-on-surface-variant">
                  Estimated environmental value recovered from this lot.
                </p>

                <div className="relative z-10 mt-md flex flex-col gap-sm">
                  <div className="flex items-center justify-between rounded-lg border border-transparent bg-surface p-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] transition-colors hover:border-outline-variant/30">
                    <div className="flex items-center gap-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[20px]">
                          co2
                        </span>
                      </div>
                      <div>
                        <span className="font-label-sm text-on-surface-variant">
                          CO2 Avoided
                        </span>
                        <p className="font-bold text-on-surface">
                          {(entry.cantidad * 0.18).toFixed(2)} kg
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-transparent bg-surface p-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] transition-colors hover:border-outline-variant/30">
                    <div className="flex items-center gap-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                        <span className="material-symbols-outlined text-[20px]">
                          water_drop
                        </span>
                      </div>
                      <div>
                        <span className="font-label-sm text-on-surface-variant">
                          Water Saved
                        </span>
                        <p className="font-bold text-on-surface">
                          {(entry.cantidad * 12).toFixed(0)} L
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section className="flex flex-col gap-md rounded-xl bg-surface-container-lowest p-md shadow-sm">
              <div className="flex items-center justify-between gap-sm">
                <h3 className="font-headline-lg-mobile text-on-surface">
                  Location &amp; Access
                </h3>
                <button className="flex items-center gap-xs rounded px-sm py-xs font-label-sm text-secondary transition-colors hover:bg-secondary/5">
                  <span className="material-symbols-outlined text-[16px]">
                    open_in_new
                  </span>
                  Full Map
                </button>
              </div>

              <div className="relative h-64 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_top,#d9e2ff_0%,#c8d3eb_22%,#adc1de_40%,#91a8c4_60%,#7c8fa7_100%)] shadow-inner">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.45),transparent_28%),radial-gradient(circle_at_70%_60%,rgba(0,69,13,0.16),transparent_32%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <span
                      className="material-symbols-outlined text-[52px] text-error"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      location_on
                    </span>
                    <div className="absolute bottom-0 left-1/2 h-1 w-4 -translate-x-1/2 rounded-[100%] bg-black/30 blur-[2px]" />
                  </div>
                </div>
              </div>

              <div className="mt-xs flex items-start gap-sm">
                <span className="material-symbols-outlined mt-1 text-outline">
                  info
                </span>
                <p className="font-label-sm leading-relaxed text-on-surface-variant">
                  {profile?.ubicacion
                    ? `Punto de retiro registrado en ${profile.ubicacion}. Coordina el acceso y las condiciones de carga antes del retiro.`
                    : "La empresa aun no registra una ubicacion detallada para este retiro."}
                </p>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-gutter lg:col-span-4">
            <section className="overflow-hidden rounded-xl bg-surface-container-lowest p-md shadow-md">
              <h3 className="mb-md font-headline-lg-mobile text-on-surface">
                Logistics
              </h3>
              <div className="relative space-y-md before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-outline-variant/40">
                <div className="relative z-10 flex gap-sm">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-surface-container-lowest">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm uppercase text-secondary">
                      Registered
                    </span>
                    <span className="font-body-md font-medium text-on-surface">
                      {availabilityDate}
                    </span>
                    <span className="mt-xs text-sm text-on-surface-variant">
                      Disponibilidad comprometida para retiro.
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex gap-sm">
                  <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-outline-variant bg-surface-container-lowest" />
                  <div className="flex flex-col">
                    <span className="font-label-sm uppercase text-on-surface-variant">
                      Proximity
                    </span>
                    <span className="font-body-md font-medium text-on-surface">
                      {profile?.ubicacion || "Ubicacion pendiente"}
                    </span>
                    <span className="mt-xs text-sm text-on-surface-variant">
                      Contacto: {profile?.contacto || "Sin contacto"}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex gap-sm">
                  <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-outline-variant bg-surface-container-lowest" />
                  <div className="flex flex-col">
                    <span className="font-label-sm uppercase text-on-surface-variant">
                      Pickup Window
                    </span>
                    <span className="font-body-md font-medium text-on-surface">
                      Estado: {entry.estado}
                    </span>
                    <span className="mt-xs text-sm text-on-surface-variant">
                      Telefono: {profile?.telefono || "No informado"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex items-center gap-md rounded-xl bg-surface-container-lowest p-md shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
                <span className="material-symbols-outlined">domain</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm uppercase text-on-surface-variant">
                  Generator
                </span>
                <span className="font-body-md font-bold text-on-surface">
                  {generatorName}
                </span>
                <div className="mt-xs flex items-center gap-xs text-sm">
                  <span
                    className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="font-bold text-on-surface">
                    {entry.estado === "Gestionado"
                      ? "4.8"
                      : entry.estado === "En camino"
                        ? "4.4"
                        : "4.1"}
                  </span>
                  <span className="text-on-surface-variant">
                    (solicitud WR-{entry.id})
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
