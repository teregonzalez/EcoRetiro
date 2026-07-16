import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import About from "./components/About";
import Contact from "./components/Contact";
import Menu from "./components/Menu";
import WasteForm from "./components/WasteForm";
import WasteInventory from "./components/WasteInventory";
import History from "./components/History";

export type MenuItem = "add-waste" | "view-inventory" | "view-history";

export type CurrentView =
  | "login"
  | "menu"
  | "add-waste"
  | "view-inventory"
  | "view-history"
  | "about"
  | "contact";

// Separamos el contenido en un sub-componente para poder usar los hooks de react-router-dom (useNavigate, useLocation)
function AppContent() {
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = (id: number, user: string) => {
    setUserId(id);
    setUsername(user);
    navigate("/dashboard"); // Redirige al panel protegido tras el login
  };

  const handleLogout = () => {
    setUserId(null);
    setUsername("");
    navigate("/"); // Devuelve al usuario a la página de inicio
  };

  const handleWasteAdded = () => {
    setRefreshKey((prev) => prev + 1);
    navigate("/dashboard"); // Vuelve a la raíz del dashboard tras agregar
  };

  // ------------------------------------------------------------------
  // ADAPTADORES DE COMPATIBILIDAD
  // Estos métodos aseguran que tus componentes <Header> y <Menu> 
  // sigan funcionando sin tener que reescribirlos inmediatamente.
  // ------------------------------------------------------------------
  
  // Extraemos la vista actual desde la URL para el Header
  const currentPath = location.pathname === "/" ? "login" : location.pathname.split("/")[1];
  
  const handleSetCurrentView = (view: CurrentView) => {
    if (view === "login") navigate("/");
    else if (view === "menu") navigate("/dashboard");
    else navigate(`/${view}`);
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen flex flex-col m-0 p-0">
      <Header 
        currentView={currentPath as CurrentView} 
        setCurrentView={handleSetCurrentView} 
        userId={userId} 
        onLogout={handleLogout} 
      />

      <main className="w-full flex-grow flex flex-col">
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route 
            path="/" 
            element={!userId ? <LandingPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" replace />} 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* --- RUTAS PROTEGIDAS (DASHBOARD) --- */}
          <Route 
            path="/dashboard/*" 
            element={
              userId ? (
                <div className="max-w-7xl mx-auto w-full px-margin py-xl flex-grow">
                  <Menu
                    // Convertimos la selección del menú antiguo en navegación por ruta
                    onSelectMenu={(item) => navigate(`/dashboard/${item}`)}
                    onLogout={handleLogout}
                    username={username}
                  />
                  
                  <div className="mt-md bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30">
                    <Routes>
                      {/* Vista por defecto al entrar a /dashboard */}
                      <Route path="/" element={<div className="text-center text-outline">Selecciona una opción del menú para comenzar</div>} />
                      
                      {/* Subrutas del panel */}
                      <Route path="add-waste" element={<WasteForm userId={userId} onWasteAdded={handleWasteAdded} />} />
                      <Route path="view-inventory" element={<WasteInventory key={`inv-${refreshKey}`} />} />
                      <Route path="view-history" element={<History userId={userId} key={`hist-${refreshKey}`} />} />
                      
                      {/* Redirección de seguridad si escriben mal la subruta */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </div>
              ) : (
                // Si no hay userId, bloquea el acceso y lo expulsa al login
                <Navigate to="/" replace />
              )
            } 
          />

          {/* --- RUTA CATCH-ALL (404) --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// El componente principal debe envolver todo en el Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;