/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeEbay(query: string) {
  const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
    query,
  )}`;

  const { data } = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    },
    timeout: 15000,
  });

  const $ = cheerio.load(data);
  const products: any[] = [];

  $('.s-item').each((_, el) => {
    const title = $(el).find('.s-item__title').text().trim();
    const price = $(el).find('.s-item__price').text().trim();
    const image = $(el).find('.s-item__image-img').attr('src');
    const url = $(el).find('.s-item__link').attr('href');

    // Skip ads / placeholders
    if (!title || title === 'Shop on eBay' || !price || !url) return;


    products.push({
      platform: 'ebay',
      title,
      price,
      images: image ? [image] : [],
      url,
    });
  });

   console.log('Ebay Search: ', products);

  return products.slice(0, 5);
}
