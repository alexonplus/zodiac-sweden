/**
 * Capricorn - The Sea-Goat (Östersund / Frost)
 * Frost Peak Elder wielding Glacial Great-Axe & Nordic Ice Horns
 */
export class CapricornHero {
  static id = 'capricorn';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Frost Permafrost Chill Ring
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 26, 22 + Math.sin(t * 2) * 3, 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Falling Cryo Snow Crystals
    for (let i = 0; i < 4; i++) {
      const sy = 8 + ((t * 10 + i * 12) % 22);
      const sx = Math.sin(t + i * 2) * 17;
      ctx.fillStyle = '#cffafe';
      ctx.fillRect(sx - 1, sy - 1, 2, 2);
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Frost-Covered White Wolf Pelt Fur Mantle
    ctx.fillStyle = '#0e7490';
    ctx.beginPath();
    ctx.moveTo(-8, -16);
    ctx.quadraticCurveTo(-26 - speedRatio * 18, -6 + capeFlutter, -32 - speedRatio * 16, 12);
    ctx.lineTo(-22 - speedRatio * 12, 16);
    ctx.quadraticCurveTo(-16 - speedRatio * 8, 2 + capeFlutter, -8, -2);
    ctx.closePath();
    ctx.fill();

    // White Fur Collar Edge
    ctx.fillStyle = '#ecfeff';
    ctx.fillRect(-12, -20, 6, 20);
    // Icicle Shards
    ctx.fillStyle = '#a5f3fc';
    ctx.fillRect(-16, 4, 3, 6);
    ctx.fillRect(-12, 6, 3, 5);
  }

  static drawShoulders(ctx, player) {
    // Chiseled Glacial Ice Crag Pauldrons - Curved dome shape
    ctx.fillStyle = '#0891b2';
    ctx.beginPath();
    ctx.ellipse(-13, -15, 6.5, 4.8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -15, 6.5, 4.8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Frost Crystal Ridge
    ctx.fillStyle = '#cffafe';
    ctx.beginPath();
    ctx.ellipse(-13, -17, 4, 1.8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -17, 4, 1.8, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawTorso(ctx, player) {
    // Ancient Norse Steel & Permafrost Armor - Natural athletic silhouette
    ctx.fillStyle = '#164e63';
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

    // Curved Permafrost Breastplate
    ctx.fillStyle = '#0891b2';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.quadraticCurveTo(-11, -7, -7, 0);
    ctx.lineTo(7, 0);
    ctx.quadraticCurveTo(11, -7, 10, -15);
    ctx.quadraticCurveTo(0, -13, -10, -15);
    ctx.closePath();
    ctx.fill();

    // Inner plate
    ctx.fillStyle = '#0e7490';
    ctx.beginPath();
    ctx.ellipse(0, -6, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Frost Core & Capricorn Sigil
    ctx.fillStyle = '#67e8f9';
    ctx.shadowColor = '#0891b2';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♑', 0, -1);
    ctx.textAlign = 'left';

    // Runic Steel Frost Belt - Curved
    ctx.fillStyle = '#155e75';
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.quadraticCurveTo(0, 4, 9, 2);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    // Glacial Ice Buckle
    ctx.fillStyle = '#cffafe';
    ctx.beginPath();
    ctx.ellipse(0, 5, 4, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 18 === 0;
    const beardSway = Math.sin(t * 3) * 1.5;

    // 1. Wild Silver-White Hair in Back
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-14 + beardSway, -22, -16 + beardSway, -12);
    ctx.lineTo(-12 + beardSway, -10);
    ctx.quadraticCurveTo(-8 + beardSway, -18, -4, -20);
    ctx.closePath();
    ctx.fill();

    // 2. Neck
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(-3, -19);
    ctx.lineTo(3, -19);
    ctx.lineTo(4, -15);
    ctx.lineTo(-4, -15);
    ctx.closePath();
    ctx.fill();

    // 3. Face (Weathered Highland Skin) - Contoured human head silhouette
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // 4. Glowing Icy-Blue Eyes - Almond shaped
    if (isBlink) {
      ctx.strokeStyle = '#164e63';
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

      ctx.fillStyle = '#67e8f9';
      ctx.shadowColor = '#0891b2';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(-2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-2.8, -24.4, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.2, -24.4, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Heavy White Eyebrows - Arched
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-5, -26.5);
    ctx.lineTo(-1, -26);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5, -26.5);
    ctx.lineTo(1, -26);
    ctx.stroke();

    // Strong Norse Nose & Frost-Weathered Cheeks
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(0, -22, 1.6, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.beginPath();
    ctx.ellipse(-4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Silver Ear Hoops
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(-7, -23, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -23, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Braided Long White Beard with Cyan Rune Beads - Smooth curved braid
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-5, -19);
    ctx.quadraticCurveTo(-4 + beardSway * 0.5, -14, -2 + beardSway, -8);
    ctx.lineTo(0 + beardSway, -6);
    ctx.lineTo(2 + beardSway, -8);
    ctx.quadraticCurveTo(4 + beardSway * 0.5, -14, 5, -19);
    ctx.closePath();
    ctx.fill();

    // Cyan Frost Bead on Beard Tip
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(0 + beardSway, -7, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 6. Norse Mountain Ice Horns - Graceful organic backward curve
    ctx.fillStyle = '#cffafe';
    ctx.shadowColor = '#67e8f9';
    ctx.shadowBlur = 6;

    // Left Horn
    ctx.beginPath();
    ctx.moveTo(-6, -29);
    ctx.quadraticCurveTo(-14, -32, -18, -39);
    ctx.quadraticCurveTo(-15, -42, -11, -35);
    ctx.quadraticCurveTo(-8, -31, -5, -29);
    ctx.closePath();
    ctx.fill();

    // Right Horn
    ctx.beginPath();
    ctx.moveTo(6, -29);
    ctx.quadraticCurveTo(14, -32, 18, -39);
    ctx.quadraticCurveTo(15, -42, 11, -35);
    ctx.quadraticCurveTo(8, -31, 5, -29);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Forehead Runic Band - Curved
    ctx.fillStyle = '#0e7490';
    ctx.beginPath();
    ctx.moveTo(-6.5, -31);
    ctx.quadraticCurveTo(0, -33, 6.5, -31);
    ctx.lineTo(6.5, -29);
    ctx.quadraticCurveTo(0, -31, -6.5, -29);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.arc(0, -31, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Runic Glacier Spiked Buckler Shield & Northern Ice Spikes
    ctx.save();
    ctx.translate(-2, 11);

    // Dark Glacial Iron Frame
    ctx.fillStyle = '#164e63';
    ctx.fillRect(-7, -10, 14, 20);
    ctx.fillStyle = '#0891b2';
    ctx.fillRect(-5, -8, 10, 16);

    // Chiseled Glacial Ice Boss with glowing frost rune
    ctx.fillStyle = '#cffafe';
    ctx.shadowColor = '#67e8f9';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Glacial Ice Stalactite Spikes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-6, -12, 3, 3);
    ctx.fillRect(3, -12, 3, 3);
    ctx.fillRect(-1.5, 8, 3, 4);

    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // Chiseled Glacial Frost Axe with Crystalline Edge
    ctx.fillStyle = '#164e63';
    ctx.fillRect(-2, -6, 26, 4); // Ash Handle
    ctx.fillStyle = '#0891b2';
    ctx.fillRect(16, -18, 14, 28); // Axe Head

    // Glowing Glacial Edge
    ctx.fillStyle = '#cffafe';
    ctx.shadowColor = '#67e8f9';
    ctx.shadowBlur = 10;
    ctx.fillRect(20, -15, 8, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(23, -12, 4, 16);
    ctx.shadowBlur = 0;
  }
}
