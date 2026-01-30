import { useState, useRef, useEffect } from 'react';
import './TimeKnob.css';

// Time options in minutes
const timeOptions = [3, 5, 7, 10, 12, 15, 20, 25, 30];

export default function TimeKnob({ value, onChange }) {
  const knobRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const currentIndex = timeOptions.indexOf(value) !== -1 ? timeOptions.indexOf(value) : 0;

  // Map index to rotation angle (-135 to 135 degrees)
  const rotationRange = 270;
  const rotation = -135 + (currentIndex / (timeOptions.length - 1)) * rotationRange;

  const getAngleFromEvent = (clientX, clientY) => {
    if (!knobRef.current) return 0;
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    setStartAngle(getAngleFromEvent(clientX, clientY));
    setStartIndex(currentIndex);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;

    const currentAngle = getAngleFromEvent(clientX, clientY);
    let angleDiff = currentAngle - startAngle;

    // Normalize angle difference
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;

    // Convert angle to index change (sensitivity adjustment)
    const sensitivity = 15; // degrees per step
    const indexChange = Math.round(angleDiff / sensitivity);

    let newIndex = startIndex + indexChange;
    newIndex = Math.max(0, Math.min(timeOptions.length - 1, newIndex));

    if (timeOptions[newIndex] !== value) {
      onChange(timeOptions[newIndex]);
    }
  };

  const handleMouseDown = (e) => handleStart(e.clientX, e.clientY);
  const handleTouchStart = (e) => handleStart(e.touches[0].clientX, e.touches[0].clientY);

  useEffect(() => {
    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
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
  }, [isDragging, startAngle, startIndex, value]);

  return (
    <div className="time-knob-container">
      <div className="section-label">How much time do you have?</div>

      <div className="knob-wrapper">
        {/* Tick marks around the knob */}
        <div className="knob-ticks">
          {timeOptions.map((time, i) => {
            const angle = -135 + (i / (timeOptions.length - 1)) * 270;
            const isActive = i <= currentIndex;
            return (
              <div
                key={time}
                className={`knob-tick ${isActive ? 'active' : ''}`}
                style={{
                  transform: `rotate(${angle}deg) translateY(-70px)`
                }}
              >
                <span
                  className="tick-label"
                  style={{ transform: `rotate(${-angle}deg)` }}
                >
                  {time}
                </span>
              </div>
            );
          })}
        </div>

        {/* The knob itself */}
        <div
          ref={knobRef}
          className={`knob ${isDragging ? 'active' : ''}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Metallic surface details */}
          <div className="knob-surface">
            <div className="knob-ring outer" />
            <div className="knob-ring inner" />
            <div className="knob-indicator" />
            <div className="knob-grip">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="grip-notch"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Time Display */}
      <div className="time-display">
        <span className="display-value">{value}</span>
        <span className="display-label">minutes</span>
      </div>
    </div>
  );
}
