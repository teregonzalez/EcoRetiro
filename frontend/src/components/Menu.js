import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../styles/Menu.css';
export const Menu = ({ onSelectMenu, onLogout, username, }) => {
    return (_jsxs("div", { className: "menu-container", children: [_jsxs("div", { className: "menu-header", children: [_jsx("h1", { children: "\u267B\uFE0F RECYCLING SYSTEM - FILE WATCH ACTIVE! \u267B\uFE0F" }), _jsxs("div", { className: "user-info", children: [_jsxs("span", { children: ["Welcome, ", username, "!"] }), _jsx("button", { onClick: onLogout, className: "logout-btn", children: "Logout" })] })] }), _jsxs("div", { className: "menu-items", children: [_jsx("button", { className: "menu-btn", onClick: () => onSelectMenu('add-waste'), children: "\uD83D\uDCDD Add Waste Entrysss" }), _jsx("button", { className: "menu-btn", onClick: () => onSelectMenu('view-inventory'), children: "\uD83D\uDCE6 View Available Waste" }), _jsx("button", { className: "menu-btn", onClick: () => onSelectMenu('view-history'), children: "\uD83D\uDCCB View History" })] })] }));
};
export default Menu;
