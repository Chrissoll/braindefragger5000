import { useState, useMemo } from 'react';
import './Library.css';
import { audioLibrary, categories, emotions, getByCategory, getByEmotion } from '../data/audioLibrary';

/**
 * Audio files should be placed at: /audio/{track.id}.mp3
 * Example: /audio/breath-001.mp3
 * The AudioPlayer component will look for files at this path.
 */

export default function Library({ onSelectTrack, onBack, completedTracks = [] }) {
  const [viewMode, setViewMode] = useState('categories');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = useMemo(() => {
    let tracks = audioLibrary;

    // Apply category/emotion filter
    if (selectedFilter) {
      if (viewMode === 'categories') {
        tracks = getByCategory(selectedFilter);
      } else {
        tracks = getByEmotion(selectedFilter);
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tracks = tracks.filter(track =>
        track.title.toLowerCase().includes(query) ||
        track.description.toLowerCase().includes(query) ||
        categories[track.category]?.name.toLowerCase().includes(query)
      );
    }

    return tracks;
  }, [selectedFilter, viewMode, searchQuery]);

  const isCompleted = (trackId) => completedTracks.includes(trackId);

  return (
    <div className="library">
      {/* Header */}
      <div className="library-header">
        <button className="back-btn" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span>Back</span>
        </button>
        <h2 className="library-title">Library</h2>
        <div className="library-count">
          {filteredTracks.length} tracks
        </div>
      </div>

      {/* Search */}
      <div className="search-wrapper">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => setSearchQuery('')}
          >
            ×
          </button>
        )}
      </div>

      {/* View mode toggle */}
      <div className="view-toggle">
        <button
          className={`toggle-btn ${viewMode === 'categories' ? 'active' : ''}`}
          onClick={() => { setViewMode('categories'); setSelectedFilter(null); }}
        >
          Categories
        </button>
        <button
          className={`toggle-btn ${viewMode === 'emotions' ? 'active' : ''}`}
          onClick={() => { setViewMode('emotions'); setSelectedFilter(null); }}
        >
          By State
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <button
          className={`filter-chip ${!selectedFilter ? 'active' : ''}`}
          onClick={() => setSelectedFilter(null)}
        >
          All
        </button>
        {viewMode === 'categories' ? (
          Object.entries(categories).map(([id, cat]) => (
            <button
              key={id}
              className={`filter-chip ${selectedFilter === id ? 'active' : ''}`}
              onClick={() => setSelectedFilter(id)}
            >
              <span className="filter-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))
        ) : (
          Object.entries(emotions).map(([id, em]) => (
            <button
              key={id}
              className={`filter-chip ${selectedFilter === id ? 'active' : ''}`}
              onClick={() => setSelectedFilter(id)}
            >
              {em.name}
            </button>
          ))
        )}
      </div>

      {/* Track list */}
      <div className="track-list">
        {filteredTracks.length === 0 ? (
          <div className="empty-state">
            <p>No tracks found</p>
          </div>
        ) : (
          filteredTracks.map(track => {
            const category = categories[track.category];
            const completed = isCompleted(track.id);
            return (
              <button
                key={track.id}
                className={`track-card ${completed ? 'completed' : ''}`}
                onClick={() => onSelectTrack(track)}
              >
                <div className="track-icon">
                  <span>{category?.icon}</span>
                  {completed && <span className="completed-indicator">✓</span>}
                </div>
                <div className="track-info">
                  <div className="track-name">{track.title}</div>
                  <div className="track-meta">
                    <span className="track-category">{category?.name}</span>
                    <span className="track-duration">{track.duration} min</span>
                  </div>
                  <div className="track-desc">{track.description}</div>
                  <div className="track-emotions">
                    {track.emotions.map(em => (
                      <span key={em} className="emotion-tag">
                        {emotions[em]?.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="track-play">
                  <div className="play-icon-small" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
