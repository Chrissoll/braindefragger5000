import { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import './Dashboard.css';

// PIN for dashboard access - TODO: Replace with real auth
const DASHBOARD_PIN = '1234';

const TIME_RANGES = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  year: 'This Year',
};

const EMOTION_COLORS = {
  overwhelmed: '#d9534f',
  anxious: '#e8a849',
  wired: '#f59e0b',
  flat: '#8b5cf6',
  tired: '#5bc0de',
  foggy: '#94a3b8',
};

export default function Dashboard({ sessions, suggestions, config, onMarkReviewed, isReviewed, onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === DASHBOARD_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Filter sessions by time range and department
  const filteredSessions = useMemo(() => {
    const now = new Date();
    let cutoff = new Date();

    switch (timeRange) {
      case 'today':
        cutoff.setHours(0, 0, 0, 0);
        break;
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
    }

    return sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const inTimeRange = sessionDate >= cutoff;
      const inDepartment = departmentFilter === 'all' || s.department === departmentFilter;
      return inTimeRange && inDepartment;
    });
  }, [sessions, timeRange, departmentFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    if (filteredSessions.length === 0) {
      return {
        avgPreScore: 0,
        avgPostScore: 0,
        avgImprovement: 0,
        totalSessions: 0,
        totalMinutes: 0,
        activeUsers: 0,
      };
    }

    const totalPre = filteredSessions.reduce((sum, s) => sum + (s.beforeScore || 0), 0);
    const totalPost = filteredSessions.reduce((sum, s) => sum + (s.afterScore || 0), 0);
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const uniqueUsers = new Set(filteredSessions.map(s => s.username || 'anonymous'));

    const avgPre = totalPre / filteredSessions.length;
    const avgPost = totalPost / filteredSessions.length;
    const avgImprovement = ((avgPre - avgPost) / avgPre) * 100;

    return {
      avgPreScore: avgPre.toFixed(1),
      avgPostScore: avgPost.toFixed(1),
      avgImprovement: avgImprovement.toFixed(0),
      totalSessions: filteredSessions.length,
      totalMinutes,
      activeUsers: uniqueUsers.size,
    };
  }, [filteredSessions]);

  // Emotion distribution
  const emotionData = useMemo(() => {
    const counts = {};
    filteredSessions.forEach(s => {
      if (s.emotion) {
        counts[s.emotion] = (counts[s.emotion] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: EMOTION_COLORS[name] || '#888',
    }));
  }, [filteredSessions]);

  // Time of day heatmap data
  const heatmapData = useMemo(() => {
    const grid = Array(7).fill(null).map(() => Array(24).fill(0));
    filteredSessions.forEach(s => {
      const date = new Date(s.date);
      const day = date.getDay();
      const hour = date.getHours();
      grid[day][hour]++;
    });
    return grid;
  }, [filteredSessions]);

  // Department comparison
  const departmentData = useMemo(() => {
    const deptStats = {};
    sessions.forEach(s => {
      const dept = s.department || 'Unknown';
      if (!deptStats[dept]) {
        deptStats[dept] = { total: 0, improvement: 0, count: 0 };
      }
      deptStats[dept].total++;
      deptStats[dept].improvement += (s.beforeScore || 0) - (s.afterScore || 0);
      deptStats[dept].count++;
    });

    return Object.entries(deptStats).map(([name, data]) => ({
      name,
      avgImprovement: data.count > 0 ? ((data.improvement / data.count) * 10).toFixed(0) : 0,
      sessions: data.total,
    }));
  }, [sessions]);

  // Trend line data (average pre-score over time)
  const trendData = useMemo(() => {
    const grouped = {};
    filteredSessions.forEach(s => {
      const date = new Date(s.date).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = { total: 0, count: 0 };
      }
      grouped[date].total += s.beforeScore || 0;
      grouped[date].count++;
    });

    return Object.entries(grouped)
      .map(([date, data]) => ({
        date,
        avgScore: (data.total / data.count).toFixed(1),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14); // Last 14 data points
  }, [filteredSessions]);

  // Unreviewed suggestions count
  const unreviewedCount = suggestions.filter(s => !isReviewed(s.id)).length;

  if (!isAuthenticated) {
    return (
      <div className="dashboard-login">
        <div className="login-card">
          <h1 className="login-title">Executive Dashboard</h1>
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
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <button className="dashboard-back" onClick={onBack}>← Exit</button>
          <h1 className="company-name">{config.companyName}</h1>
        </div>
        <div className="header-right">
          <span className="current-time">
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            {' · '}
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters">
        <div className="filter-group">
          {Object.entries(TIME_RANGES).map(([key, label]) => (
            <button
              key={key}
              className={`filter-btn ${timeRange === key ? 'active' : ''}`}
              onClick={() => setTimeRange(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          className="department-select"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="all">All Departments</option>
          {config.departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards">
        <div className="overview-card">
          <span className="card-label">Avg Pre-Session</span>
          <span className="card-value">{stats.avgPreScore}</span>
          <span className="card-unit">/10</span>
        </div>
        <div className="overview-card">
          <span className="card-label">Avg Post-Session</span>
          <span className="card-value accent">{stats.avgPostScore}</span>
          <span className="card-unit">/10</span>
        </div>
        <div className="overview-card highlight">
          <span className="card-label">Avg Improvement</span>
          <span className="card-value">{stats.avgImprovement}%</span>
        </div>
        <div className="overview-card">
          <span className="card-label">Total Sessions</span>
          <span className="card-value">{stats.totalSessions}</span>
        </div>
        <div className="overview-card">
          <span className="card-label">Minutes Regulated</span>
          <span className="card-value">{stats.totalMinutes}</span>
        </div>
        <div className="overview-card">
          <span className="card-label">Active Users</span>
          <span className="card-value">{stats.activeUsers}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Emotion Distribution */}
        <div className="chart-card">
          <h3 className="chart-title">Emotion State Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={emotionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {emotionData.map((item, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-dot" style={{ background: item.color }} />
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trend Line */}
        <div className="chart-card wide">
          <h3 className="chart-title">Average Stress Intensity Over Time</h3>
          <p className="chart-subtitle">Pre-session scores (lower is better)</p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#666" fontSize={10} />
                <YAxis domain={[0, 10]} stroke="#666" fontSize={10} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }}
                  labelStyle={{ color: '#888' }}
                />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#FF6B35"
                  strokeWidth={2}
                  dot={{ fill: '#FF6B35', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Comparison */}
        <div className="chart-card">
          <h3 className="chart-title">Department Comparison</h3>
          <p className="chart-subtitle">Average improvement per session</p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#666" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#666" fontSize={10} width={80} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }}
                />
                <Bar dataKey="avgImprovement" fill="#FF6B35" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Suggestion Box Feed */}
      <div className="suggestions-section">
        <div className="suggestions-header">
          <h3 className="suggestions-title">
            Suggestion Box
            {unreviewedCount > 0 && (
              <span className="unreviewed-badge">{unreviewedCount} new</span>
            )}
          </h3>
        </div>
        <div className="suggestions-list">
          {suggestions.length === 0 ? (
            <p className="no-suggestions">No suggestions yet</p>
          ) : (
            suggestions.slice(0, 20).map(suggestion => (
              <div
                key={suggestion.id}
                className={`suggestion-item ${isReviewed(suggestion.id) ? 'reviewed' : ''}`}
              >
                <div className="suggestion-meta">
                  <span className="suggestion-dept">{suggestion.department}</span>
                  <span className="suggestion-date">
                    {new Date(suggestion.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="suggestion-message">{suggestion.message}</p>
                <button
                  className="review-btn"
                  onClick={() => onMarkReviewed(suggestion.id)}
                >
                  {isReviewed(suggestion.id) ? '✓ Reviewed' : 'Mark as Reviewed'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
