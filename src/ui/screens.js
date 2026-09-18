import { HERO_CONFIGS } from '../config/heroes.js';
import { getHeroAvatarSvg, HERO_AVATARS } from '../config/avatars.js';

export function populateZodiacGrid(p1HeroId, p2HeroId, isCoopMode, onSelect) {
  const grid = document.getElementById('zodiac-grid');
  grid.innerHTML = '';

  Object.values(HERO_CONFIGS).forEach(hero => {
    const card = document.createElement('div');
    card.className = `zodiac-card ${p1HeroId === hero.id ? 'p1-sel' : ''} ${isCoopMode && p2HeroId === hero.id ? 'p2-sel' : ''}`;
    card.setAttribute('data-id', hero.id);
    card.style.setProperty('--card-color', hero.color);

    card.innerHTML = `
      <div class="zodiac-avatar-wrap" style="box-shadow: 0 0 14px ${hero.color}44;">
        ${getHeroAvatarSvg(hero.id, 48)}
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

    card.addEventListener('click', () => {
      onSelect(hero.id);
      updateHeroPreview(hero.id);
    });

    grid.appendChild(card);
  });

  // Initial preview with p1 hero
  updateHeroPreview(p1HeroId);
}

export function updateHeroPreview(heroId) {
  const hero = HERO_CONFIGS[heroId];
  if (!hero) return;

  const previewAvatar = document.getElementById('preview-avatar-box');
  const previewName = document.getElementById('preview-hero-name');
  const previewTitle = document.getElementById('preview-hero-title');
  const previewElem = document.getElementById('preview-hero-elem');
  const previewCity = document.getElementById('preview-hero-city');
  const previewWeapon = document.getElementById('preview-hero-weapon');
  const previewRole = document.getElementById('preview-hero-role');
  const previewSkillQ = document.getElementById('preview-skill-q');
  const previewSkillE = document.getElementById('preview-skill-e');
  const previewStats = document.getElementById('preview-stats-bar');

  if (previewAvatar) {
    previewAvatar.innerHTML = getHeroAvatarSvg(hero.id, 80);
    previewAvatar.style.borderColor = hero.color;
    previewAvatar.style.boxShadow = `0 0 20px ${hero.color}66`;
  }
  if (previewName) {
    previewName.innerText = hero.name.toUpperCase();
    previewName.style.color = hero.color;
  }
  if (previewTitle) previewTitle.innerText = hero.title || '';
  if (previewElem) {
    previewElem.innerText = hero.elemLabel;
    previewElem.style.background = hero.elemBg;
  }
  if (previewCity) previewCity.innerText = hero.city;
  if (previewWeapon) previewWeapon.innerText = hero.weapon || 'Constellation Blade';
  if (previewRole) previewRole.innerText = hero.role || 'Hero';
  if (previewSkillQ) previewSkillQ.innerText = hero.skills.q.name || 'Skill 1';
  if (previewSkillE) previewSkillE.innerText = hero.skills.e.name || 'Skill 2';

  if (previewStats) {
    previewStats.innerHTML = `
      <div class="stat-item"><span class="stat-label">HP:</span> <b>${hero.maxHp}</b></div>
      <div class="stat-item"><span class="stat-label">SPD:</span> <b>${hero.speed}</b></div>
      <div class="stat-item"><span class="stat-label">ENERGY:</span> <b>${hero.energyName}</b></div>
    `;
  }
}

export function refreshSelectionUI(p1HeroId, p2HeroId, isCoopMode) {
  const h1 = HERO_CONFIGS[p1HeroId];
  const h2 = HERO_CONFIGS[p2HeroId];

  document.getElementById('lbl-p1-choice').innerText = `${h1.name.toUpperCase()} (${h1.city})`;
  document.getElementById('lbl-p1-choice').style.color = h1.color;

  if (isCoopMode) {
    document.getElementById('lbl-p2-container').style.display = 'inline-block';
    document.getElementById('lbl-p2-choice').innerText = `${h2.name.toUpperCase()} (${h2.city})`;
    document.getElementById('lbl-p2-choice').style.color = h2.color;
  } else {
    document.getElementById('lbl-p2-container').style.display = 'none';
  }

  document.querySelectorAll('.zodiac-card').forEach(card => {
    const hid = card.getAttribute('data-id');
    card.classList.remove('p1-sel', 'p2-sel');
    if (hid === p1HeroId) card.classList.add('p1-sel');
    if (isCoopMode && hid === p2HeroId) card.classList.add('p2-sel');
  });

  updateHeroPreview(p1HeroId);
}
