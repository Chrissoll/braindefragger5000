import { useState } from 'react';
import './App.css';
import EmotionSelector from './components/EmotionSelector';
import IntensitySlider from './components/IntensitySlider';
import TimeKnob from './components/TimeKnob';
import AudioPlayer from './components/AudioPlayer';
import ResultsDisplay from './components/ResultsDisplay';
import Library from './components/Library';
import Stats from './components/Stats';
import Onboarding from './components/Onboarding';
import Menu, { MenuButton } from './components/Menu';
import Settings from './components/Settings';
import SuggestionBox from './components/SuggestionBox';
import Dashboard from './components/Dashboard';
import AdminSetup from './components/AdminSetup';
import useStats from './hooks/useStats';
import useUser from './hooks/useUser';
import useCompanyConfig from './hooks/useCompanyConfig';
import useSuggestions from './hooks/useSuggestions';
import useSettings from './hooks/useSettings';
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
  STATS: 'stats',
  SETTINGS: 'settings',
  SUGGESTIONS: 'suggestions',
  DASHBOARD: 'dashboard',
  ADMIN: 'admin',
};

function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [beforeIntensity, setBeforeIntensity] = useState(5);
  const [afterIntensity, setAfterIntensity] = useState(5);
  const [selectedTime, setSelectedTime] = useState(10);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hooks
  const { stats, recordSession, hasPracticedToday } = useStats();
  const { user, isOnboarded, completeOnboarding, resetUser } = useUser();
  const { config, saveConfig, addDepartment, removeDepartment, updateDepartment } = useCompanyConfig();
  const {
    suggestions,
    addSuggestion,
    getUserSuggestions,
    getAllSuggestions,
    markAsReviewed,
    isReviewed,
    getUnreviewedCount
  } = useSuggestions();
  const { theme, toggleTheme, markTrackCompleted, settings, resetSettings } = useSettings();

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
    if (currentTrack) {
      recordSession({
        emotion: selectedEmotion,
        beforeScore: beforeIntensity,
        afterScore: afterIntensity,
        duration: currentTrack.duration,
        trackTitle: currentTrack.title,
        trackId: currentTrack.id,
        department: user.department,
        username: user.username,
      });
      markTrackCompleted(currentTrack.id);
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

  const handleMenuNavigate = (id) => {
    switch (id) {
      case 'home':
        setScreen(SCREENS.WELCOME);
        break;
      case 'stats':
        setScreen(SCREENS.STATS);
        break;
      case 'library':
        setScreen(SCREENS.LIBRARY);
        break;
      case 'suggestions':
        setScreen(SCREENS.SUGGESTIONS);
        break;
      case 'settings':
        setScreen(SCREENS.SETTINGS);
        break;
      default:
        break;
    }
  };

  const handleResetAccount = () => {
    resetUser();
    resetSettings();
    // Will trigger onboarding again
  };

  const handleSuggestionSubmit = (message) => {
    addSuggestion(message, user.department);
  };

  // Show onboarding if not completed
  if (!isOnboarded) {
    return (
      <Onboarding
        departments={config.departments}
        onComplete={completeOnboarding}
      />
    );
  }

  // Dashboard and Admin are separate routes
  if (screen === SCREENS.DASHBOARD) {
    return (
      <Dashboard
        sessions={stats.sessions}
        suggestions={getAllSuggestions()}
        config={config}
        onMarkReviewed={markAsReviewed}
        isReviewed={isReviewed}
        onBack={() => setScreen(SCREENS.WELCOME)}
      />
    );
  }

  if (screen === SCREENS.ADMIN) {
    return (
      <AdminSetup
        config={config}
        onSave={saveConfig}
        onAddDepartment={addDepartment}
        onRemoveDepartment={removeDepartment}
        onUpdateDepartment={updateDepartment}
        onBack={() => setScreen(SCREENS.WELCOME)}
      />
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.WELCOME:
        return (
          <div className="screen welcome-screen">
            <div className="app-header">
              <div style={{ width: 40 }} />
              <div className="header-center" />
              <MenuButton onClick={() => setMenuOpen(true)} />
            </div>

            <div className="brand-section">
              <p className="brand-name">Mindspo</p>
              <h1 className="brand-model">Wellness</h1>
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
              completedTracks={settings.completedTracks}
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

      case SCREENS.SETTINGS:
        return (
          <div className="screen settings-screen">
            <Settings
              user={user}
              theme={theme}
              onToggleTheme={toggleTheme}
              onResetAccount={handleResetAccount}
              onBack={() => setScreen(SCREENS.WELCOME)}
            />
          </div>
        );

      case SCREENS.SUGGESTIONS:
        return (
          <div className="screen suggestions-screen">
            <SuggestionBox
              onSubmit={handleSuggestionSubmit}
              recentSuggestions={getUserSuggestions(5)}
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
      <div className="app-container">
        {renderScreen()}
      </div>

      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleMenuNavigate}
        currentScreen={screen}
        unreviewedSuggestions={getUnreviewedCount()}
      />

      {/* Hidden admin/dashboard links - accessed via URL params or special gesture */}
      {window.location.search.includes('admin') && screen === SCREENS.WELCOME && (
        <button
          className="admin-link"
          onClick={() => setScreen(SCREENS.ADMIN)}
        >
          Admin Setup
        </button>
      )}
      {window.location.search.includes('dashboard') && screen === SCREENS.WELCOME && (
        <button
          className="dashboard-link"
          onClick={() => setScreen(SCREENS.DASHBOARD)}
        >
          Dashboard
        </button>
      )}
    </div>
  );
}

export default App;
