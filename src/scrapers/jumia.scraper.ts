/* eslint-disable prettier/prettier */
// scrapers/jumia.scraper.ts
import { chromium } from 'playwright';

export async function scrapeJumia(query: string) {

    try {

        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(
            `https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(query)}`,
            { waitUntil: 'networkidle' }
        );

        const products = await page.$$eval('article.prd', cards =>
            cards.slice(0, 5).map(card => ({
                platform: 'jumia',
                title: card.querySelector('h3')?.textContent?.trim(),
                price: card.querySelector('.prc')?.textContent,
                images: [
                    card.querySelector('img')?.getAttribute('data-src') ||
                    card.querySelector('img')?.src
                ],
                url: card.querySelector('a')?.href
            }))
        );

        console.log('Jumia Search: ', products);

        await browser.close();
        return products;
    } catch (e) {
        console.log('Jumia Search: ', e);
    }
}
