/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';


@Injectable()
export class KongaService {

    async scrapeKonga(query: string) {

        return [
            {
                source: 'AMAZON',
                title: `Apple iPhone 14 Pro`,
                price: 820000,
                image: 'https://amazon.com/image.jpg',
                url: 'https://amazon.com/product',
            },
        ];

        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(
            `https://www.konga.com/search?search=${encodeURIComponent(query)}`,
            { waitUntil: 'networkidle' }
        );

        const products = await page.$$eval('.product-block', items =>
            items.slice(0, 5).map(item => ({
                platform: 'konga',
                title: item.querySelector('.product-name')?.textContent?.trim(),
                price: item.querySelector('.product-price')?.textContent,
                images: [item.querySelector('img')?.src],
                url: item.querySelector('a')?.href
            }))
        );

        await browser.close();
        return products;
    }

}
