import { useState, useRef, useEffect } from 'react';
import './IntensitySlider.css';

export default function IntensitySlider({ value, onChange, label = 'Intensity' }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleInteraction = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round(percentage * 10);
    onChange(newValue);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleInteraction(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    handleInteraction(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) handleInteraction(e.clientX);
    };

    const handleTouchMove = (e) => {
      if (isDragging) handleInteraction(e.touches[0].clientX);
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="intensity-slider">
      <div className="section-label">{label}</div>

      <div className="slider-container">
        <div
          className="slider-track"
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div
            className="slider-fill"
            style={{ width: `${(value / 10) * 100}%` }}
          />
          <div
            className={`slider-thumb ${isDragging ? 'active' : ''}`}
            style={{ left: `${(value / 10) * 100}%` }}
          >
            <div className="thumb-grip">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          {/* Tick marks */}
          <div className="slider-ticks">
            {[...Array(11)].map((_, i) => (
              <div key={i} className={`tick ${i === value ? 'active' : ''}`} />
            ))}
          </div>
        </div>

        {/* Number labels */}
        <div className="slider-labels">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      {/* LCD Display */}
      <div className="intensity-display lcd-display">
        <span className="display-value">{value}</span>
        <span className="display-label">/ 10</span>
      </div>
    </div>
  );
}
