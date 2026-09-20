import { AriesHero } from './aries.js';
import { TaurusHero } from './taurus.js';
import { GeminiHero } from './gemini.js';
import { CancerHero } from './cancer.js';
import { LeoHero } from './leo.js';
import { VirgoHero } from './virgo.js';
import { LibraHero } from './libra.js';
import { ScorpioHero } from './scorpio.js';
import { SagittariusHero } from './sagittarius.js';
import { CapricornHero } from './capricorn.js';
import { AquariusHero } from './aquarius.js';
import { PiscesHero } from './pisces.js';

export const HERO_MODULES = {
  aries: AriesHero,
  taurus: TaurusHero,
  gemini: GeminiHero,
  cancer: CancerHero,
  leo: LeoHero,
  virgo: VirgoHero,
  libra: LibraHero,
  scorpio: ScorpioHero,
  sagittarius: SagittariusHero,
  capricorn: CapricornHero,
  aquarius: AquariusHero,
  pisces: PiscesHero
};

export function getHeroModule(heroId) {
  return HERO_MODULES[heroId] || AquariusHero;
}
