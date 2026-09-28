import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';
import { checkRectCollision } from '../engine/Physics.js';

/**
 * Interactive Swedish Mounts & Tactical Vehicles:
 * - Kiruna: 🦌 Armored Cyber-Elk (Pansar-Älg) - Majestic Nordic war-elk with cyber-antlers & gallop physics!
 * - Göteborg: 🛵 Lindholmen Hover-Trike - High-tech port patrol vehicle with dual thrusters
 * - Stockholm: 🦁 Royal Clockwork Chariot - Steampunk brass automaton chariot
 * - Visby: 🐗 Valdemar Runic War-Boar - Heavy armored beast with Viking barding
 *
 * FULL ANTI-CHEAT & BALANCING:
 * - Mounts obey full gravity, momentum, and platform collisions.
 * - Driving into a pit causes the mount to fall into the abyss and be destroyed; rider takes pit hazard damage.
 * - Mounts have a finite Health bar and Stamina bar (no infinite invulnerability!).
 * - Ramming enemies deals balanced damage (35 normal / 15 boss) and consumes stamina.
 * - Boss Arena EMP Forcefield (x >= 10,400) automatically dismounts riders for fair, heroic boss combat.
 * - Responsive rider controls: [W / ▲] Jump, [S / ▼] Dismount.
 */
export class VehicleEntity {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.w = 94;
    this.h = 52;
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = false;
    this.facing = 1;

    // Health & Stamina
    this.maxHp = type === 'elk' ? 200 : (type === 'war_boar' ? 220 : 180);
    this.hp = this.maxHp;
    this.maxStamina = 320;
    this.stamina = this.maxStamina;

    this.rider = null;
    this.mountCooldown = 0;
    this.ramCooldown = 0;
    this.gallopCycle = 0;
    this.isDestroyed = false;
  }

  update(player1, player2, enemies, platforms, movingPlatforms, keys, onShake, onDefeat) {
    if (this.isDestroyed) return;
    if (this.mountCooldown > 0) this.mountCooldown--;
    if (this.ramCooldown > 0) this.ramCooldown--;

    // 1. UNMOUNTED STATE: Check if player can mount
    if (!this.rider) {
      // Natural resting gravity & platform collision while unmounted
      this.vy += 0.55;
      if (this.vy > 14) this.vy = 14;
      this.y += this.vy;
      this.x += this.vx;
      this.vx *= 0.85;

      this.checkPlatformCollisions(platforms, movingPlatforms);

      // Check if candidate player is within mount range (<= 55px)
      if (this.mountCooldown === 0) {
        const candidates = [player1];
        if (player2 && player2.hp > 0) candidates.push(player2);

        for (const p of candidates) {
          if (!p || p.hp <= 0) continue;
          const dist = Math.hypot((p.x + p.w / 2) - (this.x + this.w / 2), (p.y + p.h / 2) - (this.y + this.h / 2));
          if (dist < 60) {
            // Player mounts by walking close or dashing
            this.mount(p);
            break;
          }
        }
      }
      return;
    }

    // 2. MOUNTED STATE: Rider controls the mount
    const p = this.rider;

    // Check if rider died or was defeated
    if (p.hp <= 0) {
      this.dismount(onShake, 'Rider fallen!');
      return;
    }

    // Boss Arena EMP Barrier check: Mounts cannot enter Sector 8 Boss Arena (x >= 10,400)
    if (this.x >= 10380) {
      particles.createDamageNumber(this.x + this.w / 2, this.y - 25, '⚡ EMP BASTION: DISMOUNT! 🚫', '#38bdf8');
      this.dismount(onShake, 'EMP Forcefield: Enter Boss Arena on Foot!');
      return;
    }

    // Determine controls for rider (Player 1 vs Player 2)
    const isP1 = p.pIndex === 1;
    const moveLeft = isP1 ? keys['KeyA'] : keys['ArrowLeft'];
    const moveRight = isP1 ? keys['KeyD'] : keys['ArrowRight'];
    const jumpKey = isP1 ? keys['KeyW'] : keys['ArrowUp'];
    const dismountKey = isP1 ? (keys['KeyS'] || keys['KeyE']) : keys['ArrowDown'];

    // Manual Dismount command
    if (dismountKey) {
      this.dismount(onShake, 'MANUAL DISMOUNT! 👟');
      return;
    }

    // Horizontal Movement
    let moveX = 0;
    if (moveLeft) moveX -= 1;
    if (moveRight) moveX += 1;

    const baseSpeed = this.type === 'elk' ? 8.2 : (this.type === 'hover_bike' ? 9.2 : 7.8);

    if (moveX !== 0) {
      this.facing = moveX;
      this.vx = moveX * baseSpeed;
      this.gallopCycle += 0.35;
      this.stamina = Math.max(0, this.stamina - 0.45);
    } else {
      this.vx *= 0.75;
      if (Math.abs(this.vx) < 0.1) this.vx = 0;
    }

    // Jump mechanics (Fair, requires ground, no infinite air jumps)
    if (jumpKey && this.isGrounded) {
      this.vy = this.type === 'elk' ? -12.5 : -11.0;
      this.isGrounded = false;
      sound.playLaser();
      particles.createSparks(this.x + this.w / 2, this.y + this.h, '#38bdf8', 12);
    }

    // Gravity
    this.vy += 0.55;
    if (this.vy > 14) this.vy = 14;

    this.x += this.vx;
    this.y += this.vy;

    // Platform & Moving Platform collisions (Mount adheres strictly to platform physics)
    this.checkPlatformCollisions(platforms, movingPlatforms);

    // Lock player on mount's saddle
    p.x = this.x + (this.facing > 0 ? 18 : 24);
    p.y = this.y - p.h + 12;
    p.facing = this.facing;
    p.vx = this.vx;
    p.vy = this.vy;
    p.isGrounded = this.isGrounded;

    // 3. PIT HAZARD CHECK: No floating cheat! If mount falls into the abyss:
    if (this.y > 580) {
      sound.playHammer();
      if (onShake) onShake(20);
      particles.createDamageNumber(this.x + this.w / 2, 530, '⚠️ MOUNT LOST IN PIT! -40 HP 🌊', '#ef4444');
      particles.createSparks(this.x + this.w / 2, 540, '#ef4444', 35);

      // Rider takes damage and respawns safely on ledge
      p.hp -= 40;
      if (p.hp <= 0) {
        p.hp = 0;
        sound.playRoar();
        if (onDefeat) onDefeat();
      } else {
        p.x = p.lastSafeX;
        p.y = p.lastSafeY;
        p.vx = 0;
        p.vy = -3;
        p.invulnTime = 90;
      }

      this.isDestroyed = true;
      this.rider = null;
      return;
    }

    // 4. COMBAT & BALANCED RAMMING
    if (this.ramCooldown === 0 && Math.abs(this.vx) > 3) {
      for (const en of enemies) {
        if (!en || en.hp <= 0) continue;
        if (checkRectCollision(this, en)) {
          const isBoss = en.isBoss || en.maxHp > 300;
          const ramDmg = isBoss ? 18 : 35;

          en.hp -= ramDmg;
          en.stunTimer = isBoss ? 15 : 30;
          this.ramCooldown = 28; // ~0.5s cooldown between rams
          this.stamina = Math.max(0, this.stamina - 20);

          sound.playHammer();
          if (onShake) onShake(isBoss ? 14 : 8);
          particles.createSparks(en.x + en.w / 2, en.y + en.h / 2, '#facc15', 18);
          particles.createDamageNumber(en.x + en.w / 2, en.y - 10, `RAM! -${ramDmg} 💥`, '#facc15');

          // Boss recoil: mount bounces back slightly instead of plowing through boss
          if (isBoss) {
            this.vx = -this.facing * 5;
            this.hp -= 25;
            particles.createDamageNumber(this.x + this.w / 2, this.y - 20, 'HEAVY IMPACT! -25 HP', '#ef4444');
          }
          break;
        }
      }
    }

    // 5. Ambient galloping/engine particles
    if (Math.abs(this.vx) > 1 && Math.random() < 0.4) {
      const pColor = this.type === 'elk' ? '#67e8f9' : (this.type === 'hover_bike' ? '#00f0ff' : '#f59e0b');
      particles.createSparks(this.x + (this.facing > 0 ? 10 : this.w - 10), this.y + this.h - 6, pColor, 3);
    }

    // 6. Exhaustion or Damage Break Check
    if (this.hp <= 0) {
      this.dismount(onShake, 'MOUNT BROKEN! 💥');
      this.isDestroyed = true;
    } else if (this.stamina <= 0) {
      this.dismount(onShake, 'MOUNT EXHAUSTED! 💤');
    }
  }

  checkPlatformCollisions(platforms, movingPlatforms) {
    let onPlatform = false;

    // Solid Level Platforms
    for (const p of platforms) {
      if (this.x + this.w > p.x && this.x < p.x + p.w) {
        if (this.y + this.h >= p.y && this.y + this.h <= p.y + 20 && this.vy >= 0) {
          this.y = p.y - this.h;
          this.vy = 0;
          this.isGrounded = true;
          onPlatform = true;
          if (this.rider) {
            this.rider.lastSafeX = this.x;
            this.rider.lastSafeY = this.y;
          }
          break;
        }
      }
    }

    // Moving Platforms
    if (movingPlatforms && movingPlatforms.length > 0) {
      for (const mp of movingPlatforms) {
        if (this.x + this.w > mp.x && this.x < mp.x + mp.w) {
          if (this.y + this.h >= mp.y && this.y + this.h <= mp.y + 22 && this.vy >= 0) {
            this.y = mp.y - this.h;
            this.vy = 0;
            this.x += mp.vx;
            this.isGrounded = true;
            onPlatform = true;
            if (this.rider) {
              this.rider.lastSafeX = this.x;
              this.rider.lastSafeY = this.y;
            }
            break;
          }
        }
      }
    }

    if (!onPlatform) {
      this.isGrounded = false;
    }
  }

  mount(player) {
    this.rider = player;
    this.mountCooldown = 40;
    sound.playRoar();
    const mountName = this.type === 'elk' ? 'CYBER-ÄLG 🦌' : (this.type === 'hover_bike' ? 'HOVER-TRIKE 🛵' : (this.type === 'war_boar' ? 'WAR-BOAR 🐗' : 'CHARIOT 🦁'));
    particles.createDamageNumber(this.x + this.w / 2, this.y - 25, `${mountName} MOUNTED!`, '#facc15');
    particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#facc15', 25);
  }

  dismount(onShake, reason = 'DISMOUNT!') {
    sound.playHammer();
    if (onShake) onShake(10);
    particles.createSparks(this.x + this.w / 2, this.y + this.h / 2, '#ef4444', 25);
    particles.createDamageNumber(this.x + this.w / 2, this.y - 25, reason, '#ef4444');

    if (this.rider) {
      this.rider.invulnTime = 30; // Brief 0.5s grace period upon dismount
      this.rider = null;
    }
    this.mountCooldown = 90; // Prevent instant accidental re-mounting
  }

  takeDamage(amount) {
    this.hp -= amount;
    particles.createDamageNumber(this.x + this.w / 2, this.y - 15, `-${amount} HP`, '#ef4444');
    if (this.hp <= 0) {
      this.hp = 0;
      this.dismount(null, 'DESTROYED! 💥');
      this.isDestroyed = true;
    }
  }

  draw(ctx, camera) {
    if (this.isDestroyed || !camera.isVisible(this.x, this.w)) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.facing < 0) {
      ctx.scale(-1, 1);
      ctx.translate(-this.w, 0);
    }

    if (this.type === 'elk') {
      this.drawCyberElk(ctx);
    } else if (this.type === 'hover_bike') {
      this.drawHoverTrike(ctx);
    } else if (this.type === 'chariot') {
      this.drawClockworkChariot(ctx);
    } else {
      this.drawRunicWarBoar(ctx);
    }

    // Mount Status UI (HP & Stamina Bars + Control Hint)
    this.drawMountHUD(ctx);

    ctx.restore();
  }

  /* ----------------- 1. KIRUNA: ARMORED CYBER-ELK (PANSAR-ÄLG) ----------------- */
  drawCyberElk(ctx) {
    const legOffset = Math.sin(this.gallopCycle) * 12;

    // A. Hind and Front Legs (Galloping stride)
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Back Legs
    ctx.beginPath();
    ctx.moveTo(22, 34);
    ctx.lineTo(16 - legOffset * 0.7, 46);
    ctx.lineTo(12 - legOffset, 52);
    ctx.stroke();

    // Front Legs
    ctx.beginPath();
    ctx.moveTo(70, 34);
    ctx.lineTo(76 + legOffset * 0.7, 46);
    ctx.lineTo(82 + legOffset, 52);
    ctx.stroke();

    // Silver Hooves
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(10 - legOffset, 50, 6, 4);
    ctx.fillRect(80 + legOffset, 50, 6, 4);

    // B. Torso (Deep Brown Woodland Elk Body)
    ctx.fillStyle = '#5c2d11';
    ctx.beginPath();
    ctx.roundRect(14, 18, 62, 22, 8);
    ctx.fill();

    // C. Armored Nordic Wool Blanket & Runic Saddle
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(26, 16, 38, 16);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(28, 20, 34, 4);
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 6;
    ctx.fillRect(38, 26, 14, 4);
    ctx.shadowBlur = 0;

    // D. Powerful Neck & Head
    ctx.fillStyle = '#5c2d11';
    ctx.beginPath();
    ctx.moveTo(64, 22);
    ctx.lineTo(80, 8);
    ctx.lineTo(92, 12);
    ctx.lineTo(74, 28);
    ctx.closePath();
    ctx.fill();

    // E. Cyber Visor Eye (Glowing Cyan)
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(84, 10, 6, 4);
    ctx.shadowBlur = 0;

    // F. Majestic Massive Runic Antlers (Crown of the North)
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.moveTo(78, 8);
    ctx.lineTo(72, -10);
    ctx.lineTo(64, -14);
    ctx.moveTo(72, -10);
    ctx.lineTo(74, -20);
    ctx.lineTo(82, -22);
    ctx.moveTo(78, 8);
    ctx.lineTo(84, -12);
    ctx.lineTo(92, -16);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  /* ----------------- 2. GÖTEBORG: LINDHOLMEN HOVER-TRIKE ----------------- */
  drawHoverTrike(ctx) {
    // Chassis Body
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(10, 20, 74, 22);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(10, 26, 74, 6);

    // Front Fairing & Windscreen
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(70, 20);
    ctx.lineTo(88, 10);
    ctx.lineTo(84, 34);
    ctx.closePath();
    ctx.fill();

    // Dual Glowing Hover-Pads
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 42, 28, 8);
    ctx.fillRect(56, 42, 28, 8);

    // Cyan Jet Thruster Glow
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(18, 48, 24, 3);
    ctx.fillRect(58, 48, 24, 3);

    // Headlight
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 12;
    ctx.fillRect(86, 16, 8, 8);
    ctx.shadowBlur = 0;
  }

  /* ----------------- 3. STOCKHOLM: ROYAL CLOCKWORK CHARIOT ----------------- */
  drawClockworkChariot(ctx) {
    // Steampunk Brass Carriage Body
    ctx.fillStyle = '#78350f';
    ctx.fillRect(12, 14, 70, 26);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(18, 18, 58, 18);

    // Royal Tre Kronor Crest
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('👑 1628', 26, 32);

    // Brass Gear Wheels
    const rot = this.gallopCycle * 1.5;
    this.drawBrassWheel(ctx, 24, 42, rot);
    this.drawBrassWheel(ctx, 70, 42, rot);

    // Steam Exhaust Pipe
    ctx.fillStyle = '#475569';
    ctx.fillRect(8, 6, 8, 16);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(12, 2, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBrassWheel(ctx, x, y, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
    ctx.moveTo(0, -10); ctx.lineTo(0, 10);
    ctx.stroke();
    ctx.restore();
  }

  /* ----------------- 4. VISBY: VALDEMAR RUNIC WAR-BOAR ----------------- */
  drawRunicWarBoar(ctx) {
    const legOffset = Math.sin(this.gallopCycle) * 10;

    // Sturdy Legs
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(18 - legOffset * 0.5, 36, 10, 16);
    ctx.fillRect(66 + legOffset * 0.5, 36, 10, 16);

    // Heavy Bristled Body
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.roundRect(12, 16, 68, 24, 10);
    ctx.fill();

    // Runic Barding Armor Plate
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(26, 18, 40, 18);
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 8;
    ctx.fillRect(32, 24, 28, 4);
    ctx.shadowBlur = 0;

    // Snout and Curved Ivory Tusks
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(76, 22);
    ctx.lineTo(92, 28);
    ctx.lineTo(76, 36);
    ctx.closePath();
    ctx.fill();

    // Sharp Upward Tusks
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(86, 32);
    ctx.lineTo(94, 20);
    ctx.stroke();
  }

  /* ----------------- MOUNT HUD (HP, STAMINA & CONTROLS) ----------------- */
  drawMountHUD(ctx) {
    const barW = this.w;
    const barH = 4;
    const topY = -18;

    // HP Bar
    const hpPct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, topY, barW, barH);
    ctx.fillStyle = hpPct > 0.4 ? '#22c55e' : '#ef4444';
    ctx.fillRect(0, topY, barW * hpPct, barH);

    // Stamina Bar
    const stamPct = Math.max(0, this.stamina / this.maxStamina);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, topY + barH + 1, barW, barH - 1);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, topY + barH + 1, barW * stamPct, barH - 1);

    // Control Prompt if Mounted
    if (this.rider) {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('[W] JUMP  [S] DISMOUNT', 2, topY - 4);
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('STAND NEAR TO RIDE', 2, topY - 4);
    }
  }
}

export class VehicleManager {
  constructor() {
    this.vehicles = [];
  }

  populateForLevel(levelId, levelWidth) {
    this.vehicles.length = 0;
    const groundY = 490;

    let vType = 'hover_bike';
    if (levelId === 'kiruna') vType = 'elk';
    else if (levelId === 'stockholm') vType = 'chariot';
    else if (levelId === 'visby') vType = 'war_boar';

    if (levelId === 'goteborg-2') {
      // Sub-level 1-2 Lindholmen Tech Port hover bikes
      this.vehicles.push(new VehicleEntity(700, groundY - 52, 'hover_bike'));
      this.vehicles.push(new VehicleEntity(4400, groundY - 52, 'hover_bike'));
    } else if (levelWidth > 5000) {
      // Full campaign 12,000px level
      this.vehicles.push(new VehicleEntity(1800, groundY - 52, vType));
      this.vehicles.push(new VehicleEntity(7800, groundY - 52, vType));
    }
  }

  update(player1, player2, enemies, platforms, movingPlatforms, keys, onShake, onDefeat) {
    for (let i = this.vehicles.length - 1; i >= 0; i--) {
      const v = this.vehicles[i];
      v.update(player1, player2, enemies, platforms, movingPlatforms, keys, onShake, onDefeat);
      if (v.isDestroyed && !v.rider) {
        this.vehicles.splice(i, 1);
      }
    }
  }

  draw(ctx, camera) {
    for (const v of this.vehicles) {
      v.draw(ctx, camera);
    }
  }

  clear() {
    this.vehicles.length = 0;
  }
}

export const vehicleManager = new VehicleManager();
