/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import axios from 'axios';
// import * as cheerio from 'cheerio';
// scrapers/amazon.scraper.ts
import { chromium, Browser, Page } from 'playwright';

// A more robust scraper for Amazon search results
export async function scrapeAmazon(query: string) {
    let browser: Browser | null = null;
    try {
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const context = await browser.newContext({
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 },
            locale: 'en-US',
        });

        const page: Page = await context.newPage();

        // Navigate to Amazon search page
        await page.goto(`https://www.amazon.com/s?k=${encodeURIComponent(query)}`, {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
        });

        // Wait for search results to load
        await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 20000 });

        // Scroll to load more results
        await autoScroll(page);

        const products = await page.$$eval(
            '[data-component-type="s-search-result"]',
            (items) =>
                items
                    .map((item) => {
                        const titleElement = item.querySelector('h2 a span');
                        const title = titleElement?.textContent?.trim();

                        const priceElement = item.querySelector('.a-price .a-offscreen');
                        const price = priceElement?.textContent?.replace(/[^0-9.]/g, '');

                        const imageElement = item.querySelector('img.s-image');
                        const image = imageElement?.getAttribute('src');

                        const linkElement = item.querySelector('h2 a');
                        const href = linkElement?.getAttribute('href');

                        const ratingElement = item.querySelector('.a-icon-star-small span.a-icon-alt');
                        const rating = ratingElement?.textContent?.split(' ')[0];

                        const reviewsElement = item.querySelector('.a-size-small .a-link-normal');
                        const reviews = reviewsElement?.textContent?.replace(/[^0-9]/g, '');

                        if (!title || !price || !href) {
                            return null;
                        }

                        return {
                            platform: 'amazon',
                            title,
                            price: parseFloat(price),
                            images: image ? [image] : [],
                            url: `https://www.amazon.com${href}`,
                            rating: rating ? parseFloat(rating) : null,
                            reviews: reviews ? parseInt(reviews, 10) : null,
                        };
                    })
                    .filter((p): p is NonNullable<typeof p> => p !== null)
                    .slice(0, 10), // Increased to 10 results
        );

        console.log('Amazon Search Results:', products);
        return products;
    } catch (error) {
        console.error('Error scraping Amazon:', error);
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Helper function for auto-scrolling
async function autoScroll(page: Page) {
    await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

