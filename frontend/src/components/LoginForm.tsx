// src/components/LoginForm.tsx
import { FormEvent, useState } from "react";
import { useLoginForm } from "../hooks/useLoginForm";
import { UserRole } from "../App";

interface LoginFormProps {
  onLoginSuccess: (userId: number, username: string, role: UserRole) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [isPasswordRecoveryOpen, setIsPasswordRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  // Extraemos la lógica separada del hook
  const {
    username,
    setUsername,
    password,
    setPassword,
    fullName,
    setFullName,
    role,
    setRole,
    company,
    setCompany,
    companyRut,
    setCompanyRut,
    error,
    isRegistering,
    handleSubmit,
    toggleRegister,
  } = useLoginForm({ onLoginSuccess });

  const handlePasswordRecovery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRecoveryMessage(
      "Si el correo está registrado, recibirá las instrucciones para restablecer su contraseña.",
    );
  };

  return (
    <>
      <div className="w-full max-w-sm">
      <div className="mb-xl text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">
          Bienvenido
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Acceda a su panel de gestión circular
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-md">
        <div className="space-y-xs">
          <label
            className="font-label-sm text-label-sm text-on-surface-variant ml-1"
            htmlFor="username"
          >
            Usuario / Correo
          </label>
          <div className="relative group transition-transform focus-within:-translate-y-[2px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors duration-200">
              mail
            </span>
            <input
              className="input-field pl-10"
              id="username"
              placeholder="nombre@empresa.com"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-xs">
          <label
            className="font-label-sm text-label-sm text-on-surface-variant ml-1"
            htmlFor="password"
          >
            Contraseña
          </label>
          <div className="relative group transition-transform focus-within:-translate-y-[2px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors duration-200">
              lock
            </span>
            <input
              className="input-field pl-10"
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm font-medium border border-error animate-pulse">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-xs">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              className="w-4 h-4 rounded border-outline text-secondary focus:ring-secondary accent-secondary"
              type="checkbox"
            />
            <span className="text-[14px] text-on-surface-variant group-hover:text-secondary transition-colors">
              Recordarme
            </span>
          </label>
          <button
            type="button"
            onClick={() => {
              setRecoveryEmail(username);
              setRecoveryMessage("");
              setIsPasswordRecoveryOpen(true);
            }}
            className="text-[14px] text-secondary font-bold hover:underline transition-colors"
          >
            ¿Olvidó su clave?
          </button>
        </div>

        <button
          className="w-full bg-primary text-white py-4 rounded-lg font-bold shadow-md hover:bg-primary-container active:scale-[0.98] transition-all mt-md"
          type="submit"
        >
          Iniciar Sesión
        </button>
      </form>

      <div className="mt-xl pt-xl border-t border-outline-variant text-center">
        <p className="text-on-surface-variant font-body-md text-[14px] mb-md">
          ¿No tiene una cuenta corporativa?
        </p>
        <button
          type="button"
          onClick={toggleRegister}
          className="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary/5 transition-all"
        >
          Solicitar Registro
        </button>
      </div>
      </div>

      {isRegistering && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-margin backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-title"
        >
          <div className="relative w-full max-w-md rounded-xl bg-surface-container-lowest p-lg shadow-xl">
            <button
              type="button"
              onClick={toggleRegister}
              className="absolute right-md top-md flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
              aria-label="Cerrar registro"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="mb-lg pr-xl">
              <h2 id="register-title" className="font-headline-lg text-primary">
                Crear Cuenta
              </h2>
              <p className="font-body-md text-on-surface-variant">
                Solicite acceso a la plataforma EcoRetiro.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-md">
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="register-name">
                  Nombre Completo
                </label>
                <input
                  className="input-field"
                  id="register-name"
                  placeholder="Ej: Juan Pérez"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="register-email">
                  Correo Electrónico
                </label>
                <input
                  className="input-field"
                  id="register-email"
                  placeholder="nombre@empresa.com"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="register-role">
                  Rol
                </label>
                <select
                  className="input-field"
                  id="register-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Seleccionar rol...</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Generador">Generador</option>
                  <option value="Receptor">Receptor</option>
                </select>
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="register-company">
                  Empresa / Organización
                </label>
                <input
                  className="input-field"
                  id="register-company"
                  placeholder="Nombre de la empresa"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required={role !== "Administrador"}
                />
              </div>
              {role !== "Administrador" && (
                <div className="space-y-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="register-rut">
                    RUT de la empresa
                  </label>
                  <input
                    className="input-field"
                    id="register-rut"
                    placeholder="12.345.678-9"
                    type="text"
                    value={companyRut}
                    onChange={(e) => setCompanyRut(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="register-password">
                  Contraseña
                </label>
                <input
                  className="input-field"
                  id="register-password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="rounded-lg bg-error-container p-3 text-sm font-medium text-on-error-container">{error}</p>}
              <div className="flex justify-end gap-sm pt-sm">
                <button type="button" onClick={toggleRegister} className="px-md py-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container">
                  Cancelar
                </button>
                <button className="rounded-lg bg-primary px-lg py-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container" type="submit">
                  Crear Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPasswordRecoveryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-margin backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="password-recovery-title"
        >
          <form
            onSubmit={handlePasswordRecovery}
            className="w-full max-w-md overflow-hidden rounded-xl bg-surface-container-lowest shadow-xl ring-1 ring-outline/10"
          >
            <div className="flex items-center justify-between border-b border-outline/10 p-md">
              <div>
                <h2 id="password-recovery-title" className="font-headline-lg-mobile text-on-surface">
                  Recuperar contraseña
                </h2>
                <p className="mt-xs text-body-md text-on-surface-variant">
                  Solicite las instrucciones de restablecimiento.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordRecoveryOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
                aria-label="Cerrar recuperación de contraseña"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-md p-md">
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant" htmlFor="recovery-email">
                  Correo electrónico
                </label>
                <input
                  id="recovery-email"
                  className="input-field"
                  placeholder="nombre@empresa.com"
                  type="email"
                  value={recoveryEmail}
                  onChange={(event) => setRecoveryEmail(event.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-sm rounded-lg bg-surface-container-low p-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">info</span>
                <p className="font-label-sm font-normal">
                  Enviaremos un enlace seguro para crear una nueva contraseña.
                </p>
              </div>
              {recoveryMessage && (
                <p className="rounded-lg bg-tertiary-fixed/40 p-sm font-label-sm text-on-tertiary-fixed">
                  {recoveryMessage}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end gap-sm bg-surface-container-low/50 p-md">
              <button
                type="button"
                onClick={() => setIsPasswordRecoveryOpen(false)}
                className="rounded-full px-md py-sm font-label-sm text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-full bg-primary px-md py-sm font-label-sm text-on-primary shadow-sm transition-colors hover:bg-primary-container"
              >
                Enviar instrucciones
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
