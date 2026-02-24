import { useState } from 'react';
import './Settings.css';

export default function Settings({
  user,
  theme,
  onToggleTheme,
  onResetAccount,
  onBack
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    onResetAccount();
    setShowResetConfirm(false);
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span>Back</span>
        </button>
        <h1 className="settings-title">Settings</h1>
        <div style={{ width: 60 }} />
      </div>

      <div className="settings-content">
        {/* Theme Toggle */}
        <div className="settings-section">
          <h2 className="settings-section-title">Appearance</h2>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Dark Mode</span>
                <span className="settings-row-desc">Use dark colors throughout the app</span>
              </div>
              <button
                className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
                onClick={onToggleTheme}
                aria-label="Toggle dark mode"
              >
                <span className="toggle-knob" />
              </button>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="settings-section">
          <h2 className="settings-section-title">Your Account</h2>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Username</span>
                <span className="settings-row-value">{user.username}</span>
              </div>
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Department</span>
                <span className="settings-row-value">{user.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section">
          <h2 className="settings-section-title danger">Danger Zone</h2>
          <div className="settings-card danger">
            {!showResetConfirm ? (
              <button
                className="settings-danger-btn"
                onClick={() => setShowResetConfirm(true)}
              >
                Reset Account
              </button>
            ) : (
              <div className="reset-confirm">
                <p className="reset-warning">
                  This will delete all your progress, session history, and preferences.
                  This cannot be undone.
                </p>
                <div className="reset-actions">
                  <button
                    className="btn secondary"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn danger"
                    onClick={handleReset}
                  >
                    Yes, Reset Everything
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <p className="app-version">Mindspo v1.0.0</p>
      </div>
    </div>
  );
}
