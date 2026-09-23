import { sound } from '../engine/Audio.js';

/**
 * Fika Café Shop & Persistent Upgrades System
 * Manages permanent upgrades purchased with Star Shards (⭐).
 */
export class ShopManager {
  constructor() {
    this.starShards = 0;
    this.upgrades = {
      kanelbulle: 0, // +25 Max HP per level (Max 4)
      espresso: 0,   // +15% Speed per level (Max 3)
      ringmail: 0,   // +10% Damage Resistance per level (Max 3)
      reactor: 0,    // +25% Ult Generation per level (Max 3)
      magnet: 0,     // +50% Loot Attraction Radius per level (Max 2)
      thorRune: 0    // +15% Base Attack Damage per level (Max 4)
    };
    this.catalog = {
      kanelbulle: { name: '🥐 Guld-Kanelbulle', desc: '+25 Max Health', max: 4, cost: 80, icon: '🥐' },
      espresso: { name: '☕ Kaffe Dubbel Espresso', desc: '+15% Move & Attack Speed', max: 3, cost: 100, icon: '☕' },
      ringmail: { name: '🛡️ Viking Ring-Mail', desc: '+10% Damage Resistance', max: 3, cost: 120, icon: '🛡️' },
      reactor: { name: '⚡ Aether Reactor Chip', desc: '+25% Faster Ult Build', max: 3, cost: 150, icon: '⚡' },
      magnet: { name: '🧲 Star Guld-Magnet', desc: '+50% Item Attraction Radius', max: 2, cost: 110, icon: '🧲' },
      thorRune: { name: '⚔️ Thor Runestone', desc: '+15% Base Attack Damage', max: 4, cost: 130, icon: '⚔️' }
    };
    this.load();
  }

  load() {
    try {
      const savedShards = localStorage.getItem('zodiac_star_shards');
      if (savedShards !== null) this.starShards = parseInt(savedShards, 10) || 0;

      const savedUps = localStorage.getItem('zodiac_upgrades');
      if (savedUps) {
        this.upgrades = { ...this.upgrades, ...JSON.parse(savedUps) };
      }
    } catch (e) {}
  }

  save() {
    try {
      localStorage.setItem('zodiac_star_shards', this.starShards.toString());
      localStorage.setItem('zodiac_upgrades', JSON.stringify(this.upgrades));
    } catch (e) {}
  }

  addShards(amount) {
    this.starShards += amount;
    this.save();
  }

  buyUpgrade(key) {
    const item = this.catalog[key];
    if (!item) return false;
    const currentLevel = this.upgrades[key] || 0;
    if (currentLevel >= item.max) return false;
    if (this.starShards < item.cost) return false;

    this.starShards -= item.cost;
    this.upgrades[key] = currentLevel + 1;
    this.save();
    sound.playItem();
    return true;
  }

  getBonusHp() {
    return (this.upgrades.kanelbulle || 0) * 25;
  }

  getSpeedMultiplier() {
    return 1.0 + (this.upgrades.espresso || 0) * 0.15;
  }

  getDamageReduction() {
    return (this.upgrades.ringmail || 0) * 0.10;
  }

  getUltMultiplier() {
    return 1.0 + (this.upgrades.reactor || 0) * 0.25;
  }

  getMagnetBonusRadius() {
    return (this.upgrades.magnet || 0) * 60;
  }

  getDamageMultiplier() {
    return 1.0 + (this.upgrades.thorRune || 0) * 0.15;
  }
}

export const shopManager = new ShopManager();
