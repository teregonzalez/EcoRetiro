import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardShell from "../DashboardShell/DashboardShell";

interface RecyclerNearbyWasteViewProps {
  username: string;
  onLogout: () => void;
}

interface WasteLocationState {
  material?: string;
  total?: number;
  unit?: string;
}

const navItems = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "Residuos", icon: "recycling", active: true },
  { label: "Cumplimiento", icon: "verified_user" },
  { label: "Rutas", icon: "local_shipping" },
  { label: "Analiticas", icon: "analytics" },
];

export default function RecyclerNearbyWasteView({ username, onLogout }: RecyclerNearbyWasteViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as WasteLocationState;

  const material = state.material ?? "Material no especificado";
  const total = state.total ?? 0;
  const unit = state.unit ?? "kg";

  const [pickupDate, setPickupDate] = useState("");
  const [estimatedLoad, setEstimatedLoad] = useState(String(total || ""));
  const [priority, setPriority] = useState("Media");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");

    setTimeout(() => {
      setSubmitting(false);
      setSuccessMessage("Solicitud de retiro enviada al generador y al modulo logistico.");
    }, 1200);
  };

  return (
    <DashboardShell
      appName="EcoCircular"
      panelTitle="Panel Reciclador"
      subtitle="Gestion de retiro para residuos cercanos"
      username={username}
      roleLabel="Empresa Recicladora"
      navItems={navItems}
      activeTopTab="Logistica"
      onLogout={onLogout}
    >
      <div className="relative min-h-[calc(100vh-220px)] overflow-hidden rounded-2xl border border-outline-variant bg-surface">
        <div className="pointer-events-none absolute inset-0 opacity-40 blur-[2px]">
          <div className="grid h-full grid-cols-12 gap-gutter p-margin">
            <div className="col-span-8 space-y-gutter">
              <div className="h-40 rounded-xl bg-surface-container" />
              <div className="grid grid-cols-3 gap-gutter">
                <div className="h-24 rounded-xl bg-surface-container-high" />
                <div className="h-24 rounded-xl bg-surface-container-high" />
                <div className="h-24 rounded-xl bg-surface-container-high" />
              </div>
              <div className="h-64 rounded-xl bg-surface-container" />
            </div>
            <div className="col-span-4 rounded-xl bg-surface-container-low" />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-on-surface/20 p-gutter backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-surface-container-lowest shadow-xl">
            <div className="flex flex-col md:flex-row">
              <aside className="relative hidden w-1/3 bg-secondary p-lg text-on-secondary md:flex md:flex-col md:justify-end">
                <div className="pointer-events-none absolute inset-0 opacity-20">
                  <svg className="h-full w-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="14" r="30" fill="currentColor" />
                    <circle cx="84" cy="84" r="26" fill="currentColor" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <span className="mb-sm block font-label-sm uppercase tracking-[0.18em] text-secondary-fixed">
                    Seleccion de Residuo
                  </span>
                  <h2 className="font-headline-lg-mobile leading-tight">Retiro Disponible</h2>
                  <p className="mt-sm text-on-secondary/85">Coordina el retiro y asegura trazabilidad completa.</p>
                </div>
              </aside>

              <div className="flex-1 p-lg">
                <div className="mb-md flex items-start justify-between gap-sm">
                  <div>
                    <span className="font-label-sm uppercase tracking-wider text-outline">Residuos Cercanos</span>
                    <h1 className="font-headline-lg-mobile text-on-surface">Detalle de Residuo</h1>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
                    aria-label="Cerrar vista"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="mb-md rounded-xl border-l-4 border-secondary bg-surface-container-low p-md">
                  <p className="font-label-sm uppercase tracking-wider text-on-surface-variant">Material Seleccionado</p>
                  <p className="mt-xs font-headline-lg-mobile text-on-surface">{material}</p>
                  <p className="mt-xs font-body-md text-on-surface-variant">Disponible: {total} {unit}</p>
                </div>

                <form className="space-y-md" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-md md:grid-cols-2">
                    <div className="space-y-sm">
                      <label className="font-label-sm text-on-surface-variant">CANTIDAD A RETIRAR</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={estimatedLoad}
                          onChange={(event) => setEstimatedLoad(event.target.value)}
                          className="w-full rounded-xl bg-surface-container px-md py-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-secondary/20"
                          required
                        />
                        <span className="pointer-events-none absolute right-md top-1/2 -translate-y-1/2 font-label-sm text-secondary">
                          {unit}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-sm">
                      <label className="font-label-sm text-on-surface-variant">FECHA ESTIMADA DE RETIRO</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(event) => setPickupDate(event.target.value)}
                          className="w-full rounded-xl bg-surface-container px-md py-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-secondary/20"
                          required
                        />
                        <span className="material-symbols-outlined pointer-events-none absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant">
                          calendar_today
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-sm">
                    <label className="font-label-sm text-on-surface-variant">PRIORIDAD LOGISTICA</label>
                    <div className="grid grid-cols-3 gap-base">
                      {(["Alta", "Media", "Baja"] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPriority(value)}
                          className={`rounded-xl border px-sm py-sm font-label-sm transition-all ${
                            priority === value
                              ? "border-secondary bg-secondary-container text-on-secondary-container"
                              : "border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-sm">
                    <label className="font-label-sm text-on-surface-variant">NOTAS OPERATIVAS</label>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      className="h-24 w-full resize-none rounded-xl bg-surface-container px-md py-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-secondary/20"
                      placeholder="Indica acceso de camiones, ventanas de retiro o condicion de embalaje..."
                    />
                  </div>

                  <div className="flex flex-col gap-sm pt-base sm:flex-row">
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="flex-1 rounded-xl bg-surface-container-high px-lg py-sm font-label-sm text-on-surface-variant transition-colors hover:bg-surface-container-highest"
                    >
                      Volver al Dashboard
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group flex-[2] rounded-xl bg-secondary px-lg py-sm font-label-sm text-on-secondary shadow-md transition-all hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span className="inline-flex items-center gap-sm">
                        {submitting ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            Confirmar Retiro
                            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                              arrow_forward
                            </span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </form>

                {successMessage && (
                  <p className="mt-md rounded-lg bg-tertiary-container p-sm text-center font-label-sm text-on-tertiary-container">
                    {successMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
