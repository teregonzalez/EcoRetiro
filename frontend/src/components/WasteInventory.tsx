import React, { useState, useEffect } from "react";
import axios from "axios";

interface InventoryItem {
  type: string;
  totalWeight: number;
  count: number;
}

export const WasteInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
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
    } catch (err: any) {
      setError("No fue posible cargar el inventario");
    } finally {
      setLoading(false);
    }
  };

  const getWasteIcon = (type: string) => {
    const iconMap: Record<string, string> = {
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

  const getWasteColor = (type: string) => {
    const colorMap: Record<string, string> = {
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

  return (
    <div className="w-full">
      <div className="flex justify-between items-start mb-xl">
        <div>
          <h2 className="font-headline-lg text-primary mb-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">
              inventory_2
            </span>
            Inventario Disponible
          </h2>
          <p className="font-body-md text-on-surface-variant">
            Visualiza todos los residuos registrados en el sistema
          </p>
        </div>
        <button
          onClick={fetchInventory}
          className="flex items-center gap-2 px-md py-3 rounded-lg border-2 border-secondary text-secondary hover:bg-secondary/5 transition-all font-bold"
          disabled={loading}
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
          Actualizar
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-xl">
          <div className="text-center">
            <span className="material-symbols-outlined text-[48px] text-secondary animate-spin block mb-md">
              cached
            </span>
            <p className="font-body-md text-on-surface-variant">
              Cargando inventario...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-error-container text-on-error-container p-md rounded-lg border border-error flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <span className="font-body-md">{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && inventory.length === 0 && (
        <div className="flex flex-col items-center justify-center py-xl border border-outline-variant/30 rounded-xl bg-surface-container-low">
          <span
            className="material-symbols-outlined text-[64px] text-outline-variant mb-md"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            inbox
          </span>
          <p className="font-body-md text-on-surface-variant text-center">
            No hay residuos registrados aún
          </p>
          <p className="font-label-sm text-on-surface-variant/70 mt-xs">
            Comienza registrando tu primer residuo
          </p>
        </div>
      )}

      {/* Inventory Table */}
      {!loading && inventory.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-outline-variant">
                <th className="text-left font-label-sm text-on-surface-variant px-md py-md">
                  Tipo de Residuo
                </th>
                <th className="text-center font-label-sm text-on-surface-variant px-md py-md">
                  Peso Total (kg)
                </th>
                <th className="text-center font-label-sm text-on-surface-variant px-md py-md">
                  Cantidad de Entradas
                </th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.type}
                  className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors"
                >
                  <td className="px-md py-md">
                    <div className="flex items-center gap-md">
                      <span
                        className={`material-symbols-outlined text-[32px] ${getWasteColor(item.type)}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {getWasteIcon(item.type)}
                      </span>
                      <div>
                        <p className="font-body-md text-on-surface font-bold">
                          {item.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center px-md py-md">
                    <div className="inline-block bg-surface-container-low px-md py-xs rounded-lg">
                      <p className="font-headline-lg text-primary">
                        {item.totalWeight.toFixed(2)}
                      </p>
                      <p className="font-label-sm text-on-surface-variant">
                        kg
                      </p>
                    </div>
                  </td>
                  <td className="text-center px-md py-md">
                    <div className="inline-block bg-surface-container-low px-md py-xs rounded-lg">
                      <p className="font-headline-lg text-secondary">
                        {item.count}
                      </p>
                      <p className="font-label-sm text-on-surface-variant">
                        registros
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Stats */}
          <div className="mt-xl pt-xl border-t-2 border-outline-variant flex flex-wrap gap-md">
            <div className="flex-1 min-w-[200px] bg-surface-container-low p-md rounded-lg">
              <p className="font-label-sm text-on-surface-variant mb-xs">
                Total de Entradas
              </p>
              <p className="font-display-lg text-primary">
                {inventory.reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
            <div className="flex-1 min-w-[200px] bg-surface-container-low p-md rounded-lg">
              <p className="font-label-sm text-on-surface-variant mb-xs">
                Peso Total Registrado
              </p>
              <p className="font-display-lg text-primary">
                {inventory
                  .reduce((sum, item) => sum + item.totalWeight, 0)
                  .toFixed(2)}{" "}
                kg
              </p>
            </div>
            <div className="flex-1 min-w-[200px] bg-surface-container-low p-md rounded-lg">
              <p className="font-label-sm text-on-surface-variant mb-xs">
                Tipos de Residuos
              </p>
              <p className="font-display-lg text-secondary">
                {inventory.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteInventory;
