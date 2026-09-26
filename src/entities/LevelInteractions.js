import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';
import { checkRectCollision } from '../engine/Physics.js';
import { relicManager } from './Relics.js';
import { buffManager } from './Powerups.js';
import { shopManager } from './Shop.js';

/**
 * LevelInteractionsManager handles dynamic, sector-specific interactive level elements:
 * - 🪨 Ancient Gotland Runestones (Runstenar): Interactive Viking monoliths granting blessings & star shards
 * - ☕ Checkpoint Swedish Fika Bakery: Cozy refreshment stop granting HP & Fika haste buff
 * - ❄️ Sub-Zero Falling Icicles (Kiruna): Dynamic environmental hazards that drop when passing beneath
 * - 💨 Industrial Steam Updraft Vents (Göteborg): Launch players to high secret catwalks
 * - ⚙️ Royal Clockwork Pendulum Blades (Stockholm): Rhythmic oscillating clockwork hazards
 */
export class LevelInteractionsManager {
  constructor() {
    this.runestones = [];
    this.fikaCafes = [];
    this.icicles = [];
    this.steamVents = [];
    this.pendulums = [];
  }

  populateForLevel(levelId, levelWidth) {
    this.clear();
    const groundY = 490;

    // 1. Checkpoint Swedish Fika Bakery at Sector 4 (x = 4500)
    this.fikaCafes.push({
      x: 4420,
      y: groundY - 110,
      w: 160,
      h: 110,
      used: false,
      steamTimer: 0
    });

    // 2. Level-Specific Interactive Mechanics
    if (levelId === 'visby') {
      // Ancient Gotland Runestones (UNESCO World Heritage Runic Monoliths)
      const stoneXs = [1100, 3700, 6900, 9300];
      for (const sx of stoneXs) {
        this.runestones.push({
          x: sx,
          y: groundY - 80,
          w: 48,
          h: 80,
          active: false,
          glowAnim: 0,
          runeText: 'ᚠᚢᚦᚨᚱᚲ'
        });
      }
    } else if (levelId === 'kiruna') {
      // Sub-Zero Falling Icicles hanging from upper mine & cave platforms
      const iciclePositions = [
        { x: 1980, y: 290 },
        { x: 3480, y: 280 },
        { x: 4150, y: 290 },
        { x: 6480, y: 310 },
        { x: 7950, y: 310 },
        { x: 9500, y: 300 }
      ];
      for (const pos of iciclePositions) {
        this.icicles.push({
          x: pos.x,
          y: pos.y,
          w: 18,
          h: 36,
          vy: 0,
          isFalling: false,
          shakeTimer: 0,
          isShattered: false
        });
      }
    } else if (levelId === 'goteborg' || levelId.startsWith('goteborg')) {
      // High-Pressure Steam Updraft Vents at shipyard docks
      const ventXs = levelWidth > 5000 ? [1900, 4800, 7850, 9400] : [1800];
      for (const vx of ventXs) {
        if (vx < levelWidth - 300) {
          this.steamVents.push({
            x: vx,
            y: groundY - 10,
            w: 44,
            h: 12,
            cycleTimer: Math.random() * 200,
            isActive: false
          });
        }
      }
    } else if (levelId === 'stockholm') {
      // Steampunk Clockwork Pendulum Blades swinging from royal arches
      const pendulumPositions = [
        { x: 3350, y: 250, length: 110, phase: 0 },
        { x: 6350, y: 240, length: 120, phase: Math.PI / 2 },
        { x: 9400, y: 250, length: 110, phase: Math.PI }
      ];
      for (const p of pendulumPositions) {
        this.pendulums.push({
          anchorX: p.x,
          anchorY: p.y,
          length: p.length,
          angle: 0,
          speed: 0.038,
          phase: p.phase,
          bladeW: 36,
          bladeH: 18
        });
      }
    }
  }

  update(player1, player2, isCoop, onShake, onDefeat, gameTime) {
    const players = [player1];
    if (isCoop && player2 && player2.hp > 0) players.push(player2);

    // 1. UPDATE FIKA CHECKPOINT BAKERY
    for (const cafe of this.fikaCafes) {
      cafe.steamTimer += 0.08;
      for (const p of players) {
        if (!cafe.used && p.hp > 0 && Math.hypot((p.x + p.w / 2) - (cafe.x + cafe.w / 2), (p.y + p.h / 2) - (cafe.y + cafe.h / 2)) < 90) {
          cafe.used = true;
          sound.playSynergy();
          p.hp = Math.min(p.maxHp, p.hp + 50);
          p.energy = p.maxEnergy;
          buffManager.applyBuff(p.pIndex, 'fika');
          particles.createDamageNumber(cafe.x + cafe.w / 2, cafe.y - 30, '☕ NORDIC FIKA CHECKPOINT! +50 HP 🥐', '#fb923c');
          particles.createSparks(cafe.x + cafe.w / 2, cafe.y + cafe.h / 2, '#fb923c', 30);
          // Drop bonus Kanelbullar & Star Shards
          relicManager.spawn(cafe.x + 30, cafe.y + 70, 'kanelbulle');
          relicManager.spawn(cafe.x + 110, cafe.y + 70, 'shard');
        }
      }
    }

    // 2. UPDATE GOTLAND RUNESTONES
    for (const rune of this.runestones) {
      if (rune.active) {
        rune.glowAnim += 0.05;
        continue;
      }
      for (const p of players) {
        if (p.hp > 0 && Math.hypot((p.x + p.w / 2) - (rune.x + rune.w / 2), (p.y + p.h / 2) - (rune.y + rune.h / 2)) < 65) {
          rune.active = true;
          sound.playSynergy();
          p.energy = p.maxEnergy;
          p.hp = Math.min(p.maxHp, p.hp + 25);
          shopManager.addShards(20);
          particles.createDamageNumber(rune.x + rune.w / 2, rune.y - 25, 'ᚱ RUNIC BLESSING! +20 SHARDS ⭐', '#c084fc');
          particles.createSparks(rune.x + rune.w / 2, rune.y + rune.h / 2, '#a855f7', 40);
          // Spawn lucky loot
          relicManager.spawn(rune.x + 20, rune.y + 20, 'shard');
          relicManager.spawn(rune.x + 35, rune.y + 20, 'meatball');
          break;
        }
      }
    }

    // 3. UPDATE SUB-ZERO FALLING ICICLES
    for (let i = this.icicles.length - 1; i >= 0; i--) {
      const icicle = this.icicles[i];
      if (icicle.isShattered) continue;

      if (!icicle.isFalling) {
        // Check if a player walks beneath within 75px horizontally
        for (const p of players) {
          if (p.hp > 0 && Math.abs((p.x + p.w / 2) - (icicle.x + icicle.w / 2)) < 70 && p.y > icicle.y) {
            icicle.shakeTimer++;
            if (icicle.shakeTimer === 1) sound.playLaser();
            if (icicle.shakeTimer > 18) {
              icicle.isFalling = true;
              sound.playLaser();
            }
            break;
          }
        }
      } else {
        // Icicle plunges with gravity
        icicle.vy += 0.7;
        icicle.y += icicle.vy;

        // Hit player check
        for (const p of players) {
          if (p.hp > 0 && checkRectCollision(icicle, p)) {
            p.takeDamage(18, onDefeat, onShake);
            particles.createDamageNumber(p.x + p.w / 2, p.y - 15, 'ICICLE IMPACT! -18 ❄️', '#38bdf8');
            icicle.isShattered = true;
            sound.playHit();
            particles.createSparks(icicle.x + icicle.w / 2, icicle.y + icicle.h, '#38bdf8', 20);
            break;
          }
        }

        // Ground or pit impact
        if (icicle.y > 490) {
          icicle.isShattered = true;
          sound.playHit();
          particles.createSparks(icicle.x + icicle.w / 2, 490, '#38bdf8', 15);
        }
      }
    }

    // 4. UPDATE INDUSTRIAL STEAM UPDRAFT VENTS
    for (const vent of this.steamVents) {
      vent.cycleTimer = (vent.cycleTimer + 1) % 220;
      vent.isActive = vent.cycleTimer > 130 && vent.cycleTimer < 190;

      if (vent.isActive) {
        if (vent.cycleTimer === 131) sound.playLaser();
        // Vent steam particles
        if (Math.random() < 0.6) {
          particles.createSparks(vent.x + vent.w / 2 + (Math.random() - 0.5) * 20, vent.y - Math.random() * 80, '#e2e8f0', 2);
        }

        // Check if player is standing on steam vent: LAUNCH upward!
        for (const p of players) {
          if (p.hp > 0 && p.x + p.w > vent.x && p.x < vent.x + vent.w && p.y + p.h >= vent.y - 30 && p.y + p.h <= vent.y + 15) {
            p.vy = -14.5;
            p.isGrounded = false;
            sound.playLaser();
            particles.createDamageNumber(p.x + p.w / 2, p.y - 20, 'STEAM LAUNCH! 💨', '#38bdf8');
            particles.createSparks(p.x + p.w / 2, vent.y, '#e2e8f0', 25);
          }
        }
      }
    }

    // 5. UPDATE ROYAL CLOCKWORK PENDULUM BLADES
    for (const pnd of this.pendulums) {
      pnd.angle = Math.sin(gameTime * pnd.speed + pnd.phase) * (Math.PI * 0.42);
      const bladeX = pnd.anchorX + Math.sin(pnd.angle) * pnd.length;
      const bladeY = pnd.anchorY + Math.cos(pnd.angle) * pnd.length;

      // Check collision with player
      const bladeHitBox = { x: bladeX - pnd.bladeW / 2, y: bladeY - pnd.bladeH / 2, w: pnd.bladeW, h: pnd.bladeH };
      for (const p of players) {
        if (p.hp > 0 && p.invulnTime <= 0 && checkRectCollision(bladeHitBox, p)) {
          p.takeDamage(24, onDefeat, onShake);
          particles.createDamageNumber(p.x + p.w / 2, p.y - 15, 'PENDULUM STRIKE! -24 ⚙️', '#facc15');
          particles.createSparks(bladeX, bladeY, '#facc15', 20);
        }
      }
    }
  }

  // Hit test against destructible falling icicles using attack hitboxes
  hitIciclesWithAttack(hitBox) {
    for (const icicle of this.icicles) {
      if (!icicle.isShattered && checkRectCollision(hitBox, icicle)) {
        icicle.isShattered = true;
        sound.playHit();
        particles.createSparks(icicle.x + icicle.w / 2, icicle.y + icicle.h / 2, '#38bdf8', 25);
        particles.createDamageNumber(icicle.x + icicle.w / 2, icicle.y - 10, 'SHATTERED! +50 ⭐', '#38bdf8');
        shopManager.addShards(5);
      }
    }
  }

  draw(ctx, camera) {
    // 1. Draw Fika Checkpoint Bakery
    for (const cafe of this.fikaCafes) {
      if (!camera.isVisible(cafe.x, cafe.w)) continue;
      this.drawFikaCafe(ctx, cafe);
    }

    // 2. Draw Gotland Ancient Runestones
    for (const rune of this.runestones) {
      if (!camera.isVisible(rune.x, rune.w)) continue;
      this.drawRunestone(ctx, rune);
    }

    // 3. Draw Sub-Zero Falling Icicles
    for (const icicle of this.icicles) {
      if (icicle.isShattered || !camera.isVisible(icicle.x, icicle.w)) continue;
      this.drawIcicle(ctx, icicle);
    }

    // 4. Draw Industrial Steam Updraft Vents
    for (const vent of this.steamVents) {
      if (!camera.isVisible(vent.x, vent.w)) continue;
      this.drawSteamVent(ctx, vent);
    }

    // 5. Draw Royal Clockwork Pendulum Blades
    for (const pnd of this.pendulums) {
      if (!camera.isVisible(pnd.anchorX - pnd.length, pnd.length * 2)) continue;
      this.drawPendulum(ctx, pnd);
    }
  }

  /* ---------------- DRAW METHODS ---------------- */

  drawFikaCafe(ctx, cafe) {
    ctx.save();
    ctx.translate(cafe.x, cafe.y);

    // Red Falun Wooden Cottage Stall Body
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(0, 20, cafe.w, cafe.h - 20);

    // White Corner Trim
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 20, 6, cafe.h - 20);
    ctx.fillRect(cafe.w - 6, 20, 6, cafe.h - 20);

    // Striped Awning (Swedish Gold & Blue)
    const stripeW = cafe.w / 6;
    for (let s = 0; s < 6; s++) {
      ctx.fillStyle = s % 2 === 0 ? '#0284c7' : '#facc15';
      ctx.fillRect(s * stripeW, 10, stripeW, 16);
    }

    // Neon Cafe Sign
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 32, cafe.w - 32, 22);
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#fb923c';
    ctx.shadowBlur = 8;
    ctx.strokeRect(16, 32, cafe.w - 32, 22);
    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('☕ KAFÉ FIKA CHECKPOINT', 22, 47);
    ctx.shadowBlur = 0;

    // Counter with Steaming Cinnamon Bun & Coffee Pot
    ctx.fillStyle = '#92400e';
    ctx.fillRect(20, 72, cafe.w - 40, 12);
    ctx.font = '16px monospace';
    ctx.fillText('🥐 ☕', cafe.w / 2 - 18, 70);

    // Animated Steam rising from Coffee Cup
    const steamY = Math.sin(cafe.steamTimer) * 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(cafe.w / 2 + 10, 52 + steamY, 4, 0, Math.PI * 2);
    ctx.arc(cafe.w / 2 + 12, 42 + steamY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Status Indicator
    if (!cafe.used) {
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('⭐ STEP NEAR FOR +50 HP & FIKA!', 10, 102);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('✓ FIKA REFRESHED', 35, 102);
    }

    ctx.restore();
  }

  drawRunestone(ctx, rune) {
    ctx.save();
    ctx.translate(rune.x, rune.y);

    // Weathered Gotland Granite Stone (Curved Nordic Monolith)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(8, rune.h);
    ctx.lineTo(2, 28);
    ctx.quadraticCurveTo(rune.w / 2, -6, rune.w - 2, 28);
    ctx.lineTo(rune.w - 8, rune.h);
    ctx.closePath();
    ctx.fill();

    // Runic Serpent Knot (Ouroboros Border)
    ctx.strokeStyle = rune.active ? '#c084fc' : '#64748b';
    ctx.lineWidth = 2;
    if (rune.active) {
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 12;
    }
    ctx.stroke();

    // Inscribed Elder Futhark Runes
    ctx.fillStyle = rune.active ? '#f0abfc' : '#94a3b8';
    ctx.font = 'bold 11px serif';
    ctx.fillText(rune.runeText, 6, 42);

    // Active Runic Aura Pulsing
    if (rune.active) {
      const aura = Math.sin(rune.glowAnim) * 4;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.beginPath();
      ctx.arc(rune.w / 2, rune.h / 2, 28 + aura, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#e9d5ff';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('PRAY [NEAR]', 0, -10);
    }

    ctx.restore();
  }

  drawIcicle(ctx, icicle) {
    ctx.save();
    ctx.translate(icicle.x, icicle.y);
    if (icicle.shakeTimer > 0 && !icicle.isFalling) {
      ctx.translate((Math.random() - 0.5) * 4, 0);
    }

    // Translucent Glacial Ice Spike
    ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(icicle.w, 0);
    ctx.lineTo(icicle.w / 2, icicle.h);
    ctx.closePath();
    ctx.fill();

    // Crystalline Highlight Ridge
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(icicle.w / 2, 0);
    ctx.lineTo(icicle.w / 2, icicle.h);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  drawSteamVent(ctx, vent) {
    ctx.save();
    ctx.translate(vent.x, vent.y);

    // Industrial Steel Grate
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, vent.w, vent.h);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, vent.w, vent.h);

    // Grate Slits
    ctx.fillStyle = '#0f172a';
    for (let gx = 6; gx < vent.w - 6; gx += 8) {
      ctx.fillRect(gx, 2, 4, vent.h - 4);
    }

    // Vertical Jet of High-Pressure Steam
    if (vent.isActive) {
      const grad = ctx.createLinearGradient(0, vent.h, 0, -180);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      grad.addColorStop(0.6, 'rgba(224, 242, 254, 0.35)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(4, -180, vent.w - 8, 180);

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('▲ UPDRAFT ▲', -8, -190);
    }

    ctx.restore();
  }

  drawPendulum(ctx, pnd) {
    ctx.save();
    ctx.translate(pnd.anchorX, pnd.anchorY);

    // Brass Pivot Mount
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Rotating Pendulum Arm
    ctx.rotate(pnd.angle);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, pnd.length);
    ctx.stroke();

    // Curved Golden Crescent Blade
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, pnd.length, 18, 0, Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Center Brass Stud
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, pnd.length, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  clear() {
    this.runestones.length = 0;
    this.fikaCafes.length = 0;
    this.icicles.length = 0;
    this.steamVents.length = 0;
    this.pendulums.length = 0;
  }
}

export const levelInteractionsManager = new LevelInteractionsManager();
