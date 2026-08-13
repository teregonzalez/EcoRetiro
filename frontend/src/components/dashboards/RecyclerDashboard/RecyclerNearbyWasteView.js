import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardShell from "../DashboardShell/DashboardShell";
export default function RecyclerNearbyWasteView({ username, onLogout, }) {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state ?? {});
    const material = state.material ?? "Material no especificado";
    const total = state.total ?? 0;
    const unit = state.unit ?? "kg";
    const [pickupDate, setPickupDate] = useState("");
    const [estimatedLoad, setEstimatedLoad] = useState(String(total || ""));
    const [priority, setPriority] = useState("Media");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navItems = [
        {
            label: "Dashboard",
            icon: "dashboard",
            onClick: () => navigate("/dashboard", { state: { recyclerTab: "Inventario" } }),
        },
        {
            label: "Residuos",
            icon: "recycling",
            active: true,
            onClick: () => navigate("/dashboard", { state: { recyclerTab: "Residuos" } }),
        },
        {
            label: "Rutas",
            icon: "local_shipping",
            onClick: () => navigate("/dashboard", { state: { recyclerTab: "Rutas" } }),
        },
        {
            label: "Reportes",
            icon: "book",
            onClick: () => navigate("/dashboard", { state: { recyclerTab: "Reportes" } }),
        },
    ];
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitting(true);
        setSuccessMessage("");
        setTimeout(() => {
            setSubmitting(false);
            setSuccessMessage("Solicitud de retiro enviada al generador y al modulo logistico.");
        }, 1200);
    };
    return (_jsx(DashboardShell, { appName: "EcoCircular", panelTitle: "Panel Reciclador", subtitle: "Gestion de retiro para residuos cercanos", username: username, roleLabel: "Empresa Recicladora", navItems: navItems, activeTopTab: "Logistica", onLogout: onLogout, children: _jsxs("div", { className: "relative min-h-[calc(100vh-220px)] overflow-hidden rounded-2xl border border-outline-variant bg-surface", children: [_jsx("div", { className: "pointer-events-none absolute inset-0 hidden opacity-40 blur-[2px] md:block", children: _jsxs("div", { className: "grid h-full grid-cols-12 gap-gutter p-margin", children: [_jsxs("div", { className: "col-span-8 space-y-gutter", children: [_jsx("div", { className: "h-40 rounded-xl bg-surface-container" }), _jsxs("div", { className: "grid grid-cols-3 gap-gutter", children: [_jsx("div", { className: "h-24 rounded-xl bg-surface-container-high" }), _jsx("div", { className: "h-24 rounded-xl bg-surface-container-high" }), _jsx("div", { className: "h-24 rounded-xl bg-surface-container-high" })] }), _jsx("div", { className: "h-64 rounded-xl bg-surface-container" })] }), _jsx("div", { className: "col-span-4 rounded-xl bg-surface-container-low" })] }) }), _jsx("div", { className: "relative z-10 flex min-h-[calc(100vh-220px)] items-start justify-center overflow-y-auto bg-on-surface/10 p-sm md:items-center md:bg-on-surface/20 md:p-gutter md:backdrop-blur-sm", children: _jsx("div", { className: "my-sm w-full max-w-3xl overflow-hidden rounded-xl bg-surface-container-lowest shadow-xl md:my-gutter md:max-h-[calc(100vh-260px)] md:overflow-y-auto", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsxs("aside", { className: "relative hidden w-1/3 bg-secondary p-lg text-on-secondary md:flex md:flex-col md:justify-end", children: [_jsx("div", { className: "pointer-events-none absolute inset-0 opacity-20", children: _jsxs("svg", { className: "h-full w-full", viewBox: "0 0 100 100", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("circle", { cx: "18", cy: "14", r: "30", fill: "currentColor" }), _jsx("circle", { cx: "84", cy: "84", r: "26", fill: "currentColor" })] }) }), _jsxs("div", { className: "relative z-10", children: [_jsx("span", { className: "mb-sm block font-label-sm uppercase tracking-[0.18em] text-secondary-fixed", children: "Seleccion de Residuo" }), _jsx("h2", { className: "font-headline-lg-mobile leading-tight", children: "Retiro Disponible" }), _jsx("p", { className: "mt-sm text-on-secondary/85", children: "Coordina el retiro y asegura trazabilidad completa." })] })] }), _jsxs("div", { className: "flex-1 p-md md:p-lg", children: [_jsxs("div", { className: "mb-md flex items-start justify-between gap-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "font-label-sm uppercase tracking-wider text-outline", children: "Residuos Cercanos" }), _jsx("h1", { className: "font-headline-lg-mobile text-on-surface", children: "Detalle de Residuo" })] }), _jsx("button", { type: "button", onClick: () => navigate("/dashboard"), className: "flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container", "aria-label": "Cerrar vista", children: _jsx("span", { className: "material-symbols-outlined", children: "close" }) })] }), _jsxs("div", { className: "mb-md rounded-xl border-l-4 border-secondary bg-surface-container-low p-md", children: [_jsx("p", { className: "font-label-sm uppercase tracking-wider text-on-surface-variant", children: "Material Seleccionado" }), _jsx("p", { className: "mt-xs font-headline-lg-mobile text-on-surface", children: material }), _jsxs("p", { className: "mt-xs font-body-md text-on-surface-variant", children: ["Disponible: ", total, " ", unit] })] }), _jsxs("form", { className: "space-y-md", onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 gap-md md:grid-cols-2", children: [_jsxs("div", { className: "space-y-sm", children: [_jsx("label", { className: "font-label-sm text-on-surface-variant", children: "CANTIDAD A RETIRAR" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", min: "0", step: "0.1", value: estimatedLoad, onChange: (event) => setEstimatedLoad(event.target.value), className: "w-full rounded-xl bg-surface-container px-md py-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-secondary/20", required: true }), _jsx("span", { className: "pointer-events-none absolute right-md top-1/2 -translate-y-1/2 font-label-sm text-secondary", children: unit })] })] }), _jsxs("div", { className: "space-y-sm", children: [_jsx("label", { className: "font-label-sm text-on-surface-variant", children: "FECHA ESTIMADA DE RETIRO" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "date", value: pickupDate, onChange: (event) => setPickupDate(event.target.value), className: "w-full rounded-xl bg-surface-container px-md py-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-secondary/20", required: true }), _jsx("span", { className: "material-symbols-outlined pointer-events-none absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant", children: "calendar_today" })] })] })] }), _jsxs("div", { className: "space-y-sm", children: [_jsx("label", { className: "font-label-sm text-on-surface-variant", children: "PRIORIDAD LOGISTICA" }), _jsx("div", { className: "grid grid-cols-1 gap-base sm:grid-cols-3", children: ["Alta", "Media", "Baja"].map((value) => (_jsx("button", { type: "button", onClick: () => setPriority(value), className: `rounded-xl border px-sm py-sm font-label-sm transition-all ${priority === value
                                                                    ? "border-secondary bg-secondary-container text-on-secondary-container"
                                                                    : "border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`, children: value }, value))) })] }), _jsxs("div", { className: "space-y-sm", children: [_jsx("label", { className: "font-label-sm text-on-surface-variant", children: "NOTAS OPERATIVAS" }), _jsx("textarea", { value: notes, onChange: (event) => setNotes(event.target.value), className: "h-24 w-full resize-none rounded-xl bg-surface-container px-md py-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-secondary/20", placeholder: "Indica acceso de camiones, ventanas de retiro o condicion de embalaje..." })] }), _jsxs("div", { className: "flex flex-col gap-sm pt-base sm:flex-row", children: [_jsx("button", { type: "button", onClick: () => navigate("/dashboard"), className: "min-h-[48px] flex-1 rounded-xl bg-surface-container-high px-lg py-sm font-label-sm text-on-surface-variant transition-colors hover:bg-surface-container-highest", children: "Volver al Dashboard" }), _jsx("button", { type: "submit", disabled: submitting, className: "group min-h-[48px] flex-[2] rounded-xl bg-secondary px-lg py-sm font-label-sm text-on-secondary shadow-md transition-all hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-70", children: _jsx("span", { className: "inline-flex items-center gap-sm", children: submitting ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined animate-spin text-[18px]", children: "sync" }), "Enviando..."] })) : (_jsxs(_Fragment, { children: ["Confirmar Retiro", _jsx("span", { className: "material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1", children: "arrow_forward" })] })) }) })] })] }), successMessage && (_jsx("p", { className: "mt-md rounded-lg bg-tertiary-container p-sm text-center font-label-sm text-on-tertiary-container", children: successMessage }))] })] }) }) })] }) }));
}
