/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { scrapeJumia } from 'src/scrapers/jumia.scraper';
// import { scrapeKonga } from 'src/scrapers/konga.scraper';
import { scrapeAmazon } from 'src/scrapers/amazon.scraper';
import { Worker } from 'bullmq';

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {

    private workers: Worker[] = [];

    async onModuleInit() {
        await this.startWorkers();
    }

    async onModuleDestroy() {
        await this.stopWorkers();
    }

    private async startWorkers() {
        console.log('Starting workers...');

        // Worker 1
        const worker1 = new Worker(
            'scraping',
            async (job) => {
                console.log('🟢 Worker 1 processing:', job.id);
                const { query } = job.data;

                const results = await Promise.allSettled<any[]>([
                    scrapeJumia(query),
                    // scrapeKonga(query),
                    scrapeAmazon(query),
                ]);

                const products = results.flatMap(result =>
                    result.status === 'fulfilled' ? result.value : [],
                );

                return products;
            },
            {
                connection: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                },
                concurrency: 2,
            }
        );

        // Worker 2
        const worker2 = new Worker(
            'scraping',
            async (job) => {
                console.log('🟡 Worker 2 processing:', job.id);
                const { query } = job.data;

                const results = await Promise.allSettled<any[]>([
                    scrapeJumia(query),
                    // scrapeKonga(query),
                    scrapeAmazon(query),
                ]);

                const products = results.flatMap(result =>
                    result.status === 'fulfilled' ? result.value : [],
                );

                return products;
            },
            {
                connection: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                },
                concurrency: 2,
            }
        );

        this.workers.push(worker1, worker2);

        // Set up event listeners
        this.workers.forEach((worker, index) => {
            worker.on('ready', () => {
                console.log(`✅ Worker ${index + 1} ready`);
            });

            worker.on('failed', (job, err) => {
                console.log(`❌ Worker ${index + 1} job failed:`, job?.id, err.message);
            });
        });
    }

    private async stopWorkers() {
        console.log('Stopping workers...');
        await Promise.all(this.workers.map(worker => worker.close()));
    }
}
