// Audio Library - 50+ wellness audio tracks organized by category and emotion
// Each track has metadata for duration, category, and which emotions it helps with

export const categories = {
  breathwork: {
    name: 'Breathwork',
    description: 'Guided breathing exercises',
    icon: '◉'
  },
  meditation: {
    name: 'Meditation',
    description: 'Mindfulness and visualization',
    icon: '◎'
  },
  bodywork: {
    name: 'Body Scan',
    description: 'Somatic awareness practices',
    icon: '◈'
  },
  soundscape: {
    name: 'Soundscapes',
    description: 'Ambient sounds for relaxation',
    icon: '◇'
  },
  movement: {
    name: 'Movement',
    description: 'Gentle movement guides',
    icon: '◆'
  },
  sleep: {
    name: 'Sleep',
    description: 'Wind-down and rest',
    icon: '◐'
  }
};

export const emotions = {
  anxious: { name: 'Anxious', color: '#e8a849' },
  stressed: { name: 'Stressed', color: '#d9534f' },
  tired: { name: 'Tired', color: '#5bc0de' },
  lazy: { name: 'Lazy', color: '#8b5cf6' },
  scattered: { name: 'Scattered', color: '#f59e0b' },
  angry: { name: 'Angry', color: '#ef4444' }
};

export const audioLibrary = [
  // BREATHWORK - 10 tracks
  {
    id: 'breath-001',
    title: 'Box Breathing',
    category: 'breathwork',
    duration: 5,
    emotions: ['anxious', 'stressed'],
    description: '4-4-4-4 pattern to calm the nervous system'
  },
  {
    id: 'breath-002',
    title: '4-7-8 Relaxation Breath',
    category: 'breathwork',
    duration: 7,
    emotions: ['anxious', 'stressed', 'angry'],
    description: 'Dr. Weil\'s calming breath technique'
  },
  {
    id: 'breath-003',
    title: 'Energizing Breath',
    category: 'breathwork',
    duration: 5,
    emotions: ['tired', 'lazy'],
    description: 'Kapalabhati-inspired awakening practice'
  },
  {
    id: 'breath-004',
    title: 'Coherent Breathing',
    category: 'breathwork',
    duration: 10,
    emotions: ['anxious', 'scattered'],
    description: '5 breaths per minute for heart-brain coherence'
  },
  {
    id: 'breath-005',
    title: 'Physiological Sigh',
    category: 'breathwork',
    duration: 3,
    emotions: ['stressed', 'angry'],
    description: 'Quick reset using double inhale technique'
  },
  {
    id: 'breath-006',
    title: 'Alternate Nostril',
    category: 'breathwork',
    duration: 8,
    emotions: ['scattered', 'anxious'],
    description: 'Balance left and right brain hemispheres'
  },
  {
    id: 'breath-007',
    title: 'Ocean Breath',
    category: 'breathwork',
    duration: 10,
    emotions: ['stressed', 'tired'],
    description: 'Ujjayi breath with wave visualization'
  },
  {
    id: 'breath-008',
    title: 'Power Breath',
    category: 'breathwork',
    duration: 5,
    emotions: ['lazy', 'tired'],
    description: 'Wim Hof inspired activation sequence'
  },
  {
    id: 'breath-009',
    title: 'Belly Breathing',
    category: 'breathwork',
    duration: 6,
    emotions: ['anxious', 'stressed'],
    description: 'Diaphragmatic breathing basics'
  },
  {
    id: 'breath-010',
    title: 'Extended Exhale',
    category: 'breathwork',
    duration: 8,
    emotions: ['angry', 'stressed'],
    description: 'Activate parasympathetic response'
  },

  // MEDITATION - 12 tracks
  {
    id: 'med-001',
    title: 'Grounding Presence',
    category: 'meditation',
    duration: 10,
    emotions: ['anxious', 'scattered'],
    description: 'Connect with the present moment'
  },
  {
    id: 'med-002',
    title: 'Loving Kindness',
    category: 'meditation',
    duration: 15,
    emotions: ['angry', 'stressed'],
    description: 'Metta meditation for self-compassion'
  },
  {
    id: 'med-003',
    title: 'Thought Clouds',
    category: 'meditation',
    duration: 8,
    emotions: ['anxious', 'scattered'],
    description: 'Observe thoughts without attachment'
  },
  {
    id: 'med-004',
    title: 'Energy Boost',
    category: 'meditation',
    duration: 7,
    emotions: ['tired', 'lazy'],
    description: 'Visualization for renewed vitality'
  },
  {
    id: 'med-005',
    title: 'Safe Place',
    category: 'meditation',
    duration: 12,
    emotions: ['anxious', 'stressed'],
    description: 'Create your internal sanctuary'
  },
  {
    id: 'med-006',
    title: 'Focus Flame',
    category: 'meditation',
    duration: 10,
    emotions: ['scattered', 'lazy'],
    description: 'Candle visualization for concentration'
  },
  {
    id: 'med-007',
    title: 'Release & Let Go',
    category: 'meditation',
    duration: 15,
    emotions: ['angry', 'stressed'],
    description: 'Surrender what no longer serves'
  },
  {
    id: 'med-008',
    title: 'Morning Intention',
    category: 'meditation',
    duration: 8,
    emotions: ['tired', 'lazy', 'scattered'],
    description: 'Set your day\'s direction'
  },
  {
    id: 'med-009',
    title: 'Anxiety Dissolve',
    category: 'meditation',
    duration: 12,
    emotions: ['anxious'],
    description: 'Specific techniques for worry'
  },
  {
    id: 'med-010',
    title: 'Inner Smile',
    category: 'meditation',
    duration: 6,
    emotions: ['stressed', 'angry'],
    description: 'Taoist practice for inner peace'
  },
  {
    id: 'med-011',
    title: 'Noting Practice',
    category: 'meditation',
    duration: 10,
    emotions: ['scattered', 'anxious'],
    description: 'Label experiences as they arise'
  },
  {
    id: 'med-012',
    title: 'Open Awareness',
    category: 'meditation',
    duration: 20,
    emotions: ['stressed', 'scattered'],
    description: 'Spacious choiceless awareness'
  },

  // BODY SCAN - 8 tracks
  {
    id: 'body-001',
    title: 'Full Body Scan',
    category: 'bodywork',
    duration: 15,
    emotions: ['anxious', 'stressed', 'angry'],
    description: 'Complete head-to-toe awareness'
  },
  {
    id: 'body-002',
    title: 'Quick Body Check',
    category: 'bodywork',
    duration: 5,
    emotions: ['scattered', 'stressed'],
    description: 'Rapid somatic awareness'
  },
  {
    id: 'body-003',
    title: 'Tension Release',
    category: 'bodywork',
    duration: 12,
    emotions: ['stressed', 'angry'],
    description: 'Progressive muscle relaxation'
  },
  {
    id: 'body-004',
    title: 'Wake Up Body',
    category: 'bodywork',
    duration: 8,
    emotions: ['tired', 'lazy'],
    description: 'Energizing body awareness'
  },
  {
    id: 'body-005',
    title: 'Feet to Earth',
    category: 'bodywork',
    duration: 6,
    emotions: ['anxious', 'scattered'],
    description: 'Grounding through the feet'
  },
  {
    id: 'body-006',
    title: 'Heart Space',
    category: 'bodywork',
    duration: 10,
    emotions: ['angry', 'stressed'],
    description: 'Open the chest and heart area'
  },
  {
    id: 'body-007',
    title: 'Jaw & Face Release',
    category: 'bodywork',
    duration: 7,
    emotions: ['stressed', 'angry'],
    description: 'Release facial tension'
  },
  {
    id: 'body-008',
    title: 'Belly Awareness',
    category: 'bodywork',
    duration: 8,
    emotions: ['anxious', 'stressed'],
    description: 'Connect with gut feelings'
  },

  // SOUNDSCAPES - 10 tracks
  {
    id: 'sound-001',
    title: 'Forest Rain',
    category: 'soundscape',
    duration: 15,
    emotions: ['anxious', 'stressed'],
    description: 'Gentle rain in the forest'
  },
  {
    id: 'sound-002',
    title: 'Ocean Waves',
    category: 'soundscape',
    duration: 20,
    emotions: ['stressed', 'angry'],
    description: 'Rolling waves on the shore'
  },
  {
    id: 'sound-003',
    title: 'Morning Birds',
    category: 'soundscape',
    duration: 10,
    emotions: ['tired', 'lazy'],
    description: 'Dawn chorus awakening'
  },
  {
    id: 'sound-004',
    title: 'Tibetan Bowls',
    category: 'soundscape',
    duration: 15,
    emotions: ['scattered', 'anxious'],
    description: 'Singing bowl resonance'
  },
  {
    id: 'sound-005',
    title: 'Thunderstorm',
    category: 'soundscape',
    duration: 20,
    emotions: ['stressed', 'angry'],
    description: 'Distant storm rumbling'
  },
  {
    id: 'sound-006',
    title: 'Creek & Wind',
    category: 'soundscape',
    duration: 12,
    emotions: ['anxious', 'scattered'],
    description: 'Babbling brook with breeze'
  },
  {
    id: 'sound-007',
    title: 'Fireplace',
    category: 'soundscape',
    duration: 15,
    emotions: ['stressed', 'tired'],
    description: 'Crackling fire warmth'
  },
  {
    id: 'sound-008',
    title: 'Cafe Ambience',
    category: 'soundscape',
    duration: 20,
    emotions: ['lazy', 'scattered'],
    description: 'Gentle background chatter'
  },
  {
    id: 'sound-009',
    title: 'Wind Chimes',
    category: 'soundscape',
    duration: 10,
    emotions: ['anxious', 'stressed'],
    description: 'Melodic metal chimes'
  },
  {
    id: 'sound-010',
    title: 'Night Crickets',
    category: 'soundscape',
    duration: 15,
    emotions: ['stressed', 'anxious'],
    description: 'Summer evening sounds'
  },

  // MOVEMENT - 6 tracks
  {
    id: 'move-001',
    title: 'Gentle Stretching',
    category: 'movement',
    duration: 10,
    emotions: ['tired', 'stressed'],
    description: 'Easy desk-friendly stretches'
  },
  {
    id: 'move-002',
    title: 'Shake It Out',
    category: 'movement',
    duration: 5,
    emotions: ['angry', 'stressed'],
    description: 'Release tension through shaking'
  },
  {
    id: 'move-003',
    title: 'Energy Wake-Up',
    category: 'movement',
    duration: 7,
    emotions: ['tired', 'lazy'],
    description: 'Quick energizing movements'
  },
  {
    id: 'move-004',
    title: 'Neck & Shoulders',
    category: 'movement',
    duration: 8,
    emotions: ['stressed', 'anxious'],
    description: 'Release upper body tension'
  },
  {
    id: 'move-005',
    title: 'Grounding Flow',
    category: 'movement',
    duration: 12,
    emotions: ['scattered', 'anxious'],
    description: 'Slow, deliberate movements'
  },
  {
    id: 'move-006',
    title: 'Walking Meditation',
    category: 'movement',
    duration: 10,
    emotions: ['scattered', 'lazy'],
    description: 'Mindful walking practice'
  },

  // SLEEP - 8 tracks
  {
    id: 'sleep-001',
    title: 'Sleep Preparation',
    category: 'sleep',
    duration: 15,
    emotions: ['anxious', 'stressed'],
    description: 'Wind down for restful sleep'
  },
  {
    id: 'sleep-002',
    title: 'Body Melt',
    category: 'sleep',
    duration: 20,
    emotions: ['stressed', 'anxious'],
    description: 'Deep relaxation into sleep'
  },
  {
    id: 'sleep-003',
    title: 'Counting Down',
    category: 'sleep',
    duration: 12,
    emotions: ['scattered', 'anxious'],
    description: 'Numerical descent to sleep'
  },
  {
    id: 'sleep-004',
    title: 'Dream Journey',
    category: 'sleep',
    duration: 25,
    emotions: ['stressed', 'angry'],
    description: 'Visualization into dreamland'
  },
  {
    id: 'sleep-005',
    title: 'Night Sky',
    category: 'sleep',
    duration: 18,
    emotions: ['anxious', 'scattered'],
    description: 'Stargazing meditation'
  },
  {
    id: 'sleep-006',
    title: 'Gratitude Rest',
    category: 'sleep',
    duration: 10,
    emotions: ['stressed', 'angry'],
    description: 'End day with thankfulness'
  },
  {
    id: 'sleep-007',
    title: 'Heavy & Warm',
    category: 'sleep',
    duration: 15,
    emotions: ['anxious', 'stressed'],
    description: 'Autogenic relaxation for sleep'
  },
  {
    id: 'sleep-008',
    title: 'Breath Into Sleep',
    category: 'sleep',
    duration: 12,
    emotions: ['anxious', 'scattered'],
    description: 'Breathing pattern for sleep onset'
  }
];

// Get recommended audio based on emotion and available time
export function getRecommendation(emotion, availableMinutes) {
  const matching = audioLibrary.filter(
    audio => audio.emotions.includes(emotion) && audio.duration <= availableMinutes
  );

  if (matching.length === 0) {
    // If no exact match, get closest duration
    const emotionMatches = audioLibrary.filter(audio => audio.emotions.includes(emotion));
    if (emotionMatches.length === 0) return audioLibrary[0];
    return emotionMatches.reduce((closest, current) =>
      Math.abs(current.duration - availableMinutes) < Math.abs(closest.duration - availableMinutes)
        ? current
        : closest
    );
  }

  // Prefer duration closest to available time
  return matching.reduce((best, current) =>
    current.duration > best.duration ? current : best
  );
}

// Get all audio for a category
export function getByCategory(categoryId) {
  return audioLibrary.filter(audio => audio.category === categoryId);
}

// Get all audio for an emotion
export function getByEmotion(emotionId) {
  return audioLibrary.filter(audio => audio.emotions.includes(emotionId));
}
