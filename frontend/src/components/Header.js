import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
export default function Header({ currentView, setCurrentView, userId, onLogout, }) {
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const getNavClass = (target) => {
        const isActive = target.includes(currentView);
        return `px-md font-body-md text-body-md transition-colors duration-200 ${isActive
            ? "text-secondary border-b-2 border-secondary font-bold pb-1"
            : "text-on-surface-variant hover:text-secondary-fixed-dim"}`;
    };
    return (_jsxs("header", { className: `bg-surface-container-lowest flex justify-between items-center w-full px-margin sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md h-[72px]" : "shadow-sm h-20"}`, children: [_jsxs("div", { className: "flex items-center gap-3 cursor-pointer", onClick: () => setCurrentView(userId ? "menu" : "login"), children: [_jsx("span", { className: "material-symbols-outlined text-primary text-[40px]", style: { fontVariationSettings: "'FILL' 1" }, children: "recycling" }), _jsx("span", { className: "font-headline-lg text-primary font-bold", children: "EcoRetiro" })] }), _jsxs("nav", { className: "hidden md:flex gap-base", children: [_jsx("button", { onClick: () => setCurrentView(userId ? "menu" : "login"), className: getNavClass([
                            "login",
                            "menu",
                            "add-waste",
                            "view-inventory",
                            "view-history",
                        ]), children: "Inicio" }), _jsx("button", { onClick: () => setCurrentView("about"), className: getNavClass(["about"]), children: "Sobre nosotros" }), _jsx("button", { onClick: () => setCurrentView("contact"), className: getNavClass(["contact"]), children: "Contacto" })] }), _jsxs("div", { className: "flex items-center gap-md", children: [_jsx("button", { className: "material-symbols-outlined text-on-surface-variant hover:text-secondary-fixed-dim transition-all", children: "notifications" }), _jsx("button", { className: "material-symbols-outlined text-on-surface-variant hover:text-secondary-fixed-dim transition-all", children: "help" }), userId ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant cursor-pointer", children: _jsx("img", { alt: "Perfil", className: "w-full h-full object-cover", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAP9aZ2VY3H0o-MvFoQq-6VpCPeOU_VeWwfm5VTdTlbrYaPPM5gh1SpkAws7mvV6XFvfh1K5hkelT3uPMMEaBqpmBjS8eFbNNZMHNA5BmDUBwfxAwT3pamElCrwY-iNKXav8UcouRCN692__MQ1ayvABl0CYRR3wp3oFv94HL1AlGfyqPMXkHXvc-BxJmA9BSQFjaUQGX6pU3IqbnWnt-z_9x4gwoQTtM7h8GzE0gAY27meiiUbtqxlvmusS7vxnOIdXs06S9WTEc" }) }), _jsx("button", { onClick: onLogout, className: "text-sm font-bold text-error hover:underline ml-2", children: "Salir" })] })) : (_jsx("button", { onClick: () => setCurrentView("login"), className: "text-primary font-bold hover:underline", children: "Ingresar" }))] })] }));
}
