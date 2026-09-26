/**
 * Cancer - The Crab (Marstrand / Water)
 * Tidal Crab Paladin wielding Carapace Shield & Spiked Harpoon
 */
export class CancerHero {
  static id = 'cancer';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Water Ripple Rings
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.45)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(0, 26, 21 + Math.sin(t * 2) * 3, 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Rising Ocean Foam Bubbles
    for (let i = 0; i < 3; i++) {
      const by = 22 - ((t * 12 + i * 14) % 28);
      const bx = Math.sin(t + i * 2) * 16;
      ctx.fillStyle = 'rgba(186, 230, 253, 0.7)';
      ctx.beginPath();
      ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Kattegat Spiked Crustacean Carapace Shell
    ctx.fillStyle = '#075985';
    ctx.fillRect(-19, -16, 9, 28);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-17, -14, 5, 24);

    // Carapace Ridges & Pearled Barnacles
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(-21, -10, 3, 4);
    ctx.fillRect(-21, -1, 3, 4);
    ctx.fillRect(-21, 8, 3, 4);
  }

  static drawShoulders(ctx, player) {
    // Spiked Carapace Pauldrons - Curved shell dome
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.ellipse(-13, -15, 6.5, 4.8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -15, 6.5, 4.8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Pearl Highlights
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.ellipse(-13, -16.5, 4, 1.8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -16.5, 4, 1.8, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawTorso(ctx, player) {
    // Bohuslän Granite & Deep-Water Chitin Plate - Natural athletic silhouette
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

    // Curved Chitin Breastplate
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.quadraticCurveTo(-11, -7, -7, 0);
    ctx.lineTo(7, 0);
    ctx.quadraticCurveTo(11, -7, 10, -15);
    ctx.quadraticCurveTo(0, -13, -10, -15);
    ctx.closePath();
    ctx.fill();

    // Deep Chitin Inset
    ctx.fillStyle = '#0c4a6e';
    ctx.beginPath();
    ctx.ellipse(0, -6, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Ocean Pearl & Cancer Sigil
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#0ea5e9';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♋', 0, -1);
    ctx.textAlign = 'left';

    // Pearl-Studded Shell Belt - Curved
    ctx.fillStyle = '#075985';
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.quadraticCurveTo(0, 4, 9, 2);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    // Pearl Shell Buckle
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.ellipse(0, 5, 4, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 16 === 0;
    const hairSway = Math.sin(t * 3) * 2;

    // 1. Deep Ocean Navy Hair (Flowing wave locks)
    ctx.fillStyle = '#082f49';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-16 + hairSway, -20, -18 + hairSway, -10);
    ctx.lineTo(-14 + hairSway, -8);
    ctx.quadraticCurveTo(-10 + hairSway, -16, -4, -20);
    ctx.closePath();
    ctx.fill();

    // 2. Neck
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.moveTo(-3, -19);
    ctx.lineTo(3, -19);
    ctx.lineTo(4, -15);
    ctx.lineTo(-4, -15);
    ctx.closePath();
    ctx.fill();

    // 3. Face (Oceanic Pearl-Tinted Fair Skin) - Contoured human head silhouette
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Shimmering Coral Cheek Scales
    ctx.fillStyle = 'rgba(14, 165, 233, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Luminous Aqua Eyes - Almond shaped
    if (isBlink) {
      ctx.strokeStyle = '#0369a1';
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

      ctx.fillStyle = '#0284c7';
      ctx.shadowColor = '#38bdf8';
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

    // Lips - Curved
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -20.5, 1.8, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // 5. Front Navy Wave Bangs & Coral Clips
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-6, -29);
    ctx.quadraticCurveTo(-3, -24, -1, -27);
    ctx.quadraticCurveTo(2, -24, 6, -29);
    ctx.quadraticCurveTo(0, -32, -6, -29);
    ctx.closePath();
    ctx.fill();

    // 6. Pearl Tiara & Small Coral Antennae
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-6.5, -31);
    ctx.quadraticCurveTo(0, -33, 6.5, -31);
    ctx.lineTo(6.5, -29);
    ctx.quadraticCurveTo(0, -31, -6.5, -29);
    ctx.closePath();
    ctx.fill();

    // Forehead Ocean Pearl
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#bae6fd';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(0, -32, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Small Coral Antenna Crests - Curved
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-7, -35, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -35, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Massive Bohuslän Coral Carapace Shield
    ctx.save();
    ctx.translate(-2, 10);
    // Outer Shell Outline
    ctx.fillStyle = '#082f49';
    ctx.fillRect(-7, -10, 14, 20);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-5, -8, 10, 16);
    // Iridescent Pearl Boss
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Coral Edge Studs
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(-6, -11, 2, 2);
    ctx.fillRect(4, -11, 2, 2);
    ctx.fillRect(-6, 9, 2, 2);
    ctx.fillRect(4, 9, 2, 2);
    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // Carapace Shield & Spiked Tidal Harpoon
    // 1. Spiked Harpoon Pole
    ctx.fillStyle = '#075985';
    ctx.fillRect(-2, -5, 26, 4);
    // Harpoon Trident Head
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(20, -12, 8, 18);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(24, -9, 4, 12);
    ctx.shadowBlur = 0;

    // 2. Attached Carapace Buckler Shield
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(4, -14, 10, 18);
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(7, -11, 4, 12);
  }
}
