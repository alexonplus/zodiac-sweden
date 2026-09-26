/**
 * Pisces - The Fishes (Umeå / Mystic Water)
 * Aurora Dream Siren wielding Mystic Dream Orb & Iridescent Koi Fins
 */
export class PiscesHero {
  static id = 'pisces';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Mystic Aurora Water Ring
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.45)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(0, 26, 21 + Math.sin(t * 2.5) * 3, 5.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Twin Spirit Koi Energy Motes
    for (let i = 0; i < 2; i++) {
      const angle = t * 2 + i * Math.PI;
      const kx = Math.cos(angle) * 18;
      const ky = 12 + Math.sin(angle) * 8;
      ctx.fillStyle = i === 0 ? '#5eead4' : '#99f6e4';
      ctx.shadowColor = '#2dd4bf';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(kx, ky, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Shimmering Iridescent Koi Fins & Flowing Aurora Streamers
    ctx.fillStyle = 'rgba(94, 234, 212, 0.75)';
    ctx.beginPath();
    ctx.moveTo(-6, -16);
    ctx.quadraticCurveTo(-26 - speedRatio * 18, -10 + capeFlutter, -34 - speedRatio * 16, 2);
    ctx.lineTo(-22 - speedRatio * 12, 6);
    ctx.quadraticCurveTo(-14 - speedRatio * 8, -4 + capeFlutter, -6, -8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(20, 184, 166, 0.65)';
    ctx.beginPath();
    ctx.moveTo(-6, -10);
    ctx.quadraticCurveTo(-24 - speedRatio * 16, 2 + capeFlutter, -30 - speedRatio * 14, 14);
    ctx.lineTo(-18 - speedRatio * 10, 18);
    ctx.quadraticCurveTo(-12 - speedRatio * 6, 8 + capeFlutter, -6, -2);
    ctx.closePath();
    ctx.fill();
  }

  static drawShoulders(ctx, player) {
    // Pearl Seashell Pauldrons - Curved shell dome
    ctx.fillStyle = '#0f766e';
    ctx.beginPath();
    ctx.ellipse(-13, -15, 6.5, 4.5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -15, 6.5, 4.5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Pearl Highlights
    ctx.fillStyle = '#ccfbf1';
    ctx.beginPath();
    ctx.arc(-13, -15, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(13, -15, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawTorso(ctx, player) {
    // Iridescent Scalemail Corset & Sea-Foam Silk Sash - Natural athletic silhouette
    ctx.fillStyle = '#042f2e';
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

    // Curved Teal Scalemail Breastplate
    ctx.fillStyle = '#0f766e';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.quadraticCurveTo(-11, -7, -7, 0);
    ctx.lineTo(7, 0);
    ctx.quadraticCurveTo(11, -7, 10, -15);
    ctx.quadraticCurveTo(0, -13, -10, -15);
    ctx.closePath();
    ctx.fill();

    // Inner plate
    ctx.fillStyle = '#115e59';
    ctx.beginPath();
    ctx.ellipse(0, -6, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Aurora Pearl & Pisces Sigil
    ctx.fillStyle = '#2dd4bf';
    ctx.shadowColor = '#5eead4';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♓', 0, -1);
    ctx.textAlign = 'left';

    // Pearl-Beaded Ocean Belt - Curved
    ctx.fillStyle = '#134e4a';
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.quadraticCurveTo(0, 4, 9, 2);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    // Pearl Buckle
    ctx.fillStyle = '#5eead4';
    ctx.beginPath();
    ctx.ellipse(0, 5, 4, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 16 === 0;
    const waterFloat = Math.sin(t * 2.8) * 3;

    // 1. Weightless Floating Turquoise Mermaid Hair (Simulated Underwater Physics)
    ctx.fillStyle = '#0f766e';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-18 + waterFloat, -20, -22 + waterFloat * 1.3, -4);
    ctx.lineTo(-17 + waterFloat * 1.3, 0);
    ctx.quadraticCurveTo(-12 + waterFloat, -14, -4, -18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.moveTo(-5, -24);
    ctx.quadraticCurveTo(-14 + waterFloat * 0.8, -16, -18 + waterFloat, -6);
    ctx.lineTo(-14 + waterFloat, -4);
    ctx.quadraticCurveTo(-10 + waterFloat * 0.8, -12, -3, -16);
    ctx.closePath();
    ctx.fill();

    // 2. Translucent Koi Fin Ears - Curved
    ctx.fillStyle = '#5eead4';
    ctx.shadowColor = '#2dd4bf';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.ellipse(-8, -25, 2.5, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -25, 2.5, 4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 3. Neck & Pearl Choker
    ctx.fillStyle = '#ccfbf1';
    ctx.beginPath();
    ctx.moveTo(-3, -19);
    ctx.lineTo(3, -19);
    ctx.lineTo(4, -15);
    ctx.lineTo(-4, -15);
    ctx.closePath();
    ctx.fill();

    // Pearl Choker - Curved
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.arc(0, -17.5, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 4. Face (Iridescent Seafoam Skin) - Contoured human head silhouette
    ctx.fillStyle = '#e6fffa';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Flushed Coral Cheeks & Scales
    ctx.fillStyle = 'rgba(94, 234, 212, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Big Expressive Mystic Star Eyes - Almond shaped
    if (isBlink) {
      ctx.strokeStyle = '#115e59';
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

      // Teal Iris
      ctx.fillStyle = '#0d9488';
      ctx.beginPath();
      ctx.arc(-2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Sparkle Highlight
      ctx.fillStyle = '#5eead4';
      ctx.shadowColor = '#2dd4bf';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(-2.8, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.2, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Lips - Curved
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.arc(0, -20, 1.8, 0, Math.PI);
    ctx.fill();

    // 6. Front Mermaid Wave Bangs - Flowing curves
    ctx.fillStyle = '#14b8a6';
    ctx.beginPath();
    ctx.moveTo(-6, -30);
    ctx.quadraticCurveTo(-3, -24, -1, -27);
    ctx.quadraticCurveTo(2, -24, 6, -30);
    ctx.quadraticCurveTo(0, -33, -6, -30);
    ctx.closePath();
    ctx.fill();

    // 7. Shimmering Sea Pearl Diadem - Curved
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.moveTo(-6.5, -31);
    ctx.quadraticCurveTo(0, -33, 6.5, -31);
    ctx.lineTo(6.5, -29);
    ctx.quadraticCurveTo(0, -31, -6.5, -29);
    ctx.closePath();
    ctx.fill();

    // Forehead Sea Pearl
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ccfbf1';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(0, -32, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Swimming Ethereal Spirit Koi Familiar circling the hand
    ctx.save();
    ctx.translate(-2, 11);

    // Swimming Koi Fish Path
    const koiAngle = t * 4;
    const kx = Math.cos(koiAngle) * 9;
    const ky = Math.sin(koiAngle) * 6;

    ctx.save();
    ctx.translate(kx, ky);
    ctx.rotate(koiAngle + Math.PI / 2);

    // Koi Fish Body
    ctx.fillStyle = '#5eead4';
    ctx.shadowColor = '#2dd4bf';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Koi Tail Fin & Ribbon
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, 2.5);
    ctx.lineTo(-3, 7 + Math.sin(t * 8) * 2);
    ctx.lineTo(3, 7 + Math.sin(t * 8) * 2);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Mystic Pearl in Palm
    ctx.fillStyle = '#ccfbf1';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // Swirling Mystic Water Wand & Floating Aurora Dream Pearl
    const t = player.animTimer || 0;
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(-2, -5, 18, 4); // Mystic Wand Handle

    // Floating Aurora Orb
    const orbBob = Math.sin(t * 4) * 3;
    ctx.save();
    ctx.translate(22, -3 + orbBob);
    ctx.fillStyle = '#5eead4';
    ctx.shadowColor = '#2dd4bf';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-2, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
