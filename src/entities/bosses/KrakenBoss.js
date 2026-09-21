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
  }

  update(enemyProjectiles, onShake) {
    if (!this.updateBase(enemyProjectiles, onShake)) return;

    if (this.attackTimer <= 0) {
      this.attackTimer = this.phase === 2 ? 60 : 90;
      this.executeAttack(enemyProjectiles, onShake);
    }
  }

  executeAttack(enemyProjectiles, onShake) {
    sound.playWave();
    if (onShake) onShake(14);
    this.telegraphTimer = 25;

    if (this.phase === 1) {
      // 4-Way Hydraulic Laser Shot
      for (let i = 0; i < 4; i++) {
        enemyProjectiles.push({
          x: this.x - 20,
          y: this.y + 35 + i * 26,
          vx: -6.5 - Math.random() * 2,
          vy: (i - 1.5) * 1.5,
          color: '#00f0ff',
          damage: 22,
          life: 90
        });
      }
      particles.createSparks(this.x, this.y + 80, '#00f0ff', 25);
    } else {
      // Phase 2: Overdrive Radial Spark Storm + Orbital Harbor Lightning Strikes!
      sound.playLaser();
      const count = 8;
      for (let i = 0; i < count; i++) {
        const angle = -0.8 + (i / (count - 1)) * 1.6;
        enemyProjectiles.push({
          x: this.x - 25,
          y: this.y + 70,
          vx: Math.cos(Math.PI - angle) * 7.5,
          vy: Math.sin(angle) * 7.5,
          color: '#ef4444',
          damage: 26,
          life: 90
        });
      }

      // Orbital lightning strike near player location
      enemyProjectiles.push({
        x: this.x - 250 - Math.random() * 300,
        y: 80,
        vx: 0,
        vy: 11,
        color: '#facc15',
        damage: 32,
        life: 65
      });

      particles.createSparks(this.x, this.y + 80, '#ef4444', 40);
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
