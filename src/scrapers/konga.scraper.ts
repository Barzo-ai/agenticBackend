/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

// scrapers/konga.scraper.ts
import { chromium } from 'playwright';
// import stealth from 'playwright-stealth';

export async function scrapeKonga(query: string) {

    const browser = await chromium.launch({
        headless: true,
    });

    const context = await browser.newContext({
        userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1366, height: 768 },
    });

    const page = await context.newPage();

    try {
        // 👇 APPLY STEALTH
        // await stealth(page);

        await page.goto(
            `https://www.konga.com/search?search=${encodeURIComponent(query)}`,
            { waitUntil: 'domcontentloaded' } // 👈 IMPORTANT
        );

        await page.waitForTimeout(3000);

        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
        });

        // 👇 wait for products to render
        await page.waitForSelector('.product-block', { timeout: 15000 });

        const products = await page.$$eval(
            'a[href^="/product"], div[data-testid="product-card"]',
            items =>
                items.slice(0, 5).map(item => ({
                    platform: 'konga',
                    title:
                        item.querySelector('h3, .product-name')?.textContent?.trim() || '',
                    price:
                        item.querySelector('[class*="price"]')?.textContent?.trim() || '',
                    images: [
                        item.querySelector('img')?.getAttribute('data-src') ||
                        item.querySelector('img')?.src ||
                        '',
                    ],
                    url: item.getAttribute('href') || '',
                })),
        );

        // Extract products with Konga-specific class names
        // const products = await page.$$eval('._7e903, ._4941f, .product-card', (cards) => {
        //     return cards.map((card) => {
        //         return {
        //             name: card.querySelector('h2, h3, .product-name, .title')?.innerText?.trim() || '',
        //             price: card.querySelector('span[class*="price"], .amount, .selling-price')?.innerText?.trim() || '',
        //             originalPrice: card.querySelector('.original-price, .old-price, del')?.innerText?.trim() || '',
        //             rating: card.querySelector('.rating, .stars, [class*="rating"]')?.innerText?.trim() || '',
        //             link: card.querySelector('a')?.href || '',
        //             image: card.querySelector('img')?.src || ''
        //         };
        //     });
        // });

        console.log(`Found ${products.length} products for "${query}"`);

        console.log('✅ Konga Search:', products.length);

        return products;
    } catch (e) {
        console.error('❌ Konga Search failed:', e);
        return [];
    } finally {
        await browser.close();
    }
}