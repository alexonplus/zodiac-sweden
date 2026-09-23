import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';

/**
 * Co-Op Tag-Team Ultimate: "ZODIAC ECLIPSE"
 * Triggers when both players have 100% Ult and activate together!
 */
export class SynergyUltManager {
  constructor() {
    this.activeEclipse = null; // { p1Hero, p2Hero, timer, duration }
  }

  triggerEclipse(player1, player2, enemies, onShake, screenW = 1080, screenH = 620) {
    player1.ultCharge = 0;
    player2.ultCharge = 0;

    this.activeEclipse = {
      p1Hero: player1.hero,
      p2Hero: player2.hero,
      timer: 120,
      duration: 120
    };

    sound.playRoar();
    sound.playUlt();
    if (onShake) onShake(30);

    const comboDamage = 350;
    for (const en of enemies) {
      en.hp -= comboDamage;
      en.stunTimer = 180;
      particles.createDamageNumber(en.x + en.w / 2, en.y - 30, `🌟 ZODIAC ECLIPSE -${comboDamage}!`, '#facc15');
      particles.createSparks(en.x + en.w / 2, en.y + en.h / 2, '#facc15', 30);
    }
  }

  update() {
    if (this.activeEclipse) {
      this.activeEclipse.timer--;
      if (this.activeEclipse.timer <= 0) {
        this.activeEclipse = null;
      }
    }
  }

  draw(ctx, screenW = 1080, screenH = 620) {
    if (!this.activeEclipse) return;

    const e = this.activeEclipse;
    const progress = (e.duration - e.timer) / e.duration;

    ctx.save();
    // Dark Space Eclipse Backdrop
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(0, 0, screenW, screenH);

    // Glowing Central Constellation Merge Ring
    const centerX = screenW / 2;
    const centerY = screenH / 2 - 20;

    ctx.save();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 35;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80 + Math.sin(progress * Math.PI) * 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Dual Constellation Symbols
    ctx.fillStyle = e.p1Hero.color;
    ctx.shadowColor = e.p1Hero.color;
    ctx.shadowBlur = 25;
    ctx.font = '900 64px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(e.p1Hero.symbol, centerX - 50, centerY + 20);

    ctx.fillStyle = e.p2Hero.color;
    ctx.shadowColor = e.p2Hero.color;
    ctx.shadowBlur = 25;
    ctx.fillText(e.p2Hero.symbol, centerX + 50, centerY + 20);

    // Cinematic Banner Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px "Orbitron", sans-serif';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 20;
    ctx.fillText(`✨ ZODIAC ECLIPSE: ${e.p1Hero.name.toUpperCase()} + ${e.p2Hero.name.toUpperCase()} ✨`, centerX, centerY + 110);
    ctx.font = 'bold 16px "Orbitron", monospace';
    ctx.fillStyle = '#facc15';
    ctx.fillText('CELESTIAL SUPERNOVA 350 DMG', centerX, centerY + 140);

    ctx.restore();
  }
}

export const synergyUltManager = new SynergyUltManager();
