import { useState } from 'react';
import './Menu.css';

export default function Menu({
  isOpen,
  onClose,
  onNavigate,
  currentScreen,
  unreviewedSuggestions = 0
}) {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: 'Home', icon: '◉' },
    { id: 'stats', label: 'My Progress', icon: '◎' },
    { id: 'library', label: 'Audio Library', icon: '◇' },
    { id: 'suggestions', label: 'Suggestion Box', icon: '◈' },
    { id: 'settings', label: 'Settings', icon: '◆' },
  ];

  const handleItemClick = (id) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      <div className="menu-overlay" onClick={onClose} />
      <div className="menu-drawer">
        <div className="menu-header">
          <button className="menu-close" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        <nav className="menu-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`menu-item ${currentScreen === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {item.id === 'suggestions' && unreviewedSuggestions > 0 && (
                <span className="menu-badge">{unreviewedSuggestions}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="menu-footer">
          <p className="menu-version">Mindspo v1.0.0</p>
        </div>
      </div>
    </>
  );
}

// Hamburger button component
export function MenuButton({ onClick }) {
  return (
    <button className="hamburger-btn" onClick={onClick} aria-label="Open menu">
      <span className="hamburger-line" />
      <span className="hamburger-line" />
      <span className="hamburger-line" />
    </button>
  );
}
