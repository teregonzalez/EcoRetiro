import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardShell from "../DashboardShell/DashboardShell";
import ReportsView from "../ReportsView";
import RoutesView from "../RoutesView";
import {
  fetchRecyclerDashboard,
  type RecyclerDashboardData,
  type RecyclerCollectionRow,
  type RecyclerNearbyWaste,
} from "../../../api/dashboard";
import RecyclerWasteSpotlightView from "./RecyclerWasteSpotlightView";

interface RecyclerDashboardProps {
  userId: number;
  username: string;
  onLogout: () => void;
  onSelectNearbyWaste: (item: RecyclerNearbyWaste) => void;
  onEditProfile: () => void;
}

const formatDate = (rawDate: string) => {
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return rawDate;

  return date.toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function RecyclerDashboard({
  userId,
  username,
  onLogout,
  onSelectNearbyWaste,
  onEditProfile,
}: RecyclerDashboardProps) {
  const location = useLocation();
  const [data, setData] = useState<RecyclerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Inventario");
  const [selectedWasteMaterial, setSelectedWasteMaterial] = useState<
    string | null
  >(null);

  const selectedWaste =
    data?.nearbyWaste.find((item) => item.material === selectedWasteMaterial) ??
    data?.nearbyWaste[0] ??
    null;
  const selectedHistoryEntry: RecyclerCollectionRow | null = selectedWaste
    ? (data?.collectionHistory.find(
        (item) => item.material === selectedWaste.material,
      ) ?? null)
    : null;

  const navItems = [
    {
      label: "Dashboard",
      icon: "dashboard",
      active: activeTab === "Inventario",
      onClick: () => setActiveTab("Inventario"),
    },
    {
      label: "Residuos",
      icon: "recycling",
      active: activeTab === "Residuos",
      onClick: () => setActiveTab("Residuos"),
    },
    {
      label: "Rutas",
      icon: "local_shipping",
      active: activeTab === "Rutas",
      onClick: () => setActiveTab("Rutas"),
    },
    {
      label: "Reportes",
      icon: "book",
      active: activeTab === "Reportes",
      onClick: () => setActiveTab("Reportes"),
    },
  ];

  useEffect(() => {
    const tabFromState = (location.state as { recyclerTab?: string } | null)
      ?.recyclerTab;
    if (
      tabFromState === "Inventario" ||
      tabFromState === "Residuos" ||
      tabFromState === "Rutas" ||
      tabFromState === "Reportes"
    ) {
      setActiveTab(tabFromState);
    }
  }, [location.state]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchRecyclerDashboard(userId);
        setData(dashboardData);
        setSelectedWasteMaterial((currentSelectedWasteMaterial) => {
          if (
            currentSelectedWasteMaterial &&
            dashboardData.nearbyWaste.some(
              (item) => item.material === currentSelectedWasteMaterial,
            )
          ) {
            return currentSelectedWasteMaterial;
          }

          return dashboardData.nearbyWaste[0]?.material ?? null;
        });
        setError("");
      } catch {
        setError("No fue posible cargar el dashboard de reciclador");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [userId]);

  const metricCards = useMemo(
    () => [
      {
        label: "Procesado Hoy",
        value: `${(data?.metrics.processedToday ?? 0).toFixed(1)} ton`,
        icon: "inventory_2",
        color: "text-primary",
      },
      {
        label: "Recolecciones Activas",
        value: String(data?.metrics.activeCollections ?? 0),
        icon: "local_shipping",
        color: "text-secondary",
      },
      {
        label: "Capacidad Total",
        value: `${data?.metrics.capacityTotal ?? 0}%`,
        icon: "ev_station",
        color: "text-tertiary",
      },
      {
        label: "Alertas Criticas",
        value: String(data?.metrics.openAlerts ?? 0),
        icon: "warning",
        color: "text-error",
      },
    ],
    [data],
  );

  return (
    <DashboardShell
      appName="EcoCircular"
      panelTitle="Panel Reciclador"
      subtitle="Monitorea recolecciones, rutas y capacidad de planta"
      username={username}
      roleLabel="Empresa Recicladora"
      navItems={navItems}
      activeTopTab={activeTab}
      ctaLabel="Nueva Solicitud"
      onTopTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {activeTab === "Residuos" ? (
        <RecyclerWasteSpotlightView
          waste={selectedWaste}
          historyEntry={selectedHistoryEntry}
          onOpenCollection={onSelectNearbyWaste}
        />
      ) : activeTab === "Rutas" ? (
        <RoutesView />
      ) : activeTab === "Reportes" ? (
        <ReportsView
          title="Reportes de recolección"
          subtitle="Monitorea rendimiento, capacidad y cumplimiento operativo de la red recicladora."
          roleLabel="Empresa Recicladora"
        />
      ) : (
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

          <section className="mb-lg grid grid-cols-1 gap-gutter md:grid-cols-4">
            {metricCards.map((metric) => (
              <article
                key={metric.label}
                className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm"
              >
                <div>
                  <p className="font-label-sm text-on-surface-variant">
                    {metric.label}
                  </p>
                  <h3 className={`font-headline-lg ${metric.color}`}>
                    {metric.value}
                  </h3>
                </div>
                <span
                  className={`material-symbols-outlined text-4xl ${metric.color}`}
                >
                  {metric.icon}
                </span>
              </article>
            ))}
          </section>

          <section className="mb-lg grid grid-cols-1 gap-gutter lg:grid-cols-12">
            <article className="relative min-h-[380px] overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm lg:col-span-8">
              <img
                alt="Mapa de residuos"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR-X5uOfLcsNWWAuaLS8s8-B1fxtqVbOtVygobXWCCAhsA9Casy50cOqwijMNG90VRYBG9kyk8BrgxEBUjF_LKTeuRktDTtxKPgLYv5mbPDajXNVb6RcFZJVAx2WJPAUObczjUQSuMu4s2VMgkYDXvG60O5HupsY6tFjiszvbHdl-oS22eunZZbiSwN7_3F7Z72sKzENsG17Od9UpAoqwy35gzPfru-quKU3nMUZ5Lc7mTuePJWNbxRuGTLTWQQvMauQIWJS3n8Wg"
                className="h-full w-full object-cover opacity-50"
              />
              <div className="absolute left-4 top-4 max-w-xs rounded-lg border border-white/40 bg-white/80 p-4 backdrop-blur">
                <div className="mb-3 flex items-center justify-between gap-sm">
                  <h3 className="font-headline-lg-mobile text-on-surface">
                    Residuos Cercanos
                  </h3>
                  <button
                    type="button"
                    onClick={onEditProfile}
                    className="rounded-full bg-surface px-sm py-xs text-[11px] font-bold text-secondary transition-colors hover:bg-surface-container"
                  >
                    Editar perfil
                  </button>
                </div>
                <p className="mb-3 text-label-sm text-on-surface-variant">
                  Selecciona un residuo para gestionar su retiro.
                </p>
                <ul className="space-y-2 text-[12px]">
                  {(data?.nearbyWaste ?? []).slice(0, 4).map((item, idx) => (
                    <li key={item.material}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedWasteMaterial(item.material);
                          onSelectNearbyWaste(item);
                        }}
                        className={`w-full rounded-lg bg-surface-container p-2 text-left transition-colors hover:bg-surface-container-high ${idx === 0 ? "border-l-4 border-primary" : "border-l-4 border-secondary"}`}
                      >
                        <span className="flex w-full items-center justify-between gap-sm">
                          <span>{item.material}</span>
                          <span className="font-bold">
                            {item.total} {item.unit}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm lg:col-span-4">
              <h3 className="mb-md font-headline-lg-mobile text-on-surface">
                Capacidad de Planta
              </h3>
              <div className="space-y-5">
                {(data?.capacity ?? []).map((item, index) => (
                  <div key={item.material}>
                    <div className="mb-1 flex justify-between">
                      <span className="text-label-sm">{item.material}</span>
                      <span className="text-label-sm font-bold">
                        {item.percent}%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-surface-container">
                      <div
                        className={`h-full ${index === 0 ? "bg-primary" : index === 1 ? "bg-secondary" : "bg-tertiary"}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}

                {!loading && (data?.capacity ?? []).length === 0 && (
                  <div className="text-on-surface-variant">
                    Sin datos de capacidad
                  </div>
                )}
              </div>
            </article>
          </section>

          <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant px-md py-4">
              <h3 className="font-headline-lg-mobile text-on-surface">
                Historial de Recoleccion
              </h3>
              <button type="button" className="text-secondary hover:underline">
                Ver reporte completo
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-on-surface-variant">
                  <tr>
                    <th className="px-md py-sm text-label-sm">Fecha / ID</th>
                    <th className="px-md py-sm text-label-sm">Origen</th>
                    <th className="px-md py-sm text-label-sm">Material</th>
                    <th className="px-md py-sm text-label-sm">Cantidad</th>
                    <th className="px-md py-sm text-label-sm">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {(data?.collectionHistory ?? []).map((row) => (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-surface-container-low"
                    >
                      <td className="px-md py-md">
                        <p className="font-bold">{formatDate(row.fecha)}</p>
                        <p className="text-[10px] text-on-surface-variant">
                          #SOL-{row.id}
                        </p>
                      </td>
                      <td className="px-md py-md">{row.origen}</td>
                      <td className="px-md py-md font-bold">{row.material}</td>
                      <td className="px-md py-md">
                        {row.cantidad} {row.unidad}
                      </td>
                      <td className="px-md py-md">{row.estado}</td>
                    </tr>
                  ))}

                  {!loading && (data?.collectionHistory ?? []).length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-md py-md text-center text-on-surface-variant"
                      >
                        No hay historial de recoleccion disponible
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </DashboardShell>
  );
}
