import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';
import { checkRectCollision } from '../engine/Physics.js';
import { relicManager } from './Relics.js';

/**
 * Destructible interactive props across Swedish stages:
 * - Nordic Supply Crates (📦)
 * - Explosive Diesel Barrels (🛢️)
 * - Golden Zodiac Relic Chests (🎁)
 */
export class DestructibleManager {
  constructor() {
    this.props = [];
  }

  spawnCrate(x, y) {
    this.props.push({
      type: 'crate',
      x, y: y - 36,
      w: 36, h: 36,
      hp: 30, maxHp: 30,
      color: '#92400e'
    });
  }

  spawnBarrel(x, y) {
    this.props.push({
      type: 'barrel',
      x, y: y - 40,
      w: 32, h: 40,
      hp: 20, maxHp: 20,
      fuse: 0,
      color: '#ef4444'
    });
  }

  spawnChest(x, y) {
    this.props.push({
      type: 'chest',
      x, y: y - 38,
      w: 44, h: 38,
      hp: 50, maxHp: 50,
      color: '#facc15'
    });
  }

  populateForLevel(levelId, levelWidth) {
    this.props.length = 0;
    const groundY = 490;

    // Distribute crates, explosive barrels, and chests along the 6400px level
    for (let x = 380; x < levelWidth - 600; x += 320 + Math.floor(Math.random() * 200)) {
      const rand = Math.random();
      if (rand < 0.45) {
        this.spawnCrate(x, groundY);
      } else if (rand < 0.80) {
        this.spawnBarrel(x, groundY);
      } else {
        this.spawnChest(x, groundY);
      }
    }
  }

  update(enemies, onShake, onDamageEnemy) {
    for (let i = this.props.length - 1; i >= 0; i--) {
      const prop = this.props[i];

      // Fuse countdown for ignited barrels
      if (prop.fuse > 0) {
        prop.fuse--;
        if (prop.fuse % 6 === 0) sound.playLaser();
        particles.createSparks(prop.x + prop.w / 2, prop.y, '#f97316', 4);

        if (prop.fuse <= 0) {
          // Detonate explosive barrel
          this.explodeBarrel(prop, enemies, onShake, onDamageEnemy);
          this.props.splice(i, 1);
          continue;
        }
      }

      if (prop.hp <= 0 && prop.fuse === 0) {
        this.destroyProp(prop, enemies, onShake, onDamageEnemy);
        this.props.splice(i, 1);
      }
    }
  }

  hitProp(prop, damage, onShake, enemies, onDamageEnemy) {
    prop.hp -= damage;
    sound.playHit();
    particles.createSparks(prop.x + prop.w / 2, prop.y + prop.h / 2, prop.color, 8);

    if (prop.type === 'barrel' && prop.fuse === 0 && prop.hp <= 0) {
      prop.fuse = 30; // 0.5 sec flashing fuse before detonation
      sound.playPoison();
    }
  }

  destroyProp(prop, enemies, onShake, onDamageEnemy) {
    sound.playHammer();
    particles.createSparks(prop.x + prop.w / 2, prop.y + prop.h / 2, prop.color, 25);

    if (prop.type === 'crate') {
      // 80% chance to drop useful items or power-ups
      const lootTypes = ['heart', 'energy', 'shard', 'kanelbulle', 'meatball', 'fika', 'berserker', 'aegis', 'mjolnir', 'magnet'];
      const picked = lootTypes[Math.floor(Math.random() * lootTypes.length)];
      relicManager.spawn(prop.x + prop.w / 2, prop.y, picked);

    } else if (prop.type === 'chest') {
      // Treasure chests drop multiple valuable items & rare power-ups!
      sound.playSynergy();
      if (onShake) onShake(10);
      relicManager.spawn(prop.x, prop.y, 'shard');
      relicManager.spawn(prop.x + 15, prop.y, 'kanelbulle');
      const superBuffs = ['aegis', 'mjolnir', 'chronos', 'valkyrie', 'berserker', 'fika', 'magnet'];
      relicManager.spawn(prop.x - 15, prop.y, superBuffs[Math.floor(Math.random() * superBuffs.length)]);
    }
  }

  explodeBarrel(prop, enemies, onShake, onDamageEnemy) {
    sound.playRoar();
    if (onShake) onShake(24);
    const radius = 180;
    particles.createSparks(prop.x + prop.w / 2, prop.y + prop.h / 2, '#ef4444', 50);
    particles.createDamageNumber(prop.x + prop.w / 2, prop.y - 20, '💥 BOOM! 100 DMG', '#ef4444');

    // AoE damage to all nearby enemies
    for (const en of enemies) {
      const dx = (en.x + en.w / 2) - (prop.x + prop.w / 2);
      const dy = (en.y + en.h / 2) - (prop.y + prop.h / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        en.hp -= 100;
        en.stunTimer = 60;
        particles.createDamageNumber(en.x + en.w / 2, en.y, '-100 💥', '#f97316');
      }
    }
  }

  draw(ctx, camera) {
    for (const p of this.props) {
      if (!camera.isVisible(p.x, p.w)) continue;

      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.type === 'crate') {
        // Wooden Nordic Supply Crate
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 0, p.w, p.h);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(4, 4, p.w - 8, p.h - 8);
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, p.w, p.h);
        ctx.beginPath();
        ctx.moveTo(4, 4); ctx.lineTo(p.w - 4, p.h - 4);
        ctx.moveTo(p.w - 4, 4); ctx.lineTo(4, p.h - 4);
        ctx.stroke();

      } else if (p.type === 'barrel') {
        // Explosive Fuel Barrel
        const isFusing = p.fuse > 0;
        ctx.fillStyle = isFusing && p.fuse % 4 < 2 ? '#ffffff' : '#dc2626';
        ctx.fillRect(0, 0, p.w, p.h);
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(4, 8, p.w - 8, p.h - 16);
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('⚠️', p.w / 2 - 8, p.h / 2 + 4);

      } else if (p.type === 'chest') {
        // Golden Zodiac Relic Chest
        ctx.fillStyle = '#b45309';
        ctx.fillRect(0, 8, p.w, p.h - 8);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(0, 0, p.w, 14);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(p.w / 2 - 6, 12, 12, 12);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.fillRect(p.w / 2 - 3, 15, 6, 6);
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    }
  }

  clear() {
    this.props.length = 0;
  }
}

export const destructibleManager = new DestructibleManager();
