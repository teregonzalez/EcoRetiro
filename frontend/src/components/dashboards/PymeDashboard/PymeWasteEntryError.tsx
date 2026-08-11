import { useLocation, useNavigate } from "react-router-dom";
import DashboardShell from "../DashboardShell/DashboardShell";

interface PymeWasteEntryErrorProps {
  username: string;
  onLogout: () => void;
}

interface ErrorLocationState {
  errorMessage?: string;
}

const navItems = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "Residuos", icon: "recycling", active: true },
  { label: "Cumplimiento", icon: "verified_user" },
  { label: "Rutas", icon: "local_shipping" },
  { label: "Analiticas", icon: "analytics" },
];

export default function PymeWasteEntryError({ username, onLogout }: PymeWasteEntryErrorProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as ErrorLocationState;

  return (
    <DashboardShell
      appName="EcoCircular"
      panelTitle="Panel PYME"
      subtitle="Estado de validacion del ingreso"
      username={username}
      roleLabel="Generador PYME"
      navItems={navItems}
      activeTopTab="Logistica"
      onLogout={onLogout}
    >
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface p-lg">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-error/10 via-error/5 to-transparent blur-3xl" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="group relative mb-lg">
            <div className="absolute inset-0 scale-150 rounded-full bg-error/20 blur-xl transition-transform duration-700 group-hover:scale-110" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-surface-container-highest shadow-xl">
              <span className="material-symbols-outlined animate-bounce text-[58px] text-error">warning</span>
            </div>
            <div className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-error" />
          </div>

          <div className="mb-lg space-y-sm">
            <span className="font-label-sm uppercase tracking-[0.2em] text-error">Error de Registro</span>
            <h1 className="font-display-lg text-on-surface">No pudimos procesar la solicitud</h1>
            <p className="mx-auto max-w-lg text-on-surface-variant">
              Hubo una interrupcion durante la validacion del ingreso. Revisa los datos e intenta nuevamente.
            </p>
          </div>

          <div className="mb-xl flex w-full items-start gap-md rounded-xl border-l-4 border-error/50 bg-surface-container-low p-md text-left shadow-sm">
            <span className="material-symbols-outlined mt-1 text-error">dns</span>
            <div className="min-w-0">
              <span className="mb-1 block font-label-sm text-on-surface-variant">Motivo del sistema:</span>
              <code className="block truncate rounded bg-error/5 px-2 py-1 font-label-sm text-error">
                {state.errorMessage ?? "ERR_LOGISTICS_SERVER_CONNECTION_TIMEOUT:503"}
              </code>
              <p className="mt-2 text-sm italic text-on-surface-variant">
                Si el error persiste, intenta nuevamente en unos minutos o contacta soporte tecnico.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-md sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/dashboard/pyme/residuos/nuevo")}
              className="group relative w-full overflow-hidden rounded-full bg-secondary px-xl py-sm font-label-sm text-on-secondary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-secondary/25 active:translate-y-0 sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined text-[18px] transition-transform duration-500 group-hover:rotate-180">
                  refresh
                </span>
                Reintentar
              </span>
              <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform group-hover:translate-y-0" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex w-full items-center justify-center gap-sm rounded-full bg-surface-container-high px-xl py-sm font-label-sm text-on-surface-variant transition-colors hover:bg-surface-variant sm:w-auto"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Volver al Inicio
            </button>
          </div>
        </div>

        <section className="mt-xl border-t border-surface-variant/30 pt-lg">
          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            <article className="flex flex-col gap-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-highest">
                <span className="material-symbols-outlined text-secondary">support_agent</span>
              </div>
              <h3 className="font-label-sm text-on-surface">Asistencia Tecnica</h3>
              <p className="text-sm text-on-surface-variant">
                Si el error persiste, contacta al equipo de soporte de EcoRetiro.
              </p>
            </article>

            <article className="flex flex-col gap-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-highest">
                <span className="material-symbols-outlined text-secondary">database</span>
              </div>
              <h3 className="font-label-sm text-on-surface">Datos Protegidos</h3>
              <p className="text-sm text-on-surface-variant">
                Los datos del formulario se mantienen en pantalla para reintentar rapidamente.
              </p>
            </article>

            <article className="flex flex-col gap-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-highest">
                <span className="material-symbols-outlined text-secondary">network_check</span>
              </div>
              <h3 className="font-label-sm text-on-surface">Estado de Red</h3>
              <p className="flex items-center gap-xs text-sm text-on-surface-variant">
                <span className="h-2 w-2 animate-pulse rounded-full bg-error" />
                Servidor logistico: inestable
              </p>
            </article>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
