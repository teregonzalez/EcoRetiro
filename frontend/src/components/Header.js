import React, { useState, useEffect } from "react";

export default function Header({
  currentView,
  setCurrentView,
  userId,
  onLogout,
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavClass = (targets) => {
    const isActive = targets.includes(currentView);
    return `px-md font-body-md text-body-md transition-colors duration-200 ${
      isActive
        ? "text-secondary border-b-2 border-secondary font-bold pb-1"
        : "text-on-surface-variant hover:text-secondary-fixed-dim"
    }`;
  };

  return (
    <header
      className={`bg-surface-container-lowest flex justify-between items-center w-full px-margin sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md h-[72px]" : "shadow-sm h-20"
      }`}
    >
      {/* Logo y Nombre */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setCurrentView(userId ? "menu" : "login")}
      >
        <span
          className="material-symbols-outlined text-primary text-[40px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          recycling
        </span>
        <span className="font-headline-lg text-primary font-bold">
          EcoRetiro
        </span>
      </div>

      {/* Navegación Principal (Oculta en móviles) */}
      <nav className="hidden md:flex gap-base">
        <button
          onClick={() => setCurrentView(userId ? "menu" : "login")}
          className={getNavClass([
            "login",
            "menu",
            "add-waste",
            "view-inventory",
            "view-history",
          ])}
        >
          Inicio
        </button>
        <button
          onClick={() => setCurrentView("about")}
          className={getNavClass(["about"])}
        >
          Sobre nosotros
        </button>
        <button
          onClick={() => setCurrentView("contact")}
          className={getNavClass(["contact"])}
        >
          Contacto
        </button>
      </nav>

      {/* Acciones y Perfil */}
      <div className="flex items-center gap-md">
        <button className="material-symbols-outlined text-on-surface-variant hover:text-secondary-fixed-dim transition-all">
          notifications
        </button>
        <button className="material-symbols-outlined text-on-surface-variant hover:text-secondary-fixed-dim transition-all">
          help
        </button>

        {userId ? (
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant cursor-pointer">
              <img
                alt="Perfil"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAP9aZ2VY3H0o-MvFoQq-6VpCPeOU_VeWwfm5VTdTlbrYaPPM5gh1SpkAws7mvV6XFvfh1K5hkelT3uPMMEaBqpmBjS8eFbNNZMHNA5BmDUBwfxAwT3pamElCrwY-iNKXav8UcouRCN692__MQ1ayvABl0CYRR3wp3oFv94HL1AlGfyqPMXkHXvc-BxJmA9BSQFjaUQGX6pU3IqbnWnt-z_9x4gwoQTtM7h8GzE0gAY27meiiUbtqxlvmusS7vxnOIdXs06S9WTEc"
              />
            </div>
            <button
              onClick={onLogout}
              className="text-sm font-bold text-error hover:underline ml-2"
            >
              Salir
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCurrentView("login")}
            className="text-primary font-bold hover:underline"
          >
            Ingresar
          </button>
        )}
      </div>
    </header>
  );
}