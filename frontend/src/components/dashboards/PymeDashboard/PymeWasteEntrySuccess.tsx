import { useLocation, useNavigate } from "react-router-dom";
import DashboardShell from "../DashboardShell/DashboardShell";

interface PymeWasteEntrySuccessProps {
  username: string;
  onLogout: () => void;
}

interface SuccessLocationState {
  trackingId?: string;
  createdAt?: string;
  quantity?: number;
  unit?: string;
  wasteTypeLabel?: string;
}

const navItems = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "Residuos", icon: "recycling", active: true },
  { label: "Rutas", icon: "local_shipping" },
];

export default function PymeWasteEntrySuccess({
  username,
  onLogout,
}: PymeWasteEntrySuccessProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as SuccessLocationState;

  const createdAt = state.createdAt ? new Date(state.createdAt) : new Date();
  const formattedDate = createdAt.toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <DashboardShell
      appName="EcoCircular"
      panelTitle="Panel PYME"
      subtitle="Confirmacion de ingreso y trazabilidad"
      username={username}
      roleLabel="Generador PYME"
      navItems={navItems}
      activeTopTab="Reportes"
      onLogout={onLogout}
    >
      <div className="relative min-h-[calc(100vh-220px)] overflow-hidden rounded-2xl border border-outline-variant bg-surface p-lg">
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] bg-surface-container-lowest p-md text-center shadow-xl md:p-xl">
          <div className="relative mb-lg">
            <div className="absolute inset-0 scale-150 rounded-full bg-primary/10 opacity-20 animate-ping" />
            <div className="absolute inset-0 scale-125 rounded-full bg-primary/10 opacity-40 animate-pulse" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-primary shadow-lg">
              <span className="material-symbols-outlined text-[58px] text-on-primary">
                check_circle
              </span>
            </div>
          </div>

          <div className="mb-lg space-y-sm">
            <div className="mb-base inline-flex items-center gap-xs rounded-full bg-tertiary-container px-md py-1 text-on-tertiary-container">
              <span className="material-symbols-outlined text-[16px]">eco</span>
              <span className="font-label-sm uppercase tracking-widest">
                Impacto Positivo Confirmado
              </span>
            </div>
            <h1 className="font-display-lg leading-tight text-on-surface">
              Residuos registrados
              <br />
              <span className="text-primary">con exito</span>
            </h1>
            <p className="mx-auto max-w-md text-on-surface-variant">
              La solicitud fue procesada correctamente y el equipo logistico ya
              fue notificado.
            </p>
          </div>

          <div className="mb-lg flex w-full flex-col gap-md rounded-xl border-l-4 border-primary bg-surface-container-low p-md transition-colors hover:bg-surface-container md:flex-row md:items-center md:justify-between">
            <div className="text-left">
              <span className="font-label-sm uppercase text-on-surface-variant/80">
                Numero de Seguimiento
              </span>
              <p className="font-headline-lg-mobile text-primary">
                {state.trackingId ?? "RET-2026-000"}
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="font-label-sm uppercase text-on-surface-variant/80">
                Fecha de Registro
              </span>
              <p className="font-body-md font-bold text-on-surface">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="mb-lg w-full rounded-xl bg-surface-container-low p-md text-left">
            <p className="font-label-sm uppercase tracking-wide text-on-surface-variant">
              Resumen del Ingreso
            </p>
            <p className="mt-sm font-body-md text-on-surface">
              {state.wasteTypeLabel ?? "RESIDUO"} · {state.quantity ?? 0}{" "}
              {state.unit ?? "kg"}
            </p>
          </div>

          <div className="flex w-full flex-col gap-md sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/dashboard/pyme/residuos/nuevo")}
              className="flex h-14 flex-1 items-center justify-center gap-sm rounded-xl bg-primary font-label-sm text-on-primary shadow-md transition-all hover:bg-primary/90"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Nuevo Ingreso
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex h-14 flex-1 items-center justify-center gap-sm rounded-xl bg-surface-container-high font-label-sm text-on-surface transition-all hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined">inventory_2</span>
              Ir a Mis Residuos
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
