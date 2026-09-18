// 스크린샷을 나란히 배치한 비교 이미지 생성 → docs/previews/compare-*.png
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const OUT = 'docs/previews';
const SHEETS = [
  { key: 'home-desktop', title: '홈 첫 화면 · 데스크톱 1440', files: ['a-home-first-desktop', 'b-home-first-desktop', 'c-home-first-desktop'], w: 1440 },
  { key: 'home-mobile', title: '홈 첫 화면 · 모바일 390', files: ['a-home-first-mobile', 'b-home-first-mobile', 'c-home-first-mobile'], w: 390 },
  { key: 'product-buy-desktop', title: '상품 상세 · 구매 영역 · 데스크톱', files: ['a-product-box-buy-desktop', 'b-product-box-buy-desktop', 'c-product-box-buy-desktop'], w: 1440 },
  { key: 'product-buy-mobile', title: '상품 상세 · 모바일 구매 바', files: ['a-product-box-buy-mobile', 'b-product-box-buy-mobile', 'c-product-box-buy-mobile'], w: 390 },
  { key: 'product-sleeve-mobile', title: '옵션 상품(슬리브) · 모바일', files: ['a-product-sleeve-mobile', 'b-product-sleeve-mobile', 'c-product-sleeve-mobile'], w: 390 },
  { key: 'set-hits-desktop', title: '세트 상세 · 눈여겨볼 카드 · 데스크톱', files: ['a-set-hits-desktop', 'b-set-hits-desktop', 'c-set-hits-desktop'], w: 1440 },
  { key: 'set-cards-desktop', title: '세트 상세 · 전체 카드 · 데스크톱', files: ['a-set-cards-desktop', 'b-set-cards-desktop', 'c-set-cards-desktop'], w: 1440 },
  { key: 'set-hits-mobile', title: '세트 상세 · 눈여겨볼 카드 · 모바일', files: ['a-set-hits-mobile', 'b-set-hits-mobile', 'c-set-hits-mobile'], w: 390 },
  { key: 'shop-mobile', title: '샵 · 모바일', files: ['a-shop-mobile', 'b-shop-mobile', 'c-shop-mobile'], w: 390 },
];
const NAMES = { a: 'A. 취향 편집숍', b: 'B. 컬렉터 아카이브', c: 'C. 플레이풀 쇼룸' };
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage();
for (const s of SHEETS) {
  const colW = s.w === 1440 ? 640 : 300;
  const imgs = s.files.map((f) => `data:image/png;base64,${readFileSync(resolve(OUT, f + '.png')).toString('base64')}`);
  const html = `<!doctype html><html lang="ko"><body style="margin:0;background:#E9E8E3;font-family:system-ui,sans-serif;padding:24px;width:${colW * 3 + 24 * 4}px">
  <h1 style="font-size:20px;margin:0 0 16px">${s.title} <span style="color:#666;font-weight:400;font-size:14px">— 같은 콘텐츠·같은 fixture</span></h1>
  <div style="display:grid;grid-template-columns:repeat(3,${colW}px);gap:24px;align-items:start">
  ${imgs.map((src, i) => `<figure style="margin:0"><figcaption style="font-size:14px;font-weight:700;margin-bottom:8px">${NAMES[s.files[i][0]]}</figcaption><img src="${src}" style="width:${colW}px;display:block;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.15)"></figure>`).join('')}
  </div></body></html>`;
  const tmp = resolve(OUT, `_tmp-${s.key}.html`);
  writeFileSync(tmp, html);
  await page.goto('file://' + tmp);
  await page.waitForTimeout(100);
  await page.screenshot({ path: `${OUT}/compare-${s.key}.png`, fullPage: true });
}
await browser.close();
console.log('sheets done');
