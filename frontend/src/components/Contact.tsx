export default function Contact() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-xl px-margin bg-surface-container-low">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm mb-md uppercase tracking-widest">Contáctanos</span>
          <h1 className="font-display-lg text-display-lg text-primary mb-md">¿Tienes Preguntas?</h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-lg max-w-2xl mx-auto">
            Nuestro equipo está listo para ayudarte a integrar tu negocio en la economía circular.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-xl px-margin bg-surface">
        <div className="max-w-3xl mx-auto">
          <form className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30 space-y-md w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Nombre Completo</label>
                <div className="relative group transition-transform focus-within:-translate-y-[2px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors duration-200">
                    person
                  </span>
                  <input 
                    className="input-field pl-10" 
                    type="text" 
                    placeholder="Tu nombre" 
                    required
                  />
                </div>
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Empresa</label>
                <div className="relative group transition-transform focus-within:-translate-y-[2px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors duration-200">
                    business
                  </span>
                  <input 
                    className="input-field pl-10" 
                    type="text" 
                    placeholder="Nombre de tu empresa" 
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Correo Electrónico</label>
              <div className="relative group transition-transform focus-within:-translate-y-[2px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors duration-200">
                  mail
                </span>
                <input 
                  className="input-field pl-10" 
                  type="email" 
                  placeholder="tu@empresa.com" 
                  required
                />
              </div>
            </div>

            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Asunto</label>
              <div className="relative group transition-transform focus-within:-translate-y-[2px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors duration-200">
                  subject
                </span>
                <input 
                  className="input-field pl-10" 
                  type="text" 
                  placeholder="¿Cuál es tu consulta?" 
                  required
                />
              </div>
            </div>
            
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Mensaje</label>
              <textarea 
                className="input-field" 
                placeholder="Cuéntanos más sobre tu consulta..." 
                rows={6}
                required
              />
            </div>
            
            <button 
              className="btn-primary w-full flex items-center justify-center gap-2" 
              type="submit"
            >
              Enviar Mensaje
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </form>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-xl px-margin bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-xl">Otras Formas de Contactarnos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {/* Email */}
            <div className="bg-surface-container-lowest p-xl rounded-xl text-center border border-outline-variant/30 hover:shadow-md transition-all">
              <span className="material-symbols-outlined text-[48px] text-secondary mb-md block" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              <h3 className="font-headline-lg text-primary mb-xs">Correo Electrónico</h3>
              <p className="font-body-md text-on-surface-variant mb-md">contacto@ecocircular.com</p>
              <a href="mailto:contacto@ecocircular.com" className="text-secondary font-bold hover:underline">Enviar Email</a>
            </div>

            {/* Phone */}
            <div className="bg-surface-container-lowest p-xl rounded-xl text-center border border-outline-variant/30 hover:shadow-md transition-all">
              <span className="material-symbols-outlined text-[48px] text-tertiary mb-md block" style={{ fontVariationSettings: "'FILL' 1" }}>phone</span>
              <h3 className="font-headline-lg text-primary mb-xs">Teléfono</h3>
              <p className="font-body-md text-on-surface-variant mb-md">+34 91 234 5678</p>
              <a href="tel:+34912345678" className="text-secondary font-bold hover:underline">Llamar Ahora</a>
            </div>

            {/* Location */}
            <div className="bg-surface-container-lowest p-xl rounded-xl text-center border border-outline-variant/30 hover:shadow-md transition-all">
              <span className="material-symbols-outlined text-[48px] text-primary-fixed-dim mb-md block" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              <h3 className="font-headline-lg text-primary mb-xs">Ubicación</h3>
              <p className="font-body-md text-on-surface-variant mb-md">Madrid, España</p>
              <a href="#" className="text-secondary font-bold hover:underline">Ver Ubicación</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}