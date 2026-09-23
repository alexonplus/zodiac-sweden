/**
 * Advanced Sound Engine & Procedural Synthwave/Chiptune BGM Synthesizer
 * Provides rich, loud, polyphonic retro background music and dynamic sound effects.
 */
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmGain = null;
    this.sfxGain = null;
    this.currentTrack = null;
    this.musicTimer = null;
    this.stepIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master BGM & SFX Gains (Clean and punchy volume)
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.42, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.48, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.bgmGain && this.sfxGain) {
      const targetBgm = this.isMuted ? 0 : 0.42;
      const targetSfx = this.isMuted ? 0 : 0.48;
      this.bgmGain.gain.setValueAtTime(targetBgm, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(targetSfx, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  /* ================= BACKGROUND MUSIC SEQUENCER ================= */

  playMusic(trackId) {
    this.init();
    if (this.currentTrack === trackId && this.musicTimer) return;
    this.stopMusic();
    this.currentTrack = trackId;
    this.stepIndex = 0;

    // 128 BPM Sequencer Interval (~117ms per 16th note)
    const intervalMs = trackId === 'boss' ? 95 : 118;
    this.musicTimer = setInterval(() => {
      if (this.ctx && !this.isMuted) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.tickMusicStep(trackId);
      }
    }, intervalMs);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    this.currentTrack = null;
  }

  tickMusicStep(trackId) {
    if (!this.ctx) return;
    const step = this.stepIndex % 32;
    this.stepIndex++;

    const now = this.ctx.currentTime + 0.01; // Reliable lookahead

    // 1. Drum Machine: Kick & Snare & Hi-Hat
    if (step % 4 === 0) {
      this.playSynthKick(now);
    }
    if (step % 8 === 4) {
      this.playSynthSnare(now);
    }
    if (step % 2 === 0) {
      this.playSynthHiHat(now, step % 4 === 2);
    }

    // 2. Bassline & Melody by Level Theme
    if (trackId === 'goteborg') {
      // D Minor Cyberpunk Synthwave (D2, F2, C2, G2)
      const bassNotes = [73.42, 73.42, 87.31, 73.42, 65.41, 65.41, 98.00, 87.31];
      const bassFreq = bassNotes[Math.floor(step / 4) % bassNotes.length];
      if (step % 2 === 0) this.playBassNote(bassFreq, now, 0.14);

      // Neon Lead Arpeggio
      const arpNotes = [293.66, 349.23, 440.00, 523.25, 440.00, 349.23, 587.33, 440.00];
      const leadFreq = arpNotes[step % arpNotes.length];
      this.playLeadNote(leadFreq, now, 0.12, 'sawtooth');

    } else if (trackId === 'kiruna') {
      // A Minor / C Major Arctic Aurora Chiptune (A1, C2, D2, E2)
      const bassNotes = [55.00, 55.00, 65.41, 73.42, 82.41, 82.41, 65.41, 55.00];
      const bassFreq = bassNotes[Math.floor(step / 4) % bassNotes.length];
      if (step % 2 === 0) this.playBassNote(bassFreq, now, 0.15);

      // Crystalline Bell Arpeggio
      const arpNotes = [440.00, 523.25, 659.25, 880.00, 659.25, 523.25, 783.99, 659.25];
      const leadFreq = arpNotes[step % arpNotes.length];
      this.playLeadNote(leadFreq, now, 0.14, 'square');

    } else if (trackId === 'stockholm') {
      // G Major Royal Baroque Anthem
      const bassNotes = [98.00, 98.00, 82.41, 82.41, 73.42, 73.42, 110.00, 98.00];
      const bassFreq = bassNotes[Math.floor(step / 4) % bassNotes.length];
      if (step % 2 === 0) this.playBassNote(bassFreq, now, 0.13);

      // Brass Fanfare Lead
      const melody = [392.00, 493.88, 587.33, 783.99, 587.33, 493.88, 659.25, 587.33];
      const leadFreq = melody[step % melody.length];
      this.playLeadNote(leadFreq, now, 0.14, 'square');

    } else if (trackId === 'visby') {
      // D Minor Phantom Sea-Shanty Synth
      const bassNotes = [73.42, 110.00, 73.42, 110.00, 65.41, 98.00, 82.41, 73.42];
      const bassFreq = bassNotes[step % bassNotes.length];
      this.playBassNote(bassFreq, now, 0.12);

      // Haunted Organ / Flute Lead
      const melody = [293.66, 329.63, 349.23, 440.00, 392.00, 349.23, 329.63, 293.66];
      const leadFreq = melody[Math.floor(step / 2) % melody.length];
      if (step % 2 === 0) this.playLeadNote(leadFreq, now, 0.20, 'triangle');

    } else if (trackId === 'boss') {
      // 140 BPM High-Octane Double-Kick Battle Synth
      const bassFreq = (step % 4 < 2) ? 65.41 : 73.42;
      this.playBassNote(bassFreq, now, 0.10);

      // Intense Sawtooth Tension Melody
      const tensionArp = [440.00, 466.16, 523.25, 587.33, 622.25, 587.33, 523.25, 466.16];
      const leadFreq = tensionArp[step % tensionArp.length];
      this.playLeadNote(leadFreq, now, 0.11, 'sawtooth');
    }
  }

  playBassNote(freq, now, duration = 0.12) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.36, now);
      gain.gain.linearRampToValueAtTime(0.01, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  playLeadNote(freq, now, duration = 0.14, type = 'sawtooth') {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  playSynthKick(now) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.12);

      gain.gain.setValueAtTime(0.48, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  playSynthSnare(now) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.14);

      gain.gain.setValueAtTime(0.30, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  playSynthHiHat(now, accent = false) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(8000, now);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(6000, now);

      const vol = accent ? 0.10 : 0.05;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  /* ================= SOUND EFFECTS (SFX) ================= */

  playLaser() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.24, this.ctx.currentTime);
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
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.40, this.ctx.currentTime);
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
      osc.frequency.linearRampToValueAtTime(1500, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
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
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.30, this.ctx.currentTime);
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
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.85);
      gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
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
      gain.gain.setValueAtTime(0.40, this.ctx.currentTime);
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
      gain.gain.setValueAtTime(0.30, this.ctx.currentTime);
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
      osc.frequency.linearRampToValueAtTime(450, this.ctx.currentTime + 0.25);
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
      osc.frequency.setValueAtTime(100, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.75);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.75);
    } catch (e) {}
  }
}

export const sound = new SoundEngine();
