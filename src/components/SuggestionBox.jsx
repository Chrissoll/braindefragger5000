import { useState } from 'react';
import './SuggestionBox.css';

export default function SuggestionBox({
  onSubmit,
  recentSuggestions,
  onBack
}) {
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const MAX_CHARS = 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim().length === 0) return;

    onSubmit(message.trim());
    setMessage('');
    setShowConfirmation(true);

    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="suggestion-box">
      <div className="suggestion-header">
        <button className="back-btn" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span>Back</span>
        </button>
        <h1 className="suggestion-title">Suggestion Box</h1>
        <div style={{ width: 60 }} />
      </div>

      <div className="suggestion-content">
        <p className="suggestion-intro">
          Share a thought, idea, or piece of feedback with your company.
          This is completely anonymous.
        </p>

        <form onSubmit={handleSubmit} className="suggestion-form">
          <div className="textarea-wrapper">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
              placeholder="What's on your mind?"
              className="suggestion-textarea"
              rows={5}
            />
            <span className="char-count">
              {message.length}/{MAX_CHARS}
            </span>
          </div>

          <button
            type="submit"
            className="btn primary"
            disabled={message.trim().length === 0}
          >
            Submit Anonymously
          </button>
        </form>

        {showConfirmation && (
          <div className="confirmation-message">
            <span className="confirmation-icon">✓</span>
            <span>Received. Your company can see this — your identity cannot.</span>
          </div>
        )}

        {recentSuggestions.length > 0 && (
          <div className="recent-suggestions">
            <h2 className="recent-title">Your Recent Submissions</h2>
            <div className="suggestions-list">
              {recentSuggestions.map(suggestion => (
                <div key={suggestion.id} className="suggestion-item">
                  <span className="suggestion-date">
                    {formatDate(suggestion.timestamp)}
                  </span>
                  <span className="suggestion-text">
                    {truncateText(suggestion.message)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
