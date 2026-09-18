// A/B/C 비교 스크린샷. 데스크톱 1440 · 모바일 390. 결과: docs/previews/
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173';
const OUT = 'docs/previews';
mkdirSync(OUT, { recursive: true });

const SCREENS = [
  { key: 'home', path: '', full: true },
  { key: 'home-first', path: '', full: false },
  { key: 'product-box', path: '/products/pokemon-forest-light-booster-box-ko', full: true },
  { key: 'product-box-buy', path: '/products/pokemon-forest-light-booster-box-ko', full: false },
  { key: 'product-sleeve', path: '/products/card-sleeve-standard-100', full: false },
  { key: 'set', path: '/sets/smp-pk1-ko', full: true },
  { key: 'set-hits', path: '/sets/smp-pk1-ko#hits', full: false },
  { key: 'set-cards', path: '/sets/smp-pk1-ko#cards', full: false },
  { key: 'shop', path: '/shop', full: false },
];
const DEVICES = [
  { key: 'desktop', width: 1440, height: 900 },
  { key: 'mobile', width: 390, height: 844, mobile: true },
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const d of DEVICES) {
  const ctx = await browser.newContext({ viewport: { width: d.width, height: d.height }, deviceScaleFactor: 1, isMobile: !!d.mobile, hasTouch: !!d.mobile, locale: 'ko-KR', reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const c of ['a', 'b', 'c']) {
    for (const s of SCREENS) {
      await page.goto(`${BASE}/concepts/${c}${s.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      if (s.path.includes('#')) { await page.evaluate((h) => document.getElementById(h)?.scrollIntoView({ block: 'start' }), s.path.split('#')[1]); await page.waitForTimeout(200); }
      await page.screenshot({ path: `${OUT}/${c}-${s.key}-${d.key}.png`, fullPage: s.full });
    }
  }
  await ctx.close();
}
await browser.close();
console.log('done');
