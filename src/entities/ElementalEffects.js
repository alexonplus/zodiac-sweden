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
    this.quicksands = [];
    this.meteorShowers = [];
    this.meteors = [];
    this.craters = [];
  }

  clear() {
    this.pillars.length = 0;
    this.tornadoes.length = 0;
    this.tsunamis.length = 0;
    this.geysers.length = 0;
    this.briars.length = 0;
    this.solarBeams.length = 0;
    this.singularities.length = 0;
    this.quicksands.length = 0;
    this.meteorShowers.length = 0;
    this.meteors.length = 0;
    this.craters.length = 0;
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
  // 8. QUICKSAND MAELSTROM (Aquarius Superpower)
  // ========================================================
  spawnQuicksand(x, groundY, damage = 180, duration = 240, owner = 1) {
    sound.playEarthQuake();
    sound.playWave();
    particles.createSand(x, groundY, 25);
    particles.createEarthDebris(x, groundY, 15);
    this.quicksands.push({
      x,
      groundY,
      radiusX: 300,
      radiusY: 85,
      damage,
      duration,
      owner,
      life: duration,
      maxLife: duration,
      animTimer: 0,
      tickTimer: 0
    });
  }

  // ========================================================
  // 9. METEOR SHOWER (Scorpio Superpower)
  // ========================================================
  spawnMeteorShower(centerX, groundY, count = 26, damage = 195, owner = 1) {
    sound.playRoar();
    sound.playFireBurst();
    sound.playEarthQuake();
    this.meteorShowers.push({
      centerX,
      groundY,
      totalCount: count,
      spawnedCount: 0,
      damage,
      owner,
      interval: 4,
      timer: 0,
      duration: count * 5 + 60
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

    // ------------------------------------------------------
    // 8. Quicksand Maelstroms Update (Aquarius Superpower)
    // Sucks in all enemies, submerges, traps, crushes and collapses!
    // ------------------------------------------------------
    for (let i = this.quicksands.length - 1; i >= 0; i--) {
      const qs = this.quicksands[i];
      qs.animTimer += 0.2;
      qs.life--;
      qs.tickTimer++;

      // Ambient screen rumble
      if (qs.life % 36 === 0 && onShake) {
        onShake(4);
      }

      // Ambient sand swirl particles
      if (Math.random() < 0.6) {
        const randAngle = Math.random() * Math.PI * 2;
        const randR = Math.random() * qs.radiusX;
        particles.createSand(qs.x + Math.cos(randAngle) * randR, qs.groundY + Math.sin(randAngle) * qs.radiusY * 0.4, 2);
      }

      // Vacuum suction & quicksand entrapment on enemies
      for (const en of enemies) {
        if (!en || en.hp <= 0) continue;
        const enCenterX = en.x + en.w / 2;
        const enBaseY = en.y + en.h;
        const dx = qs.x - enCenterX;
        const distX = Math.abs(dx);
        const distY = Math.abs(enBaseY - qs.groundY);

        // Suction pull range (wider than quicksand core)
        if (distX < qs.radiusX * 1.5 && distY < 200) {
          const suctionStrength = Math.min(9, Math.max(3.5, (1 - distX / (qs.radiusX * 1.5)) * 8));
          en.x += Math.sign(dx) * suctionStrength;
          en.vx = Math.sign(dx) * suctionStrength * 0.4;
        }

        // Inside quicksand abyss: pulled completely DOWN into the earth
        if (distX < qs.radiusX && distY < 120) {
          en.quicksandTimer = 40;
          en.stunTimer = Math.max(en.stunTimer || 0, 30);
          // Drag and submerge straight down into the earth (can sink 100% under the ground!)
          en.sinkDepth = Math.min((en.sinkDepth || 0) + 1.1, en.h + 8);
          en.vy = 0;
          en.vx = 0;
          en.walkCycle = (en.walkCycle || 0) + 0.35; // struggling motion

          // Sinking sand splashes and small bubbles
          if (Math.random() < 0.25) {
            particles.createSand(enCenterX + (Math.random() - 0.5) * 16, qs.groundY, 2);
          }

          // Earth suffocation damage tick
          if (qs.tickTimer % 18 === 0) {
            const tickDmg = Math.max(10, Math.floor(qs.damage * 0.15));
            en.hp -= tickDmg;
            sound.playHit();
            particles.createDamageNumber(enCenterX, en.y - 10, `⏳ SINKING -${tickDmg}`, '#f59e0b');
            particles.createSand(enCenterX, qs.groundY, 3);
            particles.createEarthDebris(enCenterX, qs.groundY, 2);
            if (onSynergyHit) onSynergyHit(en, 'earth', qs.owner, tickDmg);
          }
        }
      }

      // PvP mode support
      if (isPvP) {
        const targetP = qs.owner === 1 ? p2 : p1;
        if (targetP && targetP.hp > 0 && targetP.invulnTime <= 0) {
          const pCenterX = targetP.x + targetP.w / 2;
          const pBaseY = targetP.y + targetP.h;
          const dx = qs.x - pCenterX;
          const distX = Math.abs(dx);
          const distY = Math.abs(pBaseY - qs.groundY);
          if (distX < qs.radiusX * 1.4 && distY < 180) {
            const suctionStrength = Math.min(7, Math.max(2.5, (1 - distX / (qs.radiusX * 1.4)) * 6));
            targetP.x += Math.sign(dx) * suctionStrength;
            targetP.vx = Math.sign(dx) * suctionStrength * 0.3;
          }
          if (distX < qs.radiusX && distY < 100) {
            if (qs.tickTimer % 24 === 0) {
              const tickDmg = Math.max(6, Math.floor(qs.damage * 0.1));
              targetP.hp -= tickDmg;
              particles.createDamageNumber(pCenterX, targetP.y - 10, `QUICKSAND -${tickDmg}`, '#38bdf8');
            }
          }
        }
      }

      // Final Ground Settlement when quicksand completes (NO EXPLOSION AT ALL)
      if (qs.life <= 1) {
        // Zero explosion! Earth just quietly settles with soft sand dust
        particles.createEarthDebris(qs.x, qs.groundY, 10);
        particles.createSand(qs.x, qs.groundY, 14);

        for (const en of enemies) {
          if (!en || en.hp <= 0) continue;
          const enCenterX = en.x + en.w / 2;
          const distX = Math.abs(qs.x - enCenterX);
          if (distX < qs.radiusX * 1.2) {
            const finishDmg = Math.floor(qs.damage * 0.55);
            en.hp -= finishDmg;
            en.vy = 0;
            en.vx = 0;
            en.stunTimer = 60;
            particles.createDamageNumber(enCenterX, en.y - 15, `🪨 SWALLOWED -${finishDmg}`, '#b45309');
            if (onSynergyHit) onSynergyHit(en, 'earth', qs.owner, finishDmg);
          }
        }
        this.quicksands.splice(i, 1);
      }
    }

    // ------------------------------------------------------
    // 9. Meteor Showers & Meteors Update (Scorpio Superpower)
    // ------------------------------------------------------
    // 9a. Update Active Meteor Showers (spawning falling meteors)
    for (let i = this.meteorShowers.length - 1; i >= 0; i--) {
      const ms = this.meteorShowers[i];
      ms.timer++;
      ms.duration--;

      if (ms.timer % ms.interval === 0 && ms.spawnedCount < ms.totalCount) {
        ms.spawnedCount++;
        // Target across a wide battlefield swath
        const targetX = ms.centerX + (Math.random() - 0.5) * 820;
        const targetY = ms.groundY;
        const fallDist = targetY + 60;
        const startY = -40 - Math.random() * 60;
        const speed = 19 + Math.random() * 7;
        const angle = Math.PI * 0.35 + (Math.random() - 0.5) * 0.35;
        const startX = targetX - Math.tan(Math.PI / 2 - angle) * (targetY - startY);
        const vy = Math.abs(Math.sin(angle) * speed);

        this.meteors.push({
          x: startX,
          y: startY,
          startX,
          startY,
          targetX,
          targetY,
          vx: (targetX - startX) / (fallDist / vy),
          vy,
          radius: 14 + Math.random() * 11,
          damage: ms.damage,
          owner: ms.owner,
          color: Math.random() < 0.5 ? '#f97316' : (Math.random() < 0.5 ? '#ea580c' : '#c084fc'),
          coreColor: '#fef08a',
          tail: []
        });

        if (Math.random() < 0.4 && onShake) onShake(3);
      }

      if (ms.duration <= 0 && ms.spawnedCount >= ms.totalCount) {
        this.meteorShowers.splice(i, 1);
      }
    }

    // 9b. Update Falling Meteors & Impacts
    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i];
      m.x += m.vx;
      m.y += m.vy;

      // Track tail history for beautiful fiery trail rendering
      m.tail.push({ x: m.x, y: m.y });
      if (m.tail.length > 8) m.tail.shift();

      // Atmospheric sparks and flames in flight
      particles.createFlame(m.x, m.y, 2);
      particles.createSparks(m.x, m.y, m.color, 2);

      // Impact with ground or target plane
      if (m.y >= m.targetY) {
        sound.playFireBurst();
        if (Math.random() < 0.4) sound.playEarthQuake();
        if (onShake) onShake(14);

        // Blazing explosion detonation
        particles.createFlame(m.x, m.targetY - 5, 20);
        particles.createEarthDebris(m.x, m.targetY, 14);
        particles.createSparks(m.x, m.targetY - 15, m.color, 28);
        particles.createSparks(m.x, m.targetY - 15, '#ffffff', 14);

        // Scorched ground crater
        this.craters.push({
          x: m.x,
          groundY: m.targetY,
          radiusX: m.radius * 2.2,
          radiusY: 8 + m.radius * 0.4,
          color: m.color,
          life: 90,
          maxLife: 90
        });

        // Cataclysmic splash blast damage
        const blastRadius = 140;
        for (const en of enemies) {
          if (!en || en.hp <= 0) continue;
          const enCenterX = en.x + en.w / 2;
          const enBaseY = en.y + en.h;
          const dist = Math.hypot(enCenterX - m.x, enBaseY - m.targetY);

          if (dist < blastRadius) {
            const damageFactor = 1 - (dist / blastRadius) * 0.55;
            const impactDmg = Math.max(18, Math.floor(m.damage * 0.38 * damageFactor));
            const hitResult = en.applyHit ? en.applyHit(impactDmg, 'fire', m.owner, false, true) : null;
            if (!hitResult) en.hp -= impactDmg;

            en.burnTimer = Math.max(en.burnTimer || 0, 160);
            en.vy = -11; // Launched high into the air by shockwave
            en.vx = Math.sign(enCenterX - m.x) * 7;
            en.stunTimer = Math.max(en.stunTimer || 0, 30);

            particles.createDamageNumber(enCenterX, en.y - 12, `☄️ METEOR! -${impactDmg}`, '#f97316');
            particles.createFlame(enCenterX, en.y + en.h / 2, 8);
            if (onSynergyHit) onSynergyHit(en, 'fire', m.owner, impactDmg);
          }
        }

        // PvP mode damage
        if (isPvP) {
          const targetP = m.owner === 1 ? p2 : p1;
          if (targetP && targetP.hp > 0 && targetP.invulnTime <= 0) {
            const pCenterX = targetP.x + targetP.w / 2;
            const pBaseY = targetP.y + targetP.h;
            const dist = Math.hypot(pCenterX - m.x, pBaseY - m.targetY);
            if (dist < blastRadius) {
              const pDmg = Math.max(12, Math.floor(m.damage * 0.22));
              targetP.hp -= pDmg;
              targetP.vy = -9;
              particles.createDamageNumber(pCenterX, targetP.y - 10, `METEOR -${pDmg}`, '#f97316');
            }
          }
        }

        this.meteors.splice(i, 1);
      }
    }

    // 9c. Update Scorched Craters
    for (let i = this.craters.length - 1; i >= 0; i--) {
      const cr = this.craters[i];
      cr.life--;
      if (cr.life <= 0) {
        this.craters.splice(i, 1);
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

    // 8. Draw Quicksand Maelstroms (Transparent Earth & Sand Depression)
    for (const qs of this.quicksands) {
      ctx.save();
      const alpha = Math.min(1.0, qs.life / (qs.maxLife * 0.15));
      ctx.globalAlpha = alpha;

      // Transparent soft earth/sand depression - ground underneath is clearly visible!
      const pitGrad = ctx.createRadialGradient(qs.x, qs.groundY, 8, qs.x, qs.groundY, qs.radiusX);
      pitGrad.addColorStop(0, 'rgba(69, 26, 3, 0.32)'); // Soft translucent loam
      pitGrad.addColorStop(0.35, 'rgba(120, 53, 15, 0.22)'); // Translucent amber sand
      pitGrad.addColorStop(0.7, 'rgba(180, 83, 9, 0.12)'); // Soft sand dust
      pitGrad.addColorStop(1, 'rgba(217, 119, 6, 0)'); // Fades seamlessly into background

      ctx.fillStyle = pitGrad;
      ctx.beginPath();
      ctx.ellipse(qs.x, qs.groundY, qs.radiusX, qs.radiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Soft natural sand boundary ripple
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(qs.x, qs.groundY, qs.radiusX * 0.95, qs.radiusY * 0.95, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating Swirling Translucent Sand Dust Arms
      const numArms = 5;
      const swirlRot = t * 6;
      for (let a = 0; a < numArms; a++) {
        const armBaseAngle = (a / numArms) * Math.PI * 2 + swirlRot;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.32)';
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';

        ctx.beginPath();
        const steps = 24;
        for (let s = 0; s <= steps; s++) {
          const frac = s / steps;
          const theta = armBaseAngle + frac * Math.PI * 2.5;
          const rX = (1 - frac) * qs.radiusX * 0.9;
          const rY = (1 - frac) * qs.radiusY * 0.85;
          const px = qs.x + Math.cos(theta) * rX;
          const py = qs.groundY + Math.sin(theta) * rY;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Swirling Fine Sand Grains around Depression
      ctx.fillStyle = 'rgba(253, 230, 138, 0.55)';
      const particleDots = 12;
      for (let p = 0; p < particleDots; p++) {
        const pAngle = (p / particleDots) * Math.PI * 2 - t * 8;
        const pDist = 0.25 + (p / particleDots) * 0.7;
        const dotX = qs.x + Math.cos(pAngle) * qs.radiusX * pDist;
        const dotY = qs.groundY + Math.sin(pAngle) * qs.radiusY * pDist;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2.0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Soft center depression
      const eyeGrad = ctx.createRadialGradient(qs.x, qs.groundY, 0, qs.x, qs.groundY, 30);
      eyeGrad.addColorStop(0, 'rgba(45, 18, 5, 0.38)');
      eyeGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
      ctx.fillStyle = eyeGrad;
      ctx.beginPath();
      ctx.ellipse(qs.x, qs.groundY, 32, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Translucent Aquarius Symbol watermark in center
      ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♒', qs.x, qs.groundY - 1);

      ctx.restore();
    }

    // 9a. Draw Scorched Craters on Ground
    for (const cr of this.craters) {
      ctx.save();
      const alpha = Math.min(1.0, cr.life / (cr.maxLife * 0.25));
      ctx.globalAlpha = alpha;

      // Dark charred crater base
      ctx.fillStyle = 'rgba(24, 10, 5, 0.7)';
      ctx.beginPath();
      ctx.ellipse(cr.x, cr.groundY, cr.radiusX, cr.radiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glowing molten core
      const coreGrad = ctx.createRadialGradient(cr.x, cr.groundY, 0, cr.x, cr.groundY, cr.radiusX * 0.7);
      coreGrad.addColorStop(0, '#f97316');
      coreGrad.addColorStop(0.5, '#7c2d12');
      coreGrad.addColorStop(1, 'rgba(124, 45, 18, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.ellipse(cr.x, cr.groundY, cr.radiusX * 0.7, cr.radiusY * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Scorched magma fissures
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cr.x - cr.radiusX * 0.5, cr.groundY - 1);
      ctx.lineTo(cr.x + cr.radiusX * 0.4, cr.groundY + 1);
      ctx.moveTo(cr.x - 2, cr.groundY - cr.radiusY * 0.4);
      ctx.lineTo(cr.x + 3, cr.groundY + cr.radiusY * 0.4);
      ctx.stroke();

      ctx.restore();
    }

    // 9b. Draw Flaming Meteors with Comet Tails
    for (const m of this.meteors) {
      ctx.save();

      // Glowing comet tail ribbon
      if (m.tail && m.tail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(m.tail[0].x, m.tail[0].y);
        for (let s = 1; s < m.tail.length; s++) {
          ctx.lineTo(m.tail[s].x, m.tail[s].y);
        }
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = m.color;
        ctx.lineWidth = m.radius * 1.3;
        ctx.lineCap = 'round';
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 16;
        ctx.stroke();

        // Inner white-hot trail core
        ctx.lineWidth = m.radius * 0.6;
        ctx.strokeStyle = '#fef08a';
        ctx.stroke();
      }

      // Blazing Meteor Core
      ctx.translate(m.x, m.y);
      const mAngle = Math.atan2(m.vy, m.vx);
      ctx.rotate(mAngle);

      // Outer fire halo
      const fireGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, m.radius * 1.4);
      fireGrad.addColorStop(0, '#ffffff');
      fireGrad.addColorStop(0.3, '#fef08a');
      fireGrad.addColorStop(0.6, '#f97316');
      fireGrad.addColorStop(0.9, '#ea580c');
      fireGrad.addColorStop(1, 'rgba(124, 45, 18, 0)');

      ctx.fillStyle = fireGrad;
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 0, m.radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Jagged molten rock core
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(0, 0, m.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Superheated white-hot center
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(m.radius * 0.2, 0, m.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}

export const elementalManager = new ElementalEffectsManager();
