// 핵심 클릭 흐름 QA — 마스터 프롬프트 20장 과제 1·2·3·7·8 일부를 자동 확인한다.
import { chromium } from 'playwright';
const BASE = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const results = [];
const check = (name, ok, extra = '') => { results.push({ name, ok, extra }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${extra}`); };

for (const c of ['a', 'b', 'c']) {
  // 과제 1: 모바일에서 포켓몬 한국어 박스만 찾고 구성·배송비 확인 후 담기
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'ko-KR' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE}/concepts/${c}/shop`);
  await page.getByRole('button', { name: /필터/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByText('박스', { exact: true }).click();
  await dialog.getByText('포켓몬', { exact: true }).click();
  await dialog.getByText('한국어판', { exact: true }).click();
  await dialog.getByRole('button', { name: '적용' }).click();
  await page.waitForURL(/category=box.*game=pokemon.*language=ko/);
  await page.waitForFunction(() => document.querySelectorAll('.product-tile').length === 1, null, { timeout: 5000 }).catch(() => {});
  const tiles = await page.locator('.product-tile').count();
  check(`[${c}] 모바일 필터: 포켓몬·박스·한국어판 → 1개`, tiles === 1, `(${tiles}) ${page.url()}`);
  await page.locator('.product-tile-name a').first().click();
  await page.waitForURL(/products\//);
  const contents = await page.locator('.buy-panel-facts').textContent();
  const shipping = await page.locator('.buy-panel-shipping').textContent();
  check(`[${c}] 상품 상세: 구성·배송비 표시`, /팩 30개/.test(contents ?? '') && /배송비/.test(shipping ?? ''));
  const bar = page.locator('.mobile-buy-bar');
  check(`[${c}] 모바일 구매 바 표시·가격 반영`, await bar.isVisible() && /45,000원/.test((await bar.textContent()) ?? ''));
  await bar.getByRole('button', { name: '담기' }).click();
  await page.waitForSelector('.toast');
  await page.goto(`${BASE}/concepts/${c}/cart`);
  const cartText = await page.locator('.cart-summary').textContent();
  check(`[${c}] 장바구니: 담김·배송비 무료 (50,000원 미만이면 3,000원)`, /45,000원/.test(cartText ?? '') && /3,000원/.test(cartText ?? ''), cartText?.replace(/\s+/g, ' ').slice(0, 80));
  // 되돌리기
  await page.getByRole('button', { name: '삭제' }).first().click();
  check(`[${c}] 장바구니 삭제 되돌리기 제공`, await page.getByRole('button', { name: '되돌리기' }).isVisible());
  await page.getByRole('button', { name: '되돌리기' }).click();
  check(`[${c}] 되돌리기 후 복구`, (await page.locator('.cart-line').count()) === 1);
  // 뒤로 가기 → 필터 상태 복원
  await page.goBack(); await page.goBack();
  await page.waitForURL(/shop\?/);
  await page.waitForFunction(() => document.querySelectorAll('.product-tile').length === 1, null, { timeout: 5000 }).catch(() => {});
  check(`[${c}] 뒤로 가기: 필터 URL 복원`, /category=box/.test(page.url()) && (await page.locator('.product-tile').count()) === 1);

  // 과제 2: 세트에서 카드 번호로 아트 버전 확인 후 목록 복귀
  await page.goto(`${BASE}/concepts/${c}/sets/smp-pk1-ko`);
  await page.locator('.card-filters input[type=search]').fill('084');
  await page.waitForTimeout(150);
  const n = await page.locator('.set-cards-section .card-tile').count();
  check(`[${c}] 세트: 번호 084 필터 → 1장`, n === 1);
  await page.locator('.set-cards-section .card-tile-name a').first().click();
  await page.waitForURL(/cards\/smp-pk1-ko-084/);
  const info = await page.locator('.card-detail-info').textContent();
  check(`[${c}] 카드 상세: 판본(얼터너티브 아트·텍스처)·번호 표시`, /얼터너티브 아트/.test(info ?? '') && /084\/080/.test(info ?? ''));
  // 과제 3: 단품 판매와 랜덤 팩 구매 구분
  check(`[${c}] 카드 상세: 단품 판매 없음·세트 상품은 확정 구성 아님 안내`, /싱글카드를 판매하지 않아요/.test(info ?? '') && (await page.locator('.card-detail .section-title').textContent())?.includes('확정 구성 아님') === true);
  check(`[${c}] 카드 상세: ODDLYS 장바구니로 가는 '이 카드 구매' 버튼 없음`, (await page.locator('.card-detail-info button:has-text("구매")').count()) === 0);
  await page.goBack();
  await page.waitForURL(/sets\/smp-pk1-ko\?cq=084/);
  check(`[${c}] 카드 목록 복귀: 필터 상태 유지`, (await page.locator('.set-cards-section .card-tile').count()) === 1);

  // 과제 8: 품절 상품 → 세트 도감 계속 접근
  await page.goto(`${BASE}/concepts/${c}/products/pokemon-night-sea-high-class-pack-ko`);
  const soldBtn = page.locator('.buy-panel .btn-secondary');
  check(`[${c}] 품절: 담기 비활성`, await soldBtn.isDisabled());
  check(`[${c}] 품절: 세트 링크 유지`, (await page.locator('a[href$="/sets/smp-pk2-ko"]').count()) > 0);

  // 옵션 상품: 옵션 미선택 시 안내
  await page.goto(`${BASE}/concepts/${c}/products/card-sleeve-standard-100`);
  await page.locator('.mobile-buy-bar').getByRole('button', { name: '담기' }).click();
  check(`[${c}] 옵션 미선택 담기 → 안내 토스트`, /옵션을 먼저/.test((await page.locator('.toast').first().textContent()) ?? ''));
  // 품절 옵션 비활성
  check(`[${c}] 품절 옵션(매트 블랙) 비활성`, await page.locator('.sku-option.is-soldout input').isDisabled());
  // 검색 없음 상태
  await page.goto(`${BASE}/concepts/${c}/search?q=zzzz`);
  check(`[${c}] 검색 없음: 회복 경로 제공`, (await page.locator('.empty-state .btn').count()) >= 2);
  check(`[${c}] 페이지 오류 없음`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 과제 7 일부: 키보드만으로 검색→상품→담기 (데스크톱, 방향 A)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ko-KR' });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/concepts/a`);
  await page.locator('#search-md').focus();
  await page.keyboard.type('부스터 박스');
  await page.keyboard.press('Enter');
  await page.waitForURL(/search\?q=/);
  await page.waitForSelector('.product-tile-name a');
  const first = page.locator('.product-tile-name a').first();
  await first.focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(/products\//);
  const addBtn = page.getByRole('button', { name: '장바구니에 담기' });
  await addBtn.focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('.toast');
  check(`[a] 키보드: 검색→결과→상품→담기`, /담았어요/.test((await page.locator('.toast').first().textContent()) ?? ''));
  // 필터 시트 포커스: 열기/닫기 후 포커스 복귀
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/concepts/a/shop`);
  const opener = page.getByRole('button', { name: /필터/ });
  await opener.focus(); await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  check(`[a] 필터 시트: Esc 닫기 후 포커스 복귀`, await opener.evaluate((el) => document.activeElement === el));
  await ctx.close();
}
await browser.close();
const fails = results.filter((r) => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} passed`);
process.exit(fails.length ? 1 : 0);
