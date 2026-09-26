/**
 * Sagittarius - The Archer (Karlstad / Cosmic Fire)
 * Sunlit Stellar Ranger wielding the Solar Plasma Bow & Blazing Feather
 */
export class SagittariusHero {
  static id = 'sagittarius';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Solar Cosmic Sparkle Ring
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.45)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(0, 26, 21 + Math.sin(t * 3) * 3, 5.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Cosmic Ember Sparks
    for (let i = 0; i < 3; i++) {
      const angle = t * 2.5 + (i * Math.PI * 2) / 3;
      const rx = Math.cos(angle) * 18;
      const ry = 10 + Math.sin(angle) * 10;
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 6;
      ctx.fillRect(rx - 1, ry - 1, 2.5, 2.5);
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Solar Gilded Quiver & Flowing Amber Mantle
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(-17, -20, 8, 22); // Quiver Tube
    // Arrow Fletchings
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-18, -26, 3, 7);
    ctx.fillRect(-14, -28, 3, 9);
    ctx.fillRect(-11, -25, 3, 6);

    // Amber Mantle
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-7, -16);
    ctx.quadraticCurveTo(-26 - speedRatio * 18, -6 + capeFlutter, -32 - speedRatio * 16, 12);
    ctx.lineTo(-22 - speedRatio * 12, 16);
    ctx.quadraticCurveTo(-16 - speedRatio * 8, 2 + capeFlutter, -7, -2);
    ctx.closePath();
    ctx.fill();
  }

  static drawShoulders(ctx, player) {
    // Sunburst Archer Pauldrons - Curved dome shape
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.ellipse(-13, -15, 6.5, 4.5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -15, 6.5, 4.5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Solar Gold Rim
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(-13, -16.5, 4, 1.8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -16.5, 4, 1.8, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawTorso(ctx, player) {
    // Solar Forged Ranger Cuirass - Natural athletic silhouette
    ctx.fillStyle = '#431407';
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

    // Curved Amber Breastplate
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.quadraticCurveTo(-11, -7, -7, 0);
    ctx.lineTo(7, 0);
    ctx.quadraticCurveTo(11, -7, 10, -15);
    ctx.quadraticCurveTo(0, -13, -10, -15);
    ctx.closePath();
    ctx.fill();

    // Inner plate
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.ellipse(0, -6, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Radiant Solar Core & Sagittarius Sigil
    ctx.fillStyle = '#fb923c';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♐', 0, -1);
    ctx.textAlign = 'left';

    // Ranger Belt - Curved
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.quadraticCurveTo(0, 4, 9, 2);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    // Golden Ranger Buckle
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(0, 5, 4, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 18 === 0;
    const hairSway = Math.sin(t * 4) * 2.5;

    // 1. Windblown Golden Blonde Ranger Hair in Back
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-14 + hairSway, -22, -18 + hairSway, -12);
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

    // 3. Face (Outdoor Bronzed Skin) - Contoured human head silhouette
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // 4. Archer Eye Left (Amber) & Cyber Targeting Monocle Right
    if (isBlink) {
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-2.5, -24, 2, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-2.5, -24, 2.4, 1.7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(-2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(-2.8, -24.4, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Right Eye: Glowing Round Cyber Targeting Lens
    ctx.fillStyle = '#082f49';
    ctx.beginPath();
    ctx.arc(2.5, -24, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Red laser targeting dot
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(2.5, -24, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Sun-tanned cheek tone & confident smirk
    ctx.fillStyle = 'rgba(234, 88, 12, 0.25)';
    ctx.beginPath();
    ctx.ellipse(-4, -22.5, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-1.5, -20);
    ctx.quadraticCurveTo(0.5, -19.5, 2.5, -20.5);
    ctx.stroke();

    // Feathered Ear Trinket
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(-7, -23, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Golden Blonde Front Bangs - Flowing
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-6, -30);
    ctx.quadraticCurveTo(-3, -25, -1, -28);
    ctx.quadraticCurveTo(2, -25, 6, -30);
    ctx.quadraticCurveTo(0, -33, -6, -30);
    ctx.closePath();
    ctx.fill();

    // 6. Amber Ranger Hood Edge & Blazing Phoenix Feather
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.moveTo(-6.5, -31);
    ctx.quadraticCurveTo(0, -33, 6.5, -31);
    ctx.lineTo(6.5, -29);
    ctx.quadraticCurveTo(0, -31, -6.5, -29);
    ctx.closePath();
    ctx.fill();

    // Blazing Phoenix Feather Crest - Curved
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-1, -33);
    ctx.quadraticCurveTo(0, -42, 1.5, -42);
    ctx.quadraticCurveTo(2.5, -38, 2.5, -33);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0.8, -38, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Solar Archer Forearm Bracer & Holo Quiver Hologram
    ctx.save();
    ctx.translate(-2, 11);

    // Hard-Light Targeting Bracer
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(-5, -7, 10, 14);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-3, -5, 6, 10);

    // Holo-Arrow Light Core
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;
    ctx.fillRect(-1, -8, 2, 16);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // Solar Plasma Bow with Glowing Energy String
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(10, -2, 17, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#ea580c';
    ctx.stroke();

    // Laser String
    ctx.beginPath();
    ctx.moveTo(15, -15);
    ctx.lineTo(15, 11);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#00f0ff';
    ctx.stroke();

    // Charged Cosmic Arrow
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(4, -3, 20, 2.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(22, -4, 4, 4.5);
    ctx.shadowBlur = 0;
  }
}
