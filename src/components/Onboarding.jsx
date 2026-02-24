import { useState, useEffect } from 'react';
import './Onboarding.css';
import { generateUsername } from '../hooks/useUser';

export default function Onboarding({ departments, onComplete }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    setUsername(generateUsername());
  }, []);

  const handleRegenerate = () => {
    setUsername(generateUsername());
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && selectedDepartment) {
      setStep(3);
    }
  };

  const handleFinish = () => {
    onComplete(username, selectedDepartment);
  };

  return (
    <div className="onboarding">
      <div className="onboarding-container">
        {/* Step indicator */}
        <div className="onboarding-steps">
          <div className={`onboarding-step ${step >= 1 ? 'active' : ''}`} />
          <div className={`onboarding-step ${step >= 2 ? 'active' : ''}`} />
          <div className={`onboarding-step ${step >= 3 ? 'active' : ''}`} />
        </div>

        {step === 1 && (
          <div className="onboarding-content">
            <h1 className="onboarding-title">Welcome</h1>
            <p className="onboarding-subtitle">
              A private space to check in with yourself and find calm when you need it.
            </p>
            <p className="onboarding-text">
              No account needed. Your identity stays anonymous — just a friendly username
              that's yours alone.
            </p>
            <button className="btn primary" onClick={handleContinue}>
              Get Started
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-content">
            <h1 className="onboarding-title">Your Team</h1>
            <p className="onboarding-subtitle">
              Select your department so we can show helpful insights to your company —
              without ever revealing who you are.
            </p>

            <div className="department-select">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="select-input"
              >
                <option value="">Choose department...</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <button
              className="btn primary"
              onClick={handleContinue}
              disabled={!selectedDepartment}
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-content">
            <h1 className="onboarding-title">Your Identity</h1>
            <p className="onboarding-subtitle">
              This is your anonymous username. It's how you'll be identified — no email,
              no personal info.
            </p>

            <div className="username-display">
              <span className="username-text">{username}</span>
            </div>

            <button className="btn-regenerate" onClick={handleRegenerate}>
              <span className="regenerate-icon">↻</span>
              Generate new name
            </button>

            <div className="department-badge">
              <span className="badge-label">Department</span>
              <span className="badge-value">{selectedDepartment}</span>
            </div>

            <button className="btn primary" onClick={handleFinish}>
              Start Using App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
