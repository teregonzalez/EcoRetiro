// src/components/LoginForm.tsx
import React from 'react';
import { useLoginForm } from '../hooks/useLoginForm';

interface LoginFormProps {
  onLoginSuccess: (userId: number, username: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  // Extraemos la lógica separada del hook
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isRegistering,
    handleSubmit,
    toggleRegister
  } = useLoginForm({ onLoginSuccess });

  return (
    <div className="w-full max-w-sm">
      <div className="mb-xl text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">
          {isRegistering ? 'Registro' : 'Bienvenido'}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {isRegistering ? 'Cree su cuenta circular' : 'Acceda a su panel de gestión circular'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-md">
        <div className="space-y-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="username">
            Usuario / Correo
          </label>
          <div className="relative group transition-transform focus-within:-translate-y-[2px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors duration-200">
              {isRegistering ? 'person' : 'mail'}
            </span>
            <input 
              className="input-field pl-10" 
              id="username" 
              placeholder={isRegistering ? "Tu nombre" : "nombre@empresa.com"} 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="password">
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
        
        {!isRegistering && (
          <div className="flex items-center justify-between py-xs">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input className="w-4 h-4 rounded border-outline text-secondary focus:ring-secondary accent-secondary" type="checkbox" />
              <span className="text-[14px] text-on-surface-variant group-hover:text-secondary transition-colors">Recordarme</span>
            </label>
            <a className="text-[14px] text-secondary font-bold hover:underline transition-colors" href="#">¿Olvidó su clave?</a>
          </div>
        )}
        
        <button 
          className="w-full bg-primary text-white py-4 rounded-lg font-bold shadow-md hover:bg-primary-container active:scale-[0.98] transition-all mt-md" 
          type="submit"
        >
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </button>
      </form>
      
      <div className="mt-xl pt-xl border-t border-outline-variant text-center">
        <p className="text-on-surface-variant font-body-md text-[14px] mb-md">
          {isRegistering ? '¿Ya tiene una cuenta corporativa?' : '¿No tiene una cuenta corporativa?'}
        </p>
        <button 
          type="button"
          onClick={toggleRegister}
          className="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary/5 transition-all"
        >
          {isRegistering ? 'Volver al Login' : 'Solicitar Registro'}
        </button>
      </div>
    </div>
  );
}
