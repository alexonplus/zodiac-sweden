/**
 * Leo - The Lion (Stockholm / Sun)
 * Solar Paladin wielding the Radiant Sunblade & Golden Lion Mane
 */
export class LeoHero {
  static id = 'leo';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Solar Flare Golden Ring
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 26, 22 + Math.sin(t * 3) * 3, 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Coronal Sunbeams
    for (let i = 0; i < 4; i++) {
      const angle = t * 2 + (i * Math.PI) / 2;
      const rx = Math.cos(angle) * 19;
      const ry = 14 + Math.sin(angle) * 8;
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 6;
      ctx.fillRect(rx - 1, ry - 1, 2.5, 2.5);
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Royal Solar Ermine Cape & Golden Mane
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-17, -22, 10, 20); // Lion Mane

    ctx.fillStyle = '#eab308';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-8, -18);
    ctx.quadraticCurveTo(-26 - speedRatio * 18, -6 + capeFlutter, -32 - speedRatio * 16, 12);
    ctx.lineTo(-22 - speedRatio * 12, 16);
    ctx.quadraticCurveTo(-16 - speedRatio * 8, 2 + capeFlutter, -8, -2);
    ctx.closePath();
    ctx.fill();

    // Royal Ermine White Fur Trim
    ctx.fillStyle = '#fef9c3';
    ctx.fillRect(-10, -20, 4, 18);
    ctx.shadowBlur = 0;
  }

  static drawShoulders(ctx, player) {
    // Sculpted Golden Lion-Head Pauldrons - Curved dome shape
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.ellipse(-14, -15, 7, 5.5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(14, -15, 7, 5.5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Gilded Lion Cheek Highlights
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(-14, -16.5, 4.5, 2, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(14, -16.5, 4.5, 2, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawTorso(ctx, player) {
    // Tre Kronor Gilded Royal Breastplate - Natural athletic silhouette
    ctx.fillStyle = '#713f12';
    ctx.beginPath();
    ctx.moveTo(-11, -17);
    ctx.quadraticCurveTo(-12, -8, -8, 2);
    ctx.quadraticCurveTo(-9, 5, -8, 8);
    ctx.lineTo(8, 8);
    ctx.quadraticCurveTo(9, 5, 8, 2);
    ctx.quadraticCurveTo(12, -8, 11, -17);
    ctx.quadraticCurveTo(0, -15, -11, -17);
    ctx.closePath();
    ctx.fill();

    // Gilded Royal Chest Cuirass with chest volume
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.quadraticCurveTo(-11, -7, -7, 0);
    ctx.lineTo(7, 0);
    ctx.quadraticCurveTo(11, -7, 10, -15);
    ctx.quadraticCurveTo(0, -13, -10, -15);
    ctx.closePath();
    ctx.fill();

    // Inner bronze plate
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.ellipse(0, -6, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Radiant Sunburst Core & Leo Sigil
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#713f12';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♌', 0, -1);
    ctx.textAlign = 'left';

    // Royal Gilded Sash & Belt - Curved
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.quadraticCurveTo(0, 4, 9, 2);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    // Royal Gold Sunburst Buckle
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, 5, 4, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 18 === 0;
    const maneBreath = Math.sin(t * 3) * 1.5;

    // 1. Majestic Golden Lion Mane Background
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(0, -25, 12 + maneBreath, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -25, 10 + maneBreath, 0, Math.PI * 2);
    ctx.fill();

    // 2. Neck & Golden Beard
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.moveTo(-3, -19);
    ctx.lineTo(3, -19);
    ctx.lineTo(4, -15);
    ctx.lineTo(-4, -15);
    ctx.closePath();
    ctx.fill();

    // 3. Regal Face (Golden Sun-Kissed Skin) - Contoured human head silhouette
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Trimmed Regal Golden Beard - Curved
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.moveTo(-4.5, -18.5);
    ctx.quadraticCurveTo(0, -15.5, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -14, -4.5, -18.5);
    ctx.fill();

    // 4. Piercing Feline Slit Eyes - Almond shaped
    if (isBlink) {
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-2.5, -24, 2, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2.5, -24, 2, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-2.5, -24, 2.4, 1.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(2.5, -24, 2.4, 1.7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden Amber Iris
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(-2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Vertical Slit Pupil
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.ellipse(-2.5, -24, 0.5, 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(2.5, -24, 0.5, 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nose & Feline Whiskers
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(0, -22, 1.6, 1, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Front Golden Bangs - Flowing locks
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(-6, -30);
    ctx.quadraticCurveTo(-3, -25, -1, -28);
    ctx.quadraticCurveTo(2, -25, 6, -30);
    ctx.quadraticCurveTo(0, -33, -6, -30);
    ctx.closePath();
    ctx.fill();

    // 6. Royal Tre Kronor 3-Spire Crown - Curved
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-6.5, -32);
    ctx.quadraticCurveTo(0, -34, 6.5, -32);
    ctx.lineTo(6.5, -30);
    ctx.quadraticCurveTo(0, -32, -6.5, -30);
    ctx.closePath();
    ctx.fill();

    // 3 Golden Crown Spires - Curved
    ctx.fillStyle = '#fde047';
    // Left Spire
    ctx.beginPath();
    ctx.moveTo(-5, -32);
    ctx.lineTo(-3.5, -38);
    ctx.lineTo(-2, -32);
    ctx.closePath();
    ctx.fill();
    // Center Tall Spire
    ctx.beginPath();
    ctx.moveTo(-2, -33);
    ctx.lineTo(0, -41);
    ctx.lineTo(2, -33);
    ctx.closePath();
    ctx.fill();
    // Right Spire
    ctx.beginPath();
    ctx.moveTo(2, -32);
    ctx.lineTo(3.5, -38);
    ctx.lineTo(5, -32);
    ctx.closePath();
    ctx.fill();

    // Ruby Jewel in Center Spire
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, -36, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Royal Tre Kronor Golden Aegis Shield - Curved heraldic heater shield
    ctx.save();
    ctx.translate(-2, 11);
    ctx.fillStyle = '#713f12';
    ctx.beginPath();
    ctx.moveTo(-8, -11);
    ctx.lineTo(8, -11);
    ctx.quadraticCurveTo(8, 2, 0, 12);
    ctx.quadraticCurveTo(-8, 2, -8, -11);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(-6, -9);
    ctx.lineTo(6, -9);
    ctx.quadraticCurveTo(6, 1, 0, 10);
    ctx.quadraticCurveTo(-6, 1, -6, -9);
    ctx.closePath();
    ctx.fill();

    // Tre Kronor 3 Golden Crowns in Relief
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-3, -6, 2, 2);
    ctx.fillRect(1, -6, 2, 2);
    ctx.fillRect(-1, -2, 2, 2);
    // Central Radiant Sunburst
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(0, 3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // Radiant Glowing Sunblade with Solar Flare Crossguard
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-2, -5, 6, 4); // Hilt
    // Golden Crossguard
    ctx.fillStyle = '#facc15';
    ctx.fillRect(4, -9, 4, 13);

    // Radiant Plasma Blade
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 14;
    ctx.fillRect(8, -5, 24, 6);
    // Pure White Solar Core
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, -3, 20, 2);
    ctx.shadowBlur = 0;
  }
}
