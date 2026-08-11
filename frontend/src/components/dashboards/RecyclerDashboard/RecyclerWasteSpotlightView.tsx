import type {
  RecyclerCollectionRow,
  RecyclerNearbyWaste,
} from "../../../api/dashboard";

interface RecyclerWasteSpotlightViewProps {
  waste: RecyclerNearbyWaste | null;
  historyEntry: RecyclerCollectionRow | null;
  onOpenCollection: (item: RecyclerNearbyWaste) => void;
}

const CHILE_TIMEZONE = "America/Santiago";

const formatDetailDate = (rawDate: string | null | undefined) => {
  if (!rawDate) return "Sin fecha programada";

  const normalized = rawDate.trim();
  if (!normalized) return "Sin fecha programada";

  const date = new Date(normalized);
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
    return { value: value.toFixed(1), unit: "Ton" };
  }

  if (value >= 1000) {
    return { value: (value / 1000).toFixed(1), unit: "Ton" };
  }

  return { value: value.toFixed(1), unit };
};

const getStatusLabel = (historyEntry: RecyclerCollectionRow | null) => {
  return historyEntry?.estado || "Disponible";
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case "Gestionado":
      return "bg-primary-fixed/30 text-primary";
    case "En camino":
      return "bg-secondary-container text-on-secondary-container";
    default:
      return "bg-tertiary-fixed text-on-tertiary-fixed";
  }
};

export default function RecyclerWasteSpotlightView({
  waste,
  historyEntry,
  onOpenCollection,
}: RecyclerWasteSpotlightViewProps) {
  if (!waste) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-center shadow-sm">
        <span className="material-symbols-outlined text-[48px] text-outline-variant">
          recycling
        </span>
        <h3 className="mt-md font-headline-lg-mobile text-on-surface">
          No hay residuos disponibles
        </h3>
        <p className="mt-sm text-on-surface-variant">
          Cuando existan materiales cercanos para retiro, aqui veras su detalle.
        </p>
      </div>
    );
  }

  const amount = normalizeAmount(waste.total, waste.unit);
  const status = getStatusLabel(historyEntry);
  const statusClasses = getStatusClasses(status);
  const schedule = formatDetailDate(historyEntry?.fecha);
  const origin = historyEntry?.origen || "Generador disponible en red local";

  return (
    <div className="relative">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-lg">
        <div className="flex flex-col justify-between gap-md md:flex-row md:items-center">
          <div className="flex items-center gap-sm text-on-surface-variant">
            <span className="font-label-sm hover:text-secondary">
              Red de retiro
            </span>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <span className="font-label-sm text-on-surface">
              Material: {waste.material}
            </span>
          </div>

          <div className="flex flex-wrap gap-sm">
            <button
              type="button"
              onClick={() => onOpenCollection(waste)}
              className="flex items-center gap-xs rounded-lg bg-secondary px-md py-sm font-label-sm text-white transition-colors hover:bg-secondary/90"
            >
              <span className="material-symbols-outlined text-[18px]">
                local_shipping
              </span>
              Gestionar retiro
            </button>
            <button className="flex items-center gap-xs rounded-lg bg-surface-container px-md py-sm font-label-sm text-on-surface transition-colors hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-[18px]">
                print
              </span>
              Imprimir ficha
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
                      {waste.material}
                    </div>
                    <div
                      className={`rounded-full px-sm py-xs font-label-sm uppercase ${statusClasses}`}
                    >
                      {status}
                    </div>
                  </div>

                  <h1 className="mb-xs font-display-lg tracking-tight text-on-surface">
                    {origin}
                  </h1>
                  <p className="flex items-center gap-xs font-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">
                      schedule
                    </span>
                    Ventana estimada: {schedule}
                  </p>
                </div>

                <div className="flex min-w-[140px] flex-col items-center justify-center rounded-xl bg-surface-container-low p-md shadow-sm transition-transform group-hover:scale-105">
                  <span className="mb-xs font-label-sm uppercase tracking-widest text-on-surface-variant">
                    Carga estimada
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
                    Prioridad
                  </span>
                  <div className="flex items-center gap-xs font-headline-lg-mobile text-on-surface">
                    <span className="text-tertiary-fixed-dim">
                      {waste.total >= 100 ? "A" : waste.total >= 25 ? "B" : "C"}
                    </span>
                    <span className="text-sm font-normal text-on-surface-variant">
                      Volumen operativo
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm uppercase text-on-surface-variant">
                    Disponibilidad
                  </span>
                  <div className="flex items-center gap-xs font-headline-lg-mobile text-on-surface">
                    <span className="h-2 w-2 rounded-full bg-inverse-primary" />
                    <span className="text-sm font-normal">
                      Lista para coordinacion
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm uppercase text-on-surface-variant">
                    Unidad
                  </span>
                  <div className="flex items-center gap-xs font-headline-lg-mobile text-on-surface">
                    <span className="material-symbols-outlined text-outline">
                      scale
                    </span>
                    <span className="text-sm font-normal">{waste.unit}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm uppercase text-on-surface-variant">
                    Seguimiento
                  </span>
                  <div className="flex items-center gap-xs font-headline-lg-mobile text-on-surface">
                    <span className="text-sm font-normal">{status}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-gutter md:grid-cols-2">
              <article className="flex h-full flex-col rounded-xl bg-surface-container-lowest p-md shadow-sm transition-shadow hover:shadow-md">
                <h3 className="mb-md font-headline-lg-mobile text-on-surface">
                  Resumen de carga
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
                        strokeDasharray="188 251.2"
                        strokeWidth="12"
                      />
                      <circle
                        className="text-secondary-fixed-dim"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeDasharray="38 251.2"
                        strokeDashoffset="-188"
                        strokeWidth="12"
                      />
                      <circle
                        className="text-outline-variant"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeDasharray="25.2 251.2"
                        strokeDashoffset="-226"
                        strokeWidth="12"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-headline-lg text-on-surface">
                        {waste.total.toFixed(0)}
                      </span>
                      <span className="font-label-sm text-on-surface-variant">
                        {waste.unit}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-xs">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-xs">
                        <span className="h-3 w-3 rounded-sm bg-secondary" />{" "}
                        Material
                      </span>
                      <span className="font-bold">{waste.material}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-xs">
                        <span className="h-3 w-3 rounded-sm bg-secondary-fixed-dim" />{" "}
                        Estado
                      </span>
                      <span className="font-bold">{status}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-xs">
                        <span className="h-3 w-3 rounded-sm bg-outline-variant" />{" "}
                        Origen
                      </span>
                      <span className="font-bold">
                        {historyEntry?.origen || "Red local"}
                      </span>
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
                  Impacto potencial
                </h3>
                <p className="mt-sm font-body-md text-on-surface-variant">
                  Estimacion operativa para priorizar este retiro.
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
                          CO2 recuperable
                        </span>
                        <p className="font-bold text-on-surface">
                          {(waste.total * 0.18).toFixed(2)} kg
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
                          Agua equivalente
                        </span>
                        <p className="font-bold text-on-surface">
                          {(waste.total * 12).toFixed(0)} L
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
                  Ubicacion y acceso
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
                  {historyEntry?.origen
                    ? `Origen operativo: ${historyEntry.origen}. Revisa accesos, ventanas de carga y prioridad antes de asignar la ruta.`
                    : "Material disponible en la red local. Coordina el retiro desde el modulo logistico para continuar."}
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
                      Programacion
                    </span>
                    <span className="font-body-md font-medium text-on-surface">
                      {schedule}
                    </span>
                    <span className="mt-xs text-sm text-on-surface-variant">
                      Disponible para coordinacion de retiro.
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex gap-sm">
                  <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-outline-variant bg-surface-container-lowest" />
                  <div className="flex flex-col">
                    <span className="font-label-sm uppercase text-on-surface-variant">
                      Origen
                    </span>
                    <span className="font-body-md font-medium text-on-surface">
                      {origin}
                    </span>
                    <span className="mt-xs text-sm text-on-surface-variant">
                      Seguimiento centralizado por material.
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex gap-sm">
                  <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-outline-variant bg-surface-container-lowest" />
                  <div className="flex flex-col">
                    <span className="font-label-sm uppercase text-on-surface-variant">
                      Estado
                    </span>
                    <span className="font-body-md font-medium text-on-surface">
                      {status}
                    </span>
                    <span className="mt-xs text-sm text-on-surface-variant">
                      Volumen: {waste.total.toFixed(2)} {waste.unit}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-secondary p-md text-on-secondary shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <div>
                <span className="mb-xs block font-label-sm uppercase tracking-widest text-secondary-fixed opacity-90">
                  Action Required
                </span>
                <h3 className="font-headline-lg-mobile font-bold leading-tight">
                  Claim Collection
                </h3>
              </div>
              <p className="mt-sm text-sm text-secondary-fixed opacity-90">
                Asigna este material a tu flujo logistico y continua con la
                solicitud de retiro.
              </p>

              <div className="mt-md flex flex-col gap-sm">
                <button
                  type="button"
                  onClick={() => onOpenCollection(waste)}
                  className="flex w-full items-center justify-center gap-xs rounded-lg bg-on-secondary py-3 font-label-sm text-secondary transition-colors hover:bg-surface-container-lowest"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    check_circle
                  </span>
                  Acepta esta ruta
                </button>
                <button className="flex w-full items-center justify-center gap-xs rounded-lg border border-secondary-fixed/30 bg-secondary-fixed/20 py-3 font-label-sm text-on-secondary transition-colors hover:bg-secondary-fixed/30">
                  <span className="material-symbols-outlined text-[20px]">
                    chat
                  </span>
                  Contacta a la empresa generadora
                </button>
              </div>
            </section>

            <section className="flex items-center gap-md rounded-xl bg-surface-container-lowest p-md shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
                <span className="material-symbols-outlined">recycling</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm uppercase text-on-surface-variant">
                  Material activo
                </span>
                <span className="font-body-md font-bold text-on-surface">
                  {waste.material}
                </span>
                <div className="mt-xs flex items-center gap-xs text-sm">
                  <span
                    className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="font-bold text-on-surface">
                    {status === "Gestionado"
                      ? "4.8"
                      : status === "En camino"
                        ? "4.4"
                        : "4.1"}
                  </span>
                  <span className="text-on-surface-variant">
                    (prioridad operativa)
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
