import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "./DashboardShell";
import ReportsView from "../ReportsView";
import RoutesView from "../RoutesView";
import { fetchRecyclerDashboard } from "../../../api/dashboard";
const formatDate = (rawDate) => {
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
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Inventario");
  const navItems = [
    {
      label: "Dashboard",
      icon: "dashboard",
      active: activeTab === "Inventario",
    },
    { label: "Residuos", icon: "recycling", active: false },
    { label: "Cumplimiento", icon: "verified_user", active: false },
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
    { label: "Analiticas", icon: "analytics", active: false },
  ];
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchRecyclerDashboard(userId);
        setData(dashboardData);
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
  return _jsx(DashboardShell, {
    appName: "EcoCircular",
    panelTitle: "Panel Reciclador",
    subtitle: "Monitorea recolecciones, rutas y capacidad de planta",
    username: username,
    roleLabel: "Empresa Recicladora",
    navItems: navItems,
    activeTopTab: activeTab,
    ctaLabel: "Nueva Solicitud",
    onTopTabChange: setActiveTab,
    onLogout: onLogout,
    children:
      activeTab === "Rutas"
        ? _jsx(RoutesView, {})
        : activeTab === "Reportes"
          ? _jsx(ReportsView, {
              title: "Reportes de recolecci\u00F3n",
              subtitle:
                "Monitorea rendimiento, capacidad y cumplimiento operativo de la red recicladora.",
              roleLabel: "Empresa Recicladora",
            })
          : _jsxs(_Fragment, {
              children: [
                loading &&
                  _jsx("div", {
                    className:
                      "mb-md rounded-lg border border-outline-variant bg-surface-container-low p-md text-on-surface-variant",
                    children: "Cargando datos del panel...",
                  }),
                error &&
                  _jsx("div", {
                    className:
                      "mb-md rounded-lg border border-error bg-error-container p-md text-on-error-container",
                    children: error,
                  }),
                _jsx("section", {
                  className: "mb-lg grid grid-cols-1 gap-gutter md:grid-cols-4",
                  children: metricCards.map((metric) =>
                    _jsxs(
                      "article",
                      {
                        className:
                          "flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm",
                        children: [
                          _jsxs("div", {
                            children: [
                              _jsx("p", {
                                className:
                                  "font-label-sm text-on-surface-variant",
                                children: metric.label,
                              }),
                              _jsx("h3", {
                                className: `font-headline-lg ${metric.color}`,
                                children: metric.value,
                              }),
                            ],
                          }),
                          _jsx("span", {
                            className: `material-symbols-outlined text-4xl ${metric.color}`,
                            children: metric.icon,
                          }),
                        ],
                      },
                      metric.label,
                    ),
                  ),
                }),
                _jsxs("section", {
                  className:
                    "mb-lg grid grid-cols-1 gap-gutter lg:grid-cols-12",
                  children: [
                    _jsxs("article", {
                      className:
                        "relative min-h-[380px] overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm lg:col-span-8",
                      children: [
                        _jsx("img", {
                          alt: "Mapa de residuos",
                          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAR-X5uOfLcsNWWAuaLS8s8-B1fxtqVbOtVygobXWCCAhsA9Casy50cOqwijMNG90VRYBG9kyk8BrgxEBUjF_LKTeuRktDTtxKPgLYv5mbPDajXNVb6RcFZJVAx2WJPAUObczjUQSuMu4s2VMgkYDXvG60O5HupsY6tFjiszvbHdl-oS22eunZZbiSwN7_3F7Z72sKzENsG17Od9UpAoqwy35gzPfru-quKU3nMUZ5Lc7mTuePJWNbxRuGTLTWQQvMauQIWJS3n8Wg",
                          className: "h-full w-full object-cover opacity-50",
                        }),
                        _jsxs("div", {
                          className:
                            "absolute left-4 top-4 max-w-xs rounded-lg border border-white/40 bg-white/80 p-4 backdrop-blur",
                          children: [
                            _jsxs("div", {
                              className:
                                "mb-3 flex items-center justify-between gap-sm",
                              children: [
                                _jsx("h3", {
                                  className:
                                    "font-headline-lg-mobile text-on-surface",
                                  children: "Residuos Cercanos",
                                }),
                                _jsx("button", {
                                  type: "button",
                                  onClick: onEditProfile,
                                  className:
                                    "rounded-full bg-surface px-sm py-xs text-[11px] font-bold text-secondary transition-colors hover:bg-surface-container",
                                  children: "Editar perfil",
                                }),
                              ],
                            }),
                            _jsx("p", {
                              className:
                                "mb-3 text-label-sm text-on-surface-variant",
                              children:
                                "Selecciona un residuo para gestionar su retiro.",
                            }),
                            _jsx("ul", {
                              className: "space-y-2 text-[12px]",
                              children: (data?.nearbyWaste ?? [])
                                .slice(0, 4)
                                .map((item, idx) =>
                                  _jsx(
                                    "li",
                                    {
                                      children: _jsx("button", {
                                        type: "button",
                                        onClick: () =>
                                          onSelectNearbyWaste(item),
                                        className: `w-full rounded-lg bg-surface-container p-2 text-left transition-colors hover:bg-surface-container-high ${idx === 0 ? "border-l-4 border-primary" : "border-l-4 border-secondary"}`,
                                        children: _jsxs("span", {
                                          className:
                                            "flex w-full items-center justify-between gap-sm",
                                          children: [
                                            _jsx("span", {
                                              children: item.material,
                                            }),
                                            _jsxs("span", {
                                              className: "font-bold",
                                              children: [
                                                item.total,
                                                " ",
                                                item.unit,
                                              ],
                                            }),
                                          ],
                                        }),
                                      }),
                                    },
                                    item.material,
                                  ),
                                ),
                            }),
                          ],
                        }),
                      ],
                    }),
                    _jsxs("article", {
                      className:
                        "rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm lg:col-span-4",
                      children: [
                        _jsx("h3", {
                          className:
                            "mb-md font-headline-lg-mobile text-on-surface",
                          children: "Capacidad de Planta",
                        }),
                        _jsxs("div", {
                          className: "space-y-5",
                          children: [
                            (data?.capacity ?? []).map((item, index) =>
                              _jsxs(
                                "div",
                                {
                                  children: [
                                    _jsxs("div", {
                                      className: "mb-1 flex justify-between",
                                      children: [
                                        _jsx("span", {
                                          className: "text-label-sm",
                                          children: item.material,
                                        }),
                                        _jsxs("span", {
                                          className: "text-label-sm font-bold",
                                          children: [item.percent, "%"],
                                        }),
                                      ],
                                    }),
                                    _jsx("div", {
                                      className:
                                        "h-3 overflow-hidden rounded-full bg-surface-container",
                                      children: _jsx("div", {
                                        className: `h-full ${index === 0 ? "bg-primary" : index === 1 ? "bg-secondary" : "bg-tertiary"}`,
                                        style: { width: `${item.percent}%` },
                                      }),
                                    }),
                                  ],
                                },
                                item.material,
                              ),
                            ),
                            !loading &&
                              (data?.capacity ?? []).length === 0 &&
                              _jsx("div", {
                                className: "text-on-surface-variant",
                                children: "Sin datos de capacidad",
                              }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                _jsxs("section", {
                  className:
                    "overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm",
                  children: [
                    _jsxs("div", {
                      className:
                        "flex items-center justify-between border-b border-outline-variant px-md py-4",
                      children: [
                        _jsx("h3", {
                          className: "font-headline-lg-mobile text-on-surface",
                          children: "Historial de Recoleccion",
                        }),
                        _jsx("button", {
                          type: "button",
                          className: "text-secondary hover:underline",
                          children: "Ver reporte completo",
                        }),
                      ],
                    }),
                    _jsx("div", {
                      className: "overflow-x-auto",
                      children: _jsxs("table", {
                        className: "w-full text-left",
                        children: [
                          _jsx("thead", {
                            className:
                              "bg-surface-container-low text-on-surface-variant",
                            children: _jsxs("tr", {
                              children: [
                                _jsx("th", {
                                  className: "px-md py-sm text-label-sm",
                                  children: "Fecha / ID",
                                }),
                                _jsx("th", {
                                  className: "px-md py-sm text-label-sm",
                                  children: "Origen",
                                }),
                                _jsx("th", {
                                  className: "px-md py-sm text-label-sm",
                                  children: "Material",
                                }),
                                _jsx("th", {
                                  className: "px-md py-sm text-label-sm",
                                  children: "Cantidad",
                                }),
                                _jsx("th", {
                                  className: "px-md py-sm text-label-sm",
                                  children: "Estado",
                                }),
                              ],
                            }),
                          }),
                          _jsxs("tbody", {
                            className: "divide-y divide-outline-variant",
                            children: [
                              (data?.collectionHistory ?? []).map((row) =>
                                _jsxs(
                                  "tr",
                                  {
                                    className:
                                      "transition-colors hover:bg-surface-container-low",
                                    children: [
                                      _jsxs("td", {
                                        className: "px-md py-md",
                                        children: [
                                          _jsx("p", {
                                            className: "font-bold",
                                            children: formatDate(row.fecha),
                                          }),
                                          _jsxs("p", {
                                            className:
                                              "text-[10px] text-on-surface-variant",
                                            children: ["#SOL-", row.id],
                                          }),
                                        ],
                                      }),
                                      _jsx("td", {
                                        className: "px-md py-md",
                                        children: row.origen,
                                      }),
                                      _jsx("td", {
                                        className: "px-md py-md font-bold",
                                        children: row.material,
                                      }),
                                      _jsxs("td", {
                                        className: "px-md py-md",
                                        children: [
                                          row.cantidad,
                                          " ",
                                          row.unidad,
                                        ],
                                      }),
                                      _jsx("td", {
                                        className: "px-md py-md",
                                        children: row.estado,
                                      }),
                                    ],
                                  },
                                  row.id,
                                ),
                              ),
                              !loading &&
                                (data?.collectionHistory ?? []).length === 0 &&
                                _jsx("tr", {
                                  children: _jsx("td", {
                                    colSpan: 5,
                                    className:
                                      "px-md py-md text-center text-on-surface-variant",
                                    children:
                                      "No hay historial de recoleccion disponible",
                                  }),
                                }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
  });
}
