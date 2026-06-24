import { useState } from "react";
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

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>("login");
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLoginSuccess = (id: number, user: string) => {
    setUserId(id);
    setUsername(user);
    setCurrentView("menu");
  };

  const handleLogout = () => {
    setUserId(null);
    setUsername("");
    setCurrentView("login");
  };

  const handleMenuSelect = (item: MenuItem) => {
    setCurrentView(item);
  };

  const handleWasteAdded = () => {
    setRefreshKey(refreshKey + 1);
    setCurrentView("menu");
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen flex flex-col m-0 p-0">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        userId={userId} 
        onLogout={handleLogout} 
      />

      <main className="w-full flex-grow flex flex-col">
        {/* Vistas Deslogueadas / Informativas */}
        {currentView === "login" && !userId && (
          <LandingPage onLoginSuccess={handleLoginSuccess} />
        )}
        {currentView === "about" && <About />}
        {currentView === "contact" && <Contact />}

        {/* Vistas Internas de la App */}
        {currentView !== "login" && currentView !== "about" && currentView !== "contact" && userId && (
          <div className="max-w-7xl mx-auto w-full px-margin py-xl flex-grow">
            <Menu
              onSelectMenu={handleMenuSelect}
              onLogout={handleLogout}
              username={username}
            />
            
            <div className="mt-md bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30">
              {currentView === "add-waste" && (
                <WasteForm userId={userId} onWasteAdded={handleWasteAdded} />
              )}
              {currentView === "view-inventory" && (
                <WasteInventory key={`inv-${refreshKey}`} />
              )}
              {currentView === "view-history" && (
                <History userId={userId} key={`hist-${refreshKey}`} />
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;