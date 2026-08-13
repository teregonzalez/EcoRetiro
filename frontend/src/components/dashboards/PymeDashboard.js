import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import DashboardShell from "./DashboardShell/DashboardShell";
import ReportsView from "./ReportsView";
import RoutesView from "./RoutesView";
import PymeWasteSpotlightView from "./PymeWasteSpotlightView";
import { fetchPymeDashboard, } from "../../api/dashboard";
const CHILE_TIMEZONE = "America/Santiago";
const formatDate = (rawDate) => {
    if (!rawDate)
        return "Sin fecha de retiro";
    const normalized = rawDate.trim();
    if (!normalized)
        return "Sin fecha de retiro";
    // For date-only values (YYYY-MM-DD), force noon UTC so formatting in Chile keeps the same calendar day.
    const dateOnlyMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    let date;
    if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0));
    }
    else {
        date = new Date(normalized);
    }
    if (Number.isNaN(date.getTime()))
        return rawDate;
    return date.toLocaleString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: CHILE_TIMEZONE,
    });
};
export default function PymeDashboard({ userId, username, onLogout, onCreateWaste, }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("Inventario");
    const [selectedWasteId, setSelectedWasteId] = useState(null);
    const selectedWaste = data?.history.find((row) => row.id === selectedWasteId) ??
        data?.history[0] ??
        null;
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
        const loadData = async () => {
            try {
                setLoading(true);
                const dashboardData = await fetchPymeDashboard(userId);
                setData(dashboardData);
                setSelectedWasteId((currentSelectedWasteId) => {
                    if (currentSelectedWasteId &&
                        dashboardData.history.some((row) => row.id === currentSelectedWasteId)) {
                        return currentSelectedWasteId;
                    }
                    return dashboardData.history[0]?.id ?? null;
                });
                setError("");
            }
            catch {
                setError("No fue posible cargar el dashboard de PYME");
            }
            finally {
                setLoading(false);
            }
        };
        void loadData();
    }, [userId]);
    return (_jsx(DashboardShell, { appName: "EcoCircular", panelTitle: "Panel PYME", subtitle: "Gestion de entregas, impacto ambiental y trazabilidad", username: username, roleLabel: "Generador PYME", navItems: navItems, activeTopTab: activeTab, ctaLabel: "Nueva Solicitud", onTopTabChange: setActiveTab, onLogout: onLogout, children: activeTab === "Residuos" ? (_jsx(PymeWasteSpotlightView, { entry: selectedWaste, profile: data?.profile ?? null })) : activeTab === "Rutas" ? (_jsx(RoutesView, {})) : activeTab === "Reportes" ? (_jsx(ReportsView, { title: "Reportes de generaci\u00F3n", subtitle: "Consulta indicadores de impacto, solicitudes y desempe\u00F1o ambiental de tu empresa.", roleLabel: "Generador PYME" })) : (_jsxs(_Fragment, { children: [loading && (_jsx("div", { className: "mb-md rounded-lg border border-outline-variant bg-surface-container-low p-md text-on-surface-variant", children: "Cargando datos del panel..." })), error && (_jsx("div", { className: "mb-md rounded-lg border border-error bg-error-container p-md text-on-error-container", children: error })), _jsxs("section", { className: "mb-lg grid grid-cols-1 gap-gutter lg:grid-cols-3", children: [_jsxs("article", { className: "relative overflow-hidden rounded-xl bg-primary-container p-xl shadow-md lg:col-span-2", children: [_jsxs("div", { className: "relative z-10 max-w-xl", children: [_jsx("h3", { className: "font-headline-lg-mobile text-white", children: "Listo para una nueva entrega" }), _jsx("p", { className: "mt-sm text-on-primary-container", children: "Registra residuos para programar recoleccion optimizada y reducir tu huella." }), _jsxs("button", { type: "button", onClick: onCreateWaste, className: "mt-md inline-flex items-center gap-2 rounded-full bg-secondary-container px-md py-sm font-bold text-on-secondary-container transition-all hover:bg-secondary hover:text-on-secondary", children: [_jsx("span", { className: "material-symbols-outlined", children: "add_circle" }), "Ingresar Nuevos Residuos"] })] }), _jsx("span", { className: "material-symbols-outlined pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 text-[220px] text-primary-fixed/20", style: { fontVariationSettings: "'FILL' 1" }, children: "recycling" })] }), _jsxs("article", { className: "rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm", children: [_jsx("p", { className: "font-label-sm uppercase tracking-wider text-on-surface-variant", children: "Impacto Ambiental" }), _jsxs("p", { className: "mt-md text-display-lg text-primary", children: [(data?.metrics.co2Saved ?? 0).toFixed(1), " kg"] }), _jsx("p", { className: "text-on-surface-variant", children: "CO2 evitado estimado" }), _jsxs("div", { className: "mt-md flex items-center gap-sm", children: [_jsx("div", { className: "h-2 flex-1 overflow-hidden rounded-full bg-surface-container-high", children: _jsx("div", { className: "h-full rounded-full bg-primary", style: {
                                                    width: `${Math.min(100, Math.round((data?.metrics.totalEntries ?? 0) * 10))}%`,
                                                } }) }), _jsxs("span", { className: "text-label-sm font-bold text-on-surface", children: [data?.metrics.totalEntries ?? 0, " reg."] })] })] })] }), _jsxs("section", { className: "grid grid-cols-1 gap-gutter xl:grid-cols-4", children: [_jsxs("article", { className: "overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm xl:col-span-3", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-outline-variant px-md py-4", children: [_jsx("h3", { className: "font-headline-lg-mobile text-on-surface", children: "Historial de Residuos" }), _jsx("button", { type: "button", className: "text-secondary hover:underline", children: "Exportar" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-surface-container-low text-on-surface-variant", children: _jsxs("tr", { children: [_jsx("th", { className: "px-md py-sm text-label-sm", children: "Fecha" }), _jsx("th", { className: "px-md py-sm text-label-sm", children: "Tipo" }), _jsx("th", { className: "px-md py-sm text-label-sm", children: "Cantidad" }), _jsx("th", { className: "px-md py-sm text-label-sm", children: "Estado" }), _jsx("th", { className: "px-md py-sm text-label-sm", children: "Acciones" })] }) }), _jsxs("tbody", { className: "divide-y divide-outline-variant", children: [(data?.history ?? []).map((row) => (_jsxs("tr", { className: "transition-colors hover:bg-surface-container-low", children: [_jsx("td", { className: "px-md py-md", children: formatDate(row.fecha) }), _jsx("td", { className: "px-md py-md font-bold", children: row.tipo }), _jsxs("td", { className: "px-md py-md", children: [row.cantidad, " ", row.unidad] }), _jsx("td", { className: "px-md py-md", children: _jsx("span", { className: `rounded-full px-sm py-xs text-label-sm font-bold ${row.estado === "Gestionado"
                                                                        ? "bg-primary-fixed/30 text-primary"
                                                                        : "bg-secondary-fixed/40 text-secondary"}`, children: row.estado }) }), _jsx("td", { className: "px-md py-md", children: _jsx("button", { type: "button", onClick: () => {
                                                                        setSelectedWasteId(row.id);
                                                                        setActiveTab("Residuos");
                                                                    }, className: "font-label-sm text-secondary hover:underline", children: "Ver detalle" }) })] }, row.id))), !loading && (data?.history ?? []).length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-md py-md text-center text-on-surface-variant", children: "No hay registros para esta empresa" }) }))] })] }) })] }), _jsxs("article", { className: "rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm", children: [_jsx("h3", { className: "mb-md font-headline-lg-mobile text-on-surface", children: "Perfil de Empresa" }), _jsxs("div", { className: "space-y-sm", children: [_jsxs("div", { className: "rounded-lg bg-surface-container-low p-sm", children: [_jsx("p", { className: "text-label-sm font-bold text-on-surface-variant", children: "Ubicacion" }), _jsx("p", { className: "text-body-md", children: data?.profile?.ubicacion ?? "-" })] }), _jsxs("div", { className: "rounded-lg bg-surface-container-low p-sm", children: [_jsx("p", { className: "text-label-sm font-bold text-on-surface-variant", children: "Contacto" }), _jsx("p", { className: "text-body-md", children: data?.profile?.contacto ?? "-" })] }), _jsxs("div", { className: "rounded-lg bg-surface-container-low p-sm", children: [_jsx("p", { className: "text-label-sm font-bold text-on-surface-variant", children: "Telefono" }), _jsx("p", { className: "text-body-md", children: data?.profile?.telefono ?? "-" })] })] }), _jsxs("button", { type: "button", className: "mt-md flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary py-sm font-bold text-primary transition-all hover:bg-primary hover:text-white", children: [_jsx("span", { className: "material-symbols-outlined", children: "edit" }), "Editar Perfil"] })] })] })] })) }));
}
