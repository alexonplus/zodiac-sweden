import { BaseBoss } from './BaseBoss.js';
import { sound } from '../../engine/Audio.js';
import { particles } from '../../engine/Particles.js';

/**
 * LKAB Malm-Jätte: Massive Iron Ore Titan of the Kiruna Arctic Mines.
 * Features ground quake stomps, rolling iron boulders, falling glacial stalactites,
 * and subterranean molten magma eruptions.
 */
export class JatteBoss extends BaseBoss {
  constructor(x, y, maxHp = 1000) {
    super(x, y, 'LKAB MALM-JÄTTE', maxHp, '❄️', 130, 175);
    this.type = 'golem_boss';
  }

  update(enemyProjectiles, onShake) {
    if (!this.updateBase(enemyProjectiles, onShake)) return;

    if (this.attackTimer <= 0) {
      this.attackTimer = this.phase === 2 ? 65 : 95;
      this.executeAttack(enemyProjectiles, onShake);
    }
  }

  executeAttack(enemyProjectiles, onShake) {
    sound.playHammer();
    if (onShake) onShake(18);
    this.telegraphTimer = 30;

    if (this.phase === 1) {
      // 1. Falling Glacial Stalactites
      for (let i = 0; i < 4; i++) {
        enemyProjectiles.push({
          x: this.x - 180 - i * 130,
          y: 60,
          vx: 0,
          vy: 8.5 + Math.random() * 3,
          color: '#67e8f9',
          damage: 24,
          life: 85
        });
      }

      // Ground Quake Shockwave
      enemyProjectiles.push({
        x: this.x - 20,
        y: 470,
        vx: -7.5,
        vy: 0,
        color: '#ea580c',
        damage: 25,
        life: 80,
        isGroundWave: true
      });
    } else {
      // Phase 2: Molten Core Eruption & Heavy Rolling Ore Boulders!
      sound.playRoar();
      if (onShake) onShake(22);

      // Fast Rolling Heavy Boulder
      enemyProjectiles.push({
        x: this.x - 30,
        y: 460,
        vx: -9.5,
        vy: 0,
        color: '#f97316',
        damage: 35,
        life: 85,
        isGroundWave: true
      });

      // 6 Glacial Icicle Rain
      for (let i = 0; i < 6; i++) {
        enemyProjectiles.push({
          x: this.x - 80 - i * 110,
          y: 40,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 9.5 + Math.random() * 3,
          color: '#67e8f9',
          damage: 28,
          life: 80
        });
      }

      particles.createSparks(this.x + 30, 480, '#ea580c', 35);
    }
  }

  draw(ctx) {
    this.drawTelegraph(ctx);

    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.stunTimer > 0 && Math.floor(this.stunTimer / 4) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    const breath = Math.sin(this.animTimer * 1.8) * 4;
    const lavaCol = this.phase === 2 ? '#ef4444' : '#ea580c';

    // Massive Stone Legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 115, 45, 60);
    ctx.fillRect(75, 115, 45, 60);
    ctx.fillStyle = lavaCol;
    ctx.fillRect(20, 135, 25, 4);
    ctx.fillRect(85, 135, 25, 4);

    // Volcanic Stone Torso with Glowing Magma Cracks
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 20 - breath, 130, 105);
    ctx.fillStyle = '#334155';
    ctx.fillRect(10, 30 - breath, 110, 85);

    // Magma Cracks & Molten Core
    ctx.fillStyle = lavaCol;
    ctx.shadowColor = lavaCol;
    ctx.shadowBlur = 18;
    ctx.fillRect(30, 50 - breath, 70, 14);
    ctx.fillRect(50, 40 - breath, 30, 45);
    ctx.shadowBlur = 0;

    // Permafrost Ice Shoulder Spikes
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.moveTo(-15, 20 - breath);
    ctx.lineTo(15, 0 - breath);
    ctx.lineTo(15, 40 - breath);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(145, 20 - breath);
    ctx.lineTo(115, 0 - breath);
    ctx.lineTo(115, 40 - breath);
    ctx.closePath();
    ctx.fill();

    // Head with Glowing Furnace Eyes
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(40, -15 - breath, 50, 35);
    ctx.fillStyle = lavaCol;
    ctx.fillRect(48, -5 - breath, 12, 8);
    ctx.fillRect(70, -5 - breath, 12, 8);

    // Massive Boulder Fists
    ctx.fillStyle = '#475569';
    ctx.fillRect(-25, 60, 32, 48);
    ctx.fillRect(123, 60, 32, 48);

    ctx.restore();
  }
}
