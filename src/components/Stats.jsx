import './Stats.css';

// Milestone badges configuration
const BADGES = [
  { id: '7day', label: '7 Day Streak', icon: '🔥', condition: (stats) => stats.longestStreak >= 7 },
  { id: '30day', label: '30 Day Streak', icon: '⭐', condition: (stats) => stats.longestStreak >= 30 },
  { id: '100sessions', label: '100 Sessions', icon: '💯', condition: (stats) => stats.totalSessions >= 100 },
  { id: '500min', label: '500 Minutes', icon: '⏱', condition: (stats) => stats.totalMinutes >= 500 },
];

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

  // Calculate average improvement
  const getAverageImprovement = () => {
    if (stats.sessions.length === 0) return 0;
    const totalImprovement = stats.sessions.reduce((sum, s) => sum + (s.improvement || 0), 0);
    const avgPoints = totalImprovement / stats.sessions.length;
    // Convert to percentage (out of 10 scale)
    return Math.round(avgPoints * 10);
  };

  // Get most practiced emotion
  const getMostPracticedEmotion = () => {
    if (stats.sessions.length === 0) return null;
    const counts = {};
    stats.sessions.forEach(s => {
      if (s.emotion) {
        counts[s.emotion] = (counts[s.emotion] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
  };

  // Get weekly completion data (current week)
  const getWeeklyData = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // Get Monday
    monday.setHours(0, 0, 0, 0);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);

      const hasSession = stats.sessions.some(s => {
        const sessionDate = new Date(s.date);
        return sessionDate.toDateString() === day.toDateString();
      });

      weekDays.push({
        date: day,
        completed: hasSession,
        isToday: day.toDateString() === today.toDateString(),
        isPast: day < today,
      });
    }
    return weekDays;
  };

  // Get earned badges
  const earnedBadges = BADGES.filter(badge => badge.condition(stats));

  const recentSessions = stats.sessions.slice(0, 10);
  const avgImprovement = getAverageImprovement();
  const mostPracticedEmotion = getMostPracticedEmotion();
  const weeklyData = getWeeklyData();
  const daysCompletedThisWeek = weeklyData.filter(d => d.completed).length;

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

      {/* Secondary Stats */}
      <div className="stats-row-cards">
        <div className="stat-card-small">
          <div className="stat-small-value">
            {avgImprovement > 0 ? '+' : ''}{avgImprovement}%
          </div>
          <div className="stat-small-label">Avg Improvement</div>
        </div>
        {mostPracticedEmotion && (
          <div className="stat-card-small">
            <div className="stat-small-value capitalize">{mostPracticedEmotion}</div>
            <div className="stat-small-label">Most Practiced</div>
          </div>
        )}
      </div>

      {/* Weekly View */}
      <div className="weekly-section">
        <div className="weekly-header">
          <span className="weekly-title">This Week</span>
          <span className="weekly-count">{daysCompletedThisWeek}/7 days</span>
        </div>
        <div className="weekly-grid">
          {weeklyData.map((day, i) => (
            <div
              key={i}
              className={`weekly-day ${day.completed ? 'completed' : ''} ${day.isToday ? 'today' : ''} ${!day.isPast && !day.isToday ? 'future' : ''}`}
            >
              <span className="weekly-day-label">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
              <span className="weekly-day-indicator">
                {day.completed ? '✓' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <div className="badges-section">
          <h2 className="section-title">Milestones</h2>
          <div className="badges-grid">
            {earnedBadges.map(badge => (
              <div key={badge.id} className="badge-item">
                <span className="badge-icon">{badge.icon}</span>
                <span className="badge-label">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="recent-section">
        <h2 className="section-title">Session History</h2>
        {recentSessions.length > 0 ? (
          <div className="session-list">
            {recentSessions.map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-date">{formatDate(session.date)}</div>
                <div className="session-info">
                  <span className="session-emotion">{session.emotion}</span>
                  <span className="session-duration">{session.duration}min</span>
                </div>
                <div className="session-scores">
                  <span className="score-before">{session.beforeScore}</span>
                  <span className="score-arrow">→</span>
                  <span className="score-after">{session.afterScore}</span>
                </div>
                <div className="session-result">
                  {session.improvement > 0 ? (
                    <span className="improvement positive">
                      -{session.improvement * 10}%
                    </span>
                  ) : session.improvement < 0 ? (
                    <span className="improvement negative">
                      +{Math.abs(session.improvement) * 10}%
                    </span>
                  ) : (
                    <span className="improvement neutral">0%</span>
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
