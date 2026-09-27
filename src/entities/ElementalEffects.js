import { sound } from '../engine/Audio.js';
import { particles } from '../engine/Particles.js';

/**
 * ELEMENTAL EFFECTS ENGINE
 * Manages dynamic, world-space elemental phenomena:
 * - Tectonic Earth Pillars (erupt from the ground, launch sky-high & petrify)
 * - Howling Tornadoes (cyclonic funnel clouds that vacuum, spin & blow enemies across the screen)
 * - Great Kattegat Tsunami (towering curling wave that sweeps & freezes enemies solid in ice)
 * - Volcanic Magma Geysers (towering lava pillars that ignite and incinerate)
 * - Yggdrasil Briar Thickets (thorny entangling roots that bind & life-drain)
 * - Solar Corona Beams (heavenly pillars of blinding sunlight)
 */
export class ElementalEffectsManager {
  constructor() {
    this.pillars = [];
    this.tornadoes = [];
    this.tsunamis = [];
    this.geysers = [];
    this.briars = [];
    this.solarBeams = [];
    this.singularities = [];
  }

  clear() {
    this.pillars.length = 0;
    this.tornadoes.length = 0;
    this.tsunamis.length = 0;
    this.geysers.length = 0;
    this.briars.length = 0;
    this.solarBeams.length = 0;
    this.singularities.length = 0;
  }

  // ========================================================
  // 1. EARTH: Tectonic Stone Pillars & Monoliths
  // ========================================================
  spawnEarthPillars(startX, groundY, facing, count = 4, spacing = 55, damage = 55, owner = 1) {
    sound.playEarthQuake();
    for (let i = 0; i < count; i++) {
      this.pillars.push({
        x: startX + facing * (i + 1) * spacing,
        groundY,
        width: 36 + Math.random() * 12,
        maxHeight: 85 + Math.random() * 45,
        height: 0,
        delay: i * 5, // Staggered ripple eruption
        damage,
        owner,
        facing,
        life: 75,
        hasHit: false,
        color: '#b45309',
        peakColor: '#d97706',
        rubbleTimer: 0
      });
    }
  }

  // ========================================================
  // 2. WIND: Howling Cyclone Tornadoes & Gale Blasts
  // ========================================================
  spawnTornado(x, y, facing, damage = 40, duration = 140, owner = 1, isUltimate = false) {
    sound.playWindGale();
    this.tornadoes.push({
      x,
      y,
      vx: facing * (isUltimate ? 3.8 : 4.5),
      damage,
      owner,
      facing,
      life: duration,
      maxLife: duration,
      width: isUltimate ? 110 : 75,
      height: isUltimate ? 240 : 180,
      isUltimate,
      animTimer: 0
    });
  }

  // ========================================================
  // 3. WATER & ICE: Great Tsunami & Glacial Deluge
  // ========================================================
  spawnTsunami(x, groundY, facing, damage = 65, duration = 120, owner = 1, isUltimate = false) {
    sound.playWave();
    if (isUltimate) sound.playFreeze();
    this.tsunamis.push({
      x,
      groundY,
      vx: facing * (isUltimate ? 6.5 : 7.5),
      damage,
      owner,
      facing,
      life: duration,
      maxLife: duration,
      width: isUltimate ? 140 : 95,
      height: isUltimate ? 240 : 170,
      isUltimate,
      animTimer: 0
    });
  }

  // ========================================================
  // 4. FIRE: Volcanic Magma Geysers
  // ========================================================
  spawnMagmaGeysers(startX, groundY, facing, count = 3, spacing = 65, damage = 50, owner = 1) {
    sound.playFireBurst();
    for (let i = 0; i < count; i++) {
      this.geysers.push({
        x: startX + facing * (i + 1) * spacing,
        groundY,
        width: 48,
        height: 0,
        maxHeight: 180 + Math.random() * 50,
        delay: i * 7,
        damage,
        owner,
        life: 70,
        hasHit: false,
        animTimer: 0
      });
    }
  }

  // ========================================================
  // 5. NATURE: Yggdrasil Briar Thickets
  // ========================================================
  spawnBriarPatch(x, groundY, damage = 35, duration = 180, owner = 1) {
    sound.playWave();
    this.briars.push({
      x,
      groundY,
      width: 140,
      damage,
      duration,
      owner,
      life: duration,
      animTimer: 0
    });
  }

  // ========================================================
  // 6. SOLAR & COSMIC: Solar Corona Beams & Singularities
  // ========================================================
  spawnSolarBeam(x, groundY, width = 65, damage = 70, duration = 65, owner = 1) {
    sound.playLaser();
    this.solarBeams.push({
      x,
      groundY,
      width,
      damage,
      duration,
      owner,
      life: duration,
      animTimer: 0
    });
  }

  spawnSingularity(x, y, damage = 80, duration = 100, owner = 1) {
    sound.playWave();
    this.singularities.push({
      x,
      y,
      damage,
      duration,
      owner,
      life: duration,
      radius: 180,
      animTimer: 0
    });
  }

  // ========================================================
  // UPDATE LOOP (Physics, Collisions, Superpower Reactions)
  // ========================================================
  update(enemies, onShake, onSynergyHit, p1, p2, isPvP = false) {
    // ------------------------------------------------------
    // 1. Earth Pillars Update
    // ------------------------------------------------------
    for (let i = this.pillars.length - 1; i >= 0; i--) {
      const p = this.pillars[i];
      if (p.delay > 0) {
        p.delay--;
        continue;
      }

      // Rising animation with violent tectonic emergence
      if (p.height < p.maxHeight) {
        p.height = Math.min(p.maxHeight, p.height + 22);
        if (onShake && p.height === 22) onShake(6);
        particles.createEarthDebris(p.x, p.groundY, 4);
      }

      // Hit detection while rising
      if (!p.hasHit && p.height >= p.maxHeight * 0.4) {
        p.hasHit = true;
        sound.playEarthQuake();
        if (onShake) onShake(14);
        particles.createEarthDebris(p.x, p.groundY, 16);

        // Check enemies caught on or above the erupting pillar
        for (const en of enemies) {
          if (Math.abs((en.x + en.w / 2) - p.x) < p.width + en.w / 2) {
            const hitResult = en.applyHit ? en.applyHit(p.damage, 'earth', p.owner, false, true) : null;
            if (!hitResult) en.hp -= p.damage;

            // LAUNCH SKY-HIGH & PETRIFY IN SOLID STONE!
            en.vy = -14;
            en.vx = p.facing * 5;
            en.petrifiedTimer = 110;
            en.stunTimer = 110;
            particles.createDamageNumber(en.x + en.w / 2, en.y - 20, `🪨 TECTONIC SHIFT! -${p.damage}`, '#d97706');
            if (onSynergyHit) onSynergyHit(en, 'earth', p.owner, p.damage);
          }
        }
      }

      p.life--;
      if (p.life <= 0) {
        particles.createEarthDebris(p.x, p.groundY - p.height / 2, 8);
        this.pillars.splice(i, 1);
      }
    }

    // ------------------------------------------------------
    // 2. Tornadoes Update (Vacuum & Blow Away!)
    // ------------------------------------------------------
    for (let i = this.tornadoes.length - 1; i >= 0; i--) {
      const t = this.tornadoes[i];
      t.x += t.vx;
      t.animTimer += 0.22;
      t.life--;

      // Spawn wind spirals & leaves
      if (Math.random() < 0.6) {
        particles.createWindGale(t.x, t.y - Math.random() * t.height, t.facing, 2);
      }
      if (Math.random() < 0.3) {
        particles.createLeaves(t.x, t.y - Math.random() * t.height, 2);
      }

      // VACUUM & BLOW AWAY FORCES:
      const pullRadius = t.width * 2.2;
      for (const en of enemies) {
        const dx = t.x - (en.x + en.w / 2);
        const dy = (t.y - t.height / 2) - (en.y + en.h / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < pullRadius) {
          // Continuous suction towards cyclone eye
          const pullForce = (1 - dist / pullRadius) * 6.5;
          en.x += Math.sign(dx) * pullForce;

          // Lift into the air
          en.vy = -3.8;
          en.stunTimer = 35;

          // If inside the funnel cloud: shred and take ticking damage
          if (dist < t.width * 0.9) {
            if (t.life % 14 === 0) {
              en.hp -= Math.floor(t.damage * 0.3);
              particles.createDamageNumber(en.x + en.w / 2, en.y, `🌪️ -${Math.floor(t.damage * 0.3)}`, '#38bdf8');
              particles.createSparks(en.x + en.w / 2, en.y + en.h / 2, '#38bdf8', 4);
              if (onSynergyHit) onSynergyHit(en, 'wind', t.owner, Math.floor(t.damage * 0.3));
            }

            // GALE FORCE BLOW AWAY: violent forward/upward propulsion!
            en.windBlowTimer = 55;
            en.windBlowVx = t.facing * 16;
            en.vy = -7;
          }
        }
      }

      if (t.life <= 0) {
        particles.createWindGale(t.x, t.y - t.height / 2, t.facing, 12);
        this.tornadoes.splice(i, 1);
      }
    }

    // ------------------------------------------------------
    // 3. Tsunamis Update (Sweeping Wave & FREEZE SOLID!)
    // ------------------------------------------------------
    for (let i = this.tsunamis.length - 1; i >= 0; i--) {
      const ts = this.tsunamis[i];
      ts.x += ts.vx;
      ts.animTimer += 0.2;
      ts.life--;

      if (Math.random() < 0.5) {
        particles.createSparks(ts.x + (Math.random() - 0.5) * 30, ts.groundY - Math.random() * ts.height, '#e0f2fe', 3);
      }

      // Wave hit & freezing
      for (const en of enemies) {
        if (Math.abs((en.x + en.w / 2) - ts.x) < ts.width / 2 + en.w / 2 && en.y + en.h >= ts.groundY - ts.height) {
          // Swept along with the wave
          en.x += ts.vx * 1.1;
          en.vx = ts.vx;
          en.vy = -4;

          // FREEZE SOLID IN AN ICE BLOCK!
          if (!en.frozenTimer || en.frozenTimer < 90) {
            en.frozenTimer = ts.isUltimate ? 140 : 100;
            en.stunTimer = en.frozenTimer;
            sound.playFreeze();
            particles.createIceShards(en.x + en.w / 2, en.y + en.h / 2, 14);
            particles.createDamageNumber(en.x + en.w / 2, en.y - 20, `❄️ FROZEN SOLID! -${ts.damage}`, '#00f0ff');
            en.hp -= ts.damage;
            if (onSynergyHit) onSynergyHit(en, 'water', ts.owner, ts.damage);
          }
        }
      }

      if (ts.life <= 0) {
        particles.createSparks(ts.x, ts.groundY - ts.height / 2, '#0ea5e9', 25);
        this.tsunamis.splice(i, 1);
      }
    }

    // ------------------------------------------------------
    // 4. Volcanic Magma Geysers Update
    // ------------------------------------------------------
    for (let i = this.geysers.length - 1; i >= 0; i--) {
      const g = this.geysers[i];
      if (g.delay > 0) {
        g.delay--;
        continue;
      }

      g.animTimer += 0.25;
      if (g.height < g.maxHeight) {
        g.height = Math.min(g.maxHeight, g.height + 28);
        particles.createFlame(g.x, g.groundY - g.height, 4);
      }

      if (!g.hasHit && g.height >= g.maxHeight * 0.5) {
        g.hasHit = true;
        sound.playFireBurst();
        if (onShake) onShake(10);
        for (const en of enemies) {
          if (Math.abs((en.x + en.w / 2) - g.x) < g.width / 2 + en.w / 2) {
            en.hp -= g.damage;
            en.vy = -12; // Erupted skyward
            en.burnTimer = 160; // Engulfed in real flames
            particles.createDamageNumber(en.x + en.w / 2, en.y - 18, `🔥 MAGMA ERUPTION! -${g.damage}`, '#ea580c');
            particles.createFlame(en.x + en.w / 2, en.y + en.h / 2, 12);
            if (onSynergyHit) onSynergyHit(en, 'fire', g.owner, g.damage);
          }
        }
      }

      g.life--;
      if (g.life <= 0) this.geysers.splice(i, 1);
    }

    // ------------------------------------------------------
    // 5. Yggdrasil Briar Patches Update (Root & Drain)
    // ------------------------------------------------------
    for (let i = this.briars.length - 1; i >= 0; i--) {
      const b = this.briars[i];
      b.animTimer += 0.1;
      b.life--;

      for (const en of enemies) {
        if (Math.abs((en.x + en.w / 2) - b.x) < b.width / 2 + en.w / 2 && en.isGrounded) {
          en.rootedTimer = 130;
          en.vx = 0;
          if (b.life % 25 === 0) {
            en.hp -= 8;
            particles.createDamageNumber(en.x + en.w / 2, en.y - 12, '🌿 BRIAR DRAIN -8', '#4ade80');
            particles.createLeaves(en.x + en.w / 2, en.y + en.h - 10, 3);
          }
        }
      }

      if (b.life <= 0) this.briars.splice(i, 1);
    }

    // ------------------------------------------------------
    // 6. Solar Beams Update (Blinding Sun Columns)
    // ------------------------------------------------------
    for (let i = this.solarBeams.length - 1; i >= 0; i--) {
      const sb = this.solarBeams[i];
      sb.animTimer += 0.3;
      sb.life--;

      for (const en of enemies) {
        if (Math.abs((en.x + en.w / 2) - sb.x) < sb.width / 2 + en.w / 2) {
          if (sb.life % 12 === 0) {
            const dmg = Math.floor(sb.damage * 0.35);
            en.hp -= dmg;
            en.burnTimer = 140;
            particles.createSparks(en.x + en.w / 2, en.y + en.h / 2, '#facc15', 5);
            particles.createDamageNumber(en.x + en.w / 2, en.y, `☀️ SOLAR BURN! -${dmg}`, '#facc15');
            if (onSynergyHit) onSynergyHit(en, 'solar', sb.owner, dmg);
          }
        }
      }

      if (sb.life <= 0) this.solarBeams.splice(i, 1);
    }

    // ------------------------------------------------------
    // 7. Singularities Update (Cosmic Black Hole)
    // ------------------------------------------------------
    for (let i = this.singularities.length - 1; i >= 0; i--) {
      const sg = this.singularities[i];
      sg.animTimer += 0.3;
      sg.life--;

      for (const en of enemies) {
        const dx = sg.x - (en.x + en.w / 2);
        const dy = sg.y - (en.y + en.h / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < sg.radius) {
          const force = (1 - dist / sg.radius) * 7;
          en.x += Math.sign(dx) * force;
          en.y += Math.sign(dy) * force;
          en.vx = 0;
          en.vy = 0;
          en.stunTimer = 20;
        }
      }

      // Detonation at end
      if (sg.life <= 1) {
        sound.playUlt();
        if (onShake) onShake(22);
        for (const en of enemies) {
          const d = Math.hypot(sg.x - (en.x + en.w / 2), sg.y - (en.y + en.h / 2));
          if (d < sg.radius) {
            en.hp -= sg.damage;
            en.vx = Math.sign(en.x - sg.x) * 16;
            en.vy = -10;
            particles.createDamageNumber(en.x + en.w / 2, en.y - 20, `🌌 SUPERNOVA! -${sg.damage}`, '#a855f7');
          }
        }
        particles.createSparks(sg.x, sg.y, '#c084fc', 40);
        this.singularities.splice(i, 1);
      }
    }
  }

  // ========================================================
  // RENDER IN WORLD SPACE
  // ========================================================
  draw(ctx) {
    const t = performance.now() * 0.003;

    // 1. Draw Earth Pillars
    for (const p of this.pillars) {
      if (p.delay > 0 || p.height <= 0) continue;
      ctx.save();
      const topY = p.groundY - p.height;

      // Drop shadow / crater base
      ctx.fillStyle = 'rgba(20, 10, 5, 0.45)';
      ctx.beginPath();
      ctx.ellipse(p.x, p.groundY, p.width * 0.8, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Stone Pillar Body: multi-faceted geometric monolith
      const grad = ctx.createLinearGradient(p.x - p.width / 2, 0, p.x + p.width / 2, 0);
      grad.addColorStop(0, '#592909');
      grad.addColorStop(0.35, '#92400e');
      grad.addColorStop(0.7, '#b45309');
      grad.addColorStop(1, '#d97706');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(p.x - p.width * 0.5, p.groundY);
      ctx.lineTo(p.x - p.width * 0.35, topY + 12);
      ctx.lineTo(p.x, topY); // Jagged peak
      ctx.lineTo(p.x + p.width * 0.35, topY + 14);
      ctx.lineTo(p.x + p.width * 0.5, p.groundY);
      ctx.closePath();
      ctx.fill();

      // Sharp highlight facet
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(p.x - p.width * 0.1, p.groundY);
      ctx.lineTo(p.x, topY);
      ctx.lineTo(p.x + p.width * 0.25, topY + 14);
      ctx.lineTo(p.x + p.width * 0.15, p.groundY);
      ctx.closePath();
      ctx.fill();

      // Runic glowing fissures
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(p.x - 4, p.groundY - 10);
      ctx.lineTo(p.x + 2, topY + 30);
      ctx.lineTo(p.x - 2, topY + 15);
      ctx.stroke();

      ctx.restore();
    }

    // 2. Draw Tornadoes (Animated Swirling Cyclone Funnel)
    for (const tr of this.tornadoes) {
      ctx.save();
      const alpha = Math.min(1.0, tr.life / (tr.maxLife * 0.2));
      ctx.globalAlpha = alpha * 0.85;

      const topY = tr.y - tr.height;
      const botY = tr.y;

      // Draw multi-layered swirling funnel segments
      const segments = 12;
      for (let s = 0; s < segments; s++) {
        const segPct = s / segments;
        const curY = topY + (botY - topY) * segPct;
        const curWidth = tr.width * (0.3 + (1 - segPct) * 0.9);
        const sway = Math.sin(t * 8 + s * 0.6) * 16 * (1 - segPct);

        const swirlGrad = ctx.createLinearGradient(tr.x - curWidth + sway, curY, tr.x + curWidth + sway, curY);
        swirlGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        swirlGrad.addColorStop(0.3, 'rgba(224, 242, 254, 0.7)');
        swirlGrad.addColorStop(0.7, 'rgba(2, 132, 199, 0.8)');
        swirlGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = swirlGrad;
        ctx.beginPath();
        ctx.ellipse(tr.x + sway, curY, curWidth, 8 + (1 - segPct) * 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Outer wind ribbon spiral
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let step = 0; step <= 24; step++) {
        const pStep = step / 24;
        const wy = topY + (botY - topY) * pStep;
        const wWidth = tr.width * (0.3 + (1 - pStep) * 0.8);
        const wx = tr.x + Math.sin(t * 12 + step * 0.8) * wWidth;
        if (step === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();

      ctx.restore();
    }

    // 3. Draw Tsunamis (Towering Ocean Wave & Glacial Floes)
    for (const ts of this.tsunamis) {
      ctx.save();
      const topY = ts.groundY - ts.height;
      const frontX = ts.x;
      const backX = ts.x - ts.facing * ts.width;

      // Water gradient body
      const waveGrad = ctx.createLinearGradient(0, topY, 0, ts.groundY);
      waveGrad.addColorStop(0, 'rgba(186, 230, 253, 0.95)');
      waveGrad.addColorStop(0.2, 'rgba(14, 165, 233, 0.85)');
      waveGrad.addColorStop(0.8, 'rgba(3, 105, 161, 0.9)');
      waveGrad.addColorStop(1, 'rgba(2, 132, 199, 0.95)');

      ctx.fillStyle = waveGrad;
      ctx.beginPath();
      ctx.moveTo(backX, ts.groundY);
      // Sweeping curling crest
      ctx.bezierCurveTo(
        backX + ts.facing * (ts.width * 0.4), topY + ts.height * 0.4,
        frontX - ts.facing * (ts.width * 0.15), topY - 15,
        frontX + ts.facing * (ts.width * 0.2), topY + 10 // Curling wave peak
      );
      ctx.lineTo(frontX, ts.groundY);
      ctx.closePath();
      ctx.fill();

      // White sea foam & ice crystal crest
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(frontX + ts.facing * (ts.width * 0.15), topY + 12, 18, 12, 0, 0, Math.PI * 2);
      ctx.ellipse(frontX, topY + 20, 24, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    // 4. Draw Volcanic Magma Geysers
    for (const g of this.geysers) {
      if (g.delay > 0 || g.height <= 0) continue;
      ctx.save();
      const topY = g.groundY - g.height;

      // Blazing fire gradient
      const fireGrad = ctx.createLinearGradient(0, g.groundY, 0, topY);
      fireGrad.addColorStop(0, '#7c2d12');
      fireGrad.addColorStop(0.3, '#ea580c');
      fireGrad.addColorStop(0.7, '#f97316');
      fireGrad.addColorStop(1, '#fef08a');

      ctx.fillStyle = fireGrad;
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 20;

      ctx.beginPath();
      const waveOffset = Math.sin(t * 15) * 8;
      ctx.moveTo(g.x - g.width / 2, g.groundY);
      ctx.quadraticCurveTo(g.x - g.width * 0.3 + waveOffset, topY + g.height * 0.4, g.x, topY);
      ctx.quadraticCurveTo(g.x + g.width * 0.3 - waveOffset, topY + g.height * 0.4, g.x + g.width / 2, g.groundY);
      ctx.closePath();
      ctx.fill();

      // Core white-hot plume
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(g.x, topY + 8, g.width * 0.25, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 5. Draw Yggdrasil Briar Patches
    for (const b of this.briars) {
      ctx.save();
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      // Twisted Thorny Brambles along ground
      ctx.beginPath();
      ctx.moveTo(b.x - b.width / 2, b.groundY);
      ctx.bezierCurveTo(
        b.x - b.width * 0.25, b.groundY - 24,
        b.x - b.width * 0.1, b.groundY - 6,
        b.x, b.groundY - 20
      );
      ctx.bezierCurveTo(
        b.x + b.width * 0.2, b.groundY - 26,
        b.x + b.width * 0.35, b.groundY - 8,
        b.x + b.width / 2, b.groundY
      );
      ctx.stroke();

      // Spikes / Thorns
      ctx.fillStyle = '#86efac';
      for (let th = -3; th <= 3; th++) {
        const tx = b.x + th * 18;
        ctx.beginPath();
        ctx.moveTo(tx, b.groundY - 14);
        ctx.lineTo(tx + 4, b.groundY - 24);
        ctx.lineTo(tx + 7, b.groundY - 14);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    // 6. Draw Solar Beams
    for (const sb of this.solarBeams) {
      ctx.save();
      ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 30;
      ctx.fillRect(sb.x - sb.width / 2, 0, sb.width, sb.groundY);

      // Core intense beam
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(sb.x - sb.width * 0.2, 0, sb.width * 0.4, sb.groundY);
      ctx.restore();
    }

    // 7. Draw Singularities
    for (const sg of this.singularities) {
      ctx.save();
      ctx.translate(sg.x, sg.y);
      ctx.rotate(t * 8);

      // Black Hole Event Horizon
      const radGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 36);
      radGrad.addColorStop(0, '#000000');
      radGrad.addColorStop(0.6, '#581c87');
      radGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.fill();

      // Accretion disk rings
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 48, 14, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }
  }
}

export const elementalManager = new ElementalEffectsManager();
