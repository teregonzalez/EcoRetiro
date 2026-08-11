import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardShell from "../DashboardShell/DashboardShell";
const navItems = [
    { label: "Dashboard", icon: "dashboard" },
    { label: "Residuos", icon: "recycling", active: true },
    { label: "Cumplimiento", icon: "verified_user" },
    { label: "Rutas", icon: "local_shipping" },
    { label: "Analiticas", icon: "analytics" },
];
const wasteOptions = [
    {
        id: "plastic",
        label: "PLASTICO",
        icon: "water_full",
        apiType: "plastic",
        categoryId: 2,
    },
    {
        id: "paper",
        label: "PAPEL",
        icon: "description",
        apiType: "paper",
        categoryId: 1,
    },
    {
        id: "glass",
        label: "VIDRIO",
        icon: "wine_bar",
        apiType: "glass",
        categoryId: 4,
    },
    {
        id: "metal",
        label: "METAL",
        icon: "precision_manufacturing",
        apiType: "metal",
        categoryId: 5,
    },
    {
        id: "organic",
        label: "ORGANICO",
        icon: "compost",
        apiType: "wood",
        categoryId: 4,
    },
];
export default function PymeWasteEntryForm({ userId, username, onLogout, }) {
    const navigate = useNavigate();
    const [wasteType, setWasteType] = useState(wasteOptions[0].id);
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("kg");
    const [availableDate, setAvailableDate] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const selectedOption = wasteOptions.find((option) => option.id === wasteType);
        const parsedQuantity = Number(quantity);
        if (!selectedOption ||
            Number.isNaN(parsedQuantity) ||
            parsedQuantity <= 0) {
            navigate("/dashboard/pyme/residuos/error", {
                state: {
                    errorMessage: "Debes ingresar un tipo de residuo y una cantidad valida para continuar.",
                },
            });
            return;
        }
        try {
            setSubmitting(true);
            await axios.post("/api/waste/add", {
                userId,
                categoryId: selectedOption.categoryId,
                type: selectedOption.apiType,
                weight: parsedQuantity,
                pickupDate: availableDate || null,
            });
            navigate("/dashboard/pyme/residuos/exito", {
                state: {
                    wasteTypeLabel: selectedOption.label,
                    quantity: parsedQuantity,
                    unit,
                    availableDate,
                    notes,
                    trackingId: `RET-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
                    createdAt: new Date().toISOString(),
                },
            });
        }
        catch (error) {
            navigate("/dashboard/pyme/residuos/error", {
                state: {
                    errorMessage: error?.response?.data?.error ||
                        "Hubo una interrupcion inesperada durante la validacion de los datos.",
                },
            });
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx(DashboardShell, { appName: "EcoCircular", panelTitle: "Panel PYME", subtitle: "Logistica de generacion y trazabilidad de residuos", username: username, roleLabel: "Generador PYME", navItems: navItems, activeTopTab: "Logistica", onLogout: onLogout, children: _jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low p-md md:p-lg", children: [_jsx("div", { className: "pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" }), _jsx("div", { className: "pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" }), _jsxs("div", { className: "relative mx-auto flex w-full max-w-5xl flex-col gap-md rounded-2xl bg-surface-container-lowest shadow-lg md:flex-row", children: [_jsxs("aside", { className: "hidden w-full md:flex md:w-1/3 flex-col justify-end rounded-l-2xl bg-primary p-lg text-on-primary", children: [_jsx("span", { className: "font-label-sm uppercase tracking-[0.2em] text-primary-fixed", children: "EcoRetiro" }), _jsx("h2", { className: "mt-sm font-headline-lg-mobile leading-tight", children: "Gestion de Impacto" }), _jsx("p", { className: "mt-sm text-on-primary/85", children: "Cada residuo ingresado es un paso hacia un futuro circular." })] }), _jsxs("div", { className: "flex-1 p-md md:p-lg", children: [_jsxs("div", { className: "mb-md flex items-start justify-between gap-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "font-label-sm uppercase tracking-wider text-outline", children: "Logistica de Generacion" }), _jsx("h1", { className: "font-headline-lg-mobile text-on-surface", children: "Nuevo Ingreso" })] }), _jsx("button", { type: "button", onClick: () => navigate("/dashboard"), className: "flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container", "aria-label": "Cerrar formulario", children: _jsx("span", { className: "material-symbols-outlined", children: "close" }) })] }), _jsxs("form", { className: "space-y-md", onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-sm", children: [_jsxs("label", { className: "flex items-center gap-xs font-label-sm text-on-surface-variant", children: [_jsx("span", { className: "material-symbols-outlined text-[16px]", children: "category" }), "TIPO DE RESIDUO"] }), _jsx("div", { className: "grid grid-cols-2 gap-base sm:grid-cols-3 lg:grid-cols-5", children: wasteOptions.map((option) => (_jsxs("label", { className: "group cursor-pointer", children: [_jsx("input", { type: "radio", name: "waste_type", value: option.id, checked: wasteType === option.id, onChange: (event) => setWasteType(event.target.value), className: "peer hidden" }), _jsxs("span", { className: "flex flex-col items-center justify-center rounded-xl border-2 border-transparent bg-surface-container p-sm transition-all hover:bg-surface-container-high peer-checked:border-primary peer-checked:bg-primary-container/10", children: [_jsx("span", { className: "material-symbols-outlined text-primary transition-transform group-hover:scale-110", children: option.icon }), _jsx("span", { className: "mt-xs text-[10px] font-label-sm", children: option.label })] })] }, option.id))) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-md md:grid-cols-2", children: [_jsxs("div", { className: "space-y-sm", children: [_jsx("label", { className: "font-label-sm text-on-surface-variant", children: "CANTIDAD ESTIMADA" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", min: "0", step: "0.1", value: quantity, onChange: (event) => setQuantity(event.target.value), placeholder: "0.00", className: "w-full rounded-xl bg-surface-container px-md py-sm pr-24 text-on-surface outline-none transition-all focus:ring-2 focus:ring-secondary/20", required: true }), _jsxs("div", { className: "absolute right-md top-1/2 flex -translate-y-1/2 items-center gap-xs", children: [_jsx("span", { className: "mr-xs h-4 w-px bg-outline-variant" }), _jsxs("select", { value: unit, onChange: (event) => setUnit(event.target.value), className: "cursor-pointer bg-transparent font-label-sm text-secondary outline-none", children: [_jsx("option", { value: "kg", children: "kg" }), _jsx("option", { value: "Ton", children: "Ton" })] })] })] })] }), _jsxs("div", { className: "space-y-sm", children: [_jsx("label", { className: "font-label-sm text-on-surface-variant", children: "DISPONIBILIDAD" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "date", value: availableDate, onChange: (event) => setAvailableDate(event.target.value), className: "w-full appearance-none rounded-xl bg-surface-container px-md py-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-secondary/20", required: true }), _jsx("span", { className: "material-symbols-outlined pointer-events-none absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant", children: "calendar_today" })] })] })] }), _jsxs("div", { className: "space-y-sm", children: [_jsx("label", { className: "font-label-sm text-on-surface-variant", children: "NOTAS ADICIONALES" }), _jsx("textarea", { value: notes, onChange: (event) => setNotes(event.target.value), placeholder: "Especificaciones de retiro, acceso o embalaje...", className: "h-24 w-full resize-none rounded-xl bg-surface-container px-md py-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-secondary/20" })] }), _jsxs("div", { className: "flex flex-col gap-sm pt-base sm:flex-row sm:items-center", children: [_jsx("button", { type: "button", onClick: () => navigate("/dashboard"), className: "flex-1 rounded-xl bg-primary/10 px-lg py-sm font-label-sm text-primary transition-all hover:bg-primary/20", children: "Guardar Borrador" }), _jsx("button", { type: "submit", disabled: submitting, className: "group flex flex-[2] items-center justify-center gap-sm rounded-xl bg-primary px-lg py-sm font-label-sm text-on-primary shadow-md transition-all hover:bg-tertiary hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-80", children: submitting ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined animate-spin text-[20px]", children: "sync" }), "Procesando..."] })) : (_jsxs(_Fragment, { children: ["Confirmar Ingreso", _jsx("span", { className: "material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1", children: "arrow_forward" })] })) })] })] }), _jsx("p", { className: "mt-md text-center font-label-sm text-outline", children: "Al confirmar, notificaremos a la red de recolectores locales." })] })] })] }) }));
}
