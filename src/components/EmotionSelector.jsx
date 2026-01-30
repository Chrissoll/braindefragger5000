import { useState } from 'react';
import './EmotionSelector.css';

const emotions = [
  { id: 'anxious', label: 'Anxious', icon: '~' },
  { id: 'stressed', label: 'Stressed', icon: '!' },
  { id: 'tired', label: 'Tired', icon: '○' },
  { id: 'lazy', label: 'Lazy', icon: '◇' },
  { id: 'scattered', label: 'Scattered', icon: '※' },
  { id: 'angry', label: 'Angry', icon: '▲' }
];

export default function EmotionSelector({ selected, onSelect }) {
  return (
    <div className="emotion-selector">
      <div className="section-label">How are you feeling?</div>
      <div className="emotion-grid">
        {emotions.map(emotion => (
          <button
            key={emotion.id}
            className={`emotion-btn ${selected === emotion.id ? 'active' : ''}`}
            onClick={() => onSelect(emotion.id)}
          >
            <span className="emotion-icon">{emotion.icon}</span>
            <span className="emotion-label">{emotion.label}</span>
            <div className="led-indicator">
              <span className={`led ${selected === emotion.id ? 'on amber' : ''}`}></span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
