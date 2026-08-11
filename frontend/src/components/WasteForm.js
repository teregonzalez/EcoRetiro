import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
export const WasteForm = ({ userId, onWasteAdded, }) => {
    const [type, setType] = useState("");
    const [weight, setWeight] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const wasteTypes = [
        { value: "Plastic", label: "♻️ Plástico", icon: "recyclable" },
        { value: "Paper", label: "📄 Papel", icon: "description" },
        { value: "Glass", label: "🔷 Vidrio", icon: "diamond" },
        { value: "Aluminum", label: "⚙️ Aluminio", icon: "settings" },
        { value: "Cardboard", label: "📦 Cartón", icon: "inventory_2" },
        { value: "Wood", label: "🪵 Madera", icon: "natural" },
        { value: "Metal", label: "⚡ Metal", icon: "bolt" },
    ];
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await axios.post("/api/waste/add", {
                userId,
                type,
                weight: parseFloat(weight),
            });
            setSuccess("¡Entrada de residuos registrada exitosamente!");
            setType("");
            setWeight("");
            onWasteAdded();
            setTimeout(() => setSuccess(""), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error ||
                "Ocurrió un error. Por favor intenta de nuevo.");
        }
    };
    return (_jsxs("div", { className: "w-full", children: [_jsxs("div", { className: "mb-xl", children: [_jsxs("h2", { className: "font-headline-lg text-primary mb-xs flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-tertiary-fixed-dim", children: "add_circle" }), "Registrar Nuevo Residuo"] }), _jsx("p", { className: "font-body-md text-on-surface-variant", children: "Agrega informaci\u00F3n sobre los residuos que deseas registrar" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-md max-w-2xl", children: [_jsxs("div", { className: "space-y-xs", children: [_jsx("label", { className: "font-label-sm text-label-sm text-on-surface-variant ml-1", children: "Tipo de Residuo" }), _jsxs("div", { className: "relative group transition-transform focus-within:-translate-y-[2px]", children: [_jsx("span", { className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors duration-200", children: "category" }), _jsxs("select", { id: "type", value: type, onChange: (e) => setType(e.target.value), className: "input-field pl-10 appearance-none", required: true, children: [_jsx("option", { value: "", children: "Selecciona un tipo de residuo" }), wasteTypes.map((t) => (_jsx("option", { value: t.value, children: t.label }, t.value)))] })] })] }), _jsxs("div", { className: "space-y-xs", children: [_jsx("label", { className: "font-label-sm text-label-sm text-on-surface-variant ml-1", children: "Peso (kg)" }), _jsxs("div", { className: "relative group transition-transform focus-within:-translate-y-[2px]", children: [_jsx("span", { className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors duration-200", children: "scale" }), _jsx("input", { id: "weight", type: "number", step: "0.1", min: "0", value: weight, onChange: (e) => setWeight(e.target.value), placeholder: "Ingresa el peso en kg", className: "input-field pl-10", required: true })] })] }), error && (_jsxs("div", { className: "bg-error-container text-on-error-container p-3 rounded-lg text-sm font-medium border border-error flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "error" }), _jsx("span", { children: error })] })), success && (_jsxs("div", { className: "bg-tertiary-fixed text-on-primary-fixed p-3 rounded-lg text-sm font-medium border border-tertiary flex items-center gap-2 animate-pulse", children: [_jsx("span", { className: "material-symbols-outlined", children: "check_circle" }), _jsx("span", { children: success })] })), _jsx("div", { className: "flex gap-md pt-md", children: _jsxs("button", { type: "submit", className: "btn-primary flex items-center justify-center gap-2 flex-1", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "add" }), "Registrar Residuo"] }) }), _jsx("div", { className: "bg-surface-container-low p-md rounded-lg border border-outline-variant/30 mt-md", children: _jsxs("div", { className: "flex gap-2 items-start", children: [_jsx("span", { className: "material-symbols-outlined text-secondary text-[20px] mt-xs flex-shrink-0", children: "info" }), _jsx("div", { children: _jsxs("p", { className: "font-label-sm text-on-surface-variant", children: [_jsx("strong", { children: "Consejo:" }), " Aseg\u00FArate de registrar el peso correcto del residuo. Esto ayuda a optimizar nuestras rutas de log\u00EDstica y calcular el impacto ambiental."] }) })] }) })] })] }));
};
export default WasteForm;
