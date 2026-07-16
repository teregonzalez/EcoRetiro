export default function Footer() {
    return (
      <footer className="bg-surface-container-high border-t border-outline-variant w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin py-md max-w-7xl mx-auto w-full">
          <div className="mb-md md:mb-0">
            <span className="font-body-md text-on-surface-variant font-bold">© 2026 EcoRetiro Platform.</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Impulsando la simbiosis industrial global.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-xl">
            <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all">Términos de Servicio</a>
            <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all">Privacidad</a>
            <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:underline hover:text-primary transition-all">Soporte Técnico</a>
          </div>
          <div className="flex gap-md mt-md md:mt-0">
            <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center cursor-pointer hover:bg-secondary hover:text-white transition-all">
              <span className="material-symbols-outlined text-[18px]">public</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center cursor-pointer hover:bg-secondary hover:text-white transition-all">
              <span className="material-symbols-outlined text-[18px]">share</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }