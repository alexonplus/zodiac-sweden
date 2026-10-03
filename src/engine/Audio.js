import { N, CHORDS, ALL_MUSIC_TRACKS } from '../config/musicTracks.js';
import { saveCustomAudio, loadCustomAudio, deleteCustomAudio } from './AudioStorage.js';

/**
 * Advanced Multi-Track Procedural Synthesizer & Sound Engine
 * Plays full, multi-section video game songs with polyphonic chords,
 * dynamic driving basslines, singing synth leads with vibrato, counter-arps,
 * and a full percussion drum machine (kick, snare, hi-hats, crash, tom fills).
 * Also supports real custom audio tracks (MP3/WAV/OGG) with IndexedDB persistence.
 */
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmGain = null;
    this.sfxGain = null;
    this.masterCompressor = null;
    this.stereoDelayNode = null;
    this.delayGain = null;

    // Music playback state
    this.currentTrack = null;
    this.trackData = null;
    this.tempo = 124;
    this.stepIndex = 0;
    this.totalSteps = 512;
    this.stepDuration = 0.12; // In seconds (16th note)
    this.nextStepTime = 0;
    this.schedulerTimer = null;

    // Custom Audio Player state (MP3 / WAV from user)
    this.customAudioElement = null;
    this.customAudioUrl = '/assets/goteborg_custom.mp3';
    this.customAudioName = 'Gothenburg1.mp3';
    this.hasCustomAudio = true;

    // Noise buffer for realistic snare, hats, and crashes
    this.noiseBuffer = null;

    // Melody index tracker for current song
    this.melodyEventIndex = 0;
  }

  init() {
    if (!this.customAudioElement && typeof window !== 'undefined' && window.Audio) {
      const AudioClass = window.Audio;
      this.customAudioElement = new AudioClass();
      this.customAudioElement.loop = true;
      this.customAudioElement.preload = 'auto';
      this.customAudioElement.src = this.customAudioUrl || '/assets/goteborg_custom.mp3';
      this.customAudioElement.volume = this.isMuted ? 0 : 0.8;
      this.loadSavedCustomMusic();
    }

    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // 1. Studio-grade Master Dynamics Compressor
      // Prevents clipping, glues polyphony, and adds punchy analog pumping
      this.masterCompressor = this.ctx.createDynamicsCompressor();
      this.masterCompressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      this.masterCompressor.knee.setValueAtTime(20, this.ctx.currentTime);
      this.masterCompressor.ratio.setValueAtTime(6, this.ctx.currentTime);
      this.masterCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.masterCompressor.release.setValueAtTime(0.2, this.ctx.currentTime);
      this.masterCompressor.connect(this.ctx.destination);

      // 2. Stereo Delay / Ambient Chorus Send for lush studio depth
      this.stereoDelayNode = this.ctx.createDelay(1.0);
      this.stereoDelayNode.delayTime.setValueAtTime(0.18, this.ctx.currentTime); // ~3 sixteenth notes ping-pong
      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(2200, this.ctx.currentTime);

      this.stereoDelayNode.connect(delayFilter);
      delayFilter.connect(this.delayGain);
      this.delayGain.connect(this.masterCompressor);

      // Feedback loop
      const delayFeedback = this.ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.28, this.ctx.currentTime);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(this.stereoDelayNode);

      // 3. Master BGM Gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.44, this.ctx.currentTime);
      this.bgmGain.connect(this.masterCompressor);

      // 4. Master SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.48, this.ctx.currentTime);
      this.sfxGain.connect(this.masterCompressor);

      // 5. Pre-render 2 seconds of stereo white/pink noise for percussion
      this.createNoiseBuffer();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  createNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pinkish noise curve for softer metallic bite
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    this.noiseBuffer = buffer;
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.bgmGain && this.sfxGain && this.ctx) {
      const targetBgm = this.isMuted ? 0 : 0.44;
      const targetSfx = this.isMuted ? 0 : 0.48;
      this.bgmGain.gain.setValueAtTime(targetBgm, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(targetSfx, this.ctx.currentTime);
    }
    if (this.customAudioElement) {
      this.customAudioElement.muted = this.isMuted;
      this.customAudioElement.volume = this.isMuted ? 0 : 0.75;
    }
    return this.isMuted;
  }

  /* ================= CUSTOM AUDIO FILE INTEGRATION ================= */

  async loadSavedCustomMusic() {
    try {
      const saved = await loadCustomAudio('goteborg-1');
      if (saved && saved.blob) {
        if (this.customAudioUrl && this.customAudioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(this.customAudioUrl);
        }
        this.customAudioUrl = URL.createObjectURL(saved.blob);
        this.customAudioName = saved.name || 'Gothenburg1.mp3';
        this.hasCustomAudio = true;
        if (this.customAudioElement) {
          this.customAudioElement.src = this.customAudioUrl;
        }
        console.log('🎵 Loaded persistent custom music:', this.customAudioName);
        this.notifyCustomAudioChanged();
      } else {
        // Default to user's provided Gothenburg1 song asset
        this.customAudioUrl = '/assets/goteborg_custom.mp3';
        this.customAudioName = 'Gothenburg1.mp3';
        this.hasCustomAudio = true;
        const curLoc = (typeof window !== 'undefined' && window.location) ? window.location.href : '';
        if (this.customAudioElement && (!this.customAudioElement.src || (curLoc && this.customAudioElement.src === curLoc))) {
          this.customAudioElement.src = this.customAudioUrl;
        }
        this.notifyCustomAudioChanged();
      }
    } catch (e) {
      console.warn('Failed to load saved custom music:', e);
    }
  }

  async setCustomAudio(fileOrBlob, fileName) {
    this.init();
    if (!fileOrBlob) return false;
    try {
      if (this.customAudioUrl && this.customAudioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.customAudioUrl);
      }
      this.customAudioUrl = URL.createObjectURL(fileOrBlob);
      this.customAudioName = fileName || fileOrBlob.name || 'Gothenburg1.mp3';
      this.hasCustomAudio = true;

      if (this.customAudioElement) {
        this.customAudioElement.src = this.customAudioUrl;
        this.customAudioElement.currentTime = 0;
      }

      saveCustomAudio('goteborg-1', fileOrBlob, this.customAudioName).catch(e => {
        console.warn('Background save to IndexedDB failed:', e);
      });
      console.log('🎵 Saved and active custom music for Göteborg:', this.customAudioName);
      this.notifyCustomAudioChanged();

      // If we are currently playing goteborg or in game, switch immediately to it!
      if (this.currentTrack === 'goteborg-1' || this.currentTrack === 'goteborg' || (typeof this.currentTrack === 'string' && this.currentTrack.startsWith('goteborg'))) {
        this.playMusic(this.currentTrack);
      }
      return true;
    } catch (e) {
      console.error('Error setting custom audio:', e);
      return false;
    }
  }

  async clearCustomAudio() {
    try {
      await deleteCustomAudio('goteborg-1');
      if (this.customAudioUrl && this.customAudioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.customAudioUrl);
      }
      this.customAudioUrl = '/assets/goteborg_custom.mp3';
      this.customAudioName = 'Gothenburg1.mp3';
      this.hasCustomAudio = true;
      if (this.customAudioElement) {
        this.customAudioElement.src = this.customAudioUrl;
      }
      this.notifyCustomAudioChanged();
      if (this.currentTrack === 'goteborg-1' || this.currentTrack === 'goteborg' || (typeof this.currentTrack === 'string' && this.currentTrack.startsWith('goteborg'))) {
        this.playMusic(this.currentTrack);
      }
    } catch (e) {}
  }

  notifyCustomAudioChanged() {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('zodiac-custom-audio-changed', {
        detail: { hasCustomAudio: this.hasCustomAudio, name: this.customAudioName }
      }));
    }
  }

  playCustomAudio() {
    if (!this.customAudioElement) {
      this.init();
    }
    if (!this.customAudioElement) return false;
    try {
      const curLoc = (typeof window !== 'undefined' && window.location) ? window.location.href : '';
      if (!this.customAudioElement.src || (curLoc && this.customAudioElement.src === curLoc) || this.customAudioElement.src.endsWith('/')) {
        this.customAudioElement.src = this.customAudioUrl || '/assets/goteborg_custom.mp3';
      }
      this.customAudioElement.muted = this.isMuted;
      this.customAudioElement.volume = this.isMuted ? 0 : 0.8;
      const promise = this.customAudioElement.play();
      if (promise && promise.catch) {
        promise.catch(err => console.log('Audio autoplay waiting for user interaction:', err));
      }
      return true;
    } catch (e) {
      console.error('Error playing custom audio:', e);
      return false;
    }
  }

  pauseCustomAudio() {
    if (this.customAudioElement) {
      try {
        this.customAudioElement.pause();
      } catch (e) {}
    }
  }

  /* ================= BACKGROUND MUSIC SEQUENCER ================= */

  /**
   * Starts playing a full, multi-section musical composition.
   * @param {string} trackId - 'title', 'goteborg', 'goteborg-1', 'kiruna', 'stockholm', 'visby', 'boss', 'victory'
   */
  playMusic(trackId) {
    this.init();

    // 1. If playing the custom uploaded audio for Göteborg level:
    const isGoteborg = (trackId === 'goteborg-1' || trackId === 'goteborg' || (typeof trackId === 'string' && trackId.startsWith('goteborg')));
    if (isGoteborg && this.customAudioUrl) {
      if (this.currentTrack === trackId && this.customAudioElement && !this.customAudioElement.paused) {
        return;
      }
      this.stopMusic(false); // Stop procedural synth
      this.currentTrack = trackId;
      this.playCustomAudio();
      return;
    }

    // If switching away from custom audio, make sure it is paused
    this.pauseCustomAudio();

    if (this.currentTrack === trackId && this.schedulerTimer) return;

    this.stopMusic(false);

    const track = ALL_MUSIC_TRACKS[trackId] || ALL_MUSIC_TRACKS['goteborg-1'] || ALL_MUSIC_TRACKS['goteborg'];
    this.currentTrack = trackId;
    this.trackData = track;
    this.tempo = track.tempo || 124;
    this.totalSteps = track.totalSteps || 512;
    this.stepIndex = 0;
    this.melodyEventIndex = 0;

    // Sixteenth note duration = (60 / BPM) / 4
    this.stepDuration = (60 / this.tempo) / 4;

    if (this.ctx) {
      this.nextStepTime = this.ctx.currentTime + 0.05;
      // If switching directly to boss battle, trigger a dramatic crash cymbal impact!
      if (trackId === 'boss') {
        this.synthCrash(this.ctx.currentTime + 0.02);
      }
    }

    // High-accuracy lookahead scheduling loop (every 25ms, schedules ahead by 120ms)
    this.schedulerTimer = setInterval(() => {
      this.scheduleLoop();
    }, 25);
  }

  getCurrentTrack() {
    return this.currentTrack;
  }

  stopMusic(clearTrack = true) {
    this.pauseCustomAudio();
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (clearTrack) {
      this.currentTrack = null;
      this.trackData = null;
    }
  }

  /**
   * Web Audio precision lookahead scheduler.
   * Eliminates all JS event loop jitter and stutter.
   */
  scheduleLoop() {
    if (!this.ctx || this.isMuted || !this.trackData) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Schedule all steps that fall within the lookahead window (120ms)
    const lookahead = 0.12;
    while (this.nextStepTime < this.ctx.currentTime + lookahead) {
      this.scheduleStep(this.stepIndex, this.nextStepTime);
      this.nextStepTime += this.stepDuration;
      this.stepIndex = (this.stepIndex + 1) % this.totalSteps;
    }
  }

  /**
   * Orchestrates the instruments for a single 16th-note step.
   * @param {number} step - Current step (0 to totalSteps - 1)
   * @param {number} time - Exact audio context timestamp for note onset
   */
  scheduleStep(step, time) {
    const track = this.trackData;
    if (!track) return;

    const measureIndex = Math.floor(step / 16);
    const stepInMeasure = step % 16;
    const isChorus = measureIndex >= 16 && measureIndex < 24;
    const isBridge = measureIndex >= 24 && measureIndex < 32;
    const isPreChorus = (measureIndex >= 12 && measureIndex < 16) || (measureIndex >= 4 && measureIndex < 8 && track.id === 'boss');

    // Current chord for this bar
    const chordProgression = track.chordProgression || [];
    const chordName = chordProgression[measureIndex % chordProgression.length] || 'Am';
    const chordNotes = CHORDS[chordName] || ['A2', 'C3', 'E3'];
    const rootNoteName = chordNotes[0];
    const rootFreq = N(rootNoteName);

    // ================= 1. DRUMS & PERCUSSION ENGINE =================
    // Crash Cymbal on section downbeats
    if (stepInMeasure === 0) {
      if (measureIndex === 0 || measureIndex === 8 || measureIndex === 16 || measureIndex === 24) {
        this.synthCrash(time);
      }
    }

    // Tom fill on the final bar of pre-chorus or bridge
    const isFillBar = measureIndex === 15 || measureIndex === 31 || (track.id === 'boss' && measureIndex % 8 === 7);
    if (isFillBar && stepInMeasure >= 10) {
      // Rolling toms
      const tomFreq = stepInMeasure === 10 ? 180 : (stepInMeasure === 12 ? 140 : 100);
      this.synthTom(tomFreq, time);
      if (stepInMeasure % 2 === 0) this.synthSnare(time, 0.4);
    } else {
      // Standard Drum Patterns:
      // Kick: Heavy on 0 and 8, four-on-the-floor during chorus and boss
      let playKick = false;
      if (isChorus || track.id === 'boss') {
        playKick = stepInMeasure % 4 === 0; // 0, 4, 8, 12
        if (track.id === 'boss' && stepInMeasure % 2 === 0 && Math.random() < 0.4) {
          playKick = true; // Double kick assault
        }
      } else {
        playKick = (stepInMeasure === 0 || stepInMeasure === 8 || (stepInMeasure === 14 && measureIndex % 2 === 1));
      }
      if (playKick) {
        this.synthKick(time);
      }

      // Snare: Solid on beats 2 and 4 (steps 4 and 12)
      if (stepInMeasure === 4 || stepInMeasure === 12) {
        this.synthSnare(time, isChorus ? 0.45 : 0.35);
      }

      // Pre-chorus snare build-up roll
      if (isPreChorus && measureIndex % 2 === 1 && stepInMeasure >= 8 && stepInMeasure % 2 === 0) {
        this.synthSnare(time, 0.2 + (stepInMeasure / 16) * 0.25);
      }

      // Hi-Hats: 16th notes with open hat accents
      if (stepInMeasure % 2 === 0) {
        const isOpen = (stepInMeasure === 10 || (isChorus && stepInMeasure === 6));
        const isAccent = stepInMeasure % 4 === 2;
        this.synthHiHat(time, isOpen, isAccent);
      }
    }

    // ================= 2. POLYPHONIC CHORD PADS & BRASS =================
    // Play lush 3-4 note chords on every bar downbeat and syncopated stabs
    let playChordNow = false;
    let chordDur = 14 * this.stepDuration;

    if (stepInMeasure === 0) {
      playChordNow = true;
      chordDur = 14 * this.stepDuration;
    } else if (isChorus && (stepInMeasure === 6 || stepInMeasure === 12)) {
      // Syncopated rhythm stabs in chorus
      playChordNow = true;
      chordDur = 3 * this.stepDuration;
    } else if (isBridge && stepInMeasure === 8) {
      playChordNow = true;
      chordDur = 6 * this.stepDuration;
    }

    if (playChordNow) {
      const chordFreqs = chordNotes.map(n => N(n)).filter(f => f > 0);
      const isBright = isChorus || track.id === 'goteborg';
      this.synthChordVoice(chordFreqs, time, chordDur, isBright ? 'sawtooth' : 'triangle');
    }

    // ================= 3. DYNAMIC BASSLINE =================
    // Energetic driving bassline following the chord root with octaves, fifths, and groove
    if (rootFreq > 0) {
      let bassFreq = rootFreq;
      let playBass = false;
      const fifthFreq = rootFreq * 1.5;
      const octaveFreq = rootFreq * 2;

      if (isChorus || track.id === 'boss') {
        // High-energy driving 16th-note pump with octave bounces
        playBass = true;
        if (stepInMeasure % 4 === 0) bassFreq = rootFreq;
        else if (stepInMeasure % 4 === 2) bassFreq = octaveFreq;
        else if (stepInMeasure % 4 === 3) bassFreq = (stepInMeasure === 15) ? fifthFreq : rootFreq;
        else bassFreq = rootFreq;
      } else if (track.id === 'goteborg' || track.id === 'goteborg-1') {
        // Cyberpunk rolling bass
        playBass = stepInMeasure % 2 === 0 || stepInMeasure % 4 === 3;
        bassFreq = (stepInMeasure % 4 === 2) ? octaveFreq : rootFreq;
      } else {
        // Rhythmic groove
        playBass = (stepInMeasure === 0 || stepInMeasure === 3 || stepInMeasure === 6 || stepInMeasure === 8 || stepInMeasure === 11 || stepInMeasure === 14);
        if (stepInMeasure === 6 || stepInMeasure === 14) bassFreq = fifthFreq;
        else if (stepInMeasure === 3 || stepInMeasure === 11) bassFreq = octaveFreq;
      }

      if (playBass) {
        const bassDur = this.stepDuration * 1.25;
        this.synthBassNote(bassFreq, time, bassDur, stepInMeasure % 4 === 0);
      }
    }

    // ================= 4. LEAD MELODY =================
    // Real composed melodic songs with expressive vibrato and singing phrasing
    if (track.melody && track.melody.length > 0) {
      for (let i = 0; i < track.melody.length; i++) {
        const m = track.melody[i];
        if (m.m === measureIndex && m.s === stepInMeasure) {
          const leadFreq = N(m.n);
          if (leadFreq > 0) {
            const leadDur = m.d * this.stepDuration * 0.95;
            const hasVibrato = m.d >= 3; // Singing vibrato on sustained notes
            this.synthLeadNote(leadFreq, time, leadDur, hasVibrato, track.id);
          }
        }
      }
    }

    // ================= 5. COUNTER-MELODY / BELL ARPEGGIO =================
    // Shimmering chimes dancing between lead phrases
    if (track.arpNotes && track.arpNotes.length > 0) {
      const arpIdx = (step) % track.arpNotes.length;
      const arpNote = track.arpNotes[arpIdx];
      const arpFreq = N(arpNote);
      // Play arpeggio on 16th steps, softening when melody is singing
      if (arpFreq > 0 && (stepInMeasure % 2 === 1 || isBridge || !isChorus)) {
        this.synthArpNote(arpFreq, time, this.stepDuration * 1.5);
      }
    }
  }

  /* ================= SYNTHESIS INSTRUMENTS ================= */

  /**
   * Punchy Analog Bass Synthesizer with sub-sine and punchy lowpass saw.
   */
  synthBassNote(freq, time, duration, isAccent = false) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq * 0.5, time); // Warm Sub-bass

      // Warm analog lowpass filter
      filter.type = 'lowpass';
      const startCutoff = isAccent ? 1200 : 700;
      filter.frequency.setValueAtTime(startCutoff, time);
      filter.frequency.exponentialRampToValueAtTime(110, time + duration);
      filter.Q.setValueAtTime(2.2, time);

      const vol = isAccent ? 0.32 : 0.24;
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.005, time + duration);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      subOsc.start(time);
      osc.stop(time + duration);
      subOsc.stop(time + duration);
    } catch (e) {}
  }

  /**
   * Polyphonic Synth Pad & Brass Voice (Chord harmony).
   * Spreads 3-4 frequencies into warm, rich chords.
   */
  synthChordVoice(freqArray, time, duration, oscType = 'sawtooth') {
    if (!this.ctx || this.isMuted || !freqArray || freqArray.length === 0) return;
    try {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, time);
      filter.frequency.exponentialRampToValueAtTime(450, time + duration);
      filter.Q.setValueAtTime(1.5, time);

      const chordGain = this.ctx.createGain();
      const noteVol = 0.16 / Math.sqrt(freqArray.length);

      // Smooth attack and warm release envelope
      chordGain.gain.setValueAtTime(0.001, time);
      chordGain.gain.linearRampToValueAtTime(noteVol, time + 0.04);
      chordGain.gain.exponentialRampToValueAtTime(noteVol * 0.7, time + duration * 0.6);
      chordGain.gain.linearRampToValueAtTime(0.001, time + duration);

      filter.connect(chordGain);
      chordGain.connect(this.bgmGain);
      // Send some chord signal to stereo chorus delay
      if (this.stereoDelayNode) {
        chordGain.connect(this.stereoDelayNode);
      }

      freqArray.forEach((freq, idx) => {
        // Dual detuned oscillators for lush analog chorus
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();

        osc1.type = oscType;
        osc2.type = oscType;

        // Slight micro-detune (+5 and -5 cents)
        osc1.frequency.setValueAtTime(freq, time);
        osc1.detune.setValueAtTime(idx * 2 + 5, time);

        osc2.frequency.setValueAtTime(freq, time);
        osc2.detune.setValueAtTime(idx * 2 - 5, time);

        osc1.connect(filter);
        osc2.connect(filter);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + duration);
        osc2.stop(time + duration);
      });
    } catch (e) {}
  }

  /**
   * Singing Lead Synthesizer with dual-oscillator thickness,
   * expressive LFO vibrato on held notes, and resonant filter bite.
   */
  synthLeadNote(freq, time, duration, hasVibrato = false, trackId = 'goteborg') {
    if (!this.ctx || this.isMuted || freq <= 0) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      // Instrument Timbre Selection by Level
      if (trackId === 'kiruna') {
        osc1.type = 'square';
        osc2.type = 'triangle'; // Crystalline bell tone
      } else if (trackId === 'visby') {
        osc1.type = 'triangle';
        osc2.type = 'sawtooth'; // Ghostly flute/whistle
      } else {
        osc1.type = 'sawtooth';
        osc2.type = 'square'; // Classic 80s arcade synth brass
      }

      osc1.frequency.setValueAtTime(freq, time);
      osc2.frequency.setValueAtTime(freq, time);

      // Analog detuning (+8 cents)
      osc1.detune.setValueAtTime(7, time);
      osc2.detune.setValueAtTime(-7, time);

      // Vibrato LFO for singing expression on sustained notes
      if (hasVibrato && duration > 0.25) {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(5.5, time); // 5.5 Hz musical vibrato

        lfoGain.gain.setValueAtTime(0, time);
        // Delay vibrato onset by 0.15s (natural human vocal inflection)
        lfoGain.gain.setValueAtTime(0, time + 0.15);
        lfoGain.gain.linearRampToValueAtTime(14, time + 0.35);

        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        lfo.start(time);
        lfo.stop(time + duration);
      }

      // Filter contour
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3600, time);
      filter.frequency.exponentialRampToValueAtTime(1200, time + duration);
      filter.Q.setValueAtTime(2.8, time);

      // ADSR Envelope
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.26, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.18, time + duration * 0.7);
      gain.gain.linearRampToValueAtTime(0.001, time + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      // Lead delay send for spacious stadium sound
      if (this.stereoDelayNode) {
        gain.connect(this.stereoDelayNode);
      }

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration);
      osc2.stop(time + duration);
    } catch (e) {}
  }

  /**
   * Crystalline Bell / Arpeggio Chimes Synthesizer.
   */
  synthArpNote(freq, time, duration = 0.15) {
    if (!this.ctx || this.isMuted || freq <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, time);
      filter.Q.setValueAtTime(1.2, time);

      // Subtle, gentle volume so it sparkles in the background without being an annoying beep
      gain.gain.setValueAtTime(0.045, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      // Send to stereo delay for lush ambient space
      if (this.stereoDelayNode) {
        gain.connect(this.stereoDelayNode);
      }

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  }

  /**
   * Deep Punchy 909-Style Kick Drum.
   */
  synthKick(time) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch drop: 160Hz -> 38Hz in 0.12s
      osc.frequency.setValueAtTime(170, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

      gain.gain.setValueAtTime(0.55, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + 0.14);
    } catch (e) {}
  }

  /**
   * Crisp Snare Drum with pitched body + filtered noise burst.
   */
  synthSnare(time, volume = 0.35) {
    if (!this.ctx || this.isMuted) return;
    try {
      // 1. Tonal body
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, time);
      osc.frequency.exponentialRampToValueAtTime(75, time + 0.12);

      oscGain.gain.setValueAtTime(volume * 0.8, time);
      oscGain.gain.linearRampToValueAtTime(0.001, time + 0.12);

      osc.connect(oscGain);
      oscGain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + 0.12);

      // 2. White noise snare rattle
      if (this.noiseBuffer) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1400, time);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(volume * 0.9, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.bgmGain);

        noiseSource.start(time);
        noiseSource.stop(time + 0.18);
      }
    } catch (e) {}
  }

  /**
   * Metallic Hi-Hat (Closed & Open).
   */
  synthHiHat(time, isOpen = false, isAccent = false) {
    if (!this.ctx || this.isMuted || !this.noiseBuffer) return;
    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7500, time);

      const gain = this.ctx.createGain();
      const dur = isOpen ? 0.18 : 0.045;
      const vol = isOpen ? 0.14 : (isAccent ? 0.11 : 0.06);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      source.start(time);
      source.stop(time + dur);
    } catch (e) {}
  }

  /**
   * Shimmering Crash Cymbal for dramatic downbeats.
   */
  synthCrash(time) {
    if (!this.ctx || this.isMuted || !this.noiseBuffer) return;
    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(4500, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 1.4);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      source.start(time);
      source.stop(time + 1.4);
    } catch (e) {}
  }

  /**
   * Resonant Pitched Tom for phrase transitions and fills.
   */
  synthTom(freq, time) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.4, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, time + 0.15);

      gain.gain.setValueAtTime(0.35, time);
      gain.gain.linearRampToValueAtTime(0.001, time + 0.15);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + 0.15);
    } catch (e) {}
  }

  /* ================= SOUND EFFECTS (SFX) ================= */

  playSelect() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.04); // A5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  playClick() {
    this.playSelect();
  }

  playCancel() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.05);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  playLaser() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(950, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playHammer() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.44, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  playSword() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1600, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch (e) {}
  }

  playPoison() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }

  playHit() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.32, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  playUlt() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1500, this.ctx.currentTime + 0.85);
      gain.gain.setValueAtTime(0.48, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.9);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.9);
    } catch (e) {}
  }

  playSynergy() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.setValueAtTime(660, this.ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.42, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch (e) {}
  }

  playItem() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1174, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.32, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.24);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.24);
    } catch (e) {}
  }

  playWave() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(480, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.32, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  playRoar() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.75);
      gain.gain.setValueAtTime(0.48, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch (e) {}
  }

  playFreeze() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      // Crystalline high-frequency chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2600, this.ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }

  playIceShatter() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      // Glass/ice crack + high burst
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(2200, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.28);
      osc2.frequency.setValueAtTime(1800, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.48, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.32);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);
      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.32);
      osc2.stop(this.ctx.currentTime + 0.32);
    } catch (e) {}
  }

  playWindGale() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      // Howling wind gust using band-passed modulated oscillator
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.35);
      osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.7);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(900, this.ctx.currentTime + 0.3);
      filter.frequency.linearRampToValueAtTime(250, this.ctx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.42, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.75);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.75);
    } catch (e) {}
  }

  playEarthQuake() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      // Deep tectonic sub rumble and rock crash
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.55, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.65);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.65);
    } catch (e) {}
  }

  playFireBurst() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.44, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch (e) {}
  }
}

export const sound = new SoundEngine();
