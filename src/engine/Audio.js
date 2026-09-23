/**
 * Advanced Sound Engine & Procedural Synthwave/Chiptune BGM Synthesizer
 * Provides multi-track polyphonic retro background music and dynamic sound effects.
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

      // Master BGM & SFX Gains
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmGain && this.sfxGain) {
      const targetGain = this.isMuted ? 0 : 0.22;
      this.bgmGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
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

    // 130 BPM Sequencer Interval (~115ms per 16th note)
    const intervalMs = trackId === 'boss' ? 100 : 120;
    this.musicTimer = setInterval(() => {
      if (this.ctx && !this.isMuted) {
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
    const step = this.stepIndex % 32;
    this.stepIndex++;

    const now = this.ctx.currentTime;

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
      // D Minor Cyberpunk Synthwave
      const bassNotes = [73.42, 73.42, 87.31, 73.42, 65.41, 65.41, 98.00, 87.31]; // D2, F2, C2, G2
      const bassFreq = bassNotes[Math.floor(step / 4) % bassNotes.length];
      if (step % 2 === 0) this.playBassNote(bassFreq, now, 0.1);

      // Neon Lead Arpeggio
      const arpNotes = [293.66, 349.23, 440.00, 523.25, 440.00, 349.23, 587.33, 440.00];
      const leadFreq = arpNotes[step % arpNotes.length];
      this.playLeadNote(leadFreq, now, 0.11, 'sawtooth');

    } else if (trackId === 'kiruna') {
      // A Minor / C Major Arctic Aurora Chiptune
      const bassNotes = [55.00, 55.00, 65.41, 73.42, 82.41, 82.41, 65.41, 55.00]; // A1, C2, D2, E2
      const bassFreq = bassNotes[Math.floor(step / 4) % bassNotes.length];
      if (step % 2 === 0) this.playBassNote(bassFreq, now, 0.12);

      // Crystalline Bell Arpeggio
      const arpNotes = [440.00, 523.25, 659.25, 880.00, 659.25, 523.25, 783.99, 659.25];
      const leadFreq = arpNotes[step % arpNotes.length];
      this.playLeadNote(leadFreq, now, 0.14, 'sine');

    } else if (trackId === 'stockholm') {
      // G Major Royal Baroque Anthem
      const bassNotes = [98.00, 98.00, 82.41, 82.41, 73.42, 73.42, 110.00, 98.00]; // G2, E2, D2, A2
      const bassFreq = bassNotes[Math.floor(step / 4) % bassNotes.length];
      if (step % 2 === 0) this.playBassNote(bassFreq, now, 0.11);

      // Brass Fanfare Lead
      const melody = [392.00, 493.88, 587.33, 783.99, 587.33, 493.88, 659.25, 587.33];
      const leadFreq = melody[step % melody.length];
      this.playLeadNote(leadFreq, now, 0.12, 'square');

    } else if (trackId === 'visby') {
      // D Minor Phantom Sea-Shanty Synth
      const bassNotes = [73.42, 110.00, 73.42, 110.00, 65.41, 98.00, 82.41, 73.42];
      const bassFreq = bassNotes[step % bassNotes.length];
      this.playBassNote(bassFreq, now, 0.09);

      // Haunted Organ / Flute Lead
      const melody = [293.66, 329.63, 349.23, 440.00, 392.00, 349.23, 329.63, 293.66];
      const leadFreq = melody[Math.floor(step / 2) % melody.length];
      if (step % 2 === 0) this.playLeadNote(leadFreq, now, 0.18, 'triangle');

    } else if (trackId === 'boss') {
      // 140 BPM High-Octane Double-Kick Battle Synth
      const bassFreq = (step % 4 < 2) ? 65.41 : 73.42; // Fast C2 / D2 alternation
      this.playBassNote(bassFreq, now, 0.08);

      // Intense Sawtooth Tension Melody
      const tensionArp = [440.00, 466.16, 523.25, 587.33, 622.25, 587.33, 523.25, 466.16];
      const leadFreq = tensionArp[step % tensionArp.length];
      this.playLeadNote(leadFreq, now, 0.09, 'sawtooth');
    }
  }

  playBassNote(freq, now, duration = 0.1) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.linearRampToValueAtTime(0.01, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  playLeadNote(freq, now, duration = 0.12, type = 'sawtooth') {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  playSynthKick(now) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playSynthSnare(now) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.14);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  playSynthHiHat(now, accent = false) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(8000, now);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6000, now);

    const vol = accent ? 0.08 : 0.04;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  /* ================= SOUND EFFECTS (SFX) ================= */

  playLaser() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(850, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playHammer() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playSword() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1500, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.14);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.14);
  }

  playPoison() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.24, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playHit() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playUlt() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.85);
    gain.gain.setValueAtTime(0.38, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.9);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.9);
  }

  playSynergy() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.setValueAtTime(660, this.ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  playItem() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1174, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.24, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.24);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.24);
  }

  playWave() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(450, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playRoar() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.7);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.75);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.75);
  }
}

export const sound = new SoundEngine();
