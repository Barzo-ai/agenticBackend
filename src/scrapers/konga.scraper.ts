/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { chromium, BrowserContext } from 'playwright';

export async function scrapeKonga(query: string) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled'], // helps bypass headless detection
  });

  const context: BrowserContext = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 768 },
  });

  const page = await context.newPage();

  try {
    // Load page quickly
    await page.goto(
      `https://www.konga.com/search?search=${encodeURIComponent(query)}`,
      { waitUntil: 'domcontentloaded' } // faster than networkidle
    );

    // Wait for products container
    await page.waitForSelector('li.List_listItem__KlvU2', { timeout: 20000 });

    // Scroll slowly to trigger lazy loading of images/products
    await page.evaluate(async () => {
      for (let i = 0; i < 5; i++) {
        window.scrollBy(0, window.innerHeight);
        await new Promise((res) => setTimeout(res, 500));
      }
    });

    // Extract products
    const products = await page.$$eval('li.List_listItem__KlvU2', (items) =>
      items.slice(0, 20).map((item) => {
        const title =
          item.querySelector('h3.ListingCard_productTitle__9Kzxv')?.textContent?.trim();
        const price =
          item.querySelector('span.shared_price__gnso_')?.textContent?.trim();
        const url = item.querySelector('a[href^="/product"]')?.getAttribute('href');
        const image = item.querySelector('img')?.getAttribute('src');
        const seller =
          item.querySelector('span.ListingCard_soldBy__shCRn a')?.textContent?.trim();

        return {
          platform: 'konga',
          title,
          price,
          images: image ? [image] : [],
          url: url ? `https://www.konga.com${url}` : null,
          seller: seller || null,
        };
      })
    );

    console.log(`✅ Found ${products.length} products for "${query}"`);
    console.log(`✅ Found: ` , products);

    return products;
  } catch (err) {
    console.error('❌ Konga Search failed:', err);
    return [];
  } finally {
    await browser.close();
  }
}
