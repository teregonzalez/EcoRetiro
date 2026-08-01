import { useEffect, useState } from "react";
import DashboardShell from "./DashboardShell";
import { fetchPymeDashboard, type PymeDashboardData } from "../../api/dashboard";

interface PymeDashboardProps {
  userId: number;
  username: string;
  onLogout: () => void;
  onCreateWaste: () => void;
}

const navItems = [
  { label: "Dashboard", icon: "dashboard", active: true },
  { label: "Residuos", icon: "recycling" },
  { label: "Cumplimiento", icon: "verified_user" },
  { label: "Rutas", icon: "local_shipping" },
  { label: "Analiticas", icon: "analytics" },
];

const formatDate = (rawDate: string) => {
  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? rawDate : date.toLocaleDateString("es-CL");
};

export default function PymeDashboard({ userId, username, onLogout, onCreateWaste }: PymeDashboardProps) {
  const [data, setData] = useState<PymeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchPymeDashboard(userId);
        setData(dashboardData);
        setError("");
      } catch {
        setError("No fue posible cargar el dashboard de PYME");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [userId]);

  return (
    <DashboardShell
      appName="EcoCircular"
      panelTitle="Panel PYME"
      subtitle="Gestion de entregas, impacto ambiental y trazabilidad"
      username={username}
      roleLabel="Generador PYME"
      navItems={navItems}
      topTabs={["Inventario", "Logistica", "Reportes"]}
      activeTopTab="Inventario"
      ctaLabel="Nueva Solicitud"
      onLogout={onLogout}
    >
      {loading && (
        <div className="mb-md rounded-lg border border-outline-variant bg-surface-container-low p-md text-on-surface-variant">
          Cargando datos del panel...
        </div>
      )}

      {error && (
        <div className="mb-md rounded-lg border border-error bg-error-container p-md text-on-error-container">
          {error}
        </div>
      )}

      <section className="mb-lg grid grid-cols-1 gap-gutter lg:grid-cols-3">
        <article className="relative overflow-hidden rounded-xl bg-primary-container p-xl shadow-md lg:col-span-2">
          <div className="relative z-10 max-w-xl">
            <h3 className="font-headline-lg-mobile text-white">Listo para una nueva entrega</h3>
            <p className="mt-sm text-on-primary-container">
              Registra residuos para programar recoleccion optimizada y reducir tu huella.
            </p>
            <button
              type="button"
              onClick={onCreateWaste}
              className="mt-md inline-flex items-center gap-2 rounded-full bg-secondary-container px-md py-sm font-bold text-on-secondary-container transition-all hover:bg-secondary hover:text-on-secondary"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Ingresar Nuevos Residuos
            </button>
          </div>
          <span className="material-symbols-outlined pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 text-[220px] text-primary-fixed/20" style={{ fontVariationSettings: "'FILL' 1" }}>
            recycling
          </span>
        </article>

        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <p className="font-label-sm uppercase tracking-wider text-on-surface-variant">Impacto Ambiental</p>
          <p className="mt-md text-display-lg text-primary">{(data?.metrics.co2Saved ?? 0).toFixed(1)} kg</p>
          <p className="text-on-surface-variant">CO2 evitado estimado</p>
          <div className="mt-md flex items-center gap-sm">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, Math.round((data?.metrics.totalEntries ?? 0) * 10))}%` }}
              />
            </div>
            <span className="text-label-sm font-bold text-on-surface">{data?.metrics.totalEntries ?? 0} reg.</span>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-gutter xl:grid-cols-4">
        <article className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm xl:col-span-3">
          <div className="flex items-center justify-between border-b border-outline-variant px-md py-4">
            <h3 className="font-headline-lg-mobile text-on-surface">Historial de Residuos</h3>
            <button type="button" className="text-secondary hover:underline">Exportar</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant">
                <tr>
                  <th className="px-md py-sm text-label-sm">Fecha</th>
                  <th className="px-md py-sm text-label-sm">Tipo</th>
                  <th className="px-md py-sm text-label-sm">Cantidad</th>
                  <th className="px-md py-sm text-label-sm">Estado</th>
                  <th className="px-md py-sm text-label-sm">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {(data?.history ?? []).map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-surface-container-low">
                    <td className="px-md py-md">{formatDate(row.fecha)}</td>
                    <td className="px-md py-md font-bold">{row.tipo}</td>
                    <td className="px-md py-md">{row.cantidad} {row.unidad}</td>
                    <td className="px-md py-md">
                      <span
                        className={`rounded-full px-sm py-xs text-label-sm font-bold ${
                          row.estado === "Gestionado"
                            ? "bg-primary-fixed/30 text-primary"
                            : "bg-secondary-fixed/40 text-secondary"
                        }`}
                      >
                        {row.estado}
                      </span>
                    </td>
                    <td className="px-md py-md">
                      <button type="button" className="font-label-sm text-secondary hover:underline">Ver detalle</button>
                    </td>
                  </tr>
                ))}

                {!loading && (data?.history ?? []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-md py-md text-center text-on-surface-variant">
                      No hay registros para esta empresa
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <h3 className="mb-md font-headline-lg-mobile text-on-surface">Perfil de Empresa</h3>
          <div className="space-y-sm">
            <div className="rounded-lg bg-surface-container-low p-sm">
              <p className="text-label-sm font-bold text-on-surface-variant">Ubicacion</p>
              <p className="text-body-md">{data?.profile?.ubicacion ?? "-"}</p>
            </div>
            <div className="rounded-lg bg-surface-container-low p-sm">
              <p className="text-label-sm font-bold text-on-surface-variant">Contacto</p>
              <p className="text-body-md">{data?.profile?.contacto ?? "-"}</p>
            </div>
            <div className="rounded-lg bg-surface-container-low p-sm">
              <p className="text-label-sm font-bold text-on-surface-variant">Telefono</p>
              <p className="text-body-md">{data?.profile?.telefono ?? "-"}</p>
            </div>
          </div>
          <button type="button" className="mt-md flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary py-sm font-bold text-primary transition-all hover:bg-primary hover:text-white">
            <span className="material-symbols-outlined">edit</span>
            Editar Perfil
          </button>
        </article>
      </section>
    </DashboardShell>
  );
}
