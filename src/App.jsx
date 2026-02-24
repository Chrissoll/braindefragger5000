import { useState } from 'react';
import './App.css';
import EmotionSelector from './components/EmotionSelector';
import IntensitySlider from './components/IntensitySlider';
import TimeKnob from './components/TimeKnob';
import AudioPlayer from './components/AudioPlayer';
import ResultsDisplay from './components/ResultsDisplay';
import Library from './components/Library';
import Stats from './components/Stats';
import useStats from './hooks/useStats';
import { getRecommendation } from './data/audioLibrary';

const SCREENS = {
  WELCOME: 'welcome',
  SELECT_EMOTION: 'select_emotion',
  RATE_BEFORE: 'rate_before',
  SELECT_TIME: 'select_time',
  PLAYING: 'playing',
  RATE_AFTER: 'rate_after',
  RESULTS: 'results',
  LIBRARY: 'library',
  STATS: 'stats'
};

function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [beforeIntensity, setBeforeIntensity] = useState(5);
  const [afterIntensity, setAfterIntensity] = useState(5);
  const [selectedTime, setSelectedTime] = useState(10);
  const [currentTrack, setCurrentTrack] = useState(null);
  const { stats, recordSession, hasPracticedToday } = useStats();

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
    // Record the completed session
    if (currentTrack) {
      recordSession({
        emotion: selectedEmotion,
        beforeScore: beforeIntensity,
        afterScore: afterIntensity,
        duration: currentTrack.duration,
        trackTitle: currentTrack.title,
      });
    }
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
              <p className="brand-name">Braindefragger</p>
              <h1 className="brand-model">5000</h1>
            </div>

            <div className="welcome-content">
              <p className="welcome-tagline">
                A gentle guide for your nervous system
              </p>

              {stats.currentStreak > 0 && (
                <div className="streak-badge" onClick={() => setScreen(SCREENS.STATS)}>
                  <span className="streak-fire">🔥</span>
                  <span className="streak-count">{stats.currentStreak} day streak</span>
                </div>
              )}

              <div className="welcome-actions">
                <button
                  className="btn primary"
                  onClick={() => setScreen(SCREENS.SELECT_EMOTION)}
                >
                  Begin Session
                </button>
                <button
                  className="btn secondary"
                  onClick={() => setScreen(SCREENS.LIBRARY)}
                >
                  Browse Library
                </button>
                <button
                  className="btn text"
                  onClick={() => setScreen(SCREENS.STATS)}
                >
                  View Progress
                </button>
              </div>
            </div>

            <div className="welcome-footer">
              <span className={`dot ${hasPracticedToday() ? 'success' : 'active'}`}></span>
              <span className="status-text">
                {hasPracticedToday() ? 'Practiced today' : 'Ready'}
              </span>
            </div>
          </div>
        );

      case SCREENS.SELECT_EMOTION:
        return (
          <div className="screen">
            <div className="screen-header">
              <button className="nav-btn" onClick={resetSession}>
                ← Back
              </button>
              <div className="step-indicator">
                <span className="step active"></span>
                <span className="step"></span>
                <span className="step"></span>
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
              <button className="nav-btn" onClick={() => setScreen(SCREENS.SELECT_EMOTION)}>
                ← Back
              </button>
              <div className="step-indicator">
                <span className="step completed"></span>
                <span className="step active"></span>
                <span className="step"></span>
              </div>
            </div>

            <div className="screen-content">
              <div className="intensity-context">
                <span className="context-label">Feeling</span>
                <span className="context-emotion">{selectedEmotion}</span>
              </div>

              <IntensitySlider
                value={beforeIntensity}
                onChange={setBeforeIntensity}
                label="How affected do you feel right now?"
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
              <button className="nav-btn" onClick={() => setScreen(SCREENS.RATE_BEFORE)}>
                ← Back
              </button>
              <div className="step-indicator">
                <span className="step completed"></span>
                <span className="step completed"></span>
                <span className="step active"></span>
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
            <div className="screen-header" style={{ justifyContent: 'center' }}>
              <div className="now-playing-badge">
                <span className="dot active"></span>
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
            <div className="screen-header" style={{ justifyContent: 'center' }}>
              <div className="session-complete-badge">
                <span className="dot success"></span>
                <span>Session Complete</span>
              </div>
            </div>

            <div className="screen-content">
              <div className="intensity-context">
                <span className="context-label">Still feeling</span>
                <span className="context-emotion">{selectedEmotion}</span>
              </div>

              <IntensitySlider
                value={afterIntensity}
                onChange={setAfterIntensity}
                label="How affected do you feel now?"
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

      case SCREENS.STATS:
        return (
          <div className="screen stats-screen">
            <Stats
              stats={stats}
              onBack={() => setScreen(SCREENS.WELCOME)}
              onStartSession={() => setScreen(SCREENS.SELECT_EMOTION)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
