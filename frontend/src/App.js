import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

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

  // Extraemos la vista actual desde la URL para el Header
  const currentPath = location.pathname === "/" ? "login" : location.pathname.split("/")[1];
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const handleSetCurrentView = (view) => {
    if (view === "login") navigate("/");
    else if (view === "menu") navigate("/dashboard");
    else navigate(`/${view}`);
  };

  const isPymeSession = session?.role === "PYME";
  const isRecyclerSession = session?.role === "Reciclador";

  // 1. Helper para renderizar el Dashboard correcto según el rol
  const renderDashboard = () => {
    if (!session) return <Navigate to="/" replace />;

    switch (session.role) {
      case "Administrador":
        return (
          <AdminDashboard
            userId={session.userId}
            username={session.username}
            onLogout={handleLogout}
          />
        );
      case "Reciclador":
        return (
          <RecyclerDashboard
            userId={session.userId}
            username={session.username}
            onLogout={handleLogout}
            onSelectNearbyWaste={(item) =>
              navigate("/dashboard/reciclador/residuos/seleccion", { state: item })
            }
            onEditProfile={() => navigate("/dashboard/reciclador/perfil/editar")}
          />
        );
      case "PYME":
        return (
          <PymeDashboard
            userId={session.userId}
            username={session.username}
            onLogout={handleLogout}
            onCreateWaste={() => navigate("/dashboard/pyme/residuos/nuevo")}
          />
        );
      default:
        return <Navigate to="/" replace />;
    }
  };

  // 2. Componente reutilizable para proteger sub-rutas
  const ProtectedRoute = ({ isAllowed, children }) => {
    if (!session) return <Navigate to="/" replace />;
    if (!isAllowed) return <Navigate to="/dashboard" replace />;
    return children;
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen flex flex-col m-0 p-0">
      
      {!isDashboardRoute && (
        <Header
          currentView={currentPath}
          setCurrentView={handleSetCurrentView}
          userId={session?.userId ?? null}
          onLogout={handleLogout}
        />
      )}

      <main className="w-full flex-grow flex flex-col">
        <Routes>
          {/* Rutas Públicas */}
          <Route 
            path="/" 
            element={!session ? <LandingPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" replace />} 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Ruta Base del Dashboard (Distribuye según rol) */}
          <Route path="/dashboard" element={renderDashboard()} />

          {/* Sub-Rutas Protegidas: PYME */}
          <Route 
            path="/dashboard/pyme/residuos/nuevo" 
            element={
              <ProtectedRoute isAllowed={isPymeSession}>
                <PymeWasteEntryForm userId={session?.userId} username={session?.username} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/pyme/residuos/exito" 
            element={
              <ProtectedRoute isAllowed={isPymeSession}>
                <PymeWasteEntrySuccess username={session?.username} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/pyme/residuos/error" 
            element={
              <ProtectedRoute isAllowed={isPymeSession}>
                <PymeWasteEntryError username={session?.username} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Sub-Rutas Protegidas: Reciclador */}
          <Route 
            path="/dashboard/reciclador/residuos/seleccion" 
            element={
              <ProtectedRoute isAllowed={isRecyclerSession}>
                <RecyclerNearbyWasteView username={session?.username} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/reciclador/perfil/editar" 
            element={
              <ProtectedRoute isAllowed={isRecyclerSession}>
                <RecyclerEditProfileView username={session?.username} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Ruta Fallback (404) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// Componente App principal
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}