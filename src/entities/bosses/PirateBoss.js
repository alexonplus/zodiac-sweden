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
  }

  update(enemyProjectiles, onShake) {
    if (!this.updateBase(enemyProjectiles, onShake)) return;

    if (this.teleportCooldown > 0) this.teleportCooldown--;

    if (this.attackTimer <= 0) {
      this.attackTimer = this.phase === 2 ? 55 : 85;
      this.executeAttack(enemyProjectiles, onShake);
    }
  }

  executeAttack(enemyProjectiles, onShake) {
    sound.playPoison();
    if (onShake) onShake(14);
    this.telegraphTimer = 25;

    if (this.phase === 1) {
      // 3 Cursed Ghost Cannonballs
      for (let i = 0; i < 3; i++) {
        enemyProjectiles.push({
          x: this.x - 30,
          y: this.y + 30 + i * 40,
          vx: -7.5 - i * 1.2,
          vy: (Math.random() - 0.5) * 2.5,
          color: '#a855f7',
          damage: 24,
          life: 85
        });
      }
      particles.createSparks(this.x - 20, this.y + 50, '#a855f7', 25);
    } else {
      // Phase 2: Ghost Fleet Broadside + Spectral Phantom Blades!
      sound.playUlt();
      if (onShake) onShake(20);

      for (let i = 0; i < 6; i++) {
        enemyProjectiles.push({
          x: this.x - 30,
          y: this.y + 20 + i * 25,
          vx: -8.5 - Math.random() * 2,
          vy: (i - 2.5) * 2.0,
          color: '#c084fc',
          damage: 28,
          life: 90
        });
      }

      // Spectral Ghost Wave on Ground
      enemyProjectiles.push({
        x: this.x - 40,
        y: 470,
        vx: -8.0,
        vy: 0,
        color: '#38bdf8',
        damage: 30,
        life: 80,
        isGroundWave: true
      });

      particles.createSparks(this.x - 20, this.y + 60, '#c084fc', 40);
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
