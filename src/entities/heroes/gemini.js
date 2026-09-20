/**
 * Gemini - The Twins (Malmö / Wind)
 * Sky Dancer wielding Twin Wind Chakrams
 */
export class GeminiHero {
  static id = 'gemini';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Dual Fluttering Wind Ribbons (Cyan & Violet)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.quadraticCurveTo(-20, -12 + capeFlutter, -32 - speedRatio * 10, -8);
    ctx.stroke();

    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-6, -12);
    ctx.quadraticCurveTo(-22, -6 - capeFlutter, -30 - speedRatio * 10, 2);
    ctx.stroke();
  }

  static drawHelmet(ctx, player) {
    // Dual Cyan / Magenta Split Faceplate + Aerodynamic Wing Antennas
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-8, -33, 8, 8);
    ctx.fillStyle = '#9333ea';
    ctx.fillRect(0, -33, 8, 8);
    // Wing Antennas
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-13, -37, 5, 8);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(8, -37, 5, 8);
    // Dual Eyes
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(-5, -26, 3, 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(2, -26, 3, 2);
  }

  static drawWeapon(ctx, player) {
    // Dual Spinning Wind Chakrams
    const chakramSpin = player.animTimer * 6;
    ctx.save();
    ctx.translate(12, 0);
    ctx.rotate(chakramSpin);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(-2, -2, 4, 4);
    ctx.restore();
  }
}
