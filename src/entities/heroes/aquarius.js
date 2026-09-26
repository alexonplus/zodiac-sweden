/**
 * Aquarius - The Water-Bearer (Gothenburg / Cyber)
 * Cyber Wave Hacker wielding the Ion Plasma Blaster Cannon & Cyber Drone
 */
export class AquariusHero {
  static id = 'aquarius';

  static drawAura(ctx, player) {
    const t = player.animTimer || 0;
    ctx.save();
    // Holographic Cyber Data Rings on Floor
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 26, 20 + Math.sin(t * 2) * 3, 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Floating Digital Matrix Cubes
    for (let i = 0; i < 3; i++) {
      const angle = t * 1.5 + (i * Math.PI * 2) / 3;
      const rx = Math.cos(angle) * 22;
      const ry = 10 + Math.sin(angle) * 8;
      ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#38bdf8';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.fillRect(rx - 1.5, ry - 1.5, 3, 3);
    }
    ctx.restore();
  }

  static drawBackAccessories(ctx, player, speedRatio, capeFlutter) {
    // Twin Cyber Ion Reactor Jetpack
    ctx.fillStyle = '#082f49';
    ctx.fillRect(-18, -16, 9, 22);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-16, -14, 5, 18);
    // Cyan Neon Power Vents
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(-15, -11, 3, 4);
    ctx.fillRect(-15, -4, 3, 4);
    ctx.fillRect(-15, 3, 3, 4);

    // Ion Thruster Flame Pulse at Base
    const flameH = 4 + Math.sin(player.animTimer * 6) * 3 + speedRatio * 8;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-17, 6);
    ctx.lineTo(-11, 6);
    ctx.lineTo(-14, 6 + flameH);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Flowing Neon Cyan Cyber Scarf Streamer
    ctx.fillStyle = 'rgba(0, 240, 255, 0.75)';
    ctx.beginPath();
    ctx.moveTo(-8, -18);
    ctx.quadraticCurveTo(-24 - speedRatio * 18, -8 + capeFlutter, -32 - speedRatio * 16, 4);
    ctx.lineTo(-24 - speedRatio * 14, 8);
    ctx.quadraticCurveTo(-18 - speedRatio * 10, -2 + capeFlutter, -8, -10);
    ctx.closePath();
    ctx.fill();
  }

  static drawShoulders(ctx, player) {
    // Cybernetic Curved Aerodynamic Pauldrons
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(-13, -15, 6, 4.5, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -15, 6, 4.5, 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Cyan glowing energy fins
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(-13, -16, 4, 1.5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -16, 4, 1.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  static drawTorso(ctx, player) {
    // Nanotech Exosuit Armor - Athletic V-taper with curved chest plates
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

    // Curved Cyan Carapace Breastplate
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.quadraticCurveTo(-11, -7, -7, 0);
    ctx.lineTo(7, 0);
    ctx.quadraticCurveTo(11, -7, 10, -15);
    ctx.quadraticCurveTo(0, -13, -10, -15);
    ctx.closePath();
    ctx.fill();

    // Core Inset
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, -6, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing RAM Core Conduit
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Zodiac Glyph
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('♒', 0, -2);
    ctx.textAlign = 'left';

    // Tactical Utility Belt - curved
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-9, 2);
    ctx.quadraticCurveTo(0, 4, 9, 2);
    ctx.lineTo(9, 7);
    ctx.quadraticCurveTo(0, 9, -9, 7);
    ctx.closePath();
    ctx.fill();

    // Cyan Belt Buckle / Power Cell
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.ellipse(0, 5, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawHead(ctx, player) {
    const t = player.animTimer || 0;
    const isBlink = Math.floor(t * 1.5) % 16 === 0;
    const hairSway = Math.sin(t * 3.5) * 2.5;

    // 1. Back Cyber Ponytail
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-7, -26);
    ctx.quadraticCurveTo(-16 + hairSway, -22, -22 + hairSway * 1.5, -12);
    ctx.lineTo(-18 + hairSway * 1.5, -10);
    ctx.quadraticCurveTo(-12 + hairSway, -20, -5, -22);
    ctx.closePath();
    ctx.fill();

    // Glowing Cyber Data Ribbon inside ponytail
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(-6, -24);
    ctx.quadraticCurveTo(-14 + hairSway, -20, -20 + hairSway * 1.5, -11);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 2. Neck
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-3, -19);
    ctx.lineTo(3, -19);
    ctx.lineTo(4, -15);
    ctx.lineTo(-4, -15);
    ctx.closePath();
    ctx.fill();

    // Neck collar - curved
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-4, -18);
    ctx.quadraticCurveTo(0, -17, 4, -18);
    ctx.lineTo(4.5, -16);
    ctx.quadraticCurveTo(0, -15, -4.5, -16);
    ctx.closePath();
    ctx.fill();

    // 3. Head & Face - Natural contoured human head silhouette
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.quadraticCurveTo(0, -32, 6, -28);
    ctx.quadraticCurveTo(6.5, -23, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, -4.5, -18.5);
    ctx.quadraticCurveTo(-6.5, -23, -6, -28);
    ctx.closePath();
    ctx.fill();

    // Jawline shading & contour
    ctx.fillStyle = 'rgba(203, 213, 225, 0.45)';
    ctx.beginPath();
    ctx.moveTo(-4.5, -18.5);
    ctx.quadraticCurveTo(0, -17, 4.5, -18.5);
    ctx.quadraticCurveTo(0, -19.5, -4.5, -18.5);
    ctx.fill();

    // Ear + Cyber Comm Cuff
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(-6.5, -24, 1.8, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(-7.5, -24, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Cheek Cyber Circuit Tattoo
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(1, -22);
    ctx.lineTo(3.5, -22);
    ctx.lineTo(3.5, -20);
    ctx.stroke();

    // 4. Eyes & Eyebrows
    // Eyebrows - gently arched
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-4.5, -26);
    ctx.quadraticCurveTo(-2.5, -27, -0.5, -26);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.5, -26);
    ctx.quadraticCurveTo(2.5, -27, 4.5, -26);
    ctx.stroke();

    // Eyes - Almond shaped
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

      // Glowing Cyan Iris
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(-2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.5, -24, 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Pupil / Shine
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-2.8, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.2, -24.4, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Contoured Lips / Smirk
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-1.5, -20);
    ctx.quadraticCurveTo(0, -19.5, 2, -20.5);
    ctx.stroke();

    // 5. Front Hair Bangs (Electric Cyan & Navy Spiked Locks)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-7, -33, 14, 5); // Hair base
    ctx.fillStyle = '#00f0ff';
    // Bang strands
    ctx.beginPath();
    ctx.moveTo(-6, -29);
    ctx.lineTo(-3, -24);
    ctx.lineTo(-1, -28);
    ctx.lineTo(2, -24);
    ctx.lineTo(5, -28);
    ctx.lineTo(7, -31);
    ctx.lineTo(-7, -31);
    ctx.closePath();
    ctx.fill();

    // Spiky top strands
    ctx.beginPath();
    ctx.moveTo(-5, -33);
    ctx.lineTo(-2, -37);
    ctx.lineTo(1, -33);
    ctx.lineTo(4, -36);
    ctx.lineTo(6, -33);
    ctx.closePath();
    ctx.fill();

    // 6. Cyber Headset with Comm Antenna & Hologram Wave Visor
    ctx.fillStyle = '#082f49';
    ctx.fillRect(-8, -31, 3, 7);
    // Antenna
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(-8, -38, 1.5, 7);
    // Blinking Comm LED
    const ledGlow = Math.sin(t * 8) > 0;
    ctx.fillStyle = ledGlow ? '#38bdf8' : '#0369a1';
    ctx.fillRect(-8, -39, 2, 2);

    // Hologram Audio Wave Visor resting slightly angled
    ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.fillRect(-5, -26.5, 11, 4);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(-5, -26.5, 11, 4);
    // Mini Wave trace on visor
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-3, -25, 2, 1);
    ctx.fillRect(0, -26, 2, 1);
    ctx.fillRect(3, -25, 2, 1);
  }

  static drawOffHand(ctx, player) {
    const t = player.animTimer || 0;
    // Wrist Holo-Display & Floating Tactical Cyber Drone
    ctx.save();
    // Wrist Holo projector beam
    ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.beginPath();
    ctx.moveTo(-1, 8);
    ctx.lineTo(-14, 0);
    ctx.lineTo(-14, 16);
    ctx.closePath();
    ctx.fill();
    // Holo Screen Grid
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(-16, 2, 10, 12);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(-14, 4, 6, 1.5);
    ctx.fillRect(-14, 7, 4, 1.5);

    // Floating Tactical Companion Drone
    const droneY = -18 + Math.sin(t * 4) * 3;
    const droneX = -16;
    ctx.translate(droneX, droneY);

    // Drone Hull
    ctx.fillStyle = '#082f49';
    ctx.fillRect(-6, -4, 12, 8);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-4, -3, 8, 6);

    // Drone Sensor Eye
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-0.5, -0.5, 1, 1);
    ctx.shadowBlur = 0;

    // Spinning Rotors Left & Right
    const rotorAngle = t * 16;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(-8 + Math.cos(rotorAngle) * 5, -4);
    ctx.moveTo(8, -4);
    ctx.lineTo(8 + Math.cos(rotorAngle) * 5, -4);
    ctx.stroke();

    ctx.restore();
  }

  static drawWeapon(ctx, player) {
    // High-Tech Ion Plasma Blaster Cannon with Energy Coils & Laser Sight
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-2, -6, 24, 8); // Receiver
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(4, -5, 14, 6); // Barrel Body

    // Glowing Plasma Coils
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(6, -4, 3, 4);
    ctx.fillRect(11, -4, 3, 4);
    ctx.fillRect(16, -4, 3, 4);

    // Muzzle & Blue Laser Sight Emitter
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(22, -5, 4, 6);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(26, -3, 3, 2);
    ctx.shadowBlur = 0;
  }
}
