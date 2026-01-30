import { useState } from 'react';
import './App.css';
import EmotionSelector from './components/EmotionSelector';
import IntensitySlider from './components/IntensitySlider';
import TimeKnob from './components/TimeKnob';
import AudioPlayer from './components/AudioPlayer';
import ResultsDisplay from './components/ResultsDisplay';
import Library from './components/Library';
import { getRecommendation } from './data/audioLibrary';

// App flow screens
const SCREENS = {
  WELCOME: 'welcome',
  SELECT_EMOTION: 'select_emotion',
  RATE_BEFORE: 'rate_before',
  SELECT_TIME: 'select_time',
  PLAYING: 'playing',
  RATE_AFTER: 'rate_after',
  RESULTS: 'results',
  LIBRARY: 'library'
};

function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [beforeIntensity, setBeforeIntensity] = useState(5);
  const [afterIntensity, setAfterIntensity] = useState(5);
  const [selectedTime, setSelectedTime] = useState(10);
  const [currentTrack, setCurrentTrack] = useState(null);

  const resetSession = () => {
    setSelectedEmotion(null);
    setBeforeIntensity(5);
    setAfterIntensity(5);
    setSelectedTime(10);
    setCurrentTrack(null);
    setScreen(SCREENS.WELCOME);
  };

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleEmotionContinue = () => {
    if (selectedEmotion) {
      setScreen(SCREENS.RATE_BEFORE);
    }
  };

  const handleBeforeRated = () => {
    setScreen(SCREENS.SELECT_TIME);
  };

  const handleTimeSelected = () => {
    const track = getRecommendation(selectedEmotion, selectedTime);
    setCurrentTrack(track);
    setScreen(SCREENS.PLAYING);
  };

  const handleAudioComplete = () => {
    setScreen(SCREENS.RATE_AFTER);
  };

  const handleAfterRated = () => {
    setScreen(SCREENS.RESULTS);
  };

  const handleResultsContinue = (action) => {
    if (action === 'restart') {
      resetSession();
      setScreen(SCREENS.SELECT_EMOTION);
    } else if (action === 'library') {
      setScreen(SCREENS.LIBRARY);
    }
  };

  const handleLibraryTrackSelect = (track) => {
    setCurrentTrack(track);
    // If coming from library without emotion context, set defaults
    if (!selectedEmotion && track.emotions.length > 0) {
      setSelectedEmotion(track.emotions[0]);
      setBeforeIntensity(5);
    }
    setScreen(SCREENS.PLAYING);
  };

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.WELCOME:
        return (
          <div className="screen welcome-screen">
            <div className="brand-section">
              <div className="vents">
                {[...Array(8)].map((_, i) => <span key={i} />)}
              </div>
              <h1 className="brand-name">BRAINDEFRAGGER</h1>
              <div className="brand-model">5000</div>
              <div className="vents">
                {[...Array(8)].map((_, i) => <span key={i} />)}
              </div>
            </div>

            <div className="welcome-display lcd-display">
              <p>Mental Wellness System</p>
              <p className="tagline">Regulate · Restore · Reset</p>
            </div>

            <div className="welcome-actions">
              <button
                className="btn primary"
                onClick={() => setScreen(SCREENS.SELECT_EMOTION)}
              >
                Begin Session
              </button>
              <button
                className="btn"
                onClick={() => setScreen(SCREENS.LIBRARY)}
              >
                Browse Library
              </button>
            </div>

            <div className="welcome-footer">
              <div className="led on"></div>
              <span className="status-text">System Ready</span>
            </div>
          </div>
        );

      case SCREENS.SELECT_EMOTION:
        return (
          <div className="screen">
            <div className="screen-header">
              <button className="nav-btn" onClick={resetSession}>← Back</button>
              <div className="step-indicator">
                <span className="step active">1</span>
                <span className="step">2</span>
                <span className="step">3</span>
              </div>
            </div>

            <div className="screen-content">
              <EmotionSelector
                selected={selectedEmotion}
                onSelect={handleEmotionSelect}
              />

              <div className="screen-actions">
                <button
                  className="btn primary"
                  onClick={handleEmotionContinue}
                  disabled={!selectedEmotion}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        );

      case SCREENS.RATE_BEFORE:
        return (
          <div className="screen">
            <div className="screen-header">
              <button className="nav-btn" onClick={() => setScreen(SCREENS.SELECT_EMOTION)}>← Back</button>
              <div className="step-indicator">
                <span className="step completed">1</span>
                <span className="step active">2</span>
                <span className="step">3</span>
              </div>
            </div>

            <div className="screen-content">
              <div className="intensity-context">
                <span className="context-label">Rate your</span>
                <span className="context-emotion">{selectedEmotion}</span>
              </div>

              <IntensitySlider
                value={beforeIntensity}
                onChange={setBeforeIntensity}
                label="How intense is this feeling?"
              />

              <div className="screen-actions">
                <button className="btn primary" onClick={handleBeforeRated}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        );

      case SCREENS.SELECT_TIME:
        return (
          <div className="screen">
            <div className="screen-header">
              <button className="nav-btn" onClick={() => setScreen(SCREENS.RATE_BEFORE)}>← Back</button>
              <div className="step-indicator">
                <span className="step completed">1</span>
                <span className="step completed">2</span>
                <span className="step active">3</span>
              </div>
            </div>

            <div className="screen-content">
              <TimeKnob
                value={selectedTime}
                onChange={setSelectedTime}
              />

              <div className="screen-actions">
                <button className="btn primary" onClick={handleTimeSelected}>
                  Find Session
                </button>
              </div>
            </div>
          </div>
        );

      case SCREENS.PLAYING:
        return (
          <div className="screen">
            <div className="screen-header">
              <div className="now-playing-badge">
                <div className="led on amber"></div>
                <span>Now Playing</span>
              </div>
            </div>

            <div className="screen-content">
              {currentTrack && (
                <AudioPlayer
                  track={currentTrack}
                  onComplete={handleAudioComplete}
                />
              )}
            </div>
          </div>
        );

      case SCREENS.RATE_AFTER:
        return (
          <div className="screen">
            <div className="screen-header">
              <div className="session-complete-badge">
                <div className="led on"></div>
                <span>Session Complete</span>
              </div>
            </div>

            <div className="screen-content">
              <div className="intensity-context">
                <span className="context-label">How do you feel now?</span>
                <span className="context-emotion">{selectedEmotion}</span>
              </div>

              <IntensitySlider
                value={afterIntensity}
                onChange={setAfterIntensity}
                label="Rate your current intensity"
              />

              <div className="screen-actions">
                <button className="btn primary" onClick={handleAfterRated}>
                  See Results
                </button>
              </div>
            </div>
          </div>
        );

      case SCREENS.RESULTS:
        return (
          <div className="screen">
            <ResultsDisplay
              emotion={selectedEmotion}
              beforeScore={beforeIntensity}
              afterScore={afterIntensity}
              onContinue={handleResultsContinue}
            />
          </div>
        );

      case SCREENS.LIBRARY:
        return (
          <div className="screen library-screen">
            <Library
              onSelectTrack={handleLibraryTrackSelect}
              onBack={() => setScreen(SCREENS.WELCOME)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <div className="app-container panel brushed-metal">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
