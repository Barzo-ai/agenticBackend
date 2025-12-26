/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';


@Injectable()
export class JumiaService {

    async scrapeJumia(query: string) {

        return [
            {
                source: 'JUMIA',
                title: `iPhone 14 Pro - ${query}`,
                price: 850000,
                image: 'https://jumia.com/image.jpg',
                url: 'https://jumia.com/product',
            },
        ];

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

        await browser.close();
        return products;
    }

}
