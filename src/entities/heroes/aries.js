/**
 * Aries - The Ram (Kiruna / Fire)
 * Berserker wielding the Infernal War Axe & Molten Ram Horns
 */
export class AriesHero {
  static id = 'aries';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Geothermal Heat Ring
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 26, 22 + Math.sin(t * 3) * 3, 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Rising Molten Embers
    for (let i = 0; i < 4; i++) {
      const offset = (t * 2 + i * 1.5) % 3;
      const ex = Math.sin(t * 2 + i * 2) * 16;
      const ey = 20 - offset * 14;
      ctx.fillStyle = i % 2 === 0 ? '#facc15' : '#ea580c';
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 6;
      ctx.fillRect(ex, ey, 2.5, 2.5);
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Flowing Molten Fire Mantle with Jagged Flame Edges
    ctx.fillStyle = '#b91c1c';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-8, -16);
    ctx.quadraticCurveTo(-28 - speedRatio * 18, -6 + capeFlutter, -34 - speedRatio * 16, 12);
    ctx.lineTo(-24 - speedRatio * 12, 16);
    ctx.quadraticCurveTo(-18 - speedRatio * 10, 0 + capeFlutter, -8, -2);
    ctx.closePath();
    ctx.fill();

    // Inner Flame Layer
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-8, -14);
    ctx.quadraticCurveTo(-22 - speedRatio * 14, -4 + capeFlutter, -26 - speedRatio * 12, 8);
    ctx.lineTo(-18 - speedRatio * 10, 10);
    ctx.quadraticCurveTo(-14 - speedRatio * 8, 0, -8, -4);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  static drawShoulders(ctx, player) {
    // Heavy Spiked Ram Skull Pauldrons - Curved dome shape
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.ellipse(-13, -15, 6.5, 5, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -15, 6.5, 5, 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Golden Horn Studs on Shoulders - Curved spikes
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-18, -18);
    ctx.lineTo(-14, -14);
    ctx.lineTo(-12, -18);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(18, -18);
    ctx.lineTo(14, -14);
    ctx.lineTo(12, -18);
    ctx.closePath();
    ctx.fill();
  }

  static drawTorso(ctx, player) {
    // Black Iron & Molten Magma Cuirass - Athletic tapered muscular silhouette
    ctx.fillStyle = '#450a0a';
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

    // Red Magma Breastplate with curved chest volume
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.quadraticCurveTo(-11, -7, -7, 0);
    ctx.lineTo(7, 0);
    ctx.quadraticCurveTo(11, -7, 10, -15);
    ctx.quadraticCurveTo(0, -13, -10, -15);
    ctx.closePath();
    ctx.fill();

    // Core Inset
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(0, -6, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Magma Core & Aries Sigil
    ctx.fillStyle = '#f97316';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♈', 0, -1);
    ctx.textAlign = 'left';

    // Runic Heavy War Belt - Curved
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.quadraticCurveTo(0, 4, 9, 2);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    // Golden Aries War Buckle
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(0, 5, 4, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 17 === 0;
    const hairSway = Math.sin(t * 4) * 2;

    // 1. Back Wild Flame Hair
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-14 + hairSway, -22, -18 + hairSway, -14);
    ctx.lineTo(-14 + hairSway, -10);
    ctx.quadraticCurveTo(-10 + hairSway, -18, -4, -20);
    ctx.closePath();
    ctx.fill();

    // 2. Neck
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.moveTo(-3, -19);
    ctx.lineTo(3, -19);
    ctx.lineTo(4, -15);
    ctx.lineTo(-4, -15);
    ctx.closePath();
    ctx.fill();

    // 3. Head & Face (Warrior Tan) - Organic contoured human head silhouette
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Jawline shading
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -19.5, -4.5, -18.5);
    ctx.fill();

    // Battle Scar across right cheek
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(1, -24);
    ctx.lineTo(4, -21);
    ctx.stroke();

    // 4. Fierce Eyes & Brow - Angled arched brows
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-4.5, -25.5);
    ctx.lineTo(-1, -27);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4.5, -25.5);
    ctx.lineTo(1, -27);
    ctx.stroke();

    if (isBlink) {
      ctx.strokeStyle = '#450a0a';
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

      // Burning Amber-Gold Iris
      ctx.fillStyle = '#ea580c';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(-2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-2.8, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.2, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Determined Grimace Mouth
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-2.5, -20);
    ctx.lineTo(2.5, -20.5);
    ctx.stroke();

    // 5. Crimson War Circlet & Curled Golden Ram Horns - Organic curves
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-6.5, -31);
    ctx.quadraticCurveTo(0, -32.5, 6.5, -31);
    ctx.lineTo(6.5, -28.5);
    ctx.quadraticCurveTo(0, -30, -6.5, -28.5);
    ctx.closePath();
    ctx.fill();

    // Curled Golden Horns Left & Right (Smooth spiral curves)
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 6;

    // Left Horn Curl
    ctx.beginPath();
    ctx.moveTo(-6, -30);
    ctx.quadraticCurveTo(-14, -36, -17, -30);
    ctx.quadraticCurveTo(-18, -25, -13, -27);
    ctx.quadraticCurveTo(-12, -31, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Right Horn Curl
    ctx.beginPath();
    ctx.moveTo(6, -30);
    ctx.quadraticCurveTo(14, -36, 17, -30);
    ctx.quadraticCurveTo(18, -25, 13, -27);
    ctx.quadraticCurveTo(12, -31, 6, -28);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Horn Ridges
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-11, -35, 2, 4);
    ctx.fillRect(9, -35, 2, 4);

    // 6. Fiery Spiky Front Bangs
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-6, -31);
    ctx.lineTo(-4, -26);
    ctx.lineTo(-2, -30);
    ctx.lineTo(1, -25);
    ctx.lineTo(4, -30);
    ctx.lineTo(6, -32);
    ctx.closePath();
    ctx.fill();

    // Burning Flame Tips
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-4, -27, 1.5, 1.5);
    ctx.fillRect(1, -26, 1.5, 1.5);
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Spiked Molten Ram Horn Buckler Shield
    ctx.save();
    ctx.translate(-2, 10);
    // Shield Base Rim
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    // Inner Molten Plate
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    // Glowing Core Boss
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Miniature Spiked Ram Horns on Buckler
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-8, -4, 3, 3);
    ctx.fillRect(5, -4, 3, 3);
    ctx.fillRect(-2, -9, 4, 3);
    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // Heavy Infernal Double-Headed War Axe with Molten Core
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-2, -6, 26, 4); // Ash Shaft
    ctx.fillStyle = '#b45309';
    ctx.fillRect(2, -8, 4, 8); // Handguard

    // Heavy Double Axe Blades
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(16, -20, 16, 32);

    // Molten Glowing Blade Edge
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 12;
    ctx.fillRect(20, -16, 8, 24);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(23, -12, 3, 16);
    ctx.shadowBlur = 0;
  }
}
