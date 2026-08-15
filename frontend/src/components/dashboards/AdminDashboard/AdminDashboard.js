import React, { useEffect, useState } from "react";
import DashboardShell from "../DashboardShell/DashboardShell";
import { fetchAdminDashboard } from "../../../api/dashboard";

const navItems = [
  { label: "Dashboard", icon: "dashboard", active: true },
  { label: "Usuarios", icon: "groups" },
  { label: "Reportes", icon: "analytics" },
  { label: "Historial", icon: "history" },
  { label: "Rutas", icon: "local_shipping" },
];

const formatDate = (rawDate) => {
  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? rawDate : date.toLocaleDateString("es-CL");
};

export default function AdminDashboard({ userId, username, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchAdminDashboard();
        setData(dashboardData);
        setError("");
      } catch {
        setError("No fue posible cargar el dashboard de administrador");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  return (
    <DashboardShell
      appName="EcoCircular"
      panelTitle="Panel de Administrador"
      subtitle="Control de usuarios, trazabilidad y operación general"
      username={username}
      roleLabel="Administrador"
      navItems={navItems}
      activeTopTab="Resumen"
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

      {/* Tarjetas de Métricas Globales */}
      <section className="mb-lg grid grid-cols-1 gap-gutter md:grid-cols-3">
        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <p className="font-label-sm uppercase tracking-wider text-on-surface-variant">
            Usuarios Totales
          </p>
          <h3 className="mt-2 text-[36px] font-bold text-on-surface">
            {data?.metrics?.totalUsers ?? 0}
          </h3>
          <p className="text-[12px] text-outline">
            Empresas activas en plataforma
          </p>
        </article>

        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <p className="font-label-sm uppercase tracking-wider text-on-surface-variant">
            Solicitudes Pendientes
          </p>
          <h3 className="mt-2 text-[36px] font-bold text-on-surface">
            {data?.metrics?.pendingRequests ?? 0}
          </h3>
          <p className="text-[12px] text-error">
            Requieren revisión prioritaria
          </p>
        </article>

        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <p className="font-label-sm uppercase tracking-wider text-on-surface-variant">
            Residuos Hoy (Ton)
          </p>
          <h3 className="mt-2 text-[36px] font-bold text-on-surface">
            {(data?.metrics?.totalWasteTon ?? 0).toFixed(1)}
          </h3>
          <p className="text-[12px] text-outline">
            Volumen total gestionado
          </p>
        </article>
      </section>

      {/* Tabla de Gestión de Registros */}
      <section className="mb-lg overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-md py-4">
          <h3 className="font-headline-lg-mobile text-on-surface">
            Gestión de Registros
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-outline-variant px-3 py-1.5 text-label-sm hover:bg-surface-variant"
            >
              Exportar CSV
            </button>
            <button
              type="button"
              className="rounded-lg border border-outline-variant px-3 py-1.5 text-label-sm hover:bg-surface-variant"
            >
              Filtrar
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                <th className="px-md py-4 text-label-sm">Empresa</th>
                <th className="px-md py-4 text-label-sm">Rol</th>
                <th className="px-md py-4 text-label-sm">Estado</th>
                <th className="px-md py-4 text-label-sm">Registro</th>
                <th className="px-md py-4 text-right text-label-sm">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {(data?.users ?? []).map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-surface-container-low">
                  <td className="px-md py-4 font-bold text-on-surface">
                    {row.empresa}
                  </td>
                  <td className="px-md py-4 text-on-surface-variant">
                    {row.rol}
                  </td>
                  <td className="px-md py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-bold uppercase ${
                        row.estado === "Aprobada"
                          ? "bg-primary-fixed text-on-primary-fixed"
                          : row.estado === "Pendiente"
                          ? "bg-surface-variant text-on-surface-variant"
                          : "bg-error-container text-error"
                      }`}
                    >
                      {row.estado}
                    </span>
                  </td>
                  <td className="px-md py-4 text-outline">
                    {formatDate(row.registro)}
                  </td>
                  <td className="px-md py-4 text-right">
                    <button type="button" className="text-primary hover:underline">
                      Administrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Gráficos e Informes */}
      <section className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm lg:col-span-2">
          <div className="mb-md flex items-center justify-between">
            <h3 className="font-headline-lg-mobile text-on-surface">
              Volumen por Tipo de Residuo
            </h3>
            <span className="text-label-sm text-on-surface-variant">
              Top categorías
            </span>
          </div>
          
          <div className="flex h-48 items-end gap-4">
            {(data?.wasteTrend ?? []).map((item) => {
              const maxValue = Math.max(
                ...(data?.wasteTrend ?? [{ total: 1 }]).map((entry) => entry.total),
                1
              );
              const height = Math.max(10, Math.round((item.total / maxValue) * 100));
              return (
                <div key={item.type} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t bg-primary"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-center text-[11px] text-outline">
                    {item.type}
                  </span>
                </div>
              );
            })}
            
            {!loading && (data?.wasteTrend ?? []).length === 0 && (
              <div className="w-full text-center text-on-surface-variant">
                Sin datos de volumen por categoría
              </div>
            )}
          </div>
        </article>

        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <h3 className="mb-md font-headline-lg-mobile text-on-surface">
            Informes Directos
          </h3>
          <div className="space-y-3">
            {[
              "Mensual de Carbono",
              "Inventario de Plásticos",
              "Logística Semanal",
            ].map((item) => (
              <button
                key={item}
                type="button"
                className="flex w-full items-center justify-between rounded-lg bg-surface-container-low p-3 text-left transition-colors hover:bg-surface-container-high"
              >
                <span className="text-body-md text-on-surface-variant">
                  {item}
                </span>
                <span className="material-symbols-outlined text-outline">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}