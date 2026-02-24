import { useState } from 'react';
import './AdminSetup.css';

// PIN for admin access - TODO: Replace with real auth
const ADMIN_PIN = '9999';

export default function AdminSetup({
  config,
  onSave,
  onAddDepartment,
  onRemoveDepartment,
  onUpdateDepartment,
  onBack
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [companyName, setCompanyName] = useState(config.companyName);
  const [departments, setDepartments] = useState([...config.departments]);
  const [newDepartment, setNewDepartment] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      setDepartments([...departments, newDepartment.trim()]);
      setNewDepartment('');
    }
  };

  const handleRemoveDepartment = (index) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditValue(departments[index]);
  };

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      const newDepts = [...departments];
      newDepts[editingIndex] = editValue.trim();
      setDepartments(newDepts);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleSave = () => {
    onSave(companyName, departments);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h1 className="login-title">Admin Setup</h1>
          <p className="login-subtitle">Enter PIN to access</p>
          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              className={`pin-input ${pinError ? 'error' : ''}`}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN"
              maxLength={4}
              autoFocus
            />
            {pinError && <p className="pin-error">Invalid PIN</p>}
            <button type="submit" className="btn primary">
              Access Admin
            </button>
          </form>
          <button className="back-link" onClick={onBack}>
            ← Back to App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-setup">
      <div className="admin-header">
        <button className="back-btn" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span>Back</span>
        </button>
        <h1 className="admin-title">Company Setup</h1>
        <div style={{ width: 60 }} />
      </div>

      <div className="admin-content">
        {/* Company Name */}
        <div className="admin-section">
          <h2 className="section-title">Company Name</h2>
          <p className="section-desc">
            This name appears in the dashboard header and branding
          </p>
          <input
            type="text"
            className="text-input"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </div>

        {/* Departments */}
        <div className="admin-section">
          <h2 className="section-title">Departments / Teams</h2>
          <p className="section-desc">
            Staff will select from these during onboarding
          </p>

          <div className="departments-list">
            {departments.map((dept, index) => (
              <div key={index} className="department-item">
                {editingIndex === index ? (
                  <input
                    type="text"
                    className="edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    autoFocus
                  />
                ) : (
                  <span className="department-name">{dept}</span>
                )}
                <div className="department-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleStartEdit(index)}
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleRemoveDepartment(index)}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="add-department">
            <input
              type="text"
              className="text-input"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddDepartment()}
              placeholder="Add new department"
            />
            <button
              className="btn secondary"
              onClick={handleAddDepartment}
              disabled={!newDepartment.trim()}
            >
              Add
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="admin-section">
          <h2 className="section-title">Preview</h2>
          <p className="section-desc">
            How the department selector will appear to staff
          </p>
          <div className="preview-card">
            <label className="preview-label">Select your department</label>
            <select className="preview-select" disabled>
              <option>Choose department...</option>
              {departments.map((dept, index) => (
                <option key={index}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Save */}
        <div className="admin-actions">
          <button className="btn primary" onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
