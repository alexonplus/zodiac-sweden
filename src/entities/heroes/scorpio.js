/**
 * Scorpio - The Scorpion (Visby / Poison)
 * Toxic Shadow Stalker wielding Dual Venom Daggers & Segmented Stinger Tail
 */
export class ScorpioHero {
  static id = 'scorpio';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Toxic Venom Miasma Ring
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(0, 26, 21 + Math.sin(t * 3) * 3, 5.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Dripping Acid / Venom Particles
    for (let i = 0; i < 3; i++) {
      const vy = 16 + ((t * 14 + i * 12) % 18);
      const vx = Math.sin(t * 2 + i * 2) * 16;
      ctx.fillStyle = '#22c55e';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 6;
      ctx.fillRect(vx - 1, vy - 1, 2.5, 2.5);
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Segmented Chitinous Scorpion Stinger Tail curving overhead
    const t = player.animTimer || 0;
    const sway = Math.sin(t * 3) * 3;

    ctx.fillStyle = '#581c87';
    // Tail Segments
    ctx.fillRect(-14, -8, 6, 6);
    ctx.fillRect(-18, -14, 6, 6);
    ctx.fillRect(-16, -22, 6, 6);
    ctx.fillRect(-10 + sway, -30, 7, 7); // Arch Segment

    // Toxic Stinger Tip
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-4 + sway, -30);
    ctx.lineTo(2 + sway, -28);
    ctx.lineTo(-2 + sway, -24);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  static drawShoulders(ctx, player) {
    // Spiked Shadow Chitin Pauldrons - Curved dome shape
    ctx.fillStyle = '#6b21a8';
    ctx.beginPath();
    ctx.ellipse(-13, -15, 6.5, 4.8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -15, 6.5, 4.8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Toxic Chitin Ridge Highlights
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(-14, -18, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(14, -18, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawTorso(ctx, player) {
    // Dark Shadow Leather Cuirass - Natural athletic silhouette
    ctx.fillStyle = '#2e1065';
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

    // Curved Shadow Breastplate
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.quadraticCurveTo(-11, -7, -7, 0);
    ctx.lineTo(7, 0);
    ctx.quadraticCurveTo(11, -7, 10, -15);
    ctx.quadraticCurveTo(0, -13, -10, -15);
    ctx.closePath();
    ctx.fill();

    // Inner plate
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.ellipse(0, -6, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Venom Core & Scorpio Sigil
    ctx.fillStyle = '#a855f7';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♏', 0, -1);
    ctx.textAlign = 'left';

    // Assassin Belt - Curved
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.quadraticCurveTo(0, 4, 9, 2);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    // Dual Venom Flasks - Curved
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(-6, 5, 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6, 5, 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 17 === 0;
    const hairSway = Math.sin(t * 4) * 2;

    // 1. Spiky Violet/Black Assassin Hair in Back
    ctx.fillStyle = '#2e1065';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-15 + hairSway, -22, -18 + hairSway, -12);
    ctx.lineTo(-14 + hairSway, -10);
    ctx.quadraticCurveTo(-10 + hairSway, -18, -4, -20);
    ctx.closePath();
    ctx.fill();

    // 2. Neck & Shadow Collar
    ctx.fillStyle = '#e9d5ff';
    ctx.beginPath();
    ctx.moveTo(-3, -19);
    ctx.lineTo(3, -19);
    ctx.lineTo(4, -15);
    ctx.lineTo(-4, -15);
    ctx.closePath();
    ctx.fill();

    // 3. Face (Shadow Pale Complexion) - Contoured human head silhouette
    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Dark Assassin Eye Shadow Contours
    ctx.fillStyle = 'rgba(59, 7, 100, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-3, -24, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(3, -24, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Piercing Venom-Green Eyes - Almond shaped
    if (isBlink) {
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-2.5, -24, 2, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2.5, -24, 2, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#22c55e';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.ellipse(-2.5, -24, 2.2, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(2.5, -24, 2.2, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#dcfce7';
      ctx.beginPath();
      ctx.arc(-2.8, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.2, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 5. Lower Face Shadow Mask / Respirator - Curved
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.moveTo(-5, -21);
    ctx.quadraticCurveTo(0, -22, 5, -21);
    ctx.lineTo(4, -18);
    ctx.quadraticCurveTo(0, -17, -4, -18);
    ctx.closePath();
    ctx.fill();

    // Green Filter Core & Glowing Valves
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(0, -19.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Piercing Ear Studs
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(-7, -23, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -23, 1, 0, Math.PI * 2);
    ctx.fill();

    // 6. Jagged Violet Spiky Bangs - Curved sweeps
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.moveTo(-6, -30);
    ctx.quadraticCurveTo(-4, -24, -2, -28);
    ctx.quadraticCurveTo(1, -23, 3, -27);
    ctx.lineTo(6, -30);
    ctx.quadraticCurveTo(0, -33, -6, -30);
    ctx.closePath();
    ctx.fill();

    // Dark Assassin Headband - Curved
    ctx.fillStyle = '#2e1065';
    ctx.beginPath();
    ctx.moveTo(-6.5, -31);
    ctx.quadraticCurveTo(0, -33, 6.5, -31);
    ctx.lineTo(6.5, -29);
    ctx.quadraticCurveTo(0, -31, -6.5, -29);
    ctx.closePath();
    ctx.fill();

    // Purple Sigil on Headband
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(0, -31, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Off-Hand Toxic Shadow Katar & Chitin Parrying Buckler
    ctx.save();
    ctx.translate(-2, 11);

    // Chitin Shell Shield Plate
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(-6, -8, 12, 16);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(-4, -6, 8, 12);

    // Reverse Parrying Blade
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(-2, 6, 4, 8);
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 6;
    ctx.fillRect(-1, 8, 2, 7);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // Dual Serrated Venom Daggers dripping Toxic Acid
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(0, -4, 6, 4); // Grip

    // Serrated Blade
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(6, -6, 14, 6);
    // Acid-Dripping Edge
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 10;
    ctx.fillRect(8, -2, 14, 3);
    ctx.fillRect(20, -5, 4, 4); // Dagger Tip
    ctx.shadowBlur = 0;
  }
}
