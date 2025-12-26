/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import * as cheerio from 'cheerio';
// scrapers/amazon.scraper.ts
import { chromium } from 'playwright';

export async function scrapeAmazon1(query: string) {
    try {
        const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                    '(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',

                'Accept':
                    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',

                'Accept-Language': 'en-US,en;q=0.9',

                'Accept-Encoding': 'gzip, deflate, br',

                'Connection': 'keep-alive',

                'Upgrade-Insecure-Requests': '1',

                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',

                'Cache-Control': 'max-age=0',
            },
            timeout: 15000,
            validateStatus: status => status < 500 || status === 503,
        });

        if (data.includes('captcha')) {
            throw new Error('Amazon CAPTCHA detected');
        }

        const $ = cheerio.load(data);

        const $debug = cheerio.load(data);
        console.log('Page title:', $debug);

        const products: any[] = [];

        $('[data-component-type="s-search-result"]').each((_, el) => {
            const title = $(el).find('h2 span').text().trim();
            const priceWhole = $(el).find('.a-price-whole').first().text();
            const priceFraction = $(el).find('.a-price-fraction').first().text();
            const image = $(el).find('img').attr('src');
            const href = $(el).find('h2 a').attr('href');

            if (!title || !priceWhole || !href) return;

            products.push({
                platform: 'amazon',
                title,
                price: `${priceWhole}${priceFraction}`,
                images: [image],
                url: `https://www.amazon.com${href}`,
            });
        });

        console.log('Amazon Search: ', products);

        return products.slice(0, 5);
    } catch (e) {
        console.log('Amazon Search: ', e);
    }
}



export async function scrapeAmazon(query: string) {
    const browser = await chromium.launch({
        headless: true,
    });

    const context = await browser.newContext({
        userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1366, height: 768 },
        locale: 'en-US',
    });

    const page = await context.newPage();

    const count = await page.evaluate(() => {
        return document.querySelectorAll('*').length;
    });

    console.log('DOM node count:', count);

    await page.goto(
        `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
        { waitUntil: 'domcontentloaded' }
    );

    // Allow JS rendering
    await page.waitForTimeout(4000);

    // Scroll to trigger lazy loading
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(2000);

    await page.waitForSelector('div.s-result-item', { timeout: 15000 });

    const products = await page.$$eval(
        'div.s-result-item',
        items =>
            items
                .map(item => {
                    const title = item.querySelector('h2 span')?.textContent?.trim();
                    const priceWhole = item.querySelector('.a-price-whole')?.textContent;
                    const priceFraction =
                        item.querySelector('.a-price-fraction')?.textContent || '00';
                    const image =
                        item.querySelector('img.s-image')?.getAttribute('src');
                    const href = item.querySelector('h2 a')?.getAttribute('href');

                    if (!title || !priceWhole || !href) return null;

                    return {
                        platform: 'amazon',
                        title,
                        price: `${priceWhole}${priceFraction}`,
                        images: [image],
                        url: `https://www.amazon.com${href}`,
                    };
                })
                .filter(Boolean)
                .slice(0, 5),
    );

    console.log('Amazon Search: ', products);

    await browser.close();
    return products;
}

