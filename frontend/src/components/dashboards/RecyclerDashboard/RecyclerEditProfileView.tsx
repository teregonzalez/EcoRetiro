import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../DashboardShell/DashboardShell";

interface RecyclerEditProfileViewProps {
  username: string;
  onLogout: () => void;
}

const navItems = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "Residuos", icon: "recycling", active: true },
  { label: "Rutas", icon: "local_shipping" },
];

export default function RecyclerEditProfileView({
  username,
  onLogout,
}: RecyclerEditProfileViewProps) {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("Soluciones Circulares S.A.");
  const [phone, setPhone] = useState("+56 9 1234 5678");
  const [address, setAddress] = useState("Av. Industrial 1240");
  const [city, setCity] = useState("Santiago");
  const [weeklyCapacity, setWeeklyCapacity] = useState(75);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <DashboardShell
      appName="EcoCircular"
      panelTitle="Panel Reciclador"
      subtitle="Configuracion del perfil de empresa receptora"
      username={username}
      roleLabel="Empresa Recicladora"
      navItems={navItems}
      activeTopTab="Reportes"
      onLogout={onLogout}
    >
      <div className="flex flex-col gap-gutter pb-xl">
        <section className="relative overflow-hidden rounded-2xl bg-surface-container-low p-lg">
          <div className="pointer-events-none absolute -right-14 -top-14 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-md md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="mb-sm block font-label-sm uppercase tracking-widest text-primary">
                Ajustes de Cuenta
              </span>
              <h1 className="font-display-lg text-on-surface">
                Configuracion de Perfil
              </h1>
              <p className="mt-xs max-w-lg text-on-surface-variant">
                Gestiona la identidad digital de tu empresa recicladora y
                optimiza tu visibilidad operativa.
              </p>
            </div>
            <div className="flex gap-sm">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-xl px-md py-sm font-label-sm text-on-surface-variant transition-all hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-xs rounded-xl bg-primary px-lg py-sm font-label-sm text-on-primary shadow-md transition-all hover:shadow-lg"
              >
                <span className="material-symbols-outlined text-[20px]">
                  save
                </span>
                Guardar Cambios
              </button>
            </div>
          </div>
        </section>

        {saved && (
          <div className="rounded-xl border border-tertiary bg-tertiary-container p-md text-on-tertiary-container">
            Perfil actualizado correctamente.
          </div>
        )}

        <div className="grid grid-cols-12 gap-gutter">
          <aside className="col-span-12 space-y-xs lg:col-span-3">
            <a
              href="#general"
              className="flex items-center gap-sm rounded-xl bg-secondary-container p-md font-bold text-on-secondary-container"
            >
              <span className="material-symbols-outlined">person</span>
              <span className="font-label-sm">Informacion General</span>
            </a>
            <a
              href="#preferences"
              className="group flex items-center gap-sm rounded-xl p-md text-on-surface-variant transition-all hover:bg-surface-container"
            >
              <span className="material-symbols-outlined group-hover:text-primary">
                hub
              </span>
              <span className="font-label-sm">Preferencias Operativas</span>
            </a>
            <a
              href="#security"
              className="group flex items-center gap-sm rounded-xl p-md text-on-surface-variant transition-all hover:bg-surface-container"
            >
              <span className="material-symbols-outlined group-hover:text-primary">
                shield_lock
              </span>
              <span className="font-label-sm">Seguridad</span>
            </a>
            <div className="px-md pt-lg">
              <div className="h-px w-full bg-outline-variant" />
            </div>
            <a
              href="#delete"
              className="group flex items-center gap-sm rounded-xl p-md text-error transition-all hover:bg-error/10"
            >
              <span className="material-symbols-outlined">delete_forever</span>
              <span className="font-label-sm font-bold">Eliminar Cuenta</span>
            </a>
          </aside>

          <div className="col-span-12 space-y-gutter lg:col-span-9">
            <section
              id="general"
              className="rounded-xl bg-surface-container-low p-lg shadow-sm"
            >
              <div className="flex flex-col items-start gap-xl md:flex-row">
                <div className="group flex flex-col items-center gap-md">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-xl">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNYs09L-oygjkBgkSvzZpOzFkVv-sU2n8ZCfD2dRaxdBk3U21qxy-8H41gH05Tt5o7Iy-kv6LIlm9ZTTDqFcRV7lJMk1_Ek3Y0BAySYLuNvlBkZzod1iHtIH-Ra1mi_lXnkFX4TyhGuBDYtw5foM5NBoEI36Usm6vbZWkIl2cJaLjOaJvBbtZKCOilg7ig-mJBmpTFQJKM-cqQr0PD-P8BP5OVVx3og8w7rSFApZ_aDPjbRLAzFP5L"
                      alt="Perfil de empresa"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-on-surface/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="material-symbols-outlined text-on-primary">
                        photo_camera
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-xs">
                    <button
                      type="button"
                      className="font-label-sm text-primary hover:underline"
                    >
                      Cambiar Imagen
                    </button>
                    <button
                      type="button"
                      className="font-label-sm text-on-surface-variant/70 hover:text-error"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-md md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="px-xs font-label-sm text-on-surface-variant">
                      Nombre de la Empresa
                    </label>
                    <input
                      value={companyName}
                      onChange={(event) => setCompanyName(event.target.value)}
                      className="mt-xs w-full rounded-lg border-none bg-surface p-md text-on-surface outline-none ring-secondary-container transition-all focus:ring-2"
                    />
                  </div>
                  <div className="opacity-70">
                    <label className="px-xs font-label-sm text-on-surface-variant">
                      Correo Corporativo
                    </label>
                    <div className="mt-xs flex items-center gap-sm rounded-lg bg-surface-container-high p-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">
                        lock
                      </span>
                      {username.toLowerCase().replace(/\s+/g, ".")}@ecoretiro.cl
                    </div>
                  </div>
                  <div>
                    <label className="px-xs font-label-sm text-on-surface-variant">
                      Telefono de Contacto
                    </label>
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="mt-xs w-full rounded-lg border-none bg-surface p-md text-on-surface outline-none ring-secondary-container transition-all focus:ring-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="mb-xs mt-sm px-xs font-label-sm tracking-wide text-primary">
                      Ubicacion Operativa
                    </h3>
                    <div className="grid grid-cols-1 gap-md md:grid-cols-3">
                      <input
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        className="md:col-span-2 w-full rounded-lg border-none bg-surface p-md text-on-surface outline-none ring-secondary-container transition-all focus:ring-2"
                        placeholder="Direccion"
                      />
                      <input
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        className="w-full rounded-lg border-none bg-surface p-md text-on-surface outline-none ring-secondary-container transition-all focus:ring-2"
                        placeholder="Ciudad"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              id="preferences"
              className="rounded-xl border-l-4 border-primary bg-surface-container-low p-lg shadow-sm"
            >
              <div className="mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">
                  eco
                </span>
                <h2 className="font-headline-lg-mobile text-on-surface">
                  Preferencias de Economia Circular
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-xl md:grid-cols-2">
                <div className="space-y-md">
                  <label className="block font-label-sm text-on-surface-variant">
                    Areas de Interes Principal
                  </label>
                  <div className="flex flex-wrap gap-sm">
                    <button
                      type="button"
                      className="flex items-center gap-xs rounded-full border border-primary/20 bg-primary/10 px-md py-sm font-label-sm text-primary"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        check
                      </span>
                      Plasticos
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-xs rounded-full border border-primary/20 bg-primary/10 px-md py-sm font-label-sm text-primary"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        check
                      </span>
                      Papel y Carton
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-surface-container-high px-md py-sm font-label-sm text-on-surface-variant transition-colors hover:bg-primary/5"
                    >
                      Metales Ferrosos
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-surface-container-high px-md py-sm font-label-sm text-on-surface-variant transition-colors hover:bg-primary/5"
                    >
                      Vidrio Industrial
                    </button>
                  </div>
                </div>

                <div className="space-y-md">
                  <label className="block font-label-sm text-on-surface-variant">
                    Capacidad de Recepcion Semanal
                  </label>
                  <div className="pt-xs">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={weeklyCapacity}
                      onChange={(event) =>
                        setWeeklyCapacity(Number(event.target.value))
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-highest accent-primary"
                    />
                    <div className="mt-sm flex justify-between font-label-sm text-on-surface-variant">
                      <span>0 t/semana</span>
                      <span className="font-bold text-primary">
                        {weeklyCapacity} t/semana
                      </span>
                      <span>100+ t</span>
                    </div>
                  </div>
                  <p className="text-[12px] italic text-on-surface-variant">
                    Este dato ayuda a optimizar la asignacion de retiros en tu
                    zona.
                  </p>
                </div>
              </div>
            </section>

            <section
              id="security"
              className="rounded-xl bg-surface-container-low p-lg shadow-sm"
            >
              <div className="mb-lg flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-secondary">
                    security
                  </span>
                  <h2 className="font-headline-lg-mobile text-on-surface">
                    Seguridad
                  </h2>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-secondary px-md py-sm font-label-sm text-on-secondary shadow-sm transition-all hover:shadow-md"
                >
                  Cambiar Contrasena
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-surface p-md">
                <div className="flex items-center gap-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                    <span className="material-symbols-outlined">devices</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-on-surface">
                      Autenticacion de dos factores
                    </p>
                    <p className="text-[12px] text-on-surface-variant">
                      Protege tu cuenta con una capa adicional.
                    </p>
                  </div>
                </div>
                <div className="relative h-6 w-12 rounded-full bg-secondary shadow-inner">
                  <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-on-secondary" />
                </div>
              </div>
            </section>

            <section
              id="delete"
              className="rounded-xl border border-error/10 bg-error-container/10 p-lg"
            >
              <div className="flex items-start gap-md">
                <div className="rounded-lg bg-error-container p-sm text-on-error-container">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <div>
                  <h3 className="mb-xs font-headline-lg-mobile text-error">
                    Zona de Peligro
                  </h3>
                  <p className="mb-md max-w-xl text-on-surface-variant">
                    Al eliminar la cuenta se perdera el historial de
                    trazabilidad y reportes de forma permanente.
                  </p>
                  <button
                    type="button"
                    className="rounded-lg border border-error px-md py-sm font-label-sm text-error transition-all hover:bg-error hover:text-on-error"
                  >
                    Eliminar definitivamente mi cuenta
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
