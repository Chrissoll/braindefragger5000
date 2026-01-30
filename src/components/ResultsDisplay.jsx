import { useEffect, useState } from 'react';
import './ResultsDisplay.css';
import { emotions } from '../data/audioLibrary';

export default function ResultsDisplay({ emotion, beforeScore, afterScore, onContinue }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const reduction = beforeScore - afterScore;
  const percentageReduction = beforeScore > 0
    ? Math.round((reduction / beforeScore) * 100)
    : 0;

  const improved = reduction > 0;
  const emotionData = emotions[emotion];

  useEffect(() => {
    // Animate in content
    setTimeout(() => setShowContent(true), 300);

    // Animate percentage counter
    if (improved && percentageReduction > 0) {
      const duration = 1500;
      const steps = 60;
      const increment = percentageReduction / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= percentageReduction) {
          setAnimatedPercentage(percentageReduction);
          clearInterval(interval);
        } else {
          setAnimatedPercentage(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [percentageReduction, improved]);

  const getMessage = () => {
    if (percentageReduction >= 50) return "Excellent work!";
    if (percentageReduction >= 30) return "Great progress!";
    if (percentageReduction >= 10) return "Good session!";
    if (reduction > 0) return "Every bit helps!";
    if (reduction === 0) return "Steady state";
    return "That's okay!";
  };

  const getSubMessage = () => {
    if (percentageReduction >= 50) return "You've made a significant shift in your state.";
    if (percentageReduction >= 30) return "You're moving in the right direction.";
    if (percentageReduction >= 10) return "Small changes add up over time.";
    if (reduction > 0) return "Consistency is key to lasting change.";
    if (reduction === 0) return "Sometimes maintaining is progress.";
    return "Some sessions are for planting seeds.";
  };

  return (
    <div className={`results-display ${showContent ? 'visible' : ''}`}>
      {/* Main result panel */}
      <div className="results-panel panel">
        <div className="results-header">
          <div className="led on"></div>
          <span className="section-label">Session Complete</span>
        </div>

        {/* Emotion badge */}
        <div className="emotion-result">
          <span className="emotion-name">{emotionData?.name}</span>
        </div>

        {/* Before/After comparison */}
        <div className="score-comparison">
          <div className="score-box before">
            <span className="score-label">Before</span>
            <span className="score-value">{beforeScore}</span>
          </div>
          <div className="score-arrow">→</div>
          <div className="score-box after">
            <span className="score-label">After</span>
            <span className="score-value">{afterScore}</span>
          </div>
        </div>

        {/* Main percentage display */}
        {improved && (
          <div className="percentage-display">
            <div className="percentage-ring">
              <svg viewBox="0 0 100 100">
                <circle
                  className="ring-bg"
                  cx="50" cy="50" r="45"
                  fill="none"
                  strokeWidth="8"
                />
                <circle
                  className="ring-fill"
                  cx="50" cy="50" r="45"
                  fill="none"
                  strokeWidth="8"
                  strokeDasharray={`${(animatedPercentage / 100) * 283} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="percentage-text">
                <span className="percentage-value">{animatedPercentage}</span>
                <span className="percentage-symbol">%</span>
              </div>
            </div>
            <div className="percentage-label">reduction</div>
          </div>
        )}

        {/* Message */}
        <div className="results-message lcd-display">
          <div className="message-main">{getMessage()}</div>
          <div className="message-sub">{getSubMessage()}</div>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat">
            <span className="stat-value">{reduction > 0 ? `-${reduction}` : reduction}</span>
            <span className="stat-label">Points</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-value">{afterScore}/10</span>
            <span className="stat-label">Current</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="results-actions">
        <button className="btn primary" onClick={() => onContinue('restart')}>
          New Session
        </button>
        <button className="btn" onClick={() => onContinue('library')}>
          Browse Library
        </button>
      </div>
    </div>
  );
}
