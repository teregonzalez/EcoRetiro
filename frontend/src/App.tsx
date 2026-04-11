import { useState } from "react";
import LoginForm from "./components/LoginForm";
import Menu from "./components/Menu";
import WasteForm from "./components/WasteForm";
import WasteInventory from "./components/WasteInventory";
import History from "./components/History";
import "./App.css";
// File watch test - HMR testing

type MenuItem = "add-waste" | "view-inventory" | "view-history";

type CurrentView =
  | "login"
  | "menu"
  | "add-waste"
  | "view-inventory"
  | "view-history";

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
    if (item === "add-waste") {
      setCurrentView("add-waste");
    } else if (item === "view-inventory") {
      setCurrentView("view-inventory");
    } else if (item === "view-history") {
      setCurrentView("view-history");
    }
  };

  const handleWasteAdded = () => {
    setRefreshKey(refreshKey + 1);
    setCurrentView("menu");
  };

  return (
    <div className="app">
      {currentView === "login" && (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}

      {currentView !== "login" && userId && (
        <div className="app-content">
          <Menu
            onSelectMenu={handleMenuSelect}
            onLogout={handleLogout}
            username={username}
          />
          {currentView === "add-waste" && (
            <WasteForm userId={userId} onWasteAdded={handleWasteAdded} />
          )}

          {currentView === "view-inventory" && (
            <WasteInventory key={refreshKey} />
          )}
          {currentView === "view-history" && (
            <History userId={userId} key={refreshKey} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
