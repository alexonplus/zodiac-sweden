/**
 * Gemini - The Twins (Malmö / Wind)
 * Speed Skirmisher wielding Twin Aerial Chakrams & Zephyr Streamers
 */
export class GeminiHero {
  static id = 'gemini';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Swirling Wind Vortex Rings
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 26, 20 + Math.sin(t * 4) * 4, 5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Swirling Feather / Breeze Sparks
    for (let i = 0; i < 3; i++) {
      const angle = -t * 3 + (i * Math.PI * 2) / 3;
      const rx = Math.cos(angle) * 18;
      const ry = 8 + Math.sin(angle) * 12;
      ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#c084fc';
      ctx.fillRect(rx - 1, ry - 1, 2.5, 2.5);
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Twin Floating Zephyr Ribbons (Cyan Left, Violet Right)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.beginPath();
    ctx.moveTo(-6, -16);
    ctx.quadraticCurveTo(-26 - speedRatio * 20, -12 + capeFlutter, -36 - speedRatio * 18, 0);
    ctx.lineTo(-24 - speedRatio * 14, 4);
    ctx.quadraticCurveTo(-16 - speedRatio * 10, -4 + capeFlutter, -6, -8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(192, 132, 252, 0.7)';
    ctx.beginPath();
    ctx.moveTo(-6, -12);
    ctx.quadraticCurveTo(-24 - speedRatio * 18, 0 + capeFlutter, -32 - speedRatio * 16, 12);
    ctx.lineTo(-20 - speedRatio * 12, 16);
    ctx.quadraticCurveTo(-14 - speedRatio * 8, 6 + capeFlutter, -6, -4);
    ctx.closePath();
    ctx.fill();
  }

  static drawShoulders(ctx, player) {
    // Aerodynamic Winged Pauldrons - Curved wing arcs
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(-13, -15, 6, 4.5, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    ctx.ellipse(13, -15, 6, 4.5, 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Feather light highlights
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(-13, -16, 4, 1.5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.ellipse(13, -16, 4, 1.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawTorso(ctx, player) {
    // Split Dualist Tunic (Wind Azure / Astral Lilac) - Natural athletic silhouette
    ctx.fillStyle = '#082f49';
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

    // Left Half Azure - Curved
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.quadraticCurveTo(-11, -7, -7, 0);
    ctx.lineTo(0, 0);
    ctx.quadraticCurveTo(0, -7, 0, -14);
    ctx.quadraticCurveTo(-5, -14.5, -10, -15);
    ctx.closePath();
    ctx.fill();

    // Right Half Violet - Curved
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.quadraticCurveTo(0, -7, 0, 0);
    ctx.lineTo(7, 0);
    ctx.quadraticCurveTo(11, -7, 10, -15);
    ctx.quadraticCurveTo(5, -14.5, 0, -14);
    ctx.closePath();
    ctx.fill();

    // Gemini Glyph & Silver Sash
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♊', 0, -2);
    ctx.textAlign = 'left';

    // Silver Speed Belt - Curved
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.quadraticCurveTo(0, 4, 9, 2);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    // Cyan Wind Core
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(0, 5, 3.8, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 15 === 0;
    const tailWave1 = Math.sin(t * 5) * 3;
    const tailWave2 = Math.cos(t * 5) * 3;

    // 1. Dual Twin-Tails (Left Azure, Right Lilac)
    // Left Cyan Twin-Tail
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-7, -26);
    ctx.quadraticCurveTo(-18 + tailWave1, -24, -22 + tailWave1 * 1.4, -14);
    ctx.lineTo(-18 + tailWave1 * 1.4, -12);
    ctx.quadraticCurveTo(-14 + tailWave1, -20, -5, -22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-7, -25, 2, 0, Math.PI * 2);
    ctx.fill();

    // Right Violet Twin-Tail
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.moveTo(5, -26);
    ctx.quadraticCurveTo(16 + tailWave2, -24, 20 + tailWave2 * 1.4, -14);
    ctx.lineTo(16 + tailWave2 * 1.4, -12);
    ctx.quadraticCurveTo(12 + tailWave2, -20, 3, -22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(6, -25, 2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Neck
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-3, -19);
    ctx.lineTo(3, -19);
    ctx.lineTo(4, -15);
    ctx.lineTo(-4, -15);
    ctx.closePath();
    ctx.fill();

    // 3. Face (Fair Skin) - Contoured human head silhouette
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Rosy Cheeks
    ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Bicolor Expressive Eyes - Almond shaped
    if (isBlink) {
      ctx.strokeStyle = '#0f172a';
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

      // Left Eye: Cyan Iris
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(-2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-2.8, -24.4, 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Right Eye: Amethyst Violet Iris
      ctx.fillStyle = '#9333ea';
      ctx.beginPath();
      ctx.arc(2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(2.2, -24.4, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Little Smile
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -20.5, 1.8, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // 5. Dual-Color Front Bangs (Cyan Left, Lilac Right)
    // Left side cyan bangs
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-6, -33);
    ctx.lineTo(0, -33);
    ctx.lineTo(-1, -27);
    ctx.lineTo(-3, -29);
    ctx.lineTo(-5, -26);
    ctx.closePath();
    ctx.fill();

    // Right side violet bangs
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.moveTo(0, -33);
    ctx.lineTo(6, -33);
    ctx.lineTo(5, -26);
    ctx.lineTo(3, -29);
    ctx.lineTo(1, -27);
    ctx.closePath();
    ctx.fill();

    // 6. Silver Wing Headband Circlet
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-7, -32, 14, 2);
    // Silver Wing Ears
    ctx.fillRect(-10, -35, 4, 5);
    ctx.fillRect(6, -35, 4, 5);
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Off-Hand Twin Aerial Chakram (Amethyst Violet)
    ctx.save();
    ctx.translate(-2, 11);
    ctx.strokeStyle = '#c084fc';
    ctx.shadowColor = '#9333ea';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Spinning Blade Teeth
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
      const ang = -t * 6 + (i * Math.PI) / 2;
      const tx = Math.cos(ang) * 8;
      const ty = Math.sin(ang) * 8;
      ctx.fillRect(tx - 1, ty - 1, 2, 2);
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // Twin Glowing Wind Chakrams with Spinning Blade Teeth
    const t = player.animTimer || 0;
    ctx.save();
    ctx.translate(14, 0);

    // Main Outer Ring
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Ring
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Spinning Blade Teeth
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
      const ang = t * 6 + (i * Math.PI) / 2;
      const tx = Math.cos(ang) * 11;
      const ty = Math.sin(ang) * 11;
      ctx.fillRect(tx - 1.5, ty - 1.5, 3, 3);
    }
    ctx.restore();
  }
}
