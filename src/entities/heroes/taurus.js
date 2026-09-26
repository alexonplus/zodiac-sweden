/**
 * Taurus - The Bull (Falun / Earth)
 * Juggernaut wielding the Heavy Spiked Bronze Maul
 */
export class TaurusHero {
  static id = 'taurus';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Tectonic Ground Rupture Ring
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, 26, 24 + Math.sin(t * 1.5) * 2, 7, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Floating Bronze Mineral Sparks
    for (let i = 0; i < 3; i++) {
      const angle = t * 1.2 + (i * Math.PI * 2) / 3;
      const rx = Math.cos(angle) * 20;
      const ry = 16 + Math.sin(angle) * 6;
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 5;
      ctx.fillRect(rx - 1.5, ry - 1.5, 3, 3);
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Massive Spiked Copper Backplate & Fur-Trimmed Pelt
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-20, -16, 10, 30);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-18, -14, 6, 26);

    // Bronze Spikes
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-22, -10, 4, 4);
    ctx.fillRect(-22, 0, 4, 4);
    ctx.fillRect(-22, 10, 4, 4);
  }

  static drawShoulders(ctx, player) {
    // Heavy Tiered Copper Pauldrons - Curved dome shape
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(-14, -15, 7, 5.5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(14, -15, 7, 5.5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Golden Bronze Rim Highlights
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(-14, -17, 5, 2, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(14, -17, 5, 2, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawTorso(ctx, player) {
    // Heavy Banded Falun Bronze Plate Cuirass - Powerful muscular torso silhouette
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(-12, -17);
    ctx.quadraticCurveTo(-13, -8, -9, 2);
    ctx.quadraticCurveTo(-10, 5, -9, 8);
    ctx.lineTo(9, 8);
    ctx.quadraticCurveTo(10, 5, 9, 2);
    ctx.quadraticCurveTo(13, -8, 12, -17);
    ctx.quadraticCurveTo(0, -15, -12, -17);
    ctx.closePath();
    ctx.fill();

    // Curved Bronze Breastplate with chest volume
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(-11, -15);
    ctx.quadraticCurveTo(-12, -7, -8, 0);
    ctx.lineTo(8, 0);
    ctx.quadraticCurveTo(12, -7, 11, -15);
    ctx.quadraticCurveTo(0, -13, -11, -15);
    ctx.closePath();
    ctx.fill();

    // Inner bronze plate
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(0, -6, 6.5, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Earth Core & Taurus Sigil
    ctx.fillStyle = '#d97706';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♉', 0, -1);
    ctx.textAlign = 'left';

    // Heavy Iron-Riveted Belt - Curved
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(-10, 2);
    ctx.quadraticCurveTo(0, 4, 10, 2);
    ctx.lineTo(10, 7);
    ctx.quadraticCurveTo(0, 9, -10, 7);
    ctx.closePath();
    ctx.fill();

    // Massive Bronze Belt Plate
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(0, 5, 4.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 18 === 0;
    const braidSway = Math.sin(t * 3) * 1.8;

    // 1. Thick Warrior Braids behind head with Copper Beads
    ctx.fillStyle = '#291203';
    ctx.beginPath();
    ctx.moveTo(-6, -24);
    ctx.quadraticCurveTo(-14 + braidSway, -18, -16 + braidSway, -8);
    ctx.lineTo(-12 + braidSway, -7);
    ctx.quadraticCurveTo(-10 + braidSway, -16, -4, -20);
    ctx.closePath();
    ctx.fill();

    // Copper bead on braid
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(-14 + braidSway, -10, 2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Strong Neck
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(-4, -19);
    ctx.lineTo(4, -19);
    ctx.lineTo(5, -15);
    ctx.lineTo(-5, -15);
    ctx.closePath();
    ctx.fill();

    // 3. Bronze-Skinned Face & Heavy Jaw - Natural contoured head silhouette
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(-7, -28);
    ctx.quadraticCurveTo(0, -32, 7, -28);
    ctx.quadraticCurveTo(7.5, -22, 5.5, -18);
    ctx.quadraticCurveTo(0, -16.5, -5.5, -18);
    ctx.quadraticCurveTo(-7.5, -22, -7, -28);
    ctx.closePath();
    ctx.fill();

    // Jawline shading & contour
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.moveTo(-5.5, -18);
    ctx.quadraticCurveTo(0, -16.5, 5.5, -18);
    ctx.quadraticCurveTo(0, -19, -5.5, -18);
    ctx.fill();

    // Heavy Brow Line - Arched
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-5.5, -25.5);
    ctx.lineTo(-1, -26.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5.5, -25.5);
    ctx.lineTo(1, -26.5);
    ctx.stroke();

    // 4. Amber Glowing Eyes
    if (isBlink) {
      ctx.strokeStyle = '#291203';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(-3, -24, 2, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(3, -24, 2, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.ellipse(-3, -24, 2.6, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(3, -24, 2.6, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(-3, -24, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(3, -24, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Broad Nose & Golden Septum Ring
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(0, -22, 2.2, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden Ring
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -19.5, 2.2, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Heavy Bronze Minotaur Headplate & Swept Bull Horns
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(-7.5, -31);
    ctx.quadraticCurveTo(0, -33, 7.5, -31);
    ctx.lineTo(7.5, -28);
    ctx.quadraticCurveTo(0, -30, -7.5, -28);
    ctx.closePath();
    ctx.fill();

    // Swept Bull Horns - Graceful organic upward curves
    ctx.fillStyle = '#f8fafc';
    // Left Horn
    ctx.beginPath();
    ctx.moveTo(-7, -29);
    ctx.quadraticCurveTo(-16, -32, -18, -39);
    ctx.quadraticCurveTo(-14, -41, -11, -34);
    ctx.quadraticCurveTo(-9, -31, -5, -29);
    ctx.closePath();
    ctx.fill();

    // Right Horn
    ctx.beginPath();
    ctx.moveTo(7, -29);
    ctx.quadraticCurveTo(16, -32, 18, -39);
    ctx.quadraticCurveTo(14, -41, 11, -34);
    ctx.quadraticCurveTo(9, -31, 5, -29);
    ctx.closePath();
    ctx.fill();

    // Dark Horn Tips
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(-17, -39, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(17, -39, 2, 0, Math.PI * 2);
    ctx.fill();

    // Dark Beard & Sideburns - Natural contour
    ctx.fillStyle = '#291203';
    ctx.beginPath();
    ctx.moveTo(-5.5, -18);
    ctx.quadraticCurveTo(0, -15, 5.5, -18);
    ctx.quadraticCurveTo(0, -13, -5.5, -18);
    ctx.fill();
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Massive Falun Bronze Spiked Pavise Shield
    ctx.save();
    ctx.translate(-2, 11);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-7, -11, 14, 22);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-5, -9, 10, 18);
    // Bronze Plate Boss with Bull Sigil
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-3, -3, 6, 6);
    ctx.fillStyle = '#451a03';
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♉', 0, 2);
    // Steel Shield Spikes
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-6, -13, 3, 3);
    ctx.fillRect(3, -13, 3, 3);
    ctx.fillRect(-2, 9, 4, 3);
    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // Massive Spiked Bronze Maul / War Hammer
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-2, -6, 24, 5); // Thick Oak Haft
    ctx.fillStyle = '#b45309';
    ctx.fillRect(14, -18, 16, 28); // Giant Hammer Block

    // Golden Inset Plate & Spikes
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#d97706';
    ctx.shadowBlur = 8;
    ctx.fillRect(17, -14, 10, 20);
    // Steel Piercing Spikes
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(30, -14, 5, 5);
    ctx.fillRect(30, 1, 5, 5);
    ctx.shadowBlur = 0;
  }
}
