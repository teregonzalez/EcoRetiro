import React, { useState, useEffect } from "react";
import axios from "axios";

const CHILE_TIMEZONE = "America/Santiago";

const parseHistoryDate = (value) => {
  if (!value) return null;
  const normalized = String(value).trim();
  if (!normalized) return null;

  const dateOnlyMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0));
  }

  const sqliteDateMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  if (sqliteDateMatch) {
    const [, year, month, day, hour, minute, second] = sqliteDateMatch;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatHistoryDate = (value) => {
  const date = parseHistoryDate(value);
  if (!date) return "Fecha no disponible";
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: CHILE_TIMEZONE,
  });
};

const formatHistoryTime = (value) => {
  const date = parseHistoryDate(value);
  if (!date) return "Hora no disponible";
  return date.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: CHILE_TIMEZONE,
  });
};

export const History = ({ userId }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/waste/history/${userId}`);
      setEntries(response.data);
      setError("");
    } catch (err) {
      setError("No fue posible cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=500,width=800");
    if (printWindow) {
      let content = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reporte de Historial de Residuos</title>';
      content += "<style>";
      content += 'body { font-family: "Inter", sans-serif; padding: 20px; color: #191c1d; }';
      content += "h1 { color: #00450d; border-bottom: 3px solid #2b5bb5; padding-bottom: 10px; }";
      content += "table { border-collapse: collapse; width: 100%; margin-top: 20px; }";
      content += "th { background-color: #00450d; color: white; padding: 12px; text-align: left; border: 1px solid #ccc; }";
      content += "td { padding: 10px; border: 1px solid #ccc; }";
      content += "tr:nth-child(even) { background-color: #f8fafb; }";
      content += "tr:hover { background-color: #f2f4f5; }";
      content += ".summary { margin-top: 20px; padding: 15px; background-color: #acf4a4; border-radius: 8px; }";
      content += ".summary p { margin: 8px 0; font-weight: bold; }";
      content += ".footer { margin-top: 20px; font-size: 12px; color: #41493e; }";
      content += "</style></head><body>";
      content += "<h1>🌱 Reporte de Historial de Residuos - EcoRetiro</h1>";
      content += `<p><strong>Fecha del Reporte:</strong> ${new Date().toLocaleDateString("es-CL", { timeZone: CHILE_TIMEZONE })}</p>`;
      content += "<table>";
      content += "<tr><th>Tipo de Residuo</th><th>Peso (kg)</th><th>Fecha y Hora</th></tr>";
      
      entries.forEach((entry) => {
        const date = parseHistoryDate(entry.date);
        const displayDate = date
          ? `${date.toLocaleDateString("es-CL", { timeZone: CHILE_TIMEZONE })} ${date.toLocaleTimeString("es-CL", { timeZone: CHILE_TIMEZONE })}`
          : "Fecha no disponible";
        content += `<tr><td>${entry.type}</td><td>${entry.weight.toFixed(2)}</td><td>${displayDate}</td></tr>`;
      });
      
      content += "</table>";
      content += '<div class="summary">';
      content += `<p>Total de Entradas: ${entries.length}</p>`;
      content += `<p>Peso Total Registrado: ${entries.reduce((sum, e) => sum + e.weight, 0).toFixed(2)} kg</p>`;
      
      const co2Saved = (entries.reduce((sum, e) => sum + e.weight, 0) * 0.18).toFixed(2);
      content += `<p>CO₂ Ahorrado (estimado): ${co2Saved} kg</p>`;
      
      content += "</div>";
      content += '<div class="footer"><p>Generado por EcoRetiro - Impulsando la Economía Circular | www.EcoRetiro.com</p></div>';
      content += "</body></html>";
      
      printWindow.document.write(content);
      printWindow.print();
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

  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  const co2Saved = totalWeight * 0.18; // Aproximadamente 0.18kg de CO2 por kg de residuos reciclados

  return (
    <div className="w-full">
      
      {/* Encabezado y Botones */}
      <div className="flex justify-between items-start mb-xl">
        <div>
          <h2 className="font-headline-lg text-primary mb-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">history</span>
            Historial de Residuos
          </h2>
          <p className="font-body-md text-on-surface-variant">
            Revisa todos tus registros de residuos y genera reportes
          </p>
        </div>
        
        <div className="flex gap-md">
          <button
            onClick={fetchHistory}
            className="flex items-center gap-2 px-md py-3 rounded-lg border-2 border-secondary text-secondary hover:bg-secondary/5 transition-all font-bold"
            disabled={loading}
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Actualizar
          </button>
          
          <button
            onClick={handlePrint}
            disabled={entries.length === 0 || loading}
            className="flex items-center gap-2 px-md py-3 rounded-lg bg-primary text-white hover:bg-primary-container transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
            Imprimir Reporte
          </button>
        </div>
      </div>

      {/* Estados: Cargando, Error y Vacío */}
      {loading && (
        <div className="flex items-center justify-center py-xl">
          <div className="text-center">
            <span className="material-symbols-outlined text-[48px] text-secondary animate-spin block mb-md">
              cached
            </span>
            <p className="font-body-md text-on-surface-variant">Cargando historial...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-error-container text-on-error-container p-md rounded-lg border border-error flex items-center gap-2 mb-md">
          <span className="material-symbols-outlined">error</span>
          <span className="font-body-md">{error}</span>
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-xl border border-outline-variant/30 rounded-xl bg-surface-container-low">
          <span
            className="material-symbols-outlined text-[64px] text-outline-variant mb-md"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            history
          </span>
          <p className="font-body-md text-on-surface-variant text-center">
            No hay historial de residuos aún
          </p>
          <p className="font-label-sm text-on-surface-variant/70 mt-xs">
            Comienza registrando residuos para ver tu historial
          </p>
        </div>
      )}

      {/* Tabla de Historial y Métricas */}
      {!loading && entries.length > 0 && (
        <>
          <div className="overflow-x-auto mb-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-outline-variant">
                  <th className="text-left font-label-sm text-on-surface-variant px-md py-md">Tipo</th>
                  <th className="text-right font-label-sm text-on-surface-variant px-md py-md">Peso (kg)</th>
                  <th className="text-right font-label-sm text-on-surface-variant px-md py-md">Fecha y Hora</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const date = parseHistoryDate(entry.date);
                  return (
                    <tr
                      key={entry.id}
                      className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-md py-md">
                        <div className="flex items-center gap-md">
                          <span
                            className="material-symbols-outlined text-[24px] text-tertiary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {getWasteIcon(entry.type)}
                          </span>
                          <div>
                            <p className="font-body-md text-on-surface font-bold">{entry.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right px-md py-md">
                        <span className="inline-block bg-surface-container-low px-md py-xs rounded-lg">
                          <p className="font-body-md text-primary font-bold">
                            {entry.weight.toFixed(2)}
                          </p>
                        </span>
                      </td>
                      <td className="text-right px-md py-md">
                        <p className="font-body-md text-on-surface-variant text-sm">
                          {date ? formatHistoryDate(entry.date) : "Fecha no disponible"}
                        </p>
                        <p className="font-label-sm text-on-surface-variant">
                          {date ? formatHistoryTime(entry.date) : "Hora no disponible"}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            
            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-xs">Total de Registros</p>
                  <p className="font-display-lg text-primary">{entries.length}</p>
                </div>
                <span
                  className="material-symbols-outlined text-[48px] text-primary-fixed-dim opacity-50"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  list_alt
                </span>
              </div>
            </div>

            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-xs">Peso Total</p>
                  <p className="font-display-lg text-primary">{totalWeight.toFixed(2)}</p>
                  <p className="font-label-sm text-on-surface-variant">kg</p>
                </div>
                <span
                  className="material-symbols-outlined text-[48px] text-secondary-fixed-dim opacity-50"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  scale
                </span>
              </div>
            </div>

            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-xs">CO₂ Ahorrado</p>
                  <p className="font-display-lg text-tertiary-fixed-dim">{co2Saved.toFixed(2)}</p>
                  <p className="font-label-sm text-on-surface-variant">kg</p>
                </div>
                <span
                  className="material-symbols-outlined text-[48px] text-tertiary-fixed-dim opacity-50"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default History;