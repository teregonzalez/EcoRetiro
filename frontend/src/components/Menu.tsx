import React from 'react';

type MenuItem = 'add-waste' | 'view-inventory' | 'view-history';

interface MenuProps {
  onSelectMenu: (item: MenuItem) => void;
  onLogout: () => void;
  username: string;
}

export const Menu: React.FC<MenuProps> = ({
  onSelectMenu,
  onLogout,
  username,
}) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-xl pb-md border-b border-outline-variant">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display-lg text-primary mb-xs">Panel de Control</h1>
            <p className="font-body-md text-on-surface-variant">Bienvenido, <strong>{username}</strong></p>
          </div>
          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 px-md py-3 rounded-lg border-2 border-error text-error hover:bg-error/5 transition-all font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        {/* Add Waste Card */}
        <button
          onClick={() => onSelectMenu('add-waste')}
          className="group relative p-xl rounded-xl border border-outline-variant/50 hover:border-secondary hover:shadow-lg transition-all bg-surface-container-lowest overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 text-center">
            <span className="material-symbols-outlined text-[64px] text-primary-fixed-dim block mb-md group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
              add_circle
            </span>
            <h3 className="font-headline-lg text-primary mb-xs">Registrar Residuos</h3>
            <p className="font-body-md text-on-surface-variant text-sm mb-md">
              Agrega nuevas entradas de residuos a tu inventario
            </p>
            <span className="inline-flex items-center gap-1 text-secondary font-bold">
              Ir ahora <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </span>
          </div>
        </button>

        {/* View Inventory Card */}
        <button
          onClick={() => onSelectMenu('view-inventory')}
          className="group relative p-xl rounded-xl border border-outline-variant/50 hover:border-secondary hover:shadow-lg transition-all bg-surface-container-lowest overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-tertiary-fixed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 text-center">
            <span className="material-symbols-outlined text-[64px] text-tertiary-fixed-dim block mb-md group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
              inventory_2
            </span>
            <h3 className="font-headline-lg text-primary mb-xs">Ver Inventario</h3>
            <p className="font-body-md text-on-surface-variant text-sm mb-md">
              Explora el inventario disponible de residuos
            </p>
            <span className="inline-flex items-center gap-1 text-secondary font-bold">
              Ir ahora <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </span>
          </div>
        </button>

        {/* View History Card */}
        <button
          onClick={() => onSelectMenu('view-history')}
          className="group relative p-xl rounded-xl border border-outline-variant/50 hover:border-secondary hover:shadow-lg transition-all bg-surface-container-lowest overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-fixed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 text-center">
            <span className="material-symbols-outlined text-[64px] text-secondary-fixed-dim block mb-md group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
              history
            </span>
            <h3 className="font-headline-lg text-primary mb-xs">Historial</h3>
            <p className="font-body-md text-on-surface-variant text-sm mb-md">
              Revisa el historial de tus registros y transacciones
            </p>
            <span className="inline-flex items-center gap-1 text-secondary font-bold">
              Ir ahora <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </span>
          </div>
        </button>
      </div>

      {/* Stats Section */}
      <div className="mt-xl pt-xl border-t border-outline-variant">
        <h3 className="font-headline-lg text-primary mb-md">Estadísticas Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[32px] block mb-xs" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            <p className="font-label-sm text-on-surface-variant">Residuos Registrados</p>
            <p className="font-headline-lg text-primary">--</p>
          </div>
          <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant/30">
            <span className="material-symbols-outlined text-tertiary text-[32px] block mb-xs" style={{ fontVariationSettings: "'FILL' 1" }}>scale</span>
            <p className="font-label-sm text-on-surface-variant">Total (kg)</p>
            <p className="font-headline-lg text-primary">--</p>
          </div>
          <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant/30">
            <span className="material-symbols-outlined text-secondary text-[32px] block mb-xs" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
            <p className="font-label-sm text-on-surface-variant">Este Mes</p>
            <p className="font-headline-lg text-primary">--</p>
          </div>
          <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[32px] block mb-xs" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            <p className="font-label-sm text-on-surface-variant">CO₂ Ahorrado</p>
            <p className="font-headline-lg text-primary">--</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
