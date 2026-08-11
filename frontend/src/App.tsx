import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import About from "./components/About";
import Contact from "./components/Contact";
import AdminDashboard from "./components/dashboards/AdminDashboard/AdminDashboard";
import PymeDashboard from "./components/dashboards/PymeDashboard/PymeDashboard";
import RecyclerDashboard from "./components/dashboards/RecyclerDashboard/RecyclerDashboard";
import PymeWasteEntryForm from "./components/dashboards/PymeDashboard/PymeWasteEntryForm";
import PymeWasteEntrySuccess from "./components/dashboards/PymeDashboard/PymeWasteEntrySuccess";
import PymeWasteEntryError from "./components/dashboards/PymeDashboard/PymeWasteEntryError";
import RecyclerNearbyWasteView from "./components/dashboards/RecyclerDashboard/RecyclerNearbyWasteView";
import RecyclerEditProfileView from "./components/dashboards/RecyclerDashboard/RecyclerEditProfileView";

export type MenuItem = "add-waste" | "view-inventory" | "view-history";

export type CurrentView =
  | "login"
  | "menu"
  | "add-waste"
  | "view-inventory"
  | "view-history"
  | "about"
  | "contact";

export type UserRole = "Administrador" | "PYME" | "Reciclador";

interface AuthSession {
  userId: number;
  username: string;
  role: UserRole;
}

// Separamos el contenido en un sub-componente para poder usar los hooks de react-router-dom (useNavigate, useLocation)
function AppContent() {
  const [session, setSession] = useState<AuthSession | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = (id: number, user: string, role: UserRole) => {
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
  
  const handleSetCurrentView = (view: CurrentView) => {
    if (view === "login") navigate("/");
    else if (view === "menu") navigate("/dashboard");
    else navigate(`/${view}`);
  };

  const isPymeSession = session?.role === "PYME";
  const isRecyclerSession = session?.role === "Reciclador";

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen flex flex-col m-0 p-0">
      {!isDashboardRoute && (
        <Header 
          currentView={currentPath as CurrentView} 
          setCurrentView={handleSetCurrentView} 
          userId={session?.userId ?? null} 
          onLogout={handleLogout} 
        />
      )}

      <main className="w-full flex-grow flex flex-col">
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route 
            path="/" 
            element={!session ? <LandingPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" replace />} 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* --- RUTA PROTEGIDA POR ROL --- */}
          <Route
            path="/dashboard"
            element={
              session ? (
                session.role === "Administrador" ? (
                  <AdminDashboard userId={session.userId} username={session.username} onLogout={handleLogout} />
                ) : session.role === "Reciclador" ? (
                  <RecyclerDashboard
                    userId={session.userId}
                    username={session.username}
                    onLogout={handleLogout}
                    onSelectNearbyWaste={(item) =>
                      navigate("/dashboard/reciclador/residuos/seleccion", { state: item })
                    }
                    onEditProfile={() => navigate("/dashboard/reciclador/perfil/editar")}
                  />
                ) : (
                  <PymeDashboard
                    userId={session.userId}
                    username={session.username}
                    onLogout={handleLogout}
                    onCreateWaste={() => navigate("/dashboard/pyme/residuos/nuevo")}
                  />
                )
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/dashboard/pyme/residuos/nuevo"
            element={
              session && isPymeSession ? (
                <PymeWasteEntryForm
                  userId={session.userId}
                  username={session.username}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to={session ? "/dashboard" : "/"} replace />
              )
            }
          />

          <Route
            path="/dashboard/pyme/residuos/exito"
            element={
              session && isPymeSession ? (
                <PymeWasteEntrySuccess username={session.username} onLogout={handleLogout} />
              ) : (
                <Navigate to={session ? "/dashboard" : "/"} replace />
              )
            }
          />

          <Route
            path="/dashboard/pyme/residuos/error"
            element={
              session && isPymeSession ? (
                <PymeWasteEntryError username={session.username} onLogout={handleLogout} />
              ) : (
                <Navigate to={session ? "/dashboard" : "/"} replace />
              )
            }
          />

          <Route
            path="/dashboard/reciclador/residuos/seleccion"
            element={
              session && isRecyclerSession ? (
                <RecyclerNearbyWasteView username={session.username} onLogout={handleLogout} />
              ) : (
                <Navigate to={session ? "/dashboard" : "/"} replace />
              )
            }
          />

          <Route
            path="/dashboard/reciclador/perfil/editar"
            element={
              session && isRecyclerSession ? (
                <RecyclerEditProfileView username={session.username} onLogout={handleLogout} />
              ) : (
                <Navigate to={session ? "/dashboard" : "/"} replace />
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