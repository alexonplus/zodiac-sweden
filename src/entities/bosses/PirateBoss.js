import { BaseBoss } from './BaseBoss.js';
import { sound } from '../../engine/Audio.js';
import { particles } from '../../engine/Particles.js';

/**
 * Valdemar Spöksjörövare: Cursed Phantom Corsair Captain of Visby Ruined Keep.
 * Features broadside cursed cannons, spectral teleportation, shadow blade slashes,
 * and summonings from the ghost armada.
 */
export class PirateBoss extends BaseBoss {
  constructor(x, y, maxHp = 980) {
    super(x, y, 'VALDEMAR SPÖKSJÖRÖVARE', maxHp, '⚔️', 135, 165);
    this.type = 'pirate_boss';
    this.teleportCooldown = 0;
    this.attackPattern = 0;
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

    if (this.teleportCooldown > 0) this.teleportCooldown--;

    // Spectral Teleportation when player gets too far or during Phase 2
    if (this.teleportCooldown <= 0 && this.targetPlayer) {
      const dist = Math.abs(this.targetPlayer.x - (this.x + this.w / 2));
      if (dist > 450 || (this.phase === 2 && Math.random() < 0.02)) {
        this.teleportCooldown = this.phase === 2 ? 90 : 160;
        sound.playLaser();
        particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#a855f7', 25);

        // Blinks behind the player
        this.x = this.targetPlayer.x + (this.targetPlayer.facing > 0 ? -120 : 120);
        this.y = 490 - this.h;
        this.facing = this.targetPlayer.x < this.x ? -1 : 1;
        particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#c084fc', 30);
      }
    }

    // Walking approach
    if (this.isGrounded && this.targetPlayer) {
      const dist = Math.abs(this.targetPlayer.x - (this.x + this.w / 2));
      if (dist > 140) {
        this.vx = this.facing * (this.phase === 2 ? 3.2 : 2.2);
      } else {
        this.vx *= 0.82;
      }
    }

    this.applyGravityAndPlatforms(platforms);

    if (this.attackTimer <= 0) {
      this.attackTimer = this.phase === 2 ? 50 : 75;
      this.executeAttack(enemyProjectiles, onShake);
    }
  }

  executeAttack(enemyProjectiles, onShake) {
    this.attackPattern = (this.attackPattern + 1) % 3;
    this.telegraphTimer = 22;

    if (this.attackPattern === 0) {
      // Attack 1: Cursed Phantom Cannonball Volley
      sound.playPoison();
      if (onShake) onShake(12);
      particles.createSparks(this.x + (this.facing > 0 ? this.w : 0), this.y + 50, '#a855f7', 25);

      const count = this.phase === 2 ? 5 : 3;
      for (let i = 0; i < count; i++) {
        enemyProjectiles.push({
          x: this.x + (this.facing > 0 ? this.w + 10 : -20),
          y: this.y + 30 + i * 25,
          vx: this.facing * (7.5 + i * 0.8),
          vy: (i - (count - 1) / 2) * 1.5,
          color: '#a855f7',
          damage: 24,
          life: 85
        });
      }
    } else if (this.attackPattern === 1) {
      // Attack 2: Swift Cutlass Ghost Dash & Wave
      sound.playHammer();
      if (onShake) onShake(16);
      this.vx = this.facing * 8.5; // Quick dash!
      particles.createTrail(this.x, this.y, this.w, this.h, '#a855f7');

      // Spectral Ghost Wave on Ground
      enemyProjectiles.push({
        x: this.x + (this.facing > 0 ? this.w : -30),
        y: 470,
        vx: this.facing * 8.5,
        vy: 0,
        color: '#c084fc',
        damage: 28,
        life: 80,
        isGroundWave: true
      });
    } else {
      // Attack 3: Telegraphed Ghost Anchor Smash
      sound.playWave();
      const anchorX = this.targetPlayer ? this.targetPlayer.x - 30 : this.x + this.facing * 180;
      this.addTelegraphZone(anchorX, 420, 70, 70, 26, '#a855f7', () => {
        sound.playHammer();
        if (onShake) onShake(22);
        particles.createSparks(anchorX + 35, 470, '#c084fc', 35);
        particles.createEarthDebris(anchorX + 35, 470, 20);

        // Crushing impact damage
        enemyProjectiles.push({
          x: anchorX + 35,
          y: 450,
          vx: 0,
          vy: 6,
          color: '#a855f7',
          damage: 36,
          life: 40
        });
      });
    }
  }

  draw(ctx) {
    this.drawTelegraph(ctx);

    ctx.save();
    const floatBob = Math.sin(this.animTimer * 2.5) * 9;
    const ghostCol = this.phase === 2 ? '#ef4444' : '#a855f7';

    ctx.translate(this.x, this.y + floatBob);

    if (this.stunTimer > 0 && Math.floor(this.stunTimer / 4) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Ghost Ship Stern Platform
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(20, 120, 95, 30);
    ctx.fillStyle = ghostCol;
    ctx.fillRect(25, 140, 85, 6);

    // Spectral Pirate Captain Body & Coat
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(30, 30, 75, 90);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(40, 40, 55, 70);

    // Glowing Ghost Skull Head & Cyan Eye Sockets
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(45, -10, 42, 40);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 14;
    ctx.fillRect(52, 2, 8, 8);
    ctx.fillRect(71, 2, 8, 8);
    ctx.shadowBlur = 0;

    // Massive Pirate Tricorn Hat with Gold Badge
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(15, -24, 100, 15);
    ctx.fillRect(32, -36, 66, 14);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(60, -28, 12, 12);

    // Dual Ghost Cannons
    ctx.fillStyle = '#475569';
    ctx.fillRect(-18, 60, 48, 18);
    ctx.fillStyle = ghostCol;
    ctx.fillRect(-26, 56, 12, 26);

    // Spectral Cutlass
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(105, 30, 32, 6);
    ctx.fillRect(105, 25, 6, 16);

    ctx.restore();
  }
}
