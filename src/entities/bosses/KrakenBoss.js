import { BaseBoss } from './BaseBoss.js';
import { sound } from '../../engine/Audio.js';
import { particles } from '../../engine/Particles.js';

/**
 * Mekanisk Kran-Kraken: The Gothenburg Heavy Harbor Gantry Abomination.
 * Features articulated hydraulic crane tentacles, multi-directional ion bursts,
 * orbital lightning strikes, and ground laser sweeps.
 */
export class KrakenBoss extends BaseBoss {
  constructor(x, y, maxHp = 900) {
    super(x, y, 'MEKANISK KRAN-KRAKEN', maxHp, '🐙', 140, 165);
    this.type = 'kraken';
    this.tentacleAngles = [0, 0, 0, 0];
    this.baseY = y;
    this.attackPattern = 0;
  }

  update(arg1, arg2, arg3, arg4, arg5, arg6) {
    if (!this.updateBase(arg1, arg2, arg3, arg4, arg5, arg6)) return;

    let enemyProjectiles, onShake;
    if (Array.isArray(arg1)) {
      enemyProjectiles = arg1;
      onShake = arg2;
    } else {
      enemyProjectiles = arg4;
      onShake = arg6;
    }

    // Floating hydraulic hover motion
    this.y = this.baseY + Math.sin(this.animTimer * 2.5) * 18;

    // Repositioning AI: Glide back and forth to maintain optimal combat distance
    if (this.targetPlayer) {
      const targetDist = Math.abs(this.targetPlayer.x - (this.x + this.w / 2));
      const moveSpeed = this.phase === 2 ? 3.2 : 2.0;

      if (targetDist > 380) {
        // Close in towards player
        this.vx = this.facing * moveSpeed;
      } else if (targetDist < 160) {
        // Back off to range
        this.vx = -this.facing * moveSpeed * 1.2;
      } else {
        // Drift slowly
        this.vx *= 0.92;
      }
    }

    this.x += this.vx;
    // Keep in arena bounds
    if (this.x < this.arenaMinX) this.x = this.arenaMinX;
    if (this.x + this.w > this.arenaMaxX) this.x = this.arenaMaxX - this.w;

    if (this.attackTimer <= 0) {
      this.attackTimer = this.phase === 2 ? 45 : 70;
      this.executeAttack(enemyProjectiles, onShake);
    }
  }

  executeAttack(enemyProjectiles, onShake) {
    this.attackPattern = (this.attackPattern + 1) % 3;
    this.telegraphTimer = 22;

    if (this.attackPattern === 0) {
      // Attack 1: Targeted Ion Plasma Quad-Burst directed at player!
      sound.playLaser();
      if (onShake) onShake(10);
      particles.createSparks(this.x + (this.facing > 0 ? this.w : 0), this.y + 70, '#00f0ff', 25);

      const targetX = this.targetPlayer ? this.targetPlayer.x + this.targetPlayer.w / 2 : this.x + this.facing * 300;
      const targetY = this.targetPlayer ? this.targetPlayer.y + this.targetPlayer.h / 2 : this.y + 80;
      const dx = targetX - (this.x + this.w / 2);
      const dy = targetY - (this.y + 70);
      const baseAngle = Math.atan2(dy, dx);

      const count = this.phase === 2 ? 6 : 4;
      for (let i = 0; i < count; i++) {
        const spread = (i - (count - 1) / 2) * 0.16;
        const angle = baseAngle + spread;
        const spd = this.phase === 2 ? 8.5 : 7.0;
        enemyProjectiles.push({
          x: this.x + (this.facing > 0 ? this.w + 10 : -10),
          y: this.y + 70,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color: this.phase === 2 ? '#ef4444' : '#00f0ff',
          damage: this.phase === 2 ? 26 : 20,
          life: 85
        });
      }
    } else if (this.attackPattern === 1) {
      // Attack 2: Hydraulic Tentacle Ground Slam & Shockwave
      sound.playHammer();
      if (onShake) onShake(16);
      const slamX = this.x + (this.facing > 0 ? this.w + 30 : -50);
      particles.createEarthDebris(slamX, 470, 15);
      particles.createSparks(slamX, 470, '#00f0ff', 20);

      // Left & Right Ground Shockwaves
      enemyProjectiles.push({
        x: slamX,
        y: 468,
        vx: this.facing * 7.5,
        vy: 0,
        color: '#00f0ff',
        damage: 24,
        life: 75,
        isGroundWave: true
      });
      if (this.phase === 2) {
        enemyProjectiles.push({
          x: slamX,
          y: 468,
          vx: -this.facing * 7.0,
          vy: 0,
          color: '#ef4444',
          damage: 24,
          life: 75,
          isGroundWave: true
        });
      }
    } else {
      // Attack 3: Telegraphed Orbital Harbor Lightning Strike!
      sound.playWave();
      const strikeX = this.targetPlayer ? this.targetPlayer.x - 20 : this.x - 200;
      const strikeW = 75;

      // Add visual telegraph danger zone on the ground!
      this.addTelegraphZone(strikeX, 100, strikeW, 380, 28, '#facc15', () => {
        sound.playLightning();
        if (onShake) onShake(22);
        particles.createSparks(strikeX + strikeW / 2, 460, '#facc15', 35);
        particles.createFlame(strikeX + strikeW / 2, 460, 15);

        // Lightning bolt projectile striking straight down
        enemyProjectiles.push({
          x: strikeX + strikeW / 2,
          y: 80,
          vx: 0,
          vy: 14,
          color: '#fde047',
          damage: 34,
          life: 55
        });
      });
    }
  }

  draw(ctx) {
    this.drawTelegraph(ctx);

    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.stunTimer > 0 && Math.floor(this.stunTimer / 4) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    const eyeGlow = this.phase === 2 ? '#ef4444' : '#00f0ff';

    // 4 Articulated Mechanical Crane Tentacles
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 9;
    for (let i = 0; i < 4; i++) {
      const startY = 40 + i * 28;
      const wave = Math.sin(this.animTimer * 2.2 + i) * (this.phase === 2 ? 28 : 20);
      ctx.beginPath();
      ctx.moveTo(20, startY);
      ctx.quadraticCurveTo(-60 - i * 15, startY + wave, -115 - i * 12, startY + wave * 0.5);
      ctx.stroke();

      // Hydraulic Claw Tips
      ctx.fillStyle = eyeGlow;
      ctx.fillRect(-122 - i * 12, startY + wave * 0.5 - 7, 14, 14);
    }

    // Heavy Industrial Chassis Body
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 20, 110, 135);
    ctx.fillStyle = this.phase === 2 ? '#991b1b' : '#0284c7';
    ctx.fillRect(30, 30, 90, 115);

    // Hazard Stripes
    ctx.fillStyle = '#facc15';
    for (let y = 35; y < 135; y += 22) {
      ctx.fillRect(30, y, 90, 9);
    }

    // Glowing Neon Visor / Eye Array
    ctx.fillStyle = eyeGlow;
    ctx.shadowColor = eyeGlow;
    ctx.shadowBlur = 20;
    ctx.fillRect(40, 55, 70, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 60, 30, 10);
    ctx.shadowBlur = 0;

    // Top Crane Tower & Warning Beacon
    ctx.fillStyle = '#64748b';
    ctx.fillRect(60, -12, 30, 32);
    ctx.fillStyle = eyeGlow;
    ctx.beginPath();
    ctx.arc(75, -14, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
