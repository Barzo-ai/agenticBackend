/* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Worker } from 'bullmq';
// import { scrapeJumia } from 'src/scrapers/jumia.scraper';
// import { scrapeKonga } from 'src/scrapers/konga.scraper';
// // import { JumiaService } from 'src/scrapers/jumia/jumia.service';
// // import { KongaService } from 'src/scrapers/konga/konga.service';
// // import { scrapeAmazon } from './scrapers/amazon.scraper';

// console.log('🚀 Worker script loaded and listening on queue: scraping');


// const worker = new Worker(
//   'scraping',
//   async (job) => {
//      console.log('🟢 Job received:', job.id, job.data);
//     const { query } = job.data;

//     const [jumia, konga,] = await Promise.allSettled([
//       scrapeJumia(query),
//       scrapeKonga(query),
//     //   scrapeAmazon(query),
//     ]);

//     return [
//       ...(jumia.status === 'fulfilled' ? jumia.value : []),
//       ...(konga.status === 'fulfilled' ? konga.value : []),
//     //   ...(amazon.status === 'fulfilled' ? amazon.value : []),
//     ];
//   },
//   {
//     connection: {
//       host: 'localhost',
//       port: 6379,
//     },
//   },
// );

// worker.on('active', (job) => {
//   console.log(`🔵 Job ${job.id} (${job.name}) is now active`);
// });

// worker.on('progress', (job, progress) => {
//   console.log(`📊 Job ${job.id} progress: ${progress}`);
// });

// worker.on('completed', (job, result) => {
//   console.log(`✅ Job ${job.id} (${job.name}) completed:`, result?.length || 0, 'products found');
// });


// worker.on('failed', (job, err) => {
//   console.log('❌ Job failed:', err);
// });