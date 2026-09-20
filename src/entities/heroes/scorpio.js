/**
 * Scorpio - The Scorpion (Visby / Poison)
 * Toxic Shadow Stalker wielding Dual Venom Daggers
 */
export class ScorpioHero {
  static id = 'scorpio';

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Articulated 5-Segment Scorpion Stinger Tail
    const tailWhip = Math.sin(player.animTimer * 2) * 4;
    ctx.strokeStyle = '#7e22ce';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-8, 6);
    ctx.quadraticCurveTo(-24 + tailWhip, -10, -16, -30);
    ctx.lineTo(-4, -34);
    ctx.stroke();

    // Glowing Poison Stinger
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(-4, -34);
    ctx.lineTo(2, -37);
    ctx.lineTo(-2, -30);
    ctx.closePath();
    ctx.fill();
  }

  static drawHelmet(ctx, player) {
    // Obsidian Assassin Cowl + Venom Visor
    ctx.fillStyle = '#581c87';
    ctx.fillRect(-9, -34, 18, 10);
    // Toxic Green Gaze
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-5, -26, 4, 2);
    ctx.fillRect(1, -26, 4, 2);
    // Triangular Filter Mask
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-3, -22, 6, 4);
  }

  static drawWeapon(ctx, player) {
    // Dual Venom Daggers
    ctx.fillStyle = '#581c87';
    ctx.fillRect(-2, -4, 6, 3);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(4, -4, 14, 3);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(16, -3, 4, 2); // Poison Tip
  }
}
