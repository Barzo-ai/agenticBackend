/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// queue/scraping.worker.ts
// import { Worker } from 'bullmq';
// import { scrapeJumia } from '../scrapers/jumia.scraper';
// import { scrapeKonga } from '../scrapers/konga.scraper';
// // import { searchAmazon } from '../scrapers/amazon.service';

// export const scrapingWorker = new Worker(
//   'scraping2',
//   async job => {
//     const { query } = job.data;

//     console.log(`Scraping ${query}`);
//     const jumia = await scrapeJumia(query);
//     console.log("Jumia Search: ", jumia);

//     const konga = await scrapeKonga(query);
//     console.log("Konga Search: ", konga);

//     return [
//       ...(jumia),
//       ...(konga)
//     //   ...(await searchAmazon(query))
//     ];
//   },
//   { connection: { host: 'localhost', port: 6379 } }
// );
