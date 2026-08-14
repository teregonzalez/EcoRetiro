import React from "react";
import LoginForm from "./LoginForm";

export default function LandingPage({ onLoginSuccess }) {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)]">
        {/* Banner Izquierdo */}
        <div className="lg:col-span-8 relative overflow-hidden flex flex-col justify-center p-xl lg:p-[100px]">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover brightness-[0.4]"
              alt="Sustainable factory"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9t4wEl4sAFMbBiOVyGFEoQhw_9HtSJkOPltxrxnFSiSEo0_56BpyQgGXAfFRKVshMo3OK0wga1XzkiQIZRLQ9PaQVcjsJKUFye-npTWNXry4IjF0p29yLclPoUxnMOUpL0jLWNNEaRNRSJE6u3n3HyBDeE_qpKMRMaLrrJTp0ZwLlwXnmuVnP7sLrMZ3fBJrhUMV5F3Lbdc7hjObbOWOsU7vXdns02zfQAEpGEyjdXoVjkbx36zmAaCv10Cj1YZKcin7FQJYl358"
            />
            <div className="absolute inset-0 hero-gradient opacity-60" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm mb-md uppercase tracking-widest">
              Simbiosis Industrial
            </span>
            <h1 className="font-display-lg text-display-lg text-white mb-md leading-tight">
              Transformando el residuo de hoy en el{" "}
              <span className="text-primary-fixed-dim">
                recurso del mañana
              </span>
              .
            </h1>
            <p className="font-body-md text-body-md text-white/90 mb-xl max-w-lg">
              EcoRetiro lidera la transición hacia una economía regenerativa,
              conectando industrias para optimizar recursos y minimizar el
              impacto ambiental a través de tecnología de precisión.
            </p>
            <div className="flex gap-md">
              <button className="bg-secondary-container text-on-secondary-container px-xl py-4 rounded-lg font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                Explorar Inventario
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Formulario de Login */}
        <div className="lg:col-span-4 bg-surface flex flex-col justify-center items-center p-xl border-l border-outline-variant/30">
          <LoginForm onLoginSuccess={onLoginSuccess} />
        </div>
      </section>

      {/* Sección Informativa: Economía Circular */}
      <section className="py-xl px-margin bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
            
            <div className="order-2 md:order-1 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-tertiary-fixed-dim/20 rounded-full blur-3xl" />
              <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  className="w-full h-[400px] object-cover"
                  alt="Recycled materials"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC96tBscuKr3-BmDy_IyD1jIIRJ9XpNt4dKAcExOi-4lQNJzDJ2JyvXH2N52M2ndPTTeXq9mGmRAb-MugLZ7PkKxeuCPJtNzlPgY77jaLJmV4rH6jRgLjv8gDvHVgurhtZ1H51vL3kWzwQ8AegOPr1UtssN-7s9w4kGF-lwHKxCpcwY0OBORIvC43ul0X8FpuI1u2BhgJMVswJY7-opRxcvONjkh3slS7wva8NxgyGLb3q2rLajRcWvcQDIQiwgAYxT8j2ZO6U320A"
                />
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-md">
              <h3 className="font-headline-lg text-headline-lg text-primary">
                Economía Circular para la Industria Moderna
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Nuestra plataforma facilita la{" "}
                <strong>simbiosis industrial</strong>, un proceso donde los
                residuos de una organización se convierten en la materia prima
                de otra.
              </p>
              
              <ul className="space-y-base">
                <li className="flex items-start gap-md">
                  <span
                    className="material-symbols-outlined text-tertiary mt-1"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <div>
                    <strong className="text-on-surface">
                      Cumplimiento Normativo:
                    </strong>
                    <p className="text-[14px] text-on-surface-variant">
                      Trazabilidad completa de residuos bajo estándares internacionales.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-md">
                  <span
                    className="material-symbols-outlined text-tertiary mt-1"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_shipping
                  </span>
                  <div>
                    <strong className="text-on-surface">
                      Logística Inteligente:
                    </strong>
                    <p className="text-[14px] text-on-surface-variant">
                      Rutas optimizadas para recolección y entrega de materiales.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}