import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axios from "axios";
export const WasteInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        fetchInventory();
    }, []);
    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/waste/inventory");
            setInventory(response.data);
            setError("");
        }
        catch (err) {
            setError("No fue posible cargar el inventario");
        }
        finally {
            setLoading(false);
        }
    };
    const getWasteIcon = (type) => {
        const iconMap = {
            Plastic: "recyclable",
            Paper: "description",
            Glass: "diamond",
            Aluminum: "settings",
            Cardboard: "inventory_2",
            Wood: "natural",
            Metal: "bolt",
        };
        return iconMap[type] || "delete";
    };
    const getWasteColor = (type) => {
        const colorMap = {
            Plastic: "text-primary-fixed-dim",
            Paper: "text-primary",
            Glass: "text-secondary",
            Aluminum: "text-tertiary",
            Cardboard: "text-tertiary-fixed-dim",
            Wood: "text-primary-container",
            Metal: "text-secondary-fixed-dim",
        };
        return colorMap[type] || "text-on-surface-variant";
    };
    return (_jsxs("div", { className: "w-full", children: [_jsxs("div", { className: "flex justify-between items-start mb-xl", children: [_jsxs("div", { children: [_jsxs("h2", { className: "font-headline-lg text-primary mb-xs flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-tertiary", children: "inventory_2" }), "Inventario Disponible"] }), _jsx("p", { className: "font-body-md text-on-surface-variant", children: "Visualiza todos los residuos registrados en el sistema" })] }), _jsxs("button", { onClick: fetchInventory, className: "flex items-center gap-2 px-md py-3 rounded-lg border-2 border-secondary text-secondary hover:bg-secondary/5 transition-all font-bold", disabled: loading, children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "refresh" }), "Actualizar"] })] }), loading && (_jsx("div", { className: "flex items-center justify-center py-xl", children: _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "material-symbols-outlined text-[48px] text-secondary animate-spin block mb-md", children: "cached" }), _jsx("p", { className: "font-body-md text-on-surface-variant", children: "Cargando inventario..." })] }) })), error && (_jsxs("div", { className: "bg-error-container text-on-error-container p-md rounded-lg border border-error flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "error" }), _jsx("span", { className: "font-body-md", children: error })] })), !loading && inventory.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center py-xl border border-outline-variant/30 rounded-xl bg-surface-container-low", children: [_jsx("span", { className: "material-symbols-outlined text-[64px] text-outline-variant mb-md", style: { fontVariationSettings: "'FILL' 0" }, children: "inbox" }), _jsx("p", { className: "font-body-md text-on-surface-variant text-center", children: "No hay residuos registrados a\u00FAn" }), _jsx("p", { className: "font-label-sm text-on-surface-variant/70 mt-xs", children: "Comienza registrando tu primer residuo" })] })), !loading && inventory.length > 0 && (_jsxs("div", { className: "overflow-x-auto", children: [_jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b-2 border-outline-variant", children: [_jsx("th", { className: "text-left font-label-sm text-on-surface-variant px-md py-md", children: "Tipo de Residuo" }), _jsx("th", { className: "text-center font-label-sm text-on-surface-variant px-md py-md", children: "Peso Total (kg)" }), _jsx("th", { className: "text-center font-label-sm text-on-surface-variant px-md py-md", children: "Cantidad de Entradas" })] }) }), _jsx("tbody", { children: inventory.map((item) => (_jsxs("tr", { className: "border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors", children: [_jsx("td", { className: "px-md py-md", children: _jsxs("div", { className: "flex items-center gap-md", children: [_jsx("span", { className: `material-symbols-outlined text-[32px] ${getWasteColor(item.type)}`, style: { fontVariationSettings: "'FILL' 1" }, children: getWasteIcon(item.type) }), _jsx("div", { children: _jsx("p", { className: "font-body-md text-on-surface font-bold", children: item.type }) })] }) }), _jsx("td", { className: "text-center px-md py-md", children: _jsxs("div", { className: "inline-block bg-surface-container-low px-md py-xs rounded-lg", children: [_jsx("p", { className: "font-headline-lg text-primary", children: item.totalWeight.toFixed(2) }), _jsx("p", { className: "font-label-sm text-on-surface-variant", children: "kg" })] }) }), _jsx("td", { className: "text-center px-md py-md", children: _jsxs("div", { className: "inline-block bg-surface-container-low px-md py-xs rounded-lg", children: [_jsx("p", { className: "font-headline-lg text-secondary", children: item.count }), _jsx("p", { className: "font-label-sm text-on-surface-variant", children: "registros" })] }) })] }, item.type))) })] }), _jsxs("div", { className: "mt-xl pt-xl border-t-2 border-outline-variant flex flex-wrap gap-md", children: [_jsxs("div", { className: "flex-1 min-w-[200px] bg-surface-container-low p-md rounded-lg", children: [_jsx("p", { className: "font-label-sm text-on-surface-variant mb-xs", children: "Total de Entradas" }), _jsx("p", { className: "font-display-lg text-primary", children: inventory.reduce((sum, item) => sum + item.count, 0) })] }), _jsxs("div", { className: "flex-1 min-w-[200px] bg-surface-container-low p-md rounded-lg", children: [_jsx("p", { className: "font-label-sm text-on-surface-variant mb-xs", children: "Peso Total Registrado" }), _jsxs("p", { className: "font-display-lg text-primary", children: [inventory
                                                .reduce((sum, item) => sum + item.totalWeight, 0)
                                                .toFixed(2), " ", "kg"] })] }), _jsxs("div", { className: "flex-1 min-w-[200px] bg-surface-container-low p-md rounded-lg", children: [_jsx("p", { className: "font-label-sm text-on-surface-variant mb-xs", children: "Tipos de Residuos" }), _jsx("p", { className: "font-display-lg text-secondary", children: inventory.length })] })] })] }))] }));
};
export default WasteInventory;
