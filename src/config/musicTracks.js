/**
 * Complete Procedural Video Game Soundtrack for ZODIAC SWEDEN
 * Features full, multi-section songs (Intro, Verse, Chorus, Bridge, Solo)
 * with polyphonic chord progressions, dynamic basslines, rich lead melodies,
 * counter-melodies, and complete drum kit percussion.
 */

// Semitone offsets from C
const SEMITONES = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
  'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

export function N(noteStr) {
  if (!noteStr || noteStr === '-' || noteStr === '.') return 0;
  const match = noteStr.match(/^([A-G][#b]?)([0-8])$/);
  if (!match) return 0;
  const name = match[1];
  const octave = parseInt(match[2], 10);
  const semi = SEMITONES[name];
  if (semi === undefined) return 0;
  const midi = (octave + 1) * 12 + semi;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Standard Chord Library (3 to 4 note polyphony)
 */
export const CHORDS = {
  // Minor chords
  'Am':  ['A2', 'C3', 'E3'],
  'Am7': ['A2', 'C3', 'E3', 'G3'],
  'Dm':  ['D3', 'F3', 'A3'],
  'Dm7': ['D3', 'F3', 'A3', 'C4'],
  'Em':  ['E2', 'G2', 'B2'],
  'Em7': ['E2', 'G2', 'B2', 'D3'],
  'F#m': ['F#2', 'A2', 'C#3'],
  'Gm':  ['G2', 'Bb2', 'D3'],
  'Gm7': ['G2', 'Bb2', 'D3', 'F3'],
  'Bm':  ['B2', 'D3', 'F#3'],
  'Cm':  ['C3', 'Eb3', 'G3'],

  // Major chords
  'C':   ['C3', 'E3', 'G3'],
  'Cmaj7': ['C3', 'E3', 'G3', 'B3'],
  'D':   ['D3', 'F#3', 'A3'],
  'E':   ['E2', 'G#2', 'B2'],
  'F':   ['F2', 'A2', 'C3'],
  'Fmaj7': ['F2', 'A2', 'C3', 'E3'],
  'G':   ['G2', 'B2', 'D3'],
  'A':   ['A2', 'C#3', 'E3'],
  'Bb':  ['Bb2', 'D3', 'F3'],
  'Eb':  ['Eb2', 'G2', 'Bb2'],
  'Ab':  ['Ab2', 'C3', 'Eb3'],

  // Dominant / Suspended / Special
  'A7':  ['A2', 'C#3', 'E3', 'G3'],
  'B7':  ['B2', 'D#3', 'F#3', 'A3'],
  'C#7': ['C#3', 'E#3', 'G#3', 'B3'],
  'D7':  ['D3', 'F#3', 'A3', 'C4'],
  'E7':  ['E2', 'G#2', 'B2', 'D3'],
  'Gsus4': ['G2', 'C3', 'D3'],
  'Dsus4': ['D3', 'G3', 'A3'],
  'Adim': ['A2', 'C3', 'Eb3']
};

/**
 * TRACK 1: "Svea Rike - Zodiac Awakening" (Title & Menu Theme)
 * Style: Triumphant, inspiring 80s Synthwave / Arcade Anthem
 * Key: A Minor / C Major, Tempo: 122 BPM, Length: 32 Bars (512 16th-steps)
 */
export const TITLE_TRACK = {
  id: 'title',
  name: 'ZODIAC AWAKENING (MAIN THEME)',
  tempo: 122,
  measures: 32,
  totalSteps: 512,

  // Chord progression for each bar (16 steps per bar)
  // Bars 0-7: Intro (Am, F, C, G x 2)
  // Bars 8-15: Verse 1 (Am, F, C, G, Am, F, Em, Am)
  // Bars 16-23: Chorus (C, G, Am, F, C, G, F, G)
  // Bars 24-31: Bridge & Solo (Dm, G, Em, Am, F, Dm, E7, Am)
  chordProgression: [
    // Intro
    'Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G',
    // Verse 1
    'Am', 'F', 'C', 'G', 'Am', 'F', 'Em', 'Am',
    // Chorus (Anthemic Hook!)
    'C', 'G', 'Am', 'F', 'C', 'G', 'F', 'G',
    // Bridge / Solo
    'Dm', 'G', 'Em', 'Am', 'F', 'Dm', 'E7', 'Am'
  ],

  // Lead melody: Array of note events with exact bar, beat-step (0-15), note, length
  // Expressive, catchy full song melodies with question-and-answer phrasing
  melody: [
    // --- INTRO FANFARE (Bars 4-7) ---
    { m: 4, s: 0, n: 'A4', d: 3 }, { m: 4, s: 4, n: 'C5', d: 2 }, { m: 4, s: 8, n: 'E5', d: 4 },
    { m: 5, s: 0, n: 'D5', d: 3 }, { m: 5, s: 4, n: 'C5', d: 2 }, { m: 5, s: 8, n: 'B4', d: 4 },
    { m: 6, s: 0, n: 'C5', d: 3 }, { m: 6, s: 4, n: 'D5', d: 2 }, { m: 6, s: 8, n: 'E5', d: 4 }, { m: 6, s: 12, n: 'G5', d: 3 },
    { m: 7, s: 0, n: 'E5', d: 6 }, { m: 7, s: 8, n: 'D5', d: 4 }, { m: 7, s: 12, n: 'C5', d: 2 }, { m: 7, s: 14, n: 'B4', d: 2 },

    // --- VERSE 1: HERO'S JOURNEY (Bars 8-15) ---
    // Bar 8-9: Phrase 1
    { m: 8, s: 0, n: 'A4', d: 2 }, { m: 8, s: 3, n: 'A4', d: 2 }, { m: 8, s: 6, n: 'B4', d: 2 }, { m: 8, s: 8, n: 'C5', d: 4 },
    { m: 9, s: 0, n: 'B4', d: 3 }, { m: 9, s: 4, n: 'A4', d: 2 }, { m: 9, s: 8, n: 'F4', d: 6 },
    // Bar 10-11: Phrase 2
    { m: 10, s: 0, n: 'G4', d: 2 }, { m: 10, s: 3, n: 'C5', d: 3 }, { m: 10, s: 6, n: 'D5', d: 2 }, { m: 10, s: 8, n: 'E5', d: 6 },
    { m: 11, s: 0, n: 'D5', d: 4 }, { m: 11, s: 6, n: 'C5', d: 2 }, { m: 11, s: 8, n: 'B4', d: 4 }, { m: 11, s: 12, n: 'G4', d: 3 },
    // Bar 12-13: Phrase 3
    { m: 12, s: 0, n: 'A4', d: 2 }, { m: 12, s: 3, n: 'C5', d: 2 }, { m: 12, s: 6, n: 'E5', d: 2 }, { m: 12, s: 8, n: 'A5', d: 6 },
    { m: 13, s: 0, n: 'G5', d: 3 }, { m: 13, s: 4, n: 'F5', d: 3 }, { m: 13, s: 8, n: 'E5', d: 4 }, { m: 13, s: 12, n: 'D5', d: 3 },
    // Bar 14-15: Cadence to Chorus
    { m: 14, s: 0, n: 'E5', d: 3 }, { m: 14, s: 4, n: 'B4', d: 3 }, { m: 14, s: 8, n: 'C5', d: 4 }, { m: 14, s: 12, n: 'D5', d: 3 },
    { m: 15, s: 0, n: 'E5', d: 4 }, { m: 15, s: 6, n: 'F5', d: 2 }, { m: 15, s: 8, n: 'G5', d: 4 }, { m: 15, s: 12, n: 'B4', d: 3 },

    // --- CHORUS: THE CONSTELLATION CALL (Bars 16-23) - Big Anthemic Hook! ---
    // "We are the guardians of the northern sky"
    { m: 16, s: 0, n: 'C5', d: 3 }, { m: 16, s: 4, n: 'E5', d: 3 }, { m: 16, s: 8, n: 'G5', d: 5 }, { m: 16, s: 14, n: 'A5', d: 2 },
    { m: 17, s: 0, n: 'G5', d: 4 }, { m: 17, s: 6, n: 'E5', d: 2 }, { m: 17, s: 8, n: 'D5', d: 6 },
    { m: 18, s: 0, n: 'E5', d: 3 }, { m: 18, s: 4, n: 'A4', d: 3 }, { m: 18, s: 8, n: 'C5', d: 4 }, { m: 18, s: 12, n: 'D5', d: 3 },
    { m: 19, s: 0, n: 'F5', d: 4 }, { m: 19, s: 6, n: 'E5', d: 2 }, { m: 19, s: 8, n: 'D5', d: 4 }, { m: 19, s: 12, n: 'C5', d: 3 },

    // Chorus Part 2: Soaring Climax
    { m: 20, s: 0, n: 'C5', d: 3 }, { m: 20, s: 4, n: 'E5', d: 3 }, { m: 20, s: 8, n: 'G5', d: 4 }, { m: 20, s: 12, n: 'C6', d: 4 },
    { m: 21, s: 0, n: 'B5', d: 4 }, { m: 21, s: 6, n: 'G5', d: 2 }, { m: 21, s: 8, n: 'D5', d: 6 },
    { m: 22, s: 0, n: 'F5', d: 3 }, { m: 22, s: 4, n: 'E5', d: 3 }, { m: 22, s: 8, n: 'D5', d: 4 }, { m: 22, s: 12, n: 'C5', d: 3 },
    { m: 23, s: 0, n: 'D5', d: 4 }, { m: 23, s: 6, n: 'E5', d: 2 }, { m: 23, s: 8, n: 'D5', d: 4 }, { m: 23, s: 12, n: 'B4', d: 3 },

    // --- BRIDGE & SYNTH SOLO (Bars 24-31) ---
    // Bar 24-25: Fast solo run
    { m: 24, s: 0, n: 'D5', d: 2 }, { m: 24, s: 2, n: 'F5', d: 2 }, { m: 24, s: 4, n: 'A5', d: 2 }, { m: 24, s: 6, n: 'D6', d: 4 }, { m: 24, s: 12, n: 'C6', d: 3 },
    { m: 25, s: 0, n: 'B5', d: 3 }, { m: 25, s: 4, n: 'G5', d: 3 }, { m: 25, s: 8, n: 'E5', d: 4 }, { m: 25, s: 12, n: 'D5', d: 3 },
    // Bar 26-27: Expressive flourishes
    { m: 26, s: 0, n: 'G5', d: 2 }, { m: 26, s: 3, n: 'E5', d: 2 }, { m: 26, s: 6, n: 'B4', d: 2 }, { m: 26, s: 8, n: 'C5', d: 4 }, { m: 26, s: 12, n: 'D5', d: 3 },
    { m: 27, s: 0, n: 'E5', d: 4 }, { m: 27, s: 6, n: 'A4', d: 2 }, { m: 27, s: 8, n: 'A5', d: 6 },
    // Bar 28-29: Building tension
    { m: 28, s: 0, n: 'F5', d: 3 }, { m: 28, s: 4, n: 'A5', d: 3 }, { m: 28, s: 8, n: 'C6', d: 4 }, { m: 28, s: 12, n: 'B5', d: 3 },
    { m: 29, s: 0, n: 'A5', d: 3 }, { m: 29, s: 4, n: 'F5', d: 3 }, { m: 29, s: 8, n: 'D5', d: 4 }, { m: 29, s: 12, n: 'F5', d: 3 },
    // Bar 30-31: Climactic resolution into the loop!
    { m: 30, s: 0, n: 'E5', d: 4 }, { m: 30, s: 4, n: 'G#5', d: 3 }, { m: 30, s: 8, n: 'B5', d: 4 }, { m: 30, s: 12, n: 'D6', d: 3 },
    { m: 31, s: 0, n: 'C6', d: 3 }, { m: 31, s: 4, n: 'B5', d: 2 }, { m: 31, s: 8, n: 'A5', d: 6 }, { m: 31, s: 14, n: 'G5', d: 2 }
  ],

  // Counter-melody / Arpeggio Chimes
  arpNotes: ['A4', 'C5', 'E5', 'A5', 'G5', 'E5', 'C5', 'B4', 'C5', 'E5', 'G5', 'E5', 'D5', 'C5', 'B4', 'G4']
};

/**
 * TRACK 2: "Neon Archipelago" (Göteborg Level)
 * Style: Cyberpunk Synthwave / French Touch Electro
 * Key: D Minor, Tempo: 125 BPM, Length: 32 Bars (512 Steps)
 */
export const GOTEBORG_TRACK = {
  id: 'goteborg',
  name: 'NEON ARCHIPELAGO (GÖTEBORG)',
  tempo: 125,
  measures: 32,
  totalSteps: 512,

  chordProgression: [
    // Intro Groove (Bars 0-7)
    'Dm', 'Dm', 'Bb', 'C', 'Dm', 'Dm', 'Bb', 'A7',
    // Verse: Cyber Runner (Bars 8-15)
    'Dm', 'F', 'Gm', 'A7', 'Dm', 'Bb', 'C', 'Dm',
    // Chorus: High Voltage Docks (Bars 16-23)
    'Bb', 'C', 'Dm', 'F', 'Bb', 'C', 'Dm', 'A7',
    // Bridge / Synth Drive (Bars 24-31)
    'Gm', 'Dm', 'Bb', 'C', 'Gm', 'A7', 'Dm', 'Dm'
  ],

  melody: [
    // --- INTRO HOOK (Bars 4-7) ---
    { m: 4, s: 0, n: 'D5', d: 2 }, { m: 4, s: 3, n: 'F5', d: 2 }, { m: 4, s: 6, n: 'A5', d: 3 }, { m: 4, s: 10, n: 'D5', d: 4 },
    { m: 5, s: 0, n: 'C5', d: 2 }, { m: 5, s: 3, n: 'E5', d: 2 }, { m: 5, s: 6, n: 'G5', d: 3 }, { m: 5, s: 10, n: 'C5', d: 4 },
    { m: 6, s: 0, n: 'Bb4', d: 2 }, { m: 6, s: 3, n: 'D5', d: 2 }, { m: 6, s: 6, n: 'F5', d: 3 }, { m: 6, s: 10, n: 'G5', d: 4 },
    { m: 7, s: 0, n: 'A5', d: 4 }, { m: 7, s: 6, n: 'G5', d: 2 }, { m: 7, s: 8, n: 'E5', d: 4 }, { m: 7, s: 12, n: 'C#5', d: 3 },

    // --- VERSE 1: CYBER RUNNER (Bars 8-15) ---
    { m: 8, s: 0, n: 'D4', d: 2 }, { m: 8, s: 4, n: 'F4', d: 2 }, { m: 8, s: 8, n: 'A4', d: 3 }, { m: 8, s: 12, n: 'D5', d: 3 },
    { m: 9, s: 0, n: 'C5', d: 4 }, { m: 9, s: 6, n: 'A4', d: 2 }, { m: 9, s: 8, n: 'F4', d: 6 },
    { m: 10, s: 0, n: 'G4', d: 3 }, { m: 10, s: 4, n: 'Bb4', d: 3 }, { m: 10, s: 8, n: 'D5', d: 4 }, { m: 10, s: 12, n: 'C5', d: 3 },
    { m: 11, s: 0, n: 'C#5', d: 4 }, { m: 11, s: 6, n: 'E5', d: 2 }, { m: 11, s: 8, n: 'A4', d: 6 },

    { m: 12, s: 0, n: 'D5', d: 2 }, { m: 12, s: 3, n: 'F5', d: 2 }, { m: 12, s: 6, n: 'D5', d: 2 }, { m: 12, s: 8, n: 'A5', d: 6 },
    { m: 13, s: 0, n: 'F5', d: 3 }, { m: 13, s: 4, n: 'G5', d: 3 }, { m: 13, s: 8, n: 'F5', d: 4 }, { m: 13, s: 12, n: 'D5', d: 3 },
    { m: 14, s: 0, n: 'E5', d: 3 }, { m: 14, s: 4, n: 'G5', d: 3 }, { m: 14, s: 8, n: 'E5', d: 4 }, { m: 14, s: 12, n: 'C5', d: 3 },
    { m: 15, s: 0, n: 'D5', d: 6 }, { m: 15, s: 8, n: 'F5', d: 2 }, { m: 15, s: 10, n: 'E5', d: 2 }, { m: 15, s: 12, n: 'C#5', d: 3 },

    // --- CHORUS: HIGH VOLTAGE (Bars 16-23) - Soaring Euphoric Synth Hook ---
    { m: 16, s: 0, n: 'D5', d: 3 }, { m: 16, s: 4, n: 'F5', d: 3 }, { m: 16, s: 8, n: 'Bb5', d: 4 }, { m: 16, s: 12, n: 'A5', d: 3 },
    { m: 17, s: 0, n: 'G5', d: 4 }, { m: 17, s: 6, n: 'E5', d: 2 }, { m: 17, s: 8, n: 'C5', d: 6 },
    { m: 18, s: 0, n: 'D5', d: 3 }, { m: 18, s: 4, n: 'A5', d: 3 }, { m: 18, s: 8, n: 'D6', d: 4 }, { m: 18, s: 12, n: 'C6', d: 3 },
    { m: 19, s: 0, n: 'A5', d: 4 }, { m: 19, s: 6, n: 'F5', d: 2 }, { m: 19, s: 8, n: 'E5', d: 4 }, { m: 19, s: 12, n: 'D5', d: 3 },

    { m: 20, s: 0, n: 'Bb5', d: 3 }, { m: 20, s: 4, n: 'A5', d: 3 }, { m: 20, s: 8, n: 'G5', d: 4 }, { m: 20, s: 12, n: 'F5', d: 3 },
    { m: 21, s: 0, n: 'G5', d: 4 }, { m: 21, s: 6, n: 'E5', d: 2 }, { m: 21, s: 8, n: 'C5', d: 4 }, { m: 21, s: 12, n: 'E5', d: 3 },
    { m: 22, s: 0, n: 'D5', d: 3 }, { m: 22, s: 4, n: 'F5', d: 3 }, { m: 22, s: 8, n: 'A5', d: 4 }, { m: 22, s: 12, n: 'D6', d: 3 },
    { m: 23, s: 0, n: 'C#6', d: 4 }, { m: 23, s: 6, n: 'A5', d: 2 }, { m: 23, s: 8, n: 'E5', d: 4 }, { m: 23, s: 12, n: 'G5', d: 3 },

    // --- BRIDGE / SYNTH SOLO (Bars 24-31) ---
    { m: 24, s: 0, n: 'G5', d: 2 }, { m: 24, s: 3, n: 'Bb5', d: 2 }, { m: 24, s: 6, n: 'D6', d: 4 }, { m: 24, s: 12, n: 'C6', d: 3 },
    { m: 25, s: 0, n: 'A5', d: 3 }, { m: 25, s: 4, n: 'F5', d: 3 }, { m: 25, s: 8, n: 'D5', d: 4 }, { m: 25, s: 12, n: 'E5', d: 3 },
    { m: 26, s: 0, n: 'F5', d: 2 }, { m: 26, s: 3, n: 'D5', d: 2 }, { m: 26, s: 6, n: 'Bb4', d: 2 }, { m: 26, s: 8, n: 'D5', d: 4 }, { m: 26, s: 12, n: 'F5', d: 3 },
    { m: 27, s: 0, n: 'G5', d: 4 }, { m: 27, s: 6, n: 'E5', d: 2 }, { m: 27, s: 8, n: 'C5', d: 6 },

    { m: 28, s: 0, n: 'Bb5', d: 3 }, { m: 28, s: 4, n: 'A5', d: 2 }, { m: 28, s: 8, n: 'G5', d: 4 }, { m: 28, s: 12, n: 'F5', d: 3 },
    { m: 29, s: 0, n: 'E5', d: 4 }, { m: 29, s: 6, n: 'C#5', d: 2 }, { m: 29, s: 8, n: 'A4', d: 6 },
    { m: 30, s: 0, n: 'D5', d: 2 }, { m: 30, s: 3, n: 'F5', d: 2 }, { m: 30, s: 6, n: 'A5', d: 2 }, { m: 30, s: 8, n: 'D6', d: 4 }, { m: 30, s: 12, n: 'E6', d: 3 },
    { m: 31, s: 0, n: 'F6', d: 4 }, { m: 31, s: 6, n: 'E6', d: 2 }, { m: 31, s: 8, n: 'D6', d: 4 }, { m: 31, s: 12, n: 'A5', d: 3 }
  ],

  arpNotes: ['D4', 'F4', 'A4', 'D5', 'A4', 'F4', 'C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'Bb3', 'D4', 'F4', 'Bb4']
};

/**
 * TRACK 3: "Aurora Borealis" (Kiruna Level)
 * Style: Crystalline Nordic Chiptune / Melodic Euro-Trance
 * Key: F# Minor / A Major, Tempo: 128 BPM, Length: 32 Bars (512 Steps)
 */
export const KIRUNA_TRACK = {
  id: 'kiruna',
  name: 'AURORA BOREALIS (KIRUNA)',
  tempo: 128,
  measures: 32,
  totalSteps: 512,

  chordProgression: [
    // Intro Crystal Shimmer (Bars 0-7)
    'F#m', 'D', 'A', 'E', 'F#m', 'D', 'Bm', 'C#7',
    // Verse: Sub-Zero Depths (Bars 8-15)
    'F#m', 'A', 'D', 'E', 'F#m', 'Bm', 'D', 'C#7',
    // Chorus: Celestial Lights (Bars 16-23)
    'D', 'E', 'F#m', 'A', 'D', 'E', 'F#m', 'C#7',
    // Bridge / Aurora Dance (Bars 24-31)
    'Bm', 'F#m', 'D', 'A', 'Bm', 'D', 'E', 'F#m'
  ],

  melody: [
    // --- INTRO CHIME (Bars 4-7) ---
    { m: 4, s: 0, n: 'F#5', d: 2 }, { m: 4, s: 4, n: 'A5', d: 2 }, { m: 4, s: 8, n: 'C#6', d: 4 }, { m: 4, s: 12, n: 'E6', d: 3 },
    { m: 5, s: 0, n: 'D6', d: 3 }, { m: 5, s: 4, n: 'B5', d: 2 }, { m: 5, s: 8, n: 'F#5', d: 6 },
    { m: 6, s: 0, n: 'E5', d: 2 }, { m: 6, s: 4, n: 'G#5', d: 2 }, { m: 6, s: 8, n: 'B5', d: 4 }, { m: 6, s: 12, n: 'D6', d: 3 },
    { m: 7, s: 0, n: 'C#6', d: 4 }, { m: 7, s: 6, n: 'B5', d: 2 }, { m: 7, s: 8, n: 'G#5', d: 4 }, { m: 7, s: 12, n: 'E#5', d: 3 },

    // --- VERSE: GLACIAL PASSAGE (Bars 8-15) ---
    { m: 8, s: 0, n: 'F#5', d: 3 }, { m: 8, s: 4, n: 'E5', d: 2 }, { m: 8, s: 8, n: 'F#5', d: 4 }, { m: 8, s: 12, n: 'A5', d: 3 },
    { m: 9, s: 0, n: 'E5', d: 4 }, { m: 9, s: 6, n: 'C#5', d: 2 }, { m: 9, s: 8, n: 'A4', d: 6 },
    { m: 10, s: 0, n: 'D5', d: 3 }, { m: 10, s: 4, n: 'F#5', d: 3 }, { m: 10, s: 8, n: 'A5', d: 4 }, { m: 10, s: 12, n: 'C#6', d: 3 },
    { m: 11, s: 0, n: 'B5', d: 6 }, { m: 11, s: 8, n: 'G#5', d: 4 }, { m: 11, s: 12, n: 'E5', d: 3 },

    { m: 12, s: 0, n: 'F#5', d: 3 }, { m: 12, s: 4, n: 'A5', d: 2 }, { m: 12, s: 8, n: 'C#6', d: 4 }, { m: 12, s: 12, n: 'E6', d: 3 },
    { m: 13, s: 0, n: 'D6', d: 4 }, { m: 13, s: 6, n: 'B5', d: 2 }, { m: 13, s: 8, n: 'F#5', d: 6 },
    { m: 14, s: 0, n: 'G#5', d: 3 }, { m: 14, s: 4, n: 'B5', d: 3 }, { m: 14, s: 8, n: 'D6', d: 4 }, { m: 14, s: 12, n: 'B5', d: 3 },
    { m: 15, s: 0, n: 'C#6', d: 6 }, { m: 15, s: 8, n: 'B5', d: 2 }, { m: 15, s: 10, n: 'A5', d: 2 }, { m: 15, s: 12, n: 'G#5', d: 3 },

    // --- CHORUS: AURORA TRANSCENDENCE (Bars 16-23) ---
    { m: 16, s: 0, n: 'D6', d: 3 }, { m: 16, s: 4, n: 'C#6', d: 2 }, { m: 16, s: 8, n: 'B5', d: 4 }, { m: 16, s: 12, n: 'A5', d: 3 },
    { m: 17, s: 0, n: 'B5', d: 4 }, { m: 17, s: 6, n: 'G#5', d: 2 }, { m: 17, s: 8, n: 'E5', d: 6 },
    { m: 18, s: 0, n: 'F#5', d: 3 }, { m: 18, s: 4, n: 'A5', d: 3 }, { m: 18, s: 8, n: 'C#6', d: 4 }, { m: 18, s: 12, n: 'F#6', d: 4 },
    { m: 19, s: 0, n: 'E6', d: 4 }, { m: 19, s: 6, n: 'C#6', d: 2 }, { m: 19, s: 8, n: 'A5', d: 6 },

    { m: 20, s: 0, n: 'D6', d: 3 }, { m: 20, s: 4, n: 'E6', d: 2 }, { m: 20, s: 8, n: 'F#6', d: 4 }, { m: 20, s: 12, n: 'E6', d: 3 },
    { m: 21, s: 0, n: 'D6', d: 4 }, { m: 21, s: 6, n: 'B5', d: 2 }, { m: 21, s: 8, n: 'G#5', d: 6 },
    { m: 22, s: 0, n: 'C#6', d: 3 }, { m: 22, s: 4, n: 'B5', d: 2 }, { m: 22, s: 8, n: 'A5', d: 4 }, { m: 22, s: 12, n: 'F#5', d: 3 },
    { m: 23, s: 0, n: 'G#5', d: 4 }, { m: 23, s: 6, n: 'A5', d: 2 }, { m: 23, s: 8, n: 'G#5', d: 4 }, { m: 23, s: 12, n: 'E#5', d: 3 },

    // --- BRIDGE / ICE BELL SOLO (Bars 24-31) ---
    { m: 24, s: 0, n: 'B5', d: 2 }, { m: 24, s: 3, n: 'D6', d: 2 }, { m: 24, s: 6, n: 'F#6', d: 4 }, { m: 24, s: 12, n: 'E6', d: 3 },
    { m: 25, s: 0, n: 'C#6', d: 4 }, { m: 25, s: 6, n: 'A5', d: 2 }, { m: 25, s: 8, n: 'F#5', d: 6 },
    { m: 26, s: 0, n: 'D6', d: 2 }, { m: 26, s: 3, n: 'F#6', d: 2 }, { m: 26, s: 6, n: 'A6', d: 4 }, { m: 26, s: 12, n: 'G#6', d: 3 },
    { m: 27, s: 0, n: 'E6', d: 4 }, { m: 27, s: 6, n: 'C#6', d: 2 }, { m: 27, s: 8, n: 'A5', d: 6 },

    { m: 28, s: 0, n: 'B5', d: 3 }, { m: 28, s: 4, n: 'D6', d: 3 }, { m: 28, s: 8, n: 'F#6', d: 4 }, { m: 28, s: 12, n: 'E6', d: 3 },
    { m: 29, s: 0, n: 'D6', d: 4 }, { m: 29, s: 6, n: 'B5', d: 2 }, { m: 29, s: 8, n: 'G#5', d: 6 },
    { m: 30, s: 0, n: 'A5', d: 2 }, { m: 30, s: 3, n: 'B5', d: 2 }, { m: 30, s: 6, n: 'C#6', d: 2 }, { m: 30, s: 8, n: 'E6', d: 4 }, { m: 30, s: 12, n: 'F#6', d: 3 },
    { m: 31, s: 0, n: 'G#6', d: 4 }, { m: 31, s: 6, n: 'E6', d: 2 }, { m: 31, s: 8, n: 'C#6', d: 4 }, { m: 31, s: 12, n: 'B5', d: 3 }
  ],

  arpNotes: ['F#4', 'A4', 'C#5', 'F#5', 'E5', 'C#5', 'D4', 'F#4', 'A4', 'D5', 'A4', 'F#4', 'E4', 'G#4', 'B4', 'E5']
};

/**
 * TRACK 4: "Vasa's March" (Stockholm Level)
 * Style: Neoclassical Baroque-Rock / Castlevania Royal Anthem
 * Key: G Minor / Bb Major, Tempo: 122 BPM, Length: 32 Bars (512 Steps)
 */
export const STOCKHOLM_TRACK = {
  id: 'stockholm',
  name: "VASA'S MARCH (STOCKHOLM)",
  tempo: 122,
  measures: 32,
  totalSteps: 512,

  chordProgression: [
    // Royal Prelude (Bars 0-7)
    'Gm', 'Eb', 'Bb', 'F', 'Gm', 'Eb', 'Cm', 'D7',
    // Baroque March (Bars 8-15)
    'Gm', 'Cm', 'F', 'Bb', 'Eb', 'Cm', 'D7', 'Gm',
    // Royal Palace Climax (Bars 16-23)
    'Eb', 'F', 'Gm', 'Bb', 'Cm', 'Gm', 'D7', 'Gm',
    // Harpsichord Duel (Bars 24-31)
    'Cm', 'F', 'Bb', 'Eb', 'Adim', 'D7', 'Gm', 'Gm'
  ],

  melody: [
    // --- BAROQUE INTRO FANFARE (Bars 4-7) ---
    { m: 4, s: 0, n: 'G4', d: 2 }, { m: 4, s: 3, n: 'Bb4', d: 2 }, { m: 4, s: 6, n: 'D5', d: 3 }, { m: 4, s: 10, n: 'G5', d: 4 },
    { m: 5, s: 0, n: 'F#5', d: 3 }, { m: 5, s: 4, n: 'A5', d: 2 }, { m: 5, s: 8, n: 'D5', d: 6 },
    { m: 6, s: 0, n: 'Eb5', d: 3 }, { m: 6, s: 4, n: 'G5', d: 2 }, { m: 6, s: 8, n: 'C5', d: 4 }, { m: 6, s: 12, n: 'Eb5', d: 3 },
    { m: 7, s: 0, n: 'D5', d: 4 }, { m: 7, s: 6, n: 'C5', d: 2 }, { m: 7, s: 8, n: 'Bb4', d: 4 }, { m: 7, s: 12, n: 'A4', d: 3 },

    // --- VERSE: IMPERIAL CORTEGE (Bars 8-15) ---
    { m: 8, s: 0, n: 'G4', d: 3 }, { m: 8, s: 4, n: 'A4', d: 2 }, { m: 8, s: 8, n: 'Bb4', d: 4 }, { m: 8, s: 12, n: 'C5', d: 3 },
    { m: 9, s: 0, n: 'D5', d: 4 }, { m: 9, s: 6, n: 'Bb4', d: 2 }, { m: 9, s: 8, n: 'G4', d: 6 },
    { m: 10, s: 0, n: 'F5', d: 3 }, { m: 10, s: 4, n: 'D5', d: 2 }, { m: 10, s: 8, n: 'Bb4', d: 4 }, { m: 10, s: 12, n: 'D5', d: 3 },
    { m: 11, s: 0, n: 'C5', d: 4 }, { m: 11, s: 6, n: 'A4', d: 2 }, { m: 11, s: 8, n: 'F4', d: 6 },

    { m: 12, s: 0, n: 'Eb5', d: 3 }, { m: 12, s: 4, n: 'G5', d: 2 }, { m: 12, s: 8, n: 'Bb5', d: 4 }, { m: 12, s: 12, n: 'A5', d: 3 },
    { m: 13, s: 0, n: 'G5', d: 4 }, { m: 13, s: 6, n: 'Eb5', d: 2 }, { m: 13, s: 8, n: 'C5', d: 6 },
    { m: 14, s: 0, n: 'D5', d: 3 }, { m: 14, s: 4, n: 'F#5', d: 2 }, { m: 14, s: 8, n: 'A5', d: 4 }, { m: 14, s: 12, n: 'C6', d: 3 },
    { m: 15, s: 0, n: 'Bb5', d: 4 }, { m: 15, s: 6, n: 'A5', d: 2 }, { m: 15, s: 8, n: 'G5', d: 6 },

    // --- CHORUS: ROYAL TRIUMPH (Bars 16-23) ---
    { m: 16, s: 0, n: 'Bb5', d: 3 }, { m: 16, s: 4, n: 'C6', d: 2 }, { m: 16, s: 8, n: 'D6', d: 4 }, { m: 16, s: 12, n: 'Bb5', d: 3 },
    { m: 17, s: 0, n: 'C6', d: 4 }, { m: 17, s: 6, n: 'A5', d: 2 }, { m: 17, s: 8, n: 'F5', d: 6 },
    { m: 18, s: 0, n: 'G5', d: 3 }, { m: 18, s: 4, n: 'Bb5', d: 2 }, { m: 18, s: 8, n: 'D6', d: 4 }, { m: 18, s: 12, n: 'G6', d: 4 },
    { m: 19, s: 0, n: 'F6', d: 4 }, { m: 19, s: 6, n: 'D6', d: 2 }, { m: 19, s: 8, n: 'Bb5', d: 6 },

    { m: 20, s: 0, n: 'Eb6', d: 3 }, { m: 20, s: 4, n: 'D6', d: 2 }, { m: 20, s: 8, n: 'C6', d: 4 }, { m: 20, s: 12, n: 'Bb5', d: 3 },
    { m: 21, s: 0, n: 'A5', d: 4 }, { m: 21, s: 6, n: 'F#5', d: 2 }, { m: 21, s: 8, n: 'D5', d: 6 },
    { m: 22, s: 0, n: 'C6', d: 3 }, { m: 22, s: 4, n: 'Bb5', d: 2 }, { m: 22, s: 8, n: 'A5', d: 4 }, { m: 22, s: 12, n: 'F#5', d: 3 },
    { m: 23, s: 0, n: 'G5', d: 6 }, { m: 23, s: 8, n: 'A5', d: 2 }, { m: 23, s: 10, n: 'Bb5', d: 2 }, { m: 23, s: 12, n: 'D6', d: 3 },

    // --- BRIDGE / HARPSICHORD RUNS (Bars 24-31) ---
    { m: 24, s: 0, n: 'Eb5', d: 2 }, { m: 24, s: 3, n: 'G5', d: 2 }, { m: 24, s: 6, n: 'C6', d: 4 }, { m: 24, s: 12, n: 'Eb6', d: 3 },
    { m: 25, s: 0, n: 'D6', d: 3 }, { m: 25, s: 4, n: 'Bb5', d: 2 }, { m: 25, s: 8, n: 'F5', d: 6 },
    { m: 26, s: 0, n: 'G5', d: 2 }, { m: 26, s: 3, n: 'Bb5', d: 2 }, { m: 26, s: 6, n: 'Eb6', d: 4 }, { m: 26, s: 12, n: 'D6', d: 3 },
    { m: 27, s: 0, n: 'C6', d: 4 }, { m: 27, s: 6, n: 'A5', d: 2 }, { m: 27, s: 8, n: 'F#5', d: 6 },

    { m: 28, s: 0, n: 'Eb6', d: 2 }, { m: 28, s: 3, n: 'C6', d: 2 }, { m: 28, s: 6, n: 'A5', d: 2 }, { m: 28, s: 8, n: 'F#5', d: 4 }, { m: 28, s: 12, n: 'D5', d: 3 },
    { m: 29, s: 0, n: 'F#5', d: 3 }, { m: 29, s: 4, n: 'A5', d: 2 }, { m: 29, s: 8, n: 'C6', d: 4 }, { m: 29, s: 12, n: 'Eb6', d: 3 },
    { m: 30, s: 0, n: 'D6', d: 4 }, { m: 30, s: 6, n: 'C6', d: 2 }, { m: 30, s: 8, n: 'Bb5', d: 4 }, { m: 30, s: 12, n: 'A5', d: 3 },
    { m: 31, s: 0, n: 'G5', d: 8 }, { m: 31, s: 10, n: 'Bb5', d: 2 }, { m: 31, s: 12, n: 'D6', d: 2 }, { m: 31, s: 14, n: 'G6', d: 2 }
  ],

  arpNotes: ['G3', 'Bb3', 'D4', 'G4', 'Bb4', 'D5', 'F#4', 'A4', 'C5', 'D5', 'Eb4', 'G4', 'Bb4', 'Eb5', 'D4', 'F#4']
};

/**
 * TRACK 5: "Phantom of the Baltic" (Visby Level)
 * Style: Darkwave Sea-Shanty / Gothic Ruin Synth
 * Key: E Minor, Tempo: 118 BPM, Length: 32 Bars (512 Steps)
 */
export const VISBY_TRACK = {
  id: 'visby',
  name: 'PHANTOM OF THE BALTIC (VISBY)',
  tempo: 118,
  measures: 32,
  totalSteps: 512,

  chordProgression: [
    // Ghostly Ruin Waves (Bars 0-7)
    'Em', 'Em', 'C', 'D', 'Em', 'Em', 'Am', 'B7',
    // Sea Shanty Verse (Bars 8-15)
    'Em', 'G', 'D', 'Em', 'C', 'Am', 'B7', 'Em',
    // Corsair Chorus (Bars 16-23)
    'G', 'D', 'Em', 'B7', 'C', 'G', 'Am', 'B7',
    // Spectre Bridge (Bars 24-31)
    'Am', 'Em', 'B7', 'Em', 'C', 'D', 'B7', 'Em'
  ],

  melody: [
    // --- INTRO PIRATE WHISTLE (Bars 4-7) ---
    { m: 4, s: 0, n: 'E5', d: 3 }, { m: 4, s: 4, n: 'G5', d: 2 }, { m: 4, s: 8, n: 'B5', d: 4 }, { m: 4, s: 12, n: 'A5', d: 3 },
    { m: 5, s: 0, n: 'G5', d: 4 }, { m: 5, s: 6, n: 'E5', d: 2 }, { m: 5, s: 8, n: 'B4', d: 6 },
    { m: 6, s: 0, n: 'C5', d: 3 }, { m: 6, s: 4, n: 'E5', d: 2 }, { m: 6, s: 8, n: 'A5', d: 4 }, { m: 6, s: 12, n: 'G5', d: 3 },
    { m: 7, s: 0, n: 'F#5', d: 4 }, { m: 7, s: 6, n: 'D#5', d: 2 }, { m: 7, s: 8, n: 'B4', d: 6 },

    // --- VERSE: BALTIC SHANTY (Bars 8-15) ---
    { m: 8, s: 0, n: 'E4', d: 2 }, { m: 8, s: 4, n: 'E4', d: 2 }, { m: 8, s: 8, n: 'G4', d: 3 }, { m: 8, s: 12, n: 'A4', d: 3 },
    { m: 9, s: 0, n: 'B4', d: 4 }, { m: 9, s: 6, n: 'B4', d: 2 }, { m: 9, s: 8, n: 'B4', d: 6 },
    { m: 10, s: 0, n: 'A4', d: 3 }, { m: 10, s: 4, n: 'F#4', d: 2 }, { m: 10, s: 8, n: 'D4', d: 4 }, { m: 10, s: 12, n: 'F#4', d: 3 },
    { m: 11, s: 0, n: 'E4', d: 6 }, { m: 11, s: 8, n: 'G4', d: 4 }, { m: 11, s: 12, n: 'B4', d: 3 },

    { m: 12, s: 0, n: 'C5', d: 3 }, { m: 12, s: 4, n: 'B4', d: 2 }, { m: 12, s: 8, n: 'A4', d: 4 }, { m: 12, s: 12, n: 'G4', d: 3 },
    { m: 13, s: 0, n: 'A4', d: 4 }, { m: 13, s: 6, n: 'C5', d: 2 }, { m: 13, s: 8, n: 'E5', d: 6 },
    { m: 14, s: 0, n: 'B4', d: 3 }, { m: 14, s: 4, n: 'D#5', d: 2 }, { m: 14, s: 8, n: 'F#5', d: 4 }, { m: 14, s: 12, n: 'A5', d: 3 },
    { m: 15, s: 0, n: 'G5', d: 4 }, { m: 15, s: 6, n: 'F#5', d: 2 }, { m: 15, s: 8, n: 'E5', d: 6 },

    // --- CHORUS: GHOST CORSAIR CHANT (Bars 16-23) ---
    { m: 16, s: 0, n: 'B5', d: 3 }, { m: 16, s: 4, n: 'B5', d: 2 }, { m: 16, s: 8, n: 'D6', d: 4 }, { m: 16, s: 12, n: 'B5', d: 3 },
    { m: 17, s: 0, n: 'A5', d: 4 }, { m: 17, s: 6, n: 'F#5', d: 2 }, { m: 17, s: 8, n: 'D5', d: 6 },
    { m: 18, s: 0, n: 'G5', d: 3 }, { m: 18, s: 4, n: 'A5', d: 2 }, { m: 18, s: 8, n: 'B5', d: 4 }, { m: 18, s: 12, n: 'G5', d: 3 },
    { m: 19, s: 0, n: 'F#5', d: 4 }, { m: 19, s: 6, n: 'D#5', d: 2 }, { m: 19, s: 8, n: 'B4', d: 6 },

    { m: 20, s: 0, n: 'C6', d: 3 }, { m: 20, s: 4, n: 'B5', d: 2 }, { m: 20, s: 8, n: 'A5', d: 4 }, { m: 20, s: 12, n: 'G5', d: 3 },
    { m: 21, s: 0, n: 'B5', d: 4 }, { m: 21, s: 6, n: 'G5', d: 2 }, { m: 21, s: 8, n: 'D5', d: 6 },
    { m: 22, s: 0, n: 'A5', d: 3 }, { m: 22, s: 4, n: 'C6', d: 2 }, { m: 22, s: 8, n: 'B5', d: 4 }, { m: 22, s: 12, n: 'A5', d: 3 },
    { m: 23, s: 0, n: 'B5', d: 4 }, { m: 23, s: 6, n: 'F#5', d: 2 }, { m: 23, s: 8, n: 'D#5', d: 6 },

    // --- BRIDGE / SPECTRE SOLO (Bars 24-31) ---
    { m: 24, s: 0, n: 'A5', d: 2 }, { m: 24, s: 3, n: 'C6', d: 2 }, { m: 24, s: 6, n: 'E6', d: 4 }, { m: 24, s: 12, n: 'D6', d: 3 },
    { m: 25, s: 0, n: 'B5', d: 4 }, { m: 25, s: 6, n: 'G5', d: 2 }, { m: 25, s: 8, n: 'E5', d: 6 },
    { m: 26, s: 0, n: 'F#5', d: 3 }, { m: 26, s: 4, n: 'A5', d: 2 }, { m: 26, s: 8, n: 'B5', d: 4 }, { m: 26, s: 12, n: 'D#6', d: 3 },
    { m: 27, s: 0, n: 'E6', d: 6 }, { m: 27, s: 8, n: 'B5', d: 4 }, { m: 27, s: 12, n: 'G5', d: 3 },

    { m: 28, s: 0, n: 'C6', d: 2 }, { m: 28, s: 3, n: 'E6', d: 2 }, { m: 28, s: 6, n: 'G6', d: 4 }, { m: 28, s: 12, n: 'F#6', d: 3 },
    { m: 29, s: 0, n: 'D6', d: 4 }, { m: 29, s: 6, n: 'B5', d: 2 }, { m: 29, s: 8, n: 'A5', d: 6 },
    { m: 30, s: 0, n: 'B5', d: 3 }, { m: 30, s: 4, n: 'D#6', d: 2 }, { m: 30, s: 8, n: 'F#6', d: 4 }, { m: 30, s: 12, n: 'A6', d: 3 },
    { m: 31, s: 0, n: 'G6', d: 4 }, { m: 31, s: 6, n: 'F#6', d: 2 }, { m: 31, s: 8, n: 'E6', d: 6 }
  ],

  arpNotes: ['E3', 'G3', 'B3', 'E4', 'G4', 'B4', 'C4', 'E4', 'G4', 'C5', 'D4', 'F#4', 'A4', 'D5', 'B3', 'D#4']
};

/**
 * TRACK 6: "Titan Climax" (Boss Battle)
 * Style: Heavy Metal Synthwave / High-Octane Double-Kick Battle Theme
 * Key: D Phrygian / D Minor, Tempo: 142 BPM, Length: 32 Bars (512 Steps)
 */
export const BOSS_TRACK = {
  id: 'boss',
  name: 'TITAN CLIMAX (RAGNARÖK)',
  tempo: 142,
  measures: 32,
  totalSteps: 512,

  chordProgression: [
    // Menace Rises (Bars 0-7)
    'Dm', 'Eb', 'Dm', 'Eb', 'Dm', 'Gm', 'A7', 'Bb',
    // Battle Drums (Bars 8-15)
    'Dm', 'Eb', 'Dm', 'Gm', 'Dm', 'Bb', 'A7', 'Dm',
    // Ragnarök Climax (Bars 16-23)
    'Bb', 'C', 'Dm', 'F', 'Gm', 'A7', 'Dm', 'Eb',
    // Solo Frenzy (Bars 24-31)
    'Dm', 'Gm', 'Bb', 'A7', 'Dm', 'Eb', 'A7', 'Dm'
  ],

  melody: [
    // --- SIREN CALL & INTRO SHRED (Bars 4-7) ---
    { m: 4, s: 0, n: 'D5', d: 2 }, { m: 4, s: 2, n: 'Eb5', d: 2 }, { m: 4, s: 4, n: 'D5', d: 2 }, { m: 4, s: 6, n: 'A5', d: 4 }, { m: 4, s: 12, n: 'G5', d: 3 },
    { m: 5, s: 0, n: 'F5', d: 2 }, { m: 5, s: 2, n: 'Eb5', d: 2 }, { m: 5, s: 4, n: 'D5', d: 4 }, { m: 5, s: 10, n: 'C#5', d: 4 },
    { m: 6, s: 0, n: 'D5', d: 2 }, { m: 6, s: 3, n: 'F5', d: 2 }, { m: 6, s: 6, n: 'Bb5', d: 3 }, { m: 6, s: 10, n: 'A5', d: 4 },
    { m: 7, s: 0, n: 'G5', d: 2 }, { m: 7, s: 2, n: 'F5', d: 2 }, { m: 7, s: 4, n: 'Eb5', d: 2 }, { m: 7, s: 6, n: 'D5', d: 2 }, { m: 7, s: 8, n: 'C#5', d: 6 },

    // --- VERSE: TITAN GAUNTLET (Bars 8-15) ---
    { m: 8, s: 0, n: 'D5', d: 3 }, { m: 8, s: 4, n: 'D5', d: 2 }, { m: 8, s: 8, n: 'F5', d: 3 }, { m: 8, s: 12, n: 'A5', d: 3 },
    { m: 9, s: 0, n: 'Bb5', d: 3 }, { m: 9, s: 4, n: 'A5', d: 2 }, { m: 9, s: 8, n: 'G5', d: 6 },
    { m: 10, s: 0, n: 'A5', d: 3 }, { m: 10, s: 4, n: 'F5', d: 2 }, { m: 10, s: 8, n: 'D5', d: 4 }, { m: 10, s: 12, n: 'Eb5', d: 3 },
    { m: 11, s: 0, n: 'D5', d: 6 }, { m: 11, s: 8, n: 'A4', d: 4 }, { m: 11, s: 12, n: 'C#5', d: 3 },

    { m: 12, s: 0, n: 'D5', d: 3 }, { m: 12, s: 4, n: 'F5', d: 2 }, { m: 12, s: 8, n: 'A5', d: 3 }, { m: 12, s: 12, n: 'D6', d: 4 },
    { m: 13, s: 0, n: 'C6', d: 3 }, { m: 13, s: 4, n: 'Bb5', d: 2 }, { m: 13, s: 8, n: 'A5', d: 6 },
    { m: 14, s: 0, n: 'G5', d: 3 }, { m: 14, s: 4, n: 'Bb5', d: 2 }, { m: 14, s: 8, n: 'A5', d: 4 }, { m: 14, s: 12, n: 'G5', d: 3 },
    { m: 15, s: 0, n: 'F5', d: 3 }, { m: 15, s: 4, n: 'Eb5', d: 2 }, { m: 15, s: 8, n: 'D5', d: 6 },

    // --- CHORUS: TITAN EXECUTION (Bars 16-23) ---
    { m: 16, s: 0, n: 'D6', d: 3 }, { m: 16, s: 4, n: 'C6', d: 2 }, { m: 16, s: 8, n: 'Bb5', d: 4 }, { m: 16, s: 12, n: 'A5', d: 3 },
    { m: 17, s: 0, n: 'G5', d: 4 }, { m: 17, s: 6, n: 'E5', d: 2 }, { m: 17, s: 8, n: 'C5', d: 6 },
    { m: 18, s: 0, n: 'F5', d: 3 }, { m: 18, s: 4, n: 'A5', d: 2 }, { m: 18, s: 8, n: 'D6', d: 4 }, { m: 18, s: 12, n: 'F6', d: 4 },
    { m: 19, s: 0, n: 'E6', d: 4 }, { m: 19, s: 6, n: 'C6', d: 2 }, { m: 19, s: 8, n: 'A5', d: 6 },

    { m: 20, s: 0, n: 'Bb5', d: 3 }, { m: 20, s: 4, n: 'D6', d: 2 }, { m: 20, s: 8, n: 'G6', d: 4 }, { m: 20, s: 12, n: 'F6', d: 3 },
    { m: 21, s: 0, n: 'E6', d: 4 }, { m: 21, s: 6, n: 'C#6', d: 2 }, { m: 21, s: 8, n: 'A5', d: 6 },
    { m: 22, s: 0, n: 'D6', d: 3 }, { m: 22, s: 4, n: 'F6', d: 2 }, { m: 22, s: 8, n: 'A6', d: 4 }, { m: 22, s: 12, n: 'G6', d: 3 },
    { m: 23, s: 0, n: 'Eb6', d: 4 }, { m: 23, s: 6, n: 'D6', d: 2 }, { m: 23, s: 8, n: 'C#6', d: 6 },

    // --- BRIDGE / FAST SOLO SHRED (Bars 24-31) ---
    { m: 24, s: 0, n: 'D6', d: 2 }, { m: 24, s: 2, n: 'F6', d: 2 }, { m: 24, s: 4, n: 'A6', d: 2 }, { m: 24, s: 6, n: 'G6', d: 2 }, { m: 24, s: 8, n: 'F6', d: 2 }, { m: 24, s: 10, n: 'Eb6', d: 2 }, { m: 24, s: 12, n: 'D6', d: 3 },
    { m: 25, s: 0, n: 'Bb5', d: 3 }, { m: 25, s: 4, n: 'G5', d: 2 }, { m: 25, s: 8, n: 'D5', d: 6 },
    { m: 26, s: 0, n: 'D6', d: 2 }, { m: 26, s: 3, n: 'Eb6', d: 2 }, { m: 26, s: 6, n: 'D6', d: 2 }, { m: 26, s: 8, n: 'Bb5', d: 4 }, { m: 26, s: 12, n: 'G5', d: 3 },
    { m: 27, s: 0, n: 'A5', d: 4 }, { m: 27, s: 6, n: 'E5', d: 2 }, { m: 27, s: 8, n: 'C#5', d: 6 },

    { m: 28, s: 0, n: 'D5', d: 2 }, { m: 28, s: 2, n: 'F5', d: 2 }, { m: 28, s: 4, n: 'A5', d: 2 }, { m: 28, s: 6, n: 'D6', d: 4 }, { m: 28, s: 12, n: 'F6', d: 3 },
    { m: 29, s: 0, n: 'Eb6', d: 3 }, { m: 29, s: 4, n: 'D6', d: 2 }, { m: 29, s: 8, n: 'Bb5', d: 4 }, { m: 29, s: 12, n: 'G5', d: 3 },
    { m: 30, s: 0, n: 'A5', d: 2 }, { m: 30, s: 2, n: 'C#6', d: 2 }, { m: 30, s: 4, n: 'E6', d: 2 }, { m: 30, s: 6, n: 'A6', d: 4 }, { m: 30, s: 12, n: 'G6', d: 3 },
    { m: 31, s: 0, n: 'F6', d: 3 }, { m: 31, s: 4, n: 'Eb6', d: 2 }, { m: 31, s: 8, n: 'D6', d: 4 }, { m: 31, s: 12, n: 'C#6', d: 3 }
  ],

  arpNotes: ['D4', 'Eb4', 'G4', 'Bb4', 'D5', 'Bb4', 'G4', 'Eb4', 'D4', 'F4', 'A4', 'D5', 'C#5', 'A4', 'F4', 'Eb4']
};

/**
 * TRACK 7: "Victory Fanfare"
 * Style: Celebratory Arcade Fanfare
 * Key: C Major, Tempo: 124 BPM, Length: 16 Bars (256 Steps)
 */
export const VICTORY_TRACK = {
  id: 'victory',
  name: 'CONSTELLATION TRIUMPH (VICTORY)',
  tempo: 124,
  measures: 16,
  totalSteps: 256,

  chordProgression: [
    'C', 'G', 'Am', 'F', 'C', 'G', 'F', 'C',
    'F', 'G', 'Em', 'Am', 'Dm', 'G', 'C', 'C'
  ],

  melody: [
    { m: 0, s: 0, n: 'C5', d: 2 }, { m: 0, s: 3, n: 'E5', d: 2 }, { m: 0, s: 6, n: 'G5', d: 3 }, { m: 0, s: 10, n: 'C6', d: 6 },
    { m: 1, s: 0, n: 'B5', d: 3 }, { m: 1, s: 4, n: 'G5', d: 2 }, { m: 1, s: 8, n: 'D5', d: 6 },
    { m: 2, s: 0, n: 'E5', d: 2 }, { m: 2, s: 4, n: 'A5', d: 3 }, { m: 2, s: 8, n: 'C6', d: 6 },
    { m: 3, s: 0, n: 'A5', d: 3 }, { m: 3, s: 4, n: 'F5', d: 2 }, { m: 3, s: 8, n: 'C5', d: 6 },

    { m: 4, s: 0, n: 'G5', d: 2 }, { m: 4, s: 3, n: 'C6', d: 2 }, { m: 4, s: 6, n: 'E6', d: 4 }, { m: 4, s: 12, n: 'D6', d: 3 },
    { m: 5, s: 0, n: 'B5', d: 4 }, { m: 5, s: 6, n: 'G5', d: 2 }, { m: 5, s: 8, n: 'D5', d: 6 },
    { m: 6, s: 0, n: 'F5', d: 3 }, { m: 6, s: 4, n: 'A5', d: 2 }, { m: 6, s: 8, n: 'C6', d: 4 }, { m: 6, s: 12, n: 'B5', d: 3 },
    { m: 7, s: 0, n: 'C6', d: 12 },

    { m: 8, s: 0, n: 'F5', d: 3 }, { m: 8, s: 4, n: 'A5', d: 2 }, { m: 8, s: 8, n: 'C6', d: 4 }, { m: 8, s: 12, n: 'E6', d: 3 },
    { m: 9, s: 0, n: 'D6', d: 4 }, { m: 9, s: 6, n: 'B5', d: 2 }, { m: 9, s: 8, n: 'G5', d: 6 },
    { m: 10, s: 0, n: 'E5', d: 3 }, { m: 10, s: 4, n: 'G5', d: 2 }, { m: 10, s: 8, n: 'B5', d: 4 }, { m: 10, s: 12, n: 'D6', d: 3 },
    { m: 11, s: 0, n: 'C6', d: 6 }, { m: 11, s: 8, n: 'A5', d: 4 }, { m: 11, s: 12, n: 'E5', d: 3 },

    { m: 12, s: 0, n: 'F5', d: 3 }, { m: 12, s: 4, n: 'A5', d: 2 }, { m: 12, s: 8, n: 'D6', d: 4 }, { m: 12, s: 12, n: 'C6', d: 3 },
    { m: 13, s: 0, n: 'B5', d: 4 }, { m: 13, s: 6, n: 'G5', d: 2 }, { m: 13, s: 8, n: 'D5', d: 6 },
    { m: 14, s: 0, n: 'C6', d: 3 }, { m: 14, s: 4, n: 'E6', d: 2 }, { m: 14, s: 8, n: 'G6', d: 6 },
    { m: 15, s: 0, n: 'C7', d: 14 }
  ],

  arpNotes: ['C5', 'E5', 'G5', 'C6', 'G5', 'E5', 'C5', 'G4']
};

export const ALL_MUSIC_TRACKS = {
  title: TITLE_TRACK,
  goteborg: GOTEBORG_TRACK,
  kiruna: KIRUNA_TRACK,
  stockholm: STOCKHOLM_TRACK,
  visby: VISBY_TRACK,
  boss: BOSS_TRACK,
  victory: VICTORY_TRACK
};
