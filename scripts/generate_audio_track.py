#!/usr/bin/env python3
"""
High-quality Procedural Audio Synthesizer to generate a real, studio-grade MP3/WAV
electronic dance / cyberpunk banger for Göteborg 1-1.
"""
import math
import wave
import struct
import subprocess
import os

SAMPLE_RATE = 44100
BPM = 126.0
STEP_DUR = (60.0 / BPM) / 4.0 # 16th note in seconds (~0.119s)
TOTAL_BARS = 32
TOTAL_STEPS = TOTAL_BARS * 16
TOTAL_SECONDS = TOTAL_STEPS * STEP_DUR # ~60.95 seconds

print(f"Generating {TOTAL_SECONDS:.2f}s audio track at {SAMPLE_RATE}Hz, {BPM} BPM...")

num_samples = int(SAMPLE_RATE * TOTAL_SECONDS)
left_channel = [0.0] * num_samples
right_channel = [0.0] * num_samples

def midi_to_freq(m):
    return 440.0 * (2.0 ** ((m - 69.0) / 12.0))

# Notes mapping
NOTE_TO_SEMI = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
    'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
}

def note(name_oct):
    if not name_oct: return 0.0
    import re
    m = re.match(r'^([A-G][#b]?)([0-8])$', name_oct)
    if not m: return 0.0
    name = m.group(1)
    octave = int(m.group(2))
    semi = NOTE_TO_SEMI.get(name, 0)
    midi = (octave + 1) * 12 + semi
    return midi_to_freq(midi)

# 1. GENERATE DRUMS (Kick, Snare, Hi-Hats, Crash)
for bar in range(TOTAL_BARS):
    is_chorus = (16 <= bar < 24)
    for step in range(16):
        global_step = bar * 16 + step
        start_t = global_step * STEP_DUR
        start_samp = int(start_t * SAMPLE_RATE)

        # Kick drum on beats 0, 4, 8, 12 (Four-on-the-floor electro punch!)
        if step % 4 == 0:
            kick_dur = 0.16
            kick_samps = int(kick_dur * SAMPLE_RATE)
            for s in range(min(kick_samps, num_samples - start_samp)):
                t = s / SAMPLE_RATE
                env = math.exp(-t * 22.0)
                freq = 155.0 * math.exp(-t * 30.0) + 42.0
                click = math.sin(2.0 * math.pi * 900.0 * t) * math.exp(-t * 120.0) * 0.3
                val = (math.sin(2.0 * math.pi * freq * t) + click) * env * 0.72
                idx = start_samp + s
                left_channel[idx] += val
                right_channel[idx] += val

        # Snare drum on beats 4 and 12
        if step in (4, 12):
            snare_dur = 0.20
            snare_samps = int(snare_dur * SAMPLE_RATE)
            for s in range(min(snare_samps, num_samples - start_samp)):
                t = s / SAMPLE_RATE
                env = math.exp(-t * 18.0)
                # Tonal body
                tonal = math.sin(2.0 * math.pi * 185.0 * t) * math.exp(-t * 28.0)
                # Filtered noise
                noise = ((hash((start_samp + s) * 17) % 2000) / 1000.0 - 1.0) * math.exp(-t * 14.0)
                val = (tonal * 0.45 + noise * 0.55) * env * 0.55
                idx = start_samp + s
                left_channel[idx] += val * 0.95
                right_channel[idx] += val * 1.05

        # Hi-Hats: 16th notes with open hat on offbeats
        if step % 2 == 1 or is_chorus:
            is_open = (step in (2, 6, 10, 14))
            hat_dur = 0.12 if is_open else 0.04
            hat_samps = int(hat_dur * SAMPLE_RATE)
            decay = 18.0 if is_open else 65.0
            vol = 0.22 if is_open else 0.14
            for s in range(min(hat_samps, num_samples - start_samp)):
                t = s / SAMPLE_RATE
                env = math.exp(-t * decay)
                noise = ((hash((start_samp + s) * 31) % 2000) / 1000.0 - 1.0)
                val = noise * env * vol
                idx = start_samp + s
                left_channel[idx] += val * 1.1
                right_channel[idx] += val * 0.9

        # Crash cymbal on bar 0, 8, 16, 24
        if step == 0 and bar in (0, 8, 16, 24):
            crash_dur = 1.2
            crash_samps = int(crash_dur * SAMPLE_RATE)
            for s in range(min(crash_samps, num_samples - start_samp)):
                t = s / SAMPLE_RATE
                env = math.exp(-t * 3.5)
                noise = ((hash((start_samp + s) * 73) % 2000) / 1000.0 - 1.0)
                val = noise * env * 0.30
                idx = start_samp + s
                left_channel[idx] += val * 0.85
                right_channel[idx] += val * 1.15

# 2. GENERATE PUNCHY BASSLINE (D Minor Electro Groove)
BASS_ROOTS = [
    # Bars 0-7
    'D2', 'Bb1', 'C2', 'D2', 'D2', 'G1', 'Bb1', 'A1',
    # Bars 8-15
    'D2', 'Bb1', 'F2', 'C2', 'D2', 'G1', 'C2', 'A1',
    # Bars 16-23
    'Bb1', 'C2', 'D2', 'F2', 'G1', 'A1', 'Bb1', 'C2',
    # Bars 24-31
    'D2', 'F2', 'G1', 'A1', 'Bb1', 'C2', 'D2', 'D2'
]

for bar in range(TOTAL_BARS):
    root_str = BASS_ROOTS[bar % len(BASS_ROOTS)]
    root_f = note(root_str)
    oct_f = root_f * 2.0
    fifth_f = root_f * 1.5

    for step in range(16):
        global_step = bar * 16 + step
        start_t = global_step * STEP_DUR
        start_samp = int(start_t * SAMPLE_RATE)

        # Syncopated 16th-note electro rolling bass
        play_bass = (step % 2 == 0) or (step % 4 == 3)
        if not play_bass: continue

        f = oct_f if (step % 4 == 2) else (fifth_f if step == 15 else root_f)
        dur = STEP_DUR * 1.15
        samps = int(dur * SAMPLE_RATE)

        for s in range(min(samps, num_samples - start_samp)):
            t = s / SAMPLE_RATE
            env = math.exp(-t * 12.0)
            # Sawtooth + sub sine
            phase = (t * f) % 1.0
            saw = (2.0 * phase - 1.0)
            sub = math.sin(2.0 * math.pi * (f * 0.5) * t)
            # Lowpass resonance
            val = (saw * 0.6 + sub * 0.6) * env * 0.42
            idx = start_samp + s
            left_channel[idx] += val
            right_channel[idx] += val

# 3. GENERATE LUSH CHORDS & PADS
CHORDS = {
    'Dm': ['D3', 'F3', 'A3'],
    'Bb': ['Bb2', 'D3', 'F3'],
    'C':  ['C3', 'E3', 'G3'],
    'F':  ['F2', 'A2', 'C3'],
    'Gm': ['G2', 'Bb2', 'D3'],
    'Am': ['A2', 'C3', 'E3'],
    'A7': ['A2', 'C#3', 'E3', 'G3'],
    'G1': ['G2', 'Bb2', 'D3'],
    'A1': ['A2', 'C#3', 'E3']
}

for bar in range(TOTAL_BARS):
    chord_name = BASS_ROOTS[bar % len(BASS_ROOTS)]
    notes_list = CHORDS.get(chord_name, ['D3', 'F3', 'A3'])
    freqs = [note(n) for n in notes_list if note(n) > 0]

    # Stabs on beats
    stabs = [0]
    if 16 <= bar < 24:
        stabs = [0, 6, 12]

    for stab_step in stabs:
        start_t = (bar * 16 + stab_step) * STEP_DUR
        start_samp = int(start_t * SAMPLE_RATE)
        dur = (14 if stab_step == 0 else 3) * STEP_DUR
        samps = int(dur * SAMPLE_RATE)

        for f in freqs:
            for s in range(min(samps, num_samples - start_samp)):
                t = s / SAMPLE_RATE
                env = math.exp(-t * (2.2 if stab_step == 0 else 7.0))
                phase1 = (t * f) % 1.0
                phase2 = (t * (f * 1.004)) % 1.0 # Stereo detune
                s1 = math.sin(2.0 * math.pi * phase1) + 0.4 * (2.0 * phase1 - 1.0)
                s2 = math.sin(2.0 * math.pi * phase2) + 0.4 * (2.0 * phase2 - 1.0)
                val = env * 0.08
                idx = start_samp + s
                left_channel[idx] += s1 * val
                right_channel[idx] += s2 * val

# 4. GENERATE SINGING ELECTRO SYNTH LEAD
LEAD_MELODY = [
    # Bars 0-3: Intro Theme
    (0, 0, 'D5', 3), (0, 4, 'F5', 2), (0, 8, 'A5', 4), (0, 12, 'D6', 3),
    (1, 0, 'C6', 3), (1, 4, 'A5', 2), (1, 8, 'F5', 4), (1, 12, 'G5', 3),
    (2, 0, 'E5', 3), (2, 4, 'G5', 2), (2, 8, 'C6', 4), (2, 12, 'B5', 2),
    (3, 0, 'A5', 6), (3, 8, 'F5', 3), (3, 12, 'E5', 3),

    # Bars 4-7: Intro Hook 2
    (4, 0, 'D5', 2), (4, 3, 'F5', 2), (4, 6, 'A5', 3), (4, 10, 'D6', 4),
    (5, 0, 'C6', 2), (5, 3, 'A5', 2), (5, 6, 'F5', 3), (5, 10, 'G5', 4),
    (6, 0, 'Bb5', 2), (6, 3, 'A5', 2), (6, 6, 'G5', 3), (6, 10, 'F5', 4),
    (7, 0, 'E5', 4), (7, 6, 'F5', 2), (7, 8, 'G5', 4), (7, 12, 'A5', 3),

    # Bars 8-15: Main Electro Verse
    (8, 0, 'D5', 2), (8, 3, 'D5', 2), (8, 6, 'F5', 2), (8, 8, 'A5', 4), (8, 12, 'D6', 3),
    (9, 0, 'C6', 3), (9, 4, 'A5', 2), (9, 8, 'F5', 6),
    (10, 0, 'G5', 2), (10, 3, 'Bb5', 2), (10, 6, 'D6', 3), (10, 10, 'C6', 4),
    (11, 0, 'A5', 4), (11, 6, 'G5', 2), (11, 8, 'F5', 6),
    (12, 0, 'D5', 2), (12, 3, 'F5', 2), (12, 6, 'A5', 2), (12, 8, 'D6', 6),
    (13, 0, 'F6', 3), (13, 4, 'E6', 2), (13, 8, 'D6', 4), (13, 12, 'C6', 3),
    (14, 0, 'Bb5', 3), (14, 4, 'C6', 2), (14, 8, 'D6', 4), (14, 12, 'E6', 3),
    (15, 0, 'C#6', 6), (15, 8, 'A5', 4), (15, 12, 'G5', 3),

    # Bars 16-23: High Voltage Club Chorus
    (16, 0, 'F5', 3), (16, 4, 'A5', 3), (16, 8, 'D6', 4), (16, 12, 'C6', 4),
    (17, 0, 'Bb5', 4), (17, 6, 'A5', 2), (17, 8, 'G5', 6),
    (18, 0, 'A5', 3), (18, 4, 'D6', 3), (18, 8, 'F6', 4), (18, 12, 'E6', 4),
    (19, 0, 'D6', 4), (19, 6, 'C6', 2), (19, 8, 'A5', 6),
    (20, 0, 'Bb5', 3), (20, 4, 'D6', 3), (20, 8, 'G6', 4), (20, 12, 'F6', 3),
    (21, 0, 'E6', 4), (21, 6, 'C6', 2), (21, 8, 'G5', 4), (21, 12, 'A5', 3),
    (22, 0, 'Bb5', 3), (22, 4, 'C6', 3), (22, 8, 'D6', 4), (22, 12, 'F6', 3),
    (23, 0, 'E6', 6), (23, 8, 'C#6', 4), (23, 12, 'A5', 3),

    # Bars 24-31: Solo Shred & Climax
    (24, 0, 'D6', 2), (24, 2, 'F6', 2), (24, 4, 'A6', 2), (24, 6, 'D6', 4), (24, 12, 'C6', 3),
    (25, 0, 'Bb5', 3), (25, 4, 'A5', 2), (25, 8, 'G5', 4), (25, 12, 'F5', 3),
    (26, 0, 'G5', 2), (26, 3, 'Bb5', 2), (26, 6, 'D6', 3), (26, 10, 'C6', 4),
    (27, 0, 'A5', 4), (27, 6, 'F5', 2), (27, 8, 'D5', 6),
    (28, 0, 'Bb5', 3), (28, 4, 'D6', 2), (28, 8, 'F6', 4), (28, 12, 'G6', 3),
    (29, 0, 'A6', 4), (29, 6, 'E6', 2), (29, 8, 'C6', 6),
    (30, 0, 'D6', 2), (30, 3, 'F6', 2), (30, 6, 'A6', 2), (30, 8, 'D7', 4), (30, 12, 'C7', 3),
    (31, 0, 'Bb6', 3), (31, 4, 'A6', 2), (31, 8, 'D6', 6), (31, 14, 'F6', 2)
]

for (bar, step, n_str, d_steps) in LEAD_MELODY:
    f = note(n_str)
    if f <= 0: continue
    start_t = (bar * 16 + step) * STEP_DUR
    start_samp = int(start_t * SAMPLE_RATE)
    dur = d_steps * STEP_DUR
    samps = int(dur * SAMPLE_RATE)
    delay_samps = int(0.18 * SAMPLE_RATE) # Stereo ping-pong delay

    for s in range(min(samps, num_samples - start_samp)):
        t = s / SAMPLE_RATE
        # Envelope: Attack 0.02s, Decay, Sustain, Release
        env = min(1.0, t / 0.02) * math.exp(-t * (1.2 if d_steps > 3 else 3.5))
        # Vibrato on sustained notes
        vibrato = math.sin(2.0 * math.pi * 5.5 * t) * 6.0 if d_steps >= 3 and t > 0.15 else 0.0
        cur_f = f + vibrato

        phase1 = (t * cur_f) % 1.0
        phase2 = (t * (cur_f + 0.6)) % 1.0 # Slight detune
        # Sawtooth + Square blend
        saw = (2.0 * phase1 - 1.0)
        sqr = 1.0 if phase2 < 0.5 else -1.0
        val = (saw * 0.65 + sqr * 0.35) * env * 0.32

        idx = start_samp + s
        left_channel[idx] += val
        right_channel[idx] += val

        # Stereo Delay Send
        if idx + delay_samps < num_samples:
            left_channel[idx + delay_samps] += val * 0.22
            right_channel[idx + delay_samps] += val * 0.28

# 5. MASTERING LIMITER & SOFT CLIPPER
print("Mastering & soft clipping...")
out_wav_path = "/app/applet/assets/goteborg_theme.wav"
out_mp3_path = "/app/applet/assets/goteborg_custom.mp3"

max_val = 0.0
for i in range(num_samples):
    max_val = max(max_val, abs(left_channel[i]), abs(right_channel[i]))

gain = 0.92 / max(0.001, max_val)
print(f"Peak amplitude: {max_val:.2f}, Normalizing gain: {gain:.2f}")

with wave.open(out_wav_path, 'wb') as wav_file:
    wav_file.setnchannels(2)
    wav_file.setsampwidth(2) # 16-bit
    wav_file.setframerate(SAMPLE_RATE)
    
    frames = bytearray()
    for i in range(num_samples):
        # Soft tanh saturation
        l = math.tanh(left_channel[i] * gain)
        r = math.tanh(right_channel[i] * gain)
        l_int = max(-32767, min(32767, int(l * 32767.0)))
        r_int = max(-32767, min(32767, int(r * 32767.0)))
        frames.extend(struct.pack('<hh', l_int, r_int))
    wav_file.writeframes(frames)

print(f"Wrote WAV: {out_wav_path} ({os.path.getsize(out_wav_path) / 1024 / 1024:.2f} MB)")

# Encode to MP3 via ffmpeg
try:
    cmd = ["ffmpeg", "-y", "-i", out_wav_path, "-b:a", "192k", out_mp3_path]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(f"Wrote MP3: {out_mp3_path} ({os.path.getsize(out_mp3_path) / 1024 / 1024:.2f} MB)")
except Exception as e:
    print("FFmpeg encoding error:", e)

print("Audio generation complete!")
