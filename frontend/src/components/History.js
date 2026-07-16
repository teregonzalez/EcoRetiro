import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
export const History = ({ userId }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchHistory();
    }, [userId]);
    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/waste/history/${userId}`);
            setEntries(response.data);
            setError('');
        }
        catch (err) {
            setError('No fue posible cargar el historial');
        }
        finally {
            setLoading(false);
        }
    };
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=500,width=800');
        if (printWindow) {
            let content = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reporte de Historial de Residuos</title>';
            content += '<style>';
            content += 'body { font-family: "Inter", sans-serif; padding: 20px; color: #191c1d; }';
            content += 'h1 { color: #00450d; border-bottom: 3px solid #2b5bb5; padding-bottom: 10px; }';
            content += 'table { border-collapse: collapse; width: 100%; margin-top: 20px; }';
            content += 'th { background-color: #00450d; color: white; padding: 12px; text-align: left; border: 1px solid #ccc; }';
            content += 'td { padding: 10px; border: 1px solid #ccc; }';
            content += 'tr:nth-child(even) { background-color: #f8fafb; }';
            content += 'tr:hover { background-color: #f2f4f5; }';
            content += '.summary { margin-top: 20px; padding: 15px; background-color: #acf4a4; border-radius: 8px; }';
            content += '.summary p { margin: 8px 0; font-weight: bold; }';
            content += '.footer { margin-top: 20px; font-size: 12px; color: #41493e; }';
            content += '</style></head><body>';
            content += '<h1>🌱 Reporte de Historial de Residuos - EcoRetiro</h1>';
            content += '<p><strong>Fecha del Reporte:</strong> ' + new Date().toLocaleDateString() + '</p>';
            content += '<table>';
            content += '<tr><th>Tipo de Residuo</th><th>Peso (kg)</th><th>Fecha y Hora</th></tr>';
            entries.forEach((entry) => {
                const date = new Date(entry.date);
                content += `<tr><td>${entry.type}</td><td>${entry.weight.toFixed(2)}</td><td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td></tr>`;
            });
            content += '</table>';
            content += '<div class="summary">';
            content += `<p>Total de Entradas: ${entries.length}</p>`;
            content += `<p>Peso Total Registrado: ${entries.reduce((sum, e) => sum + e.weight, 0).toFixed(2)} kg</p>`;
            const co2Saved = (entries.reduce((sum, e) => sum + e.weight, 0) * 0.18).toFixed(2);
            content += `<p>CO₂ Ahorrado (estimado): ${co2Saved} kg</p>`;
            content += '</div>';
            content += '<div class="footer"><p>Generado por EcoRetiro - Impulsando la Economía Circular | www.EcoRetiro.com</p></div>';
            content += '</body></html>';
            printWindow.document.write(content);
            printWindow.print();
        }
    };
    const getWasteIcon = (type) => {
        const iconMap = {
            'Plastic': 'recyclable',
            'Paper': 'description',
            'Glass': 'diamond',
            'Aluminum': 'settings',
            'Cardboard': 'inventory_2',
            'Wood': 'natural',
            'Metal': 'bolt',
        };
        return iconMap[type] || 'delete';
    };
    const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
    const co2Saved = totalWeight * 0.18; // Aproximadamente 0.18kg de CO2 por kg de residuos reciclados
    return (_jsxs("div", { className: "w-full", children: [_jsxs("div", { className: "flex justify-between items-start mb-xl", children: [_jsxs("div", { children: [_jsxs("h2", { className: "font-headline-lg text-primary mb-xs flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-secondary", children: "history" }), "Historial de Residuos"] }), _jsx("p", { className: "font-body-md text-on-surface-variant", children: "Revisa todas tus registros de residuos y genera reportes" })] }), _jsxs("div", { className: "flex gap-md", children: [_jsxs("button", { onClick: fetchHistory, className: "flex items-center gap-2 px-md py-3 rounded-lg border-2 border-secondary text-secondary hover:bg-secondary/5 transition-all font-bold", disabled: loading, children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "refresh" }), "Actualizar"] }), _jsxs("button", { onClick: handlePrint, disabled: entries.length === 0 || loading, className: "flex items-center gap-2 px-md py-3 rounded-lg bg-primary text-white hover:bg-primary-container transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "print" }), "Imprimir Reporte"] })] })] }), loading && (_jsx("div", { className: "flex items-center justify-center py-xl", children: _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "material-symbols-outlined text-[48px] text-secondary animate-spin block mb-md", children: "cached" }), _jsx("p", { className: "font-body-md text-on-surface-variant", children: "Cargando historial..." })] }) })), error && (_jsxs("div", { className: "bg-error-container text-on-error-container p-md rounded-lg border border-error flex items-center gap-2 mb-md", children: [_jsx("span", { className: "material-symbols-outlined", children: "error" }), _jsx("span", { className: "font-body-md", children: error })] })), !loading && entries.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center py-xl border border-outline-variant/30 rounded-xl bg-surface-container-low", children: [_jsx("span", { className: "material-symbols-outlined text-[64px] text-outline-variant mb-md", style: { fontVariationSettings: "'FILL' 0" }, children: "history" }), _jsx("p", { className: "font-body-md text-on-surface-variant text-center", children: "No hay historial de residuos a\u00FAn" }), _jsx("p", { className: "font-label-sm text-on-surface-variant/70 mt-xs", children: "Comienza registrando residuos para ver tu historial" })] })), !loading && entries.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "overflow-x-auto mb-xl", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b-2 border-outline-variant", children: [_jsx("th", { className: "text-left font-label-sm text-on-surface-variant px-md py-md", children: "Tipo" }), _jsx("th", { className: "text-right font-label-sm text-on-surface-variant px-md py-md", children: "Peso (kg)" }), _jsx("th", { className: "text-right font-label-sm text-on-surface-variant px-md py-md", children: "Fecha y Hora" })] }) }), _jsx("tbody", { children: entries.map((entry) => {
                                        const date = new Date(entry.date);
                                        return (_jsxs("tr", { className: "border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors", children: [_jsx("td", { className: "px-md py-md", children: _jsxs("div", { className: "flex items-center gap-md", children: [_jsx("span", { className: "material-symbols-outlined text-[24px] text-tertiary", style: { fontVariationSettings: "'FILL' 1" }, children: getWasteIcon(entry.type) }), _jsx("div", { children: _jsx("p", { className: "font-body-md text-on-surface font-bold", children: entry.type }) })] }) }), _jsx("td", { className: "text-right px-md py-md", children: _jsx("span", { className: "inline-block bg-surface-container-low px-md py-xs rounded-lg", children: _jsx("p", { className: "font-body-md text-primary font-bold", children: entry.weight.toFixed(2) }) }) }), _jsxs("td", { className: "text-right px-md py-md", children: [_jsx("p", { className: "font-body-md text-on-surface-variant text-sm", children: date.toLocaleDateString() }), _jsx("p", { className: "font-label-sm text-on-surface-variant", children: date.toLocaleTimeString() })] })] }, entry.id));
                                    }) })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-md", children: [_jsx("div", { className: "bg-surface-container-low p-md rounded-lg border border-outline-variant/30", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-label-sm text-on-surface-variant mb-xs", children: "Total de Registros" }), _jsx("p", { className: "font-display-lg text-primary", children: entries.length })] }), _jsx("span", { className: "material-symbols-outlined text-[48px] text-primary-fixed-dim opacity-50", style: { fontVariationSettings: "'FILL' 0" }, children: "list_alt" })] }) }), _jsx("div", { className: "bg-surface-container-low p-md rounded-lg border border-outline-variant/30", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-label-sm text-on-surface-variant mb-xs", children: "Peso Total" }), _jsx("p", { className: "font-display-lg text-primary", children: totalWeight.toFixed(2) }), _jsx("p", { className: "font-label-sm text-on-surface-variant", children: "kg" })] }), _jsx("span", { className: "material-symbols-outlined text-[48px] text-secondary-fixed-dim opacity-50", style: { fontVariationSettings: "'FILL' 0" }, children: "scale" })] }) }), _jsx("div", { className: "bg-surface-container-low p-md rounded-lg border border-outline-variant/30", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-label-sm text-on-surface-variant mb-xs", children: "CO\u2082 Ahorrado" }), _jsx("p", { className: "font-display-lg text-tertiary-fixed-dim", children: co2Saved.toFixed(2) }), _jsx("p", { className: "font-label-sm text-on-surface-variant", children: "kg" })] }), _jsx("span", { className: "material-symbols-outlined text-[48px] text-tertiary-fixed-dim opacity-50", style: { fontVariationSettings: "'FILL' 1" }, children: "eco" })] }) })] })] }))] }));
};
export default History;
