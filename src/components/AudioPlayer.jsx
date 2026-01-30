import { useState, useEffect, useRef } from 'react';
import './AudioPlayer.css';
import { categories } from '../data/audioLibrary';

export default function AudioPlayer({ track, onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef(null);
  const totalDuration = track.duration * 60; // Convert to seconds

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          setProgress((next / totalDuration) * 100);

          if (next >= totalDuration) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            onComplete();
            return totalDuration;
          }
          return next;
        });
      }, 1000);
    }
  };

  const handleSkipToEnd = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
    setProgress(100);
    setCurrentTime(totalDuration);
    onComplete();
  };

  const category = categories[track.category];

  return (
    <div className="audio-player">
      {/* Track Info Display */}
      <div className="player-display">
        <div className="display-header">
          <span className="category-badge">
            <span className="category-icon">{category?.icon}</span>
            {category?.name}
          </span>
          <div className="status-leds">
            <span className={`indicator-dot ${isPlaying ? 'active' : ''}`}></span>
            <span className="led-label">{isPlaying ? 'PLAYING' : 'READY'}</span>
          </div>
        </div>

        <div className="track-info">
          <div className="track-title">{track.title}</div>
          <div className="track-description">{track.description}</div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="progress-head"
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="player-time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* VU Meter visualization */}
        <div className="vu-meter">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`vu-bar ${isPlaying && i < Math.floor(progress / 5) + Math.random() * 5 ? 'active' : ''} ${i > 14 ? 'red' : i > 10 ? 'yellow' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Transport Controls */}
      <div className="transport-controls">
        <button
          className={`transport-btn play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayPause}
        >
          <div className="btn-icon">
            {isPlaying ? (
              <div className="pause-icon">
                <span></span>
                <span></span>
              </div>
            ) : (
              <div className="play-icon" />
            )}
          </div>
          <span className="btn-label">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          className="transport-btn skip-btn"
          onClick={handleSkipToEnd}
        >
          <div className="btn-icon">
            <div className="skip-icon">
              <span></span>
              <span></span>
            </div>
          </div>
          <span className="btn-label">Complete</span>
        </button>
      </div>

      {/* Duration info */}
      <div className="duration-info">
        <span className="section-label">Session Duration</span>
        <span className="duration-badge">{track.duration} min</span>
      </div>
    </div>
  );
}
