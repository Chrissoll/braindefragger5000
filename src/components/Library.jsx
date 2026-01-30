import { useState } from 'react';
import './Library.css';
import { audioLibrary, categories, emotions, getByCategory, getByEmotion } from '../data/audioLibrary';

export default function Library({ onSelectTrack, onBack }) {
  const [viewMode, setViewMode] = useState('categories'); // 'categories' or 'emotions'
  const [selectedFilter, setSelectedFilter] = useState(null);

  const getFilteredTracks = () => {
    if (!selectedFilter) return audioLibrary;
    if (viewMode === 'categories') return getByCategory(selectedFilter);
    return getByEmotion(selectedFilter);
  };

  const filteredTracks = getFilteredTracks();

  return (
    <div className="library">
      {/* Header */}
      <div className="library-header">
        <button className="back-btn" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span>Back</span>
        </button>
        <h2 className="library-title">Library</h2>
        <div className="track-count lcd-display">
          {filteredTracks.length} tracks
        </div>
      </div>

      {/* View mode toggle */}
      <div className="view-toggle panel">
        <button
          className={`toggle-btn ${viewMode === 'categories' ? 'active' : ''}`}
          onClick={() => { setViewMode('categories'); setSelectedFilter(null); }}
        >
          <span className="led-dot"></span>
          Categories
        </button>
        <button
          className={`toggle-btn ${viewMode === 'emotions' ? 'active' : ''}`}
          onClick={() => { setViewMode('emotions'); setSelectedFilter(null); }}
        >
          <span className="led-dot"></span>
          By Emotion
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
        {filteredTracks.map(track => {
          const category = categories[track.category];
          return (
            <button
              key={track.id}
              className="track-card panel"
              onClick={() => onSelectTrack(track)}
            >
              <div className="track-icon">
                <span>{category?.icon}</span>
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
        })}
      </div>
    </div>
  );
}
