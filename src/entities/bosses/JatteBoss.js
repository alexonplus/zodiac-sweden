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
    this.attackPattern = 0;
    this.stepTimer = 0;
  }

  update(arg1, arg2, arg3, arg4, arg5, arg6) {
    if (!this.updateBase(arg1, arg2, arg3, arg4, arg5, arg6)) return;

    let enemyProjectiles, platforms, onShake;
    if (Array.isArray(arg1)) {
      enemyProjectiles = arg1;
      onShake = arg2;
      platforms = [];
    } else {
      enemyProjectiles = arg4;
      platforms = arg5 || [];
      onShake = arg6;
    }

    // Heavy Stomping Movement
    if (this.isGrounded && this.targetPlayer) {
      const dist = Math.abs(this.targetPlayer.x - (this.x + this.w / 2));
      const spd = this.phase === 2 ? 2.5 : 1.6;

      if (dist > 180) {
        this.vx = this.facing * spd;
        this.stepTimer++;
        if (this.stepTimer % 28 === 0) {
          sound.playHammer();
          if (onShake) onShake(4);
          particles.createEarthDebris(this.x + this.w / 2, this.y + this.h, 6);
        }
      } else {
        this.vx *= 0.85;
      }
    }

    this.applyGravityAndPlatforms(platforms);

    if (this.attackTimer <= 0) {
      this.attackTimer = this.phase === 2 ? 55 : 85;
      this.executeAttack(enemyProjectiles, onShake);
    }
  }

  executeAttack(enemyProjectiles, onShake) {
    this.attackPattern = (this.attackPattern + 1) % 3;
    this.telegraphTimer = 25;

    if (this.attackPattern === 0) {
      // Attack 1: Seismic Leap Ground Pound!
      sound.playRoar();
      this.vy = -12; // Leaps into air!
      this.vx = this.facing * (this.phase === 2 ? 6.5 : 4.5);

      const checkLanding = setInterval(() => {
        if (this.isGrounded) {
          clearInterval(checkLanding);
          sound.playEarthQuake();
          if (onShake) onShake(25);
          particles.createEarthDebris(this.x + this.w / 2, this.y + this.h, 30);
          particles.createSparks(this.x + this.w / 2, this.y + this.h, '#ea580c', 25);

          // Left & Right Ground Quake Waves
          enemyProjectiles.push({
            x: this.x + this.w / 2,
            y: this.y + this.h - 10,
            vx: -8.0,
            vy: 0,
            color: '#ea580c',
            damage: 28,
            life: 80,
            isGroundWave: true
          });
          enemyProjectiles.push({
            x: this.x + this.w / 2,
            y: this.y + this.h - 10,
            vx: 8.0,
            vy: 0,
            color: '#ea580c',
            damage: 28,
            life: 80,
            isGroundWave: true
          });
        }
      }, 50);
    } else if (this.attackPattern === 1) {
      // Attack 2: Massive Rolling Iron Ore Boulder!
      sound.playHammer();
      if (onShake) onShake(14);
      const boulderX = this.x + (this.facing > 0 ? this.w + 10 : -40);
      particles.createEarthDebris(boulderX, this.y + this.h - 20, 20);

      enemyProjectiles.push({
        x: boulderX,
        y: this.y + this.h - 20,
        vx: this.facing * (this.phase === 2 ? 9.5 : 7.5),
        vy: 0,
        color: this.phase === 2 ? '#f97316' : '#94a3b8',
        damage: this.phase === 2 ? 35 : 26,
        life: 90,
        isGroundWave: true
      });
    } else {
      // Attack 3: Telegraphed Glacial Stalactite / Magma Eruptions beneath player!
      sound.playWave();
      const targetX = this.targetPlayer ? this.targetPlayer.x - 30 : this.x - 180;
      const count = this.phase === 2 ? 3 : 2;

      for (let i = 0; i < count; i++) {
        const spotX = targetX + (i - (count - 1) / 2) * 120;
        this.addTelegraphZone(spotX, 440, 60, 50, 30, '#ea580c', () => {
          sound.playEarthQuake();
          if (onShake) onShake(16);
          particles.createFlame(spotX + 30, 480, 20);
          particles.createEarthDebris(spotX + 30, 480, 15);

          // Geyser projectile shooting upwards from ground
          enemyProjectiles.push({
            x: spotX + 30,
            y: 470,
            vx: 0,
            vy: -11,
            color: '#ea580c',
            damage: 32,
            life: 45
          });
        });
      }
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
