import { HERO_CONFIGS } from '../config/heroes.js';

export function populateZodiacGrid(p1HeroId, p2HeroId, isCoopMode, onSelect) {
  const grid = document.getElementById('zodiac-grid');
  grid.innerHTML = '';

  Object.values(HERO_CONFIGS).forEach(hero => {
    const card = document.createElement('div');
    card.className = `zodiac-card ${p1HeroId === hero.id ? 'p1-sel' : ''} ${isCoopMode && p2HeroId === hero.id ? 'p2-sel' : ''}`;
    card.setAttribute('data-id', hero.id);

    card.innerHTML = `
      <div class="zodiac-sym" style="color: ${hero.color}">${hero.symbol}</div>
      <div class="zodiac-name">${hero.name}</div>
      <div class="zodiac-city">${hero.city.split(' ')[0]}</div>
      <span class="zodiac-elem" style="background: ${hero.elemBg}">${hero.elemLabel}</span>
    `;

    card.addEventListener('click', () => {
      onSelect(hero.id);
    });

    grid.appendChild(card);
  });
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
}
