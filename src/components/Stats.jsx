import './Stats.css';

export default function Stats({ stats, onBack, onStartSession }) {
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const recentSessions = stats.sessions.slice(0, 5);

  return (
    <div className="stats">
      <div className="stats-header">
        <button className="back-btn" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span>Back</span>
        </button>
        <h1 className="stats-title">Your Journey</h1>
        <div style={{ width: 60 }}></div>
      </div>

      {/* Main Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{stats.currentStreak}</div>
          <div className="stat-label">Day Streak</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱</div>
          <div className="stat-value">{formatTime(stats.totalMinutes)}</div>
          <div className="stat-label">Total Regulated</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-value">{stats.totalSessions}</div>
          <div className="stat-label">Sessions</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{stats.longestStreak}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>

      {/* Streak Progress */}
      {stats.currentStreak > 0 && (
        <div className="streak-section">
          <div className="streak-header">
            <span className="streak-fire">🔥</span>
            <span className="streak-text">
              {stats.currentStreak === 1
                ? 'You started a streak!'
                : `${stats.currentStreak} days and counting!`}
            </span>
          </div>
          <div className="streak-progress">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`streak-day ${i < stats.currentStreak ? 'completed' : ''} ${i < stats.currentStreak % 7 || (stats.currentStreak >= 7 && i < 7) ? 'active' : ''}`}
              >
                {i < Math.min(stats.currentStreak, 7) ? '✓' : ''}
              </div>
            ))}
          </div>
          <div className="streak-labels">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="recent-section">
        <h2 className="section-title">Recent Sessions</h2>
        {recentSessions.length > 0 ? (
          <div className="session-list">
            {recentSessions.map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-date">{formatDate(session.date)}</div>
                <div className="session-info">
                  <span className="session-emotion">{session.emotion}</span>
                  <span className="session-duration">{session.duration}min</span>
                </div>
                <div className="session-result">
                  {session.improvement > 0 ? (
                    <span className="improvement positive">
                      -{session.improvement}
                    </span>
                  ) : session.improvement < 0 ? (
                    <span className="improvement negative">
                      +{Math.abs(session.improvement)}
                    </span>
                  ) : (
                    <span className="improvement neutral">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-sessions">
            <p>No sessions yet</p>
            <p className="empty-subtext">Complete your first session to start tracking</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="stats-actions">
        <button className="btn primary" onClick={onStartSession}>
          Start Session
        </button>
      </div>
    </div>
  );
}
