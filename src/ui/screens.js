import { HERO_CONFIGS } from '../config/heroes.js';
import { getHeroAvatarSvg, HERO_AVATARS } from '../config/avatars.js';
import { getHeroModule } from '../entities/heroes/index.js';

let currentPreviewHeroId = 'aquarius';
let previewAnimTime = 0;
let previewLoopStarted = false;

function startPreviewAnimationLoop() {
  if (previewLoopStarted) return;
  previewLoopStarted = true;

  function loop() {
    previewAnimTime += 0.05;
    const canvas = document.getElementById('preview-sprite-canvas');
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hero = HERO_CONFIGS[currentPreviewHeroId];
      const heroModule = getHeroModule(currentPreviewHeroId);
      if (hero && heroModule) {
        const bobY = Math.sin(previewAnimTime * 2.5) * 1.5;
        const hCol = hero.color || '#00f0ff';
        const dummyPlayer = {
          hero,
          heroModule,
          animTimer: previewAnimTime,
          isGrounded: true,
          walkCycle: 0,
          attackSwing: 0,
          facing: 1
        };

        // Ground Drop shadow
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(34, 56, 17, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const breathe = Math.sin(previewAnimTime * 3) * 0.7;

        ctx.save();
        ctx.translate(34, 32 + bobY);

        // Aura
        if (heroModule.drawAura) heroModule.drawAura(ctx, dummyPlayer);

        // Back accessories
        if (heroModule.drawBackAccessories) heroModule.drawBackAccessories(ctx, dummyPlayer, 0, Math.sin(previewAnimTime * 3) * 2);

        // --- Back Leg ---
        // Upper Thigh (Cuisse) - Organic curved muscle contour
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(-9, 5);
        ctx.quadraticCurveTo(-11, 9, -9, 14);
        ctx.lineTo(-2, 14);
        ctx.quadraticCurveTo(-3, 9, -4, 5);
        ctx.closePath();
        ctx.fill();

        // Armored Knee Cop (Poleyn) - Rounded joint
        ctx.fillStyle = hCol;
        ctx.beginPath();
        ctx.ellipse(-5.5, 14, 4.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(-6.5, 13, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Lower Leg Greave - Contoured calf muscle
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(-9, 15);
        ctx.quadraticCurveTo(-11, 19, -8, 23);
        ctx.lineTo(-2, 23);
        ctx.quadraticCurveTo(-2, 18, -3, 15);
        ctx.closePath();
        ctx.fill();

        // Plated ridge highlight
        ctx.strokeStyle = hCol;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-5.5, 16);
        ctx.quadraticCurveTo(-6.5, 19, -5, 22);
        ctx.stroke();

        // Sculpted Armored Boot / Sabaton
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.moveTo(-8, 23);
        ctx.lineTo(-2, 23);
        ctx.quadraticCurveTo(0, 25, 1.5, 26);
        ctx.quadraticCurveTo(2.5, 27, 2, 28);
        ctx.quadraticCurveTo(-4, 28.5, -9, 28);
        ctx.quadraticCurveTo(-10, 26, -8, 23);
        ctx.closePath();
        ctx.fill();

        // Metal Toe Cap & Sole Tread
        ctx.fillStyle = hCol;
        ctx.beginPath();
        ctx.arc(0.8, 26.5, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-9, 28);
        ctx.lineTo(2, 28);
        ctx.stroke();

        // --- Off-Hand Arm & Off-Hand Weapon/Shield/Drone ---
        const offSwing = Math.sin(previewAnimTime * 2) * 0.1;
        ctx.save();
        ctx.translate(-4, -6 + breathe);
        ctx.rotate(offSwing);

        // Contoured upper arm (deltoid to elbow)
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(-0.5, 4, 2.5, 4.5, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Vambrace & Gauntlet (curved forearm)
        ctx.fillStyle = hCol;
        ctx.beginPath();
        ctx.moveTo(-3.5, 6);
        ctx.quadraticCurveTo(-4.5, 9, -3, 12);
        ctx.lineTo(1.5, 12);
        ctx.quadraticCurveTo(2, 9, 1, 6);
        ctx.closePath();
        ctx.fill();

        // Natural curved fist
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.ellipse(-0.8, 13, 2.4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-1.5, 13, 1, 1.5);
        ctx.fillRect(0, 13, 1, 1.5);

        if (heroModule.drawOffHand) {
          heroModule.drawOffHand(ctx, dummyPlayer);
        }
        ctx.restore();

        // --- Front Leg ---
        // Upper Thigh (Cuisse) - Organic curved muscle contour
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(1, 5);
        ctx.quadraticCurveTo(0, 9, 1, 14);
        ctx.lineTo(8, 14);
        ctx.quadraticCurveTo(10, 9, 8, 5);
        ctx.closePath();
        ctx.fill();

        // Armored Knee Cop (Poleyn) - Rounded joint
        ctx.fillStyle = hCol;
        ctx.beginPath();
        ctx.ellipse(4.5, 14, 4.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(3.5, 13, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Lower Leg Greave - Contoured calf muscle
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(1, 15);
        ctx.quadraticCurveTo(0, 18, 1.5, 23);
        ctx.lineTo(7.5, 23);
        ctx.quadraticCurveTo(9.5, 19, 8, 15);
        ctx.closePath();
        ctx.fill();

        // Plated ridge highlight
        ctx.strokeStyle = hCol;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(4.5, 16);
        ctx.quadraticCurveTo(5.5, 19, 4, 22);
        ctx.stroke();

        // Sculpted Armored Boot / Sabaton
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.moveTo(1, 23);
        ctx.lineTo(7, 23);
        ctx.quadraticCurveTo(9, 25, 11, 26);
        ctx.quadraticCurveTo(12, 27, 11, 28);
        ctx.quadraticCurveTo(5, 28.5, 0, 28);
        ctx.quadraticCurveTo(-1, 26, 1, 23);
        ctx.closePath();
        ctx.fill();

        // Metal Toe Cap & Sole Tread
        ctx.fillStyle = hCol;
        ctx.beginPath();
        ctx.arc(10, 26.5, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 28);
        ctx.lineTo(11, 28);
        ctx.stroke();

        // --- Torso (Breathing & Natural Athletic V-taper) ---
        ctx.save();
        ctx.translate(0, breathe);
        if (heroModule.drawTorso) {
          heroModule.drawTorso(ctx, dummyPlayer);
        } else {
          // Natural athletic torso silhouette (broad shoulders tapering to waist)
          ctx.fillStyle = '#0f172a';
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

          // Cuirass / Breastplate with curved chest volume
          ctx.fillStyle = hCol;
          ctx.beginPath();
          ctx.moveTo(-10, -15);
          ctx.quadraticCurveTo(-11, -7, -7, 0);
          ctx.lineTo(7, 0);
          ctx.quadraticCurveTo(11, -7, 10, -15);
          ctx.quadraticCurveTo(0, -13, -10, -15);
          ctx.closePath();
          ctx.fill();

          // Chest Specular Arc (natural convex volume)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.beginPath();
          ctx.ellipse(0, -9, 6, 4, 0, 0, Math.PI);
          ctx.fill();

          // Inner armor plate
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.ellipse(0, -8, 5, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Glowing Zodiac Sigil
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = hCol;
          ctx.shadowBlur = 6;
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(hero.symbol, 0, -5);
          ctx.shadowBlur = 0;
          ctx.textAlign = 'left';

          // Curved Belt with rounded buckle
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.moveTo(-9, 2);
          ctx.quadraticCurveTo(0, 4, 9, 2);
          ctx.lineTo(9, 7);
          ctx.quadraticCurveTo(0, 9, -9, 7);
          ctx.closePath();
          ctx.fill();

          // Rounded Bronze Belt Buckle
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.ellipse(0, 5, 3.5, 3, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Shoulders & Pauldrons (Rounded anatomical epaulets)
        if (heroModule.drawShoulders) {
          heroModule.drawShoulders(ctx, dummyPlayer);
        } else {
          ctx.fillStyle = hCol;
          ctx.beginPath();
          ctx.ellipse(-11, -13, 5, 4, -0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(11, -13, 5, 4, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Head, Face & Hair
        if (heroModule.drawHead) {
          heroModule.drawHead(ctx, dummyPlayer);
        } else {
          // Natural contoured human head silhouette
          ctx.fillStyle = '#fed7aa';
          ctx.beginPath();
          ctx.moveTo(-6, -28);
          ctx.quadraticCurveTo(0, -32, 6, -28);
          ctx.quadraticCurveTo(6.5, -23, 5, -19);
          ctx.quadraticCurveTo(0, -17, -5, -19);
          ctx.quadraticCurveTo(-6.5, -23, -6, -28);
          ctx.closePath();
          ctx.fill();

          if (heroModule.drawHelmet) heroModule.drawHelmet(ctx, dummyPlayer);
        }
        ctx.restore();

        // --- Weapon Arm & Weapon (Natural arm curves) ---
        const swingAngle = Math.sin(previewAnimTime * 2) * 0.15;
        ctx.save();
        ctx.translate(3, -6 + breathe);
        ctx.rotate(swingAngle * 0.6);

        // Contoured upper arm (deltoid/bicep)
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(2.5, 4, 2.8, 5, -0.1, 0, Math.PI * 2);
        ctx.fill();

        // Vambrace & Gauntlet (curved forearm)
        ctx.fillStyle = hCol;
        ctx.beginPath();
        ctx.moveTo(0, 6);
        ctx.quadraticCurveTo(-1, 9, 0.5, 12);
        ctx.lineTo(5.5, 12);
        ctx.quadraticCurveTo(6.5, 9, 5, 6);
        ctx.closePath();
        ctx.fill();

        // Hand: curved organic gripping hand
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.ellipse(3, 13, 2.5, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(2, 13, 1, 1.5);
        ctx.fillRect(4, 13, 1, 1.5);
        ctx.restore();

        // Weapon
        ctx.save();
        ctx.translate(10, -2 + breathe);
        ctx.rotate(swingAngle);
        if (heroModule.drawWeapon) heroModule.drawWeapon(ctx, dummyPlayer);
        ctx.restore();

        ctx.restore();
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

export function populateZodiacGrid(p1HeroId, p2HeroId, isCoopMode, onSelect) {
  const grid = document.getElementById('zodiac-grid');
  if (!grid) return;
  grid.innerHTML = '';

  Object.values(HERO_CONFIGS).forEach(hero => {
    const card = document.createElement('div');
    card.className = `zodiac-card ${p1HeroId === hero.id ? 'p1-sel' : ''} ${isCoopMode && p2HeroId === hero.id ? 'p2-sel' : ''}`;
    card.setAttribute('data-id', hero.id);
    card.style.setProperty('--card-color', hero.color);

    card.innerHTML = `
      <div class="zodiac-avatar-wrap" style="box-shadow: 0 0 10px ${hero.color}44;">
        ${getHeroAvatarSvg(hero.id, 36)}
        <span class="zodiac-sym-badge" style="background: ${hero.elemBg}; color: #fff;">${hero.symbol}</span>
      </div>
      <div class="zodiac-name" style="color: ${hero.color}">${hero.name}</div>
      <div class="zodiac-title-sub">${hero.title || hero.name}</div>
      <div class="zodiac-city">📍 ${hero.city.split(' ')[0]}</div>
      <span class="zodiac-elem" style="background: ${hero.elemBg}">${hero.elemLabel}</span>
    `;

    card.addEventListener('mouseenter', () => {
      updateHeroPreview(hero.id);
    });

    card.addEventListener('mouseleave', () => {
      const activeP1 = window.currentGameManager ? window.currentGameManager.p1HeroId : p1HeroId;
      updateHeroPreview(activeP1);
    });

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      onSelect(hero.id);
      updateHeroPreview(hero.id);
    });

    card.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      onSelect(hero.id);
      updateHeroPreview(hero.id);
      const confirmBtn = document.getElementById('btn-confirm-char');
      if (confirmBtn) confirmBtn.click();
    });

    grid.appendChild(card);
  });

  // Initial preview with p1 hero
  updateHeroPreview(p1HeroId);
  startPreviewAnimationLoop();
}

export function updateHeroPreview(heroId) {
  const hero = HERO_CONFIGS[heroId];
  if (!hero) return;
  currentPreviewHeroId = heroId;
  startPreviewAnimationLoop();

  const previewAvatar = document.getElementById('preview-avatar-box');
  const previewName = document.getElementById('preview-hero-name');
  const previewTitle = document.getElementById('preview-hero-title');
  const previewArchetype = document.getElementById('preview-hero-archetype');
  const previewElem = document.getElementById('preview-hero-elem');
  const previewLore = document.getElementById('preview-hero-lore');
  const previewCity = document.getElementById('preview-hero-city');
  const previewWeapon = document.getElementById('preview-hero-weapon');
  const previewCombatStyle = document.getElementById('preview-hero-combat-style');
  const previewPassive = document.getElementById('preview-hero-passive');
  const previewSuperpower = document.getElementById('preview-hero-superpower');
  const previewSkillQ = document.getElementById('preview-skill-q');
  const previewSkillE = document.getElementById('preview-skill-e');
  const previewSkillDash = document.getElementById('preview-skill-dash');
  const previewSkillUlt = document.getElementById('preview-skill-ult');
  const previewStats = document.getElementById('preview-stats-bar');

  if (previewAvatar) {
    previewAvatar.innerHTML = getHeroAvatarSvg(hero.id, 58);
    previewAvatar.style.borderColor = hero.color;
    previewAvatar.style.boxShadow = `0 0 16px ${hero.color}66`;
  }
  if (previewName) {
    previewName.innerText = hero.name.toUpperCase();
    previewName.style.color = hero.color;
  }
  if (previewTitle) previewTitle.innerText = hero.title || '';
  if (previewArchetype) {
    previewArchetype.innerText = hero.archetype || 'WARRIOR';
    previewArchetype.style.color = hero.color;
    previewArchetype.style.borderColor = `${hero.color}66`;
  }
  if (previewElem) {
    previewElem.innerText = hero.elemLabel;
    previewElem.style.background = hero.elemBg;
  }
  if (previewLore) {
    previewLore.innerText = hero.lore || '';
  }
  if (previewCity) previewCity.innerText = hero.city;
  if (previewWeapon) previewWeapon.innerText = hero.weapon || 'Constellation Blade';
  if (previewCombatStyle) previewCombatStyle.innerText = hero.combatStyle || 'Dynamic Martial Arts';
  if (previewPassive) previewPassive.innerText = hero.passive || 'Elemental Surge';
  if (previewSuperpower) previewSuperpower.innerText = hero.superpower || hero.ultName || 'Zodiac Eclipse';
  if (previewSkillQ) previewSkillQ.innerText = (hero.skills && hero.skills.q && hero.skills.q.name) || 'Skill 1';
  if (previewSkillE) previewSkillE.innerText = (hero.skills && hero.skills.e && hero.skills.e.name) || 'Skill 2';
  if (previewSkillDash) previewSkillDash.innerText = (hero.skills && hero.skills.dash && hero.skills.dash.name) || 'Zodiac Dash';
  if (previewSkillUlt) previewSkillUlt.innerText = (hero.skills && hero.skills.ult && hero.skills.ult.name) || hero.ultName || 'Superpower';

  if (previewStats && hero.stats) {
    previewStats.innerHTML = `
      <div class="stat-item" title="Attack Power"><span class="stat-label">ATK</span> <div class="stat-mini-bar"><div class="stat-mini-fill" style="width: ${hero.stats.atk}%; background: #ef4444;"></div></div></div>
      <div class="stat-item" title="Defense Armor"><span class="stat-label">DEF</span> <div class="stat-mini-bar"><div class="stat-mini-fill" style="width: ${hero.stats.def}%; background: #3b82f6;"></div></div></div>
      <div class="stat-item" title="Movement Speed"><span class="stat-label">SPD</span> <div class="stat-mini-bar"><div class="stat-mini-fill" style="width: ${hero.stats.spd}%; background: #10b981;"></div></div></div>
      <div class="stat-item" title="Synergy Potential"><span class="stat-label">SYN</span> <div class="stat-mini-bar"><div class="stat-mini-fill" style="width: ${hero.stats.syn || 90}%; background: #a855f7;"></div></div></div>
    `;
  }
}

export function refreshSelectionUI(p1HeroId, p2HeroId, isCoopMode) {
  const h1 = HERO_CONFIGS[p1HeroId];
  const h2 = HERO_CONFIGS[p2HeroId];

  const p1Label = document.getElementById('lbl-p1-choice');
  if (p1Label && h1) {
    p1Label.innerText = `${h1.name.toUpperCase()} (${h1.city})`;
    p1Label.style.color = h1.color;
  }

  const p2Container = document.getElementById('lbl-p2-container');
  const p2Label = document.getElementById('lbl-p2-choice');
  if (isCoopMode) {
    if (p2Container) p2Container.style.display = 'inline-block';
    if (p2Label && h2) {
      p2Label.innerText = `${h2.name.toUpperCase()} (${h2.city})`;
      p2Label.style.color = h2.color;
    }
  } else {
    if (p2Container) p2Container.style.display = 'none';
  }

  document.querySelectorAll('.zodiac-card').forEach(card => {
    const hid = card.getAttribute('data-id');
    card.classList.remove('p1-sel', 'p2-sel');
    if (hid === p1HeroId) card.classList.add('p1-sel');
    if (isCoopMode && hid === p2HeroId) card.classList.add('p2-sel');
  });

  const previewTarget = (isCoopMode && window.currentGameManager && window.currentGameManager.selectingForPlayer === 2) ? p2HeroId : p1HeroId;
  updateHeroPreview(previewTarget);
}
