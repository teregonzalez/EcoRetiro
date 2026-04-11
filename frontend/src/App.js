import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import LoginForm from "./components/LoginForm";
import Menu from "./components/Menu";
import WasteForm from "./components/WasteForm";
import WasteInventory from "./components/WasteInventory";
import History from "./components/History";
import "./App.css";
function App() {
    const [currentView, setCurrentView] = useState("login");
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const handleLoginSuccess = (id, user) => {
        setUserId(id);
        setUsername(user);
        setCurrentView("menu");
    };
    const handleLogout = () => {
        setUserId(null);
        setUsername("");
        setCurrentView("login");
    };
    const handleMenuSelect = (item) => {
        if (item === "add-waste") {
            setCurrentView("add-waste");
        }
        else if (item === "view-inventory") {
            setCurrentView("view-inventory");
        }
        else if (item === "view-history") {
            setCurrentView("view-history");
        }
    };
    const handleWasteAdded = () => {
        setRefreshKey(refreshKey + 1);
        setCurrentView("menu");
    };
    return (_jsxs("div", { className: "app", children: [currentView === "login" && (_jsx(LoginForm, { onLoginSuccess: handleLoginSuccess })), currentView !== "login" && userId && (_jsxs("div", { className: "app-content", children: [_jsx(Menu, { onSelectMenu: handleMenuSelect, onLogout: handleLogout, username: username }), currentView === "add-waste" && (_jsx(WasteForm, { userId: userId, onWasteAdded: handleWasteAdded })), currentView === "view-inventory" && (_jsx(WasteInventory, {}, refreshKey)), currentView === "view-history" && (_jsx(History, { userId: userId }, refreshKey))] }))] }));
}
export default App;
