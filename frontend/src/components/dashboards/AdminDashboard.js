import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import DashboardShell from "./DashboardShell";
import { fetchAdminDashboard } from "../../api/dashboard";
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
            }
            catch {
                setError("No fue posible cargar el dashboard de administrador");
            }
            finally {
                setLoading(false);
            }
        };
        void loadData();
    }, [userId]);
    return (_jsxs(DashboardShell, { appName: "EcoCircular", panelTitle: "Panel de Administrador", subtitle: "Control de usuarios, trazabilidad y operacion general", username: username, roleLabel: "Administrador", navItems: navItems, topTabs: ["Resumen", "Usuarios", "Analitica"], activeTopTab: "Resumen", ctaLabel: "Nueva Solicitud", onLogout: onLogout, children: [loading && (_jsx("div", { className: "mb-md rounded-lg border border-outline-variant bg-surface-container-low p-md text-on-surface-variant", children: "Cargando datos del panel..." })), error && (_jsx("div", { className: "mb-md rounded-lg border border-error bg-error-container p-md text-on-error-container", children: error })), _jsxs("section", { className: "mb-lg grid grid-cols-1 gap-gutter md:grid-cols-3", children: [_jsxs("article", { className: "rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm", children: [_jsx("p", { className: "font-label-sm uppercase tracking-wider text-on-surface-variant", children: "Usuarios Totales" }), _jsx("h3", { className: "mt-2 text-[36px] font-bold text-on-surface", children: data?.metrics.totalUsers ?? 0 }), _jsx("p", { className: "text-[12px] text-outline", children: "Empresas activas en plataforma" })] }), _jsxs("article", { className: "rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm", children: [_jsx("p", { className: "font-label-sm uppercase tracking-wider text-on-surface-variant", children: "Solicitudes Pendientes" }), _jsx("h3", { className: "mt-2 text-[36px] font-bold text-on-surface", children: data?.metrics.pendingRequests ?? 0 }), _jsx("p", { className: "text-[12px] text-error", children: "Requieren revision prioritaria" })] }), _jsxs("article", { className: "rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm", children: [_jsx("p", { className: "font-label-sm uppercase tracking-wider text-on-surface-variant", children: "Residuos Hoy (Ton)" }), _jsx("h3", { className: "mt-2 text-[36px] font-bold text-on-surface", children: (data?.metrics.totalWasteTon ?? 0).toFixed(1) }), _jsx("p", { className: "text-[12px] text-outline", children: "Volumen total gestionado" })] })] }), _jsxs("section", { className: "mb-lg overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-md py-4", children: [_jsx("h3", { className: "font-headline-lg-mobile text-on-surface", children: "Gestion de Registros" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: "rounded-lg border border-outline-variant px-3 py-1.5 text-label-sm hover:bg-surface-variant", children: "Exportar CSV" }), _jsx("button", { type: "button", className: "rounded-lg border border-outline-variant px-3 py-1.5 text-label-sm hover:bg-surface-variant", children: "Filtrar" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse text-left", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-surface-container-low text-on-surface-variant", children: [_jsx("th", { className: "px-md py-4 text-label-sm", children: "Empresa" }), _jsx("th", { className: "px-md py-4 text-label-sm", children: "Rol" }), _jsx("th", { className: "px-md py-4 text-label-sm", children: "Estado" }), _jsx("th", { className: "px-md py-4 text-label-sm", children: "Registro" }), _jsx("th", { className: "px-md py-4 text-right text-label-sm", children: "Acciones" })] }) }), _jsx("tbody", { className: "divide-y divide-outline-variant", children: (data?.users ?? []).map((row) => (_jsxs("tr", { className: "transition-colors hover:bg-surface-container-low", children: [_jsx("td", { className: "px-md py-4 font-bold text-on-surface", children: row.empresa }), _jsx("td", { className: "px-md py-4 text-on-surface-variant", children: row.rol }), _jsx("td", { className: "px-md py-4", children: _jsx("span", { className: `rounded-full px-2 py-1 text-[11px] font-bold uppercase ${row.estado === "Aprobada"
                                                        ? "bg-primary-fixed text-on-primary-fixed"
                                                        : row.estado === "Pendiente"
                                                            ? "bg-surface-variant text-on-surface-variant"
                                                            : "bg-error-container text-error"}`, children: row.estado }) }), _jsx("td", { className: "px-md py-4 text-outline", children: formatDate(row.registro) }), _jsx("td", { className: "px-md py-4 text-right", children: _jsx("button", { type: "button", className: "text-primary hover:underline", children: "Administrar" }) })] }, row.id))) })] }) })] }), _jsxs("section", { className: "grid grid-cols-1 gap-gutter lg:grid-cols-3", children: [_jsxs("article", { className: "rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm lg:col-span-2", children: [_jsxs("div", { className: "mb-md flex items-center justify-between", children: [_jsx("h3", { className: "font-headline-lg-mobile text-on-surface", children: "Volumen por Tipo de Residuo" }), _jsx("span", { className: "text-label-sm text-on-surface-variant", children: "Top categorias" })] }), _jsxs("div", { className: "flex h-48 items-end gap-4", children: [(data?.wasteTrend ?? []).map((item) => {
                                        const maxValue = Math.max(...(data?.wasteTrend ?? [{ total: 1 }]).map((entry) => entry.total), 1);
                                        const height = Math.max(10, Math.round((item.total / maxValue) * 100));
                                        return (_jsxs("div", { className: "flex flex-1 flex-col items-center gap-2", children: [_jsx("div", { className: "w-full rounded-t bg-primary", style: { height: `${height}%` } }), _jsx("span", { className: "text-center text-[11px] text-outline", children: item.type })] }, item.type));
                                    }), !loading && (data?.wasteTrend ?? []).length === 0 && (_jsx("div", { className: "w-full text-center text-on-surface-variant", children: "Sin datos de volumen por categoria" }))] })] }), _jsxs("article", { className: "rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm", children: [_jsx("h3", { className: "mb-md font-headline-lg-mobile text-on-surface", children: "Informes Directos" }), _jsx("div", { className: "space-y-3", children: [
                                    "Mensual de Carbono",
                                    "Inventario de Plasticos",
                                    "Logistica Semanal",
                                ].map((item) => (_jsxs("button", { type: "button", className: "flex w-full items-center justify-between rounded-lg bg-surface-container-low p-3 text-left transition-colors hover:bg-surface-container-high", children: [_jsx("span", { className: "text-body-md text-on-surface-variant", children: item }), _jsx("span", { className: "material-symbols-outlined text-outline", children: "arrow_forward" })] }, item))) })] })] })] }));
}
