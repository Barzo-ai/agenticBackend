/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { AiService } from 'src/ai/ai.service';
import { normalize } from 'src/utils/normalizer';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class ProductsService {

    private queueEvents: QueueEvents;
    private queueEvents2: QueueEvents;

    constructor(
        private readonly aiService: AiService,
        @InjectQueue('scraping') private readonly queue: Queue,
        @InjectQueue('scraping2') private readonly scrapingQueue2: Queue,
        private readonly configService: ConfigService,
    ) {
        this.queueEvents = new QueueEvents('scraping', {
            connection: {
                url: this.configService.get<string>('REDIS_URL'),
            },
        });

        // Events for second queue
        this.queueEvents2 = new QueueEvents('scraping2', {
            connection: {
                url: this.configService.get<string>('REDIS_URL'),

            },
        });
    }

    async compare(query: string) {
        const job = await this.scrapingQueue2.add('compare', { query });

        const raw = await job.waitUntilFinished(this.queueEvents);

        const normalized = normalize(raw);

        return normalized;
        return this.aiService.matchAndExplain(normalized);
    }

    async search(query: string) {
        try {
            const job = await this.queue.add('search', { query });

            // Wait for worker result
            const result = await job.waitUntilFinished(this.queueEvents, 60000);

            // Normalize raw scraper output
            const normalized = normalize(result);

            // AI matching & explanation
            const explain = await this.aiService.matchAndExplain(normalized)
            // const explain = await Promise.race([
            //     this.aiService.matchAndExplain(normalized),
            //     new Promise(resolve =>
            //         setTimeout(() => resolve({
            //             productName: null,
            //             offers: [],
            //             recommendation: 'AI analysis timed out'
            //         }), 12000)
            //     )])


            return {
                products: normalized,
                explain,
            };
        } catch (e) {
            console.error('Search Result Error:', e);
            throw e;
        }
    }
}