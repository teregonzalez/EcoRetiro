import React from 'react';
import '../styles/Menu.css';

type MenuItem = 'add-waste' | 'view-inventory' | 'view-history';

interface MenuProps {
  onSelectMenu: (item: MenuItem) => void;
  onLogout: () => void;
  username: string;
}

export const Menu: React.FC<MenuProps> = ({
  onSelectMenu,
  onLogout,
  username,
}) => {
  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>♻️ RECYCLING SYSTEM - FILE WATCH ACTIVE! ♻️</h1>
        <div className="user-info">
          <span>Welcome, {username}!</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="menu-items">
        <button
          className="menu-btn"
          onClick={() => onSelectMenu('add-waste')}
        >
          📝 Add Waste Entrysss
        </button>
        <button className="menu-btn" onClick={() => onSelectMenu('view-inventory')}>
          📦 View Available Waste
        </button>
        <button className="menu-btn" onClick={() => onSelectMenu('view-history')}>
          📋 View History
        </button>
      </div>
    </div>
  );
};

export default Menu;
