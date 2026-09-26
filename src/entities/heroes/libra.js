/**
 * Libra - The Scales (Lund / Astral)
 * Astral Cosmos Arbiter wielding the Gravity Scales & Cosmic Wand
 */
export class LibraHero {
  static id = 'libra';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Astral Cosmos Gravity Ring
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.45)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(0, 26, 21 + Math.sin(t * 2) * 3, 5.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Orbiting Star Dust & Cosmic Nodes
    for (let i = 0; i < 3; i++) {
      const angle = t * 2 + (i * Math.PI * 2) / 3;
      const rx = Math.cos(angle) * 19;
      const ry = 12 + Math.sin(angle) * 8;
      ctx.fillStyle = i % 2 === 0 ? '#facc15' : '#c7d2fe';
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 6;
      ctx.fillRect(rx - 1, ry - 1, 2.5, 2.5);
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Starry Indigo Astral Cloak with Floating Miniature Scales
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.moveTo(-7, -16);
    ctx.quadraticCurveTo(-26 - speedRatio * 18, -6 + capeFlutter, -32 - speedRatio * 16, 12);
    ctx.lineTo(-22 - speedRatio * 12, 16);
    ctx.quadraticCurveTo(-16 - speedRatio * 8, 2 + capeFlutter, -7, -2);
    ctx.closePath();
    ctx.fill();

    // Starlight Constellation Dots on Cloak
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-18 - speedRatio * 10, -2, 2, 2);
    ctx.fillRect(-24 - speedRatio * 12, 4, 1.5, 1.5);
    ctx.fillRect(-20 - speedRatio * 10, 8, 2, 2);

    // Floating Golden Balance Pans on Back
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-12, -22, 14, 2); // Balance Bar
    ctx.fillRect(-14, -18, 4, 3); // Left Pan
    ctx.fillRect(0, -18, 4, 3); // Right Pan
  }

  static drawShoulders(ctx, player) {
    // Astral Cosmos Orb Pauldrons - Curved dome shape
    ctx.fillStyle = '#4338ca';
    ctx.beginPath();
    ctx.ellipse(-13, -15, 6.5, 4.5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -15, 6.5, 4.5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Golden Astral Orb Accents
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(-13, -15, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(13, -15, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawTorso(ctx, player) {
    // Cosmic Midnight Robe & Gilded Astral Cuirass - Natural athletic silhouette
    ctx.fillStyle = '#1e1b4b';
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

    // Curved Indigo Breastplate
    ctx.fillStyle = '#4f46e5';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.quadraticCurveTo(-11, -7, -7, 0);
    ctx.lineTo(7, 0);
    ctx.quadraticCurveTo(11, -7, 10, -15);
    ctx.quadraticCurveTo(0, -13, -10, -15);
    ctx.closePath();
    ctx.fill();

    // Inner plate
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.ellipse(0, -6, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Astral Orb & Libra Sigil
    ctx.fillStyle = '#818cf8';
    ctx.shadowColor = '#6366f1';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♎', 0, -1);
    ctx.textAlign = 'left';

    // Golden Karma Band Belt - Curved
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.quadraticCurveTo(0, 4, 9, 2);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    // Golden Balance Core
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(0, 5, 4, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 18 === 0;
    const hairSway = Math.sin(t * 3) * 2;

    // 1. Midnight Indigo Hair with Silver Strands
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-14 + hairSway, -20, -16 + hairSway, -8);
    ctx.lineTo(-12 + hairSway, -6);
    ctx.quadraticCurveTo(-8 + hairSway, -16, -4, -18);
    ctx.closePath();
    ctx.fill();

    // 2. Neck
    ctx.fillStyle = '#ede9fe';
    ctx.beginPath();
    ctx.moveTo(-3, -19);
    ctx.lineTo(3, -19);
    ctx.lineTo(4, -15);
    ctx.lineTo(-4, -15);
    ctx.closePath();
    ctx.fill();

    // 3. Face (Celestial Ivory Skin) - Contoured human head silhouette
    ctx.fillStyle = '#ede9fe';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // 4. Starlit Cosmic Eyes - Almond shaped
    if (isBlink) {
      ctx.strokeStyle = '#312e81';
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

      // Cosmic Indigo Iris
      ctx.fillStyle = '#4f46e5';
      ctx.beginPath();
      ctx.arc(-2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Golden Starlight Pupil
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(-2.8, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.2, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Astral Cheek Contours & Shimmer
    ctx.fillStyle = 'rgba(129, 140, 248, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lips & Celestial Shimmer - Curved
    ctx.fillStyle = '#a5b4fc';
    ctx.beginPath();
    ctx.arc(0, -20, 1.8, 0, Math.PI);
    ctx.fill();

    // Golden Balance Ear Studs
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(-7, -23, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -23, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Indigo Front Bangs with Silver Streaks - Flowing curves
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.moveTo(-6, -30);
    ctx.quadraticCurveTo(-3, -25, -1, -28);
    ctx.quadraticCurveTo(2, -25, 6, -30);
    ctx.quadraticCurveTo(0, -33, -6, -30);
    ctx.closePath();
    ctx.fill();

    // 6. Golden Balance Scales Crown - Curved
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-6.5, -31);
    ctx.quadraticCurveTo(0, -33, 6.5, -31);
    ctx.lineTo(6.5, -29);
    ctx.quadraticCurveTo(0, -31, -6.5, -29);
    ctx.closePath();
    ctx.fill();

    // Forehead Balance Gem
    ctx.fillStyle = '#818cf8';
    ctx.beginPath();
    ctx.arc(0, -32, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Concentric Starlight Gyro-Astrolabe & Graviton Disc
    ctx.save();
    ctx.translate(-2, 11);

    // Outer Gyro Ring (rotating)
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 4 + Math.sin(t * 4) * 2, t * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Astral Ring
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 2 + Math.cos(t * 4) * 2, -t * 2, 0, Math.PI * 2);
    ctx.stroke();

    // Center Graviton Core
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#c7d2fe';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // Gravity Scales Staff & Hovering Astral Wand
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, -6, 24, 4); // Golden Wand Shaft

    // Levitation Balance Head
    ctx.fillStyle = '#818cf8';
    ctx.fillRect(18, -12, 4, 16);
    // Glowing Scale Cups
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8;
    ctx.fillRect(16, -14, 8, 3);
    ctx.fillRect(16, 3, 8, 3);
    ctx.shadowBlur = 0;
  }
}
