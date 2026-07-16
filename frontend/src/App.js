import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import About from "./components/About";
import Contact from "./components/Contact";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import PymeDashboard from "./components/dashboards/PymeDashboard";
import RecyclerDashboard from "./components/dashboards/RecyclerDashboard";
// Separamos el contenido en un sub-componente para poder usar los hooks de react-router-dom (useNavigate, useLocation)
function AppContent() {
    const [session, setSession] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const handleLoginSuccess = (id, user, role) => {
        setSession({ userId: id, username: user, role });
        navigate("/dashboard"); // Redirige al panel protegido tras el login
    };
    const handleLogout = () => {
        setSession(null);
        navigate("/"); // Devuelve al usuario a la página de inicio
    };
    // ------------------------------------------------------------------
    // ADAPTADORES DE COMPATIBILIDAD
    // Estos métodos aseguran que tus componentes <Header> y <Menu> 
    // sigan funcionando sin tener que reescribirlos inmediatamente.
    // ------------------------------------------------------------------
    // Extraemos la vista actual desde la URL para el Header
    const currentPath = location.pathname === "/" ? "login" : location.pathname.split("/")[1];
    const isDashboardRoute = location.pathname.startsWith("/dashboard");
    const handleSetCurrentView = (view) => {
        if (view === "login")
            navigate("/");
        else if (view === "menu")
            navigate("/dashboard");
        else
            navigate(`/${view}`);
    };
    return (_jsxs("div", { className: "bg-background font-body-md text-on-background min-h-screen flex flex-col m-0 p-0", children: [!isDashboardRoute && (_jsx(Header, { currentView: currentPath, setCurrentView: handleSetCurrentView, userId: session?.userId ?? null, onLogout: handleLogout })), _jsx("main", { className: "w-full flex-grow flex flex-col", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: !session ? _jsx(LandingPage, { onLoginSuccess: handleLoginSuccess }) : _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "/dashboard", element: session ? (session.role === "Administrador" ? (_jsx(AdminDashboard, { userId: session.userId, username: session.username, onLogout: handleLogout })) : session.role === "Reciclador" ? (_jsx(RecyclerDashboard, { userId: session.userId, username: session.username, onLogout: handleLogout })) : (_jsx(PymeDashboard, { userId: session.userId, username: session.username, onLogout: handleLogout }))) : (_jsx(Navigate, { to: "/", replace: true })) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }), _jsx(Footer, {})] }));
}
// El componente principal debe envolver todo en el Router
function App() {
    return (_jsx(Router, { children: _jsx(AppContent, {}) }));
}
export default App;
