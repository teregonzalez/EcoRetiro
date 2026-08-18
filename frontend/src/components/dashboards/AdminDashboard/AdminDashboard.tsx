import { useEffect, useState } from "react";
import DashboardShell from "../DashboardShell/DashboardShell";
import {
  fetchAdminDashboard,
  type AdminDashboardData,
} from "../../../api/dashboard";
import AdminReportsView from "./AdminReportsView";
import AdminWasteCatalogView from "./AdminWasteCatalogView";
import ActivityHistoryView from "../ActivityHistoryView";

interface AdminDashboardProps {
  userId: number;
  username: string;
  onLogout: () => void;
}

const formatDate = (rawDate: string) => {
  const date = new Date(rawDate);
  return Number.isNaN(date.getTime())
    ? rawDate
    : date.toLocaleDateString("es-CL");
};

const usersTableRows = [
  {
    id: 1,
    avatar: "CV",
    name: "Carmen Valdez",
    email: "carmen.v@ecoretiro.cl",
    company: "EcoRetiro Central",
    role: "Administrador",
    status: "Activo",
    lastLogin: "Hoy, 09:41 AM",
    tone: "primary",
  },
  {
    id: 2,
    avatar: "MR",
    name: "Martín Rojas",
    email: "mrojas@indmetal.cl",
    company: "Industrias Metalúrgicas SA",
    role: "Generador",
    status: "Activo",
    lastLogin: "Ayer, 16:30 PM",
    tone: "tertiary",
  },
  {
    id: 3,
    avatar: "DS",
    name: "Diego Santander",
    email: "dsantander@reciclajesur.cl",
    company: "Reciclaje Sur Ltda.",
    role: "Receptor",
    status: "Inactivo",
    lastLogin: "Hace 2 meses",
    tone: "neutral",
  },
  {
    id: 4,
    avatar: "AS",
    name: "Ana Silva",
    email: "asilva@logisticaverde.cl",
    company: "Logística Verde",
    role: "Generador",
    status: "Pendiente",
    lastLogin: "Nunca",
    tone: "danger",
  },
];

export default function AdminDashboard({
  userId,
  username,
  onLogout,
}: AdminDashboardProps) {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");

  const navItems = [
    { label: "Dashboard", icon: "dashboard", active: activeNav === "Dashboard", onClick: () => setActiveNav("Dashboard") },
    { label: "Usuarios", icon: "groups", active: activeNav === "Usuarios", onClick: () => setActiveNav("Usuarios") },
    { label: "Reportes", icon: "analytics", active: activeNav === "Reportes", onClick: () => setActiveNav("Reportes") },
    { label: "Catálogo de residuos", icon: "inventory_2", active: activeNav === "Catálogo de residuos", onClick: () => setActiveNav("Catálogo de residuos") },
    { label: "Historial", icon: "history", active: activeNav === "Historial", onClick: () => setActiveNav("Historial") },
    { label: "Rutas", icon: "local_shipping", active: activeNav === "Rutas", onClick: () => setActiveNav("Rutas") },
  ];

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

    void loadData();
  }, [userId]);

  const renderUsersView = () => (
    <div className="space-y-lg">
      <div className="flex items-end justify-between w-full">
        <div className="flex flex-col gap-base">
          <span className="font-label-sm text-primary tracking-widest uppercase">
            Panel de Administración
          </span>
          <h1 className="font-display-lg text-on-surface">Gestión de Usuarios</h1>
        </div>
        <button className="flex items-center gap-sm rounded-full bg-primary px-md py-sm font-label-sm text-on-primary shadow-sm transition-all hover:bg-primary-container">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Crear Nuevo Usuario
        </button>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
        <div className="mb-md flex flex-col gap-md lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-sm">
            <div className="relative w-full max-w-[320px]">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                className="w-full rounded-xl border border-outline-variant bg-surface py-sm pl-xl pr-md text-body-md text-on-surface placeholder:text-outline/60 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Buscar por nombre o correo..."
                type="text"
              />
            </div>
            <button className="flex items-center gap-sm rounded-xl border border-outline-variant bg-surface px-md py-sm font-label-sm text-on-surface transition-all hover:bg-surface-container-low">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filtros
            </button>
          </div>
          <div className="flex items-center gap-sm">
            <span className="font-label-sm text-on-surface-variant">Mostrar:</span>
            <select className="rounded-xl border border-outline-variant bg-surface px-sm py-sm font-label-sm text-on-surface outline-none">
              <option>Todos los roles</option>
              <option>Administrador</option>
              <option>Generador</option>
              <option>Receptor</option>
            </select>
            <select className="rounded-xl border border-outline-variant bg-surface px-sm py-sm font-label-sm text-on-surface outline-none">
              <option>Estado: Todos</option>
              <option>Activo</option>
              <option>Inactivo</option>
              <option>Pendiente</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl ring-1 ring-outline/10">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                <th className="px-md py-sm font-semibold">Usuario</th>
                <th className="px-md py-sm font-semibold">Rol / Empresa</th>
                <th className="px-md py-sm font-semibold">Estado</th>
                <th className="px-md py-sm font-semibold">Último Acceso</th>
                <th className="px-md py-sm text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usersTableRows.map((row) => (
                <tr key={row.id} className="group border-t border-outline/10 hover:bg-surface-container-lowest/80">
                  <td className="px-md py-sm">
                    <div className="flex items-center gap-sm">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-bold shadow-sm ${
                        row.tone === "primary"
                          ? "bg-primary-container text-on-primary-container"
                          : row.tone === "tertiary"
                            ? "bg-tertiary-container text-on-tertiary-container"
                            : row.tone === "danger"
                              ? "bg-error-container text-error"
                              : "bg-secondary-container text-on-secondary-container"
                      }`}>
                        {row.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-lg-mobile text-[16px] font-semibold leading-tight text-on-surface">
                          {row.name}
                        </span>
                        <span className="font-label-sm text-on-surface-variant font-normal">
                          {row.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-md py-sm">
                    <div className="flex flex-col">
                      <span className={`inline-block w-fit rounded-md px-2 py-0.5 font-label-sm ${
                        row.role === "Administrador"
                          ? "bg-secondary-fixed text-on-secondary-fixed"
                          : row.role === "Generador"
                            ? "bg-tertiary-fixed text-on-tertiary-fixed"
                            : "bg-secondary-container text-on-secondary-container"
                      }`}>
                        {row.role}
                      </span>
                      <span className="mt-1 font-label-sm text-on-surface-variant font-normal">
                        {row.company}
                      </span>
                    </div>
                  </td>
                  <td className="px-md py-sm">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-label-sm ${
                      row.status === "Activo"
                        ? "bg-primary-fixed/30 text-primary"
                        : row.status === "Inactivo"
                          ? "bg-surface-container-high text-on-surface-variant"
                          : "bg-error-container/50 text-error"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        row.status === "Activo"
                          ? "bg-primary"
                          : row.status === "Inactivo"
                            ? "bg-outline"
                            : "bg-error"
                      }`} />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-md py-sm font-label-sm text-on-surface-variant">
                    {row.lastLogin}
                  </td>
                  <td className="px-md py-sm text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-secondary" title="Editar">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error" title={row.status === "Activo" ? "Desactivar" : "Activar"}>
                        <span className="material-symbols-outlined text-[18px]">{row.status === "Activo" ? "block" : "check_circle"}</span>
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary" title="Resetear Contraseña">
                        <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-md flex items-center justify-between border-t border-outline/10 pt-sm">
          <span className="font-label-sm text-on-surface-variant">Mostrando 1 - 4 de 124 usuarios</span>
          <div className="flex items-center gap-xs">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container-low disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-label-sm text-on-primary shadow-sm">1</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg font-label-sm text-on-surface transition-colors hover:bg-surface-container-low">2</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg font-label-sm text-on-surface transition-colors hover:bg-surface-container-low">3</button>
            <span className="px-1 text-on-surface-variant">...</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg font-label-sm text-on-surface transition-colors hover:bg-surface-container-low">31</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-surface-container-low">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboardView = () => (
    <>
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

      <section className="mb-lg grid grid-cols-1 gap-gutter md:grid-cols-3">
        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <p className="font-label-sm uppercase tracking-wider text-on-surface-variant">
            Usuarios Totales
          </p>
          <h3 className="mt-2 text-[36px] font-bold text-on-surface">
            {data?.metrics.totalUsers ?? 0}
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
            {data?.metrics.pendingRequests ?? 0}
          </h3>
          <p className="text-[12px] text-error">
            Requieren revision prioritaria
          </p>
        </article>
        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
          <p className="font-label-sm uppercase tracking-wider text-on-surface-variant">
            Residuos Hoy (Ton)
          </p>
          <h3 className="mt-2 text-[36px] font-bold text-on-surface">
            {(data?.metrics.totalWasteTon ?? 0).toFixed(1)}
          </h3>
          <p className="text-[12px] text-outline">Volumen total gestionado</p>
        </article>
      </section>

      <section className="mb-lg overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-md py-4">
          <h3 className="font-headline-lg-mobile text-on-surface">
            Gestion de Registros
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
                <th className="px-md py-4 text-right text-label-sm">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {(data?.users ?? []).map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-surface-container-low"
                >
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
                    <button
                      type="button"
                      className="text-primary hover:underline"
                    >
                      Administrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm lg:col-span-2">
          <div className="mb-md flex items-center justify-between">
            <h3 className="font-headline-lg-mobile text-on-surface">
              Volumen por Tipo de Residuo
            </h3>
            <span className="text-label-sm text-on-surface-variant">
              Top categorias
            </span>
          </div>
          <div className="flex h-48 items-end gap-4">
            {(data?.wasteTrend ?? []).map((item) => {
              const maxValue = Math.max(
                ...(data?.wasteTrend ?? [{ total: 1 }]).map(
                  (entry) => entry.total,
                ),
                1,
              );
              const height = Math.max(
                10,
                Math.round((item.total / maxValue) * 100),
              );

              return (
                <div
                  key={item.type}
                  className="flex flex-1 flex-col items-center gap-2"
                >
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
                Sin datos de volumen por categoria
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
              "Inventario de Plasticos",
              "Logistica Semanal",
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
    </>
  );

  return (
    <DashboardShell
      appName="EcoCircular"
      panelTitle="Panel de Administrador"
      subtitle="Control de usuarios, trazabilidad y operacion general"
      username={username}
      roleLabel="Administrador"
      navItems={navItems}
      activeTopTab="Resumen"
      onLogout={onLogout}
    >
      {activeNav === "Usuarios"
        ? renderUsersView()
        : activeNav === "Reportes"
          ? <AdminReportsView />
          : activeNav === "Catálogo de residuos"
            ? <AdminWasteCatalogView />
            : activeNav === "Historial"
              ? <ActivityHistoryView />
          : renderDashboardView()}
    </DashboardShell>
  );
}
