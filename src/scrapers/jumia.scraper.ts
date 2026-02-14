/* eslint-disable prettier/prettier */
import { chromium } from 'playwright';

export async function scrapeJumia(query: string) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-blink-features=AutomationControlled'],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 768 },
  });

  const page = await context.newPage();

  try {
    await page.goto(
      `https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(query)}`,
      { waitUntil: 'domcontentloaded', timeout: 20000 }
    );

    // Wait for product cards
    await page.waitForSelector('article.prd', { timeout: 20000 });

    // Scroll to trigger lazy loading
    await page.evaluate(async () => {
      for (let i = 0; i < 4; i++) {
        window.scrollBy(0, window.innerHeight);
        await new Promise(res => setTimeout(res, 500));
      }
    });

    const products = await page.$$eval('article.prd', (cards) =>
      cards.slice(20).map((card) => {
        const title = card.querySelector('h3')?.textContent?.trim();
        const price = card.querySelector('.prc')?.textContent?.trim();
        const img =
          card.querySelector('img')?.getAttribute('data-src') ||
          card.querySelector('img')?.getAttribute('src');
        const url = card.querySelector('a')?.href;

        return {
          platform: 'jumia',
          title,
          price,
          images: img ? [img] : [],
          url: url || null,
        };
      })
    );

    console.log(`✅ Jumia: Found ${products.length} products`);
    return products;
  } catch (e) {
    console.error('❌ Jumia Search failed:', e);
    return [];
  } finally {
    await browser.close();
  }
}
