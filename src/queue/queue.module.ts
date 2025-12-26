/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ScrapersModule } from 'src/scrapers/scrapers.module';
import { WorkerService } from './worker/worker.service';

@Module({
    // providers: [scrapingWorker],
    imports: [ScrapersModule],
    providers: [WorkerService],
})
export class QueueModule {}
